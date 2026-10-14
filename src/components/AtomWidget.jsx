import ModelArt from './ModelArt.jsx'
import styles from './AtomWidget.module.css'

// Widget lateral de cada cena: foto (ou ilustração provisória), nome, ano, modelo
// e um texto curto para o professor ler. A nota do professor aparece embaixo (tecla N).
export default function AtomWidget({ model, showNotes, note }) {
  return (
    <div className={styles.wrap} style={{ '--accent': model.accent }}>
      <div className={styles.card}>
        <div className={styles.media}>
          {model.photo ? (
            <img className={styles.photo} src={model.photo} alt={`Retrato de ${model.scientist ?? model.label}`} draggable="false" />
          ) : (
            <div className={styles.art}>
              <ModelArt id={model.id} accent={model.accent} />
            </div>
          )}
        </div>
        <div className={styles.body}>
          <h3 className={styles.name}>{model.scientist ?? model.label}</h3>
          <p className={styles.meta}>
            {model.year} · {model.modelName}
          </p>
          {model.shortText && <p className={styles.text}>{model.shortText}</p>}
        </div>
      </div>

      {showNotes && (
        <div className={styles.note}>
          <span className={styles.noteTitle}>Para o professor</span>
          <p className={styles.noteText}>{note ?? 'Sem nota para este passo.'}</p>
        </div>
      )}
    </div>
  )
}
