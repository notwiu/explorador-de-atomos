# Diário do projeto

Registro cronológico do que foi feito e aprendido. Serve de matéria-prima para os posts de LinkedIn e GitHub e para o relatório da faculdade.

**Como usar:** ao fim de cada sessão de trabalho, acrescente uma entrada no topo da seção "Entradas" com o que foi feito, o que aprendeu e o que vem a seguir.

---

## Entradas

### 28/10/2026 — Quiz com dois modos
**O que foi feito**
- Criado o **quiz** com **duelo de equipes** (o professor divide a sala em A e B, que se alternam) e **solo**.
- Tela cheia, alternativas grandes, tela de acerto com explicação e confete suave, nova tentativa após erro e pontos que caem a cada erro (3, 2, 1, 0), com placar e tela final.
- Banco de 21 perguntas cobrindo os cinco modelos; cada partida sorteia 10 (2 por modelo) e embaralha as alternativas.
- Regras separadas das telas (`engine.js`) e testadas com 500 partidas aleatórias, além de um teste do fluxo completo (menu, duelo, solo, teclado, mouse e saída).

**Aprendizado**
- Separar as regras da tela permitiu testar o jogo inteiro (pontos, alternância das equipes, fim de partida) sem abrir um navegador.
- Num quiz projetado, o teclado precisa ser simples e sem armadilhas: os botões não ficam "focados" ao clicar (para o Enter não repetir o clique) e o Esc pede confirmação durante a partida.

**Próximo passo:** polimento e validação com o professor (testar no projetor, revisar perguntas e textos, registrar origem e licença das fotos).

### 27/10/2026 — Cena do modelo atual (orbitais) em 3D
**O que foi feito**
- Criada a **cena do modelo atual** em 3D, a quinta e última cena de modelo, com nove passos: do átomo de Bohr ao elétron como onda, depois a incerteza, a "foto instantânea", a "longa exposição" que forma a nuvem, o orbital, as formas s e p, o modelo atual e o brincar.
- Os pontos da nuvem são sorteados com a probabilidade real dos orbitais do hidrogênio. Conferi por estatística: raios médios (1,5 a0 no 1s, 6 a0 no 2s e 5 a0 no 2p), a casca vazia do 2s, os lóbulos do 2p nos eixos e o raio que envolve 90% dos pontos.
- No brincar, o aluno "fotografa" o elétron com cliques e segura para ver a nuvem se formar; troca de orbital nos botões e compara os tamanhos e as formas.
- Verificação automática de layout (sem textos sobrepostos) e testes de lógica e de fluxo de telas, todos passando.

**Aprendizado**
- A ideia "uma foto, um ponto; muitas fotos, uma nuvem" é uma boa analogia para a probabilidade, desde que a nota do professor avise que é uma analogia.
- Sortear de verdade (em vez de desenhar uma nuvem bonita) deixa a cena honesta e ainda mostra coisas como a casca vazia do 2s.

**Próximo passo:** o quiz (Etapa 7), em tela cheia, e depois o polimento e a validação com o professor.

### 21/10/2026 — Cena do Bohr em 3D
**O que foi feito**
- Criada a **cena do Bohr** em 3D com nove passos: o elétron de Rutherford que cairia no núcleo, as camadas de energia, o salto ao absorver um fóton, a volta emitindo luz, o espectro do hidrogênio, os fogos de artifício, o modelo, a limitação e o brincar.
- No brincar, o aluno clica numa camada (ou num nível da escada) e vê o fóton entrar ou sair, o elétron saltar e o espectro ganhar linhas.
- Adicionada a foto do Rutherford ao projeto.
- Testes automáticos (regras da luz, saltos, cliques nas camadas e na escada, fogos e fluxo de telas), todos passando.

**Aprendizado**
- Os testes mostraram que a escada de energia ficava por cima da camada mais externa na hora do clique; afastei a escada e aumentei as áreas de clique.
- Usar uma fila de ações para o elétron (esperar, subir, descer) deixou o passo automático e o brincar com o mesmo código.
- Dar cor certa a cada salto (série de Balmer do hidrogênio) conecta o modelo ao que se vê em fogos de artifício e luzes de neon.

**Ajuste após o primeiro teste (23/10/2026):** o autor achou a cena do Bohr grande demais, com coisas entrando umas nas outras. A causa principal: os níveis da escada de energia ficavam muito próximos (os nomes se sobrepunham) e os números das camadas se empilhavam. Diminuí tudo cerca de 20%, espacei os níveis, afastei a escada, espalhei os números e reposicionei os textos. Para ter certeza, criei uma **verificação automática de layout** (projeta cada texto na tela e confere sobreposições): antes eram 447 ocorrências, agora são 0. A foto do Bohr (enviada pelo autor) entrou no widget e no cartão da roda.

**Aprendizado:** diminuir o zoom do navegador não resolve sobreposição dentro de uma cena 3D, porque tudo diminui junto; é preciso mudar o espaçamento da própria cena. E vale medir em vez de adivinhar.

**Próximo passo:** testar no projetor e, quando pedirem, criar a cena do modelo atual.

### 20/10/2026 — Cena do Rutherford em 3D
**O que foi feito**
- Criada a **cena do Rutherford** em 3D com nove passos: a previsão do modelo de Thomson, o experimento da folha de ouro, o zoom até o átomo, o núcleo, o modelo planetário, a limitação e o brincar.
- No brincar, o aluno clica ou arrasta para disparar partículas alfa e vê o que acontece conforme mira longe do núcleo, perto ou bem no centro. Um contador mostra quantas passaram, desviaram e voltaram.
- As trajetórias dentro do átomo são calculadas com a repulsão entre cargas positivas, então o desvio muda de forma realista conforme o ponto de mira.
- Testes automáticos (física, lógica do 3D, cliques e fluxo de telas), todos passando.

**Aprendizado**
- Simular a física em vez de desenhar caminhos "à mão" deixa a cena mais honesta e ainda mais bonita: o núcleo "pulsa" quando uma partícula passa perto.
- O desenho precisa avisar o que está fora de escala (o núcleo real é muito menor); a nota do professor explica isso.
- Erro meu durante a entrega: um comando apagou a pasta de código da entrega antes de eu conferir a origem. Recuperei tudo pelo zip anterior e refiz os testes. Lição: conferir que a origem existe antes de apagar qualquer coisa.

**Próximo passo:** testar no projetor, adicionar a foto do Rutherford e, quando pedirem, criar a cena do Bohr.

### 15/10/2026 — Cena do Thomson em 3D
**O que foi feito**
- Criada a **cena do Thomson** em 3D com nove passos: o modelo de Dalton e a pergunta, o tubo de raios catódicos, o feixe, o desvio em direção à placa positiva, o zoom nos elétrons, a esfera positiva, o pudim de passas, a limitação do modelo e o brincar.
- No brincar, o aluno arrasta elétrons para dentro da esfera e vê a carga total mudar (positiva, negativa ou neutra com um anel luminoso).
- As ferramentas 3D em comum (rótulos, brilhos) foram para `src/three/helpers.js`, e a cena do Dalton passou a usá-las.
- Testes automáticos da lógica do 3D e do fluxo de telas, todos passando (sem placa de vídeo).
- Autores atualizados no README: Willian Teotonio, Kemuel Darckson, Yan Pedro e João Rodrigues.

**Aprendizado**
- Descrever a cena por poucos parâmetros por passo (tamanho do feixe, desvio, quanto do átomo aparece) tornou as transições simples e fáceis de ajustar.
- Os testes encontraram dois problemas antes de chegarem à sala: elétrons que ficavam sobrepostos ao soltar e uma câmera que podia ficar travada se o arraste fosse interrompido pelo teclado.
- Em ciência, vale avisar quando a imagem é uma simplificação: o feixe real quase não se vê, e a nota do professor explica isso.

**Ajuste:** a foto do Thomson (enviada pelo autor) entrou no widget lateral e no cartão da roda.

**Próximo passo:** testar no projetor, registrar a origem das fotos e, quando pedirem, criar a cena do Rutherford.

### 11/10/2026 — Cena do Dalton em 3D
**O que foi feito**
- Esclarecido que "brincar com os modelos" é algo visual **dentro de cada modelo**, em 3D, e não um laboratório separado.
- Criada a **cena do Dalton em 3D** com oito passos: um cubo de matéria vira uma única esfera (o átomo maciço), depois aparecem três elementos, os átomos se combinam, reagem trocando de parceiros e, por fim, o professor e a turma brincam arrastando átomos.
- Criada a base reaproveitável das próximas cenas: palco 3D, moldura de cena, widget lateral, notas do professor e teclas de atalho.
- Testes automáticos da lógica do 3D e do fluxo de telas (sem placa de vídeo), todos passando.

**Aprendizado**
- Reaproveitar o mesmo conjunto de esferas em todos os passos deixou a transição "matéria vira átomos" fluida e o código simples.
- Separar a lógica do 3D da parte visual permitiu testar sem navegador.
- three.js aumentou o peso do arquivo final (cerca de 1,3 MB), mas continua offline e leve o bastante para uma escola.

**Ajustes após o primeiro teste:** a legenda embaixo do 3D estava grande demais e atrapalhava; ficou menor e em uma faixa própria, fora da área 3D. O retrato do Dalton (enviado pelo autor) entrou no widget lateral e no cartão da roda.

**Próximo passo:** testar no projetor/tela grande, registrar a origem da foto do Dalton, adicionar as outras fotos e, quando o autor pedir, criar a cena do Thomson.

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
