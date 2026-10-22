import Stage3D from '../../components/Stage3D.jsx'
import SceneShell from '../../components/SceneShell.jsx'
import { createBohrWorld, STEP_COUNT } from './bohrWorld.js'

// Cena do Bohr: camadas de energia, saltos do elétron, luz e espectro em 3D.
// Passos em src/data/scenes/bohr.js.
const PLAY_STEP = STEP_COUNT - 1

export default function BohrScene({ model, steps, step, restartKey, light, notesOpen }) {
  const hint =
    step === PLAY_STEP
      ? 'Clique numa camada ou nível · arraste o fundo para girar · R recomeça · ← volta · Esc linha do tempo'
      : step === 0
        ? '→ avança · arraste para girar · N notas do professor · Esc linha do tempo'
        : '→ avança · ← volta · arraste para girar · R repete · N notas · Esc linha do tempo'

  return (
    <SceneShell model={model} steps={steps} step={step} notesOpen={notesOpen} hint={hint}>
      <Stage3D createWorld={createBohrWorld} step={step} restartKey={restartKey} light={light} />
    </SceneShell>
  )
}
