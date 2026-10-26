import Stage3D from '../../components/Stage3D.jsx'
import SceneShell from '../../components/SceneShell.jsx'
import { createQuantumWorld, STEP_COUNT } from './quantumWorld.js'

// Cena do modelo atual: elétron como onda, incerteza e orbitais em 3D.
// Passos em src/data/scenes/quantum.js.
const PLAY_STEP = STEP_COUNT - 1

export default function QuantumScene({ model, steps, step, restartKey, light, notesOpen }) {
  const hint =
    step === PLAY_STEP
      ? 'Clique: uma foto · segure: longa exposição · botão direito gira · R zera · ← volta · Esc linha do tempo'
      : step === 0
        ? '→ avança · arraste para girar · N notas do professor · Esc linha do tempo'
        : '→ avança · ← volta · arraste para girar · R repete · N notas · Esc linha do tempo'

  return (
    <SceneShell model={model} steps={steps} step={step} notesOpen={notesOpen} hint={hint}>
      <Stage3D createWorld={createQuantumWorld} step={step} restartKey={restartKey} light={light} />
    </SceneShell>
  )
}
