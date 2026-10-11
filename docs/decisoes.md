# Registro de decisões

Cada decisão importante fica registrada aqui, com data, motivo e consequências. Quando uma decisão mudar, **não apague a antiga**: marque como *substituída* e crie uma nova.

## Índice

| ID | Decisão | Status |
|---|---|---|
| D01 | Formato: site | Ativa |
| D02 | Tecnologia: React + Vite | Ativa |
| D03 | Uso pelo professor, não pelos alunos | Ativa |
| D04 | Foco em projeção e controle do professor | Ativa |
| D05 | Sem quiz | **Substituída** pela D09 |
| D06 | Muita animação como prioridade | Ativa |
| D07 | Widget lateral com foto e texto curto | Ativa |
| D08 | Explicação em ordem cronológica, seguida de laboratório | Ativa |
| D09 | Quiz básico no final | Ativa |
| D10 | Quiz em tela cheia, com nova tentativa após erro | Ativa |
| D11 | Funcionar offline em arquivo único | Ativa |
| D12 | Modo leve para computadores simples | Ativa |
| D13 | Estilo com CSS Modules | Proposta (confirmar) |
| D14 | JavaScript (sem TypeScript por enquanto) | Proposta (confirmar) |
| D15 | Animação de interface só com Framer Motion por enquanto | Proposta (confirmar) |
| D16 | Fontes embutidas: Bricolage Grotesque e Atkinson Hyperlegible | Proposta (confirmar) |
| D17 | Cores de cada modelo inspiradas nas cores da luz dos átomos | Proposta (confirmar) |
| D18 | Linha do tempo como roda de cartões clicáveis (estilo jogo) | Ativa |
| D19 | Roda adaptada: sem rolagem, sem Tailwind/GSAP | Proposta (confirmar) |
| D20 | Fotos em `src/assets/photos/`, nome do arquivo = id do modelo | Proposta (confirmar) |
| D21 | O quiz é o sexto cartão da roda | Ativa |

---

### D01 — Formato: site
- **Data:** 05/10/2026
- **Contexto:** o professor pediu algo que funcionasse em um site.
- **Decisão:** desenvolver uma aplicação web.
- **Consequência:** abre em qualquer computador com navegador, sem instalação.

### D02 — Tecnologia: React + Vite
- **Data:** 05/10/2026
- **Contexto:** alternativas eram HTML/CSS/JS puro ou React + Vite.
- **Decisão:** React + Vite, escolha do autor, por chamar mais atenção dos alunos e ser mais organizada, além de ser a área principal do autor (frontend).
- **Consequência:** exige configuração extra para gerar versão offline (veja D11).

### D03 — Uso pelo professor, não pelos alunos
- **Data:** 05/10/2026
- **Contexto:** os alunos não terão acesso ao site por enquanto.
- **Decisão:** projetar como ferramenta de apresentação.
- **Consequência:** sem foco em celular nem em interação individual. Arquitetura deve permitir um "modo aluno" no futuro.

### D04 — Foco em projeção e controle do professor
- **Data:** 05/10/2026
- **Decisão:** fontes grandes, contraste alto, navegação por teclado e passador, nada inicia sozinho.

### D05 — Sem quiz *(substituída pela D09)*
- **Data:** 05/10/2026
- **Contexto:** a ideia inicial era algo para mostrar e ensinar, não testar conhecimento.
- **Decisão original:** não ter quiz.
- **Substituída em:** 10/10/2026.

### D06 — Muita animação como prioridade
- **Data:** 10/10/2026
- **Contexto:** o autor quer algo que chame muita atenção dos alunos.
- **Decisão:** animação é o grande diferencial do projeto.
- **Consequência:** exige cuidado com desempenho (D12).

### D07 — Widget lateral com foto e texto curto
- **Data:** 10/10/2026
- **Decisão:** ao lado do átomo, um cartão com foto, nome, ano e texto curto sobre o modelo, para o professor ler.
- **Consequência:** é preciso obter imagens com licença livre e registrar créditos.

### D08 — Explicação cronológica, depois laboratório
- **Data:** 10/10/2026
- **Decisão:** explicar todos os modelos passo a passo, em ordem cronológica, e só depois liberar um laboratório para "brincar" com eles.

### D09 — Quiz básico no final
- **Data:** 10/10/2026
- **Contexto:** o autor mudou de ideia: o quiz serve para fixar e se divertir, não para avaliar.
- **Decisão:** incluir quiz bem básico depois do laboratório.
- **Substitui:** D05.

### D10 — Quiz em tela cheia, com nova tentativa
- **Data:** 10/10/2026
- **Decisão:** perguntas em tela inteira, opções grandes. Acerto abre tela com explicação curta. Erro permite tentar outra alternativa.
- **Consequência:** sem pontuação punitiva; tom leve.

### D11 — Offline em arquivo único
- **Data:** 05/10/2026 (sugestão) / 10/10/2026 (mantida)
- **Contexto:** a internet de escolas costuma ser instável, e o `dist` padrão do Vite não abre por duplo clique (`file://`).
- **Decisão:** gerar um único `index.html` com `vite-plugin-singlefile` e não usar recursos externos.

### D12 — Modo leve
- **Data:** 10/10/2026
- **Contexto:** muita animação em computadores simples de escola pode travar.
- **Decisão:** configuração central de desempenho com modo leve e respeito a `prefers-reduced-motion`.

---

### D13 — Estilo com CSS Modules
- **Data:** 10/10/2026
- **Contexto:** a escolha estava em aberto (CSS Modules ou Tailwind).
- **Decisão:** CSS Modules, que já vem no Vite, sem dependência extra, com tokens em variáveis CSS (`src/styles/tokens.css`).
- **Consequência:** estilos ficam ao lado de cada componente (`Componente.module.css`).

### D14 — JavaScript por enquanto
- **Data:** 10/10/2026
- **Decisão:** manter JavaScript para ir mais rápido. A arquitetura permite migrar para TypeScript depois.

### D15 — Só Framer Motion por enquanto
- **Data:** 10/10/2026
- **Decisão:** usar Framer Motion para a interface e Canvas/SVG para as animações pesadas. GSAP só entra se uma cena realmente precisar.

### D16 — Fontes embutidas
- **Data:** 10/10/2026
- **Contexto:** o site precisa funcionar offline, então nada de fontes do Google.
- **Decisão:** **Bricolage Grotesque** (títulos, versão condensada e bem pesada, boa de ler de longe) e **Atkinson Hyperlegible** (texto, criada para máxima legibilidade). Ambas são livres (licença OFL) e ficam dentro do projeto, só o subconjunto latino para manter o arquivo leve.

### D17 — Cores inspiradas nas cores da luz dos átomos
- **Data:** 10/10/2026
- **Decisão:** cada modelo tem uma cor própria (Dalton âmbar, Thomson violeta, Rutherford coral, Bohr ciano, modelo atual verde-água), em referência às cores emitidas por átomos. As cores se repetem na linha do tempo, nos elétrons e nas cenas.

### D18 — Linha do tempo como roda de cartões clicáveis
- **Data:** 10/10/2026
- **Contexto:** o autor enviou o componente "orbital image wheel" e quer que, ao clicar em "Começar a viagem", a linha do tempo apareça nesse formato, com as fotos clicáveis, estilo de jogo.
- **Decisão:** a tela depois da abertura é uma roda de cartões. Clicar na foto abre o modelo e a apresentação.
- **Substitui em parte:** o fluxo linear "linha do tempo → laboratório → quiz". Agora a roda é o menu central. Onde fica o laboratório está em aberto (veja abaixo).

### D19 — Roda adaptada ao projeto
- **Data:** 10/10/2026
- **Contexto:** o componente original usa Tailwind, GSAP/ScrollTrigger, shadcn (`cn`) e um componente de legenda (`MotionSubtitle`), e gira com a rolagem da página. Este projeto usa CSS Modules, Framer Motion, não tem rolagem e é apresentado em projetor.
- **Decisão:** reescrever em JavaScript mantendo o visual (cartões em arco, desfoque e escurecimento fora do foco, profundidade, botões com os nomes embaixo). A roda gira por clique, setas, roda do mouse e pelos botões. Com só 6 itens, a roda é menor do que a do original, para mostrar o cartão central e os dois vizinhos.
- **Consequência:** sem dependências novas.

### D20 — Fotos em `src/assets/photos/`
- **Data:** 10/10/2026
- **Contexto:** o arquivo final precisa funcionar offline e aberto por duplo clique, e caminhos de `public/` não funcionam assim.
- **Decisão:** as fotos ficam em `src/assets/photos/`, com o nome do id do modelo (`dalton`, `thomson`, `rutherford`, `bohr`, `quantum`). São detectadas automaticamente e embutidas no arquivo final. Sem foto, o cartão mostra uma ilustração provisória.

### D21 — O quiz é o sexto cartão
- **Data:** 10/10/2026
- **Decisão:** o último cartão da roda é o Quiz e abre o quiz com os jogos.

---

## Decisões em aberto

| Tema | Opções | Responsável |
|---|---|---|
| Confirmar D13 a D17, D19 e D20 | Aceitar ou trocar | Willian |
| Onde fica o laboratório (brincar com os modelos)? | Dentro do quiz/jogos, cartão próprio ou dentro de cada cena | Willian |
| Fotos | Embutidas no arquivo único ou pasta ao lado | Willian |
| Alternativas do quiz | Ordem fixa ou embaralhada | Willian + professor |

## Modelo para novas decisões

```
### Dxx — Título
- **Data:**
- **Contexto:**
- **Decisão:**
- **Consequência:**
- **Substitui / substituída por:**
```
