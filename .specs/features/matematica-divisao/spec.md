# Missão Divisão — 30/10/2026

## Objetivo e decisões
Revisão para Miguel, 9 anos, 3º ano, prova hoje. HTML autônomo e offline, em português, alegre, com perguntas abertas e fechadas e problemas contextualizados. Perfis locais por nome e rodadas de aproximadamente 15–20 minutos, sem cronômetro obrigatório. Fotos são fontes; respostas manuscritas não são gabarito. JPGs de espanhol excluídos. Não incluir fotos no produto.

## Critérios de aceitação
- AC1: 48 desafios em seis trilhas de oito; cobrir exata/resto, algoritmo/reagrupamento, partes/medidas, cálculo mental/estimativa, problemas multietapas e leitura de dados. Referenciar páginas e oferecer revisão inicial de 12 itens cobrindo as seis trilhas.
- AC2: Questões de alternativas e respostas numéricas abertas (incluindo quociente/resto e vários campos). Não aceitar vazio como zero, números negativos, texto parcial ou campos faltantes. Criar divisão admite diferentes respostas matematicamente válidas. Explicações escritas são guardadas e comparadas com modelo, sem simular correção automática de texto livre.
- AC3: Toda resposta recebe explicação, dica opcional e verificação; não avançar automaticamente. Erros entram na revisão; acerto posterior remove pendência. Cada desafio dominado vale uma estrela uma única vez; sem perda de estrelas. Resultado da rodada mostra acertos daquela rodada.
- AC4: Nome obrigatório até 24 caracteres; perfis separados, nome tratado como texto, mesmo nome sem distinção de caixa retoma perfil. Salvar respostas, estrelas, raciocínio e sessão/rascunho; recarregar retoma. Dados inválidos ou armazenamento indisponível não impedem uso e não sobrescrevem dados inválidos.
- AC5: Oficina visual mostra grupos/resto e conta armada explicada com valor posicional; pelo menos exemplos 73÷3 e 744÷6. Números cruzados 3×3 com pistas horizontais e verticais verificáveis; atividade de criação de problema com modelo e autoavaliação explícita.
- AC6: Controles acessíveis por teclado, campos com rótulos, feedback anunciado, sem rolagem horizontal em 375px; sem dependências de rede. Home destaca matemática e mantém links de todos os sete quizzes anteriores (geografia no arquivo).

## Fontes verificadas visualmente
IMG_8671–8690 correspondem, na ordem, às páginas 230–249.
230–232: divisões exatas/não exatas, grupos e repartição, inversa e criação de problemas.
233–237: algoritmo usual, material dourado, dezenas/unidades/centenas e trocas, 2–3 algarismos, subtração/adição antes de dividir.
238–239: metade, terça/quarta/quinta/décima parte, dinheiro, dúzias, metro, calendário e tempo.
240: jogo de identificar divisões exatas.
241–242: compreender/planejar/executar/verificar/responder, dinheiro, várias operações, padrão 1:3 e intervalos entre postes.
243–244: cálculo mental com zeros, arredondamento e estimativa nas quatro operações.
245: sequências de operações e redução das medidas de figuras.
246: subtrações sucessivas, divisor de dois algarismos, preço unitário e criação de divisões.
247: distribuição de notas, proporcionalidade simples e conversão hora/minuto.
248–249: resto interpretado no álbum, flores, números cruzados, gráfico de seis partes e conferência de nota fiscal.

## Execução (design/tasks dispensados: três entregas diretas)
1. Quiz autônomo → quiz-matematica-2026.10.30.html, tests/matematica*.mjs e este registro → verificar conteúdo, respostas, navegação e persistência → feat(matematica): add division study adventure
2. Destaque na home → index.html, tests/matematica-home.mjs → verificar oito destinos locais únicos e arquivo com sete → feat(home): feature division exam review
3. Verificação independente exigida pela skill → validation.md e STATE.md → cobertura, sensor em cópia temporária e relatório → docs(matematica): record independent verification

## Limites
Duração é estimativa, varia por criança. Reflexão livre usa comparação com exemplo, não avaliação semântica. Progresso fica somente no navegador. Estimativas indicam explicitamente qual arredondamento usar para evitar múltiplos gabaritos implícitos.
