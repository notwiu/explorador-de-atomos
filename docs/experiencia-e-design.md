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
   ↓
Laboratório
   ↓
Quiz
   ↓
Encerramento
```

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

## 6. Laboratório

Depois da explicação, a turma brinca. Ideias:

- **Escolher elemento** (H, He, Li, C, O, entre outros) e ver os modelos se reorganizarem.
- **Trocar de modelo** com um botão grande ou tecla numérica.
- **Adicionar/remover partículas** e ver número atômico e carga mudarem.
- **Comparador:** o mesmo átomo nos cinco modelos lado a lado.
- **Escala de tamanho:** zoom do mundo cotidiano até o núcleo.
- **Cores da luz:** salto de elétrons e relação com fogos de artifício e neon.

Regra: tudo com botões grandes e resposta visual imediata.

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
