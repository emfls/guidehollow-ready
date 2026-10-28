import type { APIRoute } from 'astro';
import { site } from '../site';
import { getPublishedReviews } from '../lib/reviews';
export const GET: APIRoute = async () => {
 const published=await getPublishedReviews();
 const paths=['/','/situations/','/checklist/','/plan/','/buying/food/','/buying/gear/','/about/','/disclosure/','/privacy/','/sources/','/rss.xml',...published.map(p=>`/reviews/${p.id}/`)];
 const entries=paths.map(p=>`  <url><loc>${new URL(p,site.url)}</loc></url>`).join('\n');
 return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
