import type { APIRoute } from 'astro';
import { site } from '../site';
import { getPublishedReviews } from '../lib/reviews';

const escapeXml=(value:string)=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const publishedAt=new Date('2026-10-28T09:00:00+09:00');
const evergreen=[
 {path:'/situations/',title:'재난 상황별 행동요령',description:'공습·화학·핵·지진·화재·침수·정전·단수 상황에서 공식 안내를 따라 행동하는 방법'},
 {path:'/checklist/',title:'가정 비상 준비 체크리스트',description:'초기 72시간 대비 식수·식량·전원·위생과 가족별 추가 준비를 확인하는 체크리스트'},
 {path:'/plan/',title:'가족 비상연락과 대피 계획',description:'연락 두절과 대피 상황을 고려한 인쇄용 가족 안전 계획'},
 {path:'/buying/food/',title:'비상식량과 식수 선택 기준',description:'조리 조건·식수·소비기한·영유아 등 가족별 요구를 확인하는 구매 전 가이드'},
 {path:'/buying/gear/',title:'비상 조명·전원·통신 용품 선택 기준',description:'비상용 조명·라디오·보조배터리의 작동·안전·호환성 검증 기준'},
] as const;

export const GET: APIRoute = async () => {
 const reviews=await getPublishedReviews();
 const entries=[
  ...evergreen.map(item=>({...item,date:publishedAt})),
  ...reviews.map(item=>({
   path:'/reviews/'+item.id+'/',
   title:item.data.title,
   description:item.data.description,
   date:item.data.publishedDate,
  })),
 ].sort((a,b)=>b.date.getTime()-a.date.getTime()).slice(0,60);
 const items=entries.map(item=>{
  const url=new URL(item.path,site.url).toString();
  return [
   '<item>',
   '<title>'+escapeXml(item.title)+'</title>',
   '<link>'+escapeXml(url)+'</link>',
   '<guid isPermaLink="true">'+escapeXml(url)+'</guid>',
   '<description>'+escapeXml(item.description)+'</description>',
   '<pubDate>'+item.date.toUTCString()+'</pubDate>',
   '</item>',
  ].join('');
 }).join('\n');
 const now=new Date().toUTCString();
 const rss=[
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>',
  '<title>'+escapeXml(site.name+' | 전시·재난 대비 가이드')+'</title>',
  '<link>'+escapeXml(site.url+'/')+'</link>',
  '<description>'+escapeXml('비공식 정보 사이트의 재난 대피·가족 준비·검증 콘텐츠 업데이트. 실시간 재난 경보가 아닙니다. 실제 상황에서는 정부 안내가 우선합니다.')+'</description>',
  '<language>ko-KR</language>',
  '<lastBuildDate>'+now+'</lastBuildDate>',
  '<atom:link href="'+escapeXml(site.url+'/rss.xml')+'" rel="self" type="application/rss+xml"/>',
  items,
  '</channel></rss>',
 ].join('\n');
 return new Response(rss,{headers:{'Content-Type':'application/rss+xml; charset=utf-8','Cache-Control':'public, max-age=900'}});
};
