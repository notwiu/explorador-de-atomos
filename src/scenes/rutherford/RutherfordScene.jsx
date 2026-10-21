import Stage3D from '../../components/Stage3D.jsx'
import SceneShell from '../../components/SceneShell.jsx'
import { createRutherfordWorld, STEP_COUNT } from './rutherfordWorld.js'

// Cena do Rutherford: experimento da folha de ouro, núcleo e partículas alfa em 3D.
// Passos em src/data/scenes/rutherford.js.
const PLAY_STEP = STEP_COUNT - 1

export default function RutherfordScene({ model, steps, step, restartKey, light, notesOpen }) {
  const hint =
    step === PLAY_STEP
      ? 'Clique ou arraste para disparar · botão direito gira · R zera · ← volta · Esc linha do tempo'
      : step === 0
        ? '→ avança · arraste para girar · N notas do professor · Esc linha do tempo'
        : '→ avança · ← volta · arraste para girar · R repete · N notas · Esc linha do tempo'

  return (
    <SceneShell model={model} steps={steps} step={step} notesOpen={notesOpen} hint={hint}>
      <Stage3D createWorld={createRutherfordWorld} step={step} restartKey={restartKey} light={light} />
    </SceneShell>
  )
}
