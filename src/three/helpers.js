import * as THREE from 'three'

// Ferramentas compartilhadas pelas cenas 3D.

export const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
export const smooth = (x) => x * x * (3 - 2 * x)
export const lerp = (a, b, t) => a + (b - a) * t

// Gerador de números "aleatórios" repetíveis (mesma semente, mesmos números)
export function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FONT = '"Bricolage Grotesque Variable", "Atkinson Hyperlegible", sans-serif'

function drawLabel(canvas, text, color) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  let fontSize = Math.round(canvas.height * 0.62)
  ctx.font = `800 ${fontSize}px ${FONT}`
  const w = ctx.measureText?.(text)?.width
  if (typeof w === 'number' && w > canvas.width * 0.94) {
    fontSize = Math.floor((fontSize * canvas.width * 0.94) / w)
    ctx.font = `800 ${fontSize}px ${FONT}`
  }
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 12
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + fontSize * 0.04)
}

// Rótulo de texto em 3D (sprite que sempre olha para a câmera). Começa invisível.
export function makeLabel({ text, color, size, depthTest = false }) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = Math.max(32, Math.round((1024 * size[1]) / size[0]))
  drawLabel(canvas, text, color)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0, depthTest, depthWrite: false })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(size[0], size[1], 1)
  sprite.renderOrder = 10
  sprite.visible = false
  sprite.userData.canvas = canvas
  return sprite
}

// Troca o texto (e a cor) de um rótulo já criado
export function setLabel(sprite, text, color) {
  drawLabel(sprite.userData.canvas, text, color)
  sprite.material.map.needsUpdate = true
}

// Brilho redondo e suave (sprite aditivo)
export function makeGlow(color, size) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')
  const g = ctx?.createRadialGradient?.(64, 64, 0, 64, 64, 64)
  if (g) {
    g.addColorStop(0, color)
    g.addColorStop(0.25, color)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 128, 128)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(size, size, 1)
  sprite.renderOrder = 9
  sprite.visible = false
  return sprite
}

// Libera da memória tudo que está dentro de um grupo
export function disposeTree(root) {
  root.traverse((o) => {
    o.geometry?.dispose?.()
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []
    mats.forEach((m) => {
      m.map?.dispose?.()
      m.dispose?.()
    })
  })
}
