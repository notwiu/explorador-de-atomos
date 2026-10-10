import styles from './HeroAtom.module.css'

// Átomo animado da tela inicial: um núcleo e três órbitas, cada uma com um
// elétron de cor diferente (as cores dos modelos). É só ilustração de abertura;
// os modelos de verdade aparecem nas cenas da linha do tempo.

const ORBITS = [
  { angle: -32, color: 'var(--c-bohr)', duration: 7 },
  { angle: 28, color: 'var(--c-rutherford)', duration: 9.5 },
  { angle: 88, color: 'var(--c-thomson)', duration: 12 },
]

const RX = 250
const RY = 92
const C = 300
// Elipse desenhada como caminho fechado que começa no ponto mais à esquerda.
const ORBIT_PATH = `M ${C - RX} ${C} a ${RX} ${RY} 0 1 0 ${RX * 2} 0 a ${RX} ${RY} 0 1 0 ${-RX * 2} 0`

export default function HeroAtom({ glow, trails }) {
  return (
    <div className={styles.wrap} data-glow={glow}>
      <svg viewBox="0 0 600 600" className={styles.svg} role="img" aria-label="Ilustração de um átomo com três elétrons orbitando o núcleo">
        <defs>
          <radialGradient id="nucleus" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6e0" />
            <stop offset="45%" stopColor="#ffb454" />
            <stop offset="100%" stopColor="#ff7a6b" />
          </radialGradient>
          <radialGradient id="aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffb454" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffb454" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Aura do núcleo */}
        <circle cx={C} cy={C} r="120" fill="url(#aura)" className={styles.aura} />

        {ORBITS.map((o, i) => (
          <g key={i} transform={`rotate(${o.angle} ${C} ${C})`}>
            {/* trilho da órbita */}
            <path d={ORBIT_PATH} pathLength="100" fill="none" stroke={o.color} strokeOpacity="0.28" strokeWidth="2" />

            {/* rastro do elétron (cometa) */}
            {trails && (
              <path
                d={ORBIT_PATH}
                pathLength="100"
                fill="none"
                stroke={o.color}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="16 84"
                strokeOpacity="0.85"
              >
                <animate attributeName="stroke-dashoffset" from="16" to="-84" dur={`${o.duration}s`} repeatCount="indefinite" />
              </path>
            )}

            {/* elétron */}
            <circle r="11" fill={o.color} style={{ color: o.color }} className={styles.electron}>
              <animateMotion dur={`${o.duration}s`} repeatCount="indefinite" path={ORBIT_PATH} />
            </circle>
          </g>
        ))}

        {/* Núcleo */}
        <circle cx={C} cy={C} r="30" fill="url(#nucleus)" className={styles.nucleus} />
      </svg>
    </div>
  )
}
