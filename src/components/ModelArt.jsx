// Ilustrações provisórias dos cartões da roda (uma por modelo + o quiz).
// São desenhos próprios, usados enquanto as fotos dos cientistas não são adicionadas.
// Cada desenho usa a cor de destaque do modelo (currentColor).

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

// Nuvem de pontos do modelo atual (sempre a mesma, para não "piscar" a cada render)
const CLOUD = (() => {
  const rnd = mulberry32(7)
  const pts = []
  for (let i = 0; i < 150; i++) {
    const u1 = rnd() || 0.001
    const u2 = rnd()
    const r = Math.sqrt(-2 * Math.log(u1)) * 26
    const a = 2 * Math.PI * u2
    const x = 100 + Math.cos(a) * r
    const y = 100 + Math.sin(a) * r * 0.9
    if (Math.hypot(x - 100, y - 100) < 90) pts.push({ x, y, r: 0.9 + rnd() * 1.7, o: 0.35 + rnd() * 0.55 })
  }
  return pts
})()

const THOMSON_DOTS = [
  [70, 78], [118, 66], [138, 104], [96, 120], [64, 118], [112, 142], [84, 96], [128, 128], [100, 92],
]

const polar = (r, deg) => [100 + r * Math.cos((deg * Math.PI) / 180), 100 + r * Math.sin((deg * Math.PI) / 180)]

function Dalton() {
  return (
    <>
      <defs>
        <radialGradient id="art-dalton" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="62" fill="url(#art-dalton)" />
    </>
  )
}

function Thomson() {
  return (
    <>
      <circle cx="100" cy="100" r="70" fill="currentColor" fillOpacity="0.28" stroke="currentColor" strokeWidth="3" />
      {THOMSON_DOTS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6" fill="#fff" stroke="currentColor" strokeWidth="2" />
      ))}
    </>
  )
}

function Rutherford() {
  return (
    <>
      <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="4 6" />
      <path d="M 6 126 L 92 104 L 150 38" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 8" />
      {[200, 320, 80].map((deg) => {
        const [x, y] = polar(78, deg)
        return <circle key={deg} cx={x} cy={y} r="5.5" fill="#fff" />
      })}
      <circle cx="100" cy="100" r="16" fill="currentColor" fillOpacity="0.3" />
      <circle cx="100" cy="100" r="7" fill="currentColor" />
    </>
  )
}

function Bohr() {
  return (
    <>
      {[26, 48, 70].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeOpacity="0.65" strokeWidth="2.5" />
      ))}
      {[[26, 210], [48, 20], [48, 200], [70, 120], [70, 300]].map(([r, deg]) => {
        const [x, y] = polar(r, deg)
        return <circle key={`${r}-${deg}`} cx={x} cy={y} r="5.5" fill="#fff" />
      })}
      <circle cx="100" cy="100" r="9" fill="currentColor" />
    </>
  )
}

function Quantum() {
  return (
    <>
      {CLOUD.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="currentColor" fillOpacity={p.o} />
      ))}
      <circle cx="100" cy="100" r="4" fill="#fff" />
    </>
  )
}

function Quiz() {
  const sparks = [[40, 44, 9], [160, 52, 7], [150, 150, 10], [46, 150, 6]]
  return (
    <>
      <circle cx="100" cy="100" r="66" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="3" />
      <text
        x="100"
        y="134"
        textAnchor="middle"
        fontSize="110"
        fontWeight="800"
        fill="currentColor"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        ?
      </text>
      {sparks.map(([x, y, s], i) => (
        <path key={i} d={`M ${x} ${y - s} L ${x + s * 0.3} ${y - s * 0.3} L ${x + s} ${y} L ${x + s * 0.3} ${y + s * 0.3} L ${x} ${y + s} L ${x - s * 0.3} ${y + s * 0.3} L ${x - s} ${y} L ${x - s * 0.3} ${y - s * 0.3} Z`} fill="#fff" />
      ))}
    </>
  )
}

const ART = { dalton: Dalton, thomson: Thomson, rutherford: Rutherford, bohr: Bohr, quantum: Quantum, quiz: Quiz }

export default function ModelArt({ id, accent }) {
  const Art = ART[id] ?? Dalton
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true" style={{ color: accent }}>
      <Art />
    </svg>
  )
}
