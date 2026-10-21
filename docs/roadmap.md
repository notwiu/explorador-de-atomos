# Roadmap

Legenda: ✅ concluído · 🔄 em andamento · ⬜ pendente

## Visão geral

| Etapa | Entrega | Status |
|---|---|---|
| 0 | Planejamento e documentação | ✅ |
| 1 | Projeto base, tela inicial e roda de cartões | ✅ |
| 2 | Cena do **Dalton** em 3D (define o padrão das cenas) | ✅ |
| 3 | Cena do **Thomson** em 3D | ✅ |
| 4 | Cena do **Rutherford** em 3D | ✅ |
| 5 | Cena do Bohr | ⬜ |
| 6 | Cena do modelo atual | ⬜ |
| 7 | Quiz | ⬜ |
| 8 | Extras opcionais (comparador, escala de tamanho) | ⬜ |
| 9 | Polimento, modo leve e build offline | ⬜ |
| 10 | Validação com o professor e ajustes | ⬜ |

Cada cena segue o mesmo padrão: 3D, passos com legenda, widget lateral, notas do professor e um passo final de "brincar".

---

## Etapa 0 — Planejamento e documentação ✅

- [x] Entender o pedido do professor
- [x] Definir formato (linha do tempo + quiz; brincar dentro de cada modelo)
- [x] Escolher stack (React + Vite)
- [x] Criar `AGENT.md`, `README.md` e documentação em `docs/`

## Etapa 1 — Projeto base, tela inicial e roda de cartões ✅

- [x] Projeto Vite + React, build em arquivo único (offline)
- [x] Tokens de design, fontes embutidas, CSS Modules
- [x] Tela inicial (abertura) com animações
- [x] Roda de cartões (cinco modelos + quiz), clicável e com teclado
- [x] Navegação por teclado, tela cheia, modo leve, controles que somem sozinhos
- [ ] Adicionar as fotos dos cientistas em `src/assets/photos/` (com crédito e licença). Dalton e Thomson já têm foto (falta registrar origem e licença); faltam Rutherford, Bohr e modelo atual
- [ ] Testar tudo no projetor da escola

## Etapa 2 — Cena do Dalton (3D) ✅

- [x] Palco 3D genérico (`stage.js`), moldura de cena (`SceneShell`) e widget lateral (`AtomWidget`)
- [x] Oito passos: matéria, átomo, elementos, combinação, reação (antes e depois), limitação e brincar
- [x] Brincar: arrastar átomos, encostar para formar compostos, duplo clique para separar
- [x] Notas do professor (N), repetir passo (R), voltar à roda (Esc)
- [x] Modo leve e aviso quando o navegador não abre o 3D
- [ ] Testar em tela grande/projetor e ajustar tamanhos, cores e velocidade
- [ ] Revisar os textos com o professor

## Etapa 3 — Cena do Thomson (3D) ✅

- [x] Tubo de raios catódicos em 3D: cátodo, ânodo, placas de desvio e tela
- [x] Feixe que faz a tela brilhar e se curva em direção à placa positiva
- [x] Zoom nos elétrons (partículas minúsculas e negativas)
- [x] Esfera positiva e elétrons entrando: pudim de passas
- [x] Passo "Por que mudar o modelo?" (limitação do Dalton) e "O que o modelo não explicava"
- [x] Brincar: arrastar elétrons para dentro da esfera e equilibrar a carga total
- [x] Foto do Thomson em `src/assets/photos/thomson.jpg` (falta registrar origem e licença; se houver versão maior, trocar)
- [ ] Testar em tela grande/projetor e revisar os textos com o professor

## Etapa 4 — Cena do Rutherford (3D) ✅

- [x] Previsão do modelo de Thomson: partículas atravessariam quase sem desviar
- [x] Experimento 3D: fonte de partículas alfa, folha de ouro e tela que brilha (cintilações)
- [x] A maioria atravessa; algumas desviam e pouquíssimas voltam
- [x] Zoom até um átomo de ouro (a folha cresce e some), núcleo minúsculo e elétrons distantes
- [x] Trajetórias calculadas com a repulsão entre cargas positivas (espalhamento de Rutherford)
- [x] Modelo planetário com órbitas e a limitação (o elétron cairia no núcleo)
- [x] Brincar: clicar ou arrastar para disparar partículas alfa, com contador (passaram, desviaram, voltaram)
- [ ] Foto do Rutherford em `src/assets/photos/rutherford.jpg` (com origem e licença)
- [ ] Testar em tela grande/projetor e revisar os textos com o professor

## Etapa 5 — Cena do Bohr ⬜

- [ ] Camadas, saltos de elétron e emissão de luz colorida
- [ ] Ponte com fogos de artifício e neon
- [ ] Brincar (ideia: dar energia ao elétron)

## Etapa 6 — Cena do modelo atual ⬜

- [ ] Nuvem de probabilidade, foto instantânea vs longa exposição
- [ ] Brincar

## Etapa 7 — Quiz ⬜

- [ ] Tela de pergunta em tela cheia com alternativas grandes
- [ ] Seleção por clique e por tecla
- [ ] Tela de acerto com explicação e nova tentativa após erro
- [ ] Tela final
- [ ] Perguntas em `src/data/quiz.js`

## Etapa 8 — Extras opcionais ⬜

- [ ] Comparador: o mesmo átomo nos cinco modelos, lado a lado
- [ ] Escala de tamanho: do mundo cotidiano até o núcleo

## Etapa 9 — Polimento ⬜

- [ ] Modo leve revisado em computador simples
- [ ] Contraste e fontes testados no projetor
- [ ] Peso do arquivo final revisado
- [ ] Build offline em arquivo único testado sem internet
- [ ] Imagens e créditos finalizados

## Etapa 10 — Validação ⬜

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
