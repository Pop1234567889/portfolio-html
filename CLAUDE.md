# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this project is

A single-page **executive finance portfolio website for Mohanad Ibrahim**
(Strategic Finance Business Partner, MENA/GCC). The live product is
`src/index.html` — a self-contained page with all CSS and JS inline, plus an
`src/assets/media/` folder for videos, fonts, and images.

Note: `README.md`, `CONTRIBUTING.md`, and the issue templates describe the
original *CommunityPro portfolio-html template* this repo was forked from.
They do not reflect the current product. This file is the accurate reference.

## Commands

```bash
npm install        # once; installs jest + jest-environment-jsdom
npm test           # runs all 4 Jest suites (233 tests, ~4s)
npx jest tests/html-structure.test.js   # single suite
```

There is no build step, no bundler, no linter, and no CI workflow.
The site is static — open `src/index.html` in a browser to run it.

## Repository layout

```
src/
  index.html            ← THE product. ~540 KB, single page, all code inline
  index-standalone.html ← older fully-embedded (base64) snapshot; reference only
  assets/media/
    videos/ vid_<hash>.mp4   16 background videos (~26 MB total)
    fonts/  fon_<hash>.woff2 13 fonts (Plus Jakarta Sans, Inter, Cairo,
                             JetBrains Mono, Cormorant Garamond)
    img/    img_<hash>.{png,jpg}
  assets/               ← legacy template assets (favicon, icons); mostly unused
  css/, js/             ← legacy template files; NOT loaded by index.html
tests/                  ← Jest + jsdom suites that parse src/index.html
.claude/skills/         ← installed agent skills (ui-ux-pro-max)
.agents/, skills-lock.json, .mcp.json ← agent/skill tooling config
```

## Architecture of src/index.html

Everything lives in one HTML file, organized as **named inline blocks**.
Locate code by block id, not by line number (the file is too large to read
whole — read it in segments or grep for the block id):

| Block id | Role |
|---|---|
| `<style id="fonts-inlined">` | @font-face declarations → `assets/media/fonts/` |
| `<style id="no-visual-effects">` | **The override layer** — see conventions below |
| `<style id="splash-screen">`, `<script id="splash-logic">` | Intro splash with video, dismiss + fallback timeout |
| `<style id="hero-video-bg">` | Cover section video background |
| `<style id="dv-video-styles">`, `<script id="dv-video-bg">` | Detail-view background videos + `window.SECTION_VIDEOS` map |
| `<script id="enh-script">` | Theme toggle (`html.light`), quick-jump nav, chart repaint |
| `<script id="md-script">` | Detail-view (`.dv`) overlay open/close system |
| `<script id="motion-surface-script">` | IntersectionObserver reveal animations |
| `<script id="chartjs-inlined">` | Chart.js library (minified, inline) |

### Key runtime systems

- **Section videos** — `window.SECTION_VIDEOS` (inside `dv-video-bg` script)
  maps section ids (`summary`, `positioning`, … `education`) to
  `assets/media/videos/*.mp4`. A MutationObserver plays only the video of the
  currently open detail view and pauses it on close.
- **Detail view (`.dv`)** — a fixed overlay that slides in via JS-driven
  `transform: translateX(...)`. **Never override `transform` on `.dv` in
  CSS** — it breaks the open/close animation.
- **Theme** — dark is default; light mode is `html.light` (toggled by
  `enh-script`, persisted in localStorage under `mohanad-theme`). Light mode
  is intentionally *transparent/frosted-glass* so background videos show
  through — do not reintroduce opaque white panels.
- **Z-index contract for videos**: video `-1` → scrim `0` → content
  `position:relative; z-index:1`. Deviating makes videos bleed over content.

## Conventions

### 1. Style changes go in the override block, not the original CSS

Visual changes are appended to `<style id="no-visual-effects">` (numbered
sections 1–7) using `!important`, rather than editing the original minified
CSS blocks. This keeps upstream styles intact and diffs reviewable. Follow
the existing section structure when adding rules.

### 2. Editing the large HTML file

- `src/index.html` is ~540 KB — too big for a full read. Grep for block ids
  or unique strings, then read a window around them.
- The Edit tool can fail on strings with heavy special characters; a small
  Python `str.replace` script is the established fallback (verify the target
  string occurs exactly once first).

### 3. Media assets

- Assets are content-addressed: `vid_/fon_/img_` + 12-hex md5 of the base64
  payload, deduplicated (e.g. `summary` and `education` share one video).
- New media goes in `src/assets/media/<type>/` following that naming, and is
  referenced by relative path (`assets/media/...`). Do **not** re-embed
  base64 into the HTML.
- Videos use `<video autoplay muted loop playsinline>` with a dark scrim for
  text readability.

### 4. Test contract — keep these true or tests fail

Tests parse `src/index.html` with JSDOM (`runScripts: 'outside-only'`) and
assert on structure. Notably:

- `#particle-canvas` must exist and be a `<canvas>` (it is hidden with
  `display:none`, but must stay in the DOM).
- Page `<title>` must contain "Mohanad Ibrahim" and "2026"; meta description
  must be present and mention ATS-optimized.
- Section ids (`cover`, `summary`, `positioning`, `competencies`,
  `technical`, `experience`, `achievements`, `transformation`, `erp`,
  `performance`, `ai`, `kpi`, `powerbi`, `visual`, `dashboard`, `education`,
  `branding`) are load-bearing — nav, tests, and `SECTION_VIDEOS` reference
  them.
- Suites: `html-structure` (DOM/meta), `enh-script` (theme + quick-jump),
  `charts` (sparkline/chart factories), `motion-surface` (reveal observer).

**Always run `npm test` after touching `src/index.html`.** All 233 tests
must pass before pushing.

### 5. Git workflow

- Work on a `claude/...` feature branch; never push to `main` directly.
- PRs follow `.github/Pull_request_template.md`.
- Binary media (`*.mp4`, `*.woff2`, images) is committed normally; keep the
  HTML free of large base64 blobs so diffs stay reviewable.

## Brand identity (for any visual work)

- Colors: deep navy `#05070f` background; mint `#34d399`/`#0e9f6e`; blue
  `#56b4ff`/`#2563eb`; violet `#a78bfa`/`#7c3aed`; gold accents `#f5b301`.
- Display font: **Plus Jakarta Sans** (Inter fallback); mono: JetBrains
  Mono; Arabic: Cairo.
- Tagline: "Profit Path". Tone: premium, institutional fintech — avoid
  clip-art aesthetics.
- The owner communicates in Arabic and English; keep user-facing replies
  bilingual-friendly.
