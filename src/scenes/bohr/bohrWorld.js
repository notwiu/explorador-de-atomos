import * as THREE from 'three'
import { animate } from 'framer-motion'
import { clamp, smooth, lerp, mulberry32, makeLabel, setLabel, makeGlow, disposeTree } from '../../three/helpers.js'

// Mundo 3D da cena do Bohr (átomo de hidrogênio).
//
//   passo 0: o modelo de Rutherford: o elétron cairia no núcleo, e as cores da luz?
//   passo 1: camadas de energia: o elétron só pode estar numa camada
//   passo 2: ao absorver energia (luz), o elétron salta para uma camada mais externa
//   passo 3: ao voltar, devolve a energia em forma de luz
//   passo 4: a cor depende do salto (o espectro do hidrogênio vai se formando)
//   passo 5: fogos de artifício e neon: cada elemento tem suas cores
//   passo 6: o modelo de Bohr
//   passo 7: o que o modelo não explicava
//   passo 8: brincar (clicar numa camada ou nível para mover o elétron)
//
// Números usados: no hidrogênio, a luz visível vem das quedas até a camada 2:
//   3 → 2 vermelha (656 nm), 4 → 2 azul-esverdeada (486 nm), 5 → 2 azul (434 nm), 6 → 2 violeta (410 nm).
// Saltos que terminam na camada 1 emitem ultravioleta, e os que terminam na 3 ou acima, infravermelho
// (ambos invisíveis).

export const STEP_COUNT = 9

const PLAY_STEP = 8
const LEVELS = 6
const TILT = 1.0 // inclinação do átomo, para enxergar as camadas em perspectiva
const RUTHERFORD_R = 2.5
const LADDER_X = 4.7
const CAMERA_AZIMUTH = 0.45
const BOUND_Y = 3.1

const C = { coral: '#ff7a6b', cyan: '#7ee7ff', pale: '#cfd6ff' }

// Distância da camada n ao núcleo e altura do nível n na escada (desenhos fora de escala)
export const radiusOf = (n) => 0.6 + 0.45 * (n - 1)
export const ladderY = (n) => -2.4 + 4.8 * (1 - 1 / n)

// Luz visível do hidrogênio (série de Balmer): salto de `hi` até a camada 2
const BALMER = {
  3: { color: '#ff5a5a', name: 'vermelha', nm: 656, line: 3 },
  4: { color: '#7ee7ff', name: 'azul-esverdeada', nm: 486, line: 2 },
  5: { color: '#6b8bff', name: 'azul', nm: 434, line: 1 },
  6: { color: '#b36bff', name: 'violeta', nm: 410, line: 0 },
}
const SPECTRUM = { x: 0.9, y: -3.05, width: 5.0 }
const lineX = (nm) => SPECTRUM.x - SPECTRUM.width / 2 + (SPECTRUM.width * (nm - 400)) / 300

// Descreve a luz de um salto entre as camadas `lo` (baixa) e `hi` (alta)
export function photonInfo(lo, hi) {
  if (lo === 2 && BALMER[hi]) {
    const b = BALMER[hi]
    return { visible: true, color: b.color, text: `luz ${b.name}`, line: b.line }
  }
  return {
    visible: false,
    color: C.pale,
    text: lo === 1 ? 'luz invisível (ultravioleta)' : 'luz invisível (infravermelho)',
    line: -1,
  }
}

const ELEMENTS = [
  { text: 'Sódio: amarelo', color: '#ffd23f' },
  { text: 'Cobre: verde', color: '#4ade80' },
  { text: 'Estrôncio: vermelho', color: '#ff4d4d' },
  { text: 'Potássio: lilás', color: '#c084fc' },
]

const v = (x, y, z) => new THREE.Vector3(x, y, z)

// ---------- Parâmetros de cada passo ----------

const P0 = {
  atom: 0, // núcleo e elétron
  rutherford: 0, // órbita simples do modelo de Rutherford
  fall: 0, // elétron caindo no núcleo
  q: 0, // ponto de interrogação
  shells: 0, // quantas camadas aparecem (0 a 6)
  shellLabel: 0, // números das camadas
  shellTitle: 0, // "Camadas (níveis de energia)"
  nuLabel: 0, // "Núcleo (+)"
  ladder: 0, // escada de energia
  spectrum: 0, // espectro do hidrogênio
  info: 0, // texto do salto
  fw: 0, // fogos de artifício
  more: 0, // mais elétrons (limitação)
  cloud: 0, // nuvem difusa (limitação)
  hint: 0, // dica de clique
  camX: 0, // deslocamento lateral da câmera
}

const STEP_PARAMS = [
  { atom: 1, rutherford: 1, fall: 1, q: 1, nuLabel: 1 },
  { atom: 1, shells: 6, shellLabel: 1, shellTitle: 1, ladder: 1, camX: 1 },
  { atom: 1, shells: 6, shellLabel: 1, ladder: 1, info: 1, camX: 1 },
  { atom: 1, shells: 6, shellLabel: 1, ladder: 1, info: 1, camX: 1 },
  { atom: 1, shells: 6, shellLabel: 1, ladder: 1, spectrum: 1, info: 1, camX: 1 },
  { fw: 1 },
  { atom: 1, shells: 6, shellLabel: 1, shellTitle: 1, nuLabel: 1, ladder: 1, camX: 1 },
  { atom: 1, shells: 6, shellLabel: 1, more: 1, cloud: 1, q: 1 },
  { atom: 1, shells: 6, shellLabel: 1, ladder: 1, spectrum: 1, info: 1, hint: 1, camX: 1 },
]

const WINDOW = {
  atom: [0, 0.6],
  rutherford: [0.1, 0.9],
  shells: [0.1, 0.95],
  fall: [0.1, 0.8],
  ladder: [0.3, 1],
  spectrum: [0.3, 1],
  info: [0.3, 1],
  more: [0.2, 1],
  cloud: [0.2, 1],
  fw: [0.2, 1],
}

const paramsFor = (step) => ({ ...P0, ...STEP_PARAMS[step] })

// Nível em que o elétron começa cada passo
const START_LEVEL = [2, 2, 2, 5, 2, 2, 2, 2, 2]

// Sequência de saltos do passo 4: cada salto de ida e volta mostra uma cor
const CYCLE = [3, 4, 5, 6]

// ---------- O mundo ----------

export function createBohrWorld(stage, { reduced = false } = {}) {
  const { scene, camera, controls, host } = stage
  const light = stage.light
  const seg = light ? 18 : 30

  const root = new THREE.Group()
  scene.add(root)
  const sphereGeo = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7))

  // ----- Átomo (inclinado para mostrar a profundidade) -----
  const atom = new THREE.Group()
  atom.rotation.x = TILT
  root.add(atom)

  const nucleusMat = new THREE.MeshBasicMaterial({ color: '#ffd9d2', transparent: true })
  const nucleus = new THREE.Mesh(sphereGeo, nucleusMat)
  atom.add(nucleus)
  const nucleusGlow = makeGlow('rgba(255,122,107,1)', 1.8)
  atom.add(nucleusGlow)

  // anel simples do modelo de Rutherford
  const rutherfordGeo = new THREE.TorusGeometry(RUTHERFORD_R, 0.014, 6, 100)
  rutherfordGeo.rotateX(Math.PI / 2)
  const rutherfordMat = new THREE.MeshBasicMaterial({ color: C.coral, transparent: true, opacity: 0, depthWrite: false })
  const rutherfordRing = new THREE.Mesh(rutherfordGeo, rutherfordMat)
  atom.add(rutherfordRing)

  // camadas (anéis), áreas de clique invisíveis e números
  const shells = Array.from({ length: LEVELS }, (_, i) => {
    const n = i + 1
    const r = radiusOf(n)
    const ringGeo = new THREE.TorusGeometry(r, 0.02, 6, 120)
    ringGeo.rotateX(Math.PI / 2)
    const mat = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0, depthWrite: false })
    const ring = new THREE.Mesh(ringGeo, mat)
    const hitGeo = new THREE.TorusGeometry(r, 0.17, 6, 64)
    hitGeo.rotateX(Math.PI / 2)
    const hit = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }))
    hit.userData.n = n
    const label = makeLabel({ text: String(n), color: C.cyan, size: [0.8, 0.55] })
    label.position.set(r * Math.cos(0.35), 0, r * Math.sin(0.35))
    atom.add(ring, hit, label)
    return { n, ring, mat, hit, label }
  })

  // elétron principal e elétrons extras (passo 7)
  const makeElectron = () => {
    const mat = new THREE.MeshStandardMaterial({ color: C.cyan, emissive: new THREE.Color(C.cyan), emissiveIntensity: 0.8, roughness: 0.3, transparent: true })
    const mesh = new THREE.Mesh(sphereGeo, mat)
    mesh.scale.setScalar(0.12)
    const glow = makeGlow('rgba(126,231,255,1)', 0.8)
    atom.add(mesh, glow)
    return { mesh, mat, glow, angle: 0 }
  }
  const electron = makeElectron()
  const extras = [makeElectron(), makeElectron()]
  extras[0].angle = 0.5
  extras[1].angle = 0.5 + Math.PI

  // nuvem difusa (passo 7): o elétron "como onda"
  const cloudRnd = mulberry32(9)
  const CLOUD_N = light ? 220 : 480
  const cloudPos = new Float32Array(CLOUD_N * 3)
  for (let i = 0; i < CLOUD_N; i++) {
    const shell = i % 2 === 0 ? 2 : 3
    const r = radiusOf(shell) + (cloudRnd() + cloudRnd() + cloudRnd() - 1.5) * 0.32
    const u = cloudRnd() * 2 - 1
    const a = cloudRnd() * Math.PI * 2
    const s = Math.sqrt(1 - u * u)
    cloudPos[i * 3] = r * s * Math.cos(a)
    cloudPos[i * 3 + 1] = r * u
    cloudPos[i * 3 + 2] = r * s * Math.sin(a)
  }
  const cloudGeo = new THREE.BufferGeometry()
  cloudGeo.setAttribute('position', new THREE.BufferAttribute(cloudPos, 3))
  const cloudMat = new THREE.PointsMaterial({ color: C.cyan, size: 0.07, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const cloud = new THREE.Points(cloudGeo, cloudMat)
  atom.add(cloud)

  // ----- Escada de energia -----
  const ladder = new THREE.Group()
  ladder.position.x = LADDER_X
  root.add(ladder)
  const levelLines = Array.from({ length: LEVELS }, (_, i) => {
    const n = i + 1
    const mat = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0 })
    const line = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.05), mat)
    line.position.y = ladderY(n)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.4, 0.4), new THREE.MeshBasicMaterial({ visible: false }))
    hit.position.set(0.55, ladderY(n), 0)
    hit.userData.n = n
    const label = makeLabel({ text: `n = ${n}`, color: C.cyan, size: [1.3, 0.5] })
    label.position.set(1.25, ladderY(n), 0)
    ladder.add(line, hit, label)
    return { n, mat, line, hit, label }
  })
  const marker = makeGlow('rgba(126,231,255,1)', 0.9)
  ladder.add(marker)
  const markerDot = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true }))
  markerDot.scale.setScalar(0.09)
  ladder.add(markerDot)
  const arrowGeo = new THREE.BufferGeometry().setFromPoints([v(0.95, 0, 0), v(0.95, 1, 0)])
  const arrowMat = new THREE.LineBasicMaterial({ color: C.cyan, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const arrow = new THREE.Line(arrowGeo, arrowMat)
  ladder.add(arrow)
  const ladderTitle = makeLabel({ text: 'Energia', color: '#ffffff', size: [1.8, 0.55] })
  ladderTitle.position.set(0.2, 2.95, 0)
  ladder.add(ladderTitle)

  // ----- Espectro do hidrogênio -----
  const spectrum = new THREE.Group()
  spectrum.position.set(SPECTRUM.x, SPECTRUM.y, 0)
  root.add(spectrum)
  const specBackMat = new THREE.MeshBasicMaterial({ color: '#04061a', transparent: true, opacity: 0 })
  const specBack = new THREE.Mesh(new THREE.BoxGeometry(SPECTRUM.width + 0.4, 0.55, 0.04), specBackMat)
  spectrum.add(specBack)
  const specLines = Object.values(BALMER)
    .sort((a, b) => a.line - b.line)
    .map((b) => {
      const mat = new THREE.MeshBasicMaterial({ color: b.color, transparent: true, opacity: 0 })
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.5, 0.05), mat)
      mesh.position.set(lineX(b.nm) - SPECTRUM.x, 0, 0.04)
      spectrum.add(mesh)
      return { mat, mesh, seen: false, glow: 0 }
    })
  const specLabel = makeLabel({ text: 'Espectro do hidrogênio (luz visível)', color: '#ffffff', size: [5.4, 0.5] })
  specLabel.position.set(0, 0.5, 0)
  spectrum.add(specLabel)

  // ----- Textos 3D -----
  const place = (label, x, y) => {
    label.position.set(x, y, 0)
    root.add(label)
    return label
  }
  const rutherfordLabel = place(makeLabel({ text: 'Modelo de Rutherford', color: C.coral, size: [5.6, 0.75] }), 0, -3.0)
  const qLabel = place(makeLabel({ text: '?', color: '#ffffff', size: [1.2, 1.2] }), 0.9, 1.2)
  const nuLabel = place(makeLabel({ text: 'Núcleo (+)', color: '#ffd9d2', size: [3.0, 0.6] }), 0, 0.85)
  const shellTitle = place(makeLabel({ text: 'Camadas (níveis de energia)', color: C.cyan, size: [6.4, 0.62] }), -1.2, -3.0)
  const infoLabel = place(makeLabel({ text: '', color: '#ffffff', size: [5.8, 0.62] }), SPECTRUM.x, BOUND_Y)
  const hintLabel = place(makeLabel({ text: 'Clique numa camada ou num nível', color: '#ffffff', size: [6.2, 0.55] }), -1.2, 2.45)

  // ----- Fótons (ondas de luz) -----
  const WAVE_N = 36
  const waveLength = 1.5
  const photons = Array.from({ length: 6 }, () => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(WAVE_N * 3), 3))
    const mat = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    const line = new THREE.Line(geo, mat)
    line.frustumCulled = false
    line.visible = false
    const head = makeGlow('rgba(255,255,255,1)', 0.55)
    root.add(line, head)
    return { geo, mat, line, head, active: false, mode: 'out', pos: v(0, 0, 0), dir: v(1, 0, 0), age: 0, onArrive: null, info: null }
  })

  const flashes = Array.from({ length: 6 }, () => {
    const s = makeGlow('rgba(255,255,255,1)', 0.7)
    root.add(s)
    return { sprite: s, age: 1, active: false }
  })

  // ----- Fogos de artifício (passo 5) -----
  const BURST_N = light ? 70 : 150
  const bursts = Array.from({ length: 3 }, () => {
    const pos = new Float32Array(BURST_N * 3)
    const vel = new Float32Array(BURST_N * 3)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({ color: '#ffffff', size: 0.14, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    const points = new THREE.Points(geo, mat)
    points.frustumCulled = false
    points.visible = false
    root.add(points)
    return { pos, vel, geo, mat, points, active: false, age: 0 }
  })
  const rockets = Array.from({ length: 3 }, () => {
    const sprite = makeGlow('rgba(255,235,190,1)', 0.45)
    root.add(sprite)
    return { sprite, active: false, t: 0, x: 0, z: 0, y1: 0, element: ELEMENTS[0] }
  })
  const fwLabels = [0, 1].map(() => {
    const l = makeLabel({ text: '', color: '#ffffff', size: [4.8, 0.62] })
    root.add(l)
    return { sprite: l, age: 9, active: false }
  })

  // ----- Estado -----
  let step = 0
  let P = { ...P0 }
  let from = { ...P0 }
  let to = { ...P0 }
  let tween = null
  let interactive = false
  let userMoved = false
  let level = 2 // camada atual (inteira)
  let levelF = 2 // camada contínua (durante um salto)
  let jump = null
  let seq = [] // fila de ações
  let busy = null
  let cycleIndex = 0
  let hoverN = 0
  let fallClock = 0
  let fallPulsed = false
  let nucleusPulse = 0
  let fwTimer = 0
  let fwIndex = 0
  let arrowFade = 0
  let infoKey = ''
  let clock = 0
  const smallTweens = new Set()
  const rnd = mulberry32(33)

  const onStart = () => {
    userMoved = true
  }
  controls.addEventListener?.('start', onStart)

  const homePosition = (camX) => v(camX + Math.sin(CAMERA_AZIMUTH) * stage.home.z, stage.home.y, Math.cos(CAMERA_AZIMUTH) * stage.home.z)

  const tmp = v(0, 0, 0)
  function electronWorld(target = v(0, 0, 0)) {
    electron.mesh.updateWorldMatrix(true, false)
    return electron.mesh.getWorldPosition(target)
  }

  // ----- Textos de informação -----
  function setInfo(text, color) {
    const key = `${text}|${color}`
    if (key === infoKey) return
    infoKey = key
    setLabel(infoLabel, text, color)
  }

  // ----- Brilhos -----
  function flashAt(pos, color = '#ffffff', size = 0.7) {
    const f = flashes.find((x) => !x.active) ?? flashes[0]
    f.active = true
    f.age = 0
    f.size = size
    f.sprite.position.copy(pos)
    f.sprite.material.color.set(color)
    f.sprite.visible = true
  }

  // ----- Fótons -----
  function spawnPhoton({ mode, info, from: origin, dir, onArrive }) {
    const p = photons.find((x) => !x.active) ?? photons[0]
    p.active = true
    p.mode = mode
    p.age = 0
    p.info = info
    p.pos.copy(origin)
    p.dir.copy(dir ?? v(1, 0, 0)).normalize()
    p.onArrive = onArrive ?? null
    p.mat.color.set(info.color)
    p.head.material.color.set(info.color)
    p.line.visible = true
    p.head.visible = true
    return p
  }

  const camDir = v(0, 0, -1)
  function drawWave(p, t) {
    camera.getWorldDirection(camDir)
    const u = tmp.crossVectors(p.dir, camDir)
    if (u.lengthSq() < 1e-4) u.set(0, 1, 0)
    u.normalize()
    const arr = p.geo.attributes.position.array
    const amp = 0.14
    for (let i = 0; i < WAVE_N; i++) {
      const s = (i / (WAVE_N - 1)) * waveLength
      const env = Math.sin((Math.PI * i) / (WAVE_N - 1))
      const off = amp * env * Math.sin(s * 14 - t * 16)
      arr[i * 3] = p.pos.x - p.dir.x * s + u.x * off
      arr[i * 3 + 1] = p.pos.y - p.dir.y * s + u.y * off
      arr[i * 3 + 2] = p.pos.z - p.dir.z * s + u.z * off
    }
    p.geo.attributes.position.needsUpdate = true
  }

  function updatePhotons(dt, t) {
    for (const p of photons) {
      if (!p.active) continue
      p.age += dt
      let alpha = p.info.visible ? 1 : 0.45
      if (p.mode === 'in') {
        electronWorld(tmp)
        const toE = tmp.clone().sub(p.pos)
        const dist = toE.length()
        if (dist < 0.28) {
          p.active = false
          p.line.visible = false
          p.head.visible = false
          const cb = p.onArrive
          p.onArrive = null
          cb?.()
          continue
        }
        p.dir.copy(toE.normalize())
        p.pos.addScaledVector(p.dir, Math.min(dist, 5.5 * dt))
      } else {
        p.pos.addScaledVector(p.dir, 4.6 * dt)
        alpha *= clamp(1.9 - p.age, 0, 1)
        if (p.age > 1.9) {
          p.active = false
          p.line.visible = false
          p.head.visible = false
          continue
        }
      }
      p.mat.opacity = 0.9 * alpha
      p.head.material.opacity = alpha
      p.head.position.copy(p.pos)
      p.head.scale.setScalar(0.5 + 0.08 * Math.sin(t * 12))
      drawWave(p, t)
    }
    for (const f of flashes) {
      if (!f.active) continue
      f.age += dt / 0.7
      f.sprite.material.opacity = Math.max(0, 1 - f.age)
      f.sprite.scale.setScalar(f.size * (0.5 + f.age))
      if (f.age >= 1) {
        f.active = false
        f.sprite.visible = false
      }
    }
  }

  // ----- Saltos do elétron -----
  function setArrow(a, b, color) {
    const pos = arrowGeo.attributes.position
    pos.setXYZ(0, 0.95, ladderY(a), 0)
    pos.setXYZ(1, 0.95, ladderY(b), 0)
    pos.needsUpdate = true
    arrowMat.color.set(color)
    arrowFade = 1
  }

  function beginJump(toLevel, action) {
    jump = { from: levelF, to: toLevel, t: 0, dur: action.silent ? 0.9 : 0.95, silent: !!action.silent, action }
    if (!action.silent) {
      flashAt(electronWorld(v(0, 0, 0)), action.info.color, 0.9)
      setArrow(levelF, toLevel, action.info.color)
    }
  }

  function startAction(a) {
    busy = a
    if (a.type === 'wait') {
      a.t = 0
    } else if (a.type === 'move') {
      beginJump(a.to, { silent: true })
    } else if (a.type === 'up') {
      a.info = photonInfo(level, a.to)
      setInfo(`Absorve energia: salto ${level} → ${a.to} (${a.info.text})`, a.info.color)
      const origin = electronWorld(v(0, 0, 0)).add(v(-3.4, 2.6, 1.6))
      spawnPhoton({ mode: 'in', info: a.info, from: origin, onArrive: () => beginJump(a.to, a) })
    } else if (a.type === 'down') {
      a.info = photonInfo(a.to, level)
      setInfo(`Salto ${level} → ${a.to}: ${a.info.text}`, a.info.color)
      beginJump(a.to, a)
      // a luz sai na direção do elétron (para fora do núcleo), um pouco para cima
      electronWorld(tmp)
      const out = tmp.clone().normalize().add(v(0.35, 0.45, 0.2))
      spawnPhoton({ mode: 'out', info: a.info, from: tmp.clone(), dir: out })
      if (a.info.line >= 0) {
        specLines[a.info.line].seen = true
        specLines[a.info.line].glow = 1
      }
    }
  }

  function updateSequence(dt) {
    if (jump) {
      jump.t += dt / jump.dur
      const e = smooth(clamp(jump.t, 0, 1))
      levelF = lerp(jump.from, jump.to, e)
      if (jump.t >= 1) {
        level = jump.to
        levelF = jump.to
        if (!jump.silent) flashAt(electronWorld(v(0, 0, 0)), jump.action.info.color, 0.6)
        jump = null
        busy = null
      }
      return
    }
    if (busy && busy.type === 'wait') {
      busy.t += dt
      if (busy.t >= busy.dur) busy = null
      return
    }
    if (busy) return // esperando o fóton chegar
    if (seq.length) startAction(seq.shift())
  }

  // pede para o elétron ir até a camada n (com a luz correspondente)
  function requestLevel(n, { max = 2 } = {}) {
    const last = seq.length ? seq[seq.length - 1].target ?? level : busy?.to ?? level
    if (n === last || n < 1 || n > LEVELS || seq.length >= max) return false
    seq.push({ type: n > last ? 'up' : 'down', to: n, target: n })
    return true
  }

  function resetElectron(n) {
    seq = []
    busy = null
    jump = null
    level = levelF = n
    photons.forEach((p) => {
      p.active = false
      p.line.visible = false
      p.head.visible = false
    })
  }

  function resetSpectrum() {
    specLines.forEach((l) => {
      l.seen = false
      l.glow = 0
    })
  }

  // ----- Roteiro de cada passo -----
  function startScript(target) {
    if (target === 2) seq.push({ type: 'wait', dur: 0.5 }, { type: 'up', to: 5, target: 5 })
    else if (target === 3) seq.push({ type: 'wait', dur: 0.5 }, { type: 'down', to: 2, target: 2 })
    // o passo 4 repete os saltos sozinho (veja "autoCycle")
  }

  function autoCycle() {
    if (step !== 4 || P.spectrum < 0.6 || busy || seq.length || jump) return
    const hi = CYCLE[cycleIndex % CYCLE.length]
    cycleIndex += 1
    seq.push({ type: 'up', to: hi, target: hi }, { type: 'wait', dur: 0.5 }, { type: 'down', to: 2, target: 2 }, { type: 'wait', dur: 0.9 })
  }

  // ----- Fogos de artifício -----
  function launchRocket() {
    const r = rockets.find((x) => !x.active) ?? rockets[0]
    r.active = true
    r.t = 0
    r.x = (rnd() * 2 - 1) * 3.0
    r.z = (rnd() * 2 - 1) * 1.2
    r.y1 = 0.3 + rnd() * 1.6
    r.element = ELEMENTS[fwIndex % ELEMENTS.length]
    fwIndex += 1
    r.sprite.visible = true
  }

  function explode(r) {
    const b = bursts.find((x) => !x.active) ?? bursts[0]
    b.active = true
    b.age = 0
    b.mat.color.set(r.element.color)
    for (let i = 0; i < BURST_N; i++) {
      const u = rnd() * 2 - 1
      const a = rnd() * Math.PI * 2
      const s = Math.sqrt(1 - u * u)
      const sp = 1.2 + rnd() * 2.0
      b.pos[i * 3] = r.x
      b.pos[i * 3 + 1] = r.y1
      b.pos[i * 3 + 2] = r.z
      b.vel[i * 3] = s * Math.cos(a) * sp
      b.vel[i * 3 + 1] = u * sp
      b.vel[i * 3 + 2] = s * Math.sin(a) * sp
    }
    b.geo.attributes.position.needsUpdate = true
    b.points.visible = true
    const lab = fwLabels.find((l) => !l.active) ?? fwLabels[0]
    lab.active = true
    lab.age = 0
    setLabel(lab.sprite, r.element.text, r.element.color)
    lab.sprite.position.set(r.x, r.y1 + 1.5, r.z)
    flashAt(v(r.x, r.y1, r.z), r.element.color, 1.6)
  }

  function updateFireworks(dt) {
    fwTimer += dt
    if (P.fw > 0.6 && step === 5 && fwTimer > 1.7) {
      fwTimer = 0
      launchRocket()
    }
    for (const r of rockets) {
      if (!r.active) continue
      r.t += dt / 0.6
      const y = lerp(-3.0, r.y1, smooth(clamp(r.t, 0, 1)))
      r.sprite.position.set(r.x, y, r.z)
      r.sprite.material.opacity = P.fw
      if (r.t >= 1) {
        r.active = false
        r.sprite.visible = false
        explode(r)
      }
    }
    for (const b of bursts) {
      if (!b.active) continue
      b.age += dt
      for (let i = 0; i < BURST_N; i++) {
        b.vel[i * 3] *= 0.985
        b.vel[i * 3 + 1] = b.vel[i * 3 + 1] * 0.985 - 0.9 * dt
        b.vel[i * 3 + 2] *= 0.985
        b.pos[i * 3] += b.vel[i * 3] * dt
        b.pos[i * 3 + 1] += b.vel[i * 3 + 1] * dt
        b.pos[i * 3 + 2] += b.vel[i * 3 + 2] * dt
      }
      b.geo.attributes.position.needsUpdate = true
      b.mat.opacity = Math.max(0, 1 - b.age / 2.3) * P.fw
      if (b.age >= 2.3) {
        b.active = false
        b.points.visible = false
      }
    }
    for (const l of fwLabels) {
      if (!l.active) continue
      l.age += dt
      const o = clamp(Math.min(l.age / 0.3, (1.8 - l.age) / 0.4), 0, 1) * P.fw
      l.sprite.material.opacity = o
      l.sprite.visible = o > 0.01
      if (l.age > 1.8) {
        l.active = false
        l.sprite.visible = false
      }
    }
  }

  // ----- Transições -----
  function applyProgress(u) {
    for (const key of Object.keys(P0)) {
      const [w0, w1] = WINDOW[key] ?? [0, 1]
      const e = smooth(clamp((u - w0) / (w1 - w0), 0, 1))
      P[key] = from[key] + (to[key] - from[key]) * e
    }
  }

  function stopTween() {
    tween?.stop()
    tween = null
  }

  function smallTween(duration, onUpdate, onDone) {
    const tw = animate(0, 1, {
      duration: reduced ? 0.001 : duration,
      ease: [0.22, 0.8, 0.2, 1],
      onUpdate,
      onComplete: () => {
        smallTweens.delete(tw)
        onDone?.()
      },
    })
    smallTweens.add(tw)
    return tw
  }

  function setCursor(c) {
    const dom = stage.renderer?.domElement
    if (dom?.style) dom.style.cursor = c
  }

  function goTo(newStep, { immediate = false, replay = false } = {}) {
    stopTween()
    const target = clamp(newStep, 0, STEP_COUNT - 1)
    step = target
    interactive = false
    hoverN = 0
    setCursor('')
    fallClock = 0
    fallPulsed = false
    cycleIndex = 0
    seq = []
    busy = null
    jump = null
    photons.forEach((p) => {
      p.active = false
      p.line.visible = false
      p.head.visible = false
    })
    infoKey = ''
    setInfo('', '#ffffff')
    if (target !== 4 || replay) resetSpectrum()
    if (target === PLAY_STEP) resetSpectrum()

    if (replay) {
      const prevStep = target === 0 ? 1 : target - 1
      P = paramsFor(prevStep)
      resetElectron(START_LEVEL[prevStep])
    }
    from = { ...P }
    to = paramsFor(target)

    // continuidade do elétron entre os passos
    const wanted = START_LEVEL[target]
    if (immediate || reduced) resetElectron(wanted)
    else if (level !== wanted) seq.push({ type: 'move', to: wanted, target: wanted })

    if (userMoved || immediate) {
      userMoved = false
      const start = camera.position.clone()
      const home = homePosition(to.camX)
      if (immediate || reduced) camera.position.copy(home)
      else smallTween(1.2, (e) => camera.position.lerpVectors(start, home, e))
      controls.target.set(to.camX, 0, 0)
    }

    const finish = () => {
      applyProgress(1)
      tween = null
      interactive = target === PLAY_STEP
      if (interactive) setCursor('pointer')
      startScript(target)
    }
    if (immediate) {
      finish()
      return
    }
    tween = animate(0, 1, {
      duration: reduced ? 0.001 : 1.5,
      ease: [0.22, 0.8, 0.2, 1],
      onUpdate: applyProgress,
      onComplete: finish,
    })
  }

  // ----- Brincar: clicar numa camada ou num nível -----
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  function pickLevel(e) {
    const dom = stage.renderer.domElement
    const r = dom.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    scene.updateMatrixWorld(true)
    const targets = [...shells.map((s) => s.hit), ...levelLines.map((l) => l.hit)]
    const hit = ray.intersectObjects(targets, false)[0]
    return hit ? hit.object.userData.n : 0
  }

  function onPointerDown(e) {
    if (!interactive || e.button > 0) return
    const n = pickLevel(e)
    if (!n) return
    e.stopPropagation() // clicar numa camada não gira a câmera
    requestLevel(n)
  }

  function onHover(e) {
    if (!interactive) return
    hoverN = pickLevel(e)
    setCursor(hoverN ? 'pointer' : '')
  }

  host.addEventListener?.('pointerdown', onPointerDown, true)
  host.addEventListener?.('pointermove', onHover)

  // ----- Desenho a cada quadro -----
  const off = stage.onTick((dt, t) => {
    clock = t
    const p = P

    // saltos, fótons e roteiros
    if (step === 4) autoCycle()
    updateSequence(dt)
    updatePhotons(dt, t)
    updateFireworks(dt)

    // átomo
    const as = p.atom
    atom.visible = as > 0.01
    atom.scale.setScalar(0.5 + 0.5 * as)
    nucleusPulse = Math.max(0, nucleusPulse - dt * 3)
    nucleus.scale.setScalar(0.2 * (1 + 0.35 * p.more) * (1 + 0.5 * nucleusPulse))
    nucleusMat.opacity = as
    nucleusGlow.visible = as > 0.01
    nucleusGlow.material.opacity = as * (0.5 + 0.2 * Math.sin(t * 2.2) + 0.4 * nucleusPulse)
    nucleusGlow.scale.setScalar((1.8 + 0.8 * nucleusPulse) * (1 + 0.3 * p.more))

    // camadas
    const cloudDim = 1 - 0.65 * p.cloud
    shells.forEach((s, i) => {
      const reveal = clamp(p.shells - i, 0, 1)
      const current = Math.abs(levelF - s.n) < 0.5 ? 0.35 : 0
      const hover = hoverN === s.n ? 0.35 : 0
      s.mat.opacity = reveal * (0.28 + current + hover) * cloudDim
      s.ring.visible = s.mat.opacity > 0.01
      const lab = s.label
      lab.material.opacity = p.shellLabel * reveal * cloudDim
      lab.visible = lab.material.opacity > 0.01
    })
    rutherfordMat.opacity = p.rutherford * as * 0.4
    rutherfordRing.visible = rutherfordMat.opacity > 0.01

    // elétron principal (pode espiralar no modelo de Rutherford)
    if (p.fall > 0.01) {
      fallClock += dt / 4.2
      if (fallClock >= 1 && !fallPulsed) {
        nucleusPulse = 1
        fallPulsed = true
      }
      if (fallClock > 1.18) {
        fallClock = 0
        fallPulsed = false
      }
    } else {
      fallClock = 0
      fallPulsed = false
    }
    const baseR = lerp(radiusOf(levelF), RUTHERFORD_R, p.rutherford)
    const fallR = Math.max(0.24, RUTHERFORD_R * (1 - clamp(fallClock, 0, 1)))
    const r = lerp(baseR, fallR, p.fall)
    const omega = 1.9 * (radiusOf(1) / Math.max(r, 0.24)) ** 1.5
    electron.angle += dt * Math.min(omega, 9)
    electron.mesh.position.set(Math.cos(electron.angle) * r, 0, Math.sin(electron.angle) * r)
    electron.glow.position.copy(electron.mesh.position)
    electron.mat.opacity = as
    electron.glow.visible = as > 0.01
    electron.glow.material.opacity = as * 0.9
    electron.glow.scale.setScalar(0.8 + 0.1 * Math.sin(t * 6))

    // elétrons extras (átomo com mais elétrons)
    extras.forEach((x, k) => {
      const rr = radiusOf(1)
      x.angle += dt * 1.9 * (k ? 1 : 1.07)
      x.mesh.position.set(Math.cos(x.angle) * rr, 0, Math.sin(x.angle) * rr)
      x.glow.position.copy(x.mesh.position)
      x.mat.opacity = p.more * as
      x.mesh.visible = x.mat.opacity > 0.01
      x.glow.visible = x.mesh.visible
      x.glow.material.opacity = p.more * as * 0.8
    })

    // nuvem difusa
    cloudMat.opacity = p.cloud * 0.6
    cloud.visible = cloudMat.opacity > 0.01
    cloud.rotation.y += dt * 0.12

    // rótulos do átomo
    const setOp = (l, op) => {
      l.material.opacity = op
      l.visible = op > 0.01
    }
    setOp(rutherfordLabel, p.rutherford * as)
    setOp(qLabel, p.q * as)
    qLabel.position.set(p.more > 0.5 ? 2.4 : 0.9, (p.more > 0.5 ? 2.0 : 1.2) + Math.sin(t * 2) * 0.1, 0)
    setOp(nuLabel, p.nuLabel * as)
    setOp(shellTitle, p.shellTitle * clamp(p.shells / 6, 0, 1))
    setOp(infoLabel, p.info)
    setOp(hintLabel, p.hint)

    // escada de energia
    ladder.visible = p.ladder > 0.01
    levelLines.forEach((l) => {
      const here = Math.abs(levelF - l.n) < 0.5 ? 0.5 : 0
      const hover = hoverN === l.n ? 0.35 : 0
      l.mat.opacity = p.ladder * (0.4 + here + hover)
      l.label.material.opacity = p.ladder
      l.label.visible = p.ladder > 0.01
    })
    const my = ladderY(levelF)
    marker.position.set(-0.1, my, 0.05)
    marker.material.opacity = p.ladder
    marker.visible = p.ladder > 0.01
    markerDot.position.set(-0.1, my, 0.06)
    markerDot.material.opacity = p.ladder
    ladderTitle.material.opacity = p.ladder
    ladderTitle.visible = p.ladder > 0.01
    arrowFade = Math.max(0, arrowFade - dt * 0.7)
    arrowMat.opacity = arrowFade * p.ladder
    arrow.visible = arrowMat.opacity > 0.01

    // espectro
    spectrum.visible = p.spectrum > 0.01
    specBackMat.opacity = p.spectrum * 0.92
    specLines.forEach((l) => {
      l.glow = Math.max(0, l.glow - dt * 0.5)
      l.mat.opacity = p.spectrum * (l.seen ? 0.55 + 0.45 * l.glow : 0.08)
    })
    specLabel.material.opacity = p.spectrum
    specLabel.visible = p.spectrum > 0.01

    // brilhos dos fogos de artifício e fundo: nada mais a atualizar aqui

    // câmera: foco e balanço suave enquanto ninguém mexeu nela
    controls.target.x = p.camX
    if (!userMoved && !reduced && !interactive) {
      const az = CAMERA_AZIMUTH + Math.sin(t * 0.35) * 0.22
      camera.position.set(p.camX + Math.sin(az) * stage.home.z, stage.home.y, Math.cos(az) * stage.home.z)
    }
  })

  stage.onResize = () => {
    if (!userMoved && !interactive) camera.position.copy(homePosition(P.camX))
  }

  function dispose() {
    stopTween()
    smallTweens.forEach((s) => s.stop())
    smallTweens.clear()
    off()
    controls.removeEventListener?.('start', onStart)
    host.removeEventListener?.('pointerdown', onPointerDown, true)
    host.removeEventListener?.('pointermove', onHover)
    stage.onResize = null
    disposeTree(root)
    scene.remove(root)
  }

  // Começa com tudo escondido; o primeiro goTo mostra o passo certo
  P = { ...P0 }

  return {
    goTo,
    dispose,
    // usado pelos testes e para depuração
    api: {
      get level() {
        return level
      },
      get levelF() {
        return levelF
      },
      get busy() {
        return busy
      },
      get queue() {
        return seq
      },
      get params() {
        return P
      },
      get step() {
        return step
      },
      photons,
      flashes,
      specLines,
      requestLevel,
      photonInfo,
      resetElectron,
      setInteractive: (value) => (interactive = value),
      objects: { atom, electron, extras, shells, levelLines, ladder, spectrum, cloud, bursts, rockets, fwLabels, infoLabel, qLabel, hintLabel, rutherfordLabel, shellTitle, nuLabel, marker },
    },
  }
}
