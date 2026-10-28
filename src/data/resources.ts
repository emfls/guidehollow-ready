export const sources = {
  government: 'https://safekorea.go.kr/',
  supplies: 'https://safekorea.go.kr/safekorea-kor/acts/nacts/action-guide.do?actsHeaderTitle=%EB%B9%84%EC%83%81%EB%8C%80%EB%B9%84+%EB%AC%BC%EC%9E%90%EC%A4%80%EB%B9%84&category=preparationEmcSuply&menuSn=4',
  emergency: 'https://www.safekorea.go.kr/idsiSFK/neo/main_m/set/emergencySit.html',
  shelterHelp: 'https://mediahub.seoul.go.kr/archives/2008170',
  safetyVideo: 'https://news.seoul.go.kr/safe/archives/516212',
  foodsafety: 'https://www.foodsafetykorea.go.kr/',
  readyKit: 'https://www.ready.gov/kit',
  check72: 'https://www.ready.gov/sites/default/files/documents/files/checklist3.pdf',
  expiryGuide: 'https://www.foodsafetykorea.go.kr/portal/board/boardDetail.do?bbs_no=bbs091601&menu_grp=MENU_NEW01&menu_no=3862&ntctxt_no=1093859',
  waterGuide: 'https://www.cdc.gov/water-emergency/about/how-to-create-and-store-an-emergency-water-supply.html',
  infantGuide: 'https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/faqs.html',
} as const;
export const sections = [
 {title:'실제 상황 대처',detail:'경보·대피·재난별 공식 안내를 찾는 방법',href:'/situations/',icon:'◎',tag:'행동요령'},
 {title:'72시간 준비 체크',detail:'가족별 물·식량·조명·연락·위생 물품 정리',href:'/checklist/',icon:'✓',tag:'체크리스트'},
 {title:'우리 가족 비상계획',detail:'대피소·만날 장소·연락 계획을 미리 정하기',href:'/plan/',icon:'▤',tag:'가족 계획'},
 {title:'비상식량 선택법',detail:'조리·보관 조건과 소비기한 중심으로 비교',href:'/buying/food/',icon:'◈',tag:'구매 판단'},
 {title:'비상용품 선택법',detail:'조명·전원·통신·위생 도구의 검증 기준',href:'/buying/gear/',icon:'▣',tag:'구매 판단'},
] as const;
export const checkGroups = [
 {id:'water',name:'식수와 식량',detail:'집에 있는 식품과 마실 물부터 점검',items:[
  {id:'water-bottles',text:'가족 인원에 맞는 식수 72시간분',hint:'음용·기본 위생 용도를 나눠 계산하고 더위·건강 상태를 반영'},
  {id:'shelf-food',text:'불 없이 바로 먹을 수 있는 상온 식품',hint:'평소 먹는 것 우선, 알레르기·제품별 소비기한 확인'},
  {id:'opener',text:'수동 캔따개와 간단한 식기',hint:'따개가 필요한 통조림이 있는 경우 준비'},
  {id:'water-storage',text:'물과 식품의 보관 위치·상태 확인',hint:'서늘하고 건조한 장소, 용기 밀봉·누수·손상 여부 점검'},
  {id:'food-rotation',text:'소비기한·보관 조건과 교체 기록',hint:'먼저 산 제품부터 사용하고 새 제품으로 채우기'},
 ]},
 {id:'light',name:'정전·통신',detail:'전기와 인터넷이 끊겨도 정보 확인',items:[
  {id:'lamp',text:'손전등 또는 충전식 조명',hint:'작동 여부를 실제로 켜서 확인'},
  {id:'battery',text:'맞는 규격의 예비 건전지·충전 수단',hint:'라디오·조명 등과 연결 규격 확인'},
  {id:'radio',text:'건전지식 또는 수동 발전식 라디오',hint:'방송 수신·전원 전환 여부 사전 확인'},
  {id:'powerbank',text:'보조배터리와 휴대전화 케이블',hint:'충전 상태 및 가족 휴대전화 연결 여부 확인'},
  {id:'whistle',text:'호루라기 등 구조 요청 수단',hint:'쉽게 꺼낼 수 있는 곳에 보관'},
 ]},
 {id:'medical',name:'의약·위생·보온',detail:'단수·정전에도 기본 위생 유지',items:[
  {id:'meds',text:'복용약·최근 처방 정보·기본 구급용품',hint:'개인별 처방과 안전한 보관 조건은 의료진·약사에게 확인'},
  {id:'hygiene',text:'휴지·물티슈·생리용품·쓰레기봉투',hint:'사용한 물품과 생활쓰레기를 구분해 밀봉'},
  {id:'mask',text:'상황에 맞는 마스크·작업용 장갑',hint:'일반 마스크는 화학물질 방독면을 대체하지 못함'},
  {id:'warmth',text:'가족별 여벌옷·담요·신발',hint:'영하 기온·우천 등 계절과 이동 상황 고려'},
  {id:'handwashing',text:'비누·손 소독제·개인 위생용품',hint:'손 소독제는 눈에 보이는 오염 제거를 완전히 대체하지 못함'},
  {id:'toilet',text:'단수 시 화장실·폐기물 처리 계획',hint:'가정의 화장실 구조와 지자체 위생 지침 확인'},
 ]},
 {id:'plan',name:'대피·연락·서류',detail:'물건을 사기 전에 가족끼리 합의',items:[
  {id:'shelter',text:'집·직장·학교 주변 공식 대피시설 확인',hint:'국민안전24·안전디딤돌 등에서 최신 위치 점검'},
  {id:'contacts',text:'가족 집결 장소·연락 담당자 정하기',hint:'통신 불가 상황 대비 종이 연락카드 작성'},
  {id:'documents',text:'중요서류 사본과 종이 연락처 보관',hint:'분실 시 개인정보 유출에 주의'},
  {id:'bag',text:'들고 이동할 수 있는 배낭과 튼튼한 신발',hint:'계단·보행 약자·유모차 이동 가능 여부 고려'},
  {id:'paper-map',text:'오프라인 지도와 이동 경로 확인',hint:'인터넷이 끊겨도 집결지 확인 가능하도록 준비'},
  {id:'cash',text:'소액 현금 및 필수 물품 접근 방법',hint:'정전 시 카드 결제·현금 인출이 안 될 수 있음'},
 ]},
 {id:'baby',audience:'baby',name:'영유아가 있는 집',detail:'해당 가정만 선택하는 추가 준비',items:[
  {id:'baby-food',text:'현재 먹는 수유·이유식과 안전한 급수',hint:'모유수유·분유·이유식별로 준비; 분유는 제조사 지시 준수'},
  {id:'baby-hygiene',text:'기저귀·물티슈·의복·쓰레기봉투',hint:'아기 성장에 맞춰 크기와 필요량을 자주 재확인'},
  {id:'baby-care',text:'수유 도구 세척·소독 및 돌봄 계획',hint:'단수 시 위생적인 수유가 가능한지 확인'},
 ]},
 {id:'care',audience:'care',name:'고령자·돌봄 가족',detail:'복용약과 이동·돌봄 수단 확인',items:[
  {id:'care-aids',text:'안경·보청기·이동 보조기와 예비 전원',hint:'시력·청력·보행 보조기구의 사용 가능 상태 확인'},
  {id:'care-needs',text:'복용약·처방전·식이·돌봄 연속성 계획',hint:'개인 의료 상황별로 의료진과 사전 계획'},
 ]},
 {id:'pet',audience:'pet',name:'반려동물이 있는 집',detail:'함께 이동하거나 돌봄 맡길 때 대비',items:[
  {id:'pet-supplies',text:'반려동물 사료·물·약·배변용품',hint:'동물 종류·체중·식단에 맞춰 별도 산정'},
  {id:'pet-id',text:'이동장·목줄·식별정보와 대피 계획',hint:'대피시설의 반려동물 동반 규정 사전 확인'},
 ]}
] as const;
