import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Starfield from '../components/Starfield.jsx'
import Controls from '../components/Controls.jsx'
import Intro from '../screens/Intro.jsx'
import Timeline from '../screens/Timeline.jsx'
import Placeholder from '../screens/Placeholder.jsx'
import Quiz from '../quiz/Quiz.jsx'
import { sceneRegistry } from '../scenes/index.js'
import { timelineItems } from '../data/models.js'
import { useFullscreen } from '../hooks/useFullscreen.js'
import { useIdleHide } from '../hooks/useIdleHide.js'
import { useKeyboardNav } from '../hooks/useKeyboardNav.js'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import { getPerformance } from './performance.js'
import styles from './App.module.css'

// Fluxo geral:
//   intro (abertura) -> wheel (roda de cartões) -> scene (cena do modelo) ou quiz
// As cenas ainda são telas provisórias; entram uma por vez nas próximas etapas.
const N = timelineItems.length
const mod = (v, n) => ((v % n) + n) % n

export default function App() {
  const reducedMotion = useReducedMotion()
  const [stage, setStage] = useState('intro') // 'intro' | 'wheel' | 'scene'
  const [focus, setFocus] = useState(0) // item em foco na roda
  const [sceneStep, setSceneStep] = useState(0) // passo dentro da cena aberta
  const [restartKey, setRestartKey] = useState(0) // muda para repetir a animação do passo
  const [notesOpen, setNotesOpen] = useState(false) // notas do professor (tecla N)
  const [lightMode, setLightMode] = useState(reducedMotion)
  const { isFullscreen, toggleFullscreen } = useFullscreen()
  const controlsVisible = useIdleHide()
  const perf = getPerformance(lightMode)
  const current = timelineItems[focus]
  const scene = sceneRegistry[current.id] // undefined = cena ainda não criada

  const openItem = () => {
    if (current.kind === 'quiz') {
      setStage('quiz')
      return
    }
    setSceneStep(0)
    setStage('scene')
  }
  const goWheel = () => setStage('wheel')

  // Teclas de cada tela
  const sceneKeys = scene
    ? {
        next: () => setSceneStep((s) => Math.min(s + 1, scene.steps.length - 1)),
        activate: () => setSceneStep((s) => Math.min(s + 1, scene.steps.length - 1)),
        prev: () => (sceneStep > 0 ? setSceneStep((s) => s - 1) : goWheel()),
        back: goWheel,
        restart: () => setRestartKey((k) => k + 1),
        notes: () => setNotesOpen((v) => !v),
      }
    : { back: goWheel, prev: goWheel }

  const keys = {
    intro: { next: () => setStage('wheel') },
    wheel: {
      next: () => setFocus((i) => mod(i + 1, N)),
      prev: () => setFocus((i) => mod(i - 1, N)),
      activate: openItem,
      back: () => setStage('intro'),
    },
    scene: sceneKeys,
    quiz: {}, // o quiz trata o próprio teclado (o App só cuida de F e L)
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
            <Timeline focusIndex={focus} onFocus={setFocus} onOpen={openItem} light={lightMode} />
          )}

          {stage === 'scene' && scene && (
            <scene.Component
              model={current}
              steps={scene.steps}
              step={sceneStep}
              restartKey={restartKey}
              light={lightMode}
              notesOpen={notesOpen}
            />
          )}

          {stage === 'quiz' && <Quiz onExit={goWheel} light={lightMode} />}

          {stage === 'scene' && !scene && (
            <Placeholder
              title={current.label}
              text={
                current.kind === 'quiz'
                  ? 'Em construção. O quiz chega numa das últimas etapas.'
                  : `Em construção. A cena de ${current.label} chega nas próximas etapas.`
              }
              backLabel="Voltar para a linha do tempo"
              onBack={goWheel}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
