import { AnimatePresence, motion } from 'framer-motion'
import styles from './Controls.module.css'

// Botões discretos no canto da tela. Somem sozinhos depois de alguns segundos
// sem atividade, para a projeção ficar limpa.
export default function Controls({ visible, isFullscreen, onFullscreen, lightMode, onLight }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.bar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button type="button" className={styles.btn} onClick={onLight} aria-pressed={lightMode}>
            <span className={styles.key}>L</span>
            Modo leve: {lightMode ? 'ligado' : 'desligado'}
          </button>
          <button type="button" className={styles.btn} onClick={onFullscreen} aria-pressed={isFullscreen}>
            <span className={styles.key}>F</span>
            {isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
