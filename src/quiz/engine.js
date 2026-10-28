// Regras do quiz (sem tela): sorteio das perguntas, pontos, vez das equipes e fim de jogo.
// Tudo aqui é função pura, para poder ser testada sem navegador.

export const TEAMS = [
  { id: 'A', name: 'Equipe A', color: '#ff7a6b' },
  { id: 'B', name: 'Equipe B', color: '#7ee7ff' },
]

// Pontos pela tentativa em que a equipe acerta: 1ª tentativa = 3, 2ª = 2, 3ª = 1, 4ª = 0.
export const POINTS = [3, 2, 1, 0]

export const MODEL_ORDER = ['dalton', 'thomson', 'rutherford', 'bohr', 'quantum']
export const QUESTIONS_PER_MODEL = 2

export function shuffle(list, rng = Math.random) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Escolhe 2 perguntas de cada modelo, na ordem dos modelos (do Dalton ao modelo atual)
export function pickQuestions(bank, rng = Math.random, perModel = QUESTIONS_PER_MODEL) {
  return MODEL_ORDER.flatMap((model) => shuffle(bank.filter((q) => q.model === model), rng).slice(0, perModel))
}

// Embaralha as alternativas e descobre onde ficou a correta (a 1ª do banco)
export function prepareQuestion(q, rng = Math.random) {
  const order = shuffle(q.options.map((text, i) => ({ text, correct: i === 0 })), rng)
  return {
    id: q.id,
    model: q.model,
    text: q.text,
    explanation: q.explanation,
    options: order.map((o) => o.text),
    correctIndex: order.findIndex((o) => o.correct),
  }
}

export function newGame(mode, bank, rng = Math.random) {
  return {
    mode, // 'teams' ou 'solo'
    questions: pickQuestions(bank, rng).map((q) => prepareQuestion(q, rng)),
    qi: 0, // pergunta atual
    team: 0, // de quem é a vez (0 = Equipe A, 1 = Equipe B); no solo fica sempre 0
    tries: [], // alternativas erradas já tentadas na pergunta atual
    phase: 'asking', // 'asking' (respondendo), 'correct' (tela de acerto), 'done' (fim)
    scores: [0, 0],
    firstTry: [0, 0], // acertos de primeira
    gain: 0, // pontos ganhos na última pergunta
    log: [], // { qi, team, tries, gain }
  }
}

export function pointsLeft(game) {
  return POINTS[Math.min(game.tries.length, POINTS.length - 1)]
}

export function reduce(state, action) {
  switch (action.type) {
    case 'start':
      return newGame(action.mode, action.bank, action.rng)

    case 'pick': {
      if (!state || state.phase !== 'asking') return state
      const q = state.questions[state.qi]
      const i = action.index
      if (!Number.isInteger(i) || i < 0 || i >= q.options.length || state.tries.includes(i)) return state
      if (i !== q.correctIndex) return { ...state, tries: [...state.tries, i] }
      // acertou
      const gain = pointsLeft(state)
      const scores = [...state.scores]
      scores[state.team] += gain
      const firstTry = [...state.firstTry]
      if (state.tries.length === 0) firstTry[state.team] += 1
      return {
        ...state,
        phase: 'correct',
        scores,
        firstTry,
        gain,
        log: [...state.log, { qi: state.qi, team: state.team, tries: state.tries.length, gain }],
      }
    }

    case 'next': {
      if (!state || state.phase !== 'correct') return state
      if (state.qi + 1 >= state.questions.length) return { ...state, phase: 'done' }
      return {
        ...state,
        qi: state.qi + 1,
        team: state.mode === 'teams' ? 1 - state.team : 0,
        tries: [],
        phase: 'asking',
        gain: 0,
      }
    }

    default:
      return state
  }
}

// Resultado final (equipes): vencedora ou empate
export function result(state) {
  const [a, b] = state.scores
  if (a === b) return { kind: 'tie', a, b }
  return { kind: a > b ? 'A' : 'B', a, b }
}

// Máximo de pontos possível no jogo
export const maxPoints = (state) => state.questions.length * POINTS[0]
