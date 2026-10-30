import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
const require=createRequire(process.env.PLAYWRIGHT_MODULE||'/Users/glaydersen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const root=process.env.QUIZ_ROOT||process.cwd();
const file=resolve(root,'quiz-matematica-2026.10.30.html');
const html=readFileSync(file,'utf8');
const data=JSON.parse(html.match(/<script id="math-content" type="application\/json">([\s\S]*?)<\/script>/)[1]);
assert.equal(data.missions.length,6); assert.equal(data.questions.length,48);
for(const m of data.missions)assert.equal(data.questions.filter(q=>q.mission===m.id).length,8);
assert.equal(data.quick.length,12); assert.equal(new Set(data.quick.map(id=>data.questions.find(q=>q.id===id).mission)).size,6);
for(const q of data.questions){assert.ok(q.explain.length>35);assert.ok(q.hint.length>15);assert.ok(q.page>=230&&q.page<=249)}
// Independent examples across all six topic families; values derived from the source-informed spec.
const expected={q1:[4,3],q2:[6],q9:[24,1],q10:[124,0],q17:[38],q18:[32],q25:[70],q26:[900],q33:[28],q34:[16],q41:[12,5,13],q42:[68,204]};
for(const [id,answer] of Object.entries(expected))assert.deepEqual(data.questions.find(q=>q.id===id).answers,answer);
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const page=await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('file://'+file);
await page.getByLabel('Seu nome ou apelido').fill('Miguel');await page.getByRole('button',{name:'Vamos nessa!'}).click();
await page.getByRole('button',{name:'Começar revisão de hoje'}).click();
assert.match(await page.locator('h1').innerText(),/limões/);
await page.getByRole('button',{name:'Conferir resposta'}).click();assert.match(await page.locator('#feedback').innerText(),/Preencha/);
await page.getByLabel('Saquinhos completos').fill('4');await page.getByLabel('Limões que sobram').fill('3');
await page.getByLabel('Como você pensou?').fill('Fiz 4 vezes 5 e sobraram 3.');
await page.reload();assert.equal(await page.getByLabel('Saquinhos completos').inputValue(),'4');assert.match(await page.getByLabel('Como você pensou?').inputValue(),/sobraram/);
await page.getByRole('button',{name:'Conferir resposta'}).click();assert.match(await page.locator('#feedback').innerText(),/Boa descoberta/);assert.match(await page.locator('#profile').innerText(),/1 estrela/);
await page.reload();assert.equal(await page.getByRole('button',{name:'Próximo desafio'}).count(),1);
await page.getByRole('button',{name:'Próximo desafio'}).click();
await page.getByRole('button',{name:'Voltar ao mapa'}).click();
await page.getByRole('button',{name:'Treinar Repartir e agrupar'}).click();
await page.getByRole('button',{name:'Iniciar trilha'}).click();
await page.getByLabel('Saquinhos completos').fill('4');await page.getByLabel('Limões que sobram').fill('3');await page.getByRole('button',{name:'Conferir resposta'}).click();assert.match(await page.locator('#profile').innerText(),/1 estrela/);
await page.getByRole('button',{name:'Próximo desafio'}).click();await page.getByLabel('Caixas cheias').fill('5');await page.getByRole('button',{name:'Conferir resposta'}).click();assert.match(await page.locator('#feedback').innerText(),/Vamos entender/);
await page.getByRole('button',{name:'Voltar ao mapa'}).click();await page.getByRole('button',{name:/Rever 1 desafio/}).click();await page.getByLabel('Caixas cheias').fill('6');await page.getByRole('button',{name:'Conferir resposta'}).click();await page.getByRole('button',{name:'Ver resultado'}).click();assert.match(await page.locator('main').innerText(),/1 de 1/);
await page.getByRole('button',{name:'Voltar ao mapa'}).click();assert.equal(await page.getByRole('button',{name:/Rever 1 desafio/}).count(),0);
await page.getByRole('button',{name:'Trocar jogador'}).click();await page.getByLabel('Seu nome ou apelido').fill('Ana');await page.getByRole('button',{name:'Vamos nessa!'}).click();assert.match(await page.locator('#profile').innerText(),/0 estrelas/);
await page.getByRole('button',{name:'Trocar jogador'}).click();await page.getByLabel('Seu nome ou apelido').fill('mIgUeL');await page.getByRole('button',{name:'Vamos nessa!'}).click();assert.match(await page.locator('#profile').innerText(),/2 estrelas/);
await page.getByRole('button',{name:'Abrir oficina da divisão'}).click();await page.getByLabel('Conta para explorar').selectOption('73,3');assert.match(await page.locator('#workshop').innerText(),/24.*resto 1/s);await page.getByLabel('Conta para explorar').selectOption('744,6');assert.match(await page.locator('#workshop').innerText(),/124.*resto 0/s);
await page.getByRole('button',{name:'Voltar ao mapa'}).click();await page.getByRole('button',{name:'Jogar números cruzados'}).click();
for(let i=0;i<9;i++)await page.getByLabel(`Linha ${Math.floor(i/3)+1}, coluna ${i%3+1}`).fill('838505600'[i]);
await page.getByRole('button',{name:'Conferir cruzados'}).click();assert.match(await page.locator('#feedback').innerText(),/seis contas/);
// Grade every authored question with its valid answer, and reject blanks, partial parses and wrong values.
const grades=await page.evaluate(()=>DATA.questions.map(q=>({id:q.id,ok:grade(q,q.type==='create'?['84','14']:q.type==='choice'?[String(q.correct)]:q.answers.map(String)),blank:grade(q,[]),bad:grade(q,['999999','999999','999999']),partial:grade(q,['4abc','3'])})));
for(const g of grades){assert.equal(g.ok,true,g.id);assert.equal(g.blank,false,g.id);assert.equal(g.bad,false,g.id);assert.equal(g.partial,false,g.id)}
assert.equal(await page.evaluate(()=>grade(DATA.questions.find(q=>q.type==='create'),['90','15'])),true);
await page.setViewportSize({width:375,height:812});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
await page.screenshot({path:'/tmp/miguel-math/mobile.png',fullPage:true});
// Corrupt records must be preserved, with usable fallback instead of crashing.
for(const bad of ['{','{"profiles":null}','{"version":1,"active":"bad","profiles":[{"id":"bad","name":"X","answers":null}]}']){
 await page.evaluate(value=>localStorage.setItem('miguel-matematica-v1',value),bad);await page.reload();assert.match(await page.locator('#notice').innerText(),/salvos/);await page.getByLabel('Seu nome ou apelido').fill('Teste');await page.getByRole('button',{name:'Vamos nessa!'}).click();assert.equal(await page.evaluate(()=>localStorage.getItem('miguel-matematica-v1')),bad);
}
assert.deepEqual(errors,[]);await browser.close();console.log('PASS: content, grading of 48 questions, profiles, resume, feedback, review, workshop, crossword, mobile and corrupted storage.');
