import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
await page.goto(pathToFileURL(path.join(process.env.QUIZ_ROOT||process.cwd(),'quiz-geografia-2026.10.02.html')).href);
await page.getByLabel('Seu nome ou apelido').fill('Miguel');await page.getByRole('button',{name:'Começar a expedição'}).click();
// GEO-03 actual controls: incomplete multi fails, exact set succeeds in review.
await page.evaluate(()=>startSession(['m1-9'],'Conceitos em ação'));
await page.getByRole('button',{name:'Construir uma ponte',exact:true}).click();await page.getByRole('button',{name:'Conferir resposta',exact:true}).click();
assert.match(await page.locator('#feedback').textContent(),/Vamos descobrir/);
assert.equal(await page.locator('#xp-total').textContent(),'0');
await page.getByRole('button',{name:'Ver resultado'}).click();await page.getByRole('button',{name:/Rever dúvidas/}).click();
await page.getByRole('button',{name:'Cultivar uma plantação',exact:true}).click();await page.getByRole('button',{name:'Construir uma ponte',exact:true}).click();await page.getByRole('button',{name:'Conferir resposta',exact:true}).click();
assert.match(await page.locator('#feedback').textContent(),/Boa descoberta/);assert.equal(await page.locator('#xp-total').textContent(),'10');
// GEO-03 text: empty stays; accented concept accepted without accent.
await page.evaluate(()=>startSession(['m4-11'],'Conceitos em ação'));
await page.getByRole('button',{name:'Conferir resposta',exact:true}).click();assert.match(await page.locator('#feedback').textContent(),/Escreva uma resposta/);
await page.getByLabel('Sua resposta').fill('EROSAO');await page.getByRole('button',{name:'Conferir resposta',exact:true}).click();assert.match(await page.locator('#feedback').textContent(),/Boa descoberta/);assert.equal(await page.locator('#xp-total').textContent(),'20');
// GEO-03 ordering is operable by button/keyboard; retained until explicit submit.
await page.evaluate(()=>startSession(['m3-12'],'Conceitos em ação'));
const correct=['A vegetação é retirada','O solo fica exposto','A chuva carrega partículas de terra'];
for(let target=0;target<3;target++){
 let current=await page.locator('.order-label').allTextContents();let pos=current.indexOf(correct[target]);
 while(pos>target){await page.getByRole('button',{name:`Subir etapa ${pos+1}`,exact:true}).click();pos--;}
}
assert.deepEqual(await page.locator('.order-label').allTextContents(),correct);
await page.getByRole('button',{name:'Conferir resposta',exact:true}).focus();await page.keyboard.press('Enter');assert.match(await page.locator('#feedback').textContent(),/Boa descoberta/);
// GEO-05: all puzzle types complete; hint itself grants no points.
await page.evaluate(()=>searchView(0));const before=await page.locator('#xp-total').textContent();await page.getByRole('button',{name:'Uma pista'}).click();assert.equal(await page.locator('#xp-total').textContent(),before);await page.getByRole('button',{name:'Cancelar seleção'}).click();
for(let k=0;k<3;k++){
 await page.evaluate(k=>searchView(k),k);const paths=await page.evaluate(k=>Object.values(makeSearch(k).paths),k);
 for(const p of paths){await page.locator(`[data-cell="${p[0]}"]`).click();await page.locator(`[data-cell="${p.at(-1)}"]`).click();}
 assert.match(await page.locator('#word-count').textContent(),/6 de 6 palavras encontradas/);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
}
for(let k=0;k<3;k++){
 await page.evaluate(k=>crossView(k),k);const words=await page.evaluate(k=>DATA.crosswords[k].words.map(w=>w.word),k);
 for(let i=0;i<words.length;i++)await page.locator(`[data-cross-input="${i}"]`).fill(words[i]);
 await page.getByRole('button',{name:'Conferir palavras'}).click();assert.match(await page.locator('#cross-feedback').textContent(),/5 de 5 palavras corretas/);assert.equal(await page.locator('.cross-cell.conflict').count(),0);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:`/tmp/geografia-cross-${k}.png`,fullPage:true});
}
assert.equal(await page.locator('#xp-total').textContent(),'360');
// GEO-06: mistake is hidden in sim until final, then routes to review.
await page.evaluate(()=>startSession(['m1-1'],'Simulado','sim'));
await page.getByRole('button',{name:'Somente pelo vento',exact:true}).click();await page.getByRole('button',{name:'Registrar resposta'}).click();assert.match(await page.locator('#feedback').textContent(),/Resposta registrada/);assert.doesNotMatch(await page.locator('#feedback').textContent(),/trabalham|err|certa/i);
await page.reload();await page.getByRole('button',{name:'Continuar rodada'}).click();assert.match(await page.locator('#feedback').textContent(),/Resposta registrada/);await page.getByRole('button',{name:'Ver resultado'}).click();assert.match(await page.locator('main').textContent(),/0 de 1/);assert.ok(await page.evaluate(()=>pending().some(q=>q.id==='m1-1')));
// GEO-02 visuals and GEO-07 mobile fit on rich question states, labs and inputs.
for(const id of ['m1-3','m1-5','m5-6','m2-12']){await page.evaluate(id=>startSession([id],'Teste de leitura'),id);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
await page.evaluate(()=>lab());await page.getByRole('button',{name:/Chão coberto de cimento/}).click();assert.match(await page.locator('.note').textContent(),/impermeável/);await page.getByRole('button',{name:/Encosta sem vegetação/}).click();assert.match(await page.locator('.note').textContent(),/erosão/);
await page.evaluate(()=>home());await page.screenshot({path:'/tmp/geografia-mobile-final.png',fullPage:true});await page.setViewportSize({width:1280,height:900});await page.screenshot({path:'/tmp/geografia-desktop-final.png',fullPage:true});
// Home requirement checked separately after integration, preserving archive.
if(process.env.CHECK_HOME){await page.goto(pathToFileURL(path.join(process.env.QUIZ_ROOT||process.cwd(),'index.html')).href);assert.equal(await page.locator('#passados .card').count(),6);await page.locator('#proximos a[href="quiz-geografia-2026.10.02.html"]').click();assert.match(await page.title(),/Expedição Geografia/);await page.locator('a.brand').click();assert.match(await page.title(),/Clube do Miguel/);}
await browser.close();console.log('Atividades: seleção múltipla, texto, ordem, 6 jogos completos, simulado com erro, teclado, laboratório e telas móveis passaram.');
