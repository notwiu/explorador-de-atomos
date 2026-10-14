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

**Layout:** área 3D à esquerda, widget lateral à direita (foto ou ilustração, nome, ano e texto curto), legenda do passo embaixo, pontos de progresso e uma dica de teclas.

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

Veja [quiz.md](quiz.md). Em resumo: tela cheia, alternativas grandes, feedback de acerto com explicação e nova tentativa após erro.

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
