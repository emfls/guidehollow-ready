import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
const required=['index.html','CNAME','.nojekyll','favicon.svg','robots.txt','sitemap.xml','rss.xml','reviews/index.html','starter-kit/index.html','protocols/index.html','drill/index.html','situations/index.html','checklist/index.html','plan/index.html','buying/food/index.html','buying/gear/index.html','about/index.html','disclosure/index.html','privacy/index.html','sources/index.html'];
const file=(p)=>readFileSync(join('dist',p),'utf8');
for(const p of required)if(!existsSync(join('dist',p)))throw Error('Build missing '+p);
if(file('CNAME').trim()!=='ready.guidehollow.com')throw Error('CNAME mismatch');
const pages=required.filter(p=>p.endsWith('index.html'));
for(const p of pages){
 const html=file(p);
 if(!html.includes('4a3c4cef3cedf9582280c00ff70ebff66b9b7de8'))throw Error('Missing Naver verification tag: '+p);
 if(!html.includes('noindex, follow'))throw Error('Premature search indexing: '+p);
 if(!html.includes('ready.guidehollow.com'))throw Error('Wrong canonical host: '+p);
}
const design=readFileSync('src/styles/night-layout.css','utf8');
for(const rule of ['.mobile-tabbar','.review-directory-grid','.starter-set-grid','@media(max-width:540px)','word-break:keep-all','grid-auto-rows:auto']) if(!design.includes(rule))throw Error('Mobile-first shared design contract missing: '+rule);
const home=file('index.html');
if (!home.includes('mobile-tabbar') || !home.includes('aria-label="모바일 빠른 메뉴"')) throw Error('Unified mobile navigation missing');
if (home.includes('home-three-steps') || home.includes('ui-refresh.css')) throw Error('Redundant light homepage design still present');
if (!design.includes('color-scheme:dark') || !design.includes('#0e151d')) throw Error('Dark theme regression');
if (!home.includes('name="theme-color" content="#0e151d"')) throw Error('Night operations browser theme is missing');
if (!home.includes('stylesheet')) throw Error('Site styles missing');
if(!home.includes('평상시 대비')||!home.includes('/checklist/')||!home.includes('실시간 재난 경보 서비스가 아닙니다'))throw Error('Emergency-first homepage incomplete');
if(home.includes('공포를 이용하지 않습니다')||home.includes('불안을 키우는 정보 대신'))throw Error('Removed editorial slogans reappeared');
const heroHeading = home.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/)?.[1] ?? '';
if(!heroHeading.includes('전시·재난 대비,') || !heroHeading.includes('필요한 준비부터.') || /<br\s*\/?>/i.test(heroHeading))throw Error('Main headline should flow without forced line breaks');
if(home.includes('class="status-dot"')||home.includes('class="eyebrow-dot"')||home.includes('R<span>·</span>'))throw Error('Decorative pseudo-status lights should not appear');

const feed=file('rss.xml');
if (!feed.includes('<rss version="2.0"')||!feed.includes('<language>ko-KR</language>')||!feed.includes('/situations/')||!feed.includes('실시간 재난 경보가 아닙니다'))throw Error('RSS feed is missing safety entries or metadata');
if (!home.includes('type="application/rss+xml"')||!home.includes('href="/rss.xml"'))throw Error('RSS feed discovery link missing');
if (feed.includes('sample-draft'))throw Error('Draft appeared in RSS');
if (!home.includes('평상시 준비하기') || !home.includes('어떤 상황인가요?') || !home.includes('/emergency/#air-raid') || !home.includes('/emergency/#chemical')) throw Error('Emergency and routine modes must remain distinct');
if ((home.match(/class="brief-card"/g)||[]).length!==3 || (home.match(/class="situation-hub-card"/g)||[]).length!==4)throw Error('Homepage must show three starter choices and four other-event shortcuts');
if (home.includes('href="/situations/#chemical"') || home.includes('href="/situations/#nuclear"') || home.includes('href="/situations/#air-raid"'))throw Error('Home repeats the three urgent scenarios in the routine cards');
if (!home.includes('home-checked-count') || !home.includes('guidehollow-ready-check-v1') || !home.includes('data-check-ids='))throw Error('Home checklist progress cannot reflect local saved 22-item data');
if(!home.includes('href="/situations/"'))throw Error('All safety scenarios must remain reachable');
if (!home.includes('emergency-home-action')||!home.includes('/emergency/#air-raid')||!home.includes('공식 민방위 대피소 찾기')) throw Error('Urgent action not reachable from top of homepage');
if (home.indexOf('emergency-home-action')>home.indexOf('hero brief-hero')) throw Error('Immediate safety must precede routine preparation');
for (const x of ['emergency/index.html','family-emergency/index.html','family-card/index.html','offline/ready-card.html']) if(!existsSync(join('dist',x)))throw Error('User-test P0/P1 deliverable missing: '+x);
const navLinks=(home.split('<nav class="site-nav"')[1]||'').split('</nav>')[0];
if((navLinks.match(/<a /g)||[]).length!==5)throw Error('Desktop navigation should offer exactly five predictable destinations');
if(!home.includes('href="/family-emergency/"') && !file('emergency/index.html').includes('href="/family-emergency/"'))throw Error('Infant and elder emergency guidance unavailable');
const urgent=file('emergency/index.html');
if(!urgent.includes('instant-steps-grid') || !urgent.includes('민방위 대피소 공식 지도') || !urgent.includes('/offline/ready-card.html')||!urgent.includes('상황에 맞는 첫 3단계부터 확인하세요'))throw Error('First 3 actions and offline/shelter route missing');
if(!urgent.includes('공식 지시를 따르세요.')||!urgent.includes('안전한 실내에서 벗으세요.'))throw Error('Full chemical or nuclear first action text has been truncated at source');
if(!design.includes('never truncate')||!design.includes('line-clamp:unset'))throw Error('Critical emergency cards must never clamp safety instructions');
const details=file('situations/index.html');
if(!details.includes('first-three-visible')||!details.includes('action-details'))throw Error('Immediate actions not persistently visible in detailed scenarios');
const familyNow=file('family-emergency/index.html');
if(!familyNow.includes('영유아와 함께')||!familyNow.includes('고령자')||!familyNow.includes('유모차'))throw Error('Family emergency screen incomplete');
const familyCard=file('family-card/index.html');
if(!familyCard.includes('print-family-card')||!familyCard.includes('서버로 전송하거나 자동 저장하지 않습니다'))throw Error('Printable private family card missing');
const offline=file('offline/ready-card.html');
if(!offline.includes('재난 행동카드')||!offline.includes('핵 경보')||!offline.includes('@media print')||offline.includes('<script src='))throw Error('Standalone offline file must be self-contained and printable');
const situationPage=file('situations/index.html');
if (!situationPage.includes('situation-shortcuts') || !situationPage.includes('first-action') || !situationPage.includes('action-details')) throw Error('Progressive situation action cards missing');
if (!file('buying/food/index.html').includes('buying-summary-grid') || !file('buying/gear/index.html').includes('buying-summary-grid')) throw Error('Evidence-first buying cards missing');
const reviewHub=file('reviews/index.html');
if(!reviewHub.includes('review-directory-grid')||!reviewHub.includes('review-featured-grid'))throw Error('Readable review directory not generated');
if (!reviewHub.includes('쿠팡 구매 링크는 등록 당시 동일 모델·옵션이 확인된 경우에만 표시하며')||!reviewHub.includes('/reviews/emergency-flashlights-headlamps/')) throw Error('Verified product hub is missing purchase verification notice or existing report');
if (!home.includes('href="/reviews/"')) throw Error('Product comparison discoverability missing from home');
if (!home.includes('href="/drill/"')) throw Error('Short routine practice is not linked from home');
const drill=file('drill/index.html');
if (!drill.includes('data-answer="correct"') || !drill.includes('aria-live="polite"') || !drill.includes('실제 위험한 상황인가요?') || !drill.includes('/situations/#chemical')) throw Error('Practice page lacks interactive safe answers or emergency caveat');
if((drill.match(/class="drill-card"/g)||[]).length!==3) throw Error('Exactly three short practice scenarios required');
const starter=file('starter-kit/index.html');
const starterSource=readFileSync('src/pages/starter-kit.astro','utf8');
if(!starter.includes('우리 집 비상 준비')||!starterSource.includes('guidehollow-ready-starter-set-v1')||!starter.includes('페닉스 E20 V2.0')||!starter.includes('idtdhvDZ3A'))throw Error('Starter kit missing functional checklist or vetted shopping product');
if(starter.includes('iframe')||starter.includes('한 번에 구매 완료'))throw Error('Unsafe iframe or misleading whole-kit purchase claim');
if(!starter.includes('id="starter-personal"')||!starter.includes('id="starter-missing-count"')||!starter.includes('id="starter-people"')||!starter.includes('id="starter-water-owned"'))throw Error('Household calculator or missing-item overview not generated');
if(!starter.includes('id="starter-detail-bridge"')||!starter.includes('data-base-ids=')||!starter.includes('data-crosswalk=')||!starter.includes('id="starter-detail-done"')||!starterSource.includes('guidehollow-ready-check-v1'))throw Error('Non-destructive 22-item detail bridge missing');
if(!starter.includes('완료로 자동 처리하지 않습니다')||!design.includes('.starter-detail-areas'))throw Error('Broad and detailed check statuses must remain distinct');
if(!starter.includes('미체크는 미보유 확정이 아닙니다')||!starter.includes('현재 가격·재고·판매자·배송은 쿠팡에서 확인하세요'))throw Error('Shopping area lacks non-coercive disclosure of verification limits');
if(!starter.includes('data-missing-for="water"')||!starter.includes('data-missing-for="light"')||!starter.includes('id="starter-show-unchecked"')||!starter.includes('id="starter-copy-missing"'))throw Error('Missing-only product decision tool incomplete');
if((starter.match(/https:\/\/link\.coupang\.com\/a\/idtdhvDZ3A/g)||[]).length<1)throw Error('Approved affiliate link lost');
if(!starter.includes('id="starter-offer-filter"')||!starter.includes('id="starter-offer-toggle"')||!starter.includes('id="starter-offer-status"'))throw Error('Checklist-linked purchasing filter UI missing');
for(const id of ['lamp','radio','powerbank','water-bottles','shelf-food']){
 if(!starter.includes('data-offer-check-id="'+id+'"'))throw Error('Missing exact item linkage for purchase option: '+id);
}
if(starter.includes('data-affiliate-offer="drybag" data-offer-check-id='))throw Error('Optional drybag must not masquerade as a mandatory checklist item');
if(!starterSource.includes('syncOfferFilter')||!starterSource.includes("window.addEventListener('pageshow',syncOfferFilter)")||!starterSource.includes('onlyUncheckedOffers'))throw Error('Checklist offer filter does not synchronize on navigation');
if(starterSource.includes("localStorage.setItem('guidehollow-ready-check-v1'"))throw Error('Read-only purchase filter must not modify detailed checklist');
if(!design.includes('.starter-offer-filter-actions')||!design.includes('.ready-shop-checkstatus'))throw Error('Purchase filter mobile styles missing');
const protocolHtml=file('protocols/index.html');
const protocolSource=readFileSync('src/pages/protocols/index.astro','utf8');
const protocolData=readFileSync('src/data/protocols.ts','utf8');
for(const days of [3,7,14,30,60,90]){
 if(!protocolHtml.includes('data-protocol-days="'+days+'"'))throw Error('Protocol stage missing '+days);
 if(!protocolData.includes('days:'+days+','))throw Error('Missing defined protocol stage '+days);
}
if(!protocolHtml.includes('protocol-water-total')||!protocolHtml.includes('protocol-water-cartons')||!protocolSource.includes('chosenDays>14'))throw Error('Progressive family water calculator missing');
if(!protocolHtml.includes('정부 의무 기준이 아닌')||!protocolHtml.includes('90일치')||!protocolHtml.includes('국민안전24'))throw Error('Long-term protocols must not be presented as official mandatory purchase quantities');
for(const id of ['water','tuna','flashlight','radio','battery','drybag'])if(!protocolHtml.includes('data-protocol-item="'+id+'"'))throw Error('Missing core item '+id);
for(const id of ['ienLu8j8IC','ienNhlQsPk','ienOFQc21I','ienRftVDYy','ienSxmfDUW','idtdhvDZ3A'])if(!protocolHtml.includes('https://link.coupang.com/a/'+id))throw Error('Protocol missing verified single-product affiliate '+id);
if(!protocolHtml.includes('쿠팡 파트너스 활동의 일환')||!protocolHtml.includes('rel="sponsored nofollow noopener noreferrer"'))throw Error('Protocol affiliate disclosure or sponsored rel missing');
if(protocolSource.includes("localStorage.setItem('guidehollow-ready-check-v1'"))throw Error('Protocol must never write back the baseline checklist');
if(!protocolHtml.includes('https://www.cdc.gov/')||!protocolHtml.includes('https://safekorea.go.kr/'))throw Error('Protocol official sources missing');
if(!home.includes('/protocols/')||!starter.includes('/protocols/')||!file('checklist/index.html').includes('/protocols/'))throw Error('Protocol not discoverable from homepage, starter hub and checklist');
if(!file('sitemap.xml').includes('https://ready.guidehollow.com/protocols/'))throw Error('New protocol route missing in sitemap');
const gear=file('buying/gear/index.html');
for(const id of ['ienLu8j8IC','ienNhlQsPk']){
 const url='https://link.coupang.com/a/'+id;
 if(!gear.includes(url)||!starter.includes(url))throw Error('Supplied affiliate URL missing from buying page or starter kit: '+id);
 if(!gear.includes('rel="sponsored nofollow noopener noreferrer"')||!starter.includes('rel="sponsored nofollow noopener noreferrer"'))throw Error('Supplied affiliate URL requires disclosure and safe link attributes');
}
if(!gear.includes('소니 ICF-P26, 블랙')||!gear.includes('삼성 EB-P3401XUKGKR, 베이지')||!gear.includes('쿠팡 파트너스 활동의 일환')||!starter.includes('삼성 EB-P3401'))throw Error('Coupang model and affiliate notices must reflect observed product options');
const radioReview=file('reviews/emergency-am-fm-radios/index.html');
if(!radioReview.includes('ienLu8j8IC')||!radioReview.includes('7757158175')||!radioReview.includes('20909933080')||!radioReview.includes('sponsored nofollow'))throw Error('Matched ICF-P26 radio purchase card not displayed');
if(!file('reviews/coupang-stock-audit-samsung-p3400-p3401/index.html').includes('EB-P3401XUKGKR'))throw Error('Stock audit has not been updated with verified 2026 Samsung model');
if(!gear.includes('class="guide-product-visual"')||!gear.includes('페닉스 E20 V2.0 손전등 상품 사진')||!gear.includes('class="partner-product-visual"'))throw Error('Shopping cards need real Fenix photo and media slots for exact radio and battery models');
if((starter.match(/class="starter-affiliate-product-visual"/g)||[]).length!==2)throw Error('Radio and power-bank photo tiles missing');
for(const id of ['ienLu8j8IC','ienNhlQsPk','ienOFQc21I','ienRftVDYy','ienSxmfDUW']){
 if(!starter.includes('https://link.coupang.com/a/'+id))throw Error('Missing user-provided link in starter hub '+id);
}
const food=file('buying/food/index.html');
for(const id of ['ienOFQc21I','ienRftVDYy'])if(!food.includes('https://link.coupang.com/a/'+id))throw Error('Water or tuna product missing '+id);
if(!gear.includes('ienSxmfDUW'))throw Error('5L drybag product missing in gear');
if(!radioReview.includes('2773295bd616eb0be0db4e5b696d0f9f@2x.jpg'))throw Error('Radio review missing official product banner');
const bannerSource=readFileSync('src/data/affiliate-product-visuals.ts','utf8');
for(const key of ['radio','battery','water','tuna','drybag'])if(!bannerSource.includes(key+": '<a href="))throw Error('Exact vendor banner absent: '+key);
if(starter.includes('referrerpolicy="unsafe-url"')||food.includes('referrerpolicy="unsafe-url"')||gear.includes('referrerpolicy="unsafe-url"'))throw Error('Unsafe partner HTML attributes leaked into rendered page');
if(!design.includes('.ready-shop-image img')||!design.includes('object-fit:contain'))throw Error('Portrait banner sizing missing');
const mediaSource=readFileSync('src/data/affiliate-product-visuals.ts','utf8');
if(!mediaSource.includes('parseStaticPartnerHtml')||!mediaSource.includes("parsed?.url===offer.url")||!mediaSource.includes("officialImageTags"))throw Error('Product image source must be official and URL-matched');
const e20=file('reviews/fenix-e20-v2-flashlight/index.html');
if(!e20.includes('simple-product-hero')||!e20.includes('simple-product-media')||!e20.includes('simple-buy-button')||!e20.includes('idtdhvDZ3A')||!e20.includes('sponsored nofollow'))throw Error('Product landing needs top image, visible buy button and verified link');
if(e20.includes('공식 밝기와 사용 시간을 구별해야 합니다')||e20.includes('pageKey=2211811247'))throw Error('Technical tracking or dense old table leaked into shopping landing');
const check=file('checklist/index.html');
if (!check.includes('check-category-nav') || !check.includes('id="kit-water"')) throw Error('Checklist group navigation missing');
if(!check.includes('data-key="water-bottles"')||!check.includes('ready-progress')||!check.includes('localStorage'))throw Error('Interactive checklist incomplete');
if(!file('plan/index.html').includes('가족 비상연락 카드'))throw Error('Printable family plan missing');
if(!file('buying/food/index.html').includes('30일분')||!file('buying/gear/index.html').includes('일산화탄소'))throw Error('Buying safety guidance missing');
const sitemap=file('sitemap.xml');
if (!sitemap.includes('https://ready.guidehollow.com/starter-kit/')) throw Error('Starter kit missing from sitemap');
if (!sitemap.includes('https://ready.guidehollow.com/reviews/')) throw Error('Review index absent from sitemap');
if (!sitemap.includes('https://ready.guidehollow.com/rss.xml')) throw Error('Sitemap missing RSS');
if(!sitemap.includes('https://ready.guidehollow.com/checklist/'))throw Error('Sitemap missing');
for(const p of ['/emergency/','/family-emergency/','/family-card/'])if(!sitemap.includes('https://ready.guidehollow.com'+p))throw Error('Sitemap lacks '+p);
if(sitemap.includes('sample-draft')||existsSync(join('dist','reviews','sample-draft','index.html')))throw Error('Draft leaked');
if(!file('robots.txt').includes('https://ready.guidehollow.com/sitemap.xml'))throw Error('Robots sitemap missing');
const reviewDir=join('dist','reviews');
if(existsSync(reviewDir)){
 for(const entry of readdirSync(reviewDir,{withFileTypes:true}).filter(x=>x.isDirectory())){
  const content=file(`reviews/${entry.name}/index.html`);
  if(!content.includes('검증 근거')||!content.includes('noindex, follow'))throw Error('Review evidence or noindex missing: '+entry.name);
 }
}
console.log('GuideHollow Ready smoke test passed: official-sources safety pages, Naver meta, SEO guard, checklist, review isolation.');
