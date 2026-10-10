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

## Decisões em aberto

| Tema | Opções | Responsável |
|---|---|---|
| Estilo | CSS Modules ou Tailwind | Willian |
| Linguagem | JavaScript ou TypeScript | Willian |
| Animação | Só Framer Motion ou também GSAP | Willian |
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
