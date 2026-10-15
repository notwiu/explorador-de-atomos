// Dados dos modelos atômicos.
// Os textos científicos completos (widget, notas, "por que mudou?") entram junto com
// cada cena, sempre a partir de docs/conteudo-modelos.md.
// Os anos são anos de referência e ainda serão revisados com o professor.
import { photoFor } from './photos.js'

export const models = [
  {
    id: 'dalton',
    label: 'Dalton',
    year: 1803,
    modelName: 'Esfera maciça',
    accent: 'var(--c-dalton)',
    scientist: 'John Dalton',
    shortText:
      'Para Dalton, toda matéria é feita de átomos: esferas minúsculas, maciças e indivisíveis. Cada elemento tem seus próprios átomos, diferentes dos de outros elementos.',
  },
{
    id: 'thomson',
    label: 'Thomson',
    year: 1897,
    modelName: 'Pudim de passas',
    accent: 'var(--c-thomson)',
    scientist: 'J. J. Thomson',
    shortText:
      'Thomson descobriu o elétron e mostrou que o átomo não é indivisível. Ele imaginou uma esfera positiva com elétrons negativos espalhados, como passas num pudim.',
  },
  { id: 'rutherford', label: 'Rutherford', year: 1911, modelName: 'Modelo nuclear', accent: 'var(--c-rutherford)' },
  { id: 'bohr', label: 'Bohr', year: 1913, modelName: 'Camadas de energia', accent: 'var(--c-bohr)' },
  { id: 'quantum', label: 'Modelo atual', year: 1926, modelName: 'Orbitais', accent: 'var(--c-quantum)' },
]

// A última "foto" da roda é o quiz.
const quizItem = {
  id: 'quiz',
  label: 'Quiz',
  year: null,
  modelName: 'Teste o que você viu',
  accent: 'var(--c-quiz)',
}

// Itens da tela de seleção (roda orbital): os cinco modelos e, por último, o quiz.
export const timelineItems = [...models, quizItem].map((item) => ({
  ...item,
  kind: item.id === 'quiz' ? 'quiz' : 'model',
  photo: photoFor(item.id),
}))
