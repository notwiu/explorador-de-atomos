# Experiência e design

## 1. Princípios

1. **Projetor primeiro:** tudo precisa ser visto do fundo da sala.
2. **Animação com propósito:** cada movimento ensina algo, além de enfeitar.
3. **O professor conduz:** nada começa sozinho.
4. **Pouco texto, muito visual.**
5. **Leveza:** a animação pode ser intensa, mas o site precisa rodar em computador simples.

## 2. Fluxo geral

```
Abertura
   ↓
Linha do tempo
   Dalton → Thomson → Rutherford → Bohr → Modelo atual
   (entre cada uma: "Por que mudou?")
   Cada cena é em 3D e termina com um passo de "brincar"
   ↓
Quiz
   ↓
Encerramento
```

## 2.1 Tela inicial (abertura)

**Objetivo:** abrir a aula com impacto e deixar claro o que vem pela frente.

```
┌──────────────────────────────────────────────────────────────┐
│                                              [L leve][F tela]│
│  Explorador                          ╭─────────────╮          │
│  de Átomos                           │  átomo      │          │
│                                      │  animado    │          │
│  Uma viagem pela história            ╰─────────────╯          │
│  dos modelos atômicos...                                      │
│  [ Começar a viagem ]                                         │
│  Pressione Espaço, Enter ou →                                 │
│                                                               │
│  ●────────●────────●────────●────────●                        │
│  Dalton  Thomson  Rutherford Bohr   Modelo atual              │
│  1803    1897     1911       1913   1926                      │
└──────────────────────────────────────────────────────────────┘
```

**Elementos**
- **Título** em duas linhas, alinhado à esquerda, fonte condensada e pesada.
- **Átomo animado** à direita: núcleo que "respira" e três elétrons de cores diferentes com rastro.
- **Fundo** em azul-noite com estrelas que sobem devagar e piscam.
- **Linha do tempo** com os cinco modelos e seus anos, cada um na sua cor.
- **Botão grande** "Começar a viagem" e dica de teclado.
- **Controles** (modo leve e tela cheia) no canto, que somem sozinhos.

**Movimento:** um único momento orquestrado ao entrar (o átomo acende, o título se revela e a linha do tempo se desenha, da esquerda para a direita). Depois disso só continuam o átomo e as estrelas, de forma suave.

**Atalhos:** Espaço/Enter/→ começam; F tela cheia; L modo leve.

**Modo leve:** menos estrelas, sem brilhos nem rastros.

## 2.2 Tela de seleção: roda orbital de cartões

**Objetivo:** ser o "menu de jogo" da apresentação. O professor escolhe qual modelo mostrar, e a ordem cronológica é sugerida pelos cartões.

```
┌────────────────────────────────────────────────────────────────┐
│ Linha do tempo                                  [L leve][F tela]│
│ Escolha um cartão para começar                                  │
│                                                                 │
│           ╭────────╮                                            │
│     ╭───╮ │ ATOMO  │ ╭───╮     cartão central em destaque       │
│     │   │ │ Dalton │ │   │     vizinhos escurecidos e inclinados│
│     ╰───╯ ╰────────╯ ╰───╯                                     │
│                                                                 │
│            Esfera maciça · 1803                                 │
│  (Dalton)(Thomson)(Rutherford)(Bohr)(Modelo atual)(Quiz)       │
└────────────────────────────────────────────────────────────────┘
```

**Cartões (nesta ordem):** Dalton, Thomson, Rutherford, Bohr, Modelo atual e Quiz.

**Interações**
- Clicar em um cartão fora do foco: a roda gira até ele.
- Clicar no cartão em destaque (ou Enter/Espaço): abre o modelo e a apresentação.
- Setas (← →) e roda do mouse: giram a roda.
- Botões com os nomes embaixo: levam direto ao cartão.
- Esc: volta para a abertura. Dentro de um item, Esc volta para a roda.

**Cartão:** foto do cientista (ou ilustração provisória), cor do modelo na borda e no brilho, nome e ano. O cartão do Quiz mostra um "?" e o texto "Teste o que você viu".

**Fotos:** ficam em `src/assets/photos/` (`dalton.jpg`, `thomson.jpg`, `rutherford.jpg`, `bohr.jpg`, `quantum.jpg`). Enquanto não houver foto, aparece uma ilustração própria do modelo.

**Modo leve:** sem desfoque nem brilho; os cartões longe do foco ficam apenas mais transparentes.

## 2.3 Cena do Dalton (3D)

Primeira cena pronta. Define o padrão das próximas.

**Layout:** área 3D à esquerda, widget lateral à direita (foto ou ilustração, nome, ano e texto curto), e, numa faixa própria **abaixo** da área 3D, a legenda do passo (título e uma ou duas linhas), pontos de progresso e uma dica de teclas. A legenda é pequena e não cobre o 3D, para não atrapalhar a visualização nem o arrastar dos átomos.

**Passos (8)**
1. **Do que a matéria é feita?** Um cubo de matéria feito de muitas esferas pequenas.
2. **O átomo.** Uma esfera cresce até ficar grande, maciça e lisa (a bola de bilhar de Dalton).
3. **Cada elemento tem seus átomos.** Três elementos (A laranja, B azul, C rosa): iguais dentro do elemento e diferentes entre eles, inclusive no tamanho.
4. **Átomos se combinam.** Átomos de elementos diferentes se juntam em compostos.
5. **Reações químicas (antes).** Dois compostos (laranja com azul) e dois átomos rosa.
6. **Os átomos se rearranjam (depois).** Os parceiros mudam, e são 6 átomos antes e 6 depois.
7. **O que o modelo não explicava.** A esfera volta sozinha, com um "?" pulsando.
8. **Hora de brincar.** Doze átomos soltos: arrastar, encostar para formar compostos, duplo clique para separar, R recomeça.

**Controles:** → avança, ← volta (no primeiro passo volta para a roda), R repete o passo, N mostra a nota do professor, Esc volta para a roda, arrastar gira o modelo.

**Movimento:** os mesmos átomos se transformam de um passo para o outro (a matéria "vira" átomos), a câmera balança de leve enquanto ninguém mexe e volta ao lugar quando o passo muda.

**Cores dos átomos:** laranja (A), azul (B) e rosa (C). São cores de elementos de exemplo, não têm relação com as cores dos modelos na roda.

## 2.4 Cena do Thomson (3D)

Segue o mesmo padrão do Dalton (área 3D, widget lateral, legenda numa faixa própria, notas do professor, teclas).

**Passos (9)**
1. **Por que mudar o modelo?** A esfera maciça de Dalton aparece com um "?" pulsando.
2. **O tubo de raios catódicos.** A esfera some e surge um tubo de vidro com cátodo, ânodo, placas e tela, com os nomes das partes.
3. **Um feixe misterioso.** O cátodo brilha, o feixe cresce até a tela e uma mancha acende.
4. **O feixe se desvia.** As placas ficam carregadas (+ em cima, − embaixo) e o feixe se curva para a placa positiva.
5. **Partículas minúsculas e negativas.** Zoom nas partículas do feixe: os elétrons, que ficam maiores.
6. **E a carga positiva?** O tubo some e surge uma esfera positiva, com sinais de mais espalhados.
7. **Pudim de passas.** Os elétrons entram na esfera, um a um. Aparece "Carga total: 0 (neutro)".
8. **O que o modelo não explicava.** A esfera com um "?" pulsando.
9. **Hora de brincar.** Cinco elétrons dentro e sete soltos: arrastar para dentro ou para fora. A carga total aparece em cima (positiva em rosa, negativa em azul, neutra em verde-água com um anel luminoso), e a esfera muda de cor.

**Câmera:** olha um pouco de lado para mostrar a profundidade do tubo e balança de leve; ao arrastar, o professor gira o modelo.

**Cores:** violeta (cor do Thomson) na esfera, rosa para positivo e azul para negativo nas placas e na carga, ciano para os elétrons.

## 2.5 Cena do Rutherford (3D)

Segue o mesmo padrão das outras cenas.

**Passos (9)**
1. **Por que mudar o modelo?** O pudim de Thomson, com partículas que o atravessam quase em linha reta ("Previsão: atravessam").
2. **O experimento da folha de ouro.** Surgem a fonte de partículas alfa (bloco com um furo), a folha de ouro e uma tela esférica que brilha, com os nomes das partes.
3. **A maioria atravessa.** Um fluxo de partículas; os brilhos na tela aparecem à frente da folha.
4. **Mas algumas desviam.** Brilhos também nas laterais e, bem de vez em quando, do lado da fonte (partículas que voltam).
5. **O átomo é quase todo vazio.** Zoom: a folha cresce e some, e surge um átomo de ouro com um núcleo minúsculo e elétrons distantes. As partículas passam longe do centro e seguem em frente.
6. **Um núcleo pequeno, denso e positivo.** Partículas passam perto e são repelidas (o núcleo "pulsa"); as de frente voltam.
7. **O modelo de Rutherford.** Órbitas dos elétrons como planetas, com os nomes "Núcleo (+)" e "Elétrons (−)".
8. **O que o modelo não explicava.** Um elétron espirala até o núcleo, com um "?" pulsando.
9. **Hora de brincar.** Uma área de pontaria (um círculo): clicar ou arrastar dispara partículas na direção do ponto. A contagem mostra quantas passaram, desviaram e voltaram.

**Câmera:** no laboratório ela olha um pouco de lado e se desloca para enquadrar fonte, folha e tela; no átomo, volta ao centro. Botão direito do mouse gira no passo de brincar.

**Cores:** coral nas partículas alfa e no núcleo, ciano nos elétrons e na tela, dourado na folha, violeta no modelo de Thomson.

## 2.6 Cena do Bohr (3D)

Segue o mesmo padrão das outras cenas. O átomo fica inclinado para mostrar as camadas em perspectiva, com uma **escada de energia** à direita (cada camada é um nível).

**Passos (9)**
1. **Por que mudar o modelo?** O átomo de Rutherford: o elétron espirala até o núcleo, com um "?" pulsando.
2. **Camadas de energia.** As seis camadas aparecem uma a uma, com números, e o elétron se acomoda na camada 2. A escada mostra a mesma ideia.
3. **Ganhando energia, o elétron salta.** Um fóton azul chega ao elétron, que salta da camada 2 para a 5 (o marcador sobe na escada).
4. **Ao voltar, ele emite luz.** O elétron cai da camada 5 para a 2 e emite um fóton azul, uma onda que se afasta do átomo.
5. **A cor depende do salto.** Os saltos 3→2, 4→2, 5→2 e 6→2 se repetem sozinhos, e o **espectro do hidrogênio** ganha uma linha de cada cor (vermelha, azul-esverdeada, azul e violeta).
6. **Fogos de artifício e neon.** Foguetes sobem e explodem nas cores de sódio (amarelo), cobre (verde), estrôncio (vermelho) e potássio (lilás), com o nome do elemento.
7. **O modelo de Bohr.** Núcleo, camadas e escada, com os nomes.
8. **O que o modelo não explicava.** Surgem mais elétrons (átomo maior) e uma nuvem difusa de pontos sobre as camadas, com um "?".
9. **Hora de brincar.** Clicar numa camada ou num nível da escada move o elétron até lá, com a luz correspondente. O espectro vai ganhando linhas, e um texto no alto diz qual foi o salto e se a luz é visível ou invisível.

**Luz:** os fótons são ondas coloridas; os invisíveis (ultravioleta e infravermelho) aparecem em tom pálido e mais fracos.

**Câmera:** o enquadramento se desloca para a direita nos passos com a escada e volta ao centro nos fogos e na limitação.

**Cores:** ciano (cor do Bohr) nas camadas e no elétron, coral no núcleo.

**Ajuste de layout (21/10/2026, após o primeiro teste):** a cena estava grande demais e havia coisas "entrando" uma na outra (por exemplo, os nomes dos níveis da escada ficavam sobrepostos, e alguns saíam da tela). O que mudou:
- A câmera ficou cerca de 20% mais longe: o átomo ocupa cerca de 34% da largura da área 3D (antes, cerca de 43%).
- Os níveis da escada ficam sempre a mais de 0,5 de distância, com os nomes ao lado, e a escada ficou mais afastada do átomo.
- Os números das camadas ficaram menores e espalhados, sem ficar um sobre o outro.
- "Núcleo (+)" ficou fora do átomo, ligado ao núcleo por uma linha; o espectro desceu; os textos do alto e de baixo têm cada um o seu lugar.
- Verificação automática: para cada passo, em três proporções de tela (1,3, 1,6 e 1,9) e com a câmera balançando, nenhum texto fica sobre outro texto, sobre o átomo, a escada ou o espectro, nem fora da tela (antes: 447 ocorrências; agora: 0). Os fogos de artifício ficam de fora, por serem passageiros.

## 2.7 Cena do modelo atual (3D)

Última cena dos modelos. Segue o mesmo padrão e passou na verificação automática de layout.

**Passos (9)**
1. **Por que mudar o modelo?** O átomo de Bohr, com o elétron girando numa camada e um "?".
2. **O elétron também é uma onda.** A bolinha se transforma numa onda estacionária em volta da camada (dois comprimentos de onda).
3. **Não existe trajetória exata.** O elétron aparece "borrado", em vários lugares ao mesmo tempo, com a pergunta "Onde está o elétron?".
4. **Uma foto mostra um ponto.** A cada segundo, uma "foto" mostra um único ponto, num lugar diferente, com um clarão; o contador diz "Foto n: um ponto".
5. **Muitas fotos formam uma nuvem.** Os pontos se acumulam (longa exposição) até formar a nuvem do orbital 1s, mais densa perto do núcleo.
6. **O orbital.** A nuvem ganha uma superfície transparente que envolve cerca de 90% dos pontos, com o nome "Orbital 1s".
7. **Orbitais têm formas diferentes.** À esquerda, o orbital s (esfera); à direita, os três orbitais p (halteres em três cores, um para cada eixo).
8. **O modelo atual.** Núcleo e nuvem, com os nomes e linhas ligando aos elementos.
9. **Hora de brincar.** Clique para fotografar (um ponto), segure para uma longa exposição e escolha o orbital nos botões à esquerda (1s, 2s ou 2p). O contador mostra os pontos.

**Cores:** verde-água (cor do modelo atual) no 1s, ciano no 2s, âmbar no 2p; no passo 7, os três halteres são coral, âmbar e violeta.

**Desempenho:** até 6000 pontos por nuvem (3000 no modo leve), desenhados como pontos macios e aditivos.

## 3. Layout de uma cena

```
┌───────────────────────────────────────────────┬────────────────┐
│                                               │  [ FOTO ]      │
│                                               │  Nome          │
│          ÁREA DA ANIMAÇÃO                     │  Ano · Modelo  │
│          (átomo + experimento)                │                │
│                                               │  Texto curto   │
│                                               │  (2 a 3 linhas)│
├───────────────────────────────────────────────┴────────────────┤
│  ◀ voltar      ● ● ○ ○ ○  progresso      avançar ▶   [⛶] [leve]│
└────────────────────────────────────────────────────────────────┘
```

- **Área da animação:** cerca de 70% da largura.
- **Widget lateral:** cerca de 30%, com entrada animada (desliza e brilha) a cada nova cena.
- **Barra inferior:** discreta, some após alguns segundos sem uso.
- **Notas do professor (tecla N):** painel extra com uma pergunta para a turma e um lembrete de fala.

## 4. Sequência de passos por cena

Cada cena usa o mesmo ritmo de cliques, para o professor se acostumar:

1. **Pergunta:** frase que provoca curiosidade.
2. **Experimento:** a animação roda ao clique.
3. **Observação:** destaque visual do que aconteceu.
4. **Modelo:** o átomo se forma e o widget mostra o texto.
5. **Por que mudou?** (a partir da cena 2): o que o modelo anterior não explicava.

## 5. Cenas e ideias de animação

### Dalton
- Fundo de pequenas esferas flutuando.
- Esferas de elementos diferentes (cores distintas) se atraem e formam moléculas simples.
- O átomo aparece como esfera lisa e brilhante, "inteira".

### Thomson
- Tubo de raios catódicos com feixe luminoso.
- Placas ou ímã desviam o feixe.
- Os elétrons aparecem como pontos negativos incrustados numa esfera positiva (pudim de passas), com cargas se equilibrando.

### Rutherford
- Canhão de partículas alfa e folha de ouro.
- Muitas partículas atravessam; poucas desviam; algumas voltam.
- Zoom até o núcleo, que "acende" no centro.
- Elétrons orbitando longe, com rastros.

### Bohr
- Camadas como anéis iluminados.
- Botão de energia: o elétron salta de camada com um flash.
- Ao voltar, emite um fóton cuja cor depende do salto.
- Ponte com o dia a dia: fogos de artifício e luz de neon.

### Modelo atual
- Pontos surgem aleatoriamente ao redor do núcleo e formam uma nuvem densa e fraca, conforme a probabilidade.
- Alternância entre "foto instantânea" (um ponto) e "longa exposição" (nuvem).
- Mensagem central: não dá para saber exatamente onde o elétron está, só a região mais provável.

## 6. Brincar com os modelos (3D)

Não existe um laboratório separado. **Brincar é um passo dentro de cada cena**, sempre em 3D:

- O modelo fica na tela como objeto 3D que o professor gira arrastando com o mouse.
- O último passo da cena libera a interação: no Dalton, arrastar átomos e encostar uns nos outros para formar compostos.
- Resposta visual imediata, objetos grandes, nada de menus pequenos.

**Ideias de "brincar" para as próximas cenas** (a confirmar com o autor):
- Thomson: espetar elétrons na esfera positiva e equilibrar as cargas.
- Rutherford: disparar partículas alfa e ver os desvios.
- Bohr: dar energia ao elétron e ver o salto e a luz colorida.
- Modelo atual: ver a nuvem de probabilidade se formar.
- Ideias que sobraram do antigo laboratório: comparar o mesmo átomo nos modelos lado a lado e ver a escala de tamanho do átomo e do núcleo.

## 7. Quiz

O quiz é o último cartão da roda e abre um **menu com dois modos**: duelo de equipes (A × B, o professor divide a sala em duas equipes que se alternam) e solo. As telas são em tela cheia: pergunta com letras grandes, quatro alternativas enormes (A, B, C e D, cada uma com sua cor), tela de acerto com "Correto!", confete suave e explicação curta, e tela final com a equipe vencedora ou a pontuação. Errou: a alternativa fica esmaecida com um ✕ e a equipe tenta outra, com pontos menores (3, 2, 1, 0).

Detalhes, regras, teclas e banco de perguntas: [quiz.md](quiz.md).

## 8. Animação: diretrizes técnicas

| Tipo | Ferramenta |
|---|---|
| Entradas, saídas e transições da interface | Framer Motion |
| Partículas, nuvem de elétrons, órbitas | Canvas 2D |
| Brilho (glow), rastros, flashes | Canvas + CSS (`box-shadow`, `filter`) com moderação |

**Orçamento de desempenho**
- Uma configuração central define o número de partículas e efeitos.
- **Modo leve:** menos partículas, sem blur pesado, transições simples.
- Limpar loops ao sair da cena.
- Evitar `filter: blur()` em áreas grandes (pesado em PCs simples).

## 9. Estilo visual

- **Fundo escuro** (espaço profundo/azul-noite), elementos claros e coloridos. Costuma ter bom contraste em projetor.
- Uma cor de destaque por modelo, para a turma associar cor e cientista.
- Tipografia grande, sem serifa, com peso forte nos títulos.
- Fonte e imagens incluídas no projeto (offline).

| Modelo | Cor sugerida |
|---|---|
| Dalton | Laranja |
| Thomson | Roxo |
| Rutherford | Vermelho/coral |
| Bohr | Azul/ciano |
| Modelo atual | Verde/turquesa |

*(cores são sugestão inicial e podem mudar após testes no projetor)*

## 10. Acessibilidade

- Contraste alto e texto grande.
- Não depender só da cor para passar informação.
- Respeitar `prefers-reduced-motion`.
- Navegação completa por teclado.
- Evitar flashes rápidos e intensos (risco para pessoas sensíveis a luz); manter flashes suaves e curtos.
