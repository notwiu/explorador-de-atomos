# Arquitetura

## 1. Visão geral

Aplicação **100% frontend**, estática, sem backend. Roda no navegador do computador do professor, inclusive offline.

```
┌─────────────────────────── App (fluxo geral) ───────────────────────────┐
│ Abertura → Roda de cartões → Cena do modelo (3D) ou Quiz                  │
│                                                                           │
│  Estado global: etapa atual, passo da cena, modo leve, velocidade, notas │
└───────────────────────────────────────────────────────────────────────────┘
        │                │                 │              │
   scenes/           lab/              quiz/        components/
 (cenas 3D)     (reservado)       (telas+lógica)  (widget, controles)
        │                │                 │              │
        └──────── data/ (textos, modelos, perguntas) ───────┘
```

## 2. Tecnologias

| Camada | Escolha | Motivo |
|---|---|---|
| Framework | React | Componentes reutilizáveis; foco do autor em frontend |
| Build | Vite | Rápido e simples |
| Animação de UI | Framer Motion | Transições fluidas e declarativas |
| Animação pesada 2D | Canvas 2D | Controle de partículas e desempenho |
| 3D | three.js (direto, sem React Three Fiber) | Representação 3D de cada modelo; menos dependências |
| Offline | `vite-plugin-singlefile` | Gera um único `index.html` |

## 3. Estrutura de pastas

```
src/
├─ app/            # App.jsx, controle do fluxo e das etapas
├─ components/     # AtomWidget, Controls, ProgressBar, TeacherNotes...
├─ scenes/         # Dalton, Thomson, Rutherford, Bohr, Quantico
├─ quiz/           # QuizScreen, FeedbackScreen, lógica
├─ data/           # models.js, quiz.js, elements.js
├─ hooks/          # useKeyboardNav, useFullscreen, useIdleHide, useReducedMotion
└─ styles/         # tokens de design (cores, fontes)
public/
└─ images/         # fotos dos cientistas (com crédito)
```

## 4. Conceitos principais

### 4.1 Fluxo e passos
Um estado central guarda `stage` (etapa do fluxo) e `step` (passo dentro da cena). As teclas de navegação apenas incrementam ou decrementam `step`; ao passar do último passo, o fluxo avança de cena.

### 4.2 Cena
Cada cena é um componente que:
- recebe `step`, `speed` e `lightMode` por props;
- lê seu conteúdo de `src/data/models.js`;
- desenha a animação (Canvas e/ou Framer Motion);
- renderiza o `AtomWidget` com os dados do modelo.

### 4.3 AtomWidget
Componente do cartão lateral: foto, nome, ano, modelo e texto curto. Recebe um objeto do `models.js`.

### 4.4 Configuração de desempenho
Arquivo central (ex.: `src/app/performance.js`) define contagem de partículas, brilho e tipo de transição para os modos normal e leve.

### 4.5 Dados
Tudo que é conteúdo (textos, anos, créditos, perguntas) fica em `src/data/`, separado dos componentes, para ajustes rápidos após feedback do professor.

### 4.6 Cenas em 3D
- `src/three/stage.js`: palco 3D genérico (renderizador WebGL, câmera, luzes, arrastar para girar, laço de animação). Devolve `null` se o navegador não tiver WebGL.
- `src/components/Stage3D.jsx`: cria o palco e o "mundo" da cena e liga ao passo atual; destrói tudo ao sair da cena.
- `src/components/SceneShell.jsx`: moldura comum das cenas (área 3D, legenda, pontos de progresso, widget lateral).
- `src/scenes/<modelo>/<Modelo>Scene.jsx` e `<modelo>World.js`: a cena e o seu mundo 3D. O mundo expõe `goTo(passo, opções)` e `dispose()`.
- `src/scenes/index.js`: registro das cenas prontas. Item da roda sem cena abre a tela provisória.
- `src/data/scenes/<modelo>.js`: textos de cada passo (título, texto e nota do professor).
- `src/three/helpers.js`: ferramentas compartilhadas (rótulos 3D, brilhos, números repetíveis, liberação de memória).
- **Cenas por parâmetros (Thomson):** o estado da cena é um conjunto de números (quanto do tubo aparece, tamanho do feixe, desvio, etc.). Cada passo define os valores e a transição anima de um conjunto para outro.
- Animações entre passos usam `animate` do Framer Motion sobre os valores; as cenas não dependem de GSAP.
- **Estoque de esferas (Dalton):** 125 esferas reaproveitadas em todos os passos. Cada passo define um "alvo" (posição, tamanho e cor) para cada esfera, e elas se transformam de um desenho para o outro.
- **Desempenho:** modo leve usa esferas com menos faces, material simples, sem suavização de bordas e resolução 1x.

## 5. Formato dos dados (proposta)

```js
// src/data/models.js
export const models = [
  {
    id: 'dalton',
    year: 1803,
    scientist: 'John Dalton',
    modelName: 'Esfera maciça',
    shortText: '...',          // 2 a 3 linhas
    teacherNote: '...',        // opcional (tecla N)
    whyChanged: '...',         // o que este modelo não explicava (a partir do 2º)
    image: { src: '/images/dalton.jpg', credit: '...', license: '...' },
    accent: '#f59e0b',
  },
  // ...
];
```

```js
// src/data/quiz.js
export const questions = [
  {
    id: 'q1',
    text: '...',
    options: ['...', '...', '...', '...'],
    correctIndex: 0,
    explanation: '...',
  },
];
```

## 6. Build e distribuição

- `npm run build` gera `dist/index.html` único (com `vite-plugin-singlefile`).
- Fotos pequenas podem ser incorporadas (base64) para manter o arquivo único.
- Alternativa online: GitHub Pages ou Netlify.

## 7. Evolução futura

A separação entre **conteúdo** (`data/`), **fluxo** (`app/`) e **telas** (`scenes/`, `lab/`, `quiz/`) permite, no futuro:

- adicionar um "modo aluno" (interação individual);
- acrescentar novos modelos ou experimentos;
- traduzir o conteúdo;
- migrar para TypeScript.

## 8. Decisões técnicas em aberto

- [x] CSS Modules (D13, proposta)
- [x] JavaScript por enquanto (D14, proposta)
- [x] Só Framer Motion por enquanto (D15, proposta)
- [ ] Fotos embutidas no arquivo único ou pasta ao lado?

*(registrar a resposta em [decisoes.md](decisoes.md) quando decidir)*
