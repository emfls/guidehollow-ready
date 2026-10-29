import { parseStaticPartnerHtml } from '../lib/partner-code';

/**
 * The thumbnail must depict the EXACT linked offer. Never infer a product
 * image from a keyword search, a similar colour, or a different listing.
 *
 * Add only Coupang Partners' own STATIC "blog tag" <a><img></a> snippet after
 * verifying its short URL matches the offer below. The parser rejects
 * arbitrary hosts, third-party scripts, and mismatched affiliate URLs.
 */
export const affiliateOffers = {
 flashlight: { url:'https://link.coupang.com/a/idtdhvDZ3A', emoji:'🔦', alt:'페닉스 E20 V2.0 손전등' },
 radio: { url:'https://link.coupang.com/a/iekaW7GSFE', emoji:'📻', alt:'소니 ICF-P26 블랙 라디오' },
 battery: { url:'https://link.coupang.com/a/iekgMwsEmq', emoji:'🔋', alt:'삼성 EB-P3401XUKGKR 베이지 보조배터리' },
} as const;

export type AffiliateOfferKey = keyof typeof affiliateOffers;
const originalFenixPhoto='https://thumbnail1.coupangcdn.com/thumbnails/remote/212x212ex/image/vendor_inventory/9c13/0524ccbea15e678332b3299a00596c66101a6e50f267850bb9970650169a.jpg';

// Intentionally empty until the exact official image-bearing static partner
// tag for each existing offer has been provided and checked.
const officialImageTags: Partial<Record<AffiliateOfferKey,string>>={};

export function affiliatePhoto(key:AffiliateOfferKey):string|undefined {
 const offer=affiliateOffers[key];
 const tag=officialImageTags[key];
 if(tag){
  const parsed=parseStaticPartnerHtml(tag);
  if(parsed?.url===offer.url && parsed.imageUrl)return parsed.imageUrl;
 }
 // This thumbnail was separately matched to the linked Fenix listing.
 return key==='flashlight'?originalFenixPhoto:undefined;
}
