import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Starfield from '../components/Starfield.jsx'
import Controls from '../components/Controls.jsx'
import Intro from '../screens/Intro.jsx'
import Timeline from '../screens/Timeline.jsx'
import Placeholder from '../screens/Placeholder.jsx'
import { timelineItems } from '../data/models.js'
import { useFullscreen } from '../hooks/useFullscreen.js'
import { useIdleHide } from '../hooks/useIdleHide.js'
import { useKeyboardNav } from '../hooks/useKeyboardNav.js'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import { getPerformance } from './performance.js'
import styles from './App.module.css'

// Fluxo geral:
//   intro (abertura) -> wheel (roda de cartões) -> scene (cena do item escolhido)
// As cenas ainda são telas provisórias; entram uma por vez nas próximas etapas.
const N = timelineItems.length
const mod = (v, n) => ((v % n) + n) % n

export default function App() {
  const reducedMotion = useReducedMotion()
  const [stage, setStage] = useState('intro') // 'intro' | 'wheel' | 'scene'
  const [focus, setFocus] = useState(0) // item em foco na roda
  const [lightMode, setLightMode] = useState(reducedMotion)
  const { isFullscreen, toggleFullscreen } = useFullscreen()
  const controlsVisible = useIdleHide()
  const perf = getPerformance(lightMode)
  const current = timelineItems[focus]

  // Teclas de cada tela
  const keys = {
    intro: { next: () => setStage('wheel') },
    wheel: {
      next: () => setFocus((i) => mod(i + 1, N)),
      prev: () => setFocus((i) => mod(i - 1, N)),
      activate: () => setStage('scene'),
      back: () => setStage('intro'),
    },
    scene: { back: () => setStage('wheel'), prev: () => setStage('wheel') },
  }[stage]

  useKeyboardNav({
    ...keys,
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
          {stage === 'intro' && <Intro onStart={() => setStage('wheel')} glow={perf.glow} trails={perf.trails} />}

          {stage === 'wheel' && (
            <Timeline focusIndex={focus} onFocus={setFocus} onOpen={() => setStage('scene')} light={lightMode} />
          )}

          {stage === 'scene' && (
            <Placeholder
              title={current.label}
              text={
                current.kind === 'quiz'
                  ? 'Em construção. O quiz chega numa das últimas etapas.'
                  : `Em construção. A cena de ${current.label} chega nas próximas etapas.`
              }
              backLabel="Voltar para a linha do tempo"
              onBack={() => setStage('wheel')}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
