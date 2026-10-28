import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
const required=['index.html','CNAME','.nojekyll','favicon.svg','robots.txt','sitemap.xml','rss.xml','reviews/index.html','starter-kit/index.html','situations/index.html','checklist/index.html','plan/index.html','buying/food/index.html','buying/gear/index.html','about/index.html','disclosure/index.html','privacy/index.html','sources/index.html'];
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
for(const rule of ['.mobile-tabbar','.review-directory-grid','.starter-set-grid','@media(max-width:540px)','word-break:keep-all','grid-auto-rows:1fr']) if(!design.includes(rule))throw Error('Mobile-first shared design contract missing: '+rule);
const home=file('index.html');
if (!home.includes('mobile-tabbar') || !home.includes('aria-label="모바일 빠른 메뉴"')) throw Error('Unified mobile navigation missing');
if (home.includes('home-three-steps') || home.includes('ui-refresh.css')) throw Error('Redundant light homepage design still present');
if (!design.includes('color-scheme:dark') || !design.includes('#0e151d')) throw Error('Dark theme regression');
if (!home.includes('name="theme-color" content="#0e151d"')) throw Error('Night operations browser theme is missing');
if (!home.includes('stylesheet')) throw Error('Site styles missing');
if(!home.includes('전시·재난 대비 생활 안내')||!home.includes('/checklist/')||!home.includes('실시간 재난 경보 서비스가 아닙니다'))throw Error('Emergency homepage incomplete');
if(home.includes('공포를 이용하지 않습니다')||home.includes('불안을 키우는 정보 대신'))throw Error('Removed editorial slogans reappeared');
const heroHeading = home.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/)?.[1] ?? '';
if(!heroHeading.includes('전시·재난 대비,') || !heroHeading.includes('필요한 준비부터.') || /<br\s*\/?>/i.test(heroHeading))throw Error('Main headline should flow without forced line breaks');
if(home.includes('class="status-dot"')||home.includes('class="eyebrow-dot"')||home.includes('R<span>·</span>'))throw Error('Decorative pseudo-status lights should not appear');

const feed=file('rss.xml');
if (!feed.includes('<rss version="2.0"')||!feed.includes('<language>ko-KR</language>')||!feed.includes('/situations/')||!feed.includes('실시간 재난 경보가 아닙니다'))throw Error('RSS feed is missing safety entries or metadata');
if (!home.includes('type="application/rss+xml"')||!home.includes('href="/rss.xml"'))throw Error('RSS feed discovery link missing');
if (feed.includes('sample-draft'))throw Error('Draft appeared in RSS');
if (!home.includes('QUICK ACCESS') || !home.includes('ACTION BY SITUATION') || !home.includes('/situations/#air-raid') || !home.includes('/situations/#chemical')) throw Error('Card-first emergency dashboard or situation links missing');
const situationPage=file('situations/index.html');
if (!situationPage.includes('situation-shortcuts') || !situationPage.includes('first-action') || !situationPage.includes('action-details')) throw Error('Progressive situation action cards missing');
if (!file('buying/food/index.html').includes('buying-summary-grid') || !file('buying/gear/index.html').includes('buying-summary-grid')) throw Error('Evidence-first buying cards missing');
const reviewHub=file('reviews/index.html');
if(!reviewHub.includes('review-directory-grid')||!reviewHub.includes('review-featured-grid'))throw Error('Readable review directory not generated');
if (!reviewHub.includes('실제 구매 링크는 동일 제품이 확인된 경우에만 표시합니다')||!reviewHub.includes('/reviews/emergency-flashlights-headlamps/')) throw Error('Verified product hub is missing purchase verification notice or existing report');
if (!home.includes('href="/reviews/"')) throw Error('Product comparison discoverability missing from home');
const starter=file('starter-kit/index.html');
if(!starter.includes('OUR FAMILY READY KIT')||!starter.includes('guidehollow-ready-starter-set-v1')||!starter.includes('페닉스 E20 V2.0')||!starter.includes('idtdhvDZ3A'))throw Error('Starter kit missing functional checklist or vetted shopping product');
if(starter.includes('iframe')||starter.includes('한 번에 구매 완료'))throw Error('Unsafe iframe or misleading whole-kit purchase claim');
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
