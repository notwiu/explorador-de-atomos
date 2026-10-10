import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Starfield from '../components/Starfield.jsx'
import Controls from '../components/Controls.jsx'
import Intro from '../screens/Intro.jsx'
import Placeholder from '../screens/Placeholder.jsx'
import { useFullscreen } from '../hooks/useFullscreen.js'
import { useIdleHide } from '../hooks/useIdleHide.js'
import { useKeyboardNav } from '../hooks/useKeyboardNav.js'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import { getPerformance } from './performance.js'
import styles from './App.module.css'

// Fluxo geral. Por enquanto: abertura -> linha do tempo (provisória).
// Mais tarde: abertura -> linha do tempo -> laboratório -> quiz -> encerramento.
const STAGES = ['intro', 'timeline']

export default function App() {
  const reducedMotion = useReducedMotion()
  const [stage, setStage] = useState('intro')
  const [lightMode, setLightMode] = useState(reducedMotion)
  const { isFullscreen, toggleFullscreen } = useFullscreen()
  const controlsVisible = useIdleHide()
  const perf = getPerformance(lightMode)

  const next = () => setStage((s) => STAGES[Math.min(STAGES.indexOf(s) + 1, STAGES.length - 1)])
  const prev = () => setStage((s) => STAGES[Math.max(STAGES.indexOf(s) - 1, 0)])

  useKeyboardNav({
    next,
    prev,
    fullscreen: toggleFullscreen,
    light: () => setLightMode((v) => !v),
  })

  return (
    <div className={styles.shell} data-light={lightMode}>
      <Starfield count={perf.stars} twinkle={perf.twinkle} />

      <Controls
        visible={controlsVisible}
        isFullscreen={isFullscreen}
        onFullscreen={toggleFullscreen}
        lightMode={lightMode}
        onLight={() => setLightMode((v) => !v)}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          className={styles.stage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45 }}
        >
          {stage === 'intro' && <Intro onStart={next} glow={perf.glow} trails={perf.trails} />}
          {stage === 'timeline' && <Placeholder onBack={prev} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
