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
| D08 | Explicação em ordem cronológica, seguida de laboratório | Substituída em parte pela D23 |
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
| D22 | Tudo em 3D, com three.js direto (sem React Three Fiber) | Ativa |
| D23 | "Brincar" é um passo dentro de cada cena, não um laboratório separado | Ativa |
| D24 | Cena do Dalton: oito passos, com elementos genéricos A, B e C | Proposta (confirmar) |
| D25 | Cena do Thomson: nove passos, com o experimento do tubo e o feixe desenhado visível | Proposta (confirmar) |
| D26 | Ferramentas 3D compartilhadas e cenas descritas por parâmetros | Ativa |
| D27 | Cena do Rutherford: nove passos, com física do espalhamento e duas escalas (laboratório e átomo) | Proposta (confirmar) |
| D28 | No brincar do Rutherford, clique e arraste disparam partículas; botão direito gira a câmera | Proposta (confirmar) |

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
- **Substitui em parte:** o fluxo linear "linha do tempo → laboratório → quiz". Agora a roda é o menu central. O lugar do laboratório foi resolvido na D23.

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

### D22 — Tudo em 3D com three.js
- **Data:** 11/10/2026
- **Contexto:** o autor quer tudo em 3D, com uma representação 3D de cada modelo para mostrar.
- **Decisão:** usar three.js direto (WebGL), com um palco genérico reaproveitado por todas as cenas (`src/three/stage.js`). Sem React Three Fiber, para manter poucas dependências e controle sobre o desempenho.
- **Consequência:** o arquivo final passou de cerca de 0,5 MB para cerca de 1,3 MB (three.js é a maior parte). Continua funcionando offline. Computadores sem WebGL mostram uma mensagem em vez da cena.

### D23 — "Brincar" dentro de cada cena
- **Data:** 11/10/2026
- **Contexto:** o autor esclareceu que brincar com os modelos deve ser algo visual dentro dos modelos, em 3D.
- **Decisão:** não haverá um laboratório separado. O último passo de cada cena é interativo.
- **Substitui em parte:** D08.
- **Consequência:** comparador lado a lado e escala de tamanho viram extras opcionais (etapa 8 do roadmap).

### D24 — Cena do Dalton
- **Data:** 11/10/2026
- **Decisão:** oito passos (matéria, átomo, elementos, combinação, reação antes e depois, limitação, brincar). Os elementos são exemplos genéricos A (laranja), B (azul) e C (rosa), sem fórmulas modernas, para ficar fiel à ideia de Dalton. A reação mostra dois compostos A+B e dois átomos C, que trocam de parceiros (6 átomos antes e depois).
- **Consequência:** os textos precisam de revisão do professor.

### D25 — Cena do Thomson
- **Data:** 15/10/2026
- **Contexto:** pedido de uma cena com o mesmo nível de qualidade do Dalton.
- **Decisão:** nove passos: (1) por que mudar o modelo, (2) o tubo de raios catódicos, (3) o feixe, (4) o desvio, (5) os elétrons, (6) a carga positiva, (7) o pudim de passas, (8) o que o modelo não explicava, (9) brincar. O brincar é arrastar elétrons para dentro da esfera até a carga total ficar zero (com a esfera mudando de cor se sobrar ou faltar carga).
- **Cuidados científicos:** o feixe é desenhado visível para facilitar, e a nota do professor avisa que na vida real ele quase não se vê (o brilho aparece onde atinge a tela). O desvio é na direção da placa positiva, pois o feixe é negativo. A carga da esfera na cena (+8) é um número de exemplo.
- **Consequência:** os textos precisam de revisão do professor.

### D26 — Ferramentas 3D compartilhadas
- **Data:** 15/10/2026
- **Decisão:** rótulos 3D, brilhos, números repetíveis e liberação de memória foram para `src/three/helpers.js`. Cada cena descreve seu estado com poucos parâmetros por passo e anima de um passo para o outro, o que facilita criar as próximas cenas.

### D27 — Cena do Rutherford
- **Data:** 20/10/2026
- **Decisão:** nove passos: (1) por que mudar o modelo (previsão do Thomson), (2) o experimento, (3) a maioria atravessa, (4) algumas desviam e poucas voltam, (5) o átomo é quase todo vazio, (6) o núcleo, (7) o modelo planetário, (8) o que o modelo não explicava, (9) brincar.
- **Duas escalas:** o laboratório (fonte, folha e tela que brilha) e o átomo, ligados por um zoom. Dentro do átomo, as trajetórias são **calculadas** com a repulsão entre cargas positivas (a partícula é repelida com uma força que diminui com o quadrado da distância), então o desvio depende de por onde a partícula passa: longe quase não desvia, perto desvia, de frente volta. No laboratório as trajetórias são desenhadas (maioria reta, algumas desviadas, poucas de volta).
- **Cuidados científicos:** o desenho está fora de escala (o núcleo real é muito menor), e a nota do professor diz isso. As partículas alfa são positivas e vêm de uma fonte radioativa. O brilho na tela representa as cintilações observadas.
- **Consequência:** os textos precisam de revisão do professor.

### D28 — Controles do brincar no Rutherford
- **Data:** 20/10/2026
- **Decisão:** no último passo, clicar ou arrastar dispara partículas alfa na direção do ponto mirado (quanto mais perto do centro, maior o desvio); o botão direito do mouse gira a câmera; R zera a contagem.
- **Consequência:** nesse passo, arrastar com o botão esquerdo não gira a câmera.

---

## Decisões em aberto

| Tema | Opções | Responsável |
|---|---|---|
| Confirmar D13 a D17, D19, D20, D24, D25, D27 e D28 | Aceitar ou trocar | Autores |
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
