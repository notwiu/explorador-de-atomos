# ⚛️ Explorador de Átomos

Ferramenta web de apresentação, cheia de animações, para ensinar a **evolução dos modelos atômicos** em aulas de Química do ensino médio. Feita para ser **projetada em sala** pelo professor.

> **Status:** em desenvolvimento. Tela inicial, roda de cartões e as cenas do Dalton, do Thomson e do Rutherford (3D) prontas; as demais cenas em construção.

## O que o projeto faz

1. **Roda de cartões:** o menu, com Dalton, Thomson, Rutherford, Bohr, Modelo atual e o Quiz. Clicar no cartão abre o item.
2. **Cenas em 3D:** cada modelo explicado passo a passo, em ordem cronológica, com widget lateral (foto e texto curto para o professor ler) e um passo final para **brincar** com o modelo.
3. **Quiz básico:** em tela cheia, com alternativas grandes, para fixar o conteúdo de forma divertida.

## Por que existe

O projeto nasceu do pedido de um professor de escola pública por um material mais didático, em que os alunos pudessem **visualizar** os modelos atômicos. É também um trabalho de faculdade.

## Princípios

- Pensado para **projetor**: texto grande, contraste alto, pouco texto por tela.
- O **professor controla o ritmo** (teclado ou apresentador de slides).
- **Funciona offline**, sem internet na escola.
- **Muita animação**, com um modo leve para computadores simples.

## Tecnologias

React · Vite · three.js · Framer Motion · Canvas · SVG

## Como rodar

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera dist/index.html (arquivo único, funciona offline)
```

## Documentação

| Documento | Conteúdo |
|---|---|
| [AGENT.md](AGENT.md) | Regras e convenções para quem (ou o que) desenvolve |
| [Documentação completa](docs/explorador-de-atomos-documentacao.md) | Visão geral do trabalho |
| [Escopo e requisitos](docs/escopo-e-requisitos.md) | O que o sistema faz |
| [Experiência e design](docs/experiencia-e-design.md) | Fluxo de telas, animações e widget |
| [Arquitetura](docs/arquitetura.md) | Estrutura técnica |
| [Conteúdo dos modelos](docs/conteudo-modelos.md) | Textos científicos e créditos de imagens |
| [Quiz](docs/quiz.md) | Regras e perguntas |
| [Roadmap](docs/roadmap.md) | Etapas de desenvolvimento |
| [Decisões](docs/decisoes.md) | Registro de decisões de projeto |
| [Diário](docs/diario.md) | Evolução e ideias de posts |
| [CHANGELOG](CHANGELOG.md) | Histórico de versões |

## Autores

Willian Teotonio, Kemuel Darckson, Yan Pedro e João Rodrigues
