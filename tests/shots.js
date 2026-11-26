const puppeteer=require('puppeteer-core');
(async()=>{const server=await require('./server.js')();const base='http://localhost:'+server.address().port+'/?today=2026-11-26';
const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox'],headless:'new'});
async function run(lang,name,form){const p=await b.newPage();await p.setViewport({width:390,height:844,deviceScaleFactor:2});
await p.evaluateOnNewDocument(l=>{Object.defineProperty(navigator,'language',{get:()=>l});},lang);
await p.goto(base,{waitUntil:'networkidle0'});await p.evaluate(()=>localStorage.clear());await p.reload({waitUntil:'networkidle0'});
await p.click('#menuBtn');await p.click('#demoBtn');await new Promise(r=>setTimeout(r,500));await p.evaluate(()=>{document.getElementById('toast').hidden=true});
await p.screenshot({path:'docs/'+name+'.png'});
if(form){await p.click('#addBtn');await p.type('#fName',lang==='ar'?'عسل':'Honey');await p.click('#presets button[data-p="p1y"]');await new Promise(r=>setTimeout(r,300));await p.screenshot({path:'docs/'+form+'.png'});}
await p.close();}
require('fs').mkdirSync('docs',{recursive:true});
await run('en-US','screenshot-en','screenshot-add');await run('ar-EG','screenshot-ar');
await b.close();server.close();})();
