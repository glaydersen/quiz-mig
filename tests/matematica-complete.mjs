import {createRequire} from 'node:module';import assert from 'node:assert/strict';import {resolve} from 'node:path';
const require=createRequire(process.env.PLAYWRIGHT_MODULE||'/Users/glaydersen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,channel:'chrome'});const page=await browser.newPage({viewport:{width:375,height:812}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('file://'+resolve(process.env.QUIZ_ROOT||process.cwd(),'quiz-matematica-2026.10.30.html'));
// Independent answer key calculated from the problems, not imported from application data.
const answers=[[4,3],[6],1,2,[8,2],2,[5],0,[24,1],[124,0],1,[142],[46],[130],[14,1],[56,3],[38],[32],[17],[50],[6],[8],[6,3],[85],[70],[900],[40],1,[5],[2,3],[10],[90,15],[28],[16],[24],[25],[5,15],[18],[25],[54],[12,5,13],[68,204],[134],0,1,[108],[5,70],0];
await page.getByLabel('Seu nome ou apelido').fill('<b>Miguel</b>');await page.getByRole('button',{name:'Vamos nessa!'}).click();assert.match(await page.locator('#profile').innerText(),/<b>Miguel<\/b>/);assert.equal(await page.locator('#profile b').count(),0);
await page.screenshot({path:'/tmp/miguel-math/map-mobile.png',fullPage:true});
for(let mission=0;mission<6;mission++){
 await page.getByRole('button',{name:/^Treinar /}).nth(mission).click();await page.getByRole('button',{name:'Iniciar trilha'}).click();
 for(let j=0;j<8;j++){
  const a=answers[mission*8+j];
  if(Array.isArray(a))for(let k=0;k<a.length;k++)await page.locator('[data-answer]').nth(k).fill(String(a[k]));else{await page.getByRole('radio').nth(a).focus();await page.keyboard.press('Space')}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.getByRole('button',{name:'Conferir resposta'}).click();assert.match(await page.locator('#feedback').innerText(),/Boa descoberta/);
  assert.equal(await page.locator('h1').count(),1);
  await page.getByRole('button',{name:j===7?'Ver resultado':'Próximo desafio'}).click();
 }
 assert.match(await page.locator('main').innerText(),/8 de 8/);await page.getByRole('button',{name:'Voltar ao mapa'}).click();
}
assert.match(await page.locator('#profile').innerText(),/48 estrelas/);assert.equal(await page.getByText('★ Trilha conquistada',{exact:true}).count(),6);
await page.getByRole('button',{name:'Criar meu problema'}).click();await page.getByLabel('Meu problema e minha solução').fill('Quatro amigos repartem 35 figurinhas. Cada um ganha 8 e sobram 3.');await page.getByRole('button',{name:'Voltar ao mapa'}).click();await page.getByRole('button',{name:'Criar meu problema'}).click();assert.match(await page.getByLabel('Meu problema e minha solução').inputValue(),/sobram 3/);await page.getByText('Comparar com um exemplo e conferir meu texto',{exact:true}).click();assert.match(await page.locator('main').innerText(),/não recebe correção automática/);
await page.getByRole('button',{name:'Voltar ao mapa'}).click();await page.setViewportSize({width:1360,height:900});await page.screenshot({path:'/tmp/miguel-math/map-desktop.png',fullPage:true});
await page.getByRole('button',{name:'Abrir oficina da divisão'}).click();await page.screenshot({path:'/tmp/miguel-math/workshop.png',fullPage:true});
// Storage denial preserves a usable experience and displays the limitation.
const blocked=await browser.newPage();await blocked.addInitScript(()=>{Storage.prototype.setItem=function(){throw new Error('blocked')}});await blocked.goto('file://'+resolve(process.env.QUIZ_ROOT||process.cwd(),'quiz-matematica-2026.10.30.html'));await blocked.getByLabel('Seu nome ou apelido').fill('Sem armazenamento');await blocked.getByRole('button',{name:'Vamos nessa!'}).click();assert.match(await blocked.locator('#notice').innerText(),/não permitiu salvar/);await blocked.getByRole('button',{name:'Começar revisão de hoje'}).click();assert.match(await blocked.locator('h1').innerText(),/limões/);
assert.deepEqual(errors,[]);await browser.close();console.log('PASS: all 48 problems solved through UI with independent answers; six completed tracks; keyboard, escaped name, story, all questions mobile, storage denied.');
