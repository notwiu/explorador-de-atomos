import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion'
import ModelArt from './ModelArt.jsx'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import styles from './OrbitalWheel.module.css'

// Roda orbital de cartões (adaptada do componente "orbital image wheel").
// Diferenças em relação ao original: não depende de rolagem. Quem gira a roda é o
// clique, o teclado (setas) ou a roda do mouse, o que combina melhor com uma
// apresentação em projetor.
//
// - O cartão em destaque fica no topo. Clicar nele abre o item.
// - Clicar em outro cartão gira a roda até ele.
// - `focusIndex` é controlado pelo componente pai (App).

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const mod = (v, n) => ((v % n) + n) % n

// Menor caminho (em posições) para ir de `from` (decimal) até o índice `to`.
function shortestDelta(from, to, n) {
  let d = mod(to, n) - mod(from, n)
  if (d > n / 2) d -= n
  if (d < -n / 2) d += n
  return d
}

export default function OrbitalWheel({ items, focusIndex, onFocus, onOpen, light }) {
  const n = items.length
  const rootRef = useRef(null)
  const cardRefs = useRef([])
  const reduced = useReducedMotion()
  const simple = light || reduced

  // posição (decimal) da roda; começa um pouco girada para a entrada animada
  const pos = useMotionValue(focusIndex - (simple ? 0 : 1.4))
  const [size, setSize] = useState({ w: 1280, h: 720 })
  const first = useRef(true)
  const wheelLock = useRef(false)

  // Mede o espaço disponível
  useLayoutEffect(() => {
    const el = rootRef.current
    const update = () => setSize({ w: el.clientWidth || 1280, h: el.clientHeight || 720 })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Posiciona e estiliza cada cartão conforme a posição da roda
  const apply = useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const { w, h } = size
    const cardH = clamp(h * 0.44, 220, 430)
    const cardW = Math.round(cardH * 0.74)
    const R = clamp(w * 0.45, 360, 900)
    const cx = w / 2
    const cy = h * 0.4 + R
    const focusArc = Math.PI * 0.55
    const p = pos.get()

    root.style.setProperty('--card-w', `${cardW}px`)
    root.style.setProperty('--card-h', `${cardH}px`)

    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i]
      if (!el) continue
      const d = mod(i - p + n / 2, n) - n / 2 // distância assinada, em posições
      const theta = -Math.PI / 2 + (d * 2 * Math.PI) / n
      const x = Math.cos(theta) * R
      const y = Math.sin(theta) * R
      const fi = clamp((Math.abs(d) * 2 * Math.PI) / n / focusArc, 0, 1) // 0 = em foco, 1 = longe
      const depth = (1 - fi) * 100
      const tilt = (x / R) * 8
      const scale = 1 - fi * 0.07

      el.style.transform = `translate3d(${cx + x - cardW / 2}px, ${cy + y - cardH / 2}px, ${depth}px) rotate(${tilt}deg) scale(${scale})`
      el.style.zIndex = String(Math.round(depth))
      if (simple) {
        el.style.opacity = String(0.55 + 0.45 * (1 - fi))
      } else {
        el.style.filter = `blur(${(fi * 1.8).toFixed(2)}px) brightness(${45 + 55 * (1 - fi)}%) saturate(${60 + 40 * (1 - fi)}%)`
      }
    }
  }, [size, n, pos, simple])

  useLayoutEffect(() => {
    apply()
  }, [apply])

  useEffect(() => pos.on('change', apply), [pos, apply])

  // Gira a roda até o item em foco, pelo caminho mais curto
  useEffect(() => {
    const cur = pos.get()
    const target = cur + shortestDelta(cur, focusIndex, n)
    const duration = first.current && !simple ? 1.3 : simple ? 0.2 : 0.65
    first.current = false
    const controls = animate(pos, target, { duration, ease: [0.22, 0.8, 0.2, 1] })
    return () => controls.stop()
  }, [focusIndex, n, pos, simple])

  const handleCard = (i) => (i === focusIndex ? onOpen(i) : onFocus(i))

  // Roda do mouse gira a roda (com trava curta para não passar vários de uma vez)
  const handleWheel = (e) => {
    if (wheelLock.current || Math.abs(e.deltaY) < 20) return
    wheelLock.current = true
    setTimeout(() => (wheelLock.current = false), 450)
    onFocus(mod(focusIndex + (e.deltaY > 0 ? 1 : -1), n))
  }

  const active = items[focusIndex]

  return (
    <div ref={rootRef} className={styles.root} data-light={simple} onWheel={handleWheel}>
      <div className={styles.stage}>
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => (cardRefs.current[i] = el)}
            className={styles.card}
            data-focus={i === focusIndex}
            style={{ '--accent': item.accent }}
          >
            <div
              className={styles.face}
              role="button"
              aria-label={i === focusIndex ? `Abrir ${item.label}` : `Selecionar ${item.label}`}
              onClick={() => handleCard(i)}
            >
              <div className={styles.tint} />
              <div className={styles.art}>
                {item.photo ? (
                  <img className={styles.photo} src={item.photo} alt={`Retrato de ${item.label}`} draggable="false" />
                ) : (
                  <div className={styles.illustration}>
                    <ModelArt id={item.id} accent={item.accent} />
                  </div>
                )}
              </div>
              <div className={styles.label}>
                <span className={styles.name}>{item.label}</span>
                <span className={styles.meta}>{item.year ?? item.modelName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.caption}>
        <div className={styles.subtitleBox}>
          <AnimatePresence mode="wait">
            <motion.p
              key={active.id}
              className={styles.subtitle}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
            >
              {active.year ? `${active.modelName} · ${active.year}` : active.modelName}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className={styles.pills}>
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={styles.pill}
              aria-current={i === focusIndex ? 'true' : undefined}
              style={{ '--accent': item.accent }}
              onMouseDown={(e) => e.preventDefault()} // não rouba o foco do teclado
              onClick={() => onFocus(i)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className={styles.hint}>Clique no cartão em destaque para abrir. Setas giram a roda, Enter abre.</p>
      </div>
    </div>
  )
}
