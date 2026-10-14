# Quiz

Quiz **básico**, no final da apresentação, só para fixar o conteúdo e deixar a aula mais divertida. Não vale nota e não gera ranking.

## 1. Requisitos de experiência (pensando em projeção)

- **Tela cheia:** uma pergunta por vez ocupando toda a tela.
- **Alternativas grandes:** 4 opções (A, B, C, D) em blocos bem visíveis, cada um com letra, cor e texto grande.
- **Escolha por clique ou tecla:** `A`–`D` ou `1`–`4`.
- **Pergunta em destaque** no topo, com poucas palavras.
- Indicador discreto de progresso (ex.: "Pergunta 3 de 8").

## 2. Fluxo de uma pergunta

```
Pergunta + 4 alternativas
        │
   escolhe uma
   ┌────┴─────┐
 certa      errada
   │           │
Tela de     Alternativa fica marcada e desabilitada
acerto      (mensagem leve: "Quase! Tente outra.")
   │           │
 explicação  escolhe outra alternativa (quantas vezes precisar)
 curta          │
   │            └─→ ao acertar, vai para a tela de acerto
   ↓
 Botão "Próxima"
```

## 3. Telas

**Tela de acerto (tela cheia)**
- Animação de comemoração (confete ou brilho suave).
- Texto grande: "Correto!".
- Explicação curta (1 a 2 frases).
- Botão grande: "Próxima pergunta".

**Feedback de erro (na própria tela da pergunta)**
- A alternativa escolhida fica esmaecida/marcada e não pode ser clicada de novo.
- Mensagem curta e amigável.
- Não revelar a resposta certa: o aluno continua tentando.

**Tela final**
- Mensagem de encerramento.
- Resumo leve (ex.: "Você acertou X de primeira"), opcional.
- Botão para reiniciar o quiz ou voltar à linha do tempo.

## 4. Regras

- Sem pontuação persistente, sem ranking, sem cronômetro.
- Ordem fixa das perguntas (seguindo a linha do tempo); embaralhar as alternativas é opcional.
- Erro nunca é punido; o objetivo é aprender e se divertir.
- Evitar flashes fortes na animação de acerto.

## 5. Banco inicial de perguntas (rascunho)

> Revisar com o professor. Correspondência com `src/data/quiz.js`.

**1. Quem propôs que o átomo é uma esfera maciça e indivisível?**
- A) Dalton ✅
- B) Thomson
- C) Rutherford
- D) Bohr

*Explicação:* Dalton imaginou o átomo como uma esfera minúscula, maciça e indivisível, como uma bola de bilhar.

**2. O que Thomson descobriu?**
- A) O núcleo do átomo
- B) O elétron ✅
- C) As camadas de energia
- D) O nêutron

*Explicação:* Com os raios catódicos, Thomson descobriu o elétron e mostrou que o átomo não é indivisível.

**3. No modelo de Thomson, o átomo lembra...**
- A) Um sistema solar
- B) Uma bola de bilhar
- C) Um pudim de passas ✅
- D) Uma nuvem

*Explicação:* Os elétrons (passas) ficam espalhados numa esfera positiva (o pudim).

**4. Por que quase todas as partículas atravessaram a folha de ouro no experimento de Rutherford?**
- A) Porque o átomo é quase todo espaço vazio ✅
- B) Porque a folha era muito grossa
- C) Porque as partículas eram neutras
- D) Porque o átomo é maciço

*Explicação:* O átomo é, em grande parte, espaço vazio; o núcleo ocupa uma região minúscula.

**5. O que o experimento de Rutherford revelou?**
- A) Que o elétron é uma onda
- B) Que existe um núcleo pequeno, denso e positivo ✅
- C) Que o átomo é indivisível
- D) Que os elétrons ficam parados

*Explicação:* As poucas partículas que desviaram ou voltaram indicaram um centro muito denso e positivo.

**6. No modelo de Bohr, o que acontece quando um elétron volta para uma camada mais interna?**
- A) Ele desaparece
- B) Ele vira núcleo
- C) Ele emite luz ✅
- D) Ele fica mais pesado

*Explicação:* O elétron devolve a energia em forma de luz. É isso que dá cor aos fogos de artifício e ao neon.

**7. No modelo atual, o que é um orbital?**
- A) Uma órbita circular exata
- B) Uma região onde há maior chance de encontrar o elétron ✅
- C) O núcleo do átomo
- D) Uma camada de prótons

*Explicação:* Não sabemos exatamente onde o elétron está; o orbital mostra onde é mais provável encontrá-lo.

**8. Qual é a ordem cronológica correta dos modelos?**
- A) Bohr, Dalton, Thomson, Rutherford
- B) Dalton, Thomson, Rutherford, Bohr ✅
- C) Thomson, Dalton, Bohr, Rutherford
- D) Rutherford, Dalton, Bohr, Thomson

*Explicação:* A ciência foi evoluindo: cada modelo surgiu para explicar o que o anterior não explicava.

## 6. Formato dos dados (`src/data/quiz.js`)

```js
export const questions = [
  {
    id: 'q1',
    text: 'Quem propôs que o átomo é uma esfera maciça e indivisível?',
    options: ['Dalton', 'Thomson', 'Rutherford', 'Bohr'],
    correctIndex: 0,
    explanation: 'Dalton imaginou o átomo como uma esfera minúscula, maciça e indivisível.',
  },
];
```

## 7. Pendências

- [ ] Validar perguntas com o professor.
- [ ] Decidir se as alternativas serão embaralhadas.
- [ ] Definir animação de acerto (confete, brilho, partículas).
- [ ] Definir se haverá resumo final com contagem de acertos.
