import styles from './Placeholder.module.css'

// Tela provisória de cada item da roda. Será substituída pelas cenas dos modelos,
// uma de cada vez (Etapas 2 a 4 do roadmap) e pelo quiz (Etapa 6).
export default function Placeholder({ title, text, backLabel = 'Voltar', onBack }) {
  return (
    <div className={styles.screen}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{text}</p>
      <button type="button" className={styles.back} onClick={onBack} onMouseDown={(e) => e.preventDefault()}>
        {backLabel}
      </button>
      <p className={styles.hint}>Ou pressione Esc</p>
    </div>
  )
}
