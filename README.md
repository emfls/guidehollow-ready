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

**A product-matched Coupang Partners link is active for the Fenix E20 V2.0 flashlight only.** Every other item remains unlinked until its exact product and option are verified. Never create fake recommendations, stock, prices or discounts.

## Naver Search Advisor

Ownership code is installed globally:

```html
<meta name="naver-site-verification" content="4a3c4cef3cedf9582280c00ff70ebff66b9b7de8" />
```

The initial `src/site.ts` sets `indexingEnabled:false`, so pages have `noindex, follow`. Site ownership verification works without allowing indexing. Re-enable indexing only after review of public content and links.

## Safety

The project is not affiliated with authorities, does not show live alerts or automatically select shelters, and must not replace official guidance. In a real emergency follow public warning messages, emergency responders and locally applicable instructions.

The 72-hour checklist is an **introductory preparedness tool**, not the complete wartime stockpile requirement. Current Korean official wartime supply guidance recommends preparing about 30 days' worth of food and water. Primary source: [국민안전24 비상대비 물자준비](https://safekorea.go.kr/safekorea-kor/acts/nacts/action-guide.do?actsHeaderTitle=%EB%B9%84%EC%83%81%EB%8C%80%EB%B9%84+%EB%AC%BC%EC%9E%90%EC%A4%80%EB%B9%84&category=preparationEmcSuply&menuSn=4).

Review GitHub Pages hosting terms before monetization: the site must remain an information site, not a standalone e-commerce checkout.

## Site visual theme

The UI is **Night Operations**: dark slate surfaces, legible off-white typography, muted teal for trustworthy information and amber for decisive actions/warnings. This is an editorial visual style, **not a real-time emergency operations dashboard**. Preserve the active Naver verification tag and `noindex` until publication review. The dark CSS is appended to `src/styles/global.css` to preserve existing responsive and print behaviors; additional print rules retain white backgrounds for legibility on paper.
