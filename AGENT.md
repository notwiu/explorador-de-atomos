# AGENT.md — Explorador de Átomos

Guia para agentes de IA (Claude Code, etc.) e colaboradores que trabalham neste repositório. **Leia este arquivo inteiro antes de mexer no código.**

---

## 1. O que é este projeto

Site de apresentação para ensinar **modelos atômicos** a alunos do ensino médio de escola pública. É **projetado em sala pelo professor**; os alunos **não** têm acesso ao site (por enquanto).

O site tem estes momentos:

1. **Abertura.**
2. **Roda de cartões:** o menu central, com Dalton, Thomson, Rutherford, Bohr, Modelo atual e, por último, o Quiz. Clicar no cartão abre o item.
3. **Cenas dos modelos:** cada modelo explicado passo a passo, **em 3D**, com **muita animação**. O último passo de cada cena é **brincar** com o modelo em 3D (não existe um laboratório separado).
4. **Quiz básico:** só para fixar e se divertir, em tela cheia, com opções grandes.

Em todas as cenas existe um **widget lateral** com foto, nome, ano e um texto curto sobre o modelo, para o professor ler.

Detalhes: veja `docs/escopo-e-requisitos.md` e `docs/experiencia-e-design.md`.

## 2. Regras de ouro

1. **Pensar em projetor.** Fontes grandes, contraste alto, pouco texto por tela, elementos grandes.
2. **O professor controla o ritmo.** Nada começa sozinho; tudo avança por clique/tecla.
3. **Funcionar 100% offline.** Proibido CDN, fonte externa, imagem hospedada fora ou chamada de API em tempo de execução. Tudo fica dentro do projeto.
4. **Animação é prioridade, mas sem travar.** Deve rodar bem em computador simples de escola. Sempre respeitar o "modo leve" (veja seção 6).
5. **Não inventar ciência.** Todo conteúdo científico vem de `docs/conteudo-modelos.md`. Se precisar de um fato novo, acrescente lá primeiro, marcado como *a revisar*.
6. **Sem login, cadastro, backend ou rastreamento.**
7. **Pequeno e simples.** Evite dependências desnecessárias. Pergunte antes de adicionar uma biblioteca nova.
   - Em 3D: reaproveitar o palco (`src/three/stage.js`), destruir tudo ao sair da cena (`dispose`) e reaproveitar geometrias/materiais. O modo leve deve reduzir faces, desligar suavização e usar material simples.
8. **Documentar a cada mudança relevante** (seção 8).

## 3. Stack

| Camada | Escolha |
|---|---|
| Framework | React + Vite |
| Linguagem | JavaScript (migrar para TypeScript só se o autor decidir) |
| Fontes | Bricolage Grotesque (títulos) e Atkinson Hyperlegible (texto), embutidas no projeto |
| Animação de interface | Framer Motion |
| Animação pesada 2D (estrelas, partículas) | Canvas 2D com `requestAnimationFrame` |
| 3D (cenas dos modelos) | three.js direto (sem React Three Fiber), via `src/three/stage.js` |
| Estilo | CSS Modules, com tokens em `src/styles/tokens.css` (decisão D13) |
| Distribuição offline | `vite-plugin-singlefile` (gera um único `index.html`) |

## 4. Comandos

Comandos disponíveis (projeto base criado). Atualize esta seção quando mudarem.

```bash
npm install          # instala dependências
npm run dev          # servidor de desenvolvimento
npm run build        # gera a versão final (arquivo único em dist/)
npm run preview      # testa o build localmente
```

## 5. Estrutura de pastas

```
explorador-de-atomos/
├─ AGENT.md
├─ README.md
├─ CHANGELOG.md
├─ docs/
│  ├─ explorador-de-atomos-documentacao.md   # documento completo (trabalho da faculdade)
│  ├─ escopo-e-requisitos.md
│  ├─ experiencia-e-design.md
│  ├─ arquitetura.md
│  ├─ conteudo-modelos.md                    # fonte única do conteúdo científico
│  ├─ quiz.md
│  ├─ roadmap.md
│  ├─ decisoes.md
│  └─ diario.md
├─ public/                                   # arquivos estáticos (evitar: caminhos não funcionam ao abrir por duplo clique)
└─ src/                                      # criado na Etapa 1
   ├─ app/            # fluxo geral: abertura → roda de cartões → cena do modelo ou quiz
   ├─ components/     # OrbitalWheel, ModelArt, Controles, Widget lateral (futuro), etc.
   ├─ scenes/         # uma pasta por modelo (hoje: dalton/), mais index.js com o registro
   ├─ three/          # stage.js (palco 3D genérico) e helpers.js (rótulos, brilhos, utilidades)
   ├─ quiz/           # telas e lógica do quiz
   ├─ data/           # models.js, quiz.js (textos e perguntas)
   ├─ assets/photos/  # fotos dos cientistas (nome do arquivo = id do modelo; com crédito)
   ├─ hooks/          # useKeyboardNav, useFullscreen, useIdleHide, useReducedMotion
   └─ styles/         # tokens de design (cores, tamanhos de fonte)
```

## 6. Convenções

**Idioma**
- Textos da interface e documentação: **português do Brasil**.
- Nomes de variáveis, funções e arquivos de código: **inglês**.

**Código**
- Componentes React em `PascalCase`, arquivos `.jsx`.
- Textos e perguntas ficam em `src/data/`, **nunca** espalhados dentro dos componentes.
- Cada cena é um componente independente que recebe controle de passo (`step`) vindo do fluxo geral.
- Animações em Canvas devem limpar o loop (`cancelAnimationFrame`) ao sair da cena.
- Quantidade de partículas e efeitos vem de uma configuração central, para o **modo leve** poder reduzi-los.

**Modo leve:** botão/atalho que reduz partículas, desliga brilhos e simplifica transições. Também deve ser ativado se o sistema pedir `prefers-reduced-motion`.

**Teclado (obrigatório)**
- `→`, `Espaço`, `PageDown`: avançar.
- `←`, `PageUp`: voltar. Na roda de cartões, `←` e `→` giram a roda; `Enter`/`Espaço` abrem o cartão em destaque; `Esc` volta.
- `F`: tela cheia.
- `L`: ligar/desligar modo leve.
- `N`: mostrar/ocultar a nota do professor (nas cenas).
- `R`: reiniciar cena (a partir das cenas dos modelos).
- `N`: mostrar/ocultar notas do professor.
- `1`–`4` ou `A`–`D`: escolher alternativa no quiz.

**Design para projetor**
- Texto principal da cena: mínimo equivalente a ~32px em tela de 1080p; títulos bem maiores.
- Máximo de ~3 linhas curtas no widget lateral.
- Contraste forte (fundo escuro com elementos claros e coloridos costuma funcionar bem no projetor).
- Controles somem sozinhos após alguns segundos sem uso.
- Alvos clicáveis grandes.

**Commits:** [Conventional Commits](https://www.conventionalcommits.org/) em português. Exemplos:
`feat(rutherford): adiciona animação de partículas alfa`
`docs: atualiza roadmap`
`fix(quiz): permite nova tentativa após erro`

## 7. Quiz — resumo das regras

Detalhes completos em `docs/quiz.md`.

- Ocupa a **tela inteira**, uma pergunta por vez, alternativas grandes.
- **Acertou:** tela de acerto + explicação curta + botão para continuar.
- **Errou:** a alternativa errada fica marcada/desabilitada e o aluno **pode tentar outra**, sem punição.
- Tom leve; é para fixar e brincar, não para dar nota.

## 8. Fluxo de trabalho e documentação

Ao concluir qualquer mudança relevante, **atualize a documentação no mesmo commit**:

| O que mudou | Atualizar |
|---|---|
| Qualquer entrega | `CHANGELOG.md` |
| Decisão de tecnologia, design ou escopo | `docs/decisoes.md` |
| Escopo ou requisitos | `docs/escopo-e-requisitos.md` e `docs/explorador-de-atomos-documentacao.md` |
| Telas, animações, fluxo | `docs/experiencia-e-design.md` |
| Estrutura de código | `docs/arquitetura.md` e a seção 5 deste arquivo |
| Texto científico | `docs/conteudo-modelos.md` |
| Perguntas do quiz | `docs/quiz.md` e `src/data/quiz.js` |
| Progresso das etapas | `docs/roadmap.md` |
| Marco ou aprendizado | `docs/diario.md` (alimenta os posts de LinkedIn/GitHub) |

## 9. Definição de pronto (para cada cena ou tela)

- [ ] Funciona só com teclado e com mouse.
- [ ] Cenas 3D: abre, troca de passo e sai sem erros; avisa se o navegador não tem WebGL.
- [ ] Legível a 3–5 metros (teste reduzindo o zoom do navegador e afastando-se da tela).
- [ ] Animação fluida; testada com o **modo leve** ligado e desligado.
- [ ] Funciona sem internet.
- [ ] Conteúdo científico confere com `docs/conteudo-modelos.md`.
- [ ] Documentação atualizada.

## 10. Estado atual

- **Fase:** Etapas 1 a 4 concluídas. Prontos: projeto base, **tela inicial**, **roda de cartões** e as cenas do **Dalton** (8 passos), do **Thomson** (9) e do **Rutherford** (9), todas em 3D e com brincar. Os outros cartões abrem uma tela provisória.
- **Próximo passo:** o autor pede a próxima cena (Bohr). Reaproveitar `Stage3D`, `SceneShell`, `AtomWidget`, `src/three/helpers.js` e o padrão de `src/scenes/dalton/`, `thomson/` e `rutherford/` (a cena do Rutherford tem trajetórias calculadas e partículas em pool). Para adicionar uma cena: pasta da cena, textos em `src/data/scenes/`, registro em `src/scenes/index.js` e dados do widget em `src/data/models.js`.
- **Ritmo de trabalho:** uma etapa por vez, com commit e documentação a cada passo. Não adiantar cenas que o autor ainda não pediu.
- Veja `docs/roadmap.md` para o detalhamento.

## 11. O que NÃO fazer

- Não adicionar dependências de rede (CDN, fontes do Google, analytics).
- Não iniciar animações automaticamente sem ação do professor.
- Não colocar muito texto na tela.
- Não alterar conteúdo científico sem atualizar `docs/conteudo-modelos.md`.
- Não usar imagens sem registrar crédito e licença em `docs/conteudo-modelos.md`.
