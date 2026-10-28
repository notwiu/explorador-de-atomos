import { useMemo } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import styles from './Quiz.module.css'

const COLORS = ['#ff7a6b', '#ffb454', '#5eead0', '#7ee7ff', '#b69cff', '#ffd86b']

// Confete suave (sem flashes) para as telas de acerto e de fim. No modo leve, usa menos peças.
export default function Confetti({ light, count = 36 }) {
  const reduced = useReducedMotion()
  const pieces = useMemo(
    () =>
      Array.from({ length: light ? Math.round(count / 3) : count }, (_, i) => ({
        left: Math.random() * 100,
        delay: -Math.random() * 6,
        duration: 4 + Math.random() * 4,
        drift: (Math.random() - 0.5) * 18,
        spin: 360 + Math.random() * 720,
        color: COLORS[i % COLORS.length],
      })),
    [light, count],
  )
  if (reduced) return null
  return (
    <div className={styles.confetti} aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className={styles.piece}
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}vw`,
            '--spin': `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  )
}
