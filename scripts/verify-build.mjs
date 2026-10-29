import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
const required=['index.html','CNAME','.nojekyll','favicon.svg','robots.txt','sitemap.xml','rss.xml','reviews/index.html','starter-kit/index.html','protocols/index.html','buying/index.html','drill/index.html','situations/index.html','checklist/index.html','plan/index.html','buying/food/index.html','buying/gear/index.html','about/index.html','disclosure/index.html','privacy/index.html','sources/index.html'];
const file=(p)=>readFileSync(join('dist',p),'utf8');
for(const p of required)if(!existsSync(join('dist',p)))throw Error('Build missing '+p);
if(file('CNAME').trim()!=='ready.guidehollow.com')throw Error('CNAME mismatch');
const pages=required.filter(p=>p.endsWith('index.html'));
for(const p of pages){
 const html=file(p);
 if(!html.includes('4a3c4cef3cedf9582280c00ff70ebff66b9b7de8'))throw Error('Missing Naver verification tag: '+p);
 if(!html.includes('name="robots" content="index, follow"'))throw Error('Public page is not indexable: '+p);
 if(html.includes('name="robots" content="noindex'))throw Error('Noindex leaked into public page: '+p);
 if(!html.includes('ready.guidehollow.com'))throw Error('Wrong canonical host: '+p);
}
const design=readFileSync('src/styles/night-layout.css','utf8');
if(!design.includes('Publisher-linked product photography: no decorative border')||!design.includes('.review-featured-image,')||!design.includes('.starter-secondary-affiliates-grid .starter-affiliate-product-visual,'))throw Error('Affiliate product media border removal missing');
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

// The emergency-first homepage retains its original three routine links and
// four situation links. A five-question shopping self-check sits BELOW the
// emergency action and does not write to the persistent 22-item checklist.
const quickComponent=readFileSync('src/components/HomeQuickCheck.astro','utf8');
if(!home.includes('id="home-fast-check"')||!home.includes('class="home-routine-start"')||!home.includes('3일 대비 시작'))throw Error('Prominent three-day starter journey missing from homepage');
if((home.match(/data-home-fast-question=/g)||[]).length!==5)throw Error('Homepage should show five accessible quick-check questions');
if((home.match(/data-home-fast-product=/g)||[]).length!==5)throw Error('Five matching product results must exist, hidden until user needs them');
for(const offer of ['water','tuna','flashlight','radio','battery']){
 const slug={water:'ienOFQc21I',tuna:'ienRftVDYy',flashlight:'idtdhvDZ3A',radio:'ienLu8j8IC',battery:'ienNhlQsPk'}[offer];
 if(!home.includes('https://link.coupang.com/a/'+slug))throw Error('Quick check lacks exact approved partner product '+offer);
}
if(home.indexOf('emergency-home-action')>home.indexOf('home-fast-check'))throw Error('Purchase UI must never precede emergency action');
if(!quickComponent.includes('updateQuickCheck')||!quickComponent.includes("results.hidden=answered===0")||!quickComponent.includes('card.hidden=field?.dataset.answered'))throw Error('Result cards must render only when that need is explicitly selected');
if(!quickComponent.includes("save?.addEventListener('click'")||!quickComponent.includes('localStorage.setItem(quickKey')||!quickComponent.includes('localStorage.setItem(detailKey')||quickComponent.includes('fetch('))throw Error('Quick check persistence must be explicit and local only');
if(!home.includes('id="home-fast-water-total"')||!home.includes('id="home-fast-save"')||!home.includes('id="home-fast-shop-continue"'))throw Error('Household water estimate and saved-needs buyer continuation missing');
if(!quickComponent.includes("answer==='have'&&checkId")||!quickComponent.includes('new Set([...(stored as string[]),...confirmed])'))throw Error('Home may add confirmed owned items only; must preserve other saved checks');
if(!home.includes('쿠팡 파트너스 활동의 일환')||!home.includes('구매하기 ↗'))throw Error('Quick check affiliate disclosure and purchase CTA missing');
if(!design.includes('.home-fast-questions')||!design.includes('.home-fast-results[hidden]')||!design.includes('.home-fast-result-card[hidden]'))throw Error('Quick check dark mode, responsive grid or result hiding missing');
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
if (!reviewHub.includes('기존 쿠팡 상품 30종')&&!reviewHub.includes('이미 연결된 쿠팡 상품 30종')) throw Error('Review landing must clearly state thirty published affiliate offers');
if(!reviewHub.includes('/reviews/emergency-flashlights-headlamps/'))throw Error('Comparison review directory missing');
if((reviewHub.match(/class="review-direct-buy"/g)||[]).length!==11)throw Error('All eleven review-directory entries must offer one exact registered product link');
if((reviewHub.match(/class="review-directory-shop"/g)||[]).length!==9)throw Error('Nine non-featured reviews must preview a related product with official photo');
const reviewRouting=readFileSync('src/data/buying-guide.ts','utf8');
if(!reviewRouting.includes('reviewShoppingOffers:Record<string,ReviewShoppingOffer[]>'))throw Error('Review product matching crosswalk absent');
for(const [slug,offer] of [
 ['coupang-stock-audit-samsung-p3400-p3401','ienNhlQsPk'],
 ['emergency-am-fm-radios','ienLu8j8IC'],
 ['emergency-bags-dry-pouches','ienSxmfDUW'],
 ['emergency-blankets-and-hygiene-wipes','ieCBNk88su'],
 ['emergency-first-aid-kit-and-dressings','ieCxqq6mui'],
 ['emergency-flashlights-headlamps','ieCuYrnIu4'],
 ['emergency-kit-set-composition-audit','ienOFQc21I'],
 ['emergency-power-banks-10000-vs-20000','ienNhlQsPk'],
 ['emergency-products-kc-model-expiry-audit','ienNhlQsPk'],
 ['emergency-retail-option-priority-and-affiliate-gates','idtdhvDZ3A'],
 ['fenix-e20-v2-flashlight','idtdhvDZ3A']
]){
 const html=file('reviews/'+slug+'/index.html');
 if(!html.includes('https://link.coupang.com/a/'+offer)||!html.includes('rel="sponsored nofollow noopener noreferrer"'))throw Error('Published review missing correct actual sale CTA '+slug);
 if(!html.includes('이 포스팅은 쿠팡 파트너스 활동의 일환'))throw Error('Published affiliate review has no up-front sponsorship notice '+slug);
 if(!reviewRouting.includes("'"+slug+"':["))throw Error('Review offer crosswalk missing '+slug);
}
if(!file('about/index.html').includes('30개 준비 품목')||file('about/index.html').includes('손전등의 개별 구매 링크가 연결돼 있고'))throw Error('About page incorrectly describes legacy one-link catalog');
if(!file('disclosure/index.html').includes('30개 준비 품목'))throw Error('Disclosure page outdated');
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
for(const id of ['water','food','flashlight','radio','powerbank','drybag'])if(!protocolHtml.includes('data-protocol-item="'+id+'"'))throw Error('Missing core item '+id);
for(const id of ['ienLu8j8IC','ienNhlQsPk','ienOFQc21I','ienRftVDYy','ienSxmfDUW','idtdhvDZ3A','ieCtE2caFU','ieCuYrnIu4','ieCxqq6mui','ieCyTiU5ts','ieCBNk88su','ieCDsQuq84'])if(!protocolHtml.includes('https://link.coupang.com/a/'+id))throw Error('Protocol missing verified single-product affiliate '+id);
if(!protocolHtml.includes('쿠팡 파트너스 활동의 일환')||!protocolHtml.includes('rel="sponsored nofollow noopener noreferrer"'))throw Error('Protocol affiliate disclosure or sponsored rel missing');
if(protocolSource.includes("localStorage.setItem('guidehollow-ready-check-v1'"))throw Error('Protocol must never write back the baseline checklist');
if(!protocolHtml.includes('https://www.cdc.gov/')||!protocolHtml.includes('https://safekorea.go.kr/'))throw Error('Protocol official sources missing');
if(!home.includes('/protocols/')||!starter.includes('/protocols/')||!file('checklist/index.html').includes('/protocols/'))throw Error('Protocol not discoverable from homepage, starter hub and checklist');
if(!file('sitemap.xml').includes('https://ready.guidehollow.com/protocols/'))throw Error('New protocol route missing in sitemap');
const buyingHub=file('buying/index.html');
const buyingData=readFileSync('src/data/buying-guide.ts','utf8');
const buyingSource=readFileSync('src/pages/buying/index.astro','utf8');
if((buyingHub.match(/data-buy-id="/g)||[]).length!==30)throw Error('Buyer guide requires 30 actionable categories, without fake listing links');
if((buyingHub.match(/data-buy-core="yes"/g)||[]).length!==5)throw Error('Five priority buyer products missing');
if(!buyingSource.includes("get('from')==='quick'")||!buyingSource.includes('quickBuyingIds.has'))throw Error('Saved five-question needs must cross-link into buying decision');
if(!design.includes('.home-fast-water-plan')||!design.includes('.review-matched-offer'))throw Error('Buyer water and exact-model review design missing');
const reviewPage=readFileSync('src/pages/reviews/[slug].astro','utf8');
if(!reviewPage.includes('.filter(p=>Boolean(p.partner))')||reviewPage.includes('review-not-ready'))throw Error('Shopper reviews must not render products without an issued Coupang affiliate link');

if(!reviewPage.includes("row.id==='emergency-power-banks-10000-vs-20000'")||!reviewPage.includes("row.id==='emergency-first-aid-kit-and-dressings'")||!reviewPage.includes('PartnerOfferCard offer={actualSaleOffer}'))throw Error('Exact linked models must be visible above unlike-model comparison reviews');
if((buyingHub.match(/data-shop-preset="/g)||[]).length!==3||!buyingHub.includes('data-shop-preset="linked"')||!buyingHub.includes('data-shop-preset="fresh"'))throw Error('Buyer quick filter controls missing');
if(!buyingHub.includes('응고제10개+용변봉투10장')||!buyingHub.includes('밴드형 2단계')||!buyingHub.includes('반려견 사료'))throw Error('New buyer product suitability guidance missing');
if(!design.includes('.shop-guide-shortcut-actions'))throw Error('Quick filter responsive dark styles missing');
if((buyingHub.match(/data-buy-linked="yes"/g)||[]).length!==30||(buyingHub.match(/data-buy-linked="no"/g)||[]).length!==0)throw Error('Exactly 30 publisher-issued product offers and zero pending slots expected');
if((buyingHub.match(/data-buy-fresh="yes"/g)||[]).length!==3)throw Error('Three newest product categories need independent quick filter');
if((buyingHub.match(/data-buy-selected="yes"/g)||[]).length!==15)throw Error('Fifteen newest links must appear under latest-products filter');
for(const [id,needle] of [
 ['aa-batteries','벡셀 알카라인 AA 건전지'],
 ['headlamp','에너자이저 비전 HD+ LED 헤드랜턴'],
 ['firstaid-kit','한양 스피드 구급함 대형 19종세트'],
 ['wet-wipes','탐사 클래식 물티슈 캡형'],
 ['thermal-blanket','코멧 홈 포근 플리스 똑딱이 담요'],
 ['manual-opener','코멧 키친 캔오프너 + 병따개'],
]){
 if(!buyingData.includes("'"+id+"':{")||!buyingHub.includes(needle))throw Error('Selected real browser-tab product is not reflected: '+id);
}
if(!buyingHub.includes('최근 추가된 상품')||!buyingHub.includes('value="selected"'))throw Error('Newly linked products filter missing');
if(!buyingSource.includes("card.dataset.buySelected==='yes'")||!buyingSource.includes("newlyLinkedBuyingIds"))throw Error('Latest 15 links must have dedicated selection filter');

for(const id of ['water','tuna','flashlight','radio','battery','drybag']){
 if(!buyingData.includes("offer:'"+id+"'"))throw Error('Expected matching user-supplied offer absent '+id);
}
for(const id of ['ienLu8j8IC','ienNhlQsPk','ienOFQc21I','ienRftVDYy','ienSxmfDUW','idtdhvDZ3A','ieCtE2caFU','ieCuYrnIu4','ieCxqq6mui','ieCyTiU5ts','ieCBNk88su','ieCDsQuq84'])
 if(!buyingHub.includes('https://link.coupang.com/a/'+id))throw Error('A previously verified buyer offer was lost '+id);
if((buyingHub.match(/class="shop-guide-buy"/g)||[]).length!==30)throw Error('Buying guide must have exactly 30 genuine product CTA links');
const newOfferIds=['ieOGyQEiDQ','ieOIzHSJZk','ieOLFFT9Ua','ieONgl6IV2','ieOPxyN1VI','iePsXGU1F6','iePvyD2Ywe','iePwJgYiAK','iePyyD8lZk','ieQaqXhm9Y','ieQi5ugNwG','ieQkYMMM9Y','ieQmvw3VzU','ieQnVXXJ36','ieQsAO8UbQ'];
for(const id of newOfferIds)if(!buyingHub.includes('https://link.coupang.com/a/'+id))throw Error('New affiliate link missing from buyer hub: '+id);
if(!buyingData.includes('온리빙 쉬포켓')||buyingHub.includes('온리빙 쉬포켓'))throw Error('Blacklisted toilet must remain excluded and traceable without appearing to shoppers');
if((readFileSync('src/data/protocols.ts','utf8').match(/offer:'/g)||[]).length!==24)throw Error('Staged protocol should contain 24 original and optional affiliate offers');
const verifiedImageCatalog=readFileSync('src/data/affiliate-product-visuals.ts','utf8');
for(const [id,key,banner,product] of [
 ['ie6X3NqmNo','toilet','ddfd6058600935242c091d59182480bc@2x.jpg','portable-toilet'],
 ['ie6Y9sb1a0','diapers','e1fccea5f98fa0ac48e3254ee6e1b2c3@2x.jpg','baby-diapers'],
 ['ie6Z9UwjsW','dogfood','337c9eb358e795da292234e097bd988d@2x.jpg','pet-food'],
]){
 if(!verifiedImageCatalog.includes('https://link.coupang.com/a/'+id)||!verifiedImageCatalog.includes(banner)||!buyingHub.includes('https://link.coupang.com/a/'+id)||!protocolHtml.includes('https://link.coupang.com/a/'+id))throw Error('Final verified publisher offer not wired into all sale surfaces '+id);
 if(!buyingData.includes("offer:'"+key+"'")||!buyingHub.includes('data-buy-id="'+product+'"'))throw Error('Incorrect exact product category for new affiliate '+product);
}
if(buyingHub.includes('연결 대기 3종')||buyingHub.includes('제휴 링크 미발급'))throw Error('Outdated pending-product copy still visible to shoppers');
for(const id of ['ieCtE2caFU','ieCuYrnIu4','ieCxqq6mui','ieCyTiU5ts','ieCBNk88su','ieCDsQuq84']){
 if(!verifiedImageCatalog.includes('https://link.coupang.com/a/'+id)||!protocolHtml.includes('https://link.coupang.com/a/'+id))throw Error('New affiliate offer not wired through central catalog and staged protocols: '+id);
}
for(const id of ['aa','headlamp','firstaid','wipes','blanket','opener']){
 if(!buyingData.includes("offer:'"+id+"'"))throw Error('Exact new partner mapping missing from buying data: '+id);
}
if(!buyingHub.includes('쿠팡 파트너스 활동의 일환')||!buyingHub.includes('rel="sponsored nofollow noopener noreferrer"'))throw Error('Buying guide missing affiliate disclosure or rel');
if(!buyingHub.includes('60일')||!buyingHub.includes('90일')||!buyingHub.includes('30개'))throw Error('Buying guide must distinguish long-range scenarios');
for(const x of ['shop-guide-duration','shop-guide-category','shop-guide-link-filter','shop-guide-unchecked','shop-guide-no-match'])if(!buyingHub.includes(x))throw Error('Buyer filter control or empty state missing '+x);
if(!buyingSource.includes('getExistingChecks()')||buyingSource.includes("localStorage.setItem('guidehollow-ready-check-v1'"))throw Error('Buyer guide must never edit existing preparedness checklist records');
if(!file('sitemap.xml').includes('https://ready.guidehollow.com/buying/'))throw Error('Buyer guide route missing from sitemap');
for(const page of [home,starter,protocolHtml,file('buying/food/index.html'),file('buying/gear/index.html')])if(!page.includes('href="/buying/"'))throw Error('Buy hub not discoverable from related journey page');
if(!design.includes('.shop-guide-filter-grid')||!design.includes('.shop-guide-item[hidden]'))throw Error('Responsive mobile buyer list or hidden product states missing');
const foodGuide=file('buying/food/index.html');
if((foodGuide.match(/class="ready-shop-card"/g)||[]).length!==8)throw Error('Food buyer guide must expose all eight published related product offers');
if(!foodGuide.includes('food-extra-buying'))throw Error('Food buyer guide missing optional buying list');
if(!file('checklist/index.html').includes('30개 연결 상품에서 부족한 물품 찾기'))throw Error('Saved checklist has no clear route to real buying options');
const gear=file('buying/gear/index.html');
if((gear.match(/class="ready-shop-card"/g)||[]).length!==19||!gear.includes('gear-extra-buying'))throw Error('Gear guide still hides approved non-food supplier offers');
if(!gear.includes('https://link.coupang.com/a/idtdhvDZ3A'))throw Error('Gear page lacks direct same-model flashlight link');
for(const id of ['ienLu8j8IC','ienNhlQsPk']){
 const url='https://link.coupang.com/a/'+id;
 if(!gear.includes(url)||!starter.includes(url))throw Error('Supplied affiliate URL missing from buying page or starter kit: '+id);
 if(!gear.includes('rel="sponsored nofollow noopener noreferrer"')||!starter.includes('rel="sponsored nofollow noopener noreferrer"'))throw Error('Supplied affiliate URL requires disclosure and safe link attributes');
}
if(!gear.includes('소니 ICF-P26, 블랙')||!gear.includes('삼성 EB-P3401XUKGKR, 베이지')||!gear.includes('쿠팡 파트너스 활동의 일환')||!starter.includes('삼성 EB-P3401'))throw Error('Coupang model and affiliate notices must reflect observed product options');
// Product-only commerce design: the original partner banner may remain as
// the source image, but branding/title/embedded CTA must be CLIPPED in UI.
const productPhotoComponent=readFileSync('src/components/ProductPhoto.astro','utf8');
if(!productPhotoComponent.includes('product-photo-frame--banner') && !productPhotoComponent.includes("product-photo-frame--banner"))throw Error('Missing product-only banner crop component');
if(!design.includes('.product-photo-frame--banner .product-photo-window img')||!design.includes('top:-30%')||!design.includes('.ready-shop-footer')||!design.includes('.review-product-compact .review-cta'))throw Error('Product photo crop or bottom-right CTAs missing');
for(const path of ['src/components/PartnerOfferCard.astro','src/pages/starter-kit.astro','src/pages/buying/gear.astro','src/pages/protocols/index.astro','src/pages/reviews/[slug].astro']){
 const source=readFileSync(path,'utf8');
 if(!source.includes('<ProductPhoto'))throw Error('Legacy uncut partner banner remains in '+path);
}
if(!starter.includes('class="starter-affiliate-links"')||!starter.includes('class="ready-shop-footer"'))throw Error('Shopping buttons not moved out of the image and to card bottom-right');
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
if(!file('robots.txt').includes('Allow: /')||file('robots.txt').split('\n').some(line=>line.trim()==='Disallow: /'))throw Error('Public crawlers are blocked by robots.txt');
const notFound=file('404.html');
if(!notFound.includes('name="robots" content="noindex, follow"'))throw Error('404 must stay excluded from indexing');
const reviewDir=join('dist','reviews');
if(existsSync(reviewDir)){
 for(const entry of readdirSync(reviewDir,{withFileTypes:true}).filter(x=>x.isDirectory())){
  const content=file(`reviews/${entry.name}/index.html`);
  if(!content.includes('검증 근거')||!content.includes('name="robots" content="index, follow"'))throw Error('Published review evidence or index setting missing: '+entry.name);
  if(content.includes('name="robots" content="noindex'))throw Error('Published review still noindex: '+entry.name);
  if(content.includes('class="review-not-ready"'))throw Error('Unbuyable product listing leaked into public review '+entry.name);
  if((content.match(/class="review-product-compact"/g)||[]).length>(content.match(/class="btn primary review-cta"/g)||[]).length)throw Error('Public review contains product card without affiliate CTA '+entry.name);

 }
}
console.log('GuideHollow Ready smoke test passed: public search indexing enabled, drafts/404 excluded, sitemap/robots valid, safety pages and affiliate integrity.');
