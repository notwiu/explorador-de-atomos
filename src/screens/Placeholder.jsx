import styles from './Placeholder.module.css'

// Tela provisória da linha do tempo. Será substituída pelas cenas dos modelos,
// uma de cada vez (Etapas 2 a 4 do roadmap).
export default function Placeholder({ onBack }) {
  return (
    <div className={styles.screen}>
      <h2 className={styles.title}>Linha do tempo</h2>
      <p className={styles.text}>Em construção. A primeira cena (Dalton) chega na próxima etapa.</p>
      <button type="button" className={styles.back} onClick={onBack}>
        Voltar para a abertura
      </button>
      <p className={styles.hint}>Ou pressione Esc ou a seta para a esquerda</p>
    </div>
  )
}
