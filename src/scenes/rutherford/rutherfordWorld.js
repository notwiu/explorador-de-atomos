import * as THREE from 'three'
import { animate } from 'framer-motion'
import { clamp, smooth, lerp, mulberry32, makeLabel, setLabel, makeGlow, disposeTree } from '../../three/helpers.js'

// Mundo 3D da cena do Rutherford.
//
//   passo 0: o modelo de Thomson e a previsão: as partículas atravessariam quase sem desviar
//   passo 1: o experimento: fonte de partículas alfa, folha de ouro e tela que brilha
//   passo 2: a maioria das partículas atravessa a folha
//   passo 3: algumas se desviam e pouquíssimas voltam
//   passo 4: zoom num átomo de ouro: quase tudo é espaço vazio
//   passo 5: perto do núcleo as partículas são repelidas; de frente, voltam
//   passo 6: o modelo nuclear (planetário)
//   passo 7: o que o modelo não explicava (o elétron cairia no núcleo)
//   passo 8: brincar (disparar partículas alfa e ver o que acontece)
//
// As trajetórias dentro do átomo (passos 4, 5 e 8) são calculadas com a física do
// espalhamento de Rutherford: a partícula alfa (positiva) é repelida pelo núcleo
// (positivo) com uma força que diminui com o quadrado da distância.

export const STEP_COUNT = 9

const PLAY_STEP = 8
const C = {
  coral: '#ff7a6b',
  alpha: '#ff9d8f',
  violet: '#b69cff',
  electron: '#7ee7ff',
  gold: '#ffcf5a',
  steel: '#aab4dc',
  flash: 'rgba(255,242,194,1)',
}

// Laboratório (escala grande)
const SPHERE_R = 2.4 // tela que brilha, em volta da folha
const MOUTH_X = -3.0 // boca da fonte de partículas
const FOIL_SIZE = 1.8

// Átomo (escala atômica)
const ATOM_START_X = -5.6
const ATOM_END_X = 5.8
const SCAT_D = 0.32 // aproximação mínima numa colisão de frente
const ALPHA_SPEED = 6
const AIM_RADIUS = 3.2
const ORBIT_R = 2.6

const POOL = 64
const MAX_POINTS = 520
const CAMERA_AZIMUTH = 0.45

const v = (x, y, z) => new THREE.Vector3(x, y, z)

// ---------- Física do espalhamento ----------

// Trajetória de uma partícula alfa que passa a uma distância `b` do núcleo.
// phi é o ângulo (em volta do eixo do feixe) do lado por onde ela passa.
export function scatterPath(b, phi, D = SCAT_D, speed = ALPHA_SPEED) {
  const k = (D * speed * speed) / 2 // D = distância mínima numa colisão de frente
  const pos = v(ATOM_START_X, b * Math.cos(phi), b * Math.sin(phi))
  const vel = v(speed, 0, 0)
  const pts = [pos.clone()]
  const times = [0]
  let t = 0
  let last = pos.clone()
  for (let i = 0; i < 8000; i++) {
    const r = pos.length()
    const dt = Math.min(0.02, (0.03 * r) / vel.length())
    vel.addScaledVector(pos, (k / (r * r * r)) * dt)
    pos.addScaledVector(vel, dt)
    t += dt
    const done = pos.x > ATOM_END_X || pos.x < ATOM_START_X - 0.2 || (pos.length() > 8.5 && pos.dot(vel) > 0)
    if (done || pos.distanceTo(last) >= 0.06) {
      pts.push(pos.clone())
      times.push(t)
      last = pos.clone()
    }
    if (done) break
  }
  const angle = (Math.acos(clamp(vel.clone().normalize().x, -1, 1)) * 180) / Math.PI
  return { pts, times, angle, kind: angle < 15 ? 'pass' : angle < 90 ? 'deflect' : 'back' }
}

// Trajetória em linha reta por alguns pontos, na velocidade dada
function polylinePath(points, speed) {
  const pts = [points[0].clone()]
  const times = [0]
  let s = 0
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const len = a.distanceTo(b)
    const n = Math.max(1, Math.ceil(len / 0.12))
    for (let k = 1; k <= n; k++) {
      pts.push(a.clone().lerp(b, k / n))
      times.push((s + (len * k) / n) / speed)
    }
    s += len
  }
  return { pts, times, angle: 0, kind: 'pass' }
}

// ---------- Parâmetros de cada passo ----------

const P0 = {
  pudim: 0, // modelo de Thomson (passo 0)
  lab: 0, // laboratório: fonte, folha e tela
  zoom: 0, // aproximação da folha até o átomo
  parts: 0, // nomes das partes do laboratório
  atom: 0, // átomo: núcleo e elétrons
  orbits: 0, // órbitas desenhadas
  nuLabel: 0, // rótulo "Núcleo (+)"
  eLabel: 0, // rótulo "Elétrons (−)"
  fall: 0, // elétron caindo no núcleo
  q: 0, // ponto de interrogação
  counter: 0, // contagem de partículas
  hint: 0, // dica "clique para disparar"
  camX: 0, // deslocamento lateral da câmera
}

const STEP_PARAMS = [
  { pudim: 1 },
  { lab: 1, parts: 1, camX: -1.2 },
  { lab: 1, camX: -1.2 },
  { lab: 1, camX: -1.2 },
  { zoom: 1, atom: 1 },
  { zoom: 1, atom: 1, nuLabel: 1 },
  { zoom: 1, atom: 1, orbits: 1, nuLabel: 1, eLabel: 1 },
  { zoom: 1, atom: 1, orbits: 1, fall: 1, q: 1 },
  { zoom: 1, atom: 1, counter: 1, hint: 1 },
]

const WINDOW = {
  pudim: [0, 0.7],
  lab: [0, 0.7],
  parts: [0, 0.6],
  atom: [0.3, 1],
  orbits: [0.2, 1],
  nuLabel: [0.4, 1],
  eLabel: [0.4, 1],
  fall: [0.2, 1],
  q: [0.3, 1],
  counter: [0.4, 1],
  hint: [0.4, 1],
}

const paramsFor = (step) => ({ ...P0, ...STEP_PARAMS[step] })

// Órbitas dos elétrons (modelo planetário)
const ORBITS = [
  { tilt: 0, yaw: 0, speed: 0.9, phase: 0 },
  { tilt: 1.05, yaw: 0.6, speed: 0.75, phase: 2 },
  { tilt: -1.0, yaw: -0.7, speed: 1.0, phase: 4 },
  { tilt: 0.5, yaw: 1.8, speed: 0.62, phase: 1 },
]

function fibonacci(n, radius) {
  const out = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    out.push(v(Math.cos(golden * i) * r * radius, y * radius, Math.sin(golden * i) * r * radius))
  }
  return out
}

// ---------- O mundo ----------

export function createRutherfordWorld(stage, { reduced = false } = {}) {
  const { scene, camera, controls, host } = stage
  const light = stage.light
  const seg = light ? 20 : 36
  const poolSize = light ? 40 : POOL

  const root = new THREE.Group()
  scene.add(root)
  const sphereGeo = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7))

  // materiais que acompanham cada grupo (opacidade = base * parâmetro)
  const fades = { pudim: [], lab: [], atom: [] }
  const track = (group, material) => {
    material.transparent = true
    fades[group].push({ material, base: material.opacity })
    return material
  }

  // ----- Modelo de Thomson (passo 0) -----
  const pudim = new THREE.Group()
  root.add(pudim)
  const pudimMat = track('pudim', new THREE.MeshPhysicalMaterial({ color: C.violet, opacity: 0.3, roughness: 0.15, depthWrite: false }))
  const pudimMesh = new THREE.Mesh(sphereGeo, pudimMat)
  pudimMesh.scale.setScalar(1.9)
  const pudimGlow = new THREE.Mesh(
    sphereGeo,
    track('pudim', new THREE.MeshBasicMaterial({ color: C.violet, opacity: 0.14, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false })),
  )
  pudimGlow.scale.setScalar(1.99)
  pudim.add(pudimMesh, pudimGlow)
  fibonacci(8, 1.25).forEach((p) => {
    const m = new THREE.Mesh(
      sphereGeo,
      track('pudim', new THREE.MeshStandardMaterial({ color: C.electron, emissive: new THREE.Color(C.electron), emissiveIntensity: 0.6, roughness: 0.35 })),
    )
    m.position.copy(p)
    m.scale.setScalar(0.17)
    pudim.add(m)
  })
  const pudimLabel = makeLabel({ text: 'Modelo de Thomson', color: C.violet, size: [5.6, 0.8] })
  pudimLabel.position.set(0, -2.55, 0)
  const predictionLabel = makeLabel({ text: 'Previsão: atravessam', color: '#ffffff', size: [5.4, 0.7] })
  predictionLabel.position.set(0, 2.75, 0)
  root.add(pudimLabel, predictionLabel)

  // ----- Laboratório -----
  const lab = new THREE.Group()
  root.add(lab)
  const steel = () => track('lab', new THREE.MeshStandardMaterial({ color: C.steel, metalness: 0.85, roughness: 0.32 }))

  // tela que brilha (esfera ao redor da folha)
  const shellGeo = new THREE.SphereGeometry(SPHERE_R, 36, 22)
  lab.add(
    new THREE.Mesh(shellGeo, track('lab', new THREE.MeshBasicMaterial({ color: C.electron, opacity: 0.05, side: THREE.DoubleSide, depthWrite: false }))),
    new THREE.Mesh(shellGeo, track('lab', new THREE.MeshBasicMaterial({ color: C.electron, opacity: 0.16, wireframe: true, depthWrite: false }))),
  )

  // folha de ouro e moldura
  const foil = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, FOIL_SIZE, FOIL_SIZE),
    track('lab', new THREE.MeshStandardMaterial({ color: C.gold, metalness: 0.9, roughness: 0.28, emissive: new THREE.Color('#a87a10'), emissiveIntensity: 0.25 })),
  )
  lab.add(foil)
  const frameMat = steel()
  for (const [sy, sz, py, pz] of [
    [0.06, FOIL_SIZE + 0.12, FOIL_SIZE / 2 + 0.03, 0],
    [0.06, FOIL_SIZE + 0.12, -FOIL_SIZE / 2 - 0.03, 0],
    [FOIL_SIZE + 0.12, 0.06, 0, FOIL_SIZE / 2 + 0.03],
    [FOIL_SIZE + 0.12, 0.06, 0, -FOIL_SIZE / 2 - 0.03],
  ]) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.08, sy, sz), frameMat)
    bar.position.set(0, py, pz)
    lab.add(bar)
  }

  // fonte de partículas alfa: bloco de chumbo com um furo
  const block = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 1.3, 1.3),
    track('lab', new THREE.MeshStandardMaterial({ color: '#59618f', metalness: 0.3, roughness: 0.6 })),
  )
  block.position.x = -4.15
  const barrelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.5, 24)
  barrelGeo.rotateZ(Math.PI / 2)
  const barrel = new THREE.Mesh(barrelGeo, steel())
  barrel.position.x = MOUTH_X - 0.25
  lab.add(block, barrel)

  const mouthGlow = makeGlow('rgba(255,157,143,1)', 0.9)
  mouthGlow.position.set(MOUTH_X, 0, 0)
  root.add(mouthGlow)

  const partLabels = [
    makeLabel({ text: 'Fonte de partículas alfa (+)', color: '#ffffff', size: [5.2, 0.6] }),
    makeLabel({ text: 'Folha de ouro', color: C.gold, size: [3.2, 0.6] }),
    makeLabel({ text: 'Tela que brilha', color: C.electron, size: [3.6, 0.6] }),
  ]
  partLabels[0].position.set(-4.15, -1.5, 0)
  partLabels[1].position.set(0.2, 1.45, 0)
  partLabels[2].position.set(1.5, -2.85, 0)
  root.add(...partLabels)

  // ----- Átomo -----
  const atom = new THREE.Group()
  root.add(atom)
  const nucleusMat = track('atom', new THREE.MeshBasicMaterial({ color: '#ffd9d2' }))
  const nucleus = new THREE.Mesh(sphereGeo, nucleusMat)
  nucleus.scale.setScalar(0.16)
  atom.add(nucleus)
  const nucleusGlow = makeGlow('rgba(255,122,107,1)', 1.5)
  atom.add(nucleusGlow)
  const boundary = new THREE.Mesh(
    new THREE.SphereGeometry(ORBIT_R + 0.3, 28, 16),
    track('atom', new THREE.MeshBasicMaterial({ color: C.electron, opacity: 0.06, wireframe: true, depthWrite: false })),
  )
  atom.add(boundary)

  const orbitGroups = ORBITS.map((o, k) => {
    const g = new THREE.Group()
    g.rotation.set(o.tilt, o.yaw, 0)
    const ringGeo = new THREE.TorusGeometry(ORBIT_R, 0.012, 6, 96)
    ringGeo.rotateX(Math.PI / 2)
    const ringMat = new THREE.MeshBasicMaterial({ color: C.electron, transparent: true, opacity: 0, depthWrite: false })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    const eMat = track('atom', new THREE.MeshStandardMaterial({ color: C.electron, emissive: new THREE.Color(C.electron), emissiveIntensity: 0.7, roughness: 0.3 }))
    const electron = new THREE.Mesh(sphereGeo, eMat)
    electron.scale.setScalar(0.1)
    g.add(ring, electron)
    atom.add(g)
    return { group: g, ring, ringMat, electron, eMat, angle: o.phase, k }
  })

  const nuLabel = makeLabel({ text: 'Núcleo (+)', color: '#ffd9d2', size: [3.0, 0.6] })
  nuLabel.position.set(0, 0.8, 0)
  const eLabel = makeLabel({ text: 'Elétrons (−)', color: C.electron, size: [3.4, 0.6] })
  eLabel.position.set(2.4, 1.9, 0)
  const qLabel = makeLabel({ text: '?', color: '#ffffff', size: [1.2, 1.2] })
  const counterLabel = makeLabel({ text: '', color: '#ffffff', size: [9.0, 0.8] })
  counterLabel.position.set(0, 3.05, 0)
  const hintLabel = makeLabel({ text: 'Clique ou arraste para disparar', color: '#ffffff', size: [7.0, 0.62] })
  hintLabel.position.set(0, -3.15, 0)
  root.add(nuLabel, eLabel, qLabel, counterLabel, hintLabel)

  // área de pontaria (brincar)
  const targetGeo = new THREE.TorusGeometry(AIM_RADIUS, 0.015, 6, 96)
  targetGeo.rotateY(Math.PI / 2)
  const targetRingMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false })
  const targetRing = new THREE.Mesh(targetGeo, targetRingMat)
  const aimGeo = new THREE.RingGeometry(0.13, 0.18, 28)
  aimGeo.rotateY(Math.PI / 2)
  const aimMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false })
  const aimRing = new THREE.Mesh(aimGeo, aimMat)
  aimRing.visible = false
  root.add(targetRing, aimRing)

  // ----- Partículas alfa e brilhos -----
  const particleMat = new THREE.MeshBasicMaterial({ color: C.alpha })
  const particles = Array.from({ length: poolSize }, () => {
    const mesh = new THREE.Mesh(sphereGeo, particleMat)
    mesh.visible = false
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_POINTS * 3), 3))
    geo.setDrawRange(0, 0)
    const mat = new THREE.LineBasicMaterial({ color: C.alpha, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    const line = new THREE.Line(geo, mat)
    line.frustumCulled = false
    line.visible = false
    root.add(mesh, line)
    return { mesh, geo, mat, line, active: false, state: 'idle', pts: null, times: null, idx: 0, t: 0, radius: 0.09, info: null, count: false, flash: false, born: 0 }
  })

  const flashes = Array.from({ length: light ? 50 : 90 }, () => {
    const s = makeGlow(C.flash, 0.6)
    root.add(s)
    return { sprite: s, age: 1, active: false }
  })

  // ----- Estado -----
  let step = 0
  let P = { ...P0 }
  let from = { ...P0 }
  let to = { ...P0 }
  let tween = null
  let interactive = false
  let userMoved = false
  let holding = null
  let aimAt = null
  let fireTimer = 0
  let clock = 0
  let nucleusPulse = 0
  let fallClock = 0
  let fallPulsed = false
  const counts = { pass: 0, deflect: 0, back: 0 }
  const rnd = mulberry32(21)
  const smallTweens = new Set()

  const onStart = () => {
    userMoved = true
  }
  controls.addEventListener?.('start', onStart)

  const homePosition = (camX) =>
    v(camX + Math.sin(CAMERA_AZIMUTH) * stage.home.z, stage.home.y, Math.cos(CAMERA_AZIMUTH) * stage.home.z)

  // ----- Partículas -----
  function fire(path, { radius = 0.09, count = false, flash = false } = {}) {
    let p = particles.find((x) => !x.active)
    if (!p) p = particles.reduce((a, b) => (a.born < b.born ? a : b))
    const n = Math.min(path.pts.length, MAX_POINTS)
    const arr = p.geo.attributes.position.array
    for (let i = 0; i < n; i++) {
      arr[i * 3] = path.pts[i].x
      arr[i * 3 + 1] = path.pts[i].y
      arr[i * 3 + 2] = path.pts[i].z
    }
    p.geo.attributes.position.needsUpdate = true
    p.geo.setDrawRange(0, 1)
    Object.assign(p, { active: true, state: 'fly', pts: path.pts, times: path.times, idx: 0, t: 0, radius, info: path, count, flash, born: clock, n })
    p.mat.opacity = 0.55
    p.mesh.position.copy(path.pts[0])
    p.mesh.scale.setScalar(radius)
    p.mesh.visible = true
    p.line.visible = true
    return p
  }

  function clearParticles() {
    for (const p of particles) {
      p.active = false
      p.state = 'idle'
      p.mesh.visible = false
      p.line.visible = false
    }
    for (const f of flashes) {
      f.active = false
      f.sprite.visible = false
    }
    holding = null
  }

  function flashAt(pos) {
    const f = flashes.find((x) => !x.active) ?? flashes[0]
    f.active = true
    f.age = 0
    f.sprite.position.copy(pos)
    f.sprite.visible = true
  }

  function refreshCounter() {
    setLabel(counterLabel, `Passaram: ${counts.pass}   Desviaram: ${counts.deflect}   Voltaram: ${counts.back}`, '#ffffff')
  }

  function resetCounts() {
    counts.pass = counts.deflect = counts.back = 0
    refreshCounter()
  }

  function updateParticles(dt) {
    for (const p of particles) {
      if (!p.active) continue
      if (p.state === 'fly') {
        p.t += dt
        const last = p.n - 1
        while (p.idx < last - 1 && p.times[p.idx + 1] <= p.t) p.idx++
        const t0 = p.times[p.idx]
        const t1 = p.times[Math.min(p.idx + 1, last)]
        const f = t1 > t0 ? clamp((p.t - t0) / (t1 - t0), 0, 1) : 1
        p.mesh.position.lerpVectors(p.pts[p.idx], p.pts[Math.min(p.idx + 1, last)], f)
        p.geo.setDrawRange(0, Math.min(p.idx + 2, p.n))
        if (p.mesh.position.lengthSq() < 0.36 && step >= 4) nucleusPulse = 1 // passou perto do núcleo
        if (p.t >= p.times[last]) {
          p.state = 'fade'
          p.fade = 0
          p.mesh.visible = false
          if (p.flash) flashAt(p.pts[last])
          if (p.count) {
            counts[p.info.kind] += 1
            refreshCounter()
          }
        }
      } else {
        p.fade += dt
        p.mat.opacity = 0.55 * Math.max(0, 1 - p.fade / 1.6)
        if (p.fade >= 1.6) {
          p.active = false
          p.state = 'idle'
          p.line.visible = false
        }
      }
    }
    for (const f of flashes) {
      if (!f.active) continue
      f.age += dt / 0.9
      f.sprite.material.opacity = Math.max(0, 1 - f.age)
      f.sprite.scale.setScalar(0.35 + 0.5 * f.age)
      if (f.age >= 1) {
        f.active = false
        f.sprite.visible = false
      }
    }
  }

  // ----- Disparos de cada passo -----
  const pickKind = (weights) => {
    const r = rnd()
    return r < weights[0] ? 'pass' : r < weights[0] + weights[1] ? 'deflect' : 'back'
  }

  function fireMacro(kind) {
    const F = v(0, (rnd() * 2 - 1) * 0.18, (rnd() * 2 - 1) * 0.18)
    const theta = kind === 'pass' ? rnd() * 2.2 : kind === 'deflect' ? 8 + rnd() * 62 : 112 + rnd() * 58
    const phi = rnd() * Math.PI * 2
    const th = (theta * Math.PI) / 180
    const dir = v(Math.cos(th), Math.sin(th) * Math.cos(phi), Math.sin(th) * Math.sin(phi))
    const b = F.dot(dir)
    const c = F.lengthSq() - SPHERE_R * SPHERE_R
    const E = F.clone().addScaledVector(dir, -b + Math.sqrt(b * b - c))
    const path = polylinePath([v(MOUTH_X, 0, 0), F, E], 9)
    path.kind = kind
    return fire(path, { radius: 0.07, flash: true })
  }

  function firePrediction() {
    const r = Math.sqrt(rnd()) * 1.3
    const a = rnd() * Math.PI * 2
    const y0 = r * Math.cos(a)
    const z0 = r * Math.sin(a)
    const path = polylinePath([v(-5.2, y0, z0), v(0, y0 + (rnd() - 0.5) * 0.12, z0 + (rnd() - 0.5) * 0.12), v(5.2, y0 + (rnd() - 0.5) * 0.25, z0 + (rnd() - 0.5) * 0.25)], 5)
    return fire(path, { radius: 0.09 })
  }

  function fireAtom(b, phi, count = false) {
    return fire(scatterPath(Math.max(b, 0.03), phi), { radius: 0.09, count })
  }

  function fireFar() {
    const b = Math.sqrt(lerp(1.25 * 1.25, AIM_RADIUS * AIM_RADIUS, rnd()))
    return fireAtom(b, rnd() * Math.PI * 2)
  }

  function fireNear() {
    const b = rnd() < 0.22 ? 0.06 + 0.1 * rnd() : 0.25 + 0.95 * rnd()
    return fireAtom(b, rnd() * Math.PI * 2)
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

  function setCursor(c) {
    const dom = stage.renderer?.domElement
    if (dom?.style) dom.style.cursor = c
  }

  function goTo(newStep, { immediate = false, replay = false } = {}) {
    stopTween()
    const target = clamp(newStep, 0, STEP_COUNT - 1)
    const previous = step
    step = target
    interactive = false
    if (holding) controls.enabled = true // arraste interrompido
    holding = null
    aimAt = null
    aimRing.visible = false
    setCursor('')
    clearParticles()
    fireTimer = 0
    fallClock = 0
    fallPulsed = false
    resetCounts()

    if (replay) {
      const prevStep = target === 0 ? 1 : target - 1
      P = paramsFor(prevStep)
    }
    from = { ...P }
    to = paramsFor(target)

    if (userMoved || immediate) {
      userMoved = false
      const start = camera.position.clone()
      const home = homePosition(to.camX)
      if (immediate || reduced) camera.position.copy(home)
      else smallTween(1.2, (e) => camera.position.lerpVectors(start, home, e))
      controls.target.set(to.camX, 0, 0)
    }

    const duration = immediate || reduced ? 0.001 : target === 4 && previous === 3 ? 2.6 : 1.6
    if (immediate) {
      applyProgress(1)
      interactive = target === PLAY_STEP
      return
    }
    tween = animate(0, 1, {
      duration,
      ease: [0.22, 0.8, 0.2, 1],
      onUpdate: applyProgress,
      onComplete: () => {
        applyProgress(1)
        tween = null
        interactive = target === PLAY_STEP
        if (interactive) setCursor('crosshair')
      },
    })
  }

  // ----- Brincar: disparar partículas com o mouse -----
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const aimPlane = new THREE.Plane(v(1, 0, 0), 0)
  const point = new THREE.Vector3()

  function aimFrom(e) {
    const dom = stage.renderer.domElement
    const r = dom.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    if (!ray.ray.intersectPlane(aimPlane, point)) return null
    const b = Math.hypot(point.y, point.z)
    if (b > AIM_RADIUS + 0.35) return null
    return { y: point.y, z: point.z, b: Math.min(Math.max(b, 0.03), AIM_RADIUS), phi: Math.atan2(point.z, point.y) }
  }

  function shootAt(a) {
    if (a) fireAtom(a.b, a.phi, true)
  }

  function onPointerDown(e) {
    if (!interactive || e.button > 0) return // botão direito continua girando a câmera
    const a = aimFrom(e)
    if (!a) return
    e.stopPropagation()
    controls.enabled = false
    holding = { pointerId: e.pointerId }
    aimAt = a
    shootAt(a)
    fireTimer = 0
    window.addEventListener('pointermove', onHoldMove)
    window.addEventListener('pointerup', onHoldEnd)
  }

  function onHoldMove(e) {
    if (!holding) return
    aimAt = aimFrom(e) ?? aimAt
  }

  function onHoldEnd() {
    window.removeEventListener('pointermove', onHoldMove)
    window.removeEventListener('pointerup', onHoldEnd)
    controls.enabled = true
    holding = null
  }

  function onHover(e) {
    if (!interactive || holding) return
    aimAt = aimFrom(e)
  }

  host.addEventListener?.('pointerdown', onPointerDown, true)
  host.addEventListener?.('pointermove', onHover)

  // ----- Desenho a cada quadro -----
  const off = stage.onTick((dt, t) => {
    clock = t
    const p = P

    // disparos automáticos de cada passo
    fireTimer += dt
    if (step === 0 && p.pudim > 0.6 && fireTimer > 1.1) {
      fireTimer = 0
      firePrediction()
    } else if (step === 2 && p.lab > 0.6 && fireTimer > 0.14) {
      fireTimer = 0
      fireMacro('pass')
    } else if (step === 3 && p.lab > 0.6 && fireTimer > 0.14) {
      fireTimer = 0
      fireMacro(pickKind([0.72, 0.22, 0.06]))
    } else if (step === 4 && p.atom > 0.6 && fireTimer > 0.22) {
      fireTimer = 0
      fireFar()
    } else if (step === 5 && p.atom > 0.6 && fireTimer > 0.3) {
      fireTimer = 0
      fireNear()
    } else if (step === PLAY_STEP && holding && aimAt && fireTimer > 0.09) {
      fireTimer = 0
      shootAt(aimAt)
    }
    updateParticles(dt)

    // Thomson (passo 0)
    pudim.visible = p.pudim > 0.01
    pudim.scale.setScalar(0.55 + 0.45 * p.pudim)
    for (const f of fades.pudim) f.material.opacity = f.base * p.pudim
    pudimLabel.material.opacity = predictionLabel.material.opacity = p.pudim
    pudimLabel.visible = predictionLabel.visible = p.pudim > 0.01

    // laboratório
    lab.visible = p.lab > 0.01
    lab.scale.setScalar(lerp(1, 7, smooth(p.zoom)))
    for (const f of fades.lab) f.material.opacity = f.base * p.lab
    partLabels.forEach((l) => {
      l.material.opacity = p.parts * p.lab
      l.visible = l.material.opacity > 0.01
    })
    mouthGlow.material.opacity = p.lab * (0.5 + 0.2 * Math.sin(t * 4))
    mouthGlow.visible = p.lab > 0.01

    // átomo
    const as = p.atom
    atom.visible = as > 0.01
    atom.scale.setScalar(0.4 + 0.6 * as)
    for (const f of fades.atom) f.material.opacity = f.base * as
    nucleusPulse = Math.max(0, nucleusPulse - dt * 3)
    nucleus.scale.setScalar(0.16 * (1 + 0.5 * nucleusPulse))
    nucleusGlow.visible = as > 0.01
    nucleusGlow.material.opacity = as * (0.55 + 0.25 * Math.sin(t * 2.2) + 0.4 * nucleusPulse)
    nucleusGlow.scale.setScalar(1.5 + 0.9 * nucleusPulse)

    // elétrons girando (um deles pode "cair" no núcleo)
    if (p.fall > 0.01) {
      fallClock += dt / 4.2
      if (fallClock >= 1 && !fallPulsed) {
        nucleusPulse = 1 // o elétron "bateu" no núcleo
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
    orbitGroups.forEach((o, k) => {
      const spec = ORBITS[k]
      let r = ORBIT_R
      let speed = spec.speed
      if (k === 0 && p.fall > 0.01) {
        const rf = Math.max(0.24, ORBIT_R * (1 - clamp(fallClock, 0, 1)))
        r = lerp(ORBIT_R, rf, p.fall)
        speed = spec.speed * (ORBIT_R / r) ** 1.4
      }
      o.angle += dt * speed
      o.electron.position.set(Math.cos(o.angle) * r, 0, Math.sin(o.angle) * r)
      o.ringMat.opacity = p.orbits * as * (k === 0 && p.fall > 0.5 ? 0 : 0.35)
      o.ring.visible = o.ringMat.opacity > 0.01
      const dim = k === 0 ? 1 : 1 - 0.75 * p.fall
      o.eMat.opacity = as * dim
    })

    // rótulos
    const setOp = (l, op) => {
      l.material.opacity = op
      l.visible = op > 0.01
    }
    setOp(nuLabel, p.nuLabel * as)
    setOp(eLabel, p.eLabel * as)
    setOp(qLabel, p.q * as)
    qLabel.position.set(0.9, 1.0 + Math.sin(t * 2) * 0.1, 0)
    setOp(counterLabel, p.counter)
    setOp(hintLabel, p.hint)
    targetRingMat.opacity = 0.25 * p.hint
    targetRing.visible = p.hint > 0.01

    // marcador de pontaria
    if (interactive && aimAt) {
      aimRing.visible = true
      aimRing.position.set(0, aimAt.y, aimAt.z)
    } else {
      aimRing.visible = false
    }

    // câmera: foco e balanço suave enquanto ninguém mexeu nela
    controls.target.x = p.camX
    if (!userMoved && !holding && !reduced && !interactive) {
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
    window.removeEventListener('pointermove', onHoldMove)
    window.removeEventListener('pointerup', onHoldEnd)
    stage.onResize = null
    disposeTree(root)
    scene.remove(root)
  }

  P = { ...P0 }
  refreshCounter()

  return {
    goTo,
    dispose,
    // usado pelos testes e para depuração
    api: {
      particles,
      flashes,
      counts,
      scatterPath,
      fireAtom,
      fireMacro,
      get params() {
        return P
      },
      get step() {
        return step
      },
      setInteractive: (value) => (interactive = value),
      objects: { pudim, lab, atom, nucleus, orbitGroups, counterLabel, hintLabel, targetRing, nuLabel, eLabel, qLabel, predictionLabel, partLabels },
    },
  }
}
