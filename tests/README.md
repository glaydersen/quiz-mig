# Verificar o quiz de Geografia

O produto é um HTML independente, sem instalação. Os testes precisam de Node.js, Playwright e Google Chrome (um perfil temporário isolado é usado).

```sh
node tests/geografia.mjs
node tests/geografia-activities.mjs
CHECK_HOME=1 node tests/geografia.mjs
CHECK_HOME=1 node tests/geografia-activities.mjs
```

Se Playwright não estiver no node_modules local, defina `PLAYWRIGHT_MODULE` com o caminho de uma instalação existente. `BROWSER_CHANNEL` permite escolher outro canal compatível; padrão `chrome`. `QUIZ_ROOT` aponta uma cópia temporária para testes de mutação. Capturas de QA são gravadas em `/tmp/geografia-*.png` e não fazem parte do site.

O primeiro script cobre conteúdo, pontuação, perfis, persistência e correção. O segundo exercita controles de atividades, completa os seis jogos e testa o simulado com erros. CHECK_HOME habilita a integração com a página inicial. O relatório independente fica em `.specs/features/geografia/validation.md`.
