import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { parseStaticPartnerHtml, resolvePartnerLink } from './lib/partner-code';
const https=z.string().url().refine(v=>new URL(v).protocol==='https:','HTTPS 링크만 허용');
const product=z.object({
 name:z.string().min(2),
 modelNumber:z.string().min(2),
 label:z.string().min(2),
 bestFor:z.string().min(8),
 strengths:z.array(z.string().min(3)).min(1).max(5),
 limitations:z.array(z.string().min(3)).min(1).max(5),
 officialUrl:https,
 independentSources:z.array(https).min(1).max(6),
 verificationNotes:z.string().min(70),
 verified:z.boolean().default(false),
 checkedAt:z.coerce.date(),
 partnerProductMatched:z.boolean().default(false),
 affiliateUrl:https.optional(),
 partnerHtml:z.string().max(12000).optional(),
}).superRefine((value,ctx)=>{
 if (!value.verified) ctx.addIssue({code:'custom',message:'검증 승인이 없는 상품은 게시할 수 없습니다',path:['verified']});
 if (value.independentSources.some(url=>new URL(url).hostname===new URL(value.officialUrl).hostname)) ctx.addIssue({code:'custom',message:'독립검증자료는 제조사 공식 출처와 별도 도메인이어야 합니다',path:['independentSources']});
 if (value.affiliateUrl||value.partnerHtml) {
  if (!value.partnerProductMatched) ctx.addIssue({code:'custom',message:'쿠팡 상품의 모델·옵션 일치 확인 필요',path:['partnerProductMatched']});
  if(!resolvePartnerLink(value))ctx.addIssue({code:'custom',message:'정적 쿠팡 단일상품 a 태그/HTTPS URL만 허용. iframe·스크립트·동적배너 불가',path:['partnerHtml']});
 }
 if(value.partnerHtml&&!parseStaticPartnerHtml(value.partnerHtml))ctx.addIssue({code:'custom',message:'유효한 정적 쿠팡 상품 태그만 허용',path:['partnerHtml']});
});
const review=z.object({
 title:z.string().min(8),
 description:z.string().min(20),
 category:z.enum(['food','power','medical','general']),
 publishedDate:z.coerce.date(),
 updatedDate:z.coerce.date().optional(),
 draft:z.boolean().default(true),
 affiliate:z.boolean().default(false),
 sources:z.array(https).default([]),
 keyTakeaways:z.array(z.string().min(6)).max(5).default([]),
 products:z.array(product).max(5).default([]),
}).superRefine((data,ctx)=>{
 if(!data.draft&&data.sources.length===0)ctx.addIssue({code:'custom',message:'공개 원고는 공식·독립 자료 URL 필수',path:['sources']});
 const linked=data.products.some(p=>Boolean(p.affiliateUrl||p.partnerHtml));
 if(!data.draft&&linked!==data.affiliate)ctx.addIssue({code:'custom',message:'제휴 링크 포함 여부와 affiliate 고지 일치 필요',path:['affiliate']});
 if(data.updatedDate&&data.updatedDate<data.publishedDate)ctx.addIssue({code:'custom',message:'수정일이 발행일보다 빠를 수 없습니다',path:['updatedDate']});
});
export const collections={
 reviews:defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/reviews'}),schema:review})
};
