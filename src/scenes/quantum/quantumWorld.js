import * as THREE from 'three'
import { animate } from 'framer-motion'
import { clamp, smooth, lerp, mulberry32, makeLabel, setLabel, makeGlow, disposeTree } from '../../three/helpers.js'

// Mundo 3D da cena do modelo atual (modelo quântico, orbitais).
//
//   passo 0: o modelo de Bohr e o que ele não explicava
//   passo 1: o elétron também se comporta como onda (de Broglie)
//   passo 2: não dá para saber a posição e o movimento exatos (Heisenberg)
//   passo 3: "foto instantânea": cada foto mostra um ponto, em lugares diferentes
//   passo 4: "longa exposição": muitas fotos formam uma nuvem
//   passo 5: o orbital: a região onde é mais provável encontrar o elétron
//   passo 6: orbitais com formas diferentes (s e p)
//   passo 7: o modelo atual
//   passo 8: brincar (tirar fotos do elétron e trocar de orbital)
//
// Os pontos da nuvem são sorteados de verdade, com a probabilidade do orbital do
// hidrogênio (unidades do raio de Bohr, a0):
//   1s:  densidade proporcional a e^(-2r)
//   2s:  densidade proporcional a (2 - r)^2 e^(-r)   (tem uma "casca" vazia em r = 2)
//   2p:  densidade proporcional a r^2 cos^2(θ) e^(-r) (dois lóbulos, como halteres)

export const STEP_COUNT = 9

const PLAY_STEP = 8
const TILT = 0.9
const ZOOM = 1.15
const CAMERA_AZIMUTH = 0.45
const RING_R = [1.0, 1.8, 2.6]
const K = 0.38 // unidades 3D por raio de Bohr
const S1 = 1.6 // ampliação do orbital 1s nas telas de ensino (para ficar visível)

const C = {
  green: '#5eead0',
  cyan: '#7ee7ff',
  coral: '#ff7a6b',
  amber: '#ffb454',
  violet: '#b69cff',
  pale: '#dfe6ff',
}

const v = (x, y, z) => new THREE.Vector3(x, y, z)

// ---------- Sorteio de pontos dos orbitais ----------

const expo = (rnd, rate) => -Math.log(1 - rnd()) / rate
const gammaInt = (rnd, k, rate) => {
  let s = 0
  for (let i = 0; i < k; i++) s += expo(rnd, rate)
  return s
}
function unitDir(rnd, out) {
  const u = rnd() * 2 - 1
  const a = rnd() * Math.PI * 2
  const s = Math.sqrt(1 - u * u)
  return out.set(s * Math.cos(a), u, s * Math.sin(a))
}

const f2s = (r) => r * r * (2 - r) * (2 - r) * Math.exp(-r)
let M2S = 0
for (let r = 0; r <= 20; r += 0.01) M2S = Math.max(M2S, f2s(r))

// Cada orbital devolve um ponto (em a0) sorteado conforme a probabilidade.
export const ORBITALS = {
  '1s': {
    name: 'Orbital 1s',
    color: C.green,
    scale: S1,
    sample: (rnd, out) => unitDir(rnd, out).multiplyScalar(gammaInt(rnd, 3, 2)),
  },
  '2s': {
    name: 'Orbital 2s',
    color: C.cyan,
    scale: 1,
    sample: (rnd, out) => {
      let r = rnd() * 18
      for (let i = 0; i < 400; i++) {
        r = rnd() * 18
        if (rnd() * M2S < f2s(r)) break
      }
      return unitDir(rnd, out).multiplyScalar(r)
    },
  },
  '2p': {
    name: 'Orbital 2p',
    color: C.amber,
    scale: 1,
    // eixo: 'x', 'y' ou 'z' (o haltere aponta nesse eixo)
    sample: (rnd, out, axis = 'y') => {
      const r = gammaInt(rnd, 5, 1)
      const c = Math.cbrt(2 * rnd() - 1) // cos(θ): densidade proporcional a cos²
      const s = Math.sqrt(1 - c * c)
      const a = rnd() * Math.PI * 2
      const p = r * s * Math.cos(a)
      const q = r * s * Math.sin(a)
      const along = r * c
      if (axis === 'x') return out.set(along, p, q)
      if (axis === 'z') return out.set(p, q, along)
      return out.set(p, along, q)
    },
  },
}

// Raio (em a0) que envolve cerca de 90% dos pontos de cada orbital (medido por sorteio)
export const R90 = {}
{
  const r = mulberry32(1234)
  const t = v(0, 0, 0)
  for (const id of Object.keys(ORBITALS)) {
    const rs = []
    for (let i = 0; i < 4000; i++) {
      ORBITALS[id].sample(r, t)
      rs.push(t.length())
    }
    rs.sort((a, b) => a - b)
    R90[id] = rs[Math.floor(rs.length * 0.9)]
  }
}

// ---------- Parâmetros de cada passo ----------

const P0 = {
  nucleus: 0, // núcleo
  rings: 0, // camadas do modelo de Bohr
  ball: 0, // elétron como bolinha
  wave: 0, // elétron como onda
  ghosts: 0, // elétron "borrado" (vários lugares)
  cloud: 0, // nuvem de pontos
  shell: 0, // superfície que envolve a nuvem
  forms: 0, // orbitais s e p lado a lado
  chips: 0, // botões de orbital (brincar)
  q: 0, // ponto de interrogação
  bohrLabel: 0,
  waveLabel: 0,
  ghostLabel: 0,
  orbLabel: 0,
  formLabels: 0,
  atomLabels: 0,
  counter: 0,
  hint: 0,
}

const STEP_PARAMS = [
  { nucleus: 1, rings: 1, ball: 1, q: 1, bohrLabel: 1 },
  { nucleus: 1, rings: 1, wave: 1, waveLabel: 1 },
  { nucleus: 1, rings: 0.3, ghosts: 1, q: 1, ghostLabel: 1 },
  { nucleus: 1, cloud: 1, counter: 1 },
  { nucleus: 1, cloud: 1, counter: 1 },
  { nucleus: 1, cloud: 1, shell: 1, orbLabel: 1 },
  { forms: 1, formLabels: 1 },
  { nucleus: 1, cloud: 1, shell: 0.5, atomLabels: 1 },
  { nucleus: 1, cloud: 1, chips: 1, counter: 1, hint: 1, orbLabel: 1 },
]

const WINDOW = {
  rings: [0.1, 0.9],
  ball: [0, 0.6],
  wave: [0.2, 1],
  ghosts: [0.2, 1],
  cloud: [0.1, 0.9],
  forms: [0.2, 1],
  chips: [0.2, 1],
}

const paramsFor = (step) => ({ ...P0, ...STEP_PARAMS[step] })

// ---------- O mundo ----------

export function createQuantumWorld(stage, { reduced = false } = {}) {
  const { scene, camera, controls, host } = stage
  const light = stage.light
  const seg = light ? 18 : 30
  const FULL = light ? 1500 : 2600
  const CAP = light ? 3000 : 6000
  const FORM_N = light ? 700 : 1500

  const root = new THREE.Group()
  scene.add(root)
  const sphereGeo = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7))

  // ponto redondo e macio para a nuvem
  const dotCanvas = document.createElement('canvas')
  dotCanvas.width = dotCanvas.height = 64
  const dctx = dotCanvas.getContext('2d')
  const dg = dctx?.createRadialGradient?.(32, 32, 0, 32, 32, 32)
  if (dg) {
    dg.addColorStop(0, 'rgba(255,255,255,1)')
    dg.addColorStop(0.35, 'rgba(255,255,255,0.55)')
    dg.addColorStop(1, 'rgba(255,255,255,0)')
    dctx.fillStyle = dg
    dctx.fillRect(0, 0, 64, 64)
  }
  const dotTexture = new THREE.CanvasTexture(dotCanvas)

  function makeCloud(cap, color, size) {
    const pos = new Float32Array(cap * 3)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setDrawRange(0, 0)
    const mat = new THREE.PointsMaterial({ color, size, map: dotTexture, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
    const points = new THREE.Points(geo, mat)
    points.frustumCulled = false
    points.visible = false
    const cloud = {
      pos,
      geo,
      mat,
      points,
      cap,
      count: 0,
      next: 0,
      dirty: false,
      add(x, y, z) {
        const i = cloud.next
        pos[i * 3] = x
        pos[i * 3 + 1] = y
        pos[i * 3 + 2] = z
        cloud.next = (i + 1) % cap
        cloud.count = Math.min(cloud.count + 1, cap)
        cloud.dirty = true
      },
      clear() {
        cloud.count = 0
        cloud.next = 0
        cloud.dirty = true
      },
      flush() {
        if (!cloud.dirty) return
        geo.attributes.position.needsUpdate = true
        geo.setDrawRange(0, cloud.count)
        cloud.dirty = false
      },
    }
    return cloud
  }

  // ----- Átomo (camadas de Bohr, elétron, onda e "fantasmas") -----
  const atom = new THREE.Group()
  atom.rotation.x = TILT
  root.add(atom)

  const nucleusMat = new THREE.MeshBasicMaterial({ color: '#ffd9d2', transparent: true })
  const nucleus = new THREE.Mesh(sphereGeo, nucleusMat)
  nucleus.scale.setScalar(0.12)
  root.add(nucleus)
  const nucleusGlow = makeGlow('rgba(255,122,107,1)', 1.3)
  root.add(nucleusGlow)

  const ringMats = RING_R.map((r) => {
    const geo = new THREE.TorusGeometry(r, 0.018, 6, 120)
    geo.rotateX(Math.PI / 2)
    const mat = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0, depthWrite: false })
    atom.add(new THREE.Mesh(geo, mat))
    return mat
  })

  const ballMat = new THREE.MeshStandardMaterial({ color: C.cyan, emissive: new THREE.Color(C.cyan), emissiveIntensity: 0.8, roughness: 0.3, transparent: true })
  const ball = new THREE.Mesh(sphereGeo, ballMat)
  ball.scale.setScalar(0.1)
  const ballGlow = makeGlow('rgba(126,231,255,1)', 0.65)
  atom.add(ball, ballGlow)

  // onda estacionária (de Broglie): 2 comprimentos de onda na camada 2
  const WAVE_N = 180
  const WAVE_CYCLES = 2
  const waveGeo = new THREE.BufferGeometry()
  waveGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(WAVE_N * 3), 3))
  const waveMat = new THREE.LineBasicMaterial({ color: C.green, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const waveLine = new THREE.LineLoop(waveGeo, waveMat)
  waveLine.frustumCulled = false
  atom.add(waveLine)
  const waveGeo2 = waveGeo.clone()
  const waveLine2 = new THREE.LineLoop(waveGeo2, waveMat)
  waveLine2.frustumCulled = false
  atom.add(waveLine2)

  // elétron "borrado": várias aparições fracas em lugares diferentes
  const ghosts = Array.from({ length: 8 }, (_, i) => {
    const g = makeGlow('rgba(126,231,255,1)', 0.42)
    atom.add(g)
    return { sprite: g, age: i * 0.07, a: 0, r: 0, y: 0 }
  })

  // ----- Nuvem de probabilidade -----
  const cloudGroup = new THREE.Group()
  root.add(cloudGroup)
  const cloud = makeCloud(CAP, C.green, 0.085)
  cloudGroup.add(cloud.points)

  // superfícies que envolvem a nuvem (translúcidas)
  const shellMat = new THREE.MeshBasicMaterial({ color: C.green, transparent: true, opacity: 0, depthWrite: false })
  const shellWireMat = new THREE.MeshBasicMaterial({ color: C.green, transparent: true, opacity: 0, wireframe: true, depthWrite: false })
  const shellSphere = new THREE.Mesh(sphereGeo, shellMat)
  const shellWire = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), shellWireMat)
  cloudGroup.add(shellSphere, shellWire)
  const lobes = [1, -1].map((sg) => {
    const m = new THREE.Mesh(sphereGeo, shellMat)
    m.position.y = sg * 3.8 * K
    m.scale.set(2.4 * K, 4.2 * K, 2.4 * K)
    m.visible = false
    cloudGroup.add(m)
    return m
  })

  // ----- Orbitais s e p lado a lado (passo 6) -----
  const forms = new THREE.Group()
  root.add(forms)
  const formClouds = []
  {
    const rnd = mulberry32(5)
    const tmp = v(0, 0, 0)
    const s = makeCloud(FORM_N + 300, C.green, 0.085)
    for (let i = 0; i < FORM_N + 300; i++) {
      ORBITALS['1s'].sample(rnd, tmp)
      s.add(tmp.x * K * 2.3, tmp.y * K * 2.3, tmp.z * K * 2.3)
    }
    s.points.position.x = -3.3
    forms.add(s.points)
    formClouds.push(s)
    const pColors = [C.coral, C.amber, C.violet]
    ;['x', 'y', 'z'].forEach((axis, i) => {
      const p = makeCloud(FORM_N, pColors[i], 0.085)
      for (let k = 0; k < FORM_N; k++) {
        ORBITALS['2p'].sample(rnd, tmp, axis)
        p.add(tmp.x * K * 0.75, tmp.y * K * 0.75, tmp.z * K * 0.75)
      }
      p.points.position.x = 3.0
      forms.add(p.points)
      formClouds.push(p)
    })
    formClouds.forEach((c) => c.flush())
  }

  // ----- Fotos instantâneas (passo 3) -----
  const snaps = Array.from({ length: 5 }, () => {
    const g = makeGlow('rgba(94,234,208,1)', 0.34)
    root.add(g)
    return { sprite: g, age: 9 }
  })
  const flash = makeGlow('rgba(255,255,255,1)', 1.1)
  root.add(flash)
  let flashAge = 9

  // ----- Botões de orbital (brincar) -----
  const chips = new THREE.Group()
  chips.position.set(-5.0, 0, 0)
  root.add(chips)
  const chipDefs = ['1s', '2s', '2p'].map((id, i) => {
    const mat = new THREE.MeshBasicMaterial({ color: ORBITALS[id].color, transparent: true, opacity: 0 })
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.7, 0.06), mat)
    mesh.position.y = 1.2 - i * 1.2
    mesh.userData.orbital = id
    const label = makeLabel({ text: id, color: '#06102a', size: [1.0, 0.55] })
    label.position.set(0, mesh.position.y, 0.08)
    chips.add(mesh, label)
    return { id, mesh, mat, label }
  })

  // ----- Textos 3D -----
  const place = (label, x, y) => {
    label.position.set(x, y, 0)
    root.add(label)
    return label
  }
  const bohrLabel = place(makeLabel({ text: 'Modelo de Bohr', color: C.cyan, size: [4.6, 0.55] }), 0, -3.4)
  const waveLabel = place(makeLabel({ text: 'O elétron também é uma onda', color: C.green, size: [6.4, 0.55] }), 0, -3.4)
  const ghostLabel = place(makeLabel({ text: 'Onde está o elétron?', color: '#ffffff', size: [5.2, 0.55] }), 0, -3.4)
  const qLabel = place(makeLabel({ text: '?', color: '#ffffff', size: [1.0, 1.0] }), 3.0, 2.3)
  const orbLabel = place(makeLabel({ text: 'Orbital 1s', color: C.green, size: [3.6, 0.55] }), 0, -2.9)
  const sLabel = place(makeLabel({ text: 'Orbital s (esfera)', color: C.green, size: [4.2, 0.48] }), -3.3, -3.2)
  const pLabel = place(makeLabel({ text: 'Orbitais p (halteres)', color: C.amber, size: [4.6, 0.48] }), 3.0, -3.2)
  const nuLabel = place(makeLabel({ text: 'Núcleo (+)', color: '#ffd9d2', size: [2.6, 0.5] }), -3.9, 2.4)
  const cloudLabel = place(makeLabel({ text: 'Nuvem de probabilidade', color: C.green, size: [4.4, 0.5] }), 3.1, 2.5)
  const counterLabel = place(makeLabel({ text: '', color: '#ffffff', size: [6.4, 0.5] }), 0, 3.7)
  const hintLabel = place(makeLabel({ text: 'Clique: uma foto · segure: longa exposição', color: '#ffffff', size: [8.2, 0.5] }), 0, 3.1)
  const chipLabel = place(makeLabel({ text: 'Escolha o orbital', color: '#ffffff', size: [3.4, 0.5] }), -5.0, 2.45)

  const mkLeader = (a, b) => {
    const mat = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false })
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), mat)
    root.add(line)
    return { line, mat }
  }
  const leaderNu = mkLeader(v(-3.0, 2.2, 0), v(-0.12, 0.1, 0))
  const leaderCloud = mkLeader(v(2.2, 2.3, 0), v(1.0, 0.95, 0))

  // ----- Estado -----
  let step = 0
  let P = { ...P0 }
  let from = { ...P0 }
  let to = { ...P0 }
  let tween = null
  let interactive = false
  let userMoved = false
  let mode = null // 'snap' | 'accum' | 'full' | 'toy'
  let toyOrbital = '1s'
  let snapN = 0
  let snapTimer = 0
  let accumCarry = 0
  let holding = null
  let holdTime = 0
  let holdCarry = 0
  let hoverChip = ''
  let counterTimer = 0
  let counterKey = ''
  const smallTweens = new Set()
  const rnd = mulberry32(77)
  const tmp = v(0, 0, 0)

  const onStart = () => {
    userMoved = true
  }
  controls.addEventListener?.('start', onStart)
  controls.maxDistance = Math.max(controls.maxDistance ?? 18, 30)

  const homePosition = () =>
    v(Math.sin(CAMERA_AZIMUTH) * stage.home.z * ZOOM, stage.home.y * ZOOM, Math.cos(CAMERA_AZIMUTH) * stage.home.z * ZOOM)

  // ----- Pontos da nuvem -----
  function currentOrbital() {
    return mode === 'toy' ? ORBITALS[toyOrbital] : ORBITALS['1s']
  }

  function samplePoint(out) {
    const o = currentOrbital()
    o.sample(rnd, out, 'y')
    return out.multiplyScalar(K * o.scale)
  }

  function addDot() {
    samplePoint(tmp)
    cloud.add(tmp.x, tmp.y, tmp.z)
  }

  function fillCloud(n) {
    while (cloud.count < n) addDot()
  }

  function setOrbital(id) {
    toyOrbital = id
    const o = ORBITALS[id]
    cloud.mat.color.set(o.color)
    shellMat.color.set(o.color)
    shellWireMat.color.set(o.color)
    cloud.clear()
    setLabel(orbLabel, o.name, o.color)
    counterKey = ''
  }

  function updateShell() {
    const id = mode === 'toy' ? toyOrbital : '1s'
    const o = ORBITALS[id]
    const r90 = R90[id] // envolve cerca de 90% dos pontos
    shellSphere.scale.setScalar(r90 * K * o.scale)
    shellWire.scale.setScalar(r90 * K * o.scale)
    const isP = id === '2p'
    shellSphere.visible = shellWire.visible = !isP
    lobes.forEach((l) => (l.visible = isP))
  }

  function addSnap(pos) {
    const s = snaps.find((x) => x.age >= 1.4) ?? snaps[0]
    s.age = 0
    s.sprite.position.copy(pos)
    s.sprite.visible = true
    flash.position.copy(pos)
    flashAge = 0
  }

  function clearSnaps() {
    snaps.forEach((s) => {
      s.age = 9
      s.sprite.visible = false
    })
    flashAge = 9
    flash.visible = false
  }

  function refreshCounter(force = false) {
    let text = ''
    if (mode === 'snap') text = snapN ? `Foto ${snapN}: um ponto` : 'Foto instantânea'
    else if (mode === 'accum' || mode === 'toy') text = `Pontos: ${cloud.count}`
    const key = `${mode}|${text}`
    if (!force && key === counterKey) return
    counterKey = key
    setLabel(counterLabel, text, '#ffffff')
  }

  // ----- Roteiro de cada passo -----
  function enter(target) {
    cloud.clear()
    clearSnaps()
    snapN = 0
    snapTimer = 0.7
    accumCarry = 0
    mode = target === 3 ? 'snap' : target === 4 ? 'accum' : target === 5 || target === 7 ? 'full' : target === PLAY_STEP ? 'toy' : null
    if (mode === 'toy') setOrbital('1s')
    else {
      toyOrbital = '1s'
      cloud.mat.color.set(C.green)
      shellMat.color.set(C.green)
      shellWireMat.color.set(C.green)
      setLabel(orbLabel, 'Orbital 1s', C.green)
    }
    if (mode === 'full') fillCloud(FULL)
    updateShell()
    counterKey = ''
    refreshCounter(true)
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

  function smallTween(duration, onUpdate) {
    const tw = animate(0, 1, {
      duration: reduced ? 0.001 : duration,
      ease: [0.22, 0.8, 0.2, 1],
      onUpdate,
      onComplete: () => smallTweens.delete(tw),
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
    if (holding) controls.enabled = true
    holding = null
    hoverChip = ''
    setCursor('')
    enter(target)

    if (replay) {
      const prevStep = target === 0 ? 1 : target - 1
      P = paramsFor(prevStep)
    }
    from = { ...P }
    to = paramsFor(target)

    if (userMoved || immediate) {
      userMoved = false
      const start = camera.position.clone()
      const home = homePosition()
      if (immediate || reduced) camera.position.copy(home)
      else smallTween(1.2, (e) => camera.position.lerpVectors(start, home, e))
      controls.target.set(0, 0, 0)
    }

    const finish = () => {
      applyProgress(1)
      tween = null
      interactive = target === PLAY_STEP
      if (interactive) setCursor('crosshair')
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

  // ----- Brincar: fotos do elétron e troca de orbital -----
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()

  function pickChip(e) {
    const dom = stage.renderer.domElement
    const r = dom.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    scene.updateMatrixWorld(true)
    const hit = ray.intersectObjects(chipDefs.map((c) => c.mesh), false)[0]
    return hit ? hit.object.userData.orbital : ''
  }

  function takePhoto() {
    addDot()
    cloud.flush()
    refreshCounter()
  }

  function onPointerDown(e) {
    if (!interactive || e.button > 0) return // botão direito continua girando a câmera
    e.stopPropagation()
    const id = pickChip(e)
    if (id) {
      setOrbital(id)
      updateShell()
      refreshCounter(true)
      return
    }
    controls.enabled = false
    holding = true
    holdTime = 0
    holdCarry = 0
    takePhoto()
    window.addEventListener('pointerup', onHoldEnd)
  }

  function onHoldEnd() {
    window.removeEventListener('pointerup', onHoldEnd)
    controls.enabled = true
    holding = null
  }

  function onHover(e) {
    if (!interactive || holding) return
    hoverChip = pickChip(e)
    setCursor(hoverChip ? 'pointer' : 'crosshair')
  }

  host.addEventListener?.('pointerdown', onPointerDown, true)
  host.addEventListener?.('pointermove', onHover)

  // ----- Desenho a cada quadro -----
  const waveBuf = waveGeo.attributes.position.array
  const waveBuf2 = waveGeo2.attributes.position.array

  const off = stage.onTick((dt, t) => {
    const p = P

    // ---- modos ----
    if (mode === 'snap' && p.cloud >= 0 && step === 3) {
      snapTimer -= dt
      if (snapTimer <= 0) {
        snapTimer = 1.15
        snapN += 1
        samplePoint(tmp)
        addSnap(tmp)
        refreshCounter()
      }
    } else if (mode === 'accum' && step === 4 && p.cloud > 0.6) {
      accumCarry += dt * 260
      const n = Math.floor(accumCarry)
      accumCarry -= n
      for (let i = 0; i < n && cloud.count < FULL; i++) addDot()
      counterTimer += dt
      if (counterTimer > 0.15) {
        counterTimer = 0
        refreshCounter()
      }
    } else if (mode === 'toy' && holding) {
      holdTime += dt
      if (holdTime > 0.3) {
        holdCarry += dt * 150
        const n = Math.floor(holdCarry)
        holdCarry -= n
        for (let i = 0; i < n; i++) addDot()
        counterTimer += dt
        if (counterTimer > 0.1) {
          counterTimer = 0
          refreshCounter()
        }
      }
    }
    if (mode === 'toy' && !holding) {
      counterTimer += dt
      if (counterTimer > 0.3) {
        counterTimer = 0
        refreshCounter()
      }
    }
    cloud.flush()

    // ---- núcleo ----
    nucleus.visible = p.nucleus > 0.01
    nucleusMat.opacity = p.nucleus
    nucleusGlow.visible = p.nucleus > 0.01
    nucleusGlow.material.opacity = p.nucleus * (0.55 + 0.2 * Math.sin(t * 2.2))

    // ---- camadas e elétron como bolinha ----
    ringMats.forEach((m, i) => {
      m.opacity = p.rings * (i === 1 ? 0.45 : 0.25)
    })
    const ang = t * 1.4
    ball.position.set(Math.cos(ang) * RING_R[1], 0, Math.sin(ang) * RING_R[1])
    ballGlow.position.copy(ball.position)
    ballMat.opacity = p.ball
    ball.visible = p.ball > 0.01
    ballGlow.visible = ball.visible
    ballGlow.material.opacity = p.ball * 0.9

    // ---- onda estacionária ----
    const showWave = p.wave > 0.01
    waveLine.visible = waveLine2.visible = showWave
    waveMat.opacity = p.wave * 0.9
    if (showWave) {
      const amp = 0.32 * Math.cos(t * 2.2)
      for (let i = 0; i < WAVE_N; i++) {
        const th = (i / WAVE_N) * Math.PI * 2
        const y = amp * Math.sin(WAVE_CYCLES * th)
        waveBuf[i * 3] = Math.cos(th) * RING_R[1]
        waveBuf[i * 3 + 1] = y
        waveBuf[i * 3 + 2] = Math.sin(th) * RING_R[1]
        waveBuf2[i * 3] = Math.cos(th) * RING_R[1]
        waveBuf2[i * 3 + 1] = -y
        waveBuf2[i * 3 + 2] = Math.sin(th) * RING_R[1]
      }
      waveGeo.attributes.position.needsUpdate = true
      waveGeo2.attributes.position.needsUpdate = true
    }

    // ---- elétron "borrado" ----
    ghosts.forEach((g) => {
      g.age += dt
      if (g.age > 0.55) {
        g.age = 0
        g.a = rnd() * Math.PI * 2
        g.r = RING_R[1] + (rnd() - 0.5) * 1.1
        g.y = (rnd() - 0.5) * 0.7
        g.sprite.position.set(Math.cos(g.a) * g.r, g.y, Math.sin(g.a) * g.r)
      }
      const o = Math.sin(Math.PI * clamp(g.age / 0.55, 0, 1)) * 0.75 * p.ghosts
      g.sprite.material.opacity = o
      g.sprite.visible = o > 0.01
    })

    // ---- fotos instantâneas ----
    snaps.forEach((s) => {
      s.age += dt
      const o = s.age < 1.4 ? Math.max(0, 1 - Math.max(0, s.age - 0.5) / 0.9) : 0
      s.sprite.material.opacity = o
      s.sprite.visible = o > 0.01
      s.sprite.scale.setScalar(0.34)
    })
    flashAge += dt / 0.5
    flash.material.opacity = Math.max(0, 1 - flashAge) * 0.9
    flash.scale.setScalar(0.8 + 0.8 * flashAge)
    flash.visible = flashAge < 1

    // ---- nuvem e superfícies ----
    cloudGroup.rotation.y += dt * 0.12
    cloud.points.visible = p.cloud > 0.01
    cloud.mat.opacity = p.cloud * 0.9
    const pulse = 0.85 + 0.15 * Math.sin(t * 1.7)
    const shellOn = p.shell * pulse
    shellMat.opacity = shellOn * 0.07
    shellWireMat.opacity = shellOn * 0.16
    shellSphere.visible = shellSphere.visible && shellOn > 0.005

    // ---- orbitais s e p ----
    forms.visible = p.forms > 0.01
    forms.rotation.y += dt * 0.2
    formClouds.forEach((c) => (c.mat.opacity = p.forms * 0.85))
    formClouds.forEach((c) => (c.points.visible = p.forms > 0.01))

    // ---- botões de orbital ----
    chips.visible = p.chips > 0.01
    chipDefs.forEach((c) => {
      const selected = c.id === toyOrbital
      c.mat.opacity = p.chips * (selected ? 0.95 : hoverChip === c.id ? 0.7 : 0.4)
      c.label.material.opacity = p.chips
      c.label.visible = p.chips > 0.01
      c.mesh.scale.setScalar(selected ? 1.08 : 1)
    })

    // ---- rótulos ----
    const setOp = (l, op) => {
      l.material.opacity = op
      l.visible = op > 0.01
    }
    setOp(bohrLabel, p.bohrLabel)
    setOp(waveLabel, p.waveLabel)
    setOp(ghostLabel, p.ghostLabel)
    setOp(qLabel, p.q)
    qLabel.position.set(3.0, 2.3 + Math.sin(t * 2) * 0.1, 0)
    setOp(orbLabel, p.orbLabel)
    setOp(sLabel, p.formLabels)
    setOp(pLabel, p.formLabels)
    setOp(nuLabel, p.atomLabels)
    setOp(cloudLabel, p.atomLabels)
    setOp(counterLabel, p.counter)
    setOp(hintLabel, p.hint)
    setOp(chipLabel, p.chips)
    leaderNu.mat.opacity = p.atomLabels * 0.6
    leaderNu.line.visible = leaderNu.mat.opacity > 0.01
    leaderCloud.mat.opacity = p.atomLabels * 0.6
    leaderCloud.line.visible = leaderCloud.mat.opacity > 0.01

    // ---- câmera: balanço suave enquanto ninguém mexeu nela ----
    if (!userMoved && !reduced && !interactive) {
      const az = CAMERA_AZIMUTH + Math.sin(t * 0.35) * 0.22
      camera.position.set(Math.sin(az) * stage.home.z * ZOOM, stage.home.y * ZOOM, Math.cos(az) * stage.home.z * ZOOM)
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
    window.removeEventListener('pointerup', onHoldEnd)
    stage.onResize = null
    dotTexture.dispose()
    waveGeo2.dispose()
    disposeTree(root)
    scene.remove(root)
  }

  P = { ...P0 }

  return {
    goTo,
    dispose,
    // usado pelos testes e para depuração
    api: {
      cloud,
      formClouds,
      snaps,
      get mode() {
        return mode
      },
      get orbital() {
        return toyOrbital
      },
      get snapN() {
        return snapN
      },
      get params() {
        return P
      },
      get step() {
        return step
      },
      setOrbital: (id) => {
        setOrbital(id)
        updateShell()
        refreshCounter(true)
      },
      addDots: (n) => {
        for (let i = 0; i < n; i++) addDot()
        cloud.flush()
      },
      setInteractive: (value) => (interactive = value),
      objects: { atom, nucleus, cloudGroup, forms, chips, chipDefs, ghosts, waveLine, ball, shellSphere, lobes, counterLabel, hintLabel, orbLabel, qLabel, bohrLabel, waveLabel, ghostLabel, sLabel, pLabel, nuLabel, cloudLabel, chipLabel },
    },
  }
}
