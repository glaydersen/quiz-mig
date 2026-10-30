# Verificação do autor

## Etapa 1 — quiz
Gates: `node tests/matematica.mjs` e `node tests/matematica-complete.mjs`. Ambos passaram; 48 problemas resolvidos pela interface com gabarito independente. Nenhum teste anterior editado. Capturas inspecionadas em 375px e 1360px, oficina e mapa. Correção durante gate: removido botão duplicado de voltar no resultado; melhorado registro posicional e concordância da oficina.

| Critério | Evidência e assertiva | Resultado especificado |
|---|---|---|
| AC1 | tests/matematica.mjs:11–14 `assert.equal(data.questions.length,48)`, `assert.equal(new Set(...).size,6)` | 48 questões, seis trilhas, revisão com 12 e seis assuntos |
| AC2 | tests/matematica.mjs:46 `assert.equal(g.ok,true)`, `assert.equal(g.blank,false)`, `assert.equal(g.partial,false)`; :47 criação alternativa | Correção matemática e rejeição de entradas inválidas |
| AC2 texto | tests/matematica-complete.mjs:22 `assert.match(...,/não recebe correção automática/)` | Modelo e limite da avaliação de texto explicitados |
| AC3 | tests/matematica.mjs:28,34,36–37 `assert.match(...,/1 estrela/)`, `assert.match(...,/1 de 1/)`, `assert.equal(...count(),0)` | Estrela única, erro revisto, resultado e remoção de pendência |
| AC4 | tests/matematica.mjs:27,29,38–39,52 `assert.equal(...inputValue(),'4')`, estrelas 0/2, `assert.equal(...getItem(KEY),bad)` | Retomada, perfis separados e preservação de dados inválidos |
| AC4 nomes/armazenamento | tests/matematica-complete.mjs:7,26 `assert.equal(...locator('#profile b').count(),0)`, `assert.match(...,/não permitiu salvar/)` | Escape e uso sem persistência |
| AC5 | tests/matematica.mjs:40,43 `assert.match(...,/124.*resto 0/s)`, `assert.match(...,/seis contas/)` | Oficina e cruzados corretos |
| AC6 | tests/matematica-complete.mjs:13–15 teclado e `assert.equal(...scrollWidth<=innerWidth,true)` | Todas as perguntas funcionam em 375px |

## Mapeamento reverso
| Testes | Requisito | Manter |
|---|---|---|
| matematica.mjs:11–17 | AC1 conteúdo | Sim |
| matematica.mjs:21–39 | AC2–4 entrada, correção, progresso | Sim |
| matematica.mjs:40–43 | AC5 oficinas | Sim |
| matematica.mjs:45–47 | AC2 grade | Sim |
| matematica.mjs:48–54 | AC4/6 mobile e corrupção | Sim |
| matematica-complete.mjs:7 | AC4 nome como texto | Sim |
| matematica-complete.mjs:9–21 | AC1–3/6 gabarito independente, rodadas, estrelas, teclado/mobile | Sim |
| matematica-complete.mjs:22 | AC2/4/5 autoria e modelo | Sim |
| matematica-complete.mjs:26–27 | AC4 indisponibilidade de armazenamento | Sim |

Adequação: testes ligados ao escopo; sem mocks de resultados nem testes antigos removidos. O teste de gabarito independente complementa o teste unitário que usa o banco. Sem diretrizes de testes locais adicionais. Revisão humana da pedagogia e do visual é complementar aos testes; não houve UAT com o usuário.

## Etapa 2 — home
Gate `node tests/matematica-home.mjs`: PASS. AC6: tests/matematica-home.mjs:5 `assert.match(current,/href="quiz-matematica-2026.10.30.html"/)`; :6 `assert.equal(archived.length,7)` e `assert.ok(archived.includes('quiz-geografia-2026.10.02.html'))`; :7 testa todos os HTML locais. Mapeamento reverso: todas as assertivas deste arquivo correspondem à integração da home em AC6. Os testes históricos de Geografia permanecem intactos; CHECK_HOME de geografia.mjs é uma fotografia da entrega anterior, portanto a home atual é verificada pela suíte de Matemática.
