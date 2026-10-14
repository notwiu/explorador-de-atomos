import { AnimatePresence, motion } from 'framer-motion'
import AtomWidget from './AtomWidget.jsx'
import styles from './SceneShell.module.css'

// Moldura comum das cenas dos modelos: área 3D à esquerda (children), legenda do
// passo, indicador de progresso e o widget lateral à direita.
export default function SceneShell({ model, steps, step, notesOpen, hint, children }) {
  const current = steps[step]
  return (
    <div className={styles.scene} style={{ '--accent': model.accent }}>
      <div className={styles.view}>
        <div className={styles.stage}>{children}</div>

        <div className={styles.chip}>
          <span className={styles.chipName}>{model.label}</span>
          <span className={styles.chipStep}>
            Passo {step + 1} de {steps.length}
          </span>
        </div>

        <div className={styles.caption}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className={styles.title}>{current.title}</h2>
              <p className={styles.text}>{current.text}</p>
            </motion.div>
          </AnimatePresence>

          <div className={styles.dots} aria-hidden="true">
            {steps.map((_, i) => (
              <span key={i} className={styles.dot} data-state={i === step ? 'current' : i < step ? 'done' : 'todo'} />
            ))}
          </div>
          <p className={styles.hint}>{hint}</p>
        </div>
      </div>

      <aside className={styles.side}>
        <AtomWidget model={model} showNotes={notesOpen} note={current.note} />
      </aside>
    </div>
  )
}
