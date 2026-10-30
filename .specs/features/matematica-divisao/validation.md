# Missão Divisão — independent validation

Date: 2026-10-30. Verifier: independent sub-agent, not implementation author. Final diff: `124f4b8..cf00bc0` (one fix/reverify iteration). Scope: new quiz, its four suites, home integration. No implementation or repository test files modified by verifier.

## Verdict

**PASS:** all six ACs verified after fixing completed-response persistence. All four feature suites pass; three behavior mutations were killed. No mathematical error found in the 48 authored problems. UAT with Miguel/user was **not performed**.

## Spec-anchored outcome evidence

| Criterion | Expected outcome and assertion evidence | Result |
|---|---|---|
| AC1 | `tests/matematica.mjs:11–14`: `assert.equal(data.questions.length,48)`, missions=6, eight per mission, quick=12, six unique missions, pages 230–249. `tests/matematica-complete.mjs:6,15,19`: independently calculated answer key, `/Boa descoberta/` for every problem and `/8 de 8/` in each track. Verifier independently read all question statements/answers; all six required topic families present. | PASS |
| AC2 | `tests/matematica.mjs:45–47`: every authored valid response accepted, blank/bad/partial responses rejected, alternate valid creation `['90','15']` accepted. `tests/matematica-complete.mjs:22`: saved authored text returns and `/não recebe correção automática/`. `tests/matematica-edge.mjs:6–8`: explicit negative, blank, missing, extra, partial and decimal inputs rejected; zero remainder accepted; creation boundaries rejected. | PASS |
| AC3 | `tests/matematica.mjs:28–37`: correct feedback, one star even after repeat, wrong answer enters review, retry gives `/1 de 1/`, pending review button disappears. `tests/matematica-complete.mjs:15–21`: manual next after each answer, per-round 8/8, total 48 stars. Explanation/hint presence checked at `matematica.mjs:14`; implementation `quiz-matematica-2026.10.30.html:889` uses `!!old?.mastered||t.correct` so mistakes cannot remove mastery. Supplemental script line 8 asserts original question remains after checking. | PASS |
| AC4 | `tests/matematica.mjs:27,29,38–39,52`: draft/reason resume, checked-state resume, separate player starts at zero, case-insensitive return restores two stars, corrupted raw records unchanged. `tests/matematica-complete.mjs:7,26`: literal HTML-like name, no injected b element, storage-denied message with playable question. `tests/matematica-edge.mjs:4,10–11`: whitespace-only name rejected, maxlength=24, after Next+reload `assert.deepEqual(stored.profiles[0].answers.q1,{mastered:true,lastCorrect:true,reason:'23 menos 20 sobra 3',values:['4','3']})`, index=1, corrupt session preserved. | PASS (fixed) |
| AC5 | `tests/matematica.mjs:40,43`: workshop 73÷3→24 remainder1 and 744÷6→124 remainder0; crossword completed with independently checked rows 838/505/600 and columns 856/300/850. `tests/matematica-complete.mjs:22`: problem-authoring model and explicit nonautomatic assessment. Supplemental script line 7 asserts 10-unit/10-ten exchanges and correct count of group boxes. Screenshot confirms positional explanation and long division. | PASS |
| AC6 | `tests/matematica-complete.mjs:13–15`: radios selected via keyboard Space, every problem has no horizontal overflow at 375px. `tests/matematica-home.mjs:4–6`: current math link/title/date, seven unique archived destinations including geography, all HTML targets linked/exist. Supplemental script lines 7–9: workshop no overflow, feedback `role=status`, no HTTP requests; name submitted with Enter. Source inspection: native controls/labels, visible focus styling, no external imports/assets. | PASS |

Supplemental assertions were run read-only from `/tmp/matematica-independent.mjs`; they are reproducibility evidence for this review, not committed regression coverage. Keyboard evidence covers representative native paths; this is not exhaustive assistive-technology certification.

## Gates and test integrity

No tasks.md was created: spec explicitly waives design/tasks in favor of three direct deliveries. Gates recorded in verification.md and the final spec gate section were rerun:

- `node tests/matematica.mjs`: PASS.
- `node tests/matematica-complete.mjs`: PASS, all 48 questions solved through browser UI.
- `node tests/matematica-home.mjs`: PASS.
- `node tests/matematica-edge.mjs`: PASS.
- `node /tmp/matematica-independent.mjs`: PASS supplementary assertions, with completed-answer diagnostic exposing AC4 gap.

Four feature test programs passed, zero failed, zero skipped; these scripts do not publish individual case counts. Before feature: three geography .mjs suites. After: seven .mjs suites, net +4; no existing test changed or removed. Historical optional geography CHECK_HOME snapshot intentionally not run against the new home; current home has its own replacement feature gate. No claim that legacy suites were independently rerun.

## Discrimination sensor

Temporary copies only in `/tmp/miguel-verify-grade` and `/tmp/miguel-verify-stars`, selected by `QUIZ_ROOT`; real tree untouched. Third copy `/tmp/miguel-verify-values` used for fix regression.

| Mutation | Location | Result |
|---|---|---|
| Numeric answers always accepted (`return true`) | quiz line 849 | KILLED: matematica.mjs:35 expected wrong-answer `/Vamos entender/`, received success. |
| Never mark mastery (`mastered:false`) | quiz line 889 | KILLED: matematica.mjs:28 expected one star, received zero. |

| Remove `values:[...t.values]` from completed answer save | quiz line 889 | KILLED: matematica-edge.mjs:10 deep equality detects missing values after Next+reload. |

Lightweight sensor: 3 injected, 3 killed, 0 survived. First two ran against initial implementation; third against final fixed implementation.

## Quality, pedagogy, and precision limits

Surgical diff, autonomous offline HTML consistent with repository style, no unrelated edits or unnecessary framework/abstraction. All new tests map to AC1–6; no unclaimed suite. No AGENTS.md or additional project-wide testing guideline was found. Strong defaults and the skill coding-principles reference applied.

All 48 question calculations/options checked independently; estimation instructions explicitly specify approximation; remainders, units, positional regrouping and inverse verification are appropriate. Crossword arithmetic matches both axes. The free writing activity explicitly leaves assessment to comparison/self-review. Map mobile and workshop screenshots inspected: readable, unclipped, clear hierarchy.

Precision limits: 15–20 minutes is an estimate, not a timed or empirically validated learning outcome. “Alegre” and age suitability involve judgment; visual review supports them but user UAT was not performed. Actual screen-reader announcements were not measured; semantic status roles and focus changes were inspected/tested. Book-photo mapping was provided in spec and upstream source review; this verifier checked arithmetic/content rather than rereading original photographs.

## Resolved fix

P2 / AC4 (resolved in cf00bc0): preserve each submitted response's entered values in its answer record and validate persisted data. Location: quiz line 889 (record write), lines 857 and 893 (validation/next). Add assertion that values remain after advancing and reload, including wrong answers and alternatives. Preserve backwards compatibility or explicitly validate the supported record form. Do not alter existing assertions. Re-run three gates and this persistence regression.

Fix evidence: record saves a copy of submitted values, validState checks the value array and consistency with lastCorrect. New edge suite and mutation demonstrate the regression is caught. This is the first release of this math storage format; development records lacking values are preserved as invalid, never overwritten.

Task status: all three deliveries complete. Traceability: AC1–6 verified; no unresolved ranked gaps. Spec itself not edited (verifier authorized report-only changes).

Lessons signal: one resolved persistence gap. A project-local lesson is warranted: “Assert saved submitted values after advancing, not only draft restoration or mastery totals.” Orchestrator recorded this lesson in `.specs/features/matematica-divisao/lessons.md` (no lessons script available).
