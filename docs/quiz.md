# Quiz

Fecha a apresentação, depois das cenas dos modelos. Serve para **fixar o conteúdo e brincar**, em **tela cheia**, pensado para projetor. Tem **dois modos**: duelo de equipes (A × B) e solo.

## 1. Como o professor usa

1. Na roda de cartões, abre o último cartão: **Quiz**.
2. Escolhe o modo:
   - **Duelo de equipes:** divide a sala em duas equipes, **Equipe A** (coral) e **Equipe B** (azul). As equipes se alternam, uma pergunta para cada vez, e a equipe da vez discute e responde.
   - **Jogar sozinho:** uma pessoa responde às perguntas, uma de cada vez.
3. O professor (ou a equipe) escolhe a alternativa clicando ou digitando **A, B, C ou D** (ou 1 a 4).
4. Ao final, aparece a equipe vencedora (ou empate) ou a pontuação no solo, com a opção de **jogar de novo**.

## 2. Regras

- **10 perguntas por partida**, **2 de cada modelo**, na ordem do Dalton ao modelo atual. O banco tem mais perguntas, e cada partida sorteia as suas, então não repete sempre igual.
- As **alternativas são embaralhadas** a cada pergunta.
- **Errou?** A alternativa errada fica esmaecida, com um ✕, e a equipe **pode tentar outra**, quantas vezes precisar, até acertar.
- **Pontos:** quanto mais cedo acerta, mais vale.

  | Acertou na... | Pontos |
  |---|---|
  | 1ª tentativa | 3 |
  | 2ª tentativa | 2 |
  | 3ª tentativa | 1 |
  | 4ª tentativa | 0 (mas a pergunta avança) |

  A tela mostra quanto a pergunta vale no momento ("Esta pergunta vale 2 pontos").
- **Duelo:** a Equipe A responde as perguntas ímpares e a Equipe B as pares (5 para cada). Em jogo perfeito, 15 a 15 (empate). Vence quem tiver mais pontos.
- **Solo:** máximo de 30 pontos. A mensagem final depende do total (acima de 85%: "Mandou muito bem!"; acima de 60%: "Muito bem!"; abaixo: "Bom começo!").
- Sem cronômetro, sem ranking e sem salvar pontuação: cada partida começa do zero.

## 3. Telas

1. **Menu:** dois cartões grandes (Duelo de equipes e Jogar sozinho).
2. **Pergunta:** progresso ("Pergunta 3 de 10") com o nome do modelo; placar no alto (duas equipes no duelo, com a equipe da vez em destaque e a frase "Vez da Equipe A"; "Pontos" no solo); a pergunta em letras grandes; quatro alternativas enormes (A, B, C e D, cada uma com sua cor); uma linha de apoio embaixo.
3. **Acerto (tela cheia):** "Correto!" com confete suave (sem flashes), a equipe e os pontos ganhos, a resposta certa e a **explicação curta**; botão "Próxima pergunta" (ou "Ver o resultado" na última).
4. **Final (tela cheia):** vencedora ou empate (duelo) ou pontos (solo), com acertos de primeira; botões "Jogar de novo" e "Voltar ao menu".

## 4. Teclado

| Onde | Teclas |
|---|---|
| Menu | `1` duelo, `2` solo (ou setas e Enter); `Esc` volta à linha do tempo |
| Pergunta | `A` `B` `C` `D` ou `1` a `4` |
| Acerto | `Enter`, `Espaço` ou `→` para continuar |
| Final | `Enter` joga de novo; `Esc` volta ao menu |
| Durante o jogo | `Esc` pede confirmação: pressione `Esc` duas vezes para sair |
| Sempre | `F` tela cheia, `L` modo leve |

## 5. Perguntas

Fonte: `src/data/quiz.js`. A primeira alternativa de cada pergunta é a correta no banco (o jogo embaralha). Tamanhos máximos para caber na tela: pergunta até 110 letras, alternativa até 60 e explicação até 170. **Revisar com o professor.**

### Dalton

| # | Pergunta | Alternativas (a correta é a primeira, marcada com ✅) | Explicação |
|---|---|---|---|
| 1 | Quem propôs que o átomo é uma esfera maciça e indivisível? | ✅ Dalton<br>• Thomson<br>• Rutherford<br>• Bohr | Dalton imaginou o átomo como uma esfera minúscula, maciça e indivisível, como uma bola de bilhar. |
| 2 | Para Dalton, o que acontece com os átomos numa reação química? | ✅ Eles se rearranjam, sem serem criados nem destruídos<br>• Eles são destruídos e viram outros átomos<br>• Eles se dividem em partes menores<br>• Eles ficam maiores | Na reação, os átomos mudam de parceiros, mas nenhum átomo é criado ou destruído. |
| 3 | Segundo Dalton, como são os átomos de um mesmo elemento? | ✅ Todos iguais entre si<br>• Todos diferentes entre si<br>• Uns maiores e outros menores, ao acaso<br>• Formados por partes menores | Átomos de um mesmo elemento são iguais entre si e diferentes dos átomos de outros elementos. |
| 4 | Qual comparação combina com o átomo de Dalton? | ✅ Uma bola de bilhar<br>• Um pudim de passas<br>• Um sistema solar<br>• Uma nuvem de pontos | Para Dalton, o átomo é uma esfera maciça e lisa, sem partes dentro, como uma bola de bilhar. |

### Thomson

| # | Pergunta | Alternativas (a correta é a primeira, marcada com ✅) | Explicação |
|---|---|---|---|
| 1 | O que Thomson descobriu? | ✅ O elétron<br>• O núcleo<br>• As camadas de energia<br>• O orbital | Com os raios catódicos, Thomson descobriu o elétron e mostrou que o átomo não é indivisível. |
| 2 | Que comparação ficou famosa para o modelo de Thomson? | ✅ Pudim de passas<br>• Sistema solar<br>• Bola de bilhar<br>• Nuvem de pontos | Os elétrons (as passas) ficam espalhados numa esfera positiva (o pudim). |
| 3 | No tubo de raios catódicos, por que o feixe se curva em direção à placa positiva? | ✅ Porque o feixe tem carga negativa<br>• Porque o feixe tem carga positiva<br>• Porque o feixe não tem carga<br>• Porque o feixe é muito pesado | Cargas opostas se atraem: o feixe é atraído pela placa positiva, então ele é negativo. |
| 4 | No modelo de Thomson, por que o átomo é neutro? | ✅ A carga positiva equilibra a negativa<br>• Porque não existem cargas<br>• Porque só existem prótons<br>• Porque os elétrons ficam no núcleo | A esfera positiva e os elétrons negativos se equilibram, e por isso o átomo é neutro. |

### Rutherford

| # | Pergunta | Alternativas (a correta é a primeira, marcada com ✅) | Explicação |
|---|---|---|---|
| 1 | O que o experimento da folha de ouro revelou? | ✅ Existe um núcleo pequeno, denso e positivo<br>• O átomo é uma esfera maciça<br>• O elétron é uma onda<br>• Os elétrons ficam parados | As partículas que se desviaram ou voltaram indicaram um centro minúsculo, denso e positivo: o núcleo. |
| 2 | Por que quase todas as partículas alfa atravessaram a folha de ouro? | ✅ O átomo é quase todo espaço vazio<br>• A folha era muito grossa<br>• As partículas eram neutras<br>• O átomo é maciço | O núcleo ocupa uma região minúscula; o resto do átomo é, em grande parte, espaço vazio. |
| 3 | O que acontece com uma partícula alfa que vem de frente para o núcleo? | ✅ Ela volta, porque é repelida<br>• Ela atravessa o núcleo sem desviar<br>• Ela é atraída e fica presa<br>• Ela vira um elétron | A partícula alfa e o núcleo são positivos: cargas de mesmo sinal se repelem. |
| 4 | O que o modelo de Rutherford não conseguia explicar? | ✅ Por que o elétron não cai no núcleo<br>• A existência do núcleo<br>• A carga positiva do núcleo<br>• Por que o átomo é neutro | Pelas leis da física da época, o elétron em órbita perderia energia e cairia no núcleo. Bohr propôs uma resposta. |
| 5 | Qual modelo mostrou que o átomo tem um núcleo? | ✅ O de Rutherford<br>• O de Dalton<br>• O de Thomson<br>• Nenhum deles | Foi o experimento de Rutherford, com a folha de ouro, que revelou o núcleo. |

### Bohr

| # | Pergunta | Alternativas (a correta é a primeira, marcada com ✅) | Explicação |
|---|---|---|---|
| 1 | No modelo de Bohr, onde os elétrons ficam? | ✅ Em camadas com energias definidas<br>• Espalhados numa esfera positiva<br>• Dentro do núcleo<br>• Em qualquer lugar, sem regra | Bohr propôs que os elétrons só podem ocupar certas camadas, cada uma com uma energia definida. |
| 2 | O que acontece quando um elétron absorve energia, no modelo de Bohr? | ✅ Salta para uma camada mais externa<br>• Cai no núcleo<br>• Desaparece<br>• Fica mais pesado | Ao absorver energia, o elétron salta para uma camada mais externa. |
| 3 | Quando o elétron volta para uma camada mais interna, ele... | ✅ Emite luz<br>• Absorve luz<br>• Vira núcleo<br>• Perde sua carga | O elétron devolve a energia que tinha ganhado em forma de luz. |
| 4 | Por que fogos de artifício têm cores diferentes? | ✅ Cada elemento emite luz de cores próprias<br>• Porque a pólvora muda de cor<br>• Porque o ar colore a luz<br>• Porque os átomos mudam de tamanho | Cada elemento tem seus saltos de elétrons, e cada salto emite uma cor. Por isso sódio, cobre e estrôncio dão cores diferentes. |

### Modelo atual

| # | Pergunta | Alternativas (a correta é a primeira, marcada com ✅) | Explicação |
|---|---|---|---|
| 1 | O que é um orbital? | ✅ A região onde é mais provável encontrar o elétron<br>• Uma órbita circular exata<br>• O núcleo do átomo<br>• Uma camada cheia de prótons | Não sabemos exatamente onde o elétron está; o orbital mostra onde é mais provável encontrá-lo. |
| 2 | Pelo princípio da incerteza, o que não dá para saber com exatidão ao mesmo tempo? | ✅ A posição e o movimento do elétron<br>• A carga e a massa do elétron<br>• O número de prótons e de nêutrons<br>• A cor e a energia da luz | Pelo princípio da incerteza, de Heisenberg, não dá para saber, ao mesmo tempo e com exatidão, a posição e o movimento do elétron. |
| 3 | Qual é a forma do orbital s? | ✅ Uma esfera<br>• Um haltere<br>• Um anel<br>• Um cubo | O orbital s é uma esfera em volta do núcleo. Os orbitais p têm forma de halteres. |
| 4 | Quem propôs que o elétron também se comporta como uma onda? | ✅ De Broglie<br>• Dalton<br>• Thomson<br>• Rutherford | Em 1924, de Broglie propôs que o elétron também tem comportamento de onda. |



## 6. Formato dos dados

```js
// src/data/quiz.js
export const quizBank = [
  {
    id: 'dalton-1',
    model: 'dalton',          // dalton | thomson | rutherford | bohr | quantum
    text: 'Quem propôs que o átomo é uma esfera maciça e indivisível?',
    options: ['Dalton', 'Thomson', 'Rutherford', 'Bohr'],   // a 1ª é a correta
    explanation: 'Dalton imaginou o átomo como uma esfera minúscula, maciça e indivisível...',
  },
]
```

Para acrescentar perguntas, basta incluir novos itens no banco (mantendo a correta em primeiro e respeitando os tamanhos).

## 7. Código

- `src/quiz/engine.js`: regras sem tela (sorteio, embaralhamento, pontos, vez das equipes, fim de jogo). Funções puras, testadas sem navegador.
- `src/quiz/Quiz.jsx`: controla as telas e o teclado.
- `src/quiz/Menu.jsx`, `Question.jsx`, `Correct.jsx`, `Final.jsx`, `Scoreboard.jsx`, `Confetti.jsx` e `Quiz.module.css`: as telas.

## 8. Pendências

- [ ] Validar as perguntas e as explicações com o professor.
- [ ] Testar no projetor (tamanho das letras e das alternativas).
- [ ] Decidir se as equipes poderão ter nomes personalizados (hoje: Equipe A e Equipe B).
- [ ] Decidir se o professor poderá escolher a quantidade de perguntas (hoje: 10).
