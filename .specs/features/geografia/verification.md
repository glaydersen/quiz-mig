# Evidência do autor

## T1 — Quiz e atividades
Gate inicial: `node tests/geografia.mjs` com Playwright disponível por PLAYWRIGHT_MODULE e Chrome local: 240 verificações passaram. `node tests/geografia-activities.mjs`: completou todos os jogos, múltipla seleção, texto, ordem, simulado com erro e retomada, teclado e laboratório. `git diff --check`: limpo.

| Requisito | Evidência e valor esperado |
|---|---|
|GEO-01|tests/geografia.mjs:37 rejeita vazio; :41 perfil Miguel; :49–52 reload; :95–97 Bia isolada/diário; :112 nome HTML como texto|
|GEO-02|tests/geografia.mjs:16–25 seis missões, 72 IDs distintos, 12 por missão, explicações e fontes; conferência humana em fontes.md, 28 fotos lidas; testes de layout visuais em geografia-activities.mjs:52|
|GEO-03|tests/geografia.mjs:69 `assert.deepEqual(grading,...)` conjunto exato/acentos/ordem; geografia-activities.mjs:15–30 verifica feedback real, 10 XP e correção por teclado|
|GEO-04|tests/geografia.mjs:48, :52, :57 10 XP, reload sem duplicação, erro sem perda; :110 `seal.complete && seal.xp1===seal.xp2`|
|GEO-05|tests/geografia.mjs:72–73 geometria de todas as grades; :80 palavra repetida não duplica; :87 rascunho restaurado; geografia-activities.mjs:35–46 todos os jogos completos e total exato 360 XP (30 das questões + 330 dos jogos)|
|GEO-06|tests/geografia.mjs:100 duas por missão; :105 sem explicações durante simulado; :108 12/12 com explicação; geografia-activities.mjs:49–50 erro oculto até conclusão e encaminhado à revisão; diário :97|
|GEO-07|tests/geografia.mjs:111 exclusão confirmada preserva Bia; :113 sem overflow 390/1280; :115–116 storage bloqueado/corrompido; :117 sem erros JS; geografia-activities.mjs:30 Enter envia ordem; inspeção visual dos PNGs desktop/mobile e cruzadinhas|
|GEO-08|Pendente T2, testes condicionais `CHECK_HOME=1` nas duas suites.|

Mapeamento reverso: asserções de corpus → GEO-02/05; correção → GEO-03; pontuação → GEO-04; perfis/rascunhos → GEO-01/06; jogos → GEO-05; simulado → GEO-06; robustez/UI → GEO-07; links → GEO-08. Não há testes sem requisito. Nenhuma asserção foi enfraquecida ou removida.

A inspeção visual encontrou o perfil muito estreito no cabeçalho móvel. Corrigido para ocupar sua própria linha. Botões das missões têm texto curto com nome acessível completo. Novo teste de atividades passou após os ajustes.

## T2 — Integração da home
`CHECK_HOME=1 node tests/geografia.mjs`: 249 verificações passaram. `CHECK_HOME=1 node tests/geografia-activities.mjs`: passou. `tests/geografia-activities.mjs:56` verifica exatamente seis cartões passados, abre o quiz pela seção atual e retorna pela marca; `tests/geografia.mjs:118` verifica existência de todos os HTML vinculados. `git diff --check`: limpo.
