import * as THREE from 'three'
import { animate } from 'framer-motion'

// Mundo 3D da cena do Dalton.
//
// Ideia central: existe um "estoque" fixo de 125 esferas (um cubo de 5x5x5). A cada
// passo da apresentação, as mesmas esferas se movem, mudam de tamanho e de cor para
// formar o próximo desenho. Assim a matéria "vira" átomos de forma contínua:
//   passo 0: um cubo de matéria feito de muitas esferas
//   passo 1: uma única esfera cresce até virar o átomo maciço
//   passo 2: átomos de três elementos (iguais dentro do elemento, diferentes entre eles)
//   passo 3: átomos se combinando em compostos
//   passo 4: antes da reação
//   passo 5: depois da reação (os átomos mudaram de parceiros, nenhum sumiu)
//   passo 6: o que o modelo não explicava
//   passo 7: brincar (arrastar átomos e encostar para formar compostos)

export const STEP_COUNT = 8

const N = 125
const COLORS = { pearl: '#f3ead8', A: '#ffb454', B: '#6ea8ff', C: '#ff6f91' }
const RADIUS = { A: 0.5, B: 0.38, C: 0.62 }
const BOUNDS = { x: 4.0, y: 2.3, z: 1.5 }
const BOB = [0, 0.03, 0.05, 0.05, 0.04, 0.04, 0.04, 0.09] // balanço suave por passo
const PLAY_STEP = 7

// Átomos 0..11 são os "átomos de verdade" do modelo: 4 de A, 4 de B e 4 de C.
const elementOf = (i) => (i < 4 ? 'A' : i < 8 ? 'B' : i < 12 ? 'C' : null)

const v = (x, y, z) => new THREE.Vector3(x, y, z)
const col = (hex) => new THREE.Color(hex)
const HIDE = () => ({ pos: null, scale: 0, color: null }) // some, mantendo posição e cor
const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
const smooth = (x) => x * x * (3 - 2 * x)

function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---------- Desenhos (alvos de cada passo) ----------

const allHidden = () => Array.from({ length: N }, HIDE)

function cubeTargets() {
  const out = []
  for (let i = 0; i < N; i++) {
    const ix = i % 5
    const iy = Math.floor(i / 5) % 5
    const iz = Math.floor(i / 25)
    out.push({ pos: v((ix - 2) * 0.66, (iy - 2) * 0.66, (iz - 2) * 0.66), scale: 0.29, color: col(COLORS.pearl) })
  }
  return out
}

function singleAtomTargets() {
  const cube = cubeTargets()
  return cube.map((c, i) =>
    i === 0
      ? { pos: v(0, 0, 0), scale: 1.7, color: col(COLORS.A) }
      : { pos: c.pos.clone().multiplyScalar(2.4), scale: 0, color: c.color.clone() },
  )
}

function elementsTargets() {
  const out = allHidden()
  const groups = [
    ['A', [0, 1, 2, 3], -3.3],
    ['B', [4, 5, 6, 7], 0],
    ['C', [8, 9, 10, 11], 3.3],
  ]
  for (const [el, ids, cx] of groups) {
    const r = RADIUS[el]
    const gap = r * 1.25
    ids.forEach((id, k) => {
      const sx = k % 2 ? 1 : -1
      const sy = k < 2 ? 1 : -1
      out[id] = { pos: v(cx + sx * gap, 0.3 + sy * gap, 0), scale: r, color: col(COLORS[el]) }
    })
  }
  return out
}

// Coloca uma molécula (átomos encostados em linha) centrada em (cx, cy)
function placeMolecule(out, ids, cx, cy) {
  const rs = ids.map((id) => RADIUS[elementOf(id)])
  const total = rs.reduce((s, r) => s + 2 * r, 0)
  let x = cx - total / 2
  ids.forEach((id, k) => {
    x += rs[k]
    out[id] = { pos: v(x, cy, 0), scale: rs[k], color: col(COLORS[elementOf(id)]) }
    x += rs[k]
  })
}

function compoundsTargets() {
  const out = allHidden()
  placeMolecule(out, [0, 4], -2.7, 1.3)
  placeMolecule(out, [1, 8], 2.7, 1.3)
  placeMolecule(out, [5, 2, 6], -2.7, -1.3)
  placeMolecule(out, [7, 9], 2.7, -1.3)
  return out
}

// Antes da reação: dois compostos (A+B) e dois átomos C
function reactionBeforeTargets() {
  const out = allHidden()
  placeMolecule(out, [0, 4], -2.7, 1.2)
  placeMolecule(out, [1, 5], -2.7, -1.2)
  placeMolecule(out, [8], 2.8, 1.2)
  placeMolecule(out, [9], 2.8, -1.2)
  return out
}

// Depois: C trocou de lugar com B. Dois compostos (A+C) e dois átomos B livres
function reactionAfterTargets() {
  const out = allHidden()
  placeMolecule(out, [0, 8], -2.6, 1.2)
  placeMolecule(out, [1, 9], -2.6, -1.2)
  placeMolecule(out, [4], 2.8, 1.2)
  placeMolecule(out, [5], 2.8, -1.2)
  return out
}

// Espalha os 12 átomos pelo espaço, sem se sobreporem
function scatterTargets(seed) {
  const rnd = mulberry32(seed)
  const out = allHidden()
  const placed = []
  for (let id = 0; id < 12; id++) {
    const el = elementOf(id)
    const r = RADIUS[el]
    let p = null
    for (let tries = 0; tries < 80 && !p; tries++) {
      const c = v((rnd() * 2 - 1) * BOUNDS.x * 0.85, (rnd() * 2 - 1) * BOUNDS.y * 0.8, (rnd() * 2 - 1) * BOUNDS.z * 0.7)
      if (placed.every((o) => o.p.distanceTo(c) > (o.r + r) * 1.6)) p = c
    }
    p = p || v(((id % 6) - 2.5) * 1.5, id < 6 ? 1.4 : -1.4, 0)
    placed.push({ p, r })
    out[id] = { pos: p, scale: r, color: col(COLORS[el]) }
  }
  return out
}

function targetsFor(step, seed) {
  switch (step) {
    case 0:
      return cubeTargets()
    case 1:
      return singleAtomTargets()
    case 2:
      return elementsTargets()
    case 3:
      return compoundsTargets()
    case 4:
      return reactionBeforeTargets()
    case 5:
      return reactionAfterTargets()
    case 6: {
      const out = allHidden()
      out[0] = { pos: v(0, 0, 0), scale: 1.7, color: col(COLORS.A) }
      return out
    }
    default:
      return scatterTargets(seed)
  }
}

// Rótulos 3D (sprites) que aparecem em certos passos
const LABELS = [
  { key: 'elA', text: 'Elemento A', color: COLORS.A, pos: v(-3.3, -1.95, 0), size: [3.2, 0.8], steps: [2] },
  { key: 'elB', text: 'Elemento B', color: COLORS.B, pos: v(0, -1.95, 0), size: [3.2, 0.8], steps: [2] },
  { key: 'elC', text: 'Elemento C', color: COLORS.C, pos: v(3.3, -1.95, 0), size: [3.2, 0.8], steps: [2] },
  { key: 'q', text: '?', color: '#ffffff', pos: v(1.7, 1.9, 0), size: [1.2, 1.2], steps: [6] },
]

function makeLabel({ text, color, size }) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = Math.round((1024 * size[1]) / size[0])
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const fontSize = Math.round(canvas.height * 0.62)
    ctx.font = `800 ${fontSize}px "Bricolage Grotesque Variable", "Atkinson Hyperlegible", sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
    ctx.shadowBlur = 12
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + fontSize * 0.04)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0, depthTest: false })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(size[0], size[1], 1)
  sprite.renderOrder = 10
  return sprite
}

// ---------- O mundo ----------

export function createDaltonWorld(stage, { reduced = false } = {}) {
  const { scene, camera, controls, host } = stage
  const light = stage.light
  const segW = light ? 20 : 40
  const geometry = new THREE.SphereGeometry(1, segW, Math.round(segW * 0.7))

  const group = new THREE.Group()
  scene.add(group)

  // Estoque de esferas
  const atoms = []
  for (let i = 0; i < N; i++) {
    const material = light
      ? new THREE.MeshStandardMaterial({ color: COLORS.pearl, roughness: 0.35, metalness: 0.05 })
      : new THREE.MeshPhysicalMaterial({ color: COLORS.pearl, roughness: 0.28, metalness: 0.05, clearcoat: 0.8, clearcoatRoughness: 0.2 })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.visible = false
    mesh.userData.atom = i
    group.add(mesh)
    atoms.push({
      i,
      mesh,
      material,
      base: v(0, 0, 0),
      scale: 0,
      color: col(COLORS.pearl),
      r: RADIUS[elementOf(i)] ?? 0,
      phase: Math.random() * Math.PI * 2,
      group: i,
      from: null,
      to: null,
    })
  }

  // Rótulos
  const labels = LABELS.map((cfg) => {
    const sprite = makeLabel(cfg)
    sprite.position.copy(cfg.pos)
    group.add(sprite)
    return { cfg, sprite, from: 0, to: 0 }
  })

  let step = 0
  let seed = 11
  let tween = null
  let interactive = false
  let userMoved = false
  let bobAmp = 0
  let hoverGroup = null
  let dragging = null
  const smallTweens = new Set()

  const onStart = () => {
    userMoved = true
  }
  controls.addEventListener?.('start', onStart)

  // ----- aplicação do estado nas esferas -----
  function paint() {
    for (const a of atoms) {
      a.mesh.visible = a.scale > 0.005
      a.mesh.scale.setScalar(Math.max(a.scale, 0.0001))
      a.material.color.copy(a.color)
    }
  }

  function applyProgress(u, stagger, arcAmp) {
    for (const a of atoms) {
      const local = smooth(clamp(u * (1 + stagger) - (a.i / N) * stagger, 0, 1))
      a.base.lerpVectors(a.from.pos, a.to.pos, local)
      if (arcAmp) a.base.z += Math.sin(Math.PI * local) * arcAmp * (a.i % 2 ? 1 : -1)
      a.scale = a.from.scale + (a.to.scale - a.from.scale) * local
      a.color.lerpColors(a.from.color, a.to.color, local)
    }
    for (const l of labels) {
      l.sprite.material.opacity = l.from + (l.to - l.from) * clamp(u * 1.2 - 0.1, 0, 1)
      l.sprite.visible = l.sprite.material.opacity > 0.01
    }
    paint()
  }

  function stopTween() {
    tween?.stop()
    tween = null
  }

  function snapshot(targets, step) {
    for (const a of atoms) {
      const t = targets[a.i]
      a.from = { pos: a.base.clone(), scale: a.scale, color: a.color.clone() }
      a.to = {
        pos: t.pos ? t.pos.clone() : a.base.clone(),
        scale: t.scale,
        color: t.color ? t.color.clone() : a.color.clone(),
      }
    }
    for (const l of labels) {
      l.from = l.sprite.material.opacity
      l.to = l.cfg.steps.includes(step) ? 1 : 0
    }
  }

  // ----- navegação entre passos -----
  function goTo(newStep, { immediate = false, replay = false } = {}) {
    stopTween()
    const target = clamp(newStep, 0, STEP_COUNT - 1)
    const previous = step
    step = target
    interactive = false
    hoverGroup = null
    dragging = null
    atoms.forEach((a) => (a.group = a.i))
    bobAmp = BOB[target]
    setCursor('')

    if (target === PLAY_STEP && replay) seed += 1

    // Em "reiniciar", volta ao desenho do passo anterior para repetir a animação
    if (replay && target !== PLAY_STEP) {
      const prevStep = target === 0 ? 1 : target - 1
      snapshot(targetsFor(prevStep, seed), prevStep)
      applyProgress(1, 0, 0)
    }

    const targets = targetsFor(target, seed)
    snapshot(targets, target)

    // Câmera volta para a posição inicial se o professor tiver girado
    if (userMoved || immediate) {
      userMoved = false
      const from = camera.position.clone()
      if (immediate || reduced) {
        camera.position.copy(stage.home)
      } else {
        smallTween(1.2, (e) => camera.position.lerpVectors(from, stage.home, e))
      }
      controls.target.set(0, 0, 0)
    }

    const arc = target === 5 ? 1.3 : 0
    const stagger = target === 1 || (target === 0 && previous === 1) ? 0.5 : 0.08
    const duration = immediate || reduced ? 0.001 : target === 1 ? 2.4 : 1.6

    if (immediate) {
      applyProgress(1, 0, 0)
      interactive = target === PLAY_STEP
      return
    }

    tween = animate(0, 1, {
      duration,
      ease: [0.22, 0.8, 0.2, 1],
      onUpdate: (u) => applyProgress(u, stagger, arc),
      onComplete: () => {
        applyProgress(1, 0, 0)
        tween = null
        interactive = target === PLAY_STEP
        if (interactive) setCursor('grab')
      },
    })
  }

  // pequenas animações (câmera, encaixe de átomos)
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

  // ----- brincar: grupos, arrastar, encaixar, separar -----
  const visibleAtoms = () => atoms.filter((a) => a.scale > 0.05)
  const members = (gid) => atoms.filter((a) => a.group === gid && a.scale > 0.05)

  function moveGroup(gid, delta) {
    const ms = members(gid)
    ms.forEach((a) => a.base.add(delta))
    // mantém o grupo dentro da área
    const shift = v(0, 0, 0)
    for (const axis of ['x', 'y', 'z']) {
      const lo = Math.min(...ms.map((a) => a.base[axis] - a.r))
      const hi = Math.max(...ms.map((a) => a.base[axis] + a.r))
      if (lo < -BOUNDS[axis]) shift[axis] = -BOUNDS[axis] - lo
      else if (hi > BOUNDS[axis]) shift[axis] = BOUNDS[axis] - hi
    }
    ms.forEach((a) => a.base.add(shift))
  }

  function shiftGroupSmooth(gid, delta, onDone) {
    const ms = members(gid)
    const starts = ms.map((a) => a.base.clone())
    smallTween(0.25, (e) => ms.forEach((a, k) => a.base.copy(starts[k]).addScaledVector(delta, e)), onDone)
  }

  // Tenta encostar o grupo em outro. Retorna true se encaixou.
  function tryBond(gid) {
    const ms = members(gid)
    const others = visibleAtoms().filter((o) => o.group !== gid)
    const candidates = []
    for (const a of ms) {
      for (const b of others) {
        const d = a.base.distanceTo(b.base)
        const touch = a.r + b.r
        if (d < touch * 1.4) candidates.push({ a, b, d, touch, gap: d - touch })
      }
    }
    candidates.sort((p, q) => p.gap - q.gap)

    for (const c of candidates) {
      const dir = c.b.base.clone().sub(c.a.base)
      if (dir.lengthSq() === 0) dir.set(1, 0, 0)
      dir.normalize()
      const delta = dir.multiplyScalar(c.d - c.touch)
      // não pode atravessar outro átomo
      const clash = ms.some((m) =>
        others.some(
          (o) => o !== c.b && m.base.clone().add(delta).distanceTo(o.base) < (m.r + o.r) * 0.98,
        ),
      )
      if (clash) continue
      const newGroup = c.b.group
      shiftGroupSmooth(gid, delta, () => {
        ms.forEach((m) => (m.group = newGroup))
      })
      ms.forEach((m) => (m.group = newGroup)) // já vale para quem for conferir
      return true
    }
    return false
  }

  // Afasta o grupo se ficou "enfiado" em outro átomo sem encaixar
  function resolveOverlap(gid) {
    for (let pass = 0; pass < 3; pass++) {
      const ms = members(gid)
      const others = visibleAtoms().filter((o) => o.group !== gid)
      let worst = null
      for (const m of ms) {
        for (const o of others) {
          const d = m.base.distanceTo(o.base)
          const pen = m.r + o.r - d
          if (pen > 0.001 && (!worst || pen > worst.pen)) {
            const dir = m.base.clone().sub(o.base)
            if (dir.lengthSq() === 0) dir.set(0, 1, 0)
            worst = { pen, dir: dir.normalize() }
          }
        }
      }
      if (!worst) return
      moveGroup(gid, worst.dir.multiplyScalar(worst.pen + 0.02))
    }
  }

  function detach(atomIndex) {
    const a = atoms[atomIndex]
    const mates = members(a.group).filter((o) => o !== a)
    if (mates.length === 0) return false
    const center = mates.reduce((s, o) => s.add(o.base), v(0, 0, 0)).divideScalar(mates.length)
    const dir = a.base.clone().sub(center)
    if (dir.lengthSq() === 0) dir.set(1, 0, 0)
    dir.normalize()
    a.group = 1000 + a.i
    const start = a.base.clone()
    smallTween(0.3, (e) => a.base.copy(start).addScaledVector(dir, 0.7 * e))
    return true
  }

  // ----- ponteiro -----
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
    const meshes = visibleAtoms().map((a) => a.mesh)
    const hits = ray.intersectObjects(meshes, false)
    return hits[0] ?? null
  }

  function setHover(gid) {
    if (hoverGroup === gid) return
    hoverGroup = gid
    for (const a of atoms) {
      a.material.emissive.copy(a.color).multiplyScalar(gid !== null && a.group === gid ? 0.3 : 0)
    }
  }

  function onPointerDown(e) {
    if (!interactive || e.button > 0) return
    const hit = pick(e)
    if (!hit) return
    const a = atoms[hit.object.userData.atom]
    e.stopPropagation() // não deixa a câmera girar enquanto arrasta um átomo
    dirVec.copy(camera.getWorldDirection(dirVec))
    plane.setFromNormalAndCoplanarPoint(dirVec, hit.point)
    dragging = { gid: a.group, last: hit.point.clone() }
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
      moveGroup(dragging.gid, point.clone().sub(dragging.last))
      dragging.last.copy(point)
    }
  }

  function onDragEnd() {
    window.removeEventListener('pointermove', onDragMove)
    window.removeEventListener('pointerup', onDragEnd)
    if (!dragging) return
    const gid = dragging.gid
    dragging = null
    controls.enabled = true
    if (!tryBond(gid)) resolveOverlap(gid)
    setCursor('grab')
  }

  function onHover(e) {
    if (!interactive || dragging) return
    const hit = pick(e)
    setHover(hit ? atoms[hit.object.userData.atom].group : null)
    setCursor(hit ? 'grab' : '')
  }

  function onDoubleClick(e) {
    if (!interactive) return
    const hit = pick(e)
    if (hit) detach(hit.object.userData.atom)
  }

  host.addEventListener?.('pointerdown', onPointerDown, true)
  host.addEventListener?.('pointermove', onHover)
  host.addEventListener?.('dblclick', onDoubleClick, true)

  // ----- laço de animação -----
  const off = stage.onTick((dt, t) => {
    // balanço suave
    for (const a of atoms) {
      if (a.scale <= 0.005) continue
      a.mesh.position.copy(a.base)
      a.mesh.position.y += Math.sin(t * 1.3 + a.phase) * bobAmp
    }
    // pequeno "balanço" da câmera enquanto ninguém mexeu nela
    if (!userMoved && !dragging && !reduced && !interactive) {
      const az = Math.sin(t * 0.35) * 0.28
      const d = stage.home.z
      camera.position.set(Math.sin(az) * d, stage.home.y, Math.cos(az) * d)
    }
    // ponto de interrogação pulsando
    const q = labels.find((l) => l.cfg.key === 'q')
    if (q && q.sprite.visible) q.sprite.position.y = LABELS[3].pos.y + Math.sin(t * 2) * 0.12
  })

  stage.onResize = () => {
    if (!userMoved && !interactive) camera.position.copy(stage.home)
  }

  function dispose() {
    stopTween()
    smallTweens.forEach((t) => t.stop())
    smallTweens.clear()
    off()
    controls.removeEventListener?.('start', onStart)
    host.removeEventListener?.('pointerdown', onPointerDown, true)
    host.removeEventListener?.('pointermove', onHover)
    host.removeEventListener?.('dblclick', onDoubleClick, true)
    window.removeEventListener('pointermove', onDragMove)
    window.removeEventListener('pointerup', onDragEnd)
    stage.onResize = null
    geometry.dispose()
    atoms.forEach((a) => a.material.dispose())
    labels.forEach((l) => {
      l.sprite.material.map?.dispose()
      l.sprite.material.dispose()
    })
    scene.remove(group)
  }

  // estado inicial: nada visível até o primeiro goTo
  atoms.forEach((a) => {
    a.base.set(0, 0, 0)
  })
  paint()

  return {
    goTo,
    dispose,
    // usado pelos testes e por depuração
    api: { atoms, labels, moveGroup, tryBond, resolveOverlap, detach, members, setInteractive: (v2) => (interactive = v2), get step() { return step } },
  }
}
