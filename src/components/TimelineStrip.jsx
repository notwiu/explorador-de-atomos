import styles from './TimelineStrip.module.css'
import { models } from '../data/models.js'

// Faixa com os cinco modelos em ordem cronológica. Na abertura ela "se desenha"
// da esquerda para a direita, acendendo cada modelo na sua cor.
// É uma linha do tempo de verdade, por isso mostra os anos.
export default function TimelineStrip() {
  return (
    <ol className={styles.strip} aria-label="Modelos atômicos em ordem cronológica">
      {models.map((m, i) => (
        <li key={m.id} className={styles.item} style={{ '--accent': m.accent, '--i': i }}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.label}>{m.label}</span>
          <span className={styles.year}>{m.year}</span>
        </li>
      ))}
    </ol>
  )
}
