# GuideHollow Ready 콘텐츠와 광고 운영 원칙

1. **인명을 보호하는 최신 정부·지자체 지침이 최우선.** 사이트는 비공식 정보 제공처이며 실시간 재난 경보, 대피소 혼잡도, 군사·의료 지시를 제공하지 않는다.
2. 준비물 체크리스트의 72시간은 **초기 단계 관리 목록**이며 대한민국 공식 전시 비축물자에 안내된 30일분 권고와 혼동하지 않는다. 공식 지침: https://safekorea.go.kr/safekorea-kor/acts/nacts/action-guide.do?actsHeaderTitle=%EB%B9%84%EC%83%81%EB%8C%80%EB%B9%84+%EB%AC%BC%EC%9E%90%EC%A4%80%EB%B9%84&category=preparationEmcSuply&menuSn=4
3. 대피소는 주소를 직접 수집하거나 표시하지 않는다. 국민안전24·안전디딤돌 공식 조회 안내로 연결한다.
4. 가족 계획 양식은 인쇄 후 수기 작성한다. 개인정보 입력 폼·서버 저장 기능 없음.
5. 쿠팡 제휴 상품 선정은 **사용자 문제 → 검증할 사양 → 제조사 공식 자료 → 독립 시험 및 한계 → 모델/옵션 정확히 확인 → 그 뒤에 제휴 링크**의 순서다. 상품 링크가 없어도 정보 글을 발행할 수 있다.
6. 개별 제품별 필수: 정확한 모델번호, 공식 HTTPS 사양, 별도 도메인의 독립 출처, 최소 70자 검증근거, 장점과 단점, 검증일, verified:true.
7. 제휴 링크를 붙인 제품은 partnerProductMatched:true를 요구하고, 서식은 정적 쿠팡 상품 HTML a 태그 또는 파트너스 HTTPS URL만 허용한다. iframe·script·동적배너를 렌더링하지 않는다. HTML은 raw 삽입 없이 안전하게 링크/이미지를 추출한다.
8. 쿠팡파트너스가 있는 원고는 affiliate:true를 요구하고 상단 광고 고지를 표시한다. 후기는 실제 사용했을 때만 후기라고 쓰며 가격·재고·할인·추천순위를 날조하지 않는다.
9. 육아·의료·식품 특수 상황에서 전문적인 개인 처방은 하지 않는다. 손상된 보관식품, 위험한 실내 연소기구 등을 추천하지 않는다.
10. GitHub Pages는 정보 페이지 운영용이다. 별도 결제·상업 거래를 사이트 내에서 직접 처리하지 않는다. GitHub Pages 이용약관과 쿠팡파트너스 운영정책을 사전 점검한다.

**검색 노출 준비**: `src/site.ts`의 `indexingEnabled:false`를 유지한다. 네이버 소유확인은 메타 태그로 미리 진행 가능하며 콘텐츠·링크·법적 안내 검수를 완료한 후 noindex를 해제한다.

**외부 공식 자료**
- https://safekorea.go.kr/
- https://news.seoul.go.kr/safe/archives/516212
- https://www.foodsafetykorea.go.kr/
- https://www.ready.gov/kit
