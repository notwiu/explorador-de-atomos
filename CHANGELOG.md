# Changelog

Todas as mudanças relevantes do projeto serão registradas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Não lançado]

### Adicionado
- Foto do Thomson (enviada pelo autor, em preto e branco) no widget lateral e no cartão da roda. Origem e licença ainda precisam ser registradas em `docs/conteudo-modelos.md`.
- **Cena do Thomson em 3D** (nove passos): tubo de raios catódicos (cátodo, ânodo, placas e tela), feixe que se desvia para a placa positiva, zoom nos elétrons, esfera positiva e pudim de passas, limitação do modelo e **brincar** (arrastar elétrons para dentro da esfera e equilibrar a carga total).
- `src/three/helpers.js` com ferramentas 3D compartilhadas (rótulos, brilhos, números repetíveis, liberação de memória).
- Retrato do Dalton (foto enviada pelo autor, em preto e branco) no widget lateral e no cartão da roda. Origem e licença ainda precisam ser registradas em `docs/conteudo-modelos.md`.
- **Cena do Dalton em 3D** (oito passos): matéria, átomo maciço, elementos, combinação, reação (antes e depois), limitação do modelo e **brincar** (arrastar átomos, encostar para formar compostos, duplo clique para separar).
- Widget lateral (`AtomWidget`) com foto (ou ilustração provisória), nome, ano, modelo e texto curto; nota do professor com a tecla **N**.
- Estrutura reaproveitável de cenas: `Stage3D`, `SceneShell`, palco 3D genérico (`src/three/stage.js`), registro de cenas e textos em `src/data/scenes/`.
- Teclas **R** (repetir o passo) e **N** (nota do professor).
- Aviso quando o navegador não consegue abrir o 3D; modo leve também para o 3D.
- three.js como dependência.
- **Tela de seleção com roda orbital de cartões** (adaptada do componente "orbital image wheel"): ao clicar em "Começar a viagem", aparece a linha do tempo em forma de roda, com Dalton, Thomson, Rutherford, Bohr, Modelo atual e, por último, o Quiz.
- Cartões clicáveis em estilo de jogo: clicar em um cartão gira a roda até ele; clicar no cartão em destaque (ou Enter) abre o item. Setas e roda do mouse também giram a roda.
- Ilustrações provisórias nos cartões (uma por modelo e uma para o quiz) enquanto as fotos não são adicionadas.
- Fotos detectadas automaticamente: basta colocar `dalton.jpg`, `thomson.jpg`, etc. em `src/assets/photos/`.
- Tela provisória para cada item aberto (as cenas entram uma por vez).
- `useKeyboardNav` com ações `activate` (Enter/Espaço) e `back` (Esc).
- Projeto base com Vite + React, configurado para gerar um único `index.html` (`vite-plugin-singlefile`).
- **Tela inicial (abertura)**: título animado, átomo com três elétrons e rastros, fundo de estrelas e linha do tempo dos cinco modelos que se desenha ao entrar.
- Tela provisória da linha do tempo (placeholder), só para testar o fluxo.
- Navegação por teclado (Espaço, Enter, setas, Esc), tela cheia (F) e modo leve (L).
- Controles que somem sozinhos após alguns segundos sem atividade.
- Configuração central de desempenho (`performance.js`) com modo normal e modo leve.
- Tokens de design e fontes embutidas (Bricolage Grotesque e Atkinson Hyperlegible), funcionando offline.
- `AGENT.md` com regras e convenções para desenvolvimento.
- `README.md` com visão geral do projeto.
- Documentação em `docs/`: documento completo, escopo e requisitos, experiência e design, arquitetura, conteúdo dos modelos, quiz, roadmap, decisões e diário.

### Alterado
- README e documentação: "Autor" virou "Autores" (Willian Teotonio, Kemuel Darckson, Yan Pedro e João Rodrigues).
- Cena do Dalton passou a usar os helpers compartilhados; corrigido o caso de o arraste ser interrompido pelo teclado e a câmera ficar travada.
- Legenda das cenas menor e em uma faixa própria **abaixo** da área 3D, para não cobrir os átomos nem atrapalhar o arrastar.
- Widget lateral com foto mais alta, quando há foto, e esfumaçado na base.
- "Brincar com os modelos" passa a ser um passo dentro de cada cena (em 3D), em vez de um laboratório separado.
- Peso do arquivo final: cerca de 1,3 MB (antes, cerca de 0,5 MB), por causa do three.js.
- Tela inicial reduzida em cerca de 8% (tamanhos de texto e do átomo), após teste do autor.
- Documento completo atualizado (v0.2): quiz básico reincluído no final, laboratório, widget lateral e ênfase em animação.
- Decisão D05 (sem quiz) substituída pela D09 (quiz básico no final).

## [0.1.0] - 2026-10-05

### Adicionado
- Primeira versão da documentação: contexto, objetivos, decisões iniciais e conceito de cenas.
