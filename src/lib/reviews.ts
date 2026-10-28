import { getCollection } from 'astro:content';
export async function getPublishedReviews() {
 const now=new Date();
 const rows=await getCollection('reviews',({data})=>!data.draft && data.publishedDate.getTime()<=now.getTime());
 return rows.sort((a,b)=>b.data.publishedDate.getTime()-a.data.publishedDate.getTime());
}
