import type { AffiliateOfferKey } from './affiliate-product-visuals';

export const protocolStages=[
 {days:3,name:'3일',subtitle:'최소 72시간',label:'첫 72시간',lead:'정전·단수·통신 장애가 시작되더라도 바로 쓸 물·음식·빛·정보와 안전한 대피 계획을 먼저 준비합니다.',detail:'국민안전24 호우 대비 안내와 미국 CDC의 최소 3일 비상식수 참고를 바탕으로 구성했습니다.'},
 {days:7,name:'7일',subtitle:'1주일',label:'초기 비축 확장',lead:'3일 준비를 유지한 채 위생·보온·예비 전원을 보강합니다.',detail:'7일은 이 사이트의 실용적 확장 단계입니다. 정부가 모든 가정에 별도로 명령한 기준은 아닙니다.'},
 {days:14,name:'14일',subtitle:'2주일',label:'2주 버티기',lead:'식수 보관 장소, 교체 일정, 식품 종류를 정리하고 가족별 필요를 다시 계산합니다.',detail:'미국 CDC는 가능하다면 2주치 식수를 준비하라고 안내합니다. 모든 가정에 동일한 양을 일괄 구매하라는 뜻은 아닙니다.'},
 {days:30,name:'30일',subtitle:'1개월',label:'국내 장기 대비 안내',lead:'국민안전24의 식량·식수 30일분 안내를 참고하되 실제 집에 맞는 저장 공간·교체 비용·취사 가능성을 점검합니다.',detail:'국민안전24 비상대비 물자 준비 안내의 식량·식수 30일분을 참고했습니다. 사용량은 개인별로 조정해야 합니다.'},
 {days:60,name:'60일',subtitle:'2개월',label:'장기 생활 유지 계획',lead:'한 번에 대량 구매하기보다 재보급·보관·위생·건강 관리가 중단되는 상황을 대비해 계획을 세웁니다.',detail:'60일은 정부 공식 의무 비축 기간이 아닌 자율적 장기 시나리오입니다.'},
 {days:90,name:'90일',subtitle:'3개월',label:'장기 회복·대체 계획',lead:'집에만 머무는 계획이 아니라 장기 정전·단수, 재보급 중단, 이동 필요성에 대한 여러 대안을 준비합니다.',detail:'90일은 정부 공식 의무 비축 기간이 아닌 자율적 장기 시나리오입니다. 90일치 생수를 일괄 구매하라는 권장이 아닙니다.'},
] as const;
export type ProtocolDays=(typeof protocolStages)[number]['days'];
export type ProtocolCategory='water'|'food'|'power'|'health'|'plan';
export const protocolCategories=[
 {id:'water',title:'식수·위생수',emoji:'💧'},
 {id:'food',title:'식량·조리',emoji:'🥫'},
 {id:'power',title:'조명·전원·정보',emoji:'🔋'},
 {id:'health',title:'건강·위생·보온',emoji:'🩹'},
 {id:'plan',title:'대피·연락·장기계획',emoji:'🎒'},
] as const;
export interface ProtocolItem{
 id:string;
 from:ProtocolDays;
 category:ProtocolCategory;
 title:string;
 note:string;
 checkId?:string;
 offer?:AffiliateOfferKey;
 optional?:boolean;
 guide:string;
}
export const protocolItems:ProtocolItem[]=[
 {id:'water',from:3,category:'water',title:'안전한 식수와 생활용 물',note:'우선 최소 3일치. 가족별 부족분은 아래 계산기로 확인하세요. 물병 묶음이 모든 가족에 충분한 것은 아닙니다.',checkId:'water-bottles',offer:'water',guide:'/buying/food/'},
 {id:'food',from:3,category:'food',title:'불 없이 먹을 수 있는 상온 식품',note:'평소 잘 먹는 식품을 먼저 활용하세요. 참치는 여러 식품 중 하나로, 이것만으로 영양을 충족할 수는 없습니다.',checkId:'shelf-food',offer:'tuna',guide:'/buying/food/'},
 {id:'flashlight',from:3,category:'power',title:'손전등과 작동 확인',note:'집에 있는 조명부터 켜 보세요. 페닉스 모델은 AA 건전지 2개를 사용하며 별도 구매가 필요한지 확인하세요.',checkId:'lamp',offer:'flashlight',guide:'/reviews/fenix-e20-v2-flashlight/'},
 {id:'radio',from:3,category:'power',title:'지역 방송 수신 라디오',note:'배터리가 있어도 실제 지역 FM/AM이 들리는지 사전 시험하세요. 소니 ICF-P26은 AA 건전지를 사용합니다.',checkId:'radio',offer:'radio',guide:'/reviews/emergency-am-fm-radios/'},
 {id:'powerbank',from:3,category:'power',title:'충전된 보조배터리·케이블',note:'휴대전화 규격과 충전 상태를 먼저 확인하세요. 삼성 EB-P3401은 10,000mAh·25W 제품입니다.',checkId:'powerbank',offer:'battery',guide:'/reviews/emergency-power-banks-10000-vs-20000/'},
 {id:'medical',from:3,category:'health',title:'기본 구급함·개인 복용약·처방 정보',note:'19종 구급 세트의 실제 구성품과 개별 사용기한은 구매 전 확인하세요. 처방약을 임의로 중단하거나 과잉 비축하지 마세요.',checkId:'meds',offer:'firstaid',guide:'/reviews/emergency-first-aid-kit-and-dressings/'},
 {id:'hygiene',from:3,category:'health',title:'기본 위생용품',note:'비누·휴지·물티슈·쓰레기봉투를 가족 수에 맞춰 준비하세요. 물티슈는 손 소독제를 대신하지 않습니다.',checkId:'hygiene',offer:'wipes',guide:'/checklist/#kit-medical'},
 {id:'family',from:3,category:'plan',title:'연락처·집결지·대피 장소',note:'구매보다 우선입니다. 종이 연락 카드와 공식 대피소를 미리 확인하세요.',checkId:'contacts',guide:'/plan/'},
 {id:'care',from:3,category:'health',title:'영유아·어르신·반려동물 맞춤 용품',note:'해당 가족만 별도 확인. 기저귀·수유·돌봄·반려동물 용품과 건강 조건은 일반 성인 기준으로 계산하지 않습니다.',guide:'/checklist/#kit-baby'},
 {id:'headlamp',from:7,category:'power',title:'양손을 쓰는 헤드랜턴',note:'선택 용품입니다. 에너자이저 HDCA32 모델의 전원 규격·동봉 건전지·방수 표시는 판매 페이지에서 확인하세요.',checkId:'lamp',offer:'headlamp',optional:true,guide:'/reviews/emergency-flashlights-headlamps/'},
 {id:'spare',from:7,category:'power',title:'여분 건전지·충전 방식 재점검',note:'AA 건전지 20개입은 AA 규격 기기에만 맞습니다. 기기에 AAA 등 다른 규격이 필요하면 별도로 준비하세요.',checkId:'battery',offer:'aa',guide:'/buying/gear/'},
 {id:'warmth',from:7,category:'health',title:'여벌 옷·담요·걷기 좋은 신발',note:'코멧 플리스 담요는 일반 보온용입니다. 충분한 방한복과 기존 담요가 있다면 별도 구매할 필요는 없습니다.',checkId:'warmth',offer:'blanket',guide:'/checklist/#kit-medical'},
 {id:'sanitation',from:7,category:'health',title:'단수 시 화장실·폐기물 처리 계획',note:'급수 중단 때 사용할 응고제10개+용변봉투10장 세트입니다. 실제 내용물·안전한 보관·폐기 방법을 지역 안내에 따라 확인하세요.',checkId:'toilet',offer:'toilet',guide:'/buying/'},
 {id:'drybag',from:7,category:'plan',title:'서류·의류용 소형 방수팩',note:'선택 용품입니다. 서류와 작은 물품을 나눠 담는 용도이며 완전 침수 방수는 보장하지 않습니다.',offer:'drybag',optional:true,guide:'/reviews/emergency-bags-dry-pouches/'},
 {id:'documents',from:7,category:'plan',title:'중요서류 사본과 현금',note:'종이 연락처·신분확인 자료와 소액 현금을 분산 보관하고 개인정보 노출을 방지하세요.',checkId:'documents',guide:'/plan/'},
 {id:'water-storage',from:14,category:'water',title:'안전한 보관·교체·물 확보 계획',note:'2주치 식수는 공간과 무게를 확인해 무리 없이 준비합니다. 오염이 의심되는 물은 임의로 음용하지 않습니다.',checkId:'water-storage',guide:'/buying/food/'},
 {id:'rotation',from:14,category:'food',title:'식품 종류·알레르기·교체 날짜',note:'통조림·바로 먹는 식품을 다양하게 구성하고 포장별 보관 조건과 소비기한을 관리하세요.',checkId:'food-rotation',guide:'/buying/food/'},
 {id:'opener',from:14,category:'food',title:'수동 캔따개와 식기 점검',note:'따개가 필요한 통조림이 있다면 필수입니다. 조리 없이 먹을 수 있는 식품을 우선하세요.',checkId:'opener',offer:'opener',guide:'/checklist/#kit-water'},
 {id:'inventory',from:30,category:'food',title:'30일분 식량·식수 재고표',note:'국민안전24의 장기 대비 안내를 참고해 가정별 총량, 소비기한, 보관 위치와 지출 한도를 기록하세요.',guide:'/checklist/'},
 {id:'food-cooking',from:30,category:'food',title:'취사 가능 조건과 안전한 대안',note:'실내에서 숯·발전기·버너를 사용하지 마세요. 정전 시에는 조리가 필요 없는 음식이 우선입니다.',guide:'/buying/food/'},
 {id:'firstaid-review',from:30,category:'health',title:'의약·돌봄 물품 재점검',note:'약·의료용품은 적정 사용기한과 처방 계획을 의료진·약사와 협의하세요.',guide:'/checklist/#kit-medical'},
 {id:'communication',from:30,category:'plan',title:'가족 연락·대피 경로 재확인',note:'인터넷·전화·교통이 중단될 경우의 연락책과 이동 계획을 문서로 정리하세요.',checkId:'shelter',guide:'/plan/'},
 {id:'resupply',from:60,category:'water',title:'장기 급수·재보급 대체계획',note:'추정 사용량 전체를 생수로 한 번에 사지 않습니다. 안전한 공급·지자체 배급·공식 지시를 확인하는 경로를 마련하세요.',guide:'/buying/food/'},
 {id:'supply-chain',from:60,category:'food',title:'주기적 교체와 생활비 계획',note:'비축을 소비하면서 채우는 순환 방식으로 비용·보관 공간을 관리하세요. 과잉 구매를 피하세요.',guide:'/checklist/'},
 {id:'recovery',from:90,category:'plan',title:'대체 거처·장기 돌봄·복구 계획',note:'계속 집에 머무는 것만 가정하지 마세요. 공식 대피·재난 지원 정보와 가족별 이동 수단을 미리 확인하세요.',guide:'/plan/'},
 {id:'longhealth',from:90,category:'health',title:'위생·건강 관리 지속성',note:'장기간 도움을 받기 어려운 상황을 고려해 개인 의료 연락망, 위생 유지와 폐기물 처리 계획을 갱신하세요.',guide:'/checklist/#kit-medical/'},
 {id:'diapers-care-extra',from:3,category:'health',title:'영유아 기저귀 개인별 사이즈 확인',note:'하기스 맥스드라이 2단계 174매는 밴드형입니다. 해당 단계를 실제 착용하는 아기에게만 해당하며 팬티형·다른 사이즈와 혼동하지 마세요.',offer:'diapers',optional:true,guide:'/family-emergency/'},
 {id:'dogfood-care-extra',from:3,category:'health',title:'반려견이 평소 먹는 사료 준비',note:'탐사 강아지 사료 연어 레시피 3kg은 반려견용입니다. 고양이나 처방식 동물에게 대체하지 말고 기존 급여 사료·알레르기·소비기한을 확인하세요.',offer:'dogfood',optional:true,guide:'/family-emergency/'},
 {id:'readymeal-extra',from:3,category:'food',title:'상온 조리 없는 간편식 추가 선택',note:'비가열 닭가슴살 100g×60개는 대용량 예시입니다. 60개를 구매할 필요는 없으며 알레르기·소비기한·보관 공간을 먼저 점검하세요.',offer:'readymeal',optional:true,guide:'/buying/'},
 {id:'cable-extra',from:3,category:'power',title:'휴대전화 충전 케이블 확인',note:'기존 보조배터리·충전기가 USB-C to C를 지원하는지 먼저 확인하세요. 삼성 SU-CC3110은 USB-C용 1m 케이블 1개 상품입니다.',offer:'cable',optional:true,guide:'/buying/'},
 {id:'soap-extra',from:3,category:'health',title:'비누·손 세정제 용기와 리필',note:'리필형 600ml는 호환되는 용기가 있어야 편리합니다. 비누를 이미 보유하면 추가 구매 대신 작동·보관 상태를 점검하세요.',offer:'soap',optional:true,guide:'/buying/'},
 {id:'bags-extra',from:3,category:'health',title:'위생 폐기물 임시 분리용 봉투',note:'검정 50L×100장 분리수거 봉투 상품입니다. 지자체 종량제봉투를 대신할 수 없으며 보유 수량을 먼저 확인하세요.',offer:'bags',optional:true,guide:'/buying/'},
 {id:'backpack-extra',from:3,category:'plan',title:'가볍게 휴대할 수 있는 대피 배낭',note:'22L 배낭은 예시입니다. 적재량·착용감이 맞고 이미 사용 가능한 가방이 있다면 별도 구매할 필요가 없습니다.',offer:'backpack',optional:true,guide:'/buying/'},
 {id:'whistle-extra',from:3,category:'plan',title:'손 닿는 곳에 둘 비상 신호 호루라기',note:'낫소 듀얼호각은 보조 신호 장치입니다. 공식 경보·대피 지시·구조 요청을 대신하지 않습니다.',offer:'whistle',optional:true,guide:'/buying/'},
 {id:'snacks-extra',from:7,category:'food',title:'별도 간식과 알레르기·소비기한 확인',note:'에너지바 미니 310g×3개는 식사·식수 대용이 아닙니다. 가족 식이에 맞는 경우에만 준비하세요.',offer:'snacks',optional:true,guide:'/buying/'},
 {id:'lantern-extra',from:7,category:'power',title:'공용 공간의 LED 보조 조명',note:'에너자이저 360 Area 랜턴의 전원 규격·건전지 포함 여부를 상품 상세에서 확인하세요. 기존 조명이 충분하면 중복 구매하지 않습니다.',offer:'lantern',optional:true,guide:'/buying/'},
 {id:'poncho-extra',from:7,category:'plan',title:'비 오는 날 이동용 판초우의',note:'기존 우비로 충분하다면 추가 구매하지 않아도 됩니다. 판초우의가 침수도로·급류를 지나도 안전하게 해 주는 것은 아닙니다.',offer:'poncho',optional:true,guide:'/buying/'},

];
