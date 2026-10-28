import {createServer} from 'node:http';
import {readFile,stat,writeFile,mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {join,resolve,extname,sep} from 'node:path';
import {chromium} from 'playwright-core';
const ROOT=resolve('dist'),PORT=4887;
const TYPES={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.ico':'image/x-icon','.json':'application/json'};
const serve=createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url||'/',`http://127.0.0.1:${PORT}`).pathname);
  let f=resolve(join(ROOT,pathname));
  if(!f.startsWith(ROOT+sep)&&f!==ROOT){res.writeHead(403).end();return;}
  let t=await stat(f); if(t.isDirectory()){f=join(f,'index.html');t=await stat(f);}
  res.setHeader('Content-Type',TYPES[extname(f)]||'application/octet-stream');
  res.writeHead(200);res.end(await readFile(f));
 }catch{res.writeHead(404).end('not found');}
});
await new Promise(ok=>serve.listen(PORT,'127.0.0.1',ok));
const chrome=['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/opt/google/chrome/chrome','/usr/bin/chromium-browser','/usr/bin/chromium'].find(existsSync);
if(!chrome)throw Error('GitHub runner has no Chrome binary for real responsive QA');
const browser=await chromium.launch({executablePath:chrome,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
await mkdir('.qa-screenshots',{recursive:true});
const paths=['/','/drill/','/emergency/','/family-emergency/','/family-card/','/situations/','/checklist/','/plan/','/starter-kit/','/buying/food/','/buying/gear/','/sources/','/reviews/','/reviews/fenix-e20-v2-flashlight/','/reviews/emergency-am-fm-radios/','/reviews/emergency-bags-dry-pouches/','/reviews/emergency-blankets-and-hygiene-wipes/','/reviews/emergency-first-aid-kit-and-dressings/','/reviews/emergency-flashlights-headlamps/','/reviews/emergency-kit-set-composition-audit/','/reviews/emergency-power-banks-10000-vs-20000/','/reviews/emergency-products-kc-model-expiry-audit/','/reviews/emergency-retail-option-priority-and-affiliate-gates/','/reviews/coupang-stock-audit-samsung-p3400-p3401/'];
const widths=[320,375,390,430,768,1024,1440];
const errors=[]; let checks=0;let screenshots=0;
try{
 for(const width of widths){
 const context=await browser.newContext({viewport:{width,height:845},deviceScaleFactor:1,reducedMotion:'reduce',locale:'ko-KR'});
 const page=await context.newPage();
 for(const route of paths){
  await page.goto(`http://127.0.0.1:${PORT}${route}`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.evaluate(()=>document.fonts.ready);
  const details=await page.evaluate(()=>{
   const cards=['.quick-grid','.situation-hub-grid','.starter-set-grid','.review-directory-grid','.review-product-grid'].flatMap(sel=>{
    const grid=document.querySelector(sel);if(!grid)return[];
    const arr=[...grid.children].filter(x=>x instanceof HTMLElement);
    const byRow={};for(const el of arr){const r=el.getBoundingClientRect();const y=Math.round(r.top/8)*8;(byRow[y]??=[]).push({h:r.height,title:el.querySelector('h2,h3')?.textContent?.trim()?.slice(0,45)});}
    return Object.values(byRow).filter(row=>row.length>1).map(row=>({sel,count:row.length,range:Math.max(...row.map(x=>x.h))-Math.min(...row.map(x=>x.h)),names:row.map(x=>x.title)}));
   });
   const h=[...document.querySelectorAll('h1,h2,h3')].filter(el=>{const st=getComputedStyle(el);return st.display!=='none'&&el.getClientRects().length>0&&el.closest('details:not([open])')===null;}).filter(el=>el.scrollWidth>el.clientWidth+4||el.scrollHeight>el.clientHeight+5).slice(0,5).map(el=>({text:el.textContent?.trim().slice(0,55),scroll:[el.scrollWidth,el.scrollHeight],client:[el.clientWidth,el.clientHeight]}));
   const mobileNav=document.querySelector('.mobile-tabbar');
   const navVisible=mobileNav?getComputedStyle(mobileNav).display!=='none':false;
   const m=document.querySelector('meta[name="theme-color"]')?.content;
   return {overflow:document.documentElement.scrollWidth-window.innerWidth,cards,headings:h,navVisible,meta:m,rootScheme:getComputedStyle(document.documentElement).colorScheme,hasKit:Boolean(document.querySelector('.kit-featured-product')),hasStock:Boolean(document.querySelector('.stock-section'))};
  });
  const failed=[];
  if(details.overflow>3)failed.push('page horizontally overflows by '+details.overflow+'px');
  if(details.headings.length)failed.push('clipped headings '+JSON.stringify(details.headings));
  for(const row of details.cards)if(row.range>4)failed.push('card heights differ '+row.sel+' '+Math.round(row.range)+'px');
  if(details.navVisible!==(width<=800))failed.push('mobile tab navigation visibility wrong');
  if(details.meta!=='#0e151d'||details.rootScheme!=='dark')failed.push('original dark theme missing');
  if(route==='/'){
    const urgent=page.locator('.emergency-home-card');
    if(await urgent.count()!==3)failed.push('three top-level instant action cards missing');
    const link=page.locator('a[href*="facilitiesSafteyMap.do"]');
    if(await link.count()===0)failed.push('official shelter action missing');
    if(await page.locator('.emergency-home-action').count()===0)failed.push('urgent and routine modes not separated');
    if(await page.locator('.quick-grid .brief-card').count()!==3)failed.push('homepage forces too many competing routine actions');
    if(await page.locator('.situation-hub-grid .situation-hub-card').count()!==4)failed.push('routine situation shortcuts should be four non-duplicate hazards');
    if(await page.locator('.home-checklist-progress').count()!==1)failed.push('22 item local checklist summary missing');
    if(await page.locator('.site-nav a').count()!==5)failed.push('desktop nav has too many destinations');
    if(width<=540){
     const cols=await page.locator('.situation-hub-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
     if(cols!==4)failed.push('mobile event icon shortcuts should be four across');
    }
  }
  if(route==='/drill/'){
    if(await page.locator('.drill-card').count()!==3)failed.push('three practical scenarios missing');
    if(await page.locator('.drill-options button').count()!==9)failed.push('practice answers are not clickable');
  }
  if(route==='/emergency/'){
    if(await page.locator('.instant-step-card').count()!==3)failed.push('air chemical nuclear first-action cards missing');
    if(await page.locator('.instant-step-card ol li').count()!==9)failed.push('nine first-action steps are not visible without expanding');
    if(await page.locator('a[href="/offline/ready-card.html"]').count()===0)failed.push('offline card download unavailable');
    const urgentTexts=await page.locator('.instant-step-card ol li').allTextContents();
    if(!urgentTexts.some(t=>t.includes('공식 지시를 따르세요.')) || !urgentTexts.some(t=>t.includes('안전한 실내에서 벗으세요.')))failed.push('chemical or nuclear emergency instruction text incomplete');
    const clipping=await page.locator('.instant-step-card li,.instant-card-warning').evaluateAll(nodes=>nodes.flatMap((el,i)=>{
     const css=getComputedStyle(el),rect=el.getBoundingClientRect();
     const hides=/hidden|clip|scroll/.test(css.overflowY)||css.webkitLineClamp!=='none'&&css.webkitLineClamp!=='unset';
     return hides||el.scrollHeight>el.clientHeight+3||rect.height<18?[{i,content:el.textContent?.trim().slice(0,52),overflow:css.overflowY,clamp:css.webkitLineClamp}]:[];
    }));
    if(clipping.length)failed.push('full emergency step possibly clipped '+JSON.stringify(clipping.slice(0,4)));
  }
  if(route==='/family-emergency/'&&await page.locator('.family-now-card').count()!==3)failed.push('infant/elderly/pet emergency cards missing');
  if(route==='/family-card/'){
    if(await page.locator('.family-paper-fields input').count()<8)failed.push('fillable family emergency contact fields missing');
    if(await page.locator('#print-family-card').count()===0)failed.push('print to PDF control missing');
  }
  if(route==='/situations/'&&await page.locator('.first-three-visible').count()!==3)failed.push('air chemical nuclear first three steps are collapsed');
  if(route==='/starter-kit/'&&!details.hasKit)failed.push('product photo card missing');
  if(route==='/starter-kit/'||route==='/buying/gear/'){
   const urls=['https://link.coupang.com/a/iekaW7GSFE','https://link.coupang.com/a/iekgMwsEmq'];
   for(const u of urls){
    const a=page.locator('a[href="'+u+'"]');
    if(await a.count()!==1)failed.push('missing or duplicate user-supplied single-product link '+u);
    else if(!(await a.getAttribute('rel')||'').includes('sponsored'))failed.push('affiliate link disclosure missing: '+u);
   }
   if(route==='/starter-kit/'&&await page.locator('.starter-secondary-affiliates-grid article').count()!==2)failed.push('radio and battery cards must both be visible');
   if(route==='/buying/gear/'&&await page.locator('.partner-model-pending').count()!==2)failed.push('radio and battery sales-validation notices missing');
  }
  if(route==='/checklist/'&&!details.hasStock)failed.push('stock manager missing');
  if(route==='/reviews/fenix-e20-v2-flashlight/'){
    const a=await page.locator('a[href="https://link.coupang.com/a/idtdhvDZ3A"]').first();
    if(await a.count()===0)failed.push('matching E20 affiliate link missing');
    else if(!(await a.getAttribute('rel')||'').includes('sponsored'))failed.push('affiliate disclosure missing');
  }
  if(width===390&&['/','/drill/','/emergency/','/family-emergency/','/family-card/','/starter-kit/','/checklist/','/plan/','/reviews/','/reviews/fenix-e20-v2-flashlight/'].includes(route)){
   let name=route==='/'?'home':route.replaceAll('/','_').replace(/^_|_$/g,'');
   await page.screenshot({path:`.qa-screenshots/${name}-390.png`,fullPage:false});screenshots++;
  }
  if(width===1440&&route==='/'){await page.screenshot({path:'.qa-screenshots/home-1440.png',fullPage:true});screenshots++;}
  if(route==='/emergency/'&&(width===390||width===1440)){
    await page.locator('.instant-steps-grid').screenshot({path:`.qa-screenshots/complete-emergency-steps-${width}.png`});screenshots++;
  }
  if(failed.length)errors.push({width,route,issues:failed});
  checks++;
 }
 if(width===390){
  await page.goto(`http://127.0.0.1:${PORT}/`);
  const initialHomeCount=await page.locator('#home-checked-count').textContent();
  if(initialHomeCount!=='0')errors.push({width,route:'/',issues:['fresh home should reflect 0 of 22 locally checked']});
  const baseIds=await page.locator('.home-checklist-progress').getAttribute('data-check-ids');
  const ids=JSON.parse(baseIds||'[]');
  if(ids.length!==22)errors.push({width,route:'/',issues:['home progress must map exact 22 base item ids']});
  await page.evaluate(id=>localStorage.setItem('guidehollow-ready-check-v1',JSON.stringify([id])),ids[0]);
  await page.reload();
  if((await page.locator('#home-checked-count').textContent())!=='1')errors.push({width,route:'/',issues:['home and checklist saved status do not match']});
  await page.evaluate(()=>localStorage.removeItem('guidehollow-ready-check-v1'));
  await page.goto(`http://127.0.0.1:${PORT}/starter-kit/`);
  const mappedCount=await page.locator('#starter-detail-bridge').getAttribute('data-base-ids');
  const crosswalk=await page.locator('#starter-detail-bridge').getAttribute('data-crosswalk');
  const baseline=JSON.parse(mappedCount||'[]');
  const detailMapping=JSON.parse(crosswalk||'{}');
  const union=Object.values(detailMapping).flat();
  if(baseline.length!==22||union.length!==22||new Set(union).size!==22||union.some(id=>!baseline.includes(id)))errors.push({width,route:'/starter-kit/',issues:['six-area crosswalk does not map exactly 22 individual baseline items']});
  if((await page.locator('#starter-detail-done').textContent())!=='0')errors.push({width,route:'/starter-kit/',issues:['empty detailed checklist does not show zero']});
  await page.evaluate(()=>localStorage.setItem('guidehollow-ready-check-v1',JSON.stringify(['water-bottles','lamp'])));
  await page.reload();
  if((await page.locator('#starter-detail-done').textContent())!=='2'||(await page.locator('[data-detail-for="water"]').textContent())!=='1'||(await page.locator('[data-detail-for="light"]').textContent())!=='1')errors.push({width,route:'/starter-kit/',issues:['detailed progress not synchronized with saved item IDs']});
  if((await page.locator('#starter-ready-count').textContent())!=='0')errors.push({width,route:'/starter-kit/',issues:['detail record must not falsely mark six broad categories complete']});
  await page.evaluate(()=>localStorage.removeItem('guidehollow-ready-check-v1'));
  await page.reload();
  await page.locator('#starter-people').fill('3');
  await page.locator('#starter-water-owned').fill('10');
  if((await page.locator('#starter-water-needed').textContent())!=='34.2 L' || (await page.locator('#starter-water-gap').textContent())!=='24.2 L')errors.push({width,route:'/starter-kit/',issues:['family size and water gap calculator wrong']});
  const missing=page.locator('#starter-missing-list li:visible');
  if(await missing.count()!==6)errors.push({width,route:'/starter-kit/',issues:['initial missing-item summary does not show six unchecked categories']});
  if(await page.locator('.starter-missing-buy').count()!==1)errors.push({width,route:'/starter-kit/',issues:['unverified products have improper buy links']});
  await page.locator('#starter-personal').screenshot({path:'.qa-screenshots/starter-personal-390.png'});screenshots++;
  const c=page.locator('.starter-owned-checkbox');if(await c.count()!==6)errors.push({width,route:'/starter-kit/',issues:['six-item checklist missing']});
  else{
   await c.first().check();
   const number=await page.locator('#starter-ready-count').textContent();
   if(number!=='1')errors.push({width,route:'/starter-kit/',issues:['progress counter failed']});
   if(await page.locator('#starter-missing-count').textContent()!=='5'||await missing.count()!==5)errors.push({width,route:'/starter-kit/',issues:['checked item is still in missing-only list']});
   await page.locator('#starter-show-unchecked').click();
   if(await page.locator('.starter-set-card:visible').count()!==5)errors.push({width,route:'/starter-kit/',issues:['only unchecked view did not filter completed cards']});
   await page.reload();if(await page.locator('#starter-ready-count').textContent()!=='1')errors.push({width,route:'/starter-kit/',issues:['progress persistence failed']});
   await page.locator('#starter-reset').click();
   if(await page.locator('#starter-ready-count').textContent()!=='0')errors.push({width,route:'/starter-kit/',issues:['reset button failed']});
  }
  await page.goto(`http://127.0.0.1:${PORT}/drill/`);
  const first=page.locator('.drill-card').first();
  await first.locator('button[data-answer="correct"]').click();
  if(!await first.locator('.drill-result').isVisible())errors.push({width,route:'/drill/',issues:['selected practice answer shows no explanation']});
  if(await first.locator('button[data-answer="correct"]').getAttribute('aria-pressed')!=='true')errors.push({width,route:'/drill/',issues:['practice selection lacks accessible state']});
  await page.goto(`http://127.0.0.1:${PORT}/checklist/`);
  if(await page.locator('.check-item input').count()===0)errors.push({width,route:'/checklist/',issues:['interactive checkboxes missing']});
  const d=page.locator('.check-backup.guide-extra');
  if(await d.count()&&await d.getAttribute('open')!==null)errors.push({width,route:'/checklist/',issues:['advanced backup unexpectedly expanded']});
  await page.locator('#stock-manager').scrollIntoViewIfNeeded();
  if(!await page.locator('#stock-manager').isVisible())errors.push({width,route:'/checklist/',issues:['stock manager not visible']});
 }
 await context.close();
 }
}finally{await browser.close();await new Promise(ok=>serve.close(ok));}
const report={tested:checks,viewports:widths,pages:paths.length,screenshots,errors};
await writeFile('.qa-screenshots/report.json',JSON.stringify(report,null,2));
console.log('RESPONSIVE QA REPORT '+JSON.stringify(report));
if(errors.length)process.exitCode=1;
