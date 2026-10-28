export const sources = {
  government: 'https://safekorea.go.kr/',
  supplies: 'https://safekorea.go.kr/safekorea-kor/acts/nacts/action-guide.do?actsHeaderTitle=%EB%B9%84%EC%83%81%EB%8C%80%EB%B9%84+%EB%AC%BC%EC%9E%90%EC%A4%80%EB%B9%84&category=preparationEmcSuply&menuSn=4',
  emergency: 'https://www.safekorea.go.kr/idsiSFK/neo/main_m/set/emergencySit.html',
  shelterHelp: 'https://mediahub.seoul.go.kr/archives/2008170',
  safetyVideo: 'https://news.seoul.go.kr/safe/archives/516212',
  foodsafety: 'https://www.foodsafetykorea.go.kr/',
  readyKit: 'https://www.ready.gov/kit',
  check72: 'https://www.ready.gov/sites/default/files/documents/files/checklist3.pdf',
} as const;
export const sections = [
 {title:'실제 상황 대처',detail:'경보·대피·재난별 공식 안내를 찾는 방법',href:'/situations/',icon:'◎',tag:'행동요령'},
 {title:'72시간 준비 체크',detail:'가족별 물·식량·조명·연락·위생 물품 정리',href:'/checklist/',icon:'✓',tag:'체크리스트'},
 {title:'우리 가족 비상계획',detail:'대피소·만날 장소·연락 계획을 미리 정하기',href:'/plan/',icon:'▤',tag:'가족 계획'},
 {title:'비상식량 선택법',detail:'조리·보관 조건과 소비기한 중심으로 비교',href:'/buying/food/',icon:'◈',tag:'구매 판단'},
 {title:'비상용품 선택법',detail:'조명·전원·통신·위생 도구의 검증 기준',href:'/buying/gear/',icon:'▣',tag:'구매 판단'},
] as const;
export const checkGroups = [
 {id:'water',name:'물과 식량',detail:'조리 없이 이용할 수 있는 선택지부터',items:[
  {id:'water-bottles',text:'가족 인원에 맞는 음용수 보관',hint:'필요량은 연령·건강·계절·위생용 물 사용까지 고려'},
  {id:'shelf-food',text:'상온 보관 가능한 비상식량',hint:'소비기한·알레르기·조리 여부 확인'},
  {id:'opener',text:'수동 캔따개 및 간단한 식기',hint:'캔 제품을 준비하는 경우에 한함'},
  {id:'baby-food',text:'영유아·고령자·특수식 대비',hint:'분유·이유식·알레르기식 등 필요한 사람만'},
 ]},
 {id:'light',name:'조명과 통신',detail:'정전·통신 장애에도 꼭 필요한 것',items:[
  {id:'lamp',text:'휴대용 LED 손전등',hint:'배터리 규격·밝기·작동 확인'},
  {id:'battery',text:'예비 건전지 또는 충전 수단',hint:'기기별 호환 여부 확인'},
  {id:'radio',text:'배터리·수동 발전식 라디오',hint:'실제 수신 대역·전원 방식 확인'},
  {id:'powerbank',text:'충전된 보조배터리와 케이블',hint:'가족 휴대전화 연결 규격까지 확인'},
 ]},
 {id:'medical',name:'의약·위생',detail:'구성원의 건강·안전 필요에 맞춰',items:[
  {id:'meds',text:'복용약·처방 정보·기본 구급용품',hint:'개인별 필요와 보관 기한 확인'},
  {id:'hygiene',text:'휴지·물티슈·생리용품·비닐봉투',hint:'위생을 유지할 충분한 수량'},
  {id:'mask',text:'상황에 맞는 마스크와 장갑',hint:'일반 마스크를 화학물질 방독장비로 간주하지 않기'},
  {id:'warmth',text:'계절에 맞는 의복·담요',hint:'가족 구성원별로 따로 준비'},
 ]},
 {id:'plan',name:'대피와 연락',detail:'물품보다 먼저 가족이 합의할 것',items:[
  {id:'shelter',text:'집·직장·학교 주변 공식 대피소 확인',hint:'안전디딤돌 또는 국민안전24 사용'},
  {id:'contacts',text:'연락 불가 시 만날 장소·연락 담당자 정하기',hint:'종이에 적어 가족과 공유'},
  {id:'documents',text:'중요서류 사본·연락처 종이 보관',hint:'개인정보 노출되지 않도록 관리'},
  {id:'bag',text:'가벼운 이동용 배낭과 운동화',hint:'이동 제약이 있는 가족도 함께 고려'},
 ]}
] as const;
