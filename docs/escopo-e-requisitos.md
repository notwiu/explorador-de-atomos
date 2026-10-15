# Escopo e requisitos

## 1. Origem do pedido

O professor pediu um jogo/ferramenta sobre modelos atômicos que fosse **mais didático** e que permitisse ao pessoal **visualizar os modelos**. O material será mostrado em aulas de ensino médio de escola pública e precisa funcionar em um **site**.

## 2. Em escopo (versão 1)

- Linha do tempo animada com 5 modelos em ordem cronológica.
- Widget lateral por cena (foto, nome, ano e texto curto).
- Transições "Por que mudou?" entre os modelos.
- Representação 3D de cada modelo, com um passo final para brincar com ele.
- Quiz básico em tela cheia.
- Navegação por teclado e compatibilidade com apresentadores de slides.
- Tela cheia, modo leve e controles que somem sozinhos.
- Versão offline em arquivo único.

## 3. Fora de escopo (por enquanto)

- Acesso dos alunos pelo próprio dispositivo.
- Login, cadastro, ranking, pontuação persistente.
- Backend ou banco de dados.
- Votação da turma em tempo real.
- Versão para celular (a prioridade é o projetor).

> Se os alunos ganharem acesso no futuro, o código deve permitir adicionar um "modo aluno" sem refazer a base (veja [arquitetura.md](arquitetura.md)).

## 4. Usuários

| Usuário | Papel |
|---|---|
| Professor | Usa e controla o site em sala |
| Alunos | Assistem à projeção e participam oralmente |
| Autores (Willian, Kemuel, Yan e João) | Desenvolvem e mantêm |

## 5. Requisitos funcionais

| ID | Requisito |
|---|---|
| RF01 | Navegar entre cenas avançando e voltando |
| RF02 | Cada animação inicia apenas por ação do professor |
| RF03 | Exibir widget lateral com foto, nome, ano e texto curto em cada cena |
| RF04 | Exibir transição "Por que mudou?" entre modelos |
| RF05 | Reiniciar a cena atual |
| RF06 | Ajustar velocidade das animações (normal e lenta) |
| RF07 | Alternar tela cheia |
| RF08 | Alternar modo leve |
| RF09 | Cada modelo tem uma representação 3D que pode ser girada com o mouse |
| RF10 | Cada cena termina com um passo de "brincar" com o modelo em 3D |
| RF11 | Cenas funcionam no modo leve (menos detalhe) e avisam se o 3D não abrir |
| RF12 | Quiz em tela cheia com uma pergunta por vez |
| RF13 | Quiz: ao acertar, mostrar tela de acerto com explicação curta |
| RF14 | Quiz: ao errar, permitir tentar outra alternativa |
| RF15 | Notas do professor opcionais (atalho de teclado) |
| RF16 | Barra de progresso discreta mostrando a posição no fluxo |

## 6. Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF01 | Legível a distância: fontes grandes, contraste alto, pouco texto |
| RNF02 | Funciona 100% offline |
| RNF03 | Fluido em computador simples de escola (meta: 30 fps ou mais no modo leve) |
| RNF04 | Navegação completa por teclado |
| RNF05 | Sem login, cadastro ou rastreamento |
| RNF06 | Textos e perguntas separados do código (`src/data/`) |
| RNF07 | Respeitar `prefers-reduced-motion` |
| RNF08 | Imagens com licença livre e crédito registrado |

## 7. Critérios de aceite da versão 1

- O professor consegue percorrer a linha do tempo inteira só com teclado ou passador.
- Cada modelo tem animação própria e widget lateral.
- Cada cena tem representação 3D e um passo final de brincar.
- O quiz funciona do início ao fim, com feedback de acerto e nova tentativa.
- O arquivo único abre sem internet em um computador comum.
- O professor valida o conteúdo científico.

## 8. Premissas e dúvidas em aberto

- [ ] Qual resolução e proporção do projetor da escola? (assumir 16:9 / 1080p por ora)
- [ ] O computador da escola tem navegador moderno? Qual?
- [ ] O professor usa passador de slides?
- [ ] Quantos minutos de aula estão previstos para a apresentação?
- [ ] O professor quer notas de apoio em cada cena?
