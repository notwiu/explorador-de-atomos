import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Palco 3D genérico, reaproveitado por todas as cenas: renderizador (WebGL),
// câmera, luzes, controle de órbita (arrastar para girar) e laço de animação.
// Cada cena cria o seu "mundo" em cima deste palco.

export function createStage(host, { light = false, reduced = false } = {}) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: !light, alpha: true })
  } catch {
    return null // sem WebGL: quem chamou mostra uma mensagem
  }
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, light ? 1 : 2))
  const dom = renderer.domElement
  Object.assign(dom.style, { width: '100%', height: '100%', display: 'block', touchAction: 'none' })
  host.appendChild(dom)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
  const home = new THREE.Vector3(0, 1.2, 10) // posição "de casa" da câmera

  const controls = new OrbitControls(camera, dom)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.enablePan = false
  controls.minDistance = 6
  controls.maxDistance = 18
  controls.rotateSpeed = 0.7

  // Luzes
  scene.add(new THREE.HemisphereLight(0xffffff, 0x2a3a88, 1.1))
  const key = new THREE.DirectionalLight(0xffffff, 2.6)
  key.position.set(4, 6, 7)
  scene.add(key)
  const warm = new THREE.PointLight(0xffb454, 90, 0, 2)
  warm.position.set(-6, 2, 5)
  scene.add(warm)
  const cool = new THREE.PointLight(0x6ea8ff, 60, 0, 2)
  cool.position.set(6, -3, 4)
  scene.add(cool)

  const tickers = new Set()
  const timer = new THREE.Timer()

  const resize = () => {
    const w = host.clientWidth || 800
    const h = host.clientHeight || 600
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // Afasta a câmera em telas mais estreitas para tudo caber na horizontal
    const halfWidth = 5.8
    const dist = halfWidth / (Math.tan((camera.fov * Math.PI) / 360) * camera.aspect)
    const d = Math.min(18, Math.max(10, dist))
    home.set(0, d * 0.12, d)
    camera.updateProjectionMatrix()
    stage.onResize?.()
  }

  const stage = {
    THREE,
    renderer,
    scene,
    camera,
    controls,
    host,
    home,
    light,
    reduced,
    onResize: null,
    onTick(fn) {
      tickers.add(fn)
      return () => tickers.delete(fn)
    },
    dispose() {
      renderer.setAnimationLoop(null)
      ro.disconnect()
      controls.dispose()
      tickers.clear()
      renderer.dispose()
      renderer.forceContextLoss?.()
      dom.remove()
    },
  }

  const ro = new ResizeObserver(resize)
  ro.observe(host)
  resize()
  camera.position.copy(home)

  renderer.setAnimationLoop(() => {
    timer.update()
    const dt = Math.min(timer.getDelta(), 0.05)
    const t = timer.getElapsed()
    tickers.forEach((fn) => fn(dt, t))
    controls.update()
    renderer.render(scene, camera)
  })

  return stage
}
