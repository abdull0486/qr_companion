# GitHub Copilot Instructions for qr_companion

This repository contains the mobile-first companion web application for the **Kuldjuktau geological poster** (presented at geological conferences). Users scan QR codes on a physical A0 poster to view synchronized trilingual translations, high-resolution scientific figures, and chapter explanations.

---

## 1. Core Architecture & Tech Stack

- **Stack**: Pure Vanilla HTML5, modern CSS3, and ES6+ JavaScript.
- **Strict Dependency Rule**: **NO** external UI frameworks or heavy runtimes (No React, Vue, Tailwind, Bootstrap, jQuery, or bloated npm/CDN libraries).
- **Assets**: Only local SVG/lucide icons and local static assets in `assets/`.
- **Pages & Multilingual Structure**:
  - `index.html`: Uzbek (Default language)
  - `en.html`: English version
  - `ko.html`: Korean version
  - `translations_en.json` & `translations_ko.json`: Data files for i18n
  - `section_links.json`: QR fragment routing & mapping
  - `story.css`, `styles.css`, `poster.css`: Modular stylesheets
  - `app.js`: Lightweight client-side controller (IIFE, zero external dependencies)

---

## 2. Design System & Ergonomic Standards

Always align code modifications with `DESIGN_BRIEF.md`:

### Layout & Responsiveness
- **Mobile-First Priority**: Target viewport widths are **320px, 360px, 390px, and 430px CSS px**. Desktop is a secondary companion view.
- **StoryMaps Sidecar Layout**:
  - **Desktop**: Docked sidecar layout (narrative text on the left, sticky poster illustration on the right).
  - **Mobile**: Vertical sequence (illustration above, narrative explanation below).
- **Touch Ergonomics**: All interactive controls, touch targets, and buttons must be **at least 44px × 44px**.
- **Typography**: Minimum readable body text is **17px** with comfortable line height.
- **Font Stack**: System sans-serif for Uzbek/English; `Malgun Gothic, "Noto Sans KR", sans-serif` fallback for Korean.

### Color Palette (Strictly Enforced)
- **Backgrounds**: Pure white `#ffffff`, Stone-gray `#f3f4ef`
- **Text & Headers**: Graphite `#252520`, Muted body text `#6f716a`
- **Geological Accents Only**:
  - Olive green: `#53654c`
  - Mineral purple: `#69577b`
  - Ore ochre: `#806d36`

### Explicit Anti-Patterns (Rejected Templates)
- ❌ **DO NOT** use large dark navy/teal "AI-generated" hero banners.
- ❌ **DO NOT** use bubbly, overly rounded SaaS card containers.
- ❌ **DO NOT** add heavy CSS/JS animation libraries or scroll-jacking scripts.
- ❌ **DO NOT** change the established anchor IDs (`#bolim-01` through `#bolim-12`).

---

## 3. Behavioral & State Rules in `app.js`

- **Anchor & Reading Sync**:
  - The URL hash anchors (`#bolim-01` … `#bolim-12`) must remain stable because physical QR codes printed on the physical poster link directly to these hashes.
  - Switching languages must preserve the currently active reading section and scroll position (`languageLinks.forEach(link => link.href = link.dataset.page + target)`).
- **Navigation & TOC**:
  - The Table of Contents (`.toc`) must start collapsed on mobile viewports.
  - Reading progress indicator (`#story-position`, `.reading-progress`) tracks 01–12 chapter positions dynamically.

---

## 4. Pull Request & Code Review Directives

When reviewing code or suggesting modifications:
1. **Check Cross-Language Parity**: If any section or chapter is updated in `index.html`, ensure corresponding updates are suggested for `en.html` and `ko.html`.
2. **Preserve Lightweight Footprint**: Flag any introduced npm package or remote CDN stylesheet.
3. **Validate Mobile Viewports**: Ensure CSS grid/flex rules do not break at 320px width.
4. **Inspect Image Preservation**: Figures are extracted from the original PDF poster; do not alter image source semantics or break viewer zoom modals.
