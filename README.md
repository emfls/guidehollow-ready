# GuideHollow Ready

재난·전시 대비 생활정보와 **검증된** 비상식량·비상용품 구매 판단을 돕는 비공식 한국어 정보 사이트입니다.

- GitHub repository: https://github.com/emfls/guidehollow-ready
- Canonical website: https://ready.guidehollow.com
- Tech: Astro 7, static HTML, GitHub Pages via GitHub Actions
- Developer / original brand: GuideHollow
- Existing `guidehollow`, `guidehollow-pick` and other repositories **remain untouched**

## Publishing

GitHub Settings → Pages → Source: **GitHub Actions**.
Custom domain: `ready.guidehollow.com`. In Gabia DNS:

```text
Type    Host    Target
CNAME   ready   emfls.github.io
```

GitHub Pages deployment uses `.github/workflows/deploy.yml`, the `dist/` directory, `public/CNAME`, and `public/.nojekyll`. GitHub Actions builds on each push to `main`.

```sh
npm ci
npm run check
npm run build
npm run verify
npm run dev
```

Use Node 24 locally; Astro 7 requires Node >=22.23.4.

## Content

- `src/pages/index.astro`: practical first screen, official emergency links
- `src/pages/situations.astro`: emergency situations (not a live alert service)
- `src/pages/checklist.astro`: browser-only progress + household stock/expiry management + printable preparedness list
- `src/pages/plan.astro`: printable family emergency plan, no personal data collection
- `src/pages/buying/{food,gear}.astro`: evidence-first advice, no affiliate links
- `src/pages/sources.astro`: government/official references
- `src/content/reviews/*.md`: published source-backed model guides; detailed evidence is displayed progressively below an easy summary
- `src/pages/reviews/[slug].astro`: disclosure and product evidence before link
- `src/content.config.ts`: rejects unverifiable featured products and invalid partner HTML
- `src/lib/partner-code.ts`: parses a product-specific static Coupang `<a>` HTML; never renders raw scripts/iframes
- `docs/editorial-policy.ko.md`: emergency safety, ad disclosure, search and product quality policy
- `docs/ui-editorial-guide.ko.md`: **all chat workstreams' common mobile UI, equal-height card, short-form writing and product UX standard**

**Thirty individually issued Coupang Partners offer links** are recorded in `src/data/affiliate-product-visuals.ts`. Never fabricate or replace affiliate links or infer real-time inventory from the existence of an offer.

## Naver Search Advisor

Ownership code is installed globally:

```html
<meta name="naver-site-verification" content="4a3c4cef3cedf9582280c00ff70ebff66b9b7de8" />
```

The published `src/site.ts` enables indexing for public, reviewed pages. Only 404/unpublished pages remain excluded.

## Google Analytics 4 (consent-first)

Google Analytics is NOT transmitting traffic data until a real GA4 **web data stream**
measurement ID (e.g. `G-...`) is configured specifically for
`https://ready.guidehollow.com`.

1. In [Google Analytics](https://analytics.google.com/), go to **관리 → 데이터 스트림 → 웹 스트림** and create/select the `ready.guidehollow.com` stream; copy its `G-...` **측정 ID** (not the numeric property or stream ID).
2. In **GitHub → emfls/guidehollow-ready → Settings → Secrets and variables → Actions → Variables**, add the repository variable `READY_GA4_MEASUREMENT_ID` with that measurement ID. Only the measurement ID is needed; do not publish any API secrets or service-account keys.
3. Re-run the `Build and deploy GuideHollow Ready (Astro)` workflow (or merge a change to `main`). The build injects `PUBLIC_GA4_MEASUREMENT_ID`. When absent or invalid, the generated pages contain no Google tracking tag or consent popup.
4. Visit the site, choose **분석에 동의**, and verify `page_view` in GA4's Realtime/DebugView. Click a real Coupang product link (you can cancel checkout) and verify the custom `affiliate_click` event with `offer_code`, `page_path`, and `placement`. It measures click intent, **not completed orders/commission**. For per-product reporting, register `offer_code` and optionally `placement` as **event-scoped custom dimensions** in GA4.
5. Test the **방문 통계 설정** button in the footer. Declining must prevent the Google script from loading and accepting must enable events. Visit `/privacy/` for the published disclosure.

Consent is opt-in, only analytics storage may be granted, no ads storage is requested.
Google receives no values from household checklist, contact fields, family planning, or user-generated form inputs.
The Playwright QA uses a **test-only synthetic measurement ID** and blocks Google endpoints; it cannot contaminate the actual GA4 property.

## Safety

The project is not affiliated with authorities, does not show live alerts or automatically select shelters, and must not replace official guidance. In a real emergency follow public warning messages, emergency responders and locally applicable instructions.

The 72-hour checklist is an **introductory preparedness tool**, not the complete wartime stockpile requirement. Current Korean official wartime supply guidance recommends preparing about 30 days' worth of food and water. Primary source: [국민안전24 비상대비 물자준비](https://safekorea.go.kr/safekorea-kor/acts/nacts/action-guide.do?actsHeaderTitle=%EB%B9%84%EC%83%81%EB%8C%80%EB%B9%84+%EB%AC%BC%EC%9E%90%EC%A4%80%EB%B9%84&category=preparationEmcSuply&menuSn=4).

Review GitHub Pages hosting terms before monetization: the site must remain an information site, not a standalone e-commerce checkout.

## Site visual theme

The UI is **Night Operations**: dark slate surfaces, legible off-white typography, muted teal for trustworthy information and amber for decisive actions/warnings. This is an editorial visual style, **not a real-time emergency operations dashboard**. Preserve the active Naver verification tag and `noindex` until publication review. The dark CSS is appended to `src/styles/global.css` to preserve existing responsive and print behaviors; additional print rules retain white backgrounds for legibility on paper.
