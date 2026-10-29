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
export const buyingGuideProducts:GuideProduct[]=[
 // 식수·비상식량 8
 {id:'drinking-water',title:'포장 생수',group:'food',days:3,priority:'필수 확인',why:'마실 물과 기본 위생수 확보',criteria:'총 용량·유통 단위·보관 장소와 포장 표시 확인',caution:'가족별 필요량을 계산한 뒤 부족분만 구입하세요. 24L 한 묶음이 모두에게 충분한 것은 아닙니다.',guide:'/buying/food/',checkId:'water-bottles',offer:'water'},
 {id:'canned-protein',title:'바로 먹을 수 있는 통조림',group:'food',days:3,priority:'필수 확인',why:'가열 없이 먹을 상온 식품 종류 확보',criteria:'실온 보관·소비기한·알레르기·식이 제한 확인',caution:'참치만으로 식단을 채우지 마세요. 캔따개 필요 여부도 확인하세요.',guide:'/buying/food/',checkId:'shelf-food',offer:'tuna'},
 {id:'ready-meals',title:'조리 없는 상온 간편식',group:'food',days:3,priority:'필수 확인',why:'전기·가스·조리용 물이 없어도 먹을 수 있는 식사',criteria:'가열 없이 섭취 가능한지, 조리수·식기·보관 조건 확인',caution:'상품명이 간편식이어도 냉장·냉동 제품은 핵심 비축 식량으로 계산하지 마세요.',guide:'/buying/food/',checkId:'shelf-food'},
 {id:'manual-opener',title:'수동 캔따개',group:'food',days:3,priority:'상황별',why:'따개 없는 통조림을 안전하게 열기',criteria:'도구 없이 개봉 가능하지 않은 캔인지 먼저 확인',caution:'이지오픈 캔만 준비했다면 별도 구매 필요성이 낮습니다.',guide:'/buying/food/',checkId:'opener'},
 {id:'ready-snacks',title:'상온 보관 간식·에너지 간식',group:'food',days:7,priority:'추가 보강',why:'식사 사이 간편하게 섭취할 대체 식품',criteria:'제품별 알레르기·나트륨·당·소비기한 확인',caution:'간식은 식사와 식수를 대신하지 않습니다.',guide:'/buying/food/',checkId:'shelf-food'},
 {id:'food-bins',title:'비축 식품 보관 상자',group:'food',days:14,priority:'추가 보강',why:'먹는 순서·소비기한·수량을 한 곳에서 관리',criteria:'통풍·직사광선·방습·라벨 부착·선입선출 편의성 확인',caution:'상자 자체가 식품을 장기 보존해 주는 것은 아닙니다.',guide:'/buying/food/',checkId:'food-rotation'},
 {id:'water-container',title:'안전한 식수 보관 용기',group:'food',days:7,priority:'상황별',why:'단수 대비 안전한 물 보관 방법 다변화',criteria:'식수용 재질·뚜껑 밀폐·세척 가능 여부와 표시된 사용법 확인',caution:'일반 수납용 통에 식수를 임의로 오래 저장하지 마세요.',guide:'/buying/food/',checkId:'water-storage'},
 {id:'utensils',title:'간편 식기·접이식 컵',group:'food',days:7,priority:'추가 보강',why:'설거지 물이 부족할 때를 대비한 식사 도구',criteria:'이미 있는 식기 사용 가능 여부·세척 방법·재질 확인',caution:'일회용품을 과하게 비축할 필요는 없습니다.',guide:'/buying/food/'},
 // 조명·정보 6
 {id:'flashlight',title:'건전지형 손전등',group:'light',days:3,priority:'필수 확인',why:'정전 시 휴대전화 배터리를 아끼면서 조명 확보',criteria:'건전지 규격·밝기 조절·작동 방식·예비 건전지 확인',caution:'기존 손전등이 작동한다면 구매보다 건전지 점검을 우선하세요.',guide:'/reviews/fenix-e20-v2-flashlight/',checkId:'lamp',offer:'flashlight'},
 {id:'aa-batteries',title:'AA·AAA 예비 건전지',group:'light',days:3,priority:'필수 확인',why:'라디오와 손전등의 전원 중단 대비',criteria:'현재 기기와 정확히 일치하는 규격·보관 기한·포장 상태 확인',caution:'AA와 AAA는 호환되지 않습니다. 사용하지 않는 규격은 사지 마세요.',guide:'/buying/gear/',checkId:'battery'},
 {id:'radio',title:'휴대용 AM/FM 라디오',group:'light',days:3,priority:'필수 확인',why:'인터넷·휴대전화 통신이 어려울 때 방송 수신',criteria:'실제 지역 방송 수신·건전지 규격·안테나 점검',caution:'수신 성능은 지역·실내 위치에 따라 달라질 수 있습니다.',guide:'/reviews/emergency-am-fm-radios/',checkId:'radio',offer:'radio'},
 {id:'headlamp',title:'헤드랜턴',group:'light',days:7,priority:'상황별',why:'양손을 사용해야 할 때 필요한 보조 조명',criteria:'착용감·기기 무게·전원 규격과 실제 방수 등급 확인',caution:'손전등이 이미 충분하다면 우선 구매할 필요는 없습니다.',guide:'/reviews/emergency-flashlights-headlamps/',checkId:'lamp'},
 {id:'led-lantern',title:'실내용 배터리 LED 랜턴',group:'light',days:7,priority:'추가 보강',why:'가족이 한 공간에 모여 있을 때 넓은 조명 확보',criteria:'전원 교체 가능성·밝기·낙하 안정성·안전 인증 확인',caution:'화재 위험이 있는 촛불을 기본 조명으로 계획하지 마세요.',guide:'/buying/gear/'},
 {id:'whistle',title:'비상 호루라기',group:'light',days:3,priority:'상황별',why:'목소리가 잘 들리지 않을 때 위치 알림 보조',criteria:'휴대성·끈 분리 안전성·작동 여부 확인',caution:'호루라기는 공식 구조 요청이나 대피를 대신하지 않습니다.',guide:'/checklist/',checkId:'whistle'},
 // 전원·충전 3
 {id:'powerbank',title:'휴대용 보조배터리',group:'power',days:3,priority:'필수 확인',why:'정전 중 휴대전화 연락과 재난정보 확인 지원',criteria:'휴대전화 호환성·케이블·충전 상태·실제 모델번호 확인',caution:'충전 용량 표기만으로 실제 충전 횟수를 단정할 수 없습니다.',guide:'/reviews/emergency-power-banks-10000-vs-20000/',checkId:'powerbank',offer:'battery'},
 {id:'charging-cable',title:'휴대전화 호환 충전 케이블',group:'power',days:3,priority:'필수 확인',why:'보조배터리가 있어도 케이블이 없으면 충전 불가',criteria:'USB-C·라이트닝 등 보유 기기 연결 단자 확인',caution:'맞지 않는 단자의 케이블을 구매하지 마세요.',guide:'/buying/gear/',checkId:'powerbank'},
 {id:'car-charger',title:'차량용 충전 어댑터',group:'power',days:14,priority:'상황별',why:'이동 중 휴대전화 충전 보조',criteria:'보유 차량 단자·정격 출력·기기 충전 방식 확인',caution:'차량 배기가스와 일산화탄소 위험 때문에 밀폐된 차고에서 엔진을 가동하지 마세요.',guide:'/buying/gear/'},
 // 구급·위생·보온 7
 {id:'firstaid-kit',title:'기본 구급함',group:'hygiene',days:3,priority:'필수 확인',why:'가벼운 상처에 필요한 기본 물품을 모아 보관',criteria:'내용물 목록·개별 사용기한·붕대·장갑·가위 등 확인',caution:'치료용 의약품은 개인별 상황을 약사·의료진과 확인해야 합니다.',guide:'/reviews/emergency-first-aid-kit-and-dressings/',checkId:'meds'},
 {id:'sterile-gauze',title:'멸균 거즈·붕대',group:'hygiene',days:3,priority:'상황별',why:'기존 구급함의 소모품 부족분 보충',criteria:'멸균 포장·사용기한·상처 크기별 규격 확인',caution:'감염이나 큰 상처의 치료를 대신할 수 없습니다.',guide:'/reviews/emergency-first-aid-kit-and-dressings/',checkId:'meds'},
 {id:'wet-wipes',title:'위생용 물티슈',group:'hygiene',days:3,priority:'필수 확인',why:'단수 때 제한적인 표면·피부 청결 보조',criteria:'피부 용도·성분·밀봉 상태·보관 조건 확인',caution:'물티슈는 비누 손 씻기 또는 손 소독제를 대신하지 않습니다.',guide:'/reviews/emergency-blankets-and-hygiene-wipes/',checkId:'hygiene'},
 {id:'hand-soap',title:'비누·손 세정제',group:'hygiene',days:3,priority:'필수 확인',why:'감염 위험을 낮추기 위한 기본 위생',criteria:'가족 수·알레르기·물 사용 가능 여부 확인',caution:'물과 비누가 가능한 상황에서는 기본 손 씻기를 우선하세요.',guide:'/checklist/',checkId:'handwashing'},
 {id:'waste-bags',title:'튼튼한 쓰레기봉투',group:'hygiene',days:3,priority:'필수 확인',why:'단수·정전 시 위생 폐기물과 오염물 분리',criteria:'누수·찢김에 대한 내구성, 밀봉 편의성 확인',caution:'지자체 폐기물 처리 지시를 따르세요.',guide:'/checklist/',checkId:'toilet'},
 {id:'portable-toilet',title:'비상용 화장실 봉투·흡수재',group:'hygiene',days:7,priority:'상황별',why:'급수·하수도가 일시 중단될 때 위생 관리',criteria:'흡수재 성능·누수 방지·처리 방법·가족 사용량 확인',caution:'사용 후 처리 및 보관은 지자체·재난 현장 안내를 우선하세요.',guide:'/checklist/',checkId:'toilet'},
 {id:'thermal-blanket',title:'비상담요·보온용 담요',group:'hygiene',days:7,priority:'상황별',why:'옷이 젖거나 기온이 떨어지는 상황 대비',criteria:'재질·크기·보온 방법·기존 담요 대체 가능성 확인',caution:'얇은 비상담요 하나만으로 극한 추위를 견디는 것은 위험합니다.',guide:'/reviews/emergency-blankets-and-hygiene-wipes/',checkId:'warmth'},
 // 대피·서류 4
 {id:'backpack',title:'비상 이동용 배낭',group:'carry',days:3,priority:'상황별',why:'대피 때 손을 자유롭게 하고 필수품을 함께 휴대',criteria:'이미 보유한 배낭의 크기·착용감·무게·어깨끈 확인',caution:'들 수 없는 무거운 비상가방은 이동에 방해됩니다.',guide:'/reviews/emergency-bags-dry-pouches/',checkId:'bag'},
 {id:'drybag',title:'소형 방수 드라이백 5L',group:'carry',days:7,priority:'추가 보강',why:'서류나 의류처럼 젖기 쉬운 물품을 분리',criteria:'5L 용량·입구 잠금 방식·실제 방수 사용 조건 확인',caution:'방수팩은 침수 중 인명 안전이나 완전한 방수 성능을 보장하지 않습니다.',guide:'/reviews/emergency-bags-dry-pouches/',offer:'drybag'},
 {id:'document-pouch',title:'서류용 방습·방수 파우치',group:'carry',days:7,priority:'상황별',why:'신분 확인 서류와 종이 연락처를 보호',criteria:'A4 등 서류 규격·지퍼 방습·개인정보 노출 위험 확인',caution:'불필요한 개인정보를 많이 복사하거나 한곳에 두지 마세요.',guide:'/plan/',checkId:'documents'},
 {id:'rain-poncho',title:'우비·방수 겉옷',group:'carry',days:7,priority:'상황별',why:'안전한 이동 과정에서 비와 추위에 대비',criteria:'계절·사이즈·기존 우의 활용·시야 확보 확인',caution:'우비가 침수도로·급류를 통과해도 안전하게 해 주지는 않습니다.',guide:'/checklist/',checkId:'warmth'},
 // 해당 가족만 2
 {id:'baby-diapers',title:'영유아 기저귀·수유용품',group:'care',days:3,priority:'상황별',why:'영유아가 있는 가족만 연령과 수유 방식에 맞춰 준비',criteria:'실제 사이즈·피부 적합성·필요량·수유 위생 조건 확인',caution:'아기에게 맞지 않는 분유·식품을 비상용이라는 이유로 임의 변경하지 마세요.',guide:'/family-emergency/'},
 {id:'pet-food',title:'반려동물 사료·배변용품',group:'care',days:3,priority:'상황별',why:'반려동물 동반 가족의 먹이·위생·이동 대비',criteria:'동물별 식이·건강 상태·소비기한·이동장 규격 확인',caution:'대피시설 동반 가능 여부는 해당 시설의 공식 규정을 확인하세요.',guide:'/family-emergency/'},
];
