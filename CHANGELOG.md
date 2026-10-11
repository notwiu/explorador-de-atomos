# Changelog

Todas as mudanças relevantes do projeto serão registradas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Não lançado]

### Adicionado
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
- Tela inicial reduzida em cerca de 8% (tamanhos de texto e do átomo), após teste do autor.
- Documento completo atualizado (v0.2): quiz básico reincluído no final, laboratório, widget lateral e ênfase em animação.
- Decisão D05 (sem quiz) substituída pela D09 (quiz básico no final).

## [0.1.0] - 2026-10-05

### Adicionado
- Primeira versão da documentação: contexto, objetivos, decisões iniciais e conceito de cenas.
