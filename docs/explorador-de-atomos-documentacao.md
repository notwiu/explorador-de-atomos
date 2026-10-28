# Explorador de Átomos

> Ferramenta web de apresentação, com muita animação, para ensinar e visualizar a evolução dos modelos atômicos em aulas de Química do ensino médio.

**Status:** em desenvolvimento (tela inicial, roda de cartões, as cinco cenas dos modelos em 3D e o quiz com dois modos prontos; falta o polimento e a validação com o professor)
**Autores:** Willian Teotonio, Kemuel Darckson, Yan Pedro e João Rodrigues
**Tipo:** trabalho de faculdade com aplicação em escola pública
**Stack:** React + Vite
**Última atualização:** 28/10/2026 (v1.0 da documentação)

> Este é o documento-síntese. Os detalhes estão nos demais arquivos da pasta `docs/` (veja o índice no [README](../README.md)).

---

## 1. Contexto

O projeto nasceu de um pedido de um professor de escola pública. A solicitação original foi:

- Fazer um "joguinho" sobre modelos atômicos.
- Que fosse mais didático.
- Que servisse para os alunos **visualizarem** os modelos.

A necessidade real: modelos atômicos são conteúdo abstrato, e muitos alunos têm dificuldade em imaginar o que cada cientista propôs e por que o modelo mudou ao longo do tempo.

## 2. Problema

Como ajudar alunos do ensino médio a **enxergar, entender e se interessar** pela evolução dos modelos atômicos, usando um site apresentado pelo professor em sala, por projetor?

## 3. Objetivos

**Geral:** desenvolver uma aplicação web interativa, rica em animações, que apoie o professor na explicação dos modelos atômicos.

**Específicos:**

- Apresentar cada modelo em uma cena animada e **em 3D**, em **ordem cronológica**.
- Exibir, ao lado do átomo, um **widget com foto e texto curto** sobre o modelo, para o professor ler.
- Mostrar *por que* cada modelo foi substituído pelo seguinte.
- Permitir **brincar com o modelo em 3D** dentro de cada cena, depois da explicação.
- Encerrar com um **quiz básico**, em tela cheia, para fixar o conteúdo de forma divertida.
- Funcionar bem em projetor, em escola pública, inclusive sem internet.

## 4. Público e contexto de uso

| Item | Definição |
|---|---|
| Público final | Alunos do ensino médio de escola pública |
| Usuário direto | **Professor**, que apresenta o conteúdo em sala |
| Forma de uso | Projetor, conduzido pelo professor |
| Acesso dos alunos | Não terão acesso ao site, pelo menos por enquanto |
| Plataforma | Navegador (site) |

## 5. Fluxo da experiência

```
Abertura → Roda de cartões (menu) → Cena do modelo escolhido ou Quiz
```

A **roda de cartões** é o menu central: Dalton, Thomson, Rutherford, Bohr, Modelo atual e, por último, o Quiz. Clicar na foto abre o modelo e a apresentação. Brincar com os modelos acontece **dentro de cada cena**, em 3D (não existe um laboratório separado).

1. **Abertura:** título animado e botão para começar.
2. **Linha do tempo:** Dalton, Thomson, Rutherford, Bohr e modelo atual, passo a passo. Cada cena tem experimento animado, widget lateral e uma transição "Por que mudou?".
3. **Brincar:** o último passo de cada cena é interativo, em 3D (no Dalton, arrastar átomos e encostar para formar compostos).
4. **Quiz:** perguntas básicas em tela cheia, alternativas grandes, feedback com explicação e nova tentativa em caso de erro.
5. **Encerramento:** resumo da linha do tempo.

### 5.1 Cenas

| Cena | Modelo | Ideia visual |
|---|---|---|
| 1 | Dalton (esfera maciça) | Esferas de elementos diferentes que se combinam em compostos simples |
| 2 | Thomson (pudim de passas) | Tubo de raios catódicos; o feixe se desvia e revela o elétron |
| 3 | Rutherford (modelo nuclear) | Partículas alfa disparadas contra uma folha de ouro; a maioria passa e algumas desviam, revelando o núcleo |
| 4 | Bohr (camadas) | Elétron salta entre camadas ao receber energia e emite luz colorida |
| 5 | Modelo atual (orbitais) | Nuvem de pontos que se forma aos poucos, mostrando que o elétron não tem trajetória fixa |

### 5.2 Widget lateral

Cartão fixo ao lado do átomo com:

- foto do cientista;
- nome, ano e nome do modelo;
- texto curto (2 a 3 linhas) para o professor ler.

### 5.3 Animação

A animação é o grande diferencial. Princípios: movimento com significado (cada animação ensina algo), brilho e partículas, transições de câmera entre cenas, rastros dos elétrons, flashes de luz nas emissões. Para computadores simples, existe um **modo leve**.

## 6. Quiz

Quiz em **tela cheia**, no último cartão da roda, para fixar o conteúdo de forma divertida. Tem **dois modos**:

- **Duelo de equipes:** o professor divide a sala em duas equipes (A e B), que se alternam, uma pergunta para cada vez, com placar.
- **Jogar sozinho:** uma pessoa responde às perguntas, uma de cada vez.

Cada partida tem 10 perguntas (2 de cada modelo, em ordem cronológica), sorteadas de um banco, com alternativas embaralhadas. Alternativas grandes; **acertou:** tela de acerto com explicação curta; **errou:** a alternativa fica esmaecida e dá para tentar outra, valendo menos pontos (3, 2, 1, 0). No fim, aparece a equipe vencedora (ou empate) ou a pontuação.

Detalhes, regras, teclas e banco de perguntas: [quiz.md](quiz.md).

## 7. Decisões de projeto

| # | Decisão | Motivo |
|---|---|---|
| 1 | Será um **site** | Requisito do professor; fácil de abrir em qualquer computador |
| 2 | **React + Vite** | Escolha do autor; interface atraente e componentizada |
| 3 | **Uso pelo professor**, não pelos alunos | Os alunos não terão acesso por ora |
| 4 | Foco em **projeção em sala** | O professor apresenta por projetor |
| 5 | **Muita animação** como prioridade | Chamar atenção e despertar interesse |
| 6 | **Widget lateral** com foto e texto curto | O professor pode ler e a turma associa o rosto ao modelo |
| 7 | **Ordem cronológica**, passo a passo | Mostra a evolução da ciência |
| 8 | **Brincar dentro de cada cena**, em 3D, após a explicação (no lugar de um laboratório separado) | Permitir que a turma brinque com o modelo de forma visual |
| 9 | **Quiz básico no final** (revisão de decisão anterior) | Fixar o conteúdo e divertir; a decisão inicial era não ter quiz |
| 10 | Quiz em **tela cheia**, com nova tentativa após erro | Pensado para projeção e para não punir o erro |

Registro completo e histórico: [decisoes.md](decisoes.md).

## 8. Requisitos

### 8.1 Funcionais

- Navegar entre cenas (avançar e voltar).
- Controlar cada animação por clique ou tecla, sem início automático.
- Exibir o widget lateral em cada cena.
- Reiniciar a cena atual e ajustar a velocidade das animações.
- Alternar tela cheia e modo leve.
- Representação 3D de cada modelo, que pode ser girada com o mouse, e passo final de "brincar".
- Quiz com feedback de acerto, explicação e nova tentativa.
- Notas do professor opcionais, por atalho de teclado.

### 8.2 Não funcionais

- **Legibilidade em projetor:** fontes grandes, contraste alto, pouco texto.
- **Navegação por teclado**, compatível com apresentadores de slides.
- **Interface limpa:** controles que somem após alguns segundos.
- **Offline:** sem CDN, fontes ou imagens externas.
- **Desempenho:** fluido em computadores simples.
- **Sem login e sem cadastro.**

## 9. Arquitetura e tecnologias

- React + Vite
- Framer Motion (interface)
- Canvas 2D com `requestAnimationFrame` (partículas, nuvem de elétrons)
- `vite-plugin-singlefile` para gerar um único `index.html` offline

Estrutura de pastas e detalhes: [arquitetura.md](arquitetura.md).

## 10. Distribuição

- **Offline:** arquivo único `index.html`, que o professor abre em qualquer navegador (inclusive de um pendrive).
- **Online (opcional):** GitHub Pages ou Netlify, com envio de link ao professor.

## 11. Plano de desenvolvimento

| Etapa | Entrega |
|---|---|
| 1 | Projeto base e **tela inicial** (feitos); fluxo geral completo e widget lateral entram com as cenas |
| 2 | Cena do **Dalton** em 3D (feita; define o padrão das cenas) |
| 3 | Cena do **Thomson** em 3D (feita) |
| 4 | Cena do **Rutherford** em 3D (feita) |
| 5 | Cena do **Bohr** em 3D (feita) |
| 6 | Cena do **modelo atual** em 3D (feita) |
| 7 | **Quiz** (duelo de equipes e solo) (feito) |
| 8 | Extras opcionais (comparador lado a lado, escala de tamanho) |
| 9 | Polimento para projetor, modo leve e build offline |
| 10 | Validação com o professor e ajustes |

Detalhes: [roadmap.md](roadmap.md).

## 12. Riscos e cuidados

| Risco | Mitigação |
|---|---|
| Internet instável na escola | Funcionamento 100% offline com arquivo único |
| Computador simples travar com muita animação | Modo leve, partículas configuráveis, testes de desempenho |
| Projetor com pouco brilho ou contraste | Cores fortes, fontes grandes, elementos grandes |
| Conteúdo científico impreciso | Fonte única de conteúdo e revisão pelo professor |
| Excesso de texto na tela | Widget com 2 a 3 linhas; detalhes nas notas do professor |
| Imagens sem licença adequada | Usar imagens de domínio público/licença livre e registrar crédito |
| Escopo crescer demais | Entregar por etapas, começando pelo Rutherford |

## 13. Próximos passos

- Criar o projeto base com Vite (Etapa 1).
- Implementar a cena do Rutherford (Etapa 2).
- Mostrar o protótipo ao professor e coletar feedback.

## 14. Dados para completar (uso acadêmico)

- Disciplina / curso: _______
- Professor orientador: _______
- Escola / professor solicitante: _______
- Período de desenvolvimento: _______
- Link do repositório: _______
- Link da aplicação publicada: _______
- Feedback recebido do professor: _______
- Resultados observados em sala: _______

## 15. Histórico da documentação

| Versão | Data | Mudanças |
|---|---|---|
| 0.1 | 05/10/2026 | Documento inicial: escopo, decisões, conceito de cenas |
| 0.2 | 10/10/2026 | Inclusão do quiz básico no final, laboratório, widget lateral, ênfase em animação; documentação dividida em vários arquivos |
| 0.3 | 10/10/2026 | Projeto base (Vite + React) e tela inicial criados; decisões D13 a D17 (estilo, fontes, cores) |
| 0.4 | 10/10/2026 | Roda de cartões clicáveis (estilo jogo) como linha do tempo; quiz como sexto cartão; decisões D18 a D21 |
| 0.5 | 11/10/2026 | Tudo em 3D (three.js); "brincar" passa a ser um passo dentro de cada cena, sem laboratório separado; cena do Dalton criada; decisões D22 a D24 |
| 0.6 | 15/10/2026 | Cena do Thomson em 3D (tubo de raios catódicos, esfera positiva e brincar de equilibrar cargas); decisões D25 e D26; autores atualizados |
| 0.7 | 20/10/2026 | Cena do Rutherford em 3D (experimento da folha de ouro, zoom no átomo, núcleo e brincar de disparar partículas alfa); decisões D27 e D28 |
| 0.8 | 21/10/2026 | Cena do Bohr em 3D (camadas, saltos, luz colorida, espectro, fogos de artifício e brincar); decisões D29 e D30 |
| 0.9 | 27/10/2026 | Cena do modelo atual (orbitais) em 3D: onda, incerteza, foto instantânea, longa exposição, orbitais s e p e brincar; decisões D32 e D33. Falta apenas o quiz |
| 1.0 | 28/10/2026 | Quiz com dois modos (duelo de equipes A × B e solo), pontos, placar, banco de 21 perguntas; decisões D34 a D36. Faltam polimento e validação |
