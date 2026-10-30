import {readFileSync,existsSync,readdirSync} from 'node:fs';import {resolve} from 'node:path';import assert from 'node:assert/strict';
const root=process.env.QUIZ_ROOT||process.cwd(),home=readFileSync(resolve(root,'index.html'),'utf8');
const current=home.split('<section id="proximos"')[1].split('</section>')[0];const archive=home.split('<section id="passados"')[1].split('</section>')[0];
assert.match(current,/href="quiz-matematica-2026.10.30.html"/);assert.match(current,/Missão Divisão/);assert.match(current,/30\/10/);
const archived=[...archive.matchAll(/href="([^"]+\.html)"/g)].map(m=>m[1]);assert.equal(archived.length,7);assert.equal(new Set(archived).size,7);assert.ok(archived.includes('quiz-geografia-2026.10.02.html'));assert.match(archive,/7 quizzes para revisitar/);
for(const f of readdirSync(root).filter(f=>f.endsWith('.html')&&f!=='index.html')){assert.ok(home.includes('href="'+f+'"'),f);assert.ok(existsSync(resolve(root,f)))}
console.log('PASS: current math quiz, seven archived quizzes, every HTML linked and all destinations exist.');
