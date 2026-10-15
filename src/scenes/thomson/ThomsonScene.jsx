import Stage3D from '../../components/Stage3D.jsx'
import SceneShell from '../../components/SceneShell.jsx'
import { createThomsonWorld, STEP_COUNT } from './thomsonWorld.js'

// Cena do Thomson: tubo de raios catódicos e esfera positiva em 3D.
// Passos em src/data/scenes/thomson.js.
const PLAY_STEP = STEP_COUNT - 1

export default function ThomsonScene({ model, steps, step, restartKey, light, notesOpen }) {
  const hint =
    step === PLAY_STEP
      ? 'Arraste os elétrons · R recomeça · ← volta · Esc linha do tempo'
      : step === 0
        ? '→ avança · arraste para girar · N notas do professor · Esc linha do tempo'
        : '→ avança · ← volta · arraste para girar · R repete · N notas · Esc linha do tempo'

  return (
    <SceneShell model={model} steps={steps} step={step} notesOpen={notesOpen} hint={hint}>
      <Stage3D createWorld={createThomsonWorld} step={step} restartKey={restartKey} light={light} />
    </SceneShell>
  )
}
