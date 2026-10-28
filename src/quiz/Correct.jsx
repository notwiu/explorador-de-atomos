import { motion } from 'framer-motion'
import { TEAMS } from './engine.js'
import Confetti from './Confetti.jsx'
import styles from './Quiz.module.css'

// Tela de acerto, em tela cheia: "Correto!", a resposta e uma explicação curta.
export default function Correct({ game, onNext, light }) {
  const q = game.questions[game.qi]
  const team = TEAMS[game.team]
  const isTeams = game.mode === 'teams'
  const color = isTeams ? team.color : 'var(--c-quantum)'
  const last = game.qi + 1 >= game.questions.length
  const gainText = `${game.gain === 0 ? 'Sem pontos desta vez' : `+${game.gain} ${game.gain === 1 ? 'ponto' : 'pontos'}`}`

  return (
    <motion.div
      className={`${styles.screen} ${styles.center}`}
      style={{ '--c': color }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Confetti light={light} />
      <div className={`${styles.above} ${styles.center} ${styles.screen}`}>
        <motion.h2
          className={styles.big}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        >
          Correto!
        </motion.h2>
        <p className={styles.gain}>{isTeams ? `${team.name}: ${gainText}` : gainText}</p>
        <p className={styles.answer}>{q.options[q.correctIndex]}</p>
        <p className={styles.explanation}>{q.explanation}</p>
        <div className={styles.actions}>
          <button type="button" tabIndex={-1} className={styles.btn} onMouseDown={(e) => e.preventDefault()} onClick={onNext}>
            {last ? 'Ver o resultado' : 'Próxima pergunta'}
          </button>
        </div>
        <p className={styles.footer}>Pressione Enter, Espaço ou a seta para a direita</p>
      </div>
    </motion.div>
  )
}
