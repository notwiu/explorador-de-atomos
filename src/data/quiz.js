// Banco de perguntas do quiz (fonte: docs/quiz.md).
// A primeira alternativa de cada pergunta é a CORRETA; o jogo embaralha as alternativas.
// Cada partida sorteia 2 perguntas de cada modelo, na ordem cronológica dos modelos.
// Limites de tamanho (para caber na tela do projetor): pergunta até 110 letras,
// alternativa até 60 e explicação até 170.

export const quizBank = [
  // ----- Dalton -----
  {
    id: 'dalton-1',
    model: 'dalton',
    text: 'Quem propôs que o átomo é uma esfera maciça e indivisível?',
    options: ['Dalton', 'Thomson', 'Rutherford', 'Bohr'],
    explanation: 'Dalton imaginou o átomo como uma esfera minúscula, maciça e indivisível, como uma bola de bilhar.',
  },
  {
    id: 'dalton-2',
    model: 'dalton',
    text: 'Para Dalton, o que acontece com os átomos numa reação química?',
    options: [
      'Eles se rearranjam, sem serem criados nem destruídos',
      'Eles são destruídos e viram outros átomos',
      'Eles se dividem em partes menores',
      'Eles ficam maiores',
    ],
    explanation: 'Na reação, os átomos mudam de parceiros, mas nenhum átomo é criado ou destruído.',
  },
  {
    id: 'dalton-3',
    model: 'dalton',
    text: 'Segundo Dalton, como são os átomos de um mesmo elemento?',
    options: ['Todos iguais entre si', 'Todos diferentes entre si', 'Uns maiores e outros menores, ao acaso', 'Formados por partes menores'],
    explanation: 'Átomos de um mesmo elemento são iguais entre si e diferentes dos átomos de outros elementos.',
  },
  {
    id: 'dalton-4',
    model: 'dalton',
    text: 'Qual comparação combina com o átomo de Dalton?',
    options: ['Uma bola de bilhar', 'Um pudim de passas', 'Um sistema solar', 'Uma nuvem de pontos'],
    explanation: 'Para Dalton, o átomo é uma esfera maciça e lisa, sem partes dentro, como uma bola de bilhar.',
  },

  // ----- Thomson -----
  {
    id: 'thomson-1',
    model: 'thomson',
    text: 'O que Thomson descobriu?',
    options: ['O elétron', 'O núcleo', 'As camadas de energia', 'O orbital'],
    explanation: 'Com os raios catódicos, Thomson descobriu o elétron e mostrou que o átomo não é indivisível.',
  },
  {
    id: 'thomson-2',
    model: 'thomson',
    text: 'Que comparação ficou famosa para o modelo de Thomson?',
    options: ['Pudim de passas', 'Sistema solar', 'Bola de bilhar', 'Nuvem de pontos'],
    explanation: 'Os elétrons (as passas) ficam espalhados numa esfera positiva (o pudim).',
  },
  {
    id: 'thomson-3',
    model: 'thomson',
    text: 'No tubo de raios catódicos, por que o feixe se curva em direção à placa positiva?',
    options: ['Porque o feixe tem carga negativa', 'Porque o feixe tem carga positiva', 'Porque o feixe não tem carga', 'Porque o feixe é muito pesado'],
    explanation: 'Cargas opostas se atraem: o feixe é atraído pela placa positiva, então ele é negativo.',
  },
  {
    id: 'thomson-4',
    model: 'thomson',
    text: 'No modelo de Thomson, por que o átomo é neutro?',
    options: ['A carga positiva equilibra a negativa', 'Porque não existem cargas', 'Porque só existem prótons', 'Porque os elétrons ficam no núcleo'],
    explanation: 'A esfera positiva e os elétrons negativos se equilibram, e por isso o átomo é neutro.',
  },

  // ----- Rutherford -----
  {
    id: 'rutherford-1',
    model: 'rutherford',
    text: 'O que o experimento da folha de ouro revelou?',
    options: ['Existe um núcleo pequeno, denso e positivo', 'O átomo é uma esfera maciça', 'O elétron é uma onda', 'Os elétrons ficam parados'],
    explanation: 'As partículas que se desviaram ou voltaram indicaram um centro minúsculo, denso e positivo: o núcleo.',
  },
  {
    id: 'rutherford-2',
    model: 'rutherford',
    text: 'Por que quase todas as partículas alfa atravessaram a folha de ouro?',
    options: ['O átomo é quase todo espaço vazio', 'A folha era muito grossa', 'As partículas eram neutras', 'O átomo é maciço'],
    explanation: 'O núcleo ocupa uma região minúscula; o resto do átomo é, em grande parte, espaço vazio.',
  },
  {
    id: 'rutherford-3',
    model: 'rutherford',
    text: 'O que acontece com uma partícula alfa que vem de frente para o núcleo?',
    options: ['Ela volta, porque é repelida', 'Ela atravessa o núcleo sem desviar', 'Ela é atraída e fica presa', 'Ela vira um elétron'],
    explanation: 'A partícula alfa e o núcleo são positivos: cargas de mesmo sinal se repelem.',
  },
  {
    id: 'rutherford-4',
    model: 'rutherford',
    text: 'O que o modelo de Rutherford não conseguia explicar?',
    options: ['Por que o elétron não cai no núcleo', 'A existência do núcleo', 'A carga positiva do núcleo', 'Por que o átomo é neutro'],
    explanation: 'Pelas leis da física da época, o elétron em órbita perderia energia e cairia no núcleo. Bohr propôs uma resposta.',
  },
  {
    id: 'rutherford-5',
    model: 'rutherford',
    text: 'Qual modelo mostrou que o átomo tem um núcleo?',
    options: ['O de Rutherford', 'O de Dalton', 'O de Thomson', 'Nenhum deles'],
    explanation: 'Foi o experimento de Rutherford, com a folha de ouro, que revelou o núcleo.',
  },

  // ----- Bohr -----
  {
    id: 'bohr-1',
    model: 'bohr',
    text: 'No modelo de Bohr, onde os elétrons ficam?',
    options: ['Em camadas com energias definidas', 'Espalhados numa esfera positiva', 'Dentro do núcleo', 'Em qualquer lugar, sem regra'],
    explanation: 'Bohr propôs que os elétrons só podem ocupar certas camadas, cada uma com uma energia definida.',
  },
  {
    id: 'bohr-2',
    model: 'bohr',
    text: 'O que acontece quando um elétron absorve energia, no modelo de Bohr?',
    options: ['Salta para uma camada mais externa', 'Cai no núcleo', 'Desaparece', 'Fica mais pesado'],
    explanation: 'Ao absorver energia, o elétron salta para uma camada mais externa.',
  },
  {
    id: 'bohr-3',
    model: 'bohr',
    text: 'Quando o elétron volta para uma camada mais interna, ele...',
    options: ['Emite luz', 'Absorve luz', 'Vira núcleo', 'Perde sua carga'],
    explanation: 'O elétron devolve a energia que tinha ganhado em forma de luz.',
  },
  {
    id: 'bohr-4',
    model: 'bohr',
    text: 'Por que fogos de artifício têm cores diferentes?',
    options: ['Cada elemento emite luz de cores próprias', 'Porque a pólvora muda de cor', 'Porque o ar colore a luz', 'Porque os átomos mudam de tamanho'],
    explanation: 'Cada elemento tem seus saltos de elétrons, e cada salto emite uma cor. Por isso sódio, cobre e estrôncio dão cores diferentes.',
  },

  // ----- Modelo atual -----
  {
    id: 'quantum-1',
    model: 'quantum',
    text: 'O que é um orbital?',
    options: ['A região onde é mais provável encontrar o elétron', 'Uma órbita circular exata', 'O núcleo do átomo', 'Uma camada cheia de prótons'],
    explanation: 'Não sabemos exatamente onde o elétron está; o orbital mostra onde é mais provável encontrá-lo.',
  },
  {
    id: 'quantum-2',
    model: 'quantum',
    text: 'Pelo princípio da incerteza, o que não dá para saber com exatidão ao mesmo tempo?',
    options: ['A posição e o movimento do elétron', 'A carga e a massa do elétron', 'O número de prótons e de nêutrons', 'A cor e a energia da luz'],
    explanation: 'Pelo princípio da incerteza, de Heisenberg, não dá para saber, ao mesmo tempo e com exatidão, a posição e o movimento do elétron.',
  },
  {
    id: 'quantum-3',
    model: 'quantum',
    text: 'Qual é a forma do orbital s?',
    options: ['Uma esfera', 'Um haltere', 'Um anel', 'Um cubo'],
    explanation: 'O orbital s é uma esfera em volta do núcleo. Os orbitais p têm forma de halteres.',
  },
  {
    id: 'quantum-4',
    model: 'quantum',
    text: 'Quem propôs que o elétron também se comporta como uma onda?',
    options: ['De Broglie', 'Dalton', 'Thomson', 'Rutherford'],
    explanation: 'Em 1924, de Broglie propôs que o elétron também tem comportamento de onda.',
  },
]
