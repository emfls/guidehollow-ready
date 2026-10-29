import type { AffiliateOfferKey } from './affiliate-product-visuals';

/** 30 editorial purchase candidates. A candidate is NOT a verified Coupang
 * listing. Only entries with a matching user-supplied affiliate offer get
 * product images or purchase actions. No price, stock, or certification claims.
 */
export const guideGroups=[
 {id:'food',title:'식수·비상식량',icon:'💧',description:'먹는 물과 정전에도 먹을 수 있는 식품'},
 {id:'light',title:'조명·정보',icon:'🔦',description:'정전 시 빛과 방송, 신호 확보'},
 {id:'power',title:'전원·충전',icon:'🔋',description:'통신기기 충전을 위한 예비 전원'},
 {id:'hygiene',title:'구급·위생·보온',icon:'🩹',description:'기본 상처 관리와 청결·체온 유지'},
 {id:'carry',title:'대피 가방·서류',icon:'🎒',description:'이동과 필수 서류 보호'},
 {id:'care',title:'가족별 추가 준비',icon:'👶',description:'해당 가족만 별도로 준비할 물품'},
] as const;
export type GuideGroup=typeof guideGroups[number]['id'];
export type GuideStage=3|7|14|30;
export type GuidePriority='필수 확인'|'상황별'|'추가 보강';
export interface GuideProduct {
 id:string;
 title:string;
 group:GuideGroup;
 days:GuideStage;
 priority:GuidePriority;
 why:string;
 criteria:string;
 caution:string;
 guide:string;
 checkId?:string;
 offer?:AffiliateOfferKey;
}

// Publisher-issued affiliate HTML received on 2026-10-29 for these fifteen
// exact product models/options. Product detail performance and safety claims
// remain unverified unless specifically stated in the supplied title.
export const newlyLinkedBuyingIds = [
 'ready-meals', 'charging-cable', 'hand-soap', 'waste-bags', 'sterile-gauze', 'backpack', 'ready-snacks', 'led-lantern', 'whistle', 'water-container', 'food-bins', 'document-pouch', 'rain-poncho', 'utensils', 'car-charger'
] as const;

/** Three newest personally issued individual-product partner HTML offers. */
export const latestLinkedBuyingIds = ['portable-toilet', 'baby-diapers', 'pet-food'] as const;

/** Exclude named seller/product explicitly blacklisted by the publisher.
 * A safe alternative may be linked to portable-toilet only after review.
 */
export const excludedCoupangProducts = [
 {category:'portable-toilet', product:'온리빙 쉬포켓', reason:'publisher blacklist 2026-10-29'}
] as const;

export const buyingGuideProducts:GuideProduct[]=[
 // 식수·비상식량 8
 {id:'drinking-water',title:'포장 생수',group:'food',days:3,priority:'필수 확인',why:'마실 물과 기본 위생수 확보',criteria:'총 용량·유통 단위·보관 장소와 포장 표시 확인',caution:'가족별 필요량을 계산한 뒤 부족분만 구입하세요. 24L 한 묶음이 모두에게 충분한 것은 아닙니다.',guide:'/buying/food/',checkId:'water-bottles',offer:'water'},
 {id:'canned-protein',title:'바로 먹을 수 있는 통조림',group:'food',days:3,priority:'필수 확인',why:'가열 없이 먹을 상온 식품 종류 확보',criteria:'실온 보관·소비기한·알레르기·식이 제한 확인',caution:'참치만으로 식단을 채우지 마세요. 캔따개 필요 여부도 확인하세요.',guide:'/buying/food/',checkId:'shelf-food',offer:'tuna'},
 {id:'ready-meals',title:'조리 없이 먹는 상온 단백질 간편식',group:'food',days:3,priority:'필수 확인',why:'전기·가스·조리용 물이 없어도 먹을 수 있는 식사',criteria:'가열 없이 섭취 가능한지, 조리수·식기·보관 조건 확인',caution:'연결 상품은 닭가슴살 100g×60개 대용량입니다. 식단 다양성·알레르기·소비기한·보관 공간을 확인하고 60개가 필요하지 않다면 구매하지 마세요. 냉장·냉동 제품은 제외하세요.',guide:'/buying/food/',checkId:'shelf-food',offer:'readymeal'},
 {id:'manual-opener',title:'수동 캔따개',group:'food',days:3,priority:'상황별',why:'따개 없는 통조림을 안전하게 열기',criteria:'도구 없이 개봉 가능하지 않은 캔인지 먼저 확인',caution:'이지오픈 캔만 준비했다면 별도 구매 필요성이 낮습니다.',guide:'/buying/food/',checkId:'opener',offer:'opener'},
 {id:'ready-snacks',title:'상온 보관 간식·에너지바',group:'food',days:7,priority:'추가 보강',why:'식사 사이 간편하게 섭취할 대체 식품',criteria:'제품별 알레르기·나트륨·당·소비기한 확인',caution:'간식은 식사와 식수를 대신하지 않습니다.',guide:'/buying/food/',checkId:'shelf-food',offer:'snacks'},
 {id:'food-bins',title:'비축 식품 보관 상자',group:'food',days:14,priority:'추가 보강',why:'먹는 순서·소비기한·수량을 한 곳에서 관리',criteria:'통풍·직사광선·방습·라벨 부착·선입선출 편의성 확인',caution:'연결 상품은 투명 리빙박스 3개입니다. 식품과 직접 닿는 용기 또는 완전 밀폐·방습 제품으로 가정하지 마세요.',guide:'/buying/food/',checkId:'food-rotation',offer:'foodbox'},
 {id:'water-container',title:'물 보관 용기 (음용 적합성 확인 필요)',group:'food',days:7,priority:'상황별',why:'단수 대비 안전한 물 보관 방법 다변화',criteria:'식수용 재질·뚜껑 밀폐·세척 가능 여부와 표시된 사용법 확인',caution:'판매 제목이 약수통이어도 음용수에 적합한 식품용 재질·세척법이 검증되지 않았습니다. 확인 전에는 식수용으로 사용하지 말고 생수를 우선하세요.',guide:'/buying/food/',checkId:'water-storage',offer:'waterjug'},
 {id:'utensils',title:'휴대용 접이식 스텐컵 150ml',group:'food',days:7,priority:'추가 보강',why:'설거지 물이 부족할 때를 대비한 식사 도구',criteria:'이미 있는 식기 사용 가능 여부·세척 방법·재질 확인',caution:'연결 상품은 150ml 소형 컵 2개입니다. 성인용 음수 컵으로는 작을 수 있으며 이미 있는 식기를 먼저 활용하세요.',guide:'/buying/food/',offer:'cup'},
 // 조명·정보 6
 {id:'flashlight',title:'건전지형 손전등',group:'light',days:3,priority:'필수 확인',why:'정전 시 휴대전화 배터리를 아끼면서 조명 확보',criteria:'건전지 규격·밝기 조절·작동 방식·예비 건전지 확인',caution:'기존 손전등이 작동한다면 구매보다 건전지 점검을 우선하세요.',guide:'/reviews/fenix-e20-v2-flashlight/',checkId:'lamp',offer:'flashlight'},
 {id:'aa-batteries',title:'AA 예비 건전지',group:'light',days:3,priority:'필수 확인',why:'라디오와 손전등의 전원 중단 대비',criteria:'현재 기기가 AA를 사용하는지 확인. 개별 포장 상태와 사용 권장 기한 확인',caution:'이 상품은 AA 20개입으로 AAA 건전지는 포함되지 않습니다. 필요 수량만 구매하세요.',guide:'/buying/gear/',checkId:'battery',offer:'aa'},
 {id:'radio',title:'휴대용 AM/FM 라디오',group:'light',days:3,priority:'필수 확인',why:'인터넷·휴대전화 통신이 어려울 때 방송 수신',criteria:'실제 지역 방송 수신·건전지 규격·안테나 점검',caution:'수신 성능은 지역·실내 위치에 따라 달라질 수 있습니다.',guide:'/reviews/emergency-am-fm-radios/',checkId:'radio',offer:'radio'},
 {id:'headlamp',title:'헤드랜턴',group:'light',days:7,priority:'상황별',why:'양손을 사용해야 할 때 필요한 보조 조명',criteria:'착용감·기기 무게·전원 규격과 실제 방수 등급 확인',caution:'손전등이 이미 충분하다면 우선 구매할 필요는 없습니다.',guide:'/reviews/emergency-flashlights-headlamps/',checkId:'lamp',offer:'headlamp'},
 {id:'led-lantern',title:'실내용 LED 랜턴',group:'light',days:7,priority:'추가 보강',why:'가족이 한 공간에 모여 있을 때 넓은 조명 확보',criteria:'전원 교체 가능성·밝기·낙하 안정성·안전 인증 확인',caution:'연결 상품의 전원 규격과 건전지 동봉 여부는 아직 확인되지 않았습니다. 구매 전 상품 정보를 확인하세요. 화재 위험이 있는 촛불을 기본 조명으로 계획하지 마세요.',guide:'/buying/gear/',offer:'lantern'},
 {id:'whistle',title:'비상 호루라기',group:'light',days:3,priority:'상황별',why:'목소리가 잘 들리지 않을 때 위치 알림 보조',criteria:'휴대성·끈 분리 안전성·작동 여부 확인',caution:'호루라기는 공식 구조 요청이나 대피를 대신하지 않습니다.',guide:'/checklist/',checkId:'whistle',offer:'whistle'},
 // 전원·충전 3
 {id:'powerbank',title:'휴대용 보조배터리',group:'power',days:3,priority:'필수 확인',why:'정전 중 휴대전화 연락과 재난정보 확인 지원',criteria:'휴대전화 호환성·케이블·충전 상태·실제 모델번호 확인',caution:'충전 용량 표기만으로 실제 충전 횟수를 단정할 수 없습니다.',guide:'/reviews/emergency-power-banks-10000-vs-20000/',checkId:'powerbank',offer:'battery'},
 {id:'charging-cable',title:'USB-C to C 충전 케이블',group:'power',days:3,priority:'필수 확인',why:'보조배터리가 있어도 케이블이 없으면 충전 불가',criteria:'USB-C·라이트닝 등 보유 기기 연결 단자 확인',caution:'연결 상품은 USB-C↔USB-C 케이블 1m·1개입니다. 라이트닝·USB-A 기기에 직접 맞지 않을 수 있으니 충전기·휴대전화 단자를 확인하세요.',guide:'/buying/gear/',checkId:'powerbank',offer:'cable'},
 {id:'car-charger',title:'USB-C 차량용 충전 어댑터',group:'power',days:14,priority:'상황별',why:'이동 중 휴대전화 충전 보조',criteria:'보유 차량 단자·정격 출력·기기 충전 방식 확인',caution:'차량 배기가스와 일산화탄소 위험 때문에 밀폐된 차고에서 엔진을 가동하지 마세요.',guide:'/buying/gear/',offer:'carcharger'},
 // 구급·위생·보온 7
 {id:'firstaid-kit',title:'기본 구급함',group:'hygiene',days:3,priority:'필수 확인',why:'가벼운 상처에 필요한 기본 물품을 모아 보관',criteria:'내용물 목록·개별 사용기한·붕대·장갑·가위 등 확인',caution:'치료용 의약품은 개인별 상황을 약사·의료진과 확인해야 합니다.',guide:'/reviews/emergency-first-aid-kit-and-dressings/',checkId:'meds',offer:'firstaid'},
 {id:'sterile-gauze',title:'멸균거즈 포함 드레싱밴드',group:'hygiene',days:3,priority:'상황별',why:'기존 구급함의 소모품 부족분 보충',criteria:'멸균 포장·사용기한·상처 크기별 규격 확인',caution:'연결 상품은 멸균거즈밴드 4개입×10개입니다. 개별 사용기한과 멸균 포장·재질을 확인하세요. 큰 상처·감염 치료를 대신하지 않습니다.',guide:'/reviews/emergency-first-aid-kit-and-dressings/',checkId:'meds',offer:'gauze'},
 {id:'wet-wipes',title:'위생용 물티슈',group:'hygiene',days:3,priority:'필수 확인',why:'단수 때 제한적인 표면·피부 청결 보조',criteria:'피부 용도·성분·밀봉 상태·보관 조건 확인',caution:'물티슈는 비누 손 씻기 또는 손 소독제를 대신하지 않습니다.',guide:'/reviews/emergency-blankets-and-hygiene-wipes/',checkId:'hygiene',offer:'wipes'},
 {id:'hand-soap',title:'비누·손 세정제',group:'hygiene',days:3,priority:'필수 확인',why:'감염 위험을 낮추기 위한 기본 위생',criteria:'가족 수·알레르기·물 사용 가능 여부 확인',caution:'물과 비누가 가능한 상황에서는 기본 손 씻기를 우선하세요.',guide:'/checklist/',checkId:'handwashing',offer:'soap'},
 {id:'waste-bags',title:'튼튼한 쓰레기봉투',group:'hygiene',days:3,priority:'필수 확인',why:'단수·정전 시 위생 폐기물과 오염물 분리',criteria:'누수·찢김에 대한 내구성, 밀봉 편의성 확인',caution:'지자체 폐기물 처리 지시를 따르세요.',guide:'/checklist/',checkId:'toilet',offer:'bags'},
 {id:'portable-toilet',title:'비상용 화장실 봉투·응고제 세트',group:'hygiene',days:7,priority:'상황별',why:'단수로 화장실 이용이 어려울 때를 대비한 봉투·응고제 묶음 후보',criteria:'제휴 상품명 기준 응고제 10개+용변봉투 10장. 실제 설치·사용 가능한 변기 형태, 봉투 내구성, 보관과 지역별 배출 방법 확인',caution:'상품명에는 응고제 10개와 용변봉투 10장이 표기되어 있습니다. 누수 차단·탈취 성능은 검증하지 않았으며 사용 후 처리·보관은 지자체 및 재난 현장 안내가 우선입니다.',guide:'/checklist/',checkId:'toilet',offer:'toilet'},
 {id:'thermal-blanket',title:'비상담요·보온용 담요',group:'hygiene',days:7,priority:'상황별',why:'옷이 젖거나 기온이 떨어지는 상황 대비',criteria:'재질·크기·보온 방법·기존 담요 대체 가능성 확인',caution:'얇은 비상담요 하나만으로 극한 추위를 견디는 것은 위험합니다.',guide:'/reviews/emergency-blankets-and-hygiene-wipes/',checkId:'warmth',offer:'blanket'},
 // 대피·서류 4
 {id:'backpack',title:'비상 이동용 배낭',group:'carry',days:3,priority:'상황별',why:'대피 때 손을 자유롭게 하고 필수품을 함께 휴대',criteria:'이미 보유한 배낭의 크기·착용감·무게·어깨끈 확인',caution:'들 수 없는 무거운 비상가방은 이동에 방해됩니다.',guide:'/reviews/emergency-bags-dry-pouches/',checkId:'bag',offer:'backpack'},
 {id:'drybag',title:'소형 방수 드라이백 5L',group:'carry',days:7,priority:'추가 보강',why:'서류나 의류처럼 젖기 쉬운 물품을 분리',criteria:'5L 용량·입구 잠금 방식·실제 방수 사용 조건 확인',caution:'방수팩은 침수 중 인명 안전이나 완전한 방수 성능을 보장하지 않습니다.',guide:'/reviews/emergency-bags-dry-pouches/',offer:'drybag'},
 {id:'document-pouch',title:'A4 서류 보관용 지퍼 파우치',group:'carry',days:7,priority:'상황별',why:'신분 확인 서류와 종이 연락처를 보호',criteria:'A4 수납·지퍼 구조·실제 방수 성능 표시 확인',caution:'판매 제목에는 PVC 지퍼 파우치라고 표기되어 있으며 완전 방수·침수 보호를 보증하지 않습니다. 개인정보를 많이 복사하거나 한곳에 두지 마세요.',guide:'/plan/',checkId:'documents',offer:'pouch'},
 {id:'rain-poncho',title:'우비·방수 겉옷',group:'carry',days:7,priority:'상황별',why:'안전한 이동 과정에서 비와 추위에 대비',criteria:'계절·사이즈·기존 우의 활용·시야 확보 확인',caution:'우비가 침수도로·급류를 통과해도 안전하게 해 주지는 않습니다.',guide:'/checklist/',checkId:'warmth',offer:'poncho'},
 // 해당 가족만 2
 {id:'baby-diapers',title:'영유아 기저귀 (밴드형 2단계)',group:'care',days:3,priority:'상황별',why:'밴드형 2단계를 사용하는 영유아가 있는 가정의 소모품 보충 후보',criteria:'실제 사용하는 밴드형·팬티형 구분, 아기 몸무게·체형·피부 반응과 현재 단계, 하루 사용량 확인',caution:'연결 상품은 하기스 맥스드라이 뉴 소형 밴드형 2단계 174매입니다. 팬티형이나 다른 단계는 포함되지 않습니다. 사이즈가 맞지 않는 아기에게 구매를 권하지 않으며 수유용품은 별도입니다.',guide:'/family-emergency/',offer:'diapers'},
 {id:'pet-food',title:'반려견 사료 (연어 레시피 3kg)',group:'care',days:3,priority:'상황별',why:'평소 해당 사료를 먹거나 성분이 적합한 반려견이 있는 가정의 사료 보충 후보',criteria:'반려견의 평소 식단·연령·알레르기·질병 및 수의학적 식이 제한과 제품 소비기한 확인',caution:'연결 상품은 탐사 강아지 사료 연어 레시피 3kg 1개입니다. 고양이 사료나 배변용품이 아니고, 처방식 또는 특수 식이가 필요한 동물에게 임의로 대체하지 마세요. 급격한 식단 변경은 피하세요.',guide:'/family-emergency/',offer:'dogfood'},
];


/**
 * Editorial selections from six Coupang Partners search-result tabs viewed
 * on 2026-10-29. Publisher then supplied matching static HTML and short
 * affiliate URLs for all six exact product titles. Detailed performance,
 * medical kit contents and product safety claims remain unverified; never
 * represent these as personally tested reviews.
 */
export const buyingGuideShortlist:Record<string,{name:string;why:string;verify:string}>={
 'portable-toilet':{name:'응가맨 응고제10개+용변봉투10장, 1개, 혼합',why:'봉투와 응고제가 함께 표기된 구성으로, 단수 시 평소 화장실 사용이 어려운 가정의 선택지',verify:'상품명 기준 응고제 10개+봉투 10장입니다. 실제 내용물, 변기 호환, 누수·악취 관리, 지역별 배출 방법을 확인'},
 'baby-diapers':{name:'하기스 맥스드라이 뉴 공용 소형 밴드형, 2단계, 174매',why:'현재 밴드형 2단계를 사용하는 아기의 기저귀 재고를 보충할 때만 적합한 174매 구성',verify:'팬티형이 아닌 밴드형 2단계입니다. 현재 아이에게 맞는 사이즈·피부 적합성·사용량·보관 기간 확인'},
 'pet-food':{name:'탐사 강아지 사료 연어 레시피, 3kg, 1개',why:'평소 해당 사료를 급여하거나 식이 적합성이 확인된 반려견의 비축 사료 후보',verify:'반려견용 3kg이며 고양이/처방식용이 아닙니다. 기존 사료·알레르기·소비기한·급여 방식 확인'},

 'aa-batteries':{
  name:'벡셀 알카라인 AA 건전지, 20개입, 1개',
  why:'라디오·손전등에 쓰이는 AA 규격을 별도 비축하기 쉬운 구성. 20개입으로 확인됨',
  verify:'실제 기기가 AA인지 확인. 생산·사용 권장 기한과 정확한 20개입 옵션을 상세 페이지에서 재확인',
 },
 'headlamp':{
  name:'에너자이저 비전 HD+ LED 헤드랜턴 아마존팩 HDCA32, 1개',
  why:'이름과 제품군이 구분되는 브랜드 제품을 과장된 밝기 광고보다 우선 선정',
  verify:'제휴 HTML에 모델 HDCA32로 확인됨. 전원 규격·건전지 동봉 여부·방수 사양은 상세 페이지에서 확인',
 },
 'firstaid-kit':{
  name:'한양 스피드 구급함 대형 19종세트 구급상자, 1세트',
  why:'빈 구급 상자가 아닌 구성품 포함 세트로 표시된 후보',
  verify:'19종 세트 상품명은 HTML로 확인됨. 각 구성품·사용기한·의약품 포함 여부를 상세 페이지에서 확인하고 의료 효능은 단정하지 않음',
 },
 'wet-wipes':{
  name:'탐사 클래식 물티슈 캡형, 100매, 10개',
  why:'캡형 100매 묶음 10개로 목록에 명시되어 비축 수량을 계획하기 쉬움',
  verify:'사용 목적·성분·제품별 사용기한과 뚜껑 밀폐 상태 확인. 물티슈는 손 씻기나 소독제를 대신하지 않음',
 },
 'thermal-blanket':{
  name:'코멧 홈 포근 플리스 똑딱이 담요',
  why:'전기를 사용하지 않는 일상 겸용 보조 담요 후보',
  verify:'실제 크기·재질·사용 환경을 확인. 일반 플리스 담요를 전문 저체온증 응급 장비로 설명하지 않음',
 },
 'manual-opener':{
  name:'코멧 키친 캔오프너 + 병따개, 1개',
  why:'전원이 필요 없는 수동 제품으로 표시되고 통조림·병따개 기능을 한 도구에 결합',
  verify:'수동 작동 방식·캔 크기 호환성과 날카로운 절단면 취급 주의 확인',
 },
};


const recentOfferNotes:Record<string,{why:string;verify:string}> = {
 'ready-meals':{why:'데우지 않고 먹는 실온보관 닭가슴살. 전기·조리용 물이 없을 때 식단의 일부로 사용',verify:'상품 옵션은 100g×60개입니다. 60개 구매 필요성·소비기한·알레르기 및 보관 조건 확인'},
 'charging-cable':{why:'삼성전자 SU-CC3110, 1m USB-C to C 케이블로 제품 모델과 단자가 명확',verify:'휴대전화와 보조배터리의 USB-C 단자·고속충전 호환 확인'},
 'hand-soap':{why:'기존 거품 핸드워시 용기를 보충할 수 있는 600ml 리필형',verify:'전용 용기·성분·알레르기·개봉 후 관리 방법 확인'},
 'waste-bags':{why:'쓰레기 임시 분류용 50L 검정 봉투 100개 구성',verify:'종량제 봉투가 아닙니다. 두께·누수 가능성과 지역 폐기물 배출 규칙 확인'},
 'sterile-gauze':{why:'멸균거즈밴드 4개입×10개 보충 후보',verify:'독립된 거즈 단품과 다릅니다. 실제 멸균 표시·규격·개별 사용기한 확인'},
 'backpack':{why:'22L 소형 등산 배낭으로 가벼운 대피 물품 휴대 후보',verify:'상품명의 590g·22L 외에 착용감·적재 하중·방수 성능은 단정하지 않음'},
 'ready-snacks':{why:'닥터유 에너지바 미니 310g×3개, 상온 간식 보조',verify:'견과류 등 알레르기·보관 조건과 실제 섭취 수량 확인'},
 'led-lantern':{why:'에너자이저 360 Area LED 캠핑 랜턴, 보조 실내 조명 후보',verify:'전원 종류·건전지 동봉·사용 시간·안전 표시 확인'},
 'whistle':{why:'낫소 듀얼호각 블랙 1개로 비상 신호 보조',verify:'기능·휴대성 및 목걸이 끈 안전성 확인'},
 'water-container':{why:'10L 생수통/약수통으로 표시된 대체 보관용기 후보',verify:'음용수용 재질과 식품 접촉 적합성·세척법을 확인하기 전에는 식수용으로 사용하지 않음'},
 'food-bins':{why:'투명 리빙박스 3개로 상온 비축품 재고 분류',verify:'수납용입니다. 식수·식품의 직접 보관 및 방습·밀폐 보장 제품이 아님'},
 'document-pouch':{why:'A4 서류를 정리하는 PVC 지퍼 파우치 10개',verify:'방수 인증·침수 보호가 확인되지 않았으므로 단순 문서 수납용으로 안내'},
 'rain-poncho':{why:'데이브렉 판초우의 1개, 비 오는 날 실외 이동용 후보',verify:'착용 사이즈·재질·제조사 방수 성능 확인, 위험한 침수 통행 금지'},
 'utensils':{why:'150ml 소형 스텐 접이식 컵 2개',verify:'성인이 주력 음수컵으로 쓰기에는 작을 수 있어 기존 식기와 비교'},
 'car-charger':{why:'벨킨 CCA004qcBK USB-C PPS 30W 차량용 충전기',verify:'차량 전원 단자·휴대전화 충전 규격·케이블 포함 여부 확인. 밀폐공간에서 엔진 가동 금지'},
};
for(const [key, detail] of Object.entries(recentOfferNotes)){
 if(buyingGuideShortlist[key])throw Error('Duplicate recent product note: '+key);
 buyingGuideShortlist[key]={
  name: buyingGuideProducts.find(item=>item.id===key)?.title||key,
  why:detail.why,
  verify:detail.verify,
 };
}

/** The public review catalog contains only publisher-linked Coupang product options.
 * Keep archived research on other models out of the rendered buyer experience.
 * The linked listing is not a real-time stock or delivery guarantee.
 */
export interface ReviewShoppingOffer {
 offer:AffiliateOfferKey;
 why:string;
 sameModel?:boolean;
}
export const reviewShoppingOffers:Record<string,ReviewShoppingOffer[]>={
 'fenix-e20-v2-flashlight':[
  {offer:'flashlight',why:'본문에서 다룬 페닉스 E20 V2.0의 연결 상품입니다',sameModel:true},
  {offer:'aa',why:'AA 건전지 2개를 사용하는 손전등의 예비 전원용. 건전지 동봉 여부와 필요 수량 확인'},
 ],
 'emergency-am-fm-radios':[
  {offer:'radio',why:'본문에서 다룬 소니 ICF-P26 블랙 옵션입니다',sameModel:true},
  {offer:'aa',why:'AA 건전지형 기기에만 사용하는 예비 AA 20개입. 수신 테스트 및 건전지 필요량 확인'},
 ],
 'coupang-stock-audit-samsung-p3400-p3401':[
  {offer:'battery',why:'문서에서 확인한 2026년형 삼성 EB-P3401 베이지 10,000mAh의 연결 상품'},
  {offer:'cable',why:'USB-C 단자를 사용하는 기기에만 적합한 삼성 C to C 1m 케이블. 호환성 확인'},
 ],
 'emergency-power-banks-10000-vs-20000':[
  {offer:'battery',why:'쿠팡에 연결된 삼성 EB-P3401 2026년형 10,000mAh. 실제 출력·모델 정보는 이 옵션의 공식 사양과 상세정보 확인'},
  {offer:'cable',why:'연결 기기가 USB-C C to C를 지원할 경우에만 고려할 1m 케이블'},
 ],
 'emergency-flashlights-headlamps':[
  {offer:'flashlight',why:'판매 링크가 등록된 페닉스 E20 V2.0 손전등. AA 건전지 2개 필요'},
  {offer:'headlamp',why:'쿠팡에 연결된 에너자이저 HDCA32 헤드랜턴. 착용감·전원 규격 확인'},
  {offer:'aa',why:'AA 규격 조명에만 필요한 예비 건전지 20개입. 다른 크기 건전지와 호환되지 않음'},
 ],
 'emergency-bags-dry-pouches':[
  {offer:'drybag',why:'씨투써밋 라이트웨이트 드라이백 5L 판매 상품. 실사용 용량·방수 범위 확인'},
  {offer:'backpack',why:'사용 가능한 배낭이 없다면 검토할 라이트론 22L 경량 배낭'},
  {offer:'pouch',why:'서류 정리용 PVC 지퍼 파우치. 완전 방수·침수 보호 성능은 미검증'},
 ],
 'emergency-blankets-and-hygiene-wipes':[
  {offer:'blanket',why:'코멧 플리스 일반 담요 판매 상품. 은박형 응급담요가 아니므로 보온·방풍 용도를 구분'},
  {offer:'wipes',why:'탐사 물티슈 100매×10개 판매 상품. 손 소독용 제품으로 간주하지 않음'},
 ],
 'emergency-first-aid-kit-and-dressings':[
  {offer:'firstaid',why:'한양 스피드 가정용 구급함 대형 19종세트. 실제 구성품·사용기한 확인'},
  {offer:'gauze',why:'네오 드레싱 멸균거즈밴드 4개입×10개. 멸균 포장·사용기한 확인'},
 ],
 'emergency-kit-set-composition-audit':[
  {offer:'water',why:'별도 품목인 생수 2L×12개. 비상세트 구성품에 포함된다는 의미가 아님'},
  {offer:'firstaid',why:'별도 판매 19종 구급함. 이 구급함 하나로 완성형 재난 대비 세트가 되지 않음'},
  {offer:'backpack',why:'물품을 모아 들기 위한 22L 배낭 예시. 식수·의약품이 포함된 키트가 아님'},
 ],
 'emergency-products-kc-model-expiry-audit':[
  {offer:'battery',why:'안전 표시·모델번호를 구매자가 확인해야 하는 실제 삼성 EB-P3401 판매 상품 예시'},
  {offer:'gauze',why:'개별 멸균·사용기한 확인이 필요한 드레싱밴드 판매 상품 예시'},
 ],
 'emergency-retail-option-priority-and-affiliate-gates':[
  {offer:'flashlight',why:'모델과 개인 제휴 URL을 연결한 페닉스 E20 V2.0 구매 사례'},
  {offer:'radio',why:'모델 확인 후 연결한 소니 ICF-P26 블랙 라디오 구매 사례'},
  {offer:'battery',why:'2026년형 삼성 EB-P3401 베이지 10,000mAh 개별 판매 상품'},
 ],
};
