# Diário do projeto

Registro cronológico do que foi feito e aprendido. Serve de matéria-prima para os posts de LinkedIn e GitHub e para o relatório da faculdade.

**Como usar:** ao fim de cada sessão de trabalho, acrescente uma entrada no topo da seção "Entradas" com o que foi feito, o que aprendeu e o que vem a seguir.

---

## Entradas

### 10/10/2026 — Roda de cartões: a linha do tempo vira um menu de jogo
**O que foi feito**
- Ao clicar em "Começar a viagem", agora aparece a linha do tempo em forma de **roda orbital de cartões**: Dalton, Thomson, Rutherford, Bohr, Modelo atual e, por último, o Quiz.
- Os cartões são clicáveis (estilo jogo): clique gira até o cartão, clique no cartão em destaque abre o item. Setas e roda do mouse também giram.
- Adaptei o componente que recebi (que usava Tailwind, GSAP e rolagem de página) para o nosso projeto: CSS Modules, Framer Motion e controle por clique e teclado.
- Cartões com ilustrações provisórias; as fotos entram sozinhas ao colocar os arquivos em `src/assets/photos/`.

**Aprendizado**
- Um componente pronto raramente serve sem ajuste: o contexto muda (aqui, projetor e apresentação, sem rolagem).
- Com poucos itens (6), a geometria da roda precisa ser menor do que a do exemplo original.
- Botões que ficam com foco depois do clique atrapalham atalhos de teclado em apresentações; resolvi evitando que cliques roubem o foco.

**Próximo passo:** testar a roda no projetor, adicionar as fotos e, quando o autor pedir, criar a cena do Dalton.

### 10/10/2026 — Primeiro commit e tela inicial
**O que foi feito**
- Primeiro commit no GitHub: toda a documentação do projeto.
- Criado o projeto base com Vite + React e configurado o build em arquivo único (offline).
- Desenhada e animada a **tela inicial**: título, átomo com elétrons e rastros, estrelas e linha do tempo dos cinco modelos.
- Definidos tokens de design, fontes embutidas e o modo leve.

**Aprendizado**
- Fazer um passo de cada vez (documentar, commitar, só então codar) deixa o histórico limpo.
- Fontes e imagens precisam estar dentro do projeto para funcionar offline.
- Filtros de brilho são pesados; vale ter um modo leve desde o começo.

**Próximo passo:** testar a tela no projetor/tela grande e, depois, criar a cena do Dalton (primeiro modelo) com o widget lateral.

### 10/10/2026 — Ajuste de escopo: animação, widget, laboratório e quiz
**O que foi feito**
- O foco passou a ser **muita animação** para prender a atenção dos alunos.
- Definido o **widget lateral** (foto, nome, ano e texto curto) em cada modelo.
- Definido o fluxo: modelos em ordem cronológica → laboratório → quiz.
- O quiz voltou ao escopo, mas **básico e só para fixar**, em tela cheia, com alternativas grandes e nova tentativa após erro.
- Criados `AGENT.md`, `README.md` e documentação dividida em vários arquivos.

**Aprendizado**
- Escopo muda quando se conversa com quem vai usar: a ideia inicial de "sem quiz" deu lugar a um quiz leve de fixação.
- Documentar decisões (inclusive as que mudam) ajuda a explicar o raciocínio depois.

**Próximo passo:** criar o projeto base com Vite (Etapa 1).

### 05/10/2026 — Início: entendendo o pedido do professor
**O que foi feito**
- Entendi o pedido: um material mais didático sobre modelos atômicos, para visualização em sala.
- Descobri que **os alunos não terão acesso**; o professor vai apresentar por projetor. Isso mudou o foco para ferramenta de apresentação.
- Escolhi **React + Vite**.
- Primeira versão da documentação.

**Aprendizado**
- Entender *quem usa* e *como usa* antes de codar evita retrabalho.

---

## Ideias de posts (LinkedIn e GitHub)

### Sequência sugerida

| # | Tema | Formato | Quando |
|---|---|---|---|
| 1 | O desafio: um professor pediu um material para ensinar modelos atômicos | Texto + imagem | Agora |
| 2 | Por que mudei de ideia sobre o quiz (mudança de escopo) | Texto curto | Agora |
| 3 | Escolhas de tecnologia: React + Vite e funcionamento offline | Texto + diagrama | Após Etapa 1 |
| 4 | Cena do Rutherford: partículas alfa em Canvas | GIF/vídeo | Após Etapa 2 |
| 5 | Widget lateral e design para projetor | Print/vídeo | Após Etapa 2 |
| 6 | Bohr e fogos de artifício: ciência no dia a dia | GIF | Após Etapa 3 |
| 7 | O laboratório de átomos | Vídeo | Após Etapa 5 |
| 8 | O quiz em tela cheia | Vídeo | Após Etapa 6 |
| 9 | Teste em sala e feedback do professor | Texto + foto (sem expor alunos) | Etapa 8 |
| 10 | Aprendizados finais e link do repositório | Texto + demo | Final |

### Rascunho do post 1 (LinkedIn)

> Recebi um desafio diferente: um professor de escola pública pediu um material para os alunos *visualizarem* os modelos atômicos. 🔬
>
> Em vez de um quiz seco, estou criando uma linha do tempo animada, de Dalton ao modelo atual, para ser projetada em sala.
>
> Primeiras decisões: React + Vite, funcionamento offline (a internet da escola pode falhar) e foco total em legibilidade no projetor.
>
> Vou documentar o processo por aqui. 👇
>
> #React #Vite #Educação #Química #FrontEnd #OpenSource

### Dicas para os posts

- Mostre **GIFs e vídeos curtos**: a animação é o ponto forte.
- Conte as **decisões e mudanças de ideia**, não só o resultado.
- Nunca poste fotos de alunos; use capturas de tela do projeto.
- Marque o repositório do GitHub e use o README como vitrine.
- Combine com a escola/professor o que pode ser divulgado antes de citar nomes.

### Dicas para o GitHub

- Use este documento como base do README.
- Abra *issues* para cada item do [roadmap](roadmap.md) e use *milestones* para as etapas.
- Faça commits pequenos e descritivos (Conventional Commits).
- Marque *releases* ao concluir cada etapa (veja [CHANGELOG](../CHANGELOG.md)).

---

## Dados para o relatório da faculdade

Anote aqui números e fatos que valem citar:

- Tempo gasto por etapa: _______
- Problemas encontrados e soluções: _______
- Desempenho medido (fps em computador simples): _______
- Feedback do professor: _______
- Resultados em sala: _______
