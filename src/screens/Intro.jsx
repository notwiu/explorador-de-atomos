import { motion } from 'framer-motion'
import HeroAtom from '../components/HeroAtom.jsx'
import TimelineStrip from '../components/TimelineStrip.jsx'
import styles from './Intro.module.css'

// Tela inicial (abertura). Um único momento de movimento orquestrado ao entrar:
// o átomo acende, o título se revela e a linha do tempo se desenha.
// Depois disso, só o átomo e as estrelas continuam em movimento suave.
const ease = [0.2, 0.7, 0.1, 1]

export default function Intro({ onStart, glow, trails }) {
  return (
    <div className={styles.screen}>
      <div className={styles.hero}>
        <div className={styles.copy}>
          <h1 className={styles.title}>
            <span className={styles.mask}>
              <motion.span
                className={styles.line}
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease }}
              >
                Explorador
              </motion.span>
            </span>
            <span className={styles.mask}>
              <motion.span
                className={styles.line}
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease }}
              >
                de Átomos
              </motion.span>
            </span>
          </h1>

          <motion.p
            className={styles.lead}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            Uma viagem pela história dos modelos atômicos, de Dalton aos dias de hoje.
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.3, ease }}
          >
            <button type="button" className={styles.start} onClick={onStart}>
              Começar a viagem
            </button>
            <p className={styles.hint}>Pressione Espaço, Enter ou a seta para a direita</p>
          </motion.div>
        </div>

        <motion.div
          className={styles.atom}
          initial={{ opacity: 0, scale: 0.55, rotate: -25 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.4, delay: 0.1, ease }}
        >
          <HeroAtom glow={glow} trails={trails} />
        </motion.div>
      </div>

      <div className={styles.timeline}>
        <TimelineStrip />
      </div>
    </div>
  )
}
