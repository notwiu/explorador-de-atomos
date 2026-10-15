import * as THREE from 'three'
import { animate } from 'framer-motion'
import { clamp, smooth, lerp, mulberry32, makeLabel, setLabel, makeGlow, disposeTree } from '../../three/helpers.js'

// Mundo 3D da cena do Thomson.
//
//   passo 0: o modelo de Dalton (esfera maciça) e a pergunta: por que mudar?
//   passo 1: o tubo de raios catódicos
//   passo 2: a placa emite um feixe que faz a tela brilhar
//   passo 3: perto de uma placa positiva o feixe se curva: ele é negativo
//   passo 4: o feixe é feito de partículas minúsculas e negativas: os elétrons
//   passo 5: o átomo é neutro, então precisa existir algo positivo: a esfera positiva
//   passo 6: os elétrons entram na esfera: o pudim de passas
//   passo 7: o que o modelo não explicava
//   passo 8: brincar (arrastar elétrons para dentro da esfera e equilibrar as cargas)
//
// Toda a cena é descrita por poucos "parâmetros" (por exemplo: quanto do tubo aparece,
// o comprimento do feixe, o quanto ele está desviado). Cada passo define os valores
// desses parâmetros, e a transição anima de um conjunto de valores para o outro.

export const STEP_COUNT = 9

const PLAY_STEP = 8
const C = {
  violet: '#b69cff',
  amber: '#ffb454',
  electron: '#7ee7ff',
  positive: '#ff6f91',
  negative: '#6ea8ff',
  neutral: '#5eead0',
  steel: '#aab4dc',
}

// Medidas do tubo (em unidades 3D)
const TUBE_LEN = 9.6
const TUBE_R = 0.95
const CATHODE_X = -4.5
const ANODE_X = -3.5
const SCREEN_X = 4.55
const PLATE_X0 = -1.5
const PLATE_X1 = 0.9
const PLATE_Y = 0.62
const BEAM_X0 = CATHODE_X + 0.1
const BEAM_SLOPE = 0.17 // quanto o feixe se curva quando as placas estão ligadas

// Átomo e elétrons
const ATOM_R = 1.9
const POSITIVE = 8 // cargas positivas da esfera
const HERO_COUNT = 12 // elétrons que podem ser arrastados
const HERO_R = 0.17
const BEAM_PARTICLES = 40
const BOUNDS = { x: 5.0, y: 2.6, z: 1.5 }
const CAMERA_AZIMUTH = 0.45 // a câmera olha um pouco de lado, para ver a profundidade

const v = (x, y, z) => new THREE.Vector3(x, y, z)

// Altura do feixe em cada ponto do tubo. d = 0 (reto) ... 1 (desviado)
export function beamY(x, d) {
  const s = BEAM_SLOPE * d
  const L = PLATE_X1 - PLATE_X0
  if (x <= PLATE_X0) return 0
  if (x <= PLATE_X1) return 0.5 * (s / L) * (x - PLATE_X0) ** 2
  return (s * L) / 2 + s * (x - PLATE_X1)
}

// Pontos bem espalhados numa esfera
function fibonacci(n, radius) {
  const out = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = golden * i
    out.push(v(Math.cos(th) * r * radius, y * radius, Math.sin(th) * r * radius))
  }
  return out
}

const SLOTS = fibonacci(8, 1.25) // lugares dos elétrons dentro da esfera
const TRAY = Array.from({ length: 7 }, (_, k) => v(3.45 + (k % 2) * 0.95, 1.9 - Math.floor(k / 2) * 1.15, 0))
const PLUS_POSITIONS = fibonacci(POSITIVE, 1)
  .map((p, i) => p.applyAxisAngle(v(0, 1, 0), 0.6).setLength(0.5 + (i % 3) * 0.45))

// ---------- Parâmetros de cada passo ----------

const P0 = {
  dalton: 0, // esfera de Dalton
  prev: 0, // rótulo "Modelo de Dalton" e "?"
  tube: 0, // quanto do tubo aparece
  parts: 0, // nomes das partes do tubo
  beamLen: 0, // comprimento do feixe (0 a 1)
  glow: 0, // brilho do feixe
  deflect: 0, // desvio do feixe (0 a 1)
  plates: 0, // placas carregadas (0 a 1)
  eVis: 0, // partículas do feixe aparecendo
  eBig: 0, // partículas grandes (zoom nos elétrons)
  elabel: 0, // rótulo "Elétron"
  atom: 0, // esfera positiva
  plus: 0, // sinais de mais
  charge: 0, // rótulo da carga total
  q: 0, // ponto de interrogação
  tray: 0, // rótulo dos elétrons soltos
}

const STEP_PARAMS = [
  { dalton: 1, prev: 1 },
  { tube: 1, parts: 1 },
  { tube: 1, parts: 1, beamLen: 1, glow: 1, eVis: 0.55 },
  { tube: 1, beamLen: 1, glow: 1, eVis: 0.55, deflect: 1, plates: 1 },
  { tube: 1, beamLen: 1, glow: 0.3, eVis: 1, eBig: 1, deflect: 1, plates: 1, elabel: 1 },
  { atom: 1, plus: 1 },
  { atom: 1, plus: 1, charge: 1 },
  { atom: 1, plus: 1, q: 1 },
  { atom: 1, plus: 1, charge: 1, tray: 1 },
]

// Em que parte da transição (0 a 1) cada parâmetro muda
const WINDOW = {
  dalton: [0, 0.7],
  prev: [0, 0.5],
  tube: [0.1, 0.9],
  parts: [0, 0.7],
  plates: [0, 0.8],
  eVis: [0, 0.8],
  elabel: [0.3, 1],
  atom: [0.25, 1],
  plus: [0.4, 1],
  charge: [0.5, 1],
  q: [0.3, 1],
  tray: [0.3, 1],
}

const paramsFor = (step) => ({ ...P0, ...STEP_PARAMS[step] })

// ---------- Elétrons "arrastáveis" ----------

const outsideOf = (i) => (i < 8 ? SLOTS[i].clone().setLength(4.6) : TRAY[i - 5].clone().add(v(2.6, 0, 0)))

function heroTargets(step) {
  return Array.from({ length: HERO_COUNT }, (_, i) => {
    if (step === 6 || step === 7) {
      return i < 8
        ? { pos: SLOTS[i].clone(), scale: HERO_R, inside: true }
        : { pos: outsideOf(i), scale: 0, inside: false }
    }
    if (step === PLAY_STEP) {
      return i < 5
        ? { pos: SLOTS[i].clone(), scale: HERO_R, inside: true }
        : { pos: TRAY[i - 5].clone(), scale: HERO_R, inside: false }
    }
    return { pos: outsideOf(i), scale: 0, inside: false }
  })
}

// ---------- O mundo ----------

export function createThomsonWorld(stage, { reduced = false } = {}) {
  const { scene, camera, controls, host } = stage
  const light = stage.light
  const seg = light ? 24 : 40

  const root = new THREE.Group()
  scene.add(root)
  const sphereGeo = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7))

  // ----- Esfera de Dalton (passo 0) -----
  const daltonMat = light
    ? new THREE.MeshStandardMaterial({ color: C.amber, roughness: 0.35, metalness: 0.05 })
    : new THREE.MeshPhysicalMaterial({ color: C.amber, roughness: 0.28, metalness: 0.05, clearcoat: 0.8, clearcoatRoughness: 0.2 })
  const daltonMesh = new THREE.Mesh(sphereGeo, daltonMat)
  root.add(daltonMesh)

  const prevLabel = makeLabel({ text: 'Modelo de Dalton', color: C.amber, size: [4.6, 0.8] })
  prevLabel.position.set(0, -2.3, 0)
  const qLabel = makeLabel({ text: '?', color: '#ffffff', size: [1.2, 1.2] })
  root.add(prevLabel, qLabel)

  // ----- Tubo de raios catódicos -----
  const tube = new THREE.Group()
  root.add(tube)
  const fades = [] // materiais que acompanham o "tube"
  const track = (material) => {
    material.transparent = true
    fades.push({ material, base: material.opacity })
    return material
  }
  const steelMat = () =>
    track(new THREE.MeshStandardMaterial({ color: C.steel, metalness: 0.85, roughness: 0.32, side: THREE.DoubleSide }))

  const glassGeo = new THREE.CylinderGeometry(TUBE_R, TUBE_R, TUBE_LEN, 48, 1, true)
  glassGeo.rotateZ(Math.PI / 2)
  const glass = new THREE.Mesh(
    glassGeo,
    track(new THREE.MeshPhysicalMaterial({ color: 0xbcd8ff, opacity: 0.16, roughness: 0.08, metalness: 0, side: THREE.DoubleSide, depthWrite: false })),
  )
  tube.add(glass)

  for (const sign of [-1, 1]) {
    const capGeo = new THREE.CircleGeometry(TUBE_R, 48)
    capGeo.rotateY(sign < 0 ? Math.PI / 2 : -Math.PI / 2)
    const cap = new THREE.Mesh(
      capGeo,
      track(new THREE.MeshBasicMaterial({ color: 0xbcd8ff, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false })),
    )
    cap.position.x = (sign * TUBE_LEN) / 2
    const ringGeo = new THREE.TorusGeometry(TUBE_R, 0.04, 12, 64)
    ringGeo.rotateY(Math.PI / 2)
    const ring = new THREE.Mesh(ringGeo, steelMat())
    ring.position.x = (sign * TUBE_LEN) / 2
    tube.add(cap, ring)
  }

  // Cátodo (placa metálica que emite o feixe)
  const cathodeGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.14, 32)
  cathodeGeo.rotateZ(Math.PI / 2)
  const cathodeMat = steelMat()
  cathodeMat.emissive = new THREE.Color('#ff9a4a')
  cathodeMat.emissiveIntensity = 0
  const cathode = new THREE.Mesh(cathodeGeo, cathodeMat)
  cathode.position.x = CATHODE_X
  tube.add(cathode)

  // Ânodo (disco com um furinho por onde o feixe passa)
  const anodeGeo = new THREE.RingGeometry(0.07, 0.62, 40)
  anodeGeo.rotateY(Math.PI / 2)
  const anode = new THREE.Mesh(anodeGeo, steelMat())
  anode.position.x = ANODE_X
  tube.add(anode)

  // Placas de desvio
  const plateGeo = new THREE.BoxGeometry(PLATE_X1 - PLATE_X0, 0.07, 1.3)
  const plateTop = new THREE.Mesh(plateGeo, steelMat())
  const plateBottom = new THREE.Mesh(plateGeo, steelMat())
  const plateMid = (PLATE_X0 + PLATE_X1) / 2
  plateTop.position.set(plateMid, PLATE_Y, 0)
  plateBottom.position.set(plateMid, -PLATE_Y, 0)
  tube.add(plateTop, plateBottom)
  const steelColor = new THREE.Color(C.steel)
  const positiveColor = new THREE.Color(C.positive)
  const negativeColor = new THREE.Color(C.negative)

  // Tela fluorescente
  const screenGeo = new THREE.CylinderGeometry(TUBE_R * 0.97, TUBE_R * 0.97, 0.06, 48)
  screenGeo.rotateZ(Math.PI / 2)
  const screenMat = track(new THREE.MeshStandardMaterial({ color: 0x1b2466, roughness: 0.6, metalness: 0.1, emissive: new THREE.Color(C.violet), emissiveIntensity: 0 }))
  const screen = new THREE.Mesh(screenGeo, screenMat)
  screen.position.x = SCREEN_X
  tube.add(screen)

  // Nomes das partes
  const partLabels = [
    makeLabel({ text: 'Cátodo (−)', color: '#ffffff', size: [3.2, 0.6] }),
    makeLabel({ text: 'Placas', color: '#ffffff', size: [2.2, 0.6] }),
    makeLabel({ text: 'Tela', color: '#ffffff', size: [1.8, 0.6] }),
  ]
  partLabels[0].position.set(CATHODE_X + 0.2, -1.6, 0)
  partLabels[1].position.set(plateMid, 1.65, 0)
  partLabels[2].position.set(SCREEN_X - 0.2, -1.6, 0)
  const plusPlateLabel = makeLabel({ text: '+', color: C.positive, size: [0.9, 0.9] })
  const minusPlateLabel = makeLabel({ text: '−', color: C.negative, size: [0.9, 0.9] })
  plusPlateLabel.position.set(plateMid, 1.55, 0)
  minusPlateLabel.position.set(plateMid, -1.55, 0)
  const electronLabel = makeLabel({ text: 'Elétron (−)', color: C.electron, size: [3.4, 0.65] })
  root.add(...partLabels, plusPlateLabel, minusPlateLabel, electronLabel)

  // ----- Feixe -----
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xe6d9ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  let beamMesh = null
  let lastBeam = { len: -1, d: -1 }
  function rebuildBeam(len, d) {
    if (beamMesh) {
      root.remove(beamMesh)
      beamMesh.geometry.dispose()
      beamMesh = null
    }
    const xEnd = BEAM_X0 + len * (SCREEN_X - 0.05 - BEAM_X0)
    if (len < 0.02) return
    const pts = []
    const steps = 48
    for (let i = 0; i <= steps; i++) {
      const x = lerp(BEAM_X0, xEnd, i / steps)
      pts.push(v(x, beamY(x, d), 0))
    }
    beamMesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.05, 8, false), beamMat)
    root.add(beamMesh)
  }

  // Partículas do feixe
  const electronMat = new THREE.MeshBasicMaterial({ color: C.electron })
  const beamParticles = Array.from({ length: BEAM_PARTICLES }, (_, i) => {
    const mesh = new THREE.Mesh(sphereGeo, electronMat)
    mesh.visible = false
    root.add(mesh)
    return { mesh, jy: Math.sin(i * 12.9898) , jz: Math.cos(i * 78.233) }
  })

  // Brilho da mancha na tela
  const spot = makeGlow('rgba(230,215,255,1)', 1.3)
  root.add(spot)

  // ----- Esfera positiva (átomo de Thomson) -----
  const atomMat = new THREE.MeshPhysicalMaterial({
    color: C.violet,
    transparent: true,
    opacity: 0,
    roughness: 0.15,
    metalness: 0,
    depthWrite: false,
  })
  const atomMesh = new THREE.Mesh(sphereGeo, atomMat)
  const atomGlowMat = new THREE.MeshBasicMaterial({
    color: C.violet,
    transparent: true,
    opacity: 0,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const atomGlow = new THREE.Mesh(sphereGeo, atomGlowMat)
  root.add(atomMesh, atomGlow)

  const plusSprites = PLUS_POSITIONS.map((p) => {
    const s = makeLabel({ text: '+', color: '#ffd1e0', size: [0.42, 0.42], depthTest: true })
    s.position.copy(p)
    root.add(s)
    return s
  })

  // Elétrons arrastáveis
  const heroes = Array.from({ length: HERO_COUNT }, (_, i) => {
    const mat = new THREE.MeshStandardMaterial({ color: C.electron, emissive: new THREE.Color(C.electron), emissiveIntensity: 0.6, roughness: 0.35 })
    const mesh = new THREE.Mesh(sphereGeo, mat)
    mesh.visible = false
    mesh.userData.hero = i
    root.add(mesh)
    return { i, mesh, base: outsideOf(i), scale: 0, inside: false, from: null, to: null, phase: i * 1.7 }
  })

  const chargeLabel = makeLabel({ text: 'Carga total: 0', color: C.neutral, size: [5.6, 0.85] })
  chargeLabel.position.set(0, 2.85, 0)
  const trayLabel = makeLabel({ text: 'Elétrons soltos', color: '#ffffff', size: [3.8, 0.62] })
  trayLabel.position.set(4.05, 2.85, 0)
  root.add(chargeLabel, trayLabel)

  const ringGeo = new THREE.TorusGeometry(2.3, 0.035, 8, 80)
  const ringMat = new THREE.MeshBasicMaterial({
    color: C.neutral,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const neutralRing = new THREE.Mesh(ringGeo, ringMat)
  neutralRing.visible = false
  root.add(neutralRing)

  // ----- Estado -----
  let step = 0
  let P = { ...P0 }
  let from = { ...P0 }
  let to = { ...P0 }
  let tween = null
  let interactive = false
  let userMoved = false
  let dragging = null
  let pulse = 0
  let ringLevel = 0
  const violet = new THREE.Color(C.violet)
  const warm = new THREE.Color(C.positive)
  const cool = new THREE.Color(C.negative)
  const tint = new THREE.Color(C.violet)
  const tintTarget = new THREE.Color(C.violet)
  const smallTweens = new Set()

  const onStart = () => {
    userMoved = true
  }
  controls.addEventListener?.('start', onStart)

  const homePosition = (az = CAMERA_AZIMUTH) =>
    v(Math.sin(az) * stage.home.z, stage.home.y, Math.cos(az) * stage.home.z)

  // ----- Carga total -----
  const insideCount = () => heroes.filter((h) => h.inside && h.scale > 0.05).length
  function chargeInfo() {
    const n = insideCount()
    const net = POSITIVE - n
    if (net === 0) return { net, text: 'Carga total: 0 (neutro)', color: C.neutral }
    if (net > 0) return { net, text: `Carga total: +${net}`, color: C.positive }
    return { net, text: `Carga total: −${-net}`, color: C.negative }
  }
  function refreshCharge() {
    const info = chargeInfo()
    setLabel(chargeLabel, info.text, info.color)
    return info
  }

  // ----- Transições -----
  function applyProgress(u, stagger) {
    for (const key of Object.keys(P0)) {
      const [w0, w1] = WINDOW[key] ?? [0, 1]
      const e = smooth(clamp((u - w0) / (w1 - w0), 0, 1))
      P[key] = from[key] + (to[key] - from[key]) * e
    }
    for (const h of heroes) {
      const local = smooth(clamp(u * (1 + stagger) - (h.i / HERO_COUNT) * stagger, 0, 1))
      h.base.lerpVectors(h.from.pos, h.to.pos, local)
      h.scale = h.from.scale + (h.to.scale - h.from.scale) * local
    }
  }

  function snapshotHeroes(targets) {
    heroes.forEach((h, i) => {
      h.from = { pos: h.base.clone(), scale: h.scale }
      h.to = { pos: targets[i].pos.clone(), scale: targets[i].scale }
      h.inside = targets[i].inside
    })
  }

  function stopTween() {
    tween?.stop()
    tween = null
  }

  function smallTween(duration, onUpdate, onDone) {
    const t = animate(0, 1, {
      duration: reduced ? 0.001 : duration,
      ease: [0.22, 0.8, 0.2, 1],
      onUpdate,
      onComplete: () => {
        smallTweens.delete(t)
        onDone?.()
      },
    })
    smallTweens.add(t)
    return t
  }

  function goTo(newStep, { immediate = false, replay = false } = {}) {
    stopTween()
    const target = clamp(newStep, 0, STEP_COUNT - 1)
    const previous = step
    step = target
    interactive = false
    if (dragging) controls.enabled = true // arraste interrompido
    dragging = null
    setCursor('')

    // "Repetir": volta ao desenho do passo anterior e anima de novo
    if (replay) {
      const prevStep = target === 0 ? 1 : target - 1
      from = { ...P }
      to = paramsFor(prevStep)
      snapshotHeroes(heroTargets(prevStep))
      from = { ...to }
      P = { ...to }
      applyProgress(1, 0)
    }

    from = { ...P }
    to = paramsFor(target)
    snapshotHeroes(heroTargets(target))
    refreshCharge()

    if (userMoved || immediate) {
      userMoved = false
      const start = camera.position.clone()
      const home = homePosition()
      if (immediate || reduced) camera.position.copy(home)
      else smallTween(1.2, (e) => camera.position.lerpVectors(start, home, e))
      controls.target.set(0, 0, 0)
    }

    const stagger = target === 6 ? 0.7 : 0.15
    const duration = immediate || reduced ? 0.001 : previous === 0 || target === 5 ? 1.9 : 1.5

    if (immediate) {
      applyProgress(1, 0)
      interactive = target === PLAY_STEP
      return
    }
    tween = animate(0, 1, {
      duration,
      ease: [0.22, 0.8, 0.2, 1],
      onUpdate: (u) => applyProgress(u, stagger),
      onComplete: () => {
        applyProgress(1, 0)
        tween = null
        interactive = target === PLAY_STEP
        if (interactive) setCursor('grab')
      },
    })
  }

  // ----- Brincar: arrastar elétrons -----
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const plane = new THREE.Plane()
  const point = new THREE.Vector3()
  const dirVec = new THREE.Vector3()

  function setCursor(c) {
    const dom = stage.renderer?.domElement
    if (dom?.style) dom.style.cursor = c
  }

  function pick(e) {
    const dom = stage.renderer.domElement
    const r = dom.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    scene.updateMatrixWorld(true)
    const meshes = heroes.filter((h) => h.scale > 0.05).map((h) => h.mesh)
    return ray.intersectObjects(meshes, false)[0] ?? null
  }

  function clampToBounds(p) {
    p.x = clamp(p.x, -BOUNDS.x, BOUNDS.x)
    p.y = clamp(p.y, -BOUNDS.y, BOUNDS.y)
    p.z = clamp(p.z, -BOUNDS.z, BOUNDS.z)
  }

  const rnd = mulberry32(5)
  const inBounds = (p) => Math.abs(p.x) <= BOUNDS.x && Math.abs(p.y) <= BOUNDS.y && Math.abs(p.z) <= BOUNDS.z

  // Procura o lugar livre mais próximo do ponto desejado (sem encostar em outros elétrons)
  function freeSpot(target, others, minDist, valid) {
    const free = (p) => valid(p) && others.every((o) => p.distanceTo(o.base) >= minDist)
    if (free(target)) return target.clone()
    const dir = new THREE.Vector3()
    for (let k = 0; k < 700; k++) {
      dir.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1)
      if (dir.lengthSq() < 1e-6) continue
      const cand = target.clone().addScaledVector(dir.normalize(), 0.05 + k * 0.008)
      if (free(cand)) return cand
    }
    return target.clone()
  }

  // Solta o elétron: dentro da esfera ele fica preso; fora, fica solto
  function release(h) {
    const start = h.base.clone()
    const d = start.length()
    const others = heroes.filter((o) => o !== h && o.scale > 0.05)
    const target = start.clone()
    if (d < ATOM_R - 0.1) {
      h.inside = true
      if (target.length() > 1.45) target.setLength(1.45)
      h.base.copy(freeSpot(target, others.filter((o) => o.inside), 0.42, (p) => p.length() <= 1.45))
    } else {
      h.inside = false
      if (d < ATOM_R + 0.5) target.setLength(ATOM_R + 0.6)
      clampToBounds(target)
      h.base.copy(freeSpot(target, others.filter((o) => !o.inside), 0.5, (p) => p.length() >= ATOM_R + 0.5 && inBounds(p)))
    }
    const end = h.base.clone()
    smallTween(0.25, (e) => h.base.lerpVectors(start, end, e))
    pulse = 1
    return refreshCharge()
  }

  function onPointerDown(e) {
    if (!interactive || e.button > 0) return
    const hit = pick(e)
    if (!hit) return
    const h = heroes[hit.object.userData.hero]
    e.stopPropagation() // não deixa a câmera girar enquanto arrasta
    camera.getWorldDirection(dirVec)
    plane.setFromNormalAndCoplanarPoint(dirVec, hit.point)
    dragging = { h, last: hit.point.clone() }
    controls.enabled = false
    setCursor('grabbing')
    window.addEventListener('pointermove', onDragMove)
    window.addEventListener('pointerup', onDragEnd)
  }

  function onDragMove(e) {
    if (!dragging) return
    const dom = stage.renderer.domElement
    const r = dom.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    if (ray.ray.intersectPlane(plane, point)) {
      dragging.h.base.add(point.clone().sub(dragging.last))
      clampToBounds(dragging.h.base)
      dragging.last.copy(point)
    }
  }

  function onDragEnd() {
    window.removeEventListener('pointermove', onDragMove)
    window.removeEventListener('pointerup', onDragEnd)
    controls.enabled = true
    if (!dragging) return
    const h = dragging.h
    dragging = null
    release(h)
    setCursor('grab')
  }

  function onHover(e) {
    if (!interactive || dragging) return
    setCursor(pick(e) ? 'grab' : '')
  }

  host.addEventListener?.('pointerdown', onPointerDown, true)
  host.addEventListener?.('pointermove', onHover)

  // ----- Desenho a cada quadro -----
  const off = stage.onTick((dt, t) => {
    const p = P

    // Dalton
    daltonMesh.visible = p.dalton > 0.01
    daltonMesh.scale.setScalar(1.5 * Math.max(p.dalton, 0.0001) * (1 + 0.02 * Math.sin(t * 1.6)))
    prevLabel.material.opacity = p.prev
    prevLabel.visible = p.prev > 0.01
    const qOpacity = Math.max(p.prev, p.q)
    qLabel.material.opacity = qOpacity
    qLabel.visible = qOpacity > 0.01
    qLabel.position.set(2.15, 1.8 + Math.sin(t * 2) * 0.12, 0)

    // Tubo
    const ts = p.tube
    tube.visible = ts > 0.01
    tube.scale.setScalar(0.35 + 0.65 * ts)
    for (const f of fades) f.material.opacity = f.base * ts
    partLabels.forEach((l) => {
      l.material.opacity = p.parts * ts
      l.visible = l.material.opacity > 0.01
    })
    plusPlateLabel.material.opacity = minusPlateLabel.material.opacity = p.plates * ts
    plusPlateLabel.visible = minusPlateLabel.visible = p.plates * ts > 0.01

    // Placas carregadas
    plateTop.material.color.lerpColors(steelColor, positiveColor, p.plates)
    plateTop.material.emissive.copy(positiveColor)
    plateTop.material.emissiveIntensity = p.plates * 0.7
    plateBottom.material.color.lerpColors(steelColor, negativeColor, p.plates)
    plateBottom.material.emissive.copy(negativeColor)
    plateBottom.material.emissiveIntensity = p.plates * 0.7
    cathodeMat.emissiveIntensity = p.glow * 0.9

    // Feixe
    if (Math.abs(p.beamLen - lastBeam.len) > 0.002 || Math.abs(p.deflect - lastBeam.d) > 0.002) {
      rebuildBeam(p.beamLen, p.deflect)
      lastBeam = { len: p.beamLen, d: p.deflect }
    }
    beamMat.opacity = 0.5 * p.glow * ts
    if (beamMesh) beamMesh.visible = ts > 0.01

    const xEnd = BEAM_X0 + p.beamLen * (SCREEN_X - 0.05 - BEAM_X0)
    const len = xEnd - BEAM_X0
    const speed = lerp(0.35, 0.12, p.eBig)
    const radius = lerp(0.05, 0.16, p.eBig)
    beamParticles.forEach((b, i) => {
      const ph = (t * speed + i / BEAM_PARTICLES) % 1
      const x = BEAM_X0 + ph * len
      const spread = lerp(0.04, 0.09, p.eBig)
      b.mesh.position.set(x, beamY(x, p.deflect) + b.jy * spread, b.jz * spread)
      const keep = i % 3 === 0 ? 1 : 1 - p.eBig
      const r = radius * p.eVis * keep * (p.beamLen > 0.02 ? 1 : 0) * ts
      b.mesh.visible = r > 0.004
      b.mesh.scale.setScalar(Math.max(r, 0.0001))
    })
    const eLabelX = 2.0
    electronLabel.position.set(eLabelX, beamY(eLabelX, p.deflect) + 0.8, 0)
    electronLabel.material.opacity = p.elabel * ts
    electronLabel.visible = electronLabel.material.opacity > 0.01

    // Mancha na tela
    const spotA = smooth(clamp((p.beamLen - 0.92) / 0.08, 0, 1)) * ts
    spot.position.set(SCREEN_X - 0.05, beamY(SCREEN_X - 0.05, p.deflect), 0)
    spot.scale.setScalar(1.2 + 0.15 * Math.sin(t * 5))
    spot.material.opacity = spotA * (0.55 + 0.45 * p.glow)
    spot.visible = spotA > 0.01
    screenMat.emissiveIntensity = spotA * 0.25

    // Esfera positiva
    const net = step === PLAY_STEP ? chargeInfo().net : 0
    if (step === PLAY_STEP) {
      if (net > 0) tintTarget.copy(violet).lerp(warm, Math.min(net / 4, 1) * 0.8)
      else if (net < 0) tintTarget.copy(violet).lerp(cool, Math.min(-net / 4, 1) * 0.8)
      else tintTarget.copy(violet)
    } else {
      tintTarget.set(C.violet)
    }
    tint.lerp(tintTarget, Math.min(1, dt * 6))
    pulse = Math.max(0, pulse - dt * 2.5)
    const as = p.atom
    const atomScale = ATOM_R * (0.55 + 0.45 * as) * (1 + 0.07 * pulse * Math.sin(pulse * Math.PI) + 0.012 * Math.sin(t * 1.5))
    atomMesh.visible = atomGlow.visible = as > 0.01
    atomMesh.scale.setScalar(atomScale)
    atomGlow.scale.setScalar(atomScale * 1.05)
    atomMat.opacity = 0.3 * as
    atomMat.color.copy(tint)
    atomGlowMat.opacity = 0.14 * as
    atomGlowMat.color.copy(tint)

    plusSprites.forEach((s, i) => {
      s.material.opacity = p.plus * as
      s.visible = s.material.opacity > 0.01
      s.position.copy(PLUS_POSITIONS[i])
      s.position.y += Math.sin(t * 1.2 + i) * 0.04
    })

    // Elétrons arrastáveis
    for (const h of heroes) {
      h.mesh.visible = h.scale > 0.005
      if (!h.mesh.visible) continue
      h.mesh.position.copy(h.base)
      if (!(dragging && dragging.h === h)) h.mesh.position.y += Math.sin(t * 1.4 + h.phase) * 0.03
      h.mesh.scale.setScalar(Math.max(h.scale, 0.0001))
    }

    // Rótulos de carga e bandeja
    chargeLabel.material.opacity = p.charge
    chargeLabel.visible = p.charge > 0.01
    trayLabel.material.opacity = p.tray
    trayLabel.visible = p.tray > 0.01

    // Anel quando o átomo fica neutro (só na hora de brincar)
    const wantRing = step === PLAY_STEP && interactive && net === 0 && insideCount() > 0 ? 1 : 0
    ringLevel += (wantRing - ringLevel) * Math.min(1, dt * 6)
    neutralRing.visible = ringLevel > 0.01
    ringMat.opacity = ringLevel * 0.8
    neutralRing.quaternion.copy(camera.quaternion)

    // Balanço suave da câmera enquanto ninguém mexeu nela
    if (!userMoved && !dragging && !reduced && !interactive) {
      const az = CAMERA_AZIMUTH + Math.sin(t * 0.35) * 0.22
      camera.position.set(Math.sin(az) * stage.home.z, stage.home.y, Math.cos(az) * stage.home.z)
    }
  })

  stage.onResize = () => {
    if (!userMoved && !interactive) camera.position.copy(homePosition())
  }

  function dispose() {
    stopTween()
    smallTweens.forEach((s) => s.stop())
    smallTweens.clear()
    off()
    controls.removeEventListener?.('start', onStart)
    host.removeEventListener?.('pointerdown', onPointerDown, true)
    host.removeEventListener?.('pointermove', onHover)
    window.removeEventListener('pointermove', onDragMove)
    window.removeEventListener('pointerup', onDragEnd)
    stage.onResize = null
    disposeTree(root)
    scene.remove(root)
  }

  // Começa com tudo escondido; o primeiro goTo mostra o passo certo
  P = { ...P0 }
  heroes.forEach((h) => {
    h.scale = 0
    h.mesh.visible = false
  })

  return {
    goTo,
    dispose,
    // usado pelos testes e para depuração
    api: {
      heroes,
      get params() {
        return P
      },
      get step() {
        return step
      },
      beamY,
      release,
      chargeInfo,
      insideCount,
      setInteractive: (value) => (interactive = value),
      objects: {
        daltonMesh,
        tube,
        atomMesh,
        spot,
        chargeLabel,
        qLabel,
        plateTop,
        plateBottom,
        beamParticles,
        plusSprites,
        plusPlateLabel,
        get beamMesh() {
          return beamMesh
        },
      },
    },
  }
}
