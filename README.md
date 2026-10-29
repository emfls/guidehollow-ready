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

## Google Analytics 4 (standard head tag, no pop-up)

The website uses **G-6YFWRC72RG**, provided by its publisher. The production
GitHub Actions build sets `PUBLIC_GA4_MEASUREMENT_ID` to that public measurement ID.

The **Google tag (gtag.js)** now appears exactly once in the HTML `<head>` of
every page, together with `gtag('config', ...)`. This is the normal Google
Analytics installation and can be detected immediately by **Tag Assistant /
웹사이트 테스트** without pressing an on-site consent button.

No automatic analytics popup or modal is displayed (including on the homepage).
Pageviews are measured by default unless the visitor disables analytics. A
permanent unobtrusive **방문 통계 끄기 / 켜기** toggle in the site footer allows
opt-out and restoration; an older explicitly declined preference remains off.
Analytics and GA cookies are described in the public `/privacy/` page. Ads
storage, ad-personalization, and Google signals remain disabled.

### Verification

1. Open a fresh/private window at `https://ready.guidehollow.com/`.
2. Open GA4 for `G-6YFWRC72RG`, then use **웹사이트 테스트** with that URL.
   Tag Assistant should see a tag immediately in `<head>`.
3. Open GA4 **Realtime** and visit `/buying/`. Check for `page_view`.
4. Click an existing Coupang Partners product link. This should produce an
   **`affiliate_click`** event with `offer_code`, `page_path`, and
   `placement`. Product-level reporting requires event-scoped custom
   dimensions for those event parameters.
5. If the footer says **방문 통계 켜기**, an opt-out is currently active; click
   it to restore pageview collection. Browser privacy extensions may also
   block Google's script and prevent Tag Assistant connection.

Affiliate clicks do **not** prove purchases or commissions. Compare actual
sales only through the Coupang Partners dashboard. No family contact data,
checklist contents, or user text fields are submitted as event parameters.

The Playwright CI/browser tests substitute the synthetic ID
`G-READYTEST123` and block external Google endpoints. They verify markup and
browser event behavior without sending test data to the actual GA4 property.

## Safety

The project is not affiliated with authorities, does not show live alerts or automatically select shelters, and must not replace official guidance. In a real emergency follow public warning messages, emergency responders and locally applicable instructions.

The 72-hour checklist is an **introductory preparedness tool**, not the complete wartime stockpile requirement. Current Korean official wartime supply guidance recommends preparing about 30 days' worth of food and water. Primary source: [국민안전24 비상대비 물자준비](https://safekorea.go.kr/safekorea-kor/acts/nacts/action-guide.do?actsHeaderTitle=%EB%B9%84%EC%83%81%EB%8C%80%EB%B9%84+%EB%AC%BC%EC%9E%90%EC%A4%80%EB%B9%84&category=preparationEmcSuply&menuSn=4).

Review GitHub Pages hosting terms before monetization: the site must remain an information site, not a standalone e-commerce checkout.

## Site visual theme

The UI is **Night Operations**: dark slate surfaces, legible off-white typography, muted teal for trustworthy information and amber for decisive actions/warnings. This is an editorial visual style, **not a real-time emergency operations dashboard**. Preserve the active Naver verification tag and `noindex` until publication review. The dark CSS is appended to `src/styles/global.css` to preserve existing responsive and print behaviors; additional print rules retain white backgrounds for legibility on paper.
