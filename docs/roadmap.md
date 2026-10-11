# Roadmap

Legenda: ✅ concluído · 🔄 em andamento · ⬜ pendente

## Visão geral

| Etapa | Entrega | Status |
|---|---|---|
| 0 | Planejamento e documentação | ✅ |
| 1 | Projeto base e tela inicial | 🔄 |
| 2 | Cena do Rutherford | ⬜ |
| 3 | Cenas de Bohr e Thomson | ⬜ |
| 4 | Cenas de Dalton e modelo atual | ⬜ |
| 5 | Laboratório | ⬜ |
| 6 | Quiz | ⬜ |
| 7 | Polimento, modo leve e build offline | ⬜ |
| 8 | Validação com o professor e ajustes | ⬜ |

---

## Etapa 0 — Planejamento e documentação ✅

- [x] Entender o pedido do professor
- [x] Definir formato (linha do tempo + laboratório + quiz)
- [x] Escolher stack (React + Vite)
- [x] Criar `AGENT.md`, `README.md` e documentação em `docs/`

## Etapa 1 — Projeto base e tela inicial 🔄

Feita aos poucos: primeiro o projeto base e o design da tela inicial; o restante entra junto com as cenas.

- [x] Criar projeto Vite + React
- [x] Configurar `vite-plugin-singlefile`
- [x] Definir estilo (CSS Modules) e registrar em `decisoes.md`
- [x] Tokens de design (cores, fontes, tamanhos de texto)
- [x] **Tela inicial (abertura)** com animações
- [x] Navegação por teclado (`useKeyboardNav`)
- [x] Tela cheia (`useFullscreen`)
- [x] Controles que somem sozinhos (`useIdleHide`)
- [x] **Tela de seleção com roda orbital de cartões** (cinco modelos + quiz), clicável e com teclado
- [ ] Adicionar as fotos dos cientistas em `src/assets/photos/` (com crédito e licença)
- [x] Configuração central de desempenho (modo normal e leve)
- [ ] Fluxo geral completo; hoje: abertura → roda de cartões → tela provisória do item escolhido
- [ ] Componente `AtomWidget` (foto, nome, ano, texto curto), entra com a cena do Dalton
- [ ] Barra de progresso discreta
- [ ] Testar a tela inicial no projetor da escola

## Etapa 2 — Cena do Rutherford ⬜

- [ ] Canvas com canhão de partículas alfa e folha de ouro
- [ ] Desvios realistas (a maioria passa, poucas desviam)
- [ ] Zoom até o núcleo
- [ ] Widget lateral preenchido
- [ ] Passos por clique (pergunta, experimento, observação, modelo)
- [ ] Teste em projetor/tela grande
- [ ] **Mostrar ao professor e coletar feedback**

## Etapa 3 — Bohr e Thomson ⬜

- [ ] Bohr: camadas, saltos, emissão de luz colorida
- [ ] Bohr: ponte com fogos de artifício e neon
- [ ] Thomson: raios catódicos e desvio do feixe
- [ ] Thomson: esfera positiva com elétrons
- [ ] Transições "Por que mudou?"

## Etapa 4 — Dalton e modelo atual ⬜

- [ ] Dalton: esferas formando moléculas
- [ ] Modelo atual: nuvem de pontos, foto instantânea vs longa exposição
- [ ] Conferir textos com `conteudo-modelos.md`

## Etapa 5 — Laboratório ⬜

- [ ] Seletor de elemento
- [ ] Troca de modelo
- [ ] Adicionar/remover partículas
- [ ] Comparador lado a lado
- [ ] Escala de tamanho (zoom até o núcleo)

## Etapa 6 — Quiz ⬜

- [ ] Tela de pergunta em tela cheia com alternativas grandes
- [ ] Seleção por clique e por tecla
- [ ] Tela de acerto com explicação
- [ ] Nova tentativa após erro
- [ ] Tela final
- [ ] Perguntas em `src/data/quiz.js`

## Etapa 7 — Polimento ⬜

- [ ] Modo leve revisado em computador simples
- [ ] Contraste e fontes testados no projetor
- [ ] Respeito a `prefers-reduced-motion`
- [ ] Build offline em arquivo único testado sem internet
- [ ] Imagens e créditos finalizados

## Etapa 8 — Validação ⬜

- [ ] Apresentar ao professor
- [ ] Ajustar conteúdo e ritmo conforme feedback
- [ ] Teste em sala real
- [ ] Registrar resultados para o trabalho da faculdade

---

## Ideias futuras (fora do escopo atual)

- Modo aluno (interação individual).
- Mais conteúdo: tabela periódica, ligações químicas.
- Novos experimentos e modelos.
- Versão em outros idiomas.
