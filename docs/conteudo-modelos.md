# Conteúdo dos modelos atômicos

> **Fonte única do conteúdo científico do projeto.** Todo texto exibido no site deve vir daqui.
> **Status: rascunho para revisão do professor.** Datas e afirmações devem ser conferidas antes da versão final.

## Como usar este arquivo

- Cada modelo tem: dados-chave, **texto curto do widget** (2 a 3 linhas), nota do professor, "por que mudou?" e ideia de animação.
- Se precisar de um fato novo, acrescente aqui primeiro, marcado como **[a revisar]**.
- Imagens: registrar crédito e licença na seção 7.

---

## 1. Dalton — esfera maciça

| Item | Dado |
|---|---|
| Cientista | John Dalton |
| Ano | 1803 a 1808 (teoria apresentada e depois publicada) |
| Nome do modelo | Esfera maciça / "bola de bilhar" |

**Texto curto (widget):**
> Para Dalton, toda matéria é feita de átomos: esferas minúsculas, maciças e indivisíveis. Cada elemento tem seus próprios átomos, diferentes dos de outros elementos.

**Ideias principais:**
- Átomos de um mesmo elemento são iguais entre si.
- Átomos de elementos diferentes são diferentes.
- Nas reações químicas, os átomos se combinam e se rearranjam, sem serem criados ou destruídos.

**Nota do professor:** pergunte à turma: "Se tudo é feito de átomos, como as substâncias diferentes se formam?"

**Limitação (leva ao próximo modelo):** não explica fenômenos elétricos nem a existência de partículas menores que o átomo.

**Animação:** esferas coloridas se combinando em moléculas simples.

**Passos da cena (texto exibido; espelha `src/data/scenes/dalton.js`):**

| # | Título | Texto | Nota do professor |
|---|---|---|---|
| 1 | Do que a matéria é feita? | Se dividirmos a matéria em pedaços cada vez menores, o que encontramos no final? | Deixe a turma arriscar respostas antes de avançar. |
| 2 | O átomo | Dalton propôs que toda matéria é feita de átomos: esferas minúsculas, maciças e indivisíveis. | Pergunte à turma: se tudo é feito de átomos, como as substâncias diferentes se formam? |
| 3 | Cada elemento tem seus átomos | Átomos do mesmo elemento são iguais entre si. Átomos de elementos diferentes são diferentes. | |
| 4 | Átomos se combinam | Átomos de elementos diferentes se juntam e formam as substâncias compostas. | |
| 5 | Reações químicas | Duas substâncias compostas (átomo laranja com azul) e dois átomos rosa. O que acontece quando reagem? | Peça à turma que preveja o resultado antes de avançar. |
| 6 | Os átomos se rearranjam | Mudam de parceiros, mas nenhum átomo é criado nem destruído: 6 antes, 6 depois. | |
| 7 | O que o modelo não explicava | Os fenômenos elétricos e a existência de partículas menores que o átomo. | Deixe a pergunta no ar: o que mais poderia haver dentro do átomo? |
| 8 | Hora de brincar | Arraste os átomos e encoste um no outro para formar compostos. Clique duas vezes para separar. | Peça a alguém da turma que monte um composto e explique o que fez. |

*(Os elementos A, B e C da cena são exemplos genéricos, sem nome real, de propósito: representam a ideia de Dalton sem atribuir fórmulas modernas. Revisar com o professor.)*

---

## 2. Thomson — pudim de passas

| Item | Dado |
|---|---|
| Cientista | J. J. Thomson |
| Ano | 1897 (descoberta do elétron); modelo proposto por volta de 1904 |
| Nome do modelo | Pudim de passas |

**Texto curto (widget):**
> Thomson descobriu o elétron e mostrou que o átomo não é indivisível. Ele imaginou uma esfera positiva com elétrons negativos espalhados, como passas num pudim.

**Ideias principais:**
- Experimentos com raios catódicos revelaram partículas negativas muito leves (elétrons).
- O átomo é neutro: a carga positiva da esfera equilibra a negativa dos elétrons.

**Nota do professor:** "Se o átomo é neutro e tem elétrons negativos, onde está a carga positiva?"

**Por que mudou?** O átomo deixou de ser indivisível, mas faltava descobrir como a carga positiva realmente está distribuída.

**Limitação:** o experimento de Rutherford mostrou que a carga positiva não está espalhada pelo átomo todo.

**Animação:** tubo de raios catódicos com feixe desviado; elétrons incrustados numa esfera positiva.

---

## 3. Rutherford — modelo nuclear

| Item | Dado |
|---|---|
| Cientista | Ernest Rutherford |
| Ano | Experimento por volta de 1909 (com Geiger e Marsden); modelo proposto em 1911 |
| Nome do modelo | Modelo nuclear / planetário |

**Texto curto (widget):**
> Rutherford disparou partículas contra uma folha de ouro finíssima. A maioria atravessou, mas algumas desviaram. Conclusão: o átomo tem um núcleo minúsculo, denso e positivo, e é quase todo espaço vazio.

**Ideias principais:**
- A maioria das partículas alfa atravessou a folha: o átomo é, em grande parte, espaço vazio.
- Algumas desviaram e poucas voltaram: existe um centro muito pequeno, denso e positivo (o núcleo).
- Os elétrons ficam ao redor, longe do núcleo.

**Nota do professor:** "O que vocês acham que aconteceria com as partículas se o átomo fosse um pudim maciço?"

**Por que mudou?** O modelo de Thomson previa que as partículas atravessariam sem grandes desvios. Os desvios observados mostraram que há um núcleo.

**Limitação:** não explica por que os elétrons não perdem energia e caem no núcleo, nem as cores específicas da luz emitida pelos átomos.

**Animação:** canhão de partículas, folha de ouro, desvios, zoom no núcleo.

---

## 4. Bohr — camadas de energia

| Item | Dado |
|---|---|
| Cientista | Niels Bohr |
| Ano | 1913 |
| Nome do modelo | Modelo de Bohr / camadas eletrônicas |

**Texto curto (widget):**
> Bohr propôs que os elétrons ficam em camadas com energias definidas. Ao ganhar energia, o elétron salta para uma camada mais externa; ao voltar, devolve essa energia em forma de luz.

**Ideias principais:**
- Os elétrons só podem ocupar certos níveis de energia.
- Ao absorver energia, o elétron "salta" para um nível mais alto.
- Ao retornar, emite luz com uma cor que depende do salto.

**Conexão com o cotidiano:** a cor dos fogos de artifício e das luzes de neon está ligada a esses saltos. Cada elemento emite cores características.

**Nota do professor:** "Por que cada fogo de artifício tem uma cor diferente?"

**Por que mudou?** O modelo de Rutherford não explicava a estabilidade do átomo nem as cores emitidas.

**Limitação:** funciona bem para o hidrogênio, mas não explica átomos mais complexos nem o comportamento ondulatório dos elétrons.

**Animação:** camadas luminosas, saltos com flash, fótons coloridos.

---

## 5. Modelo atual — modelo quântico (orbitais)

| Item | Dado |
|---|---|
| Cientistas | Contribuições de de Broglie (1924), Schrödinger (1926) e Heisenberg (1927), entre outros |
| Ano | Meados da década de 1920 em diante |
| Nome do modelo | Modelo quântico / orbitais |

**Texto curto (widget):**
> No modelo atual, não dá para saber exatamente onde o elétron está. Só dá para calcular a região onde ele tem mais chance de ser encontrado: o orbital, uma nuvem de probabilidade.

**Ideias principais:**
- O elétron se comporta de forma ondulatória e não segue trajetória definida.
- Orbital é a região de maior probabilidade de encontrar o elétron.
- O princípio da incerteza (Heisenberg) limita o quanto podemos saber ao mesmo tempo sobre posição e movimento.

**Nota do professor:** "Quanto mais pontos aparecem, mais clara fica a nuvem: o que isso diz sobre onde o elétron fica?"

**Por que mudou?** O modelo de Bohr não dava conta de átomos com mais de um elétron nem do comportamento ondulatório da matéria.

**Animação:** pontos surgindo aos poucos, formando a nuvem; alternância entre "foto instantânea" e "longa exposição".

---

## 6. Fatos de apoio (escala e extras)

- O átomo é quase todo espaço vazio: o núcleo é cerca de 100 mil vezes menor que o átomo em diâmetro **[a revisar]**.
- Analogia sugerida: se o átomo fosse um estádio de futebol, o núcleo seria do tamanho de um grão pequeno no centro **[a revisar]**.
- O núcleo é formado por prótons e nêutrons (o nêutron foi descoberto em 1932, por Chadwick) **[a revisar]**.
- A cor da luz emitida depende da diferença de energia entre os níveis.

## 7. Imagens e créditos

Registrar aqui cada imagem usada. O nome do arquivo deve ser o **id do modelo** (`dalton`, `thomson`, `rutherford`, `bohr`, `quantum`); o site detecta sozinho. **Preferir domínio público ou licenças livres** (por exemplo, itens do Wikimedia Commons), conferindo a licença de cada arquivo.

| Modelo | Arquivo | Fonte (link) | Autor | Licença | Status |
|---|---|---|---|---|---|
| Dalton | `src/assets/photos/dalton.jpg` | | | | pendente |
| Thomson | `src/assets/photos/thomson.jpg` | | | | pendente |
| Rutherford | `src/assets/photos/rutherford.jpg` | | | | pendente |
| Bohr | `src/assets/photos/bohr.jpg` | | | | pendente |
| Modelo atual | `src/assets/photos/quantum.jpg` (foto de um dos cientistas do modelo) | | | | pendente |

## 8. Checklist de revisão com o professor

- [ ] Datas e nomes conferidos
- [ ] Textos curtos compreensíveis para o ensino médio
- [ ] Analogias adequadas
- [ ] Limitações de cada modelo corretas
- [ ] Nível de detalhe adequado ao programa da turma
