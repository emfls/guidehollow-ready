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
const paths=['/','/drill/','/emergency/','/family-emergency/','/family-card/','/situations/','/checklist/','/plan/','/starter-kit/','/protocols/','/buying/','/buying/food/','/buying/gear/','/sources/','/reviews/','/reviews/fenix-e20-v2-flashlight/','/reviews/emergency-am-fm-radios/','/reviews/emergency-bags-dry-pouches/','/reviews/emergency-blankets-and-hygiene-wipes/','/reviews/emergency-first-aid-kit-and-dressings/','/reviews/emergency-flashlights-headlamps/','/reviews/emergency-kit-set-composition-audit/','/reviews/emergency-power-banks-10000-vs-20000/','/reviews/emergency-products-kc-model-expiry-audit/','/reviews/emergency-retail-option-priority-and-affiliate-gates/','/reviews/coupang-stock-audit-samsung-p3400-p3401/'];
const widths=[320,375,390,430,768,1024,1440];
const errors=[]; let checks=0;let screenshots=0;
try{
 for(const width of widths){
 const context=await browser.newContext({viewport:{width,height:845},deviceScaleFactor:1,reducedMotion:'reduce',locale:'ko-KR'});
 await context.route('https://www.googletagmanager.com/**',route=>route.abort());
 await context.route('https://www.google-analytics.com/**',route=>route.abort());
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
  const photoBorderIssues=await page.locator('.product-photo-frame,.ready-shop-image,.shop-guide-photo,.home-fast-result-photo,.review-directory-shop-image,.review-featured-image,.kit-featured-image,.review-product-photo,.guide-choice-link .guide-product-visual,.partner-model-pending .partner-product-visual,.starter-secondary-affiliates-grid .starter-affiliate-product-visual,.simple-product-media>a').evaluateAll(nodes=>nodes.flatMap(el=>{
   const css=getComputedStyle(el);
   const widths=[css.borderTopWidth,css.borderRightWidth,css.borderBottomWidth,css.borderLeftWidth].map(parseFloat);
   return widths.some(n=>n>0)?[{className:String(el.className).slice(0,60),border:widths}]:[];
  }));
  if(photoBorderIssues.length)failed.push('Affiliate photos still have outer borders: '+JSON.stringify(photoBorderIssues.slice(0,4)));
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
    if(await page.locator('#home-fast-check').count()!==1||await page.locator('.home-fast-question').count()!==5||await page.locator('.home-fast-result-card').count()!==5)failed.push('five-question check or product mapping missing');
    if(!(await page.locator('#home-fast-results').isHidden()))failed.push('quick-check product suggestions visible without a user answer');
    if(await page.locator('.home-routine-start').count()!==1)failed.push('three-day preparedness entry is not prominent');
    if(await page.locator('a.home-fast-buy').count()!==5)failed.push('five approved product links not accessible from fast check');

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
  if(route==='/starter-kit/'&&await page.locator('.starter-affiliate-product-visual').count()!==2)failed.push('radio and battery media tiles not ready');
  if(route==='/buying/gear/'){
   if(await page.locator('.partner-product-visual').count()!==2)failed.push('radio and battery photo tiles missing');
   if(await page.locator('.guide-product-visual img').count()!==1)failed.push('existing verified Fenix product photo missing');
  }
  if(route==='/starter-kit/'||route==='/buying/gear/'){
   const urls=['https://link.coupang.com/a/ienLu8j8IC','https://link.coupang.com/a/ienNhlQsPk'];
   for(const u of urls){
    const a=page.locator('a[href="'+u+'"]');
    if(await a.count()!==1)failed.push('missing or duplicate user-supplied single-product link '+u);
    else if(!(await a.getAttribute('rel')||'').includes('sponsored'))failed.push('affiliate link disclosure missing: '+u);
   }
   if(route==='/starter-kit/'&&await page.locator('.starter-secondary-affiliates-grid article').count()!==2)failed.push('radio and battery cards must both be visible');
   if(route==='/buying/gear/'&&await page.locator('.partner-model-pending').count()!==2)failed.push('radio and battery sales-validation notices missing');
  }
  if(route==='/starter-kit/'){
    for(const id of ['ienOFQc21I','ienRftVDYy','ienSxmfDUW']){
      const link=page.locator('a[href="https://link.coupang.com/a/'+id+'"]');
      if(await link.count()!==1 || !(await link.getAttribute('rel')||'').includes('sponsored'))failed.push('New affiliate product link missing: '+id);
    }
    if(await page.locator('.ready-shop-card img').count()!==3)failed.push('Three new product banners must appear in starter kit');
    if(await page.locator('.starter-affiliate-product-visual img').count()!==2)failed.push('Radio/power-bank portrait banners missing');
  }
  if(route==='/buying/food/' && await page.locator('[data-affiliate-offer="water"] img,[data-affiliate-offer="tuna"] img').count()!==2)failed.push('Water and tuna portraits missing');
  if(route==='/buying/gear/' && await page.locator('#drybag-coupang img').count()!==1)failed.push('Drybag photo missing');
  if(route==='/protocols/'){
    if(await page.locator('.protocol-stage-btn').count()!==6)failed.push('six period selector buttons missing');
    if(await page.locator('.protocol-item:visible').count()!==17)failed.push('3-day initial list must render seventeen items');
    if(await page.locator('.protocol-item-offer img').count()!==24)failed.push('all 24 approved protocol partner images must exist');
    if(!(await page.locator('#protocol-water-warning').textContent()||'').includes('CDC'))failed.push('first-stage water safety guidance missing');
  }
  if(['/starter-kit/','/buying/food/','/buying/gear/','/protocols/','/reviews/','/reviews/emergency-am-fm-radios/'].includes(route)){
   const crop=await page.locator('.product-photo-frame--banner .product-photo-window').first().evaluate(el=>{
     const frame=el.getBoundingClientRect();
     const img=el.querySelector('img')?.getBoundingClientRect();
     return {frameHeight:frame.height,imageHeight:img?.height||0,imageTop:img?.top||0,frameTop:frame.top,overflow:getComputedStyle(el).overflow};
   }).catch(()=>null);
   if(!crop || crop.imageHeight<crop.frameHeight*1.9 || crop.imageTop>=crop.frameTop || crop.overflow!=='hidden')
     failed.push('partner banner product-only crop not applied');
  }
  if(route==='/reviews/emergency-am-fm-radios/'){
   const card=page.locator('.review-product-compact').first();
   if(await card.locator('.review-product-photo .product-photo-frame--banner').count()!==1)failed.push('radio review still shows full affiliate banner');
   const aligned=await card.evaluate(el=>{
     const btn=el.querySelector('.review-cta')?.getBoundingClientRect();
     const box=el.getBoundingClientRect();
     return btn?btn.right>=box.right-40&&btn.bottom<=box.bottom&&btn.width<box.width*.85:false;
   });
   if(!aligned)failed.push('review shopping button not aligned at card lower right');
  }
  if(route==='/starter-kit/' && await page.locator('.ready-shop-footer').count()!==3)failed.push('buy buttons must be separate from all three new product photos');
    // Each outbound affiliate CTA must have a consistent short label, its
  // actual product in the accessible name, and no duplicate embedded CTA.
  if(['/starter-kit/','/buying/','/buying/gear/','/buying/food/','/protocols/','/reviews/emergency-am-fm-radios/','/reviews/fenix-e20-v2-flashlight/'].includes(route)){
    const buttons=page.locator('.ready-shop-footer a,.review-cta,.starter-affiliate-links a[href^="https://link.coupang.com/"],.partner-model-pending .partner-check-action,.protocol-item-offer a[href^="https://link.coupang.com/"],.starter-buy-now,.starter-missing-buy,.simple-buy-button,.shop-guide-buy');
    const num=await buttons.count();
    if(num===0)failed.push('no accessible purchase button found');
    for(const a of await buttons.all()){
      const text=(await a.textContent()||'').trim();
      const label=await a.getAttribute('aria-label')||'';
      const rel=await a.getAttribute('rel')||'';
      if(!text.startsWith('구매하기'))failed.push('inconsistent purchase CTA: '+text.slice(0,60));
      if(!label.includes('구매하기')||!label.includes('새 창'))failed.push('product-specific accessible purchase label missing');
      if(!rel.includes('sponsored')||!rel.includes('noopener'))failed.push('affiliate purchase rel incomplete');
    }
  }
  if(route==='/buying/'){
    if(await page.locator('.shop-guide-item').count()!==30)failed.push('buyer hub does not have exactly 30 candidate products');
    if(await page.locator('[data-shop-preset]').count()!==3)failed.push('missing connected and newest-product quick-filter buttons');
    if(await page.locator('.shop-guide-buy').count()!==30)failed.push('thirty genuine affiliate buttons not available');
    if(await page.locator('[data-buy-selected="yes"]').count()!==15)failed.push('fifteen newly linked product candidates missing');
    if(await page.locator('[data-buy-selected="yes"] .shop-guide-buy').count()!==15)failed.push('fifteen newest user-issued partner URLs must appear on selected products');
    if(await page.locator('[data-buy-linked="no"] .shop-guide-buy').count()>0)failed.push('unverified product has misleading buy button');
    if(await page.locator('.shop-guide-item:visible').count()<=0||await page.locator('.shop-guide-item:visible').count()>=30)failed.push('initial 3-day priority filter not effective');
    if(await page.locator('.shop-guide-group').count()!==6)failed.push('six buying departments missing');
    if(!await page.locator('#shop-guide-unchecked').isDisabled())failed.push('unchecked item filter must be unavailable without saved checklist');
  }
  if(route==='/checklist/'&&!details.hasStock)failed.push('stock manager missing');
  if(route==='/reviews/'){
   if(await page.locator('a.review-direct-buy').count()!==11)failed.push('review directory missing linked product CTA on eleven entries');
   if(await page.locator('.review-directory-shop').count()!==9)failed.push('nine evidence-only reviews require linked sale product previews');
   if(await page.locator('.review-directory-shop .product-photo-frame img').count()!==9)failed.push('review directory missing exact publisher-supplied related product photos');
   if(!((await page.locator('.review-affiliate-top').textContent())||'').includes('쿠팡 파트너스'))failed.push('review directory does not disclose purchase commissions');
  }
  if(route.startsWith('/reviews/')&&route!=='/reviews/'){
   if(await page.locator('.review-not-ready').count()!==0)failed.push('unbuyable comparison products must not have public tiles or status labels');
   if(await page.locator('.review-product-compact:not(:has(a.review-cta))').count()!==0)failed.push('public review includes a model without publisher-issued Coupang link');
   const visibleReviewText=await page.locator('body').innerText();
   if(/EB-P3400|EB-P4520|MMR-99|E12 V3\.0|TIKKINA|ACTIK CORE|Big River Dry Bag|Nite Ize|Tegaderm|1624W|Wilderness Wipes|SOL Emergency Blanket/i.test(visibleReviewText))
      failed.push('old comparison-only models are still visible in shopper-facing review');
   if(await page.locator('.review-related-buying').count()!==1)failed.push('review article missing approved related-products section');
   if(await page.locator('.review-related-buy-grid .ready-shop-card').count()<1)failed.push('review missing actionable offer matched to its topic');
   const urls=await page.locator('a[href^="https://link.coupang.com/a/"]').count();
   if(urls<1)failed.push('review article has no genuine linked purchase option');
   if(!((await page.locator('body').textContent())||'').includes('쿠팡 파트너스 활동의 일환'))failed.push('review article fails affiliate disclosure');
  }
  if(route.startsWith('/reviews/')&&route!=='/reviews/'&&route!=='/reviews/fenix-e20-v2-flashlight/'){
   const guide=page.locator('.review-decision');
   if(await guide.count()!==1||!await guide.isVisible())failed.push('review buyer decision must be visible without opening details');
  }
  if(route==='/buying/food/'){
   const guide=page.locator('.food-buying-decision');
   if(await guide.count()!==1||!await guide.isVisible()||await guide.locator('tbody tr').count()!==4)failed.push('four-row food buying comparison missing');
  }
  if(route==='/buying/'&&width===390){
   const initial=await page.evaluate(()=>({
    scripts:[...document.head.querySelectorAll('script[src]')].filter(s=>s.src.includes('googletagmanager.com/gtag/js?id=G-READYTEST123')).length,
    pageView:(window.dataLayer||[]).some(x=>x[0]==='config'&&x[1]==='G-READYTEST123'&&x[2].send_page_view===true),
    adDenied:(window.dataLayer||[]).some(x=>x[0]==='consent'&&x[1]==='default'&&x[2].ad_storage==='denied'),
    popup:!!document.getElementById('ga4-consent-panel'),
    off:window.__guidehollowGa4Disabled
   }));
   if(initial.scripts!==1||!initial.pageView||!initial.adDenied||initial.popup||initial.off)failed.push('Tag must appear once in head, start GA4 pageview and never show popup');
   await page.evaluate(()=>document.addEventListener('click',e=>{
    if(e.target instanceof Element&&e.target.closest('a[href^="https://link.coupang.com/a/"]'))e.preventDefault();
   },true));
   await page.locator('.shop-guide-item:visible a[href^="https://link.coupang.com/a/"]').first().click();
   const tracked=await page.evaluate(()=>(window.dataLayer||[]).some(x=>x[0]==='event'&&x[1]==='affiliate_click'&&typeof x[2].offer_code==='string'&&x[2].page_path==='/buying/'));
   if(!tracked)failed.push('Affiliate click does not register correct event');
   await page.locator('#ga4-settings').click();
   await page.waitForLoadState('domcontentloaded');
   const off=await page.evaluate(()=>({
    disabled:window.__guidehollowGa4Disabled,
    value:localStorage.getItem('guidehollow-ready-ga4-setting-v2'),
    config:(window.dataLayer||[]).some(x=>x[0]==='config'),
    label:document.getElementById('ga4-settings')?.textContent
   }));
   if(!off.disabled||off.value!=='off'||off.config||off.label!=='방문 통계 켜기')failed.push('Footer opt-out must disable tracking on reload');
   await page.locator('#ga4-settings').click();
   await page.waitForLoadState('domcontentloaded');
   const restored=await page.evaluate(()=>!window.__guidehollowGa4Disabled&&(window.dataLayer||[]).some(x=>x[0]==='config'));
   if(!restored)failed.push('Footer opt-in must restore GA4 pageview after reload');
  }
  if(route==='/buying/food/'&&await page.locator('.ready-shop-card').count()!==8)failed.push('food page missing six supplementary approved purchase offers');
  if(route==='/buying/gear/'&&(await page.locator('.ready-shop-card').count()!==19||await page.locator('a.review-direct-buy').count()!==1))failed.push('gear page missing registered supplemental product cards or exact flashlight CTA');
  if(route==='/reviews/fenix-e20-v2-flashlight/'){
    const a=await page.locator('a[href="https://link.coupang.com/a/idtdhvDZ3A"]').first();
    if(await a.count()===0)failed.push('matching E20 affiliate link missing');
    else if(!(await a.getAttribute('rel')||'').includes('sponsored'))failed.push('affiliate disclosure missing');
  }
  if(width===390&&['/','/reviews/emergency-am-fm-radios/','/drill/','/emergency/','/family-emergency/','/family-card/','/starter-kit/','/buying/','/checklist/','/plan/','/reviews/','/reviews/fenix-e20-v2-flashlight/'].includes(route)){
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
  // Simulate a shopper: only explicitly flagged needs may reveal products.
  const waterNeed=page.locator('[data-home-fast-question="water"] input[value="need"]');
  const lightNeed=page.locator('[data-home-fast-question="light"] input[value="need"]');
  const foodHave=page.locator('[data-home-fast-question="food"] input[value="have"]');
  await waterNeed.check();
  await lightNeed.check();
  await foodHave.check();
  if((await page.locator('.home-fast-result-card:visible').count())!==2)errors.push({width,route:'/',issues:['fast check should show only two selected product cards']});
  if(!await page.locator('[data-home-fast-product="water"]').isVisible()||!await page.locator('[data-home-fast-product="light"]').isVisible()||await page.locator('[data-home-fast-product="food"]').isVisible())errors.push({width,route:'/',issues:['fast check need-to-product mapping incorrect']});
  const urls=await page.locator('.home-fast-result-card:visible .home-fast-buy').evaluateAll(links=>links.map(el=>el.getAttribute('href')));
  if(urls.length!==2||!urls.includes('https://link.coupang.com/a/ienOFQc21I')||!urls.includes('https://link.coupang.com/a/idtdhvDZ3A'))errors.push({width,route:'/',issues:['verified product links mismatched or unavailable']});
  const firstA=page.locator('[data-home-fast-product="water"] a.home-fast-buy');
  if(!(await firstA.getAttribute('rel')||'').includes('sponsored')||!(await firstA.getAttribute('aria-label')||'').includes('쿠팡에서 구매하기'))errors.push({width,route:'/',issues:['quick check purchase accessibility or sponsored disclosure missing']});
  if(await page.evaluate(()=>localStorage.getItem('guidehollow-ready-quick-check-v1'))!==null)errors.push({width,route:'/',issues:['quick check must not store answers without explicit save']});
  await page.locator('#home-fast-people').fill('3');
  await page.locator('#home-fast-water-owned').fill('12');
  if((await page.locator('#home-fast-water-total').textContent())!=='34.2L'||(await page.locator('#home-fast-water-gap').textContent())!=='22.2L'||(await page.locator('#home-fast-water-packs').textContent())!=='1')
    errors.push({width,route:'/',issues:['household water estimate is inaccurate']});
  await page.locator('#home-fast-save').click();
  if(await page.evaluate(()=>localStorage.getItem('guidehollow-ready-quick-check-v1'))===null||!(await page.evaluate(()=>JSON.parse(localStorage.getItem('guidehollow-ready-check-v1')||'[]'))).includes('shelf-food'))
    errors.push({width,route:'/',issues:['explicit opt-in must persist quiz and merge confirmed ownership without losing checklist data']});
  await page.goto(`http://127.0.0.1:${PORT}/buying/?from=quick`);
  if(await page.locator('.shop-guide-item:visible').count()!==2||!(await page.locator('[data-buy-id="drinking-water"]').isVisible())||!(await page.locator('[data-buy-id="flashlight"]').isVisible()))
    errors.push({width,route:'/buying/',issues:['saved quick check must show exactly the two buyer needs']});
  await page.goto(`http://127.0.0.1:${PORT}/`);
  if((await page.locator('.home-fast-result-card:visible').count())!==2)
    errors.push({width,route:'/',issues:['saved home answers must survive navigation']});
  await page.locator('#home-fast-reset').click();
  await page.evaluate(()=>localStorage.removeItem('guidehollow-ready-check-v1'));
  await page.reload();
  if(!await page.locator('#home-fast-results').isHidden()||(await page.locator('.home-fast-result-card:visible').count())!==0)errors.push({width,route:'/',issues:['quick check reset should remove product prompts']});
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
  const offerToggle=page.locator('#starter-offer-toggle');
  if(await offerToggle.isDisabled())errors.push({width,route:'/starter-kit/',issues:['stored checklist should activate read-only purchase filter']});
  if((await page.locator('[data-offer-check-id]').count())!==5)errors.push({width,route:'/starter-kit/',issues:['five exact baseline offer links not present']});
  if(!(await page.locator('[data-offer-check-id="lamp"] [data-offer-check-status]').textContent()||'').includes('체크됨'))errors.push({width,route:'/starter-kit/',issues:['flashlight status not synced with checked detailed item']});
  await offerToggle.click();
  if((await page.locator('[data-offer-check-id]:visible').count())!==3)errors.push({width,route:'/starter-kit/',issues:['filter must show three unchecked items after lamp and water are checked']});
  if(await page.locator('[data-affiliate-offer="drybag"]:visible').count()!==0)errors.push({width,route:'/starter-kit/',issues:['optional drybag incorrectly treated as checklist requirement']});
  if((await page.locator('#starter-ready-count').textContent())!=='0')errors.push({width,route:'/starter-kit/',issues:['filter must never mark six broad categories as complete']});
  await offerToggle.click();
  if((await page.locator('[data-offer-check-id]:visible').count())!==5||await page.locator('[data-affiliate-offer="drybag"]:visible').count()!==1)errors.push({width,route:'/starter-kit/',issues:['all products did not reappear after clearing filter']});
  await page.evaluate(()=>localStorage.setItem('guidehollow-ready-check-v1','{damaged'));
  await page.reload();
  if(!(await page.locator('#starter-offer-toggle').isDisabled())||(await page.locator('[data-offer-check-id]:visible').count())!==5)errors.push({width,route:'/starter-kit/',issues:['corrupt saved data must safely disable filter and preserve all products']});
  await page.evaluate(()=>localStorage.removeItem('guidehollow-ready-check-v1'));
  await page.reload();
  if(!(await page.locator('#starter-offer-toggle').isDisabled()))errors.push({width,route:'/starter-kit/',issues:['no checklist record must not pretend to know missing items']});
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
  await page.evaluate(()=>localStorage.removeItem('guidehollow-ready-check-v1'));
  await page.goto(`http://127.0.0.1:${PORT}/buying/`);
  if(await page.locator('.shop-guide-item').count()!==30)errors.push({width,route:'/buying/',issues:['exactly thirty buying candidates required']});
  if(await page.locator('.shop-guide-item:visible').count()!==5)errors.push({width,route:'/buying/',issues:['initial buyer view should focus on five essential products']});
  await page.locator('[data-shop-preset="linked"]').click();
  if(await page.locator('#shop-guide-duration').inputValue()!=='30'||await page.locator('#shop-guide-link-filter').inputValue()!=='linked'||await page.locator('.shop-guide-item:visible').count()!==30)
    errors.push({width,route:'/buying/',issues:['one-click linked view must expose all 30 offers across preparation periods']});
  await page.locator('[data-shop-preset="fresh"]').click();
  if(await page.locator('.shop-guide-item:visible').count()!==3||await page.locator('.shop-guide-item:visible .shop-guide-buy').count()!==3)
    errors.push({width,route:'/buying/',issues:['latest three products must all show real purchase buttons']});
  for(const [id,slug,photo] of [
    ['portable-toilet','ie6X3NqmNo','ddfd6058600935242c091d59182480bc@2x.jpg'],
    ['baby-diapers','ie6Y9sb1a0','e1fccea5f98fa0ac48e3254ee6e1b2c3@2x.jpg'],
    ['pet-food','ie6Z9UwjsW','337c9eb358e795da292234e097bd988d@2x.jpg']
  ]){
    const product=page.locator('[data-buy-id="'+id+'"]');
    const url=await product.locator('a.shop-guide-buy').getAttribute('href');
    const banner=await product.locator('.product-photo-frame--banner img').getAttribute('src');
    if(!await product.isVisible()||url!=='https://link.coupang.com/a/'+slug||!banner?.includes(photo))
      errors.push({width,route:'/buying/',issues:['last partner tag mapping mismatch '+id]});
  }
  if(!(await page.locator('[data-buy-id="baby-diapers"]').textContent()||'').includes('팬티형')||
     !(await page.locator('[data-buy-id="pet-food"]').textContent()||'').includes('고양이'))
    errors.push({width,route:'/buying/',issues:['family suitability and species restrictions missing']});
  await page.locator('[data-shop-preset="initial"]').click();
  if(await page.locator('#shop-guide-duration').inputValue()!=='3'||await page.locator('#shop-guide-link-filter').inputValue()!=='all')
    errors.push({width,route:'/buying/',issues:['one-click initial view did not restore three-day preparation']});
  await page.locator('#shop-guide-duration').selectOption('30');
  if(await page.locator('.shop-guide-item:visible').count()!==30)errors.push({width,route:'/buying/',issues:['30-day filter should show all 30 candidates']});
  await page.locator('#shop-guide-link-filter').selectOption('linked');
  if(await page.locator('.shop-guide-item:visible').count()!==30)errors.push({width,route:'/buying/',issues:['linked-only filter must show exactly 30 publisher-issued affiliate offers']});
  await page.locator('#shop-guide-link-filter').selectOption('selected');
  if(await page.locator('.shop-guide-item:visible').count()!==15)errors.push({width,route:'/buying/',issues:['selected-only filter must show exactly fifteen newest products']});
  for(const id of ['ready-meals','charging-cable','hand-soap','waste-bags','sterile-gauze','backpack','ready-snacks','led-lantern','whistle','water-container','food-bins','document-pouch','rain-poncho','utensils','car-charger']){
    const card=page.locator('[data-buy-id="'+id+'"]');
    if(!await card.isVisible()||await card.locator('.shop-guide-buy').count()!==1)errors.push({width,route:'/buying/',issues:['newly linked product needs its own verified purchase URL '+id]});
  }
  for(const [item,url] of [
    ['ready-meals','ieOGyQEiDQ'],['charging-cable','ieOIzHSJZk'],['hand-soap','ieOLFFT9Ua'],
    ['waste-bags','ieONgl6IV2'],['sterile-gauze','ieOPxyN1VI'],['backpack','iePsXGU1F6'],
    ['ready-snacks','iePvyD2Ywe'],['led-lantern','iePwJgYiAK'],['whistle','iePyyD8lZk'],
    ['water-container','ieQaqXhm9Y'],['food-bins','ieQi5ugNwG'],['document-pouch','ieQkYMMM9Y'],
    ['rain-poncho','ieQmvw3VzU'],['utensils','ieQnVXXJ36'],['car-charger','ieQsAO8UbQ']
  ]){
    const card=page.locator('[data-buy-id="'+item+'"]');
    if((await card.locator('.shop-guide-buy').getAttribute('href'))!=='https://link.coupang.com/a/'+url)
      errors.push({width,route:'/buying/',issues:['new offer has incorrect exact product URL '+item]});
    if(await card.locator('.product-photo-frame--banner').count()!==1)
      errors.push({width,route:'/buying/',issues:['new offer missing supplier product photo '+item]});
  }
  await page.locator('#shop-guide-link-filter').selectOption('fresh');
  if(await page.locator('.shop-guide-item:visible').count()!==3)errors.push({width,route:'/buying/',issues:['new three-only filter is broken']});
  if(await page.locator('[data-buy-linked="no"]').count()!==0)errors.push({width,route:'/buying/',issues:['still has unlinked item']});
  await page.locator('#shop-guide-link-filter').selectOption('all');
  await page.locator('#shop-guide-category').selectOption('food');
  if(await page.locator('.shop-guide-item:visible').count()!==8)errors.push({width,route:'/buying/',issues:['food category should show eight candidates']});
  await page.locator('#shop-guide-category').selectOption('all');
  await page.locator('#shop-guide-duration').selectOption('90');
  if(await page.locator('.shop-guide-item:visible').count()!==30||!(await page.locator('#shop-guide-period-note').textContent()||'').includes('더 많이 사라는 뜻이 아닙니다'))errors.push({width,route:'/buying/',issues:['90-day stage must not invent additional buying requirements']});
  await page.evaluate(()=>localStorage.setItem('guidehollow-ready-check-v1',JSON.stringify(['water-bottles','radio'])));
  await page.reload();
  if(await page.locator('#shop-guide-unchecked').isDisabled())errors.push({width,route:'/buying/',issues:['read-only detailed checklist toggle not enabled with valid record']});
  await page.locator('#shop-guide-unchecked').click();
  if(await page.locator('[data-buy-id="drinking-water"]').isVisible()||await page.locator('[data-buy-id="radio"]').isVisible())errors.push({width,route:'/buying/',issues:['already checked relevant categories should be excluded']});
  if(await page.evaluate(()=>localStorage.getItem('guidehollow-ready-check-v1'))!=='["water-bottles","radio"]')errors.push({width,route:'/buying/',issues:['buying guide must never modify detailed checklist data']});
  await page.locator('#shop-guide-clear').click();
  if(await page.locator('#shop-guide-duration').inputValue()!=='3'||await page.locator('#shop-guide-link-filter').inputValue()!=='all')errors.push({width,route:'/buying/',issues:['reset all filters should return to 3-day complete catalogue view']});
  await page.evaluate(()=>localStorage.removeItem('guidehollow-ready-check-v1'));
  await page.reload();
  if(!await page.locator('#shop-guide-unchecked').isDisabled())errors.push({width,route:'/buying/',issues:['empty record should not claim to know owned products']});
  await page.goto(`http://127.0.0.1:${PORT}/protocols/`);
  if(await page.locator('.protocol-item:visible').count()!==17)errors.push({width,route:'/protocols/',issues:['3-day initial card count incorrect']});
  await page.locator('#protocol-people').fill('3');
  await page.locator('#protocol-water-owned').fill('10');
  if((await page.locator('#protocol-water-total').textContent())!=='34.2 L'||(await page.locator('#protocol-water-gap').textContent())!=='24.2 L'||(await page.locator('#protocol-water-cartons').textContent())!=='2묶음')errors.push({width,route:'/protocols/',issues:['3-day family water 24L-package estimate incorrect']});
  await page.locator('button[data-protocol-days="14"]').click();
  if((await page.locator('#protocol-water-total').textContent())!=='159.6 L'||(await page.locator('#protocol-water-cartons').textContent())!=='7묶음')errors.push({width,route:'/protocols/',issues:['14-day staged water arithmetic incorrect']});
  await page.locator('button[data-protocol-days="90"]').click();
  if((await page.locator('#protocol-water-total').textContent())!=='1026.0 L'||!(await page.locator('#protocol-water-cartons-card').isHidden()))errors.push({width,route:'/protocols/',issues:['90-day simulation must hide bulk bottle purchase quantities']});
  await page.locator('#protocol-mode-new').click();
  if((await page.locator('.protocol-item:visible').count())!==2)errors.push({width,route:'/protocols/',issues:['90-day incremental mode should show two new plans only']});
  await page.locator('#protocol-mode-all').click();
  if((await page.locator('.protocol-item:visible').count())!==37)errors.push({width,route:'/protocols/',issues:['90-day cumulative inventory must show all 37 items']});
  await page.evaluate(()=>localStorage.setItem('guidehollow-ready-check-v1',JSON.stringify(['lamp','radio'])));
  await page.reload();
  if(!(await page.locator('[data-protocol-item="flashlight"] [data-protocol-check-status]').textContent()||'').includes('체크됨'))errors.push({width,route:'/protocols/',issues:['read-only checklist integration not displaying existing selected item']});
  const storedAfter=await page.evaluate(()=>localStorage.getItem('guidehollow-ready-check-v1'));
  if(storedAfter!==JSON.stringify(['lamp','radio']))errors.push({width,route:'/protocols/',issues:['protocol wrote back into original checklist data']});
  await page.evaluate(()=>localStorage.removeItem('guidehollow-ready-check-v1'));
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
