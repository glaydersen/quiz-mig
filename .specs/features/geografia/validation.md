# Validação independente — Expedição Geografia

Data: 2026-09-27. Verifier independente (autor ≠ verificador). Referência: `spec.md` e `fontes.md` desta pasta. Superfície: `3766ff8..61a2ad5`, HTML novo, home e dois scripts de testes. Implementação e testes reais não foram alterados pelo Verifier.

**Veredito inicial: FAIL — uma lacuna GEO-07 de recuperação de dados estruturalmente corrompidos.** Os dois gates passam; três mutações foram detectadas. Os demais fluxos e conteúdo examinados estão conformes.

## Etapas e gate

Não há `tasks.md`: as três etapas estão em `spec.md:24`, e os comandos em `tests/README.md:6`. T1 (quiz) e T2 (home) implementadas; T3 (verificação) executada, aguardando a correção abaixo.

Executados independentemente com Chrome headless isolado, `CHECK_HOME=1` e `PLAYWRIGHT_MODULE=/Users/glaydersen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`:

- `node tests/geografia.mjs`: **249 verificações passaram**, exit 0.
- `node tests/geografia-activities.mjs`: **suite passou**, exit 0; o script não publica contador de asserções.
- `git diff --check`: exit 0.
- Antes da feature: nenhum arquivo de teste no commit-base. Depois: dois scripts novos; nenhum teste removido, enfraquecido ou pulado.

## Critérios e evidências

As linhas abaixo referem-se à versão inicial revisada. Inspeção estática é identificada explicitamente; não se apresenta leitura de código como teste de navegador. O script adicional do Verifier em `/tmp/geografia-verifier-boundaries.mjs` é descartável, não faz parte do produto.

| Critério | Resultado esperado e evidência independente | Estado |
|---|---|---|
| GEO-01 — entrada/perfil | `tests/geografia.mjs:36` verifica vazio rejeitado; :39 nome Miguel; :51 restaura feedback; :94 XP de Bia = `'0'`; :95 diário de Bia = `''`; :96 `' miguel '` retoma XP `'40'`; :112 texto `<b>Ana</b>` sem elemento `b`. `/tmp/geografia-verifier-boundaries.mjs:8` rejeita 25 caracteres; :9 aceita exatamente 24. `quiz-geografia-2026.10.02.html:1454` verifica trim e limite e cria mapas separados por perfil. | PASS |
| GEO-02 — corpus e temas | `tests/geografia.mjs:15` seis missões; :17 total = 72; :18 IDs únicos = 72; :19 12 questões + conceitos + síntese por missão; :21 explicação >30 e páginas; :22 gabaritos de escolha pertencem às alternativas. Inspeção independente das 72 perguntas, respostas e explicações: temas pedidos presentes, completar e ordenar têm respostas coerentes e não vazias; não há enunciados literalmente duplicados. Conteúdo detalhado abaixo. | PASS |
| GEO-03 — correção e fluxo | `tests/geografia.mjs:44` vazio não avança; :47 explicação causal; :64 revisão volta a zero; :71 `deepEqual` exige multi incompleta/extra falsas, exata verdadeira, acentos equivalentes, ordem exata. `tests/geografia-activities.mjs:13` erro multi; :17 acerto real; :20 vazio em texto; :21 `'EROSAO'` aceita; :29 ordem completa; :30 Enter confere. Inspeção :1465–1471: resposta e explicação após conferência, botão separado para avançar. V/F existe em :134–152, representado como escolha única de duas opções. | PASS |
| GEO-04 — pontos/progresso/selos | `tests/geografia.mjs:48` primeiro acerto = `'10'`; :52 reload mantém `'10'`; :57 erro mantém `'10'`; :110 XP idempotente. `/tmp/geografia-verifier-boundaries.mjs:10` exige `{before:false,after:true,done:12,xp:120}` ao passar de 11 a 12 acertos. HTML :1440–1446 calcula prêmio por chave e acertos por questão; :1455 mostra questões /72 e jogos separados; :1487 explica que XP não é previsão de nota. | PASS |
| GEO-05 — jogos | `tests/geografia.mjs:25–26` 3×6 e 3×5; :74 cada caminho forma a palavra; :75 cinco entradas, letras compatíveis, interseção real; :78–82 caminho reverso, conceito e XP único; :85–89 correção parcial, rascunho restaurado e XP único. `tests/geografia-activities.mjs:32` dica não muda XP; :36 todos os caça-palavras 6/6; :42 cruzadinhas 5/5 sem conflitos; :46 XP total exato `'360'` (30 questões + 330 jogos). HTML :1480 marca início da dica; :1483 pinta letras; :1484 corrige e explica por palavra; :1438 normaliza acentos. | PASS |
| GEO-06 — simulado/diário | `tests/geografia.mjs:100` 12 questões, duas por missão; :105 sem explicação intermediária; :108 12/12 e explicação final; :97 diário persistente. `tests/geografia-activities.mjs:49–50` erro oculto, retomada após reload, resultado 0/1 e erro pendente. `/tmp/geografia-verifier-boundaries.mjs:13–15` botão bloqueado e tentativa de alterar/enviar de novo preserva primeira resposta errada e resultado 0/1. HTML :1474 oferece novo simulado e explica substituição da rodada; :1485 critérios de conversa com adulto e ausência de correção/XP automáticos. | PASS |
| GEO-07 — indisponibilidade/exclusão/acessibilidade | `tests/geografia.mjs:115` storage bloqueado: aviso e perfil funcional; :116 JSON inválido: aviso e raw preservado; :111 duas etapas para exclusão e Bia preservada; :113 larguras 390/1280 sem overflow. `tests/geografia-activities.mjs:30` teclado; :37, :43, :52 larguras móveis nos jogos e questões ricas. HTML :9 foco visível, :12 animação somente sem preferência de redução, :1465 live feedback e :1482 labels de pistas; :1487 guia completo. Sem arrastar/áudio obrigatório. Porém corrupção estrutural da sessão não é rejeitada, reproduzida abaixo. | **FAIL parcial** |
| GEO-08 — home/offline | `tests/geografia.mjs:118` link do quiz e arquivos de todos os links existem; `tests/geografia-activities.mjs:56` exatamente seis cartões antigos, entrada pela seção atual e retorno à home; `tests/geografia.mjs:27` sem script/link remoto. Inspeção dos dois HTML: SVG/CSS/JS/dados embutidos, sem fetch, fontes remotas ou imagens externas. | PASS |

Sem lacuna de precisão da especificação que impeça julgar os comportamentos. A duração de 15–20 minutos é uma sugestão editorial, não uma medição prometida.

## Conteúdo geográfico e UX

Leitura independente de todo o banco de 72 questões, conceitos e explicações. A correspondência ampla foi conferida contra o mapa de fontes. Conferência direta por amostragem das imagens originais: `IMG_8507.jpg` (p.89, cadeia do iogurte), `IMG_8517.jpg` (p.100, mata ciliar, assoreamento, reúso e petróleo) e `IMG_8520.jpg` (p.103, percentuais e hidrelétricas). Não se afirma releitura independente das 28 fotos.

- Cadeia do iogurte em HTML :386–396 é simplificada, incluindo explicitamente na explicação o transporte do leite anterior à indústria; coincide com a p.89.
- Gráfico :1462 reproduz 82,8%, 10,6%, 6,7%, indica ANA 2013 e caráter histórico. Ordenação :948 concorda com a p.103; a pequena diferença para 100% é explicada.
- Hidrelétricas :835–854 e :917–925 explicam geração e alagamento/deslocamento, sem repetir a generalização de ausência absoluta de poluentes do livro.
- Mata ciliar/assoreamento :962–971 e :983–1003 correspondem à p.100. Reúso :1022–1029 e cisterna :971, :1009–1013 distinguem rega/limpeza de água para beber.
- Vegetação reduz risco, sem garantir segurança absoluta (:551); não culpa moradores por deslizamentos. Coleta e reciclagem são diferenciadas (:625–645).

Sem erro geográfico material identificado. O exercício de ordenar observação de imagem antiga/recente é uma sequência didática possível, não uma lei geográfica; aceitável no contexto da atividade.

Inspeção da captura móvel `/tmp/geografia-mobile-final.png`: texto e cartões legíveis, perfil separado e navegação clara; espaçamento generoso produz rolagem longa aceitável para seis missões. A inspeção visual adicional do autor é complementar. Não houve UAT com criança ou validação por leitor de tela; a revisão não implica certificação integral de acessibilidade.

## Sensor de discriminação

Três cópias independentes em `/tmp/geografia-verifier-{xp,multi,sim}`; arquivos reais intocados. Cada mutação foi executada com `QUIZ_ROOT` e `node tests/geografia.mjs`.

| Mutação comportamental | Linha original | Resultado |
|---|---|---|
| XP por prêmio alterado de 10 para 20 | HTML :1440 | **Morta**: exit 1, `tests/geografia.mjs:48`, “Primeiro acerto vale 10 XP”. |
| Multi aceita qualquer alternativa correta, permitindo subconjunto/superset | HTML :1447 | **Morta**: exit 1, `tests/geografia.mjs:71`, `multiMissing` e `multiExtra` deveriam ser false. |
| Remove ocultação de feedback no simulado | HTML :1467 | **Morta**: exit 1, `tests/geografia.mjs:105`, “Sem explicação durante simulado”. |

Profundidade leve proporcional: **3 injetadas, 3 mortas, 0 sobreviventes**.

## Lacuna e tarefa de correção

### P2 / Major funcional em condição de erro — sessão persistida inválida

**GEO-07.** O carregador em HTML :1434 verifica apenas a existência truthy de alguns mapas e ignora a forma da sessão. JSON sintaticamente válido com sessão inválida é aceito como progresso legítimo. O botão “Continuar rodada” então lança exceção em :1465 (`Cannot read properties of undefined (reading 'id')`), sem aviso de armazenamento indisponível. Isso viola o fallback prometido para dados corrompidos. O uso normal permanece funcional; não é um bloqueio universal do quiz.

Reprodução independente, em contexto temporário novo, colocar a chave `miguel-geografia-v1` com:

```json
{"version":1,"active":"a","profiles":[{"id":"a","name":"Ana","answers":{},"awards":{},"drafts":{},"crossDrafts":{},"session":{"ids":["missing"],"index":0,"title":"rodada"}}]}
```

Abrir arquivo e clicar “Continuar rodada”. `/tmp/geografia-verifier-boundaries.mjs:18–22` registrou `errors:["Cannot read properties of undefined (reading 'id')"]` e `notice:false`. Gate existente cobre apenas JSON não parseável, portanto passa mesmo com essa falha.

**Correção concreta:** validar mapas e invariantes mínimos da sessão antes de atribuir o estado carregado (IDs existentes, índice válido, objetos de respostas/valores/opções esperados). Se inválido, usar estado temporário seguro, exibir aviso e manter raw original intacto. Não é necessário um framework de schema. Acrescentar regressão de JSON válido com sessão inválida e, idealmente, mapa de respostas de tipo errado.

**Verificar:** abrir payload acima sem erro JS, aviso visível, iniciar perfil temporário e responder normalmente; confirmar `localStorage.getItem(KEY) === raw` mesmo após jogar. Reexecutar ambos os gates. Critério concluído quando corrupção estrutural tem o mesmo fallback da corrupção sintática.

## Qualidade e rastreabilidade

| Princípio | Veredito |
|---|---|
| Escopo proporcional e mudanças cirúrgicas | PASS — HTML autônomo, home e testes diretamente ligados ao pedido; seis arquivos de quizzes antigos intactos. |
| Abstração/flexibilidade mínima | PASS — funções diretas e dados embutidos; sem framework/dependência no produto. |
| Padrões locais | PASS — segue o produto em HTML autônomo. Nenhum AGENTS.md/guideline adicional encontrado na superfície; padrões fortes aplicados. |
| Integridade dos testes e vínculo com AC | PASS — todos os grupos de testes mapeiam GEO-01…08; laboratório verifica conceitos e UX do pedido. |
| Resultado preciso, não apenas existência de asserção | PASS nos fluxos cobertos; lacuna de corrupção acima explicitada. |
| Cobertura de erro da persistência | FAIL — corrupção estrutural não exercitada no gate e implementação quebra. |

Rastreabilidade: GEO-01/02/03/04/05/06/08 verificados; GEO-07 necessita correção. Não modifiquei `spec.md`, conforme limite de escrita do Verifier.

## Lições

Há sinal `ac_gap` em GEO-07. `scripts/lessons.py` não existe neste repositório; nenhuma contabilidade manual de lessons foi criada, pois esta delegação autoriza apenas este relatório. Lição candidata fundamentada para o autor registrar se o script for disponibilizado: **“Valide a estrutura e as referências do estado persistido antes de usá-lo, e teste corrupção sintática e estrutural preservando os dados originais.”** Fonte: GEO-07 / HTML :1434.
