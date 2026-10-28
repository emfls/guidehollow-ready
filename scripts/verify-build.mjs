import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
const required=['index.html','CNAME','.nojekyll','favicon.svg','robots.txt','sitemap.xml','situations/index.html','checklist/index.html','plan/index.html','buying/food/index.html','buying/gear/index.html','about/index.html','disclosure/index.html','privacy/index.html','sources/index.html'];
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
const home=file('index.html');
if(!home.includes('불안보다 정확한 준비')||!home.includes('/checklist/')||!home.includes('실시간 재난 경보 서비스가 아닙니다'))throw Error('Emergency homepage incomplete');
const check=file('checklist/index.html');
if(!check.includes('data-key="water-bottles"')||!check.includes('ready-progress')||!check.includes('localStorage'))throw Error('Interactive checklist incomplete');
if(!file('plan/index.html').includes('가족 비상연락 카드'))throw Error('Printable family plan missing');
if(!file('buying/food/index.html').includes('30일분')||!file('buying/gear/index.html').includes('일산화탄소'))throw Error('Buying safety guidance missing');
const sitemap=file('sitemap.xml');
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
