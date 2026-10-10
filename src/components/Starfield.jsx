import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion.js'

// Fundo de estrelas em Canvas. A quantidade e o brilho vêm da configuração
// de desempenho (modo normal ou leve).
export default function Starfield({ count, twinkle }) {
  const canvasRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let raf = 0
    let stars = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        drift: Math.random() * 6 + 2, // px por segundo
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 1.5 + 0.5,
      }))
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const alpha = twinkle && !reduced ? 0.45 + 0.55 * Math.sin(t / 1000 * s.speed + s.phase) ** 2 : 0.7
        ctx.globalAlpha = alpha
        ctx.fillStyle = '#dfe6ff'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
        if (!reduced) {
          s.y -= (s.drift / 60)
          if (s.y < -2) {
            s.y = h + 2
            s.x = Math.random() * w
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    if (reduced) {
      draw(0)
      cancelAnimationFrame(raf) // desenha uma vez só
    } else {
      raf = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [count, twinkle, reduced])

  return <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}
