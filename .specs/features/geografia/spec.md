# Expedição Geografia — especificação

HTML autônomo para alunos do 3º ano, 9 anos, preparando a prova de 2/10 indicada no comunicado. Todas as 28 fotos foram lidas (27 páginas + comunicado). Conteúdo original baseado nos conceitos do livro, sem usar manuscritos como gabarito.

## Decisões
- Confirmado pelo usuário: todas as páginas; perfis locais por nome/apelido; rodadas de 15–20 minutos.
- Padrões adotados: sem cronômetro; sem cadastro/rede; seis missões de 12 questões; pode parar e continuar; revisão sem penalidades. Tempo é sugestão, nunca obrigação.
- Um HTML com CSS, JavaScript, dados e desenhos SVG embutidos. Sem dependências externas no produto.
- Fora de escopo: sincronização, professor remoto, notas oficiais, reprodução integral das fotos, correção automática de textos livres.

## Critérios de aceitação
- GEO-01: Ao abrir sem perfil, pedir nome/apelido (1–24 caracteres após trim); rejeitar vazio. Reabrir nome existente ignorando caixa/espaços externos. Nomes aparecem como texto, nunca HTML. Dois perfis mantêm respostas e jogos separados. Reload retoma perfil e rodada salvos.
- GEO-02: Oferecer seis missões, cada uma com conceitos, 12 perguntas e síntese oral/escrita. Total 72 perguntas únicas; todas com resposta válida, explicação e páginas. Cobrir paisagens/mapas, atividades/trabalho/cadeia do iogurte, solo/impermeabilização/erosão/deslizamentos, lixo/agrotóxicos/queimadas, usos da água/irrigação/hidrelétrica/gráfico, mata ciliar/assoreamento/reúso/poluição.
- GEO-03: Incluir escolha única, verdadeiro/falso, seleção múltipla, completar e ordenar. Conferir explicitamente; resposta vazia não avança. Seleção múltipla exige conjunto exato; textos aceitam caixa e acentos equivalentes; ordem exige sequência exata. Feedback mostra resposta e porquê após tentativa; continuar é ação separada. Erro entra na revisão; acerto posterior o retira.
- GEO-04: Cada questão acertada dá 10 XP uma única vez; erros não subtraem; completar uma missão (12 questões já acertadas) concede seu selo. Repetir/recarregar não duplica XP. XP indica descobertas e não nota prevista. Progresso: questões já acertadas / 72, jogos mostrados separadamente.
- GEO-05: Três caça-palavras com seis termos cada, selecionados pela primeira e última letra, inclusive caminho reverso; toda palavra encontra-se na grade. Encontrar exibe conceito e concede 10 XP uma vez. Dica destaca início, sem dar XP. Três cruzadinhas com cinco palavras cada, interseções reais e letras compatíveis. Entrada por pista preenche grade, preserva rascunho; correção de cada palavra mostra explicação e dá 10 XP uma vez. Acentos não obrigatórios nos jogos.
- GEO-06: Simulado de 12 questões, duas de cada missão, sem correção até finalizar; permitir recomeçar ou retomar rodada. Resultado conta a primeira resposta e apresenta explicações; encaminha erros à revisão. Não inventar nota escolar. Diário livre salva por perfil e apresenta critérios para revisão com adulto, sem marcar automaticamente certo.
- GEO-07: Guia da família explica fontes, ritmo, armazenamento e pontuação. Se armazenamento estiver indisponível/corrompido, continuar na sessão com aviso explícito (não sobrescrever conteúdo corrompido). Excluir apenas perfil selecionado com confirmação em duas etapas. Não exigir áudio/arrastar. Navegação por teclado, foco visível, labels, live feedback, movimento reduzido; telas 390 e 1280 px sem overflow da página.
- GEO-08: Home exibe link funcional para novo quiz em seção atual/próxima, mantendo os seis links antigos nos passados. Quiz tem volta à home. Produto funciona sem recursos externos.

## Etapas atômicas
1. Criar quiz, conteúdo, especificação e testes; verificar conteúdo e fluxos completos no navegador; commit feat(geografia).
2. Integrar home e validar links, desktop/celular e testes; commit feat(home).
3. Verificação independente da skill, correção de falhas se necessárias.

## Dimensões aplicáveis
Entrada: limite do nome e escape; estado: rodada/rascunhos, idempotência XP e revisão; persistência: erro e perfil isolado; exclusão: duas etapas. Concorrência: uma aba ativa de estudo por vez, sem mesclar edições simultâneas (guia). Auth, rede, pagamentos, telemetria e rate limits N/A: produto local sem servidor.
