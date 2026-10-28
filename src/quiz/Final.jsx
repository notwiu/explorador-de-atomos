import { motion } from 'framer-motion'
import { TEAMS, maxPoints, result } from './engine.js'
import Confetti from './Confetti.jsx'
import styles from './Quiz.module.css'

function soloMessage(points, max) {
  const share = points / max
  if (share >= 0.85) return 'Mandou muito bem!'
  if (share >= 0.6) return 'Muito bem! Dá para melhorar ainda mais.'
  return 'Bom começo! Que tal rever as cenas e tentar de novo?'
}

// Tela final: vencedora (ou empate) no duelo; pontos no modo solo.
export default function Final({ game, onAgain, onMenu, light }) {
  const isTeams = game.mode === 'teams'
  const res = isTeams ? result(game) : null
  const winnerColor = res && res.kind !== 'tie' ? TEAMS[res.kind === 'A' ? 0 : 1].color : 'var(--c-quantum)'
  const title = isTeams ? (res.kind === 'tie' ? 'Empate!' : `${TEAMS[res.kind === 'A' ? 0 : 1].name} venceu!`) : soloMessage(game.scores[0], maxPoints(game))

  return (
    <motion.div
      className={`${styles.screen} ${styles.center}`}
      style={{ '--c': winnerColor }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Confetti light={light} count={50} />
      <div className={`${styles.above} ${styles.center} ${styles.screen}`}>
        <motion.h2
          className={styles.big}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          style={isTeams ? undefined : { fontSize: 'clamp(2.4rem, 6vw, 6.4rem)' }}
        >
          {title}
        </motion.h2>

        {isTeams ? (
          <div className={styles.finalBoard}>
            {TEAMS.map((t, i) => (
              <div key={t.id} className={styles.finalCard} style={{ '--c': t.color }} data-winner={res.kind === t.id}>
                <span className={styles.teamName}>{t.name}</span>
                <span className={styles.teamScore}>{game.scores[i]} pontos</span>
                <span className={styles.finalSmall}>
                  {game.firstTry[i]} {game.firstTry[i] === 1 ? 'acerto' : 'acertos'} de primeira
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.finalBoard}>
            <div className={styles.finalCard} style={{ '--c': 'var(--c-bohr)' }}>
              <span className={styles.teamName}>Seus pontos</span>
              <span className={styles.teamScore}>
                {game.scores[0]} de {maxPoints(game)}
              </span>
              <span className={styles.finalSmall}>
                {game.firstTry[0]} de {game.questions.length} de primeira
              </span>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button type="button" tabIndex={-1} className={styles.btn} onMouseDown={(e) => e.preventDefault()} onClick={onAgain}>
            Jogar de novo
          </button>
          <button type="button" tabIndex={-1} className={`${styles.btn} ${styles.btnGhost}`} onMouseDown={(e) => e.preventDefault()} onClick={onMenu}>
            Voltar ao menu
          </button>
        </div>
        <p className={styles.footer}>Enter joga de novo · Esc volta ao menu</p>
      </div>
    </motion.div>
  )
}
