import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=process.env.QUIZ_ROOT || process.cwd();
const file=path.join(root,'quiz-geografia-2026.10.02.html');
const html=readFileSync(file,'utf8');
const data=JSON.parse(html.match(/<script id="geo-content" type="application\/json">([\s\S]*?)<\/script>/)[1]);
let passed=0;
function ok(value,message){assert.ok(value,message);passed++;}
// GEO-02: corpus contract and reference boundaries.
ok(data.missions.length===6,'Seis missões');
const questions=data.missions.flatMap(m=>m.questions);
ok(questions.length===72,'72 questões');
ok(new Set(questions.map(q=>q.id)).size===72,'IDs únicos');
for(const m of data.missions){ok(m.questions.length===12 && m.facts.length>=3 && m.reflect,'Conceitos e síntese por missão');}
for(const q of questions){
 ok(q.explain.length>30 && q.pages.length>0,`${q.id}: explicação e fonte`);
 if(q.type==='single'||q.type==='multi')ok(q.options.length===new Set(q.options).size && (Array.isArray(q.answer)?q.answer:[q.answer]).every(a=>q.options.includes(a)),`${q.id}: gabarito válido`);
}
ok(['single','multi','fill','order'].every(t=>questions.some(q=>q.type===t)),'Modalidades');
ok(data.searches.length===3 && data.searches.every(p=>p.words.length===6),'18 termos em três caça-palavras');
ok(data.crosswords.length===3 && data.crosswords.every(p=>p.words.length===5),'15 palavras em três cruzadinhas');
ok(!/<(?:script|link)[^>]+(?:src|href)=["']https?:/i.test(html),'Sem dependências remotas');
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL || 'chrome'});
const context=await browser.newContext({viewport:{width:1280,height:900}});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const url=pathToFileURL(file).href;
await page.goto(url);
await page.getByLabel('Seu nome ou apelido').fill('   ');
await page.getByRole('button',{name:'Começar a expedição'}).click();
ok(await page.getByLabel('Seu nome ou apelido').isVisible(),'Nome vazio rejeitado');
await page.getByLabel('Seu nome ou apelido').fill('Miguel');
await page.getByRole('button',{name:'Começar a expedição'}).click();
ok((await page.locator('#profile-name').textContent())==='Miguel','Perfil ativo');
// Navigate using rendered controls and independently selected answers.
await page.getByRole('button',{name:/Explorar Paisagens/}).click();
await page.getByRole('button',{name:'Começar os 12 desafios'}).click();
await page.getByRole('button',{name:'Conferir resposta',exact:true}).click();
ok((await page.locator('#feedback').textContent()).includes('Escolha'),'Vazio não avança');
await page.getByRole('button',{name:'Pelo trabalho das pessoas',exact:true}).click();
await page.getByRole('button',{name:'Conferir resposta',exact:true}).click();
ok((await page.locator('#feedback').textContent()).includes('construir'),'Explica causa da mudança');
ok(await page.locator('#xp-total').textContent()==='10','Primeiro acerto vale 10 XP');
await page.reload();
await page.getByRole('button',{name:'Continuar rodada'}).click();
ok((await page.locator('#feedback').textContent()).includes('construir'),'Feedback da rodada restaurado');
ok(await page.locator('#xp-total').textContent()==='10','Reload não duplica XP');
await page.getByRole('button',{name:'Próximo desafio'}).click();
await page.getByRole('button',{name:'Apenas árvores e rios',exact:true}).click();
await page.getByRole('button',{name:'Conferir resposta',exact:true}).click();
ok((await page.locator('#feedback').textContent()).includes('Vamos descobrir'),'Erro acolhido');
ok(await page.locator('#xp-total').textContent()==='10','Erro não tira XP');
await page.getByRole('button',{name:'Mapa da expedição',exact:true}).click();
await page.getByRole('button',{name:/Rever dúvidas/}).click();
await page.getByRole('button',{name:'Construções próximas e muitos serviços',exact:true}).click();
await page.getByRole('button',{name:'Conferir resposta',exact:true}).click();
ok(await page.locator('#xp-total').textContent()==='20','Revisão concede acerto');
await page.getByRole('button',{name:'Mapa da expedição',exact:true}).click();
ok((await page.getByRole('button',{name:/Rever dúvidas/}).textContent()).includes('0'),'Dúvida resolvida sai da revisão');
// GEO-03: domain checker independent expected cases.
const grading=await page.evaluate(()=>({
 multiMissing:grade({type:'multi',answer:['A','B']},['A']),multiExtra:grade({type:'multi',answer:['A','B']},['A','B','C']),multiRight:grade({type:'multi',answer:['A','B']},['B','A']),
 fill:grade({type:'fill',answer:'erosão'},' EROSAO '),wrongFill:grade({type:'fill',answer:'erosão'},'solo'),
 orderRight:grade({type:'order',answer:['leite','fábrica','loja']},['leite','fábrica','loja']),orderWrong:grade({type:'order',answer:['leite','fábrica','loja']},['loja','fábrica','leite'])
}));
assert.deepEqual(grading,{multiMissing:false,multiExtra:false,multiRight:true,fill:true,wrongFill:false,orderRight:true,orderWrong:false});passed++;
// GEO-04 / GEO-05: all puzzle geometry, points and mission seals.
const geometries=await page.evaluate(()=>({searches:DATA.searches.map((p,i)=>({words:p.words.map(w=>w.word),...makeSearch(i)})),crosses:DATA.crosswords.map((p,i)=>makeCrossword(i))}));
for(const p of geometries.searches){for(const w of p.words){const target=w.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/gi,'').toUpperCase();ok(p.paths[target].map(i=>p.grid[i]).join('')===target,`${w} na grade`);}}
for(const p of geometries.crosses){ok(p.entries.length===5,'Cinco entradas posicionadas');const counts={};for(const e of p.entries)for(let i=0;i<e.word.length;i++){const k=`${e.row+(e.dir==='down'?i:0)},${e.col+(e.dir==='across'?i:0)}`;if(counts[k])ok(counts[k].letter===e.word[i],'Cruzamento coerente');counts[k]={letter:e.word[i],n:(counts[k]?.n||0)+1};}ok(Object.values(counts).some(x=>x.n>1),'Há cruzamentos reais');}
await page.getByRole('button',{name:/Caça-palavras/}).click();
const first=geometries.searches[0];const w=Object.keys(first.paths)[0];const cells=first.paths[w];
await page.locator(`[data-cell="${cells.at(-1)}"]`).click();await page.locator(`[data-cell="${cells[0]}"]`).click();
ok((await page.locator('#puzzle-feedback').textContent()).length>30,'Palavra revela conceito');
ok(await page.locator('#xp-total').textContent()==='30','Palavra ganha 10 XP');
await page.locator(`[data-cell="${cells[0]}"]`).click();await page.locator(`[data-cell="${cells.at(-1)}"]`).click();
ok(await page.locator('#xp-total').textContent()==='30','Palavra não duplica XP');
await page.getByRole('button',{name:'Mapa da expedição',exact:true}).click();await page.getByRole('button',{name:/Cruzadinhas/}).click();
await page.locator('[data-cross-input]').first().fill('cidade');await page.getByRole('button',{name:'Conferir palavras'}).click();
ok((await page.locator('#cross-feedback').textContent()).includes('1 de 5'),'Correção parcial da cruzadinha');
ok(await page.locator('#xp-total').textContent()==='40','Cruzadinha ganha 10 XP');
await page.reload();await page.getByRole('button',{name:/Cruzadinhas/}).click();
ok(await page.locator('[data-cross-input]').first().inputValue()==='cidade','Rascunho restaurado');
await page.getByRole('button',{name:'Conferir palavras'}).click();ok(await page.locator('#xp-total').textContent()==='40','Cruzadinha não duplica XP');
await page.getByRole('button',{name:'Mapa da expedição',exact:true}).click();
await page.getByRole('button',{name:/Caderno de descobertas/}).click();await page.getByLabel('Minha explicação').fill('A mata protege o solo da chuva.');
await page.getByRole('button',{name:'Mapa da expedição',exact:true}).click();
await page.getByRole('button',{name:'Trocar explorador'}).click();await page.getByLabel('Seu nome ou apelido').fill('Bia');await page.getByRole('button',{name:'Começar a expedição'}).click();
ok(await page.locator('#xp-total').textContent()==='0','Bia começa separada');
await page.getByRole('button',{name:/Caderno de descobertas/}).click();ok(await page.getByLabel('Minha explicação').inputValue()==='','Diário isolado');
await page.getByRole('button',{name:'Trocar explorador'}).click();await page.getByLabel('Seu nome ou apelido').fill(' miguel ');await page.getByRole('button',{name:'Começar a expedição'}).click();ok(await page.locator('#xp-total').textContent()==='40','Nome equivalente retoma perfil');
await page.getByRole('button',{name:/Caderno de descobertas/}).click();ok(await page.getByLabel('Minha explicação').inputValue()==='A mata protege o solo da chuva.','Diário persistiu');
await page.getByRole('button',{name:'Mapa da expedição',exact:true}).click();
await page.getByRole('button',{name:/Simulado/}).click();await page.getByRole('button',{name:'Começar simulado'}).click();
const sim=await page.evaluate(()=>profile().session);ok(sim.ids.length===12,'Simulado tem 12');for(let m=0;m<6;m++)ok(sim.ids.filter(id=>id.startsWith(`m${m+1}-`)).length===2,'Dois por tema');
for(let i=0;i<12;i++){
 const q=questions.find(q=>q.id===sim.ids[i]);
 for(const answer of(Array.isArray(q.answer)?q.answer:[q.answer]))await page.getByRole('button',{name:answer,exact:true}).click();
 await page.getByRole('button',{name:'Registrar resposta',exact:true}).click();
 ok(!(await page.locator('#feedback').textContent()).includes(q.explain),'Sem explicação durante simulado');
 await page.getByRole('button',{name:i===11?'Ver resultado':'Próximo desafio',exact:true}).click();
}
ok((await page.locator('main').textContent()).includes('12 de 12'),'Resultado correto');ok((await page.locator('main').textContent()).includes(questions.find(q=>q.id===sim.ids[0]).explain),'Explicação final');
// Exact seal and dedup state checked through normal scoring service.
const seal=await page.evaluate(()=>{const m=DATA.missions[0];for(const q of m.questions)record(q.id,true);const xp1=xp();for(const q of m.questions)record(q.id,true);return {complete:missionDone(0),xp1,xp2:xp()};});ok(seal.complete&&seal.xp1===seal.xp2,'Selo de 12 e XP idempotente');
await page.getByRole('button',{name:'Mapa da expedição',exact:true}).click();await page.getByRole('button',{name:'Guia da família'}).click();await page.getByRole('button',{name:'Apagar este perfil…'}).click();ok(await page.getByRole('button',{name:'Sim, apagar meu perfil'}).isVisible(),'Exclusão pede confirmação');await page.getByRole('button',{name:'Sim, apagar meu perfil'}).click();ok(await page.getByRole('button',{name:'Continuar como Bia'}).isVisible(),'Outro perfil preservado');
await page.getByLabel('Seu nome ou apelido').fill('<b>Ana</b>');await page.getByRole('button',{name:'Começar a expedição'}).click();ok(await page.locator('#profile-name').textContent()==='<b>Ana</b>' && await page.locator('#profile-name b').count()===0,'Nome escapado');
for(const width of [390,1280]){await page.setViewportSize({width,height:900});ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Mapa sem overflow ${width}`);for(const label of [/Caça-palavras/,/Cruzadinhas/]){await page.getByRole('button',{name:label}).click();ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Jogo sem overflow ${width}`);await page.getByRole('button',{name:'Mapa da expedição',exact:true}).click();}}
await page.screenshot({path:'/tmp/geografia-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/geografia-mobile.png',fullPage:true});
const broken=await browser.newContext();await broken.addInitScript(()=>{Storage.prototype.getItem=function(){throw new Error('blocked')};Storage.prototype.setItem=function(){throw new Error('blocked')};});const bpage=await broken.newPage();await bpage.goto(url);ok((await bpage.locator('#storage-notice').textContent()).includes('não ficará salvo'),'Aviso armazenamento indisponível');await bpage.getByLabel('Seu nome ou apelido').fill('Teste');await bpage.getByRole('button',{name:'Começar a expedição'}).click();ok(await bpage.locator('#profile-name').textContent()==='Teste','Funciona sem storage');await broken.close();
const corrupt=await browser.newContext();await corrupt.addInitScript(()=>localStorage.setItem('miguel-geografia-v1','{broken'));const cpage=await corrupt.newPage();await cpage.goto(url);ok((await cpage.locator('#storage-notice').textContent()).includes('não ficará salvo'),'Aviso dados corrompidos');ok(await cpage.evaluate(()=>localStorage.getItem('miguel-geografia-v1'))==='{broken','Dados corrompidos preservados');await corrupt.close();
ok(errors.length===0,`Erros JS: ${errors.join(';')}`);
if(process.env.CHECK_HOME){const home=readFileSync(path.join(root,'index.html'),'utf8');const links=[...home.matchAll(/href="([^"#]+\.html)"/g)].map(x=>x[1]);ok(links.includes(path.basename(file)),'Home aponta quiz');for(const p of links)ok(existsSync(path.join(root,p)),`Link ${p}`);}
await browser.close();console.log(`${passed} verificações passaram.`);
