import OrbitalWheel from '../components/OrbitalWheel.jsx'
import { timelineItems } from '../data/models.js'
import styles from './Timeline.module.css'

// Tela de seleção: a linha do tempo em forma de roda de cartões, estilo jogo.
// Cinco modelos em ordem cronológica e, por último, o quiz.
export default function Timeline({ focusIndex, onFocus, onOpen, light }) {
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h2 className={styles.title}>Linha do tempo</h2>
        <p className={styles.sub}>Escolha um cartão para começar</p>
      </header>
      <OrbitalWheel items={timelineItems} focusIndex={focusIndex} onFocus={onFocus} onOpen={onOpen} light={light} />
    </div>
  )
}
