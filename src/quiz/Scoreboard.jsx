import { TEAMS } from './engine.js'
import styles from './Quiz.module.css'

// Placar no alto da tela. No duelo, mostra as duas equipes e destaca a da vez.
export default function Scoreboard({ game }) {
  if (game.mode === 'solo') {
    return (
      <div className={styles.board}>
        <div className={styles.teamCard} style={{ '--c': 'var(--c-bohr)' }} data-active="true">
          <span className={styles.teamName}>Pontos</span>
          <span className={styles.teamScore}>{game.scores[0]}</span>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.board}>
      {TEAMS.map((t, i) => (
        <div key={t.id} className={styles.teamCard} style={{ '--c': t.color }} data-active={game.phase === 'asking' && game.team === i}>
          <span className={styles.teamName}>{t.name}</span>
          <span className={styles.teamScore}>{game.scores[i]}</span>
        </div>
      ))}
    </div>
  )
}
