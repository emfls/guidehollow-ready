import { parseStaticPartnerHtml } from '../lib/partner-code';

/**
 * Only images from the exact user-supplied Coupang Partners offer are shown.
 * These are 120 x 240 portrait partner banners, not standalone square photos.
 * Never render the raw HTML, its referrerpolicy, or third-party scripts.
 */
export const affiliateOffers = {
 flashlight: { url:'https://link.coupang.com/a/idtdhvDZ3A', emoji:'🔦', alt:'페닉스 E20 V2.0 손전등' },
 radio: { url:'https://link.coupang.com/a/ienLu8j8IC', emoji:'📻', alt:'소니 ICF-P26 블랙 라디오' },
 battery: { url:'https://link.coupang.com/a/ienNhlQsPk', emoji:'🔋', alt:'삼성 EB-P3401XUKGKR 베이지 10000mAh 보조배터리' },
 water: { url:'https://link.coupang.com/a/ienOFQc21I', emoji:'💧', alt:'아이시스 화이트캡 무라벨 생수 2L 12개' },
 tuna: { url:'https://link.coupang.com/a/ienRftVDYy', emoji:'🥫', alt:'동원 라이트 스탠다드 참치 100g 10개' },
 drybag: { url:'https://link.coupang.com/a/ienSxmfDUW', emoji:'🎒', alt:'씨투써밋 라이트웨이트 드라이백 5L 서프 더 웹' },
 aa: { url:'https://link.coupang.com/a/ieCtE2caFU', emoji:'🔋', alt:'벡셀 알카라인 AA 건전지 20개입 1개' },
 headlamp: { url:'https://link.coupang.com/a/ieCuYrnIu4', emoji:'🔦', alt:'에너자이저 비전 HD+ LED 헤드랜턴 아마존팩 HDCA32 1개' },
 firstaid: { url:'https://link.coupang.com/a/ieCxqq6mui', emoji:'🩹', alt:'한양 스피드 구급함 대형 19종세트 구급상자 1세트' },
 wipes: { url:'https://link.coupang.com/a/ieCyTiU5ts', emoji:'🧻', alt:'탐사 클래식 물티슈 캡형 100매 10개' },
 blanket: { url:'https://link.coupang.com/a/ieCBNk88su', emoji:'🧣', alt:'코멧 홈 포근 플리스 똑딱이 담요' },
 opener: { url:'https://link.coupang.com/a/ieCDsQuq84', emoji:'🥫', alt:'코멧 키친 캔오프너 + 병따개 1개' },
} as const;
export type AffiliateOfferKey=keyof typeof affiliateOffers;
const originalFenixPhoto='https://thumbnail1.coupangcdn.com/thumbnails/remote/212x212ex/image/vendor_inventory/9c13/0524ccbea15e678332b3299a00596c66101a6e50f267850bb9970650169a.jpg';

/** These eleven static HTML snippets came directly from the publisher. */
const officialImageTags: Partial<Record<AffiliateOfferKey,string>>={
 radio: '<a href="https://link.coupang.com/a/ienLu8j8IC" target="_blank" referrerpolicy="unsafe-url"><img src="https://img2a.coupangcdn.com/image/affiliate/banner/2773295bd616eb0be0db4e5b696d0f9f@2x.jpg" alt="소니 핸디 휴대용 라디오 ICF-P26 : FMAM와이드 FM 대응 세로 두어형 블랙 ICF-P26 B, Black" width="120" height="240"></a>',
 battery: '<a href="https://link.coupang.com/a/ienNhlQsPk" target="_blank" referrerpolicy="unsafe-url"><img src="https://img1c.coupangcdn.com/image/affiliate/banner/aecd5934fa73209063d8c1885451b8ce@2x.jpg" alt="삼성전자 25W 고속 충전 대용량 PD 보조 배터리팩 10000mAh, 베이지, EB-P3401XUKGKR" width="120" height="240"></a>',
 water: '<a href="https://link.coupang.com/a/ienOFQc21I" target="_blank" referrerpolicy="unsafe-url"><img src="https://image15.coupangcdn.com/image/affiliate/banner/2b3ed5d6538c79457cd988a3be90635b@2x.jpg" alt="아이시스 생수 화이트캡 무라벨, 12개, 2L" width="120" height="240"></a>',
 tuna: '<a href="https://link.coupang.com/a/ienRftVDYy" target="_blank" referrerpolicy="unsafe-url"><img src="https://image3.coupangcdn.com/image/affiliate/banner/21f0158ca50345b8a7279a0cf9463f3d@2x.jpg" alt="동원 라이트 스탠다드 참치, 100g, 10개" width="120" height="240"></a>',
 drybag: '<a href="https://link.coupang.com/a/ienSxmfDUW" target="_blank" referrerpolicy="unsafe-url"><img src="https://image5.coupangcdn.com/image/affiliate/banner/9f53b4b6c1116795826c89fdc5fe6458@2x.jpg" alt="씨투써밋 라이트웨이트 드라이 백 5L, 서프 더 웹, 1개" width="120" height="240"></a>',
 aa: '<a href="https://link.coupang.com/a/ieCtE2caFU" target="_blank" referrerpolicy="unsafe-url"><img src="https://image12.coupangcdn.com/image/affiliate/banner/504453bd7459f700467d6bf22b33e7ef@2x.jpg" alt="벡셀 알카라인 AA 건전지, 20개입, 1개" width="120" height="240"></a>',
 headlamp: '<a href="https://link.coupang.com/a/ieCuYrnIu4" target="_blank" referrerpolicy="unsafe-url"><img src="https://image8.coupangcdn.com/image/affiliate/banner/6932299ad4422c56c755a9679abc6436@2x.jpg" alt="에너자이저 비전 HD+ LED 헤드랜턴 아마존팩 HDCA32, 1개" width="120" height="240"></a>',
 firstaid: '<a href="https://link.coupang.com/a/ieCxqq6mui" target="_blank" referrerpolicy="unsafe-url"><img src="https://image2.coupangcdn.com/image/affiliate/banner/62d5a1a514b6d6a9168eb084c7cdc4ed@2x.jpg" alt="한양 스피드 구급함 대형 19종세트 구급상자, 1세트" width="120" height="240"></a>',
 wipes: '<a href="https://link.coupang.com/a/ieCyTiU5ts" target="_blank" referrerpolicy="unsafe-url"><img src="https://img5c.coupangcdn.com/image/affiliate/banner/7854fa20d6af2b22962ccf24a6abf146@2x.jpg" alt="탐사 클래식 물티슈 캡형, 100매, 10개" width="120" height="240"></a>',
 blanket: '<a href="https://link.coupang.com/a/ieCBNk88su" target="_blank" referrerpolicy="unsafe-url"><img src="https://image2.coupangcdn.com/image/affiliate/banner/12d63460864b1968bfe61ff3b298b08e@2x.jpg" alt="코멧 홈 포근 플리스 똑딱이 담요" width="120" height="240"></a>',
 opener: '<a href="https://link.coupang.com/a/ieCDsQuq84" target="_blank" referrerpolicy="unsafe-url"><img src="https://img1a.coupangcdn.com/image/affiliate/banner/39ce2b48e4f7dca613b6d1320b616b2a@2x.jpg" alt="코멧 키친 캔오프너 + 병따개, 1개" width="120" height="240"></a>',
};

export function affiliatePhoto(key:AffiliateOfferKey):string|undefined {
 const offer=affiliateOffers[key];
 const tag=officialImageTags[key];
 if(tag){
  const parsed=parseStaticPartnerHtml(tag);
  if(parsed?.url===offer.url&&parsed.imageUrl)return parsed.imageUrl;
 }
 return key==='flashlight'?originalFenixPhoto:undefined;
}
