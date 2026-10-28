import { motion } from 'framer-motion'
import { models } from '../data/models.js'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import { TEAMS, pointsLeft } from './engine.js'
import Scoreboard from './Scoreboard.jsx'
import styles from './Quiz.module.css'

const LETTERS = ['A', 'B', 'C', 'D']
const OPTION_COLORS = ['#ff7a6b', '#ffb454', '#5eead0', '#b69cff']

// Tela da pergunta: texto grande e quatro alternativas enormes.
// Errou? A alternativa fica esmaecida e a equipe pode tentar outra.
export default function Question({ game, onPick }) {
  const reduced = useReducedMotion()
  const q = game.questions[game.qi]
  const model = models.find((m) => m.id === q.model)
  const team = TEAMS[game.team]
  const left = pointsLeft(game)

  return (
    <motion.div
      className={styles.screen}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
    >
      <div className={styles.top}>
        <div className={styles.progress}>
          <span>
            Pergunta {game.qi + 1} de {game.questions.length}
          </span>
          <span className={styles.tag} style={{ '--accent': model?.accent }}>
            {model?.label}
          </span>
        </div>
        <Scoreboard game={game} />
      </div>

      {game.mode === 'teams' && (
        <p className={styles.turn} style={{ '--c': team.color }}>
          Vez da {team.name}
        </p>
      )}

      <h2 className={styles.questionText}>{q.text}</h2>

      <div className={styles.options}>
        {q.options.map((text, i) => {
          const wrong = game.tries.includes(i)
          return (
            <motion.button
              key={i}
              type="button"
              tabIndex={-1}
              className={styles.option}
              data-wrong={wrong}
              style={{ '--oc': OPTION_COLORS[i] }}
              aria-label={`Alternativa ${LETTERS[i]}: ${text}`}
              disabled={wrong}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onPick(i)}
              initial={{ opacity: 0, y: 18 }}
              animate={wrong ? { opacity: 0.55, x: reduced ? 0 : [0, -14, 14, -10, 10, 0], y: 0 } : { opacity: 1, x: 0, y: 0 }}
              transition={wrong ? { duration: 0.45 } : { duration: 0.35, delay: 0.08 * i }}
            >
              <span className={styles.letter}>{LETTERS[i]}</span>
              <span className={styles.optionText}>{text}</span>
              {wrong && <span className={styles.cross}>✕</span>}
            </motion.button>
          )
        })}
      </div>

      <p className={styles.footer}>
        {game.tries.length > 0 ? 'Quase! Tente outra alternativa. ' : ''}
        Esta pergunta vale <b>{left}</b> {left === 1 ? 'ponto' : 'pontos'}. Escolha com A, B, C e D (ou 1 a 4), ou clique.
      </p>
    </motion.div>
  )
}
