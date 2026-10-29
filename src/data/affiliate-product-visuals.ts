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
 readymeal: { url:'https://link.coupang.com/a/ieOGyQEiDQ', emoji:'🥡', alt:"아침 바로드숑 데우지 않고 바로먹는 실온보관 이지컷 닭가슴살 허브갈릭, 60개, 100g" },
 cable: { url:'https://link.coupang.com/a/ieOIzHSJZk', emoji:'🔌', alt:"삼성전자 Type-C to C케이블 SU-CC3110, 1m, 화이트, 1개" },
 soap: { url:'https://link.coupang.com/a/ieOLFFT9Ua', emoji:'🧼', alt:"아이깨끗해 핸드워시 리필용 순 파우더향, 600ml, 1개" },
 bags: { url:'https://link.coupang.com/a/ieONgl6IV2', emoji:'🗑️', alt:"탐사 분리수거 쓰레기봉투 배접 검정, 100개, 50L" },
 gauze: { url:'https://link.coupang.com/a/ieOPxyN1VI', emoji:'🩹', alt:"네오 드레싱 멸균거즈밴드 백색, 4개입, 10개" },
 backpack: { url:'https://link.coupang.com/a/iePsXGU1F6', emoji:'🎒', alt:"제로웨이트590g 라이트론 등산가방 경량 소형 22L, 블랙" },
 snacks: { url:'https://link.coupang.com/a/iePvyD2Ywe', emoji:'🍫', alt:"닥터유 에너지바 미니, 310g, 3개" },
 lantern: { url:'https://link.coupang.com/a/iePwJgYiAK', emoji:'🏮', alt:"에너자이저 360 Area 캠핑 랜턴 LED랜턴, 1개, 단품" },
 whistle: { url:'https://link.coupang.com/a/iePyyD8lZk', emoji:'📣', alt:"낫소 듀얼호각, 1개, 블랙" },
 waterjug: { url:'https://link.coupang.com/a/ieQaqXhm9Y', emoji:'💧', alt:"국산 약수통 생수통, 1개, 10L" },
 foodbox: { url:'https://link.coupang.com/a/ieQi5ugNwG', emoji:'📦', alt:"코멧 홈 베이직 투명 리빙박스, 3개" },
 pouch: { url:'https://link.coupang.com/a/ieQkYMMM9Y', emoji:'📄', alt:"그로스웨이브 다용도 PVC 문서보관 지퍼 파우치, 10개, A4 혼합색상" },
 poncho: { url:'https://link.coupang.com/a/ieQmvw3VzU', emoji:'🌧️', alt:"데이브렉 캠프용 판쵸우의 방수, 혼합색상, 1개" },
 cup: { url:'https://link.coupang.com/a/ieQnVXXJ36', emoji:'🥛', alt:"캠핑 휴대용 접이식 스텐컵 150ml 중형, 2개, 스테인리스" },
 carcharger: { url:'https://link.coupang.com/a/ieQsAO8UbQ', emoji:'🔋', alt:"벨킨 부스트차지 PPS 30W USB C 차량용 충전기, CCA004qcBK, 블랙" },
} as const;
export type AffiliateOfferKey=keyof typeof affiliateOffers;
const originalFenixPhoto='https://thumbnail1.coupangcdn.com/thumbnails/remote/212x212ex/image/vendor_inventory/9c13/0524ccbea15e678332b3299a00596c66101a6e50f267850bb9970650169a.jpg';

/** Partner banner HTML for the 26 non-flashlight offers was provided by the publisher. */
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
 readymeal: '<a href="https://link.coupang.com/a/ieOGyQEiDQ" target="_blank" referrerpolicy="unsafe-url"><img src="https://img1c.coupangcdn.com/image/affiliate/banner/a36d4faf0cfcd27e2e1798c664d4fa2e@2x.jpg" alt="아침 바로드숑 데우지 않고 바로먹는 실온보관 이지컷 닭가슴살 허브갈릭, 60개, 100g" width="120" height="240"></a>',
 cable: '<a href="https://link.coupang.com/a/ieOIzHSJZk" target="_blank" referrerpolicy="unsafe-url"><img src="https://image12.coupangcdn.com/image/affiliate/banner/cd4cad1b94cc42882067b5afd29d3abe@2x.jpg" alt="삼성전자 Type-C to C케이블 SU-CC3110, 1m, 화이트, 1개" width="120" height="240"></a>',
 soap: '<a href="https://link.coupang.com/a/ieOLFFT9Ua" target="_blank" referrerpolicy="unsafe-url"><img src="https://image5.coupangcdn.com/image/affiliate/banner/6675e5debbd189cce18db299be0e1e21@2x.jpg" alt="아이깨끗해 핸드워시 리필용 순 파우더향, 600ml, 1개" width="120" height="240"></a>',
 bags: '<a href="https://link.coupang.com/a/ieONgl6IV2" target="_blank" referrerpolicy="unsafe-url"><img src="https://img1c.coupangcdn.com/image/affiliate/banner/a30c4211f8e3fc533c97d5fba9836277@2x.jpg" alt="탐사 분리수거 쓰레기봉투 배접 검정, 100개, 50L" width="120" height="240"></a>',
 gauze: '<a href="https://link.coupang.com/a/ieOPxyN1VI" target="_blank" referrerpolicy="unsafe-url"><img src="https://static.coupangcdn.com/image/affiliate/banner/a2a672824a16ff3c3cc4029a1c918427@2x.jpg" alt="네오 드레싱 멸균거즈밴드 백색, 4개입, 10개" width="120" height="240"></a>',
 backpack: '<a href="https://link.coupang.com/a/iePsXGU1F6" target="_blank" referrerpolicy="unsafe-url"><img src="https://image7.coupangcdn.com/image/affiliate/banner/c7b99e1909ef47565dda2639abdd90a1@2x.jpg" alt="제로웨이트590g 라이트론 등산가방 경량 소형 22L, 블랙" width="120" height="240"></a>',
 snacks: '<a href="https://link.coupang.com/a/iePvyD2Ywe" target="_blank" referrerpolicy="unsafe-url"><img src="https://image3.coupangcdn.com/image/affiliate/banner/e5bc982dccfa7e202491dfc334d5e13d@2x.jpg" alt="닥터유 에너지바 미니, 310g, 3개" width="120" height="240"></a>',
 lantern: '<a href="https://link.coupang.com/a/iePwJgYiAK" target="_blank" referrerpolicy="unsafe-url"><img src="https://image13.coupangcdn.com/image/affiliate/banner/2f82da3a0758e43103872886c09c47c7@2x.jpg" alt="에너자이저 360 Area 캠핑 랜턴 LED랜턴, 1개, 단품" width="120" height="240"></a>',
 whistle: '<a href="https://link.coupang.com/a/iePyyD8lZk" target="_blank" referrerpolicy="unsafe-url"><img src="https://img2c.coupangcdn.com/image/affiliate/banner/7f8e88f87eef38b60a2126ba4947971d@2x.jpg" alt="낫소 듀얼호각, 1개, 블랙" width="120" height="240"></a>',
 waterjug: '<a href="https://link.coupang.com/a/ieQaqXhm9Y" target="_blank" referrerpolicy="unsafe-url"><img src="https://img3c.coupangcdn.com/image/affiliate/banner/80231faebee82af840975d8c9855102c@2x.jpg" alt="국산 약수통 생수통, 1개, 10L" width="120" height="240"></a>',
 foodbox: '<a href="https://link.coupang.com/a/ieQi5ugNwG" target="_blank" referrerpolicy="unsafe-url"><img src="https://image8.coupangcdn.com/image/affiliate/banner/6fbf71fe77e8d998277c536e748f10eb@2x.jpg" alt="코멧 홈 베이직 투명 리빙박스, 3개" width="120" height="240"></a>',
 pouch: '<a href="https://link.coupang.com/a/ieQkYMMM9Y" target="_blank" referrerpolicy="unsafe-url"><img src="https://img4c.coupangcdn.com/image/affiliate/banner/cb8050c60998831e022dc7afce568068@2x.jpg" alt="그로스웨이브 다용도 PVC 문서보관 지퍼 파우치, 10개, A4 혼합색상" width="120" height="240"></a>',
 poncho: '<a href="https://link.coupang.com/a/ieQmvw3VzU" target="_blank" referrerpolicy="unsafe-url"><img src="https://img2a.coupangcdn.com/image/affiliate/banner/45e2c402e5293b550404b1690e13189b@2x.jpg" alt="데이브렉 캠프용 판쵸우의 방수, 혼합색상, 1개" width="120" height="240"></a>',
 cup: '<a href="https://link.coupang.com/a/ieQnVXXJ36" target="_blank" referrerpolicy="unsafe-url"><img src="https://img2a.coupangcdn.com/image/affiliate/banner/01aa8216f454f2dd220adab5956e1f76@2x.jpg" alt="캠핑 휴대용 접이식 스텐컵 150ml 중형, 2개, 스테인리스" width="120" height="240"></a>',
 carcharger: '<a href="https://link.coupang.com/a/ieQsAO8UbQ" target="_blank" referrerpolicy="unsafe-url"><img src="https://img1c.coupangcdn.com/image/affiliate/banner/9f4c1f533b233fa0eb1b48df99db94f2@2x.jpg" alt="벨킨 부스트차지 PPS 30W USB C 차량용 충전기, CCA004qcBK, 블랙" width="120" height="240"></a>',
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
