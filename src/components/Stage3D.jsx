import { useEffect, useRef, useState } from 'react'
import { createStage } from '../three/stage.js'
import { useReducedMotion } from '../hooks/useReducedMotion.js'

// Cria o palco 3D e o "mundo" de uma cena, e conecta ao passo atual.
// `createWorld(stage, { reduced })` deve devolver { goTo(step, opts), dispose() }.
export default function Stage3D({ createWorld, step, restartKey, light }) {
  const hostRef = useRef(null)
  const worldRef = useRef(null)
  const applied = useRef({ step, restartKey })
  const latest = useRef({ step, restartKey })
  latest.current = { step, restartKey }
  const [failed, setFailed] = useState(false)
  const reduced = useReducedMotion()

  // Cria (e destrói) o palco
  useEffect(() => {
    const stage = createStage(hostRef.current, { light, reduced })
    if (!stage) {
      setFailed(true)
      return undefined
    }
    setFailed(false)
    const world = createWorld(stage, { reduced })
    world.goTo(latest.current.step, { immediate: true })
    applied.current = { ...latest.current }
    worldRef.current = world
    return () => {
      world.dispose()
      stage.dispose()
      worldRef.current = null
    }
  }, [createWorld, light, reduced])

  // Acompanha as mudanças de passo e o "reiniciar"
  useEffect(() => {
    const world = worldRef.current
    if (!world) return
    const was = applied.current
    if (was.step === step && was.restartKey === restartKey) return
    world.goTo(step, { replay: was.restartKey !== restartKey && was.step === step })
    applied.current = { step, restartKey }
  }, [step, restartKey])

  return (
    <>
      <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} />
      {failed && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: '2rem', textAlign: 'center', fontSize: 'var(--fs-lead)', color: 'var(--text-muted)' }}>
          Não foi possível abrir o 3D neste navegador. Ative a aceleração de hardware ou tente outro navegador.
        </div>
      )}
    </>
  )
}
