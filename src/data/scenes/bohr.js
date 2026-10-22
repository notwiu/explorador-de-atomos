// Textos da cena do Bohr, passo a passo (fonte: docs/conteudo-modelos.md).
// "note" é a nota do professor (tecla N); pode ser null.
export const bohrSteps = [
  {
    title: 'Por que mudar o modelo?',
    text: 'O modelo de Rutherford não explicava por que os elétrons não caem no núcleo, nem as cores da luz emitida pelos átomos.',
    note: 'Lembre a pergunta deixada no ar na cena anterior: por que os átomos são estáveis?',
  },
  {
    title: 'Camadas de energia',
    text: 'Bohr propôs que os elétrons só podem ocupar certas camadas, cada uma com uma energia definida. Nelas, o elétron não perde energia.',
    note: 'O desenho está fora de escala. A escada à direita mostra a mesma ideia: cada camada é um nível de energia.',
  },
  {
    title: 'Ganhando energia, o elétron salta',
    text: 'Ao absorver energia, o elétron salta para uma camada mais externa.',
    note: 'Aqui o elétron começa na camada 2. No hidrogênio, a de menor energia é a 1, mas a luz visível vem das quedas até a camada 2.',
  },
  {
    title: 'Ao voltar, ele emite luz',
    text: 'Quando o elétron volta para uma camada mais interna, devolve a energia em forma de luz.',
    note: 'A energia que entrou sai como luz: é a mesma quantidade.',
  },
  {
    title: 'A cor depende do salto',
    text: 'Cada salto entre camadas emite uma luz de cor diferente. Os saltos do hidrogênio até a camada 2 formam o espectro que vemos.',
    note: 'Esses quatro saltos são as linhas visíveis do hidrogênio: vermelha, azul-esverdeada, azul e violeta. Há outras linhas, mas invisíveis (ultravioleta e infravermelho).',
  },
  {
    title: 'Fogos de artifício e neon',
    text: 'Cada elemento emite cores próprias quando seus elétrons saltam e voltam. É por isso que os fogos de artifício e as luzes de neon têm cores diferentes.',
    note: 'Pergunte à turma: por que cada fogo de artifício tem uma cor diferente? Exemplos do teste da chama: sódio (amarelo), cobre (verde), estrôncio (vermelho) e potássio (lilás).',
  },
  {
    title: 'O modelo de Bohr',
    text: 'Os elétrons ficam em camadas com energias definidas. Ao ganhar energia, o elétron salta para uma camada mais externa; ao voltar, devolve essa energia em forma de luz.',
    note: 'Esse modelo funciona muito bem para o hidrogênio, o átomo mais simples.',
  },
  {
    title: 'O que o modelo não explicava',
    text: 'Funciona bem para o hidrogênio, mas não explica átomos com mais elétrons nem o comportamento ondulatório dos elétrons.',
    note: 'Deixe a pergunta no ar: onde exatamente está o elétron? O próximo modelo responde de um jeito surpreendente.',
  },
  {
    title: 'Hora de brincar',
    text: 'Clique numa camada (ou num nível da escada) para mover o elétron. Veja a luz que ele emite e como o espectro vai se formando.',
    note: 'Peça à turma para descobrir quais saltos emitem luz visível. Dica: são os que terminam na camada 2.',
  },
]
