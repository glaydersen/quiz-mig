// GEO-07: malformed but parseable saved data must not become a resumable round.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const url=pathToFileURL(path.join(process.env.QUIZ_ROOT||process.cwd(),'quiz-geografia-2026.10.02.html')).href;
const p={id:'a',name:'Ana',answers:{},awards:{},drafts:{},crossDrafts:{},session:null};
const corruptProfiles=[
 {...p,session:{ids:['missing'],index:0,title:'rodada'}},
 {...p,session:{ids:['m1-1'],index:99,title:'rodada'}},
 {...p,answers:[]},
 {...p,answers:{'m1-1':null}},
 {...p,drafts:[]},
 {...p,awards:{'q:missing':true}},
];
for(const bad of corruptProfiles){
 const context=await browser.newContext();const raw=JSON.stringify({version:1,active:'a',profiles:[bad]});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(raw=>localStorage.setItem('miguel-geografia-v1',raw),raw);await page.goto(url);
 assert.match(await page.locator('#storage-notice').textContent(),/não ficará salvo/);
 assert.equal(await page.getByRole('button',{name:'Continuar rodada'}).count(),0);
 await page.getByLabel('Seu nome ou apelido').fill('Novo explorador');await page.getByRole('button',{name:'Começar a expedição'}).click();
 assert.equal(await page.locator('#profile-name').textContent(),'Novo explorador');
 await page.getByRole('button',{name:/Explorar Paisagens/}).click();await page.getByRole('button',{name:'Começar os 12 desafios'}).click();
 await page.getByRole('button',{name:'Pelo trabalho das pessoas',exact:true}).click();await page.getByRole('button',{name:'Conferir resposta',exact:true}).click();
 assert.equal(await page.locator('#xp-total').textContent(),'10');
 assert.equal(await page.evaluate(()=>localStorage.getItem('miguel-geografia-v1')),raw);
 assert.deepEqual(errors,[]);await context.close();
}
// Valid saved multi/fill/order drafts still resume after reload, with no false warning.
const context=await browser.newContext();const page=await context.newPage();await page.goto(url);await page.getByLabel('Seu nome ou apelido').fill('Miguel');await page.getByRole('button',{name:'Começar a expedição'}).click();
for(const id of ['m1-9','m4-11','m3-12']){
 await page.evaluate(id=>startSession([id],'Rascunho'),id);
 if(id==='m1-9')await page.getByRole('button',{name:'Construir uma ponte',exact:true}).click();
 if(id==='m4-11')await page.getByLabel('Sua resposta').fill('ero');
 const before=await page.evaluate(()=>profile().session);
 await page.reload();assert.equal(await page.locator('#storage-notice').isVisible(),false);
 await page.getByRole('button',{name:'Continuar rodada'}).click();assert.deepEqual(await page.evaluate(()=>profile().session),before);
}
await browser.close();console.log('Persistência: seis corrupções estruturais preservadas com aviso; três tipos de rascunho válido retomados.');
