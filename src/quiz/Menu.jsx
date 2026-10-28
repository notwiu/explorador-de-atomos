import { motion } from 'framer-motion'
import { TEAMS } from './engine.js'
import styles from './Quiz.module.css'

// Escolha do modo: duelo de equipes (A × B) ou jogar sozinho.
export default function Menu({ selected, onSelect, onStart }) {
  const modes = [
    {
      id: 'teams',
      key: '1',
      accent: 'var(--c-rutherford)',
      title: 'Duelo de equipes',
      text: 'O professor divide a sala em duas equipes. Elas se alternam: uma pergunta para cada vez.',
    },
    {
      id: 'solo',
      key: '2',
      accent: 'var(--c-bohr)',
      title: 'Jogar sozinho',
      text: 'Responda às perguntas, uma de cada vez, e veja quantos pontos faz.',
    },
  ]
  return (
    <motion.div
      className={styles.screen}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
    >
      <div>
        <h2 className={styles.menuTitle}>Quiz</h2>
        <p className={styles.menuSub}>Escolha como jogar. São 10 perguntas, do Dalton ao modelo atual.</p>
      </div>

      <div className={styles.modes}>
        {modes.map((m, i) => (
          <button
            key={m.id}
            type="button"
            tabIndex={-1}
            className={styles.mode}
            data-selected={selected === i}
            style={{ '--accent': m.accent }}
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => onSelect(i)}
            onClick={() => onStart(m.id)}
          >
            <span className={styles.modeKey}>{m.key}</span>
            <h3 className={styles.modeTitle}>{m.title}</h3>
            <p className={styles.modeText}>{m.text}</p>
            {m.id === 'teams' && (
              <div className={styles.vs}>
                <span className={styles.pill} style={{ background: TEAMS[0].color }}>
                  {TEAMS[0].name}
                </span>
                <span>×</span>
                <span className={styles.pill} style={{ background: TEAMS[1].color }}>
                  {TEAMS[1].name}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      <p className={styles.menuHint}>Teclas 1 e 2, ou setas e Enter. Esc volta para a linha do tempo.</p>
    </motion.div>
  )
}
