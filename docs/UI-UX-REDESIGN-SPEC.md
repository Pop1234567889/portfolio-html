# Portfolio — UI/UX Redesign Specification

**Version:** 2.0
**Product:** Executive Finance Transformation Portfolio — Mohanad Ibrahim
**Surface:** `src/index.html` — single-file, zero-dependency, fully offline static site
**Scope:** Visual, interaction, and usability enhancement only. Zero functional change.
**Base viewport:** 390 × 844 (phone) · 1280 × 800 (desktop)

---

## 0. Scope correction — read this first

The brief that prompted this document specified a *"Portfolio mobile application"* and supplied a
reference specification describing a React Native / Flutter app backed by Node.js + MongoDB, with
Splash / Home / Portfolio / Project Details / Contact screens, a Juicer social wall, and a
Firebase-hosted admin CMS.

**No part of that architecture exists in this product.** The real artifact is a single HTML file
with inlined web fonts and an inlined Chart.js, no build step, no framework, no backend, and no
network calls of any kind. Writing a specification against the described app would have produced a
document that could not be implemented against a single line of this codebase.

This specification is therefore written against the surfaces that actually exist. The five spec'd
"screens" map onto them as follows, so the original brief stays traceable:

| Brief's screen | Real surface | Location |
|---|---|---|
| Splash Screen | `#splash` — video gate, `role="dialog"`, `#sp-enter` CTA | `src/index.html` |
| Home | `#cover` (hero + video background) and `#summary` | §01–§02 |
| Portfolio | `#transformation`, `#erp`, `#performance` + the collapsed-row index | §08–§10 |
| Project Details / Case Study | `#detail-view` (`.dv`) — the focus-trapped overlay reader | injected |
| Contact | `#branding` (LinkedIn + email CTAs) and the `mailto:` nav CTA | §17 |

Twelve further sections — `#positioning`, `#competencies`, `#technical`, `#experience`,
`#achievements`, `#ai`, `#kpi`, `#powerbi`, `#visual`, `#dashboard`, `#education` — have no analogue
in the brief and are specified on their own terms.

**The reference spec's visual system was also discarded.** It proposed an Indigo `#4F46E5` / Inter
palette. This product's identity is a deep-navy cinematic palette with a Bloomberg-fintech accent
set and a five-family type stack. That identity is the product's constraint, not a blank canvas —
Principle 1 below. What follows documents and systematises the identity that exists.

---

## 1. Executive Summary

The portfolio was already a high-craft artifact before this pass: a cinematic splash gate, a
17-section narrative, a "collapsed row → detail overlay" reading model that turns a long document
into a navigable index, an inlined-everything offline guarantee, a dark/light theme with live chart
repainting, and a motion layer already gated behind `prefers-reduced-motion`. A prior pass
(`ENHANCEMENT-AUDIT.md`) added a skip link, `aria-current`, a back-to-top control, deferred chart
construction, and `content-visibility`.

What remained were the problems that a surgical pass had explicitly deferred, plus a mobile
experience that had been allowed to degrade:

| Area | Before | After |
|---|---|---|
| Mobile wayfinding | all section links `display:none` ≤860px; only Quick Jump, which is JS-injected | scrollable section rail, works with JS disabled |
| Design tokens | two disconnected systems (base palette + `--rd-*`) | one `--ds-*` semantic layer aliasing both |
| Landmarks | no `<main>`, `<header>`, `<footer>` | all three, skip link retargeted to `#main` |
| Touch targets | nav 24px, detail rows 36px, Quick Jump unset | 44px floor throughout |
| Spacing below 720px | ramp terminates; 88px padding down to 320px | ramp continues to 56px at 360px |
| Wide tables on phones | `.ratio-table` forced page-level horizontal scroll | scrolls inside its own container |

**What did not change:** every screen, section, ID, class, dataset, label, href, and word of copy.
No new features, screens, routes, or capabilities. No dependencies, no build step, no network
references — the file remains 100% offline.

---

## 2. Design Direction

### 2.1 Philosophy — "Preserve, then refine"

This is a credibility instrument. Its reader is a hiring partner or board member evaluating whether
the author can operate at executive level; the interface's only job is to make that evidence legible
and get out of the way. The design direction is therefore *subtractive*: remove friction, raise
contrast, systematise what exists. It is explicitly **not** a restyling exercise.

### 2.2 Mood

Deep-navy cinematic ground, Bloomberg-terminal accent discipline, editorial serif display against a
monospace data voice. Confident but never loud — the palette's saturation is reserved almost
entirely for data, where colour carries meaning rather than decoration.

### 2.3 Non-negotiables

- The existing palette, type stack, and section order are constraints.
- Every animation composes with `prefers-reduced-motion`.
- The file stays offline — no CDN, no webfont fetch, no analytics.
- Nothing may depend on JavaScript for content or navigation to be reachable.

---

## 3. Visual Identity System

### 3.1 Colour

The identity is a deep-navy surface ramp carrying a five-accent semantic set. Documented as-is —
no literal value changed in this pass.

**Surface ramp**

| Token | Value | Usage |
|---|---|---|
| `--bg-0` | `#05070f` | Page ground |
| `--bg-1` | `#080c1a` | Raised surface |
| `--bg-2` | `#0d1430` | Overlay / nav ground |
| `--bg-3` | `#101a3a` | Highest surface |
| `--rd-surface` | `rgba(255,255,255,.035)` | Glass tier 1 |
| `--rd-surface-2` | `rgba(255,255,255,.055)` | Glass tier 2 |
| `--rd-surface-3` | `rgba(255,255,255,.075)` | Glass tier 3 |
| `--rd-inset` | `rgba(8,12,24,.42)` | Inset wells |

**Ink ramp** — AA-lifted against the dark ground

| Token | Value | Usage |
|---|---|---|
| `--rd-ink` | `#f4f7ff` | Primary text |
| `--rd-ink-2` | `#d8e2fb` | Secondary |
| `--rd-ink-3` | `#aab6d6` | Tertiary |
| `--rd-ink-4` | `#8a97ba` | Muted / metadata |

**Semantic accents** — colour carries meaning; never decorative

| Token | Value | Meaning |
|---|---|---|
| `--blue` | `#56b4ff` | Interactive · focus · links |
| `--mint` | `#5dd6a3` | Positive delta · primary CTA |
| `--violet` | `#a78bfa` | Brand · section accent |
| `--gold` | `#fbbf24` | Caution · pending |
| `--coral` | `#ef5d5d` | Negative delta |

**Hairlines:** `--rd-line` `rgba(255,255,255,.085)` · `--rd-line-2` `rgba(255,255,255,.14)` ·
`--rd-line-hover` `rgba(150,180,235,.36)`

Light mode is an `html.light` override layer. Charts repaint grid, tick, and label colours through
`repaintCharts()` on theme change.

### 3.2 Typography

Five inlined families, `font-display: swap`, correct `unicode-range` subsets (latin / latin-ext /
arabic) for a fully offline render:

| Family | Role |
|---|---|
| Cormorant Garamond | Editorial display — hero name, section headings |
| Inter | UI and body |
| Plus Jakarta Sans | UI accent |
| JetBrains Mono | Data voice — figures, eyebrows, section numbers, tables |
| Cairo | Arabic content |

**Scale** — fluid where it must survive 360→1280px:

| Role | Size | Notes |
|---|---|---|
| Hero display | `clamp(2.6rem, 7vw, 5.2rem)` | Cormorant, editorial |
| Section `h2` | `clamp(1.35rem, 4vw, 2.1rem)` | collapsed-row state |
| Lead paragraph | 18–20px | `--rd-ink-2` |
| Body | 15–16px / 1.6 | `--rd-ink-2` |
| Metadata / caption | 12–13px | `--rd-ink-4` |
| Eyebrow / `sec-num` | 10–11px, `.22em` tracking, uppercase | JetBrains Mono |

**Rules:** never below 10px. Monospace is reserved for numeric and label content — it is the
data voice and must not be used for prose.

### 3.3 Iconography

Inline SVG only — no icon font, no sprite fetch. `stroke-width` 2–2.3, `stroke-linecap:round`,
`fill:none`, `currentColor` so icons inherit theme and state. Sizes 14 / 16 / 18 / 20 / 24px.
Every icon-only control carries an `aria-label`; every decorative icon carries `aria-hidden="true"`.

### 3.4 Shape

| Token | Value | Usage |
|---|---|---|
| `--ds-radius-sm` | 12px | Chips, tags, inputs |
| `--ds-radius-md` | 16px | Cards, list rows |
| `--ds-radius-lg` | 20px | Panels, mobile nav rail |
| `--ds-radius-xl` | 24px | Overlays, hero frames |
| `--ds-radius-pill` | 999px | Nav pill, CTAs, badges |

### 3.5 Layout & spacing

8pt rhythm. Section gutter and vertical rhythm are tokenised and step down responsively, so one
variable governs the ramp instead of four hardcoded breakpoint blocks:

| Viewport | `--ds-gutter` | `--ds-rhythm` |
|---|---|---|
| >1280px | 96px | 120px |
| ≤1280px | 56px | 104px |
| ≤1024px | 40px | 96px |
| ≤720px | 22px | 88px |
| ≤600px | 18px | 72px |
| ≤420px | 16px | 64px |
| ≤360px | 14px | 56px |

---

## 4. Screen-by-Screen Redesign

### 4.1 Splash — `#splash`

Full-bleed looping video behind a scrim, centred content block, single `#sp-enter` CTA. The gate is
a real `role="dialog"` with `aria-modal="true"` and `autofocus` on the CTA.

**Retained:** the entry gate is the product's first impression and its cinematic register is
intentional.
**Refined:** already robust against short and landscape phones — flex container with
`overflow-y:auto` and `margin:auto` centres when it fits and scrolls when it doesn't; the scroll
hint is suppressed under `max-height:600px`. Safe-area insets are honoured on notched devices.
**Motion:** entry is a scale + fade; exit is an opacity handoff to the page beneath. Both animate
`transform`/`opacity` only.

### 4.2 Home — `#cover` + `#summary`

Hero video background under a vertical scrim, editorial portrait in a glass frame, name in Cormorant
display, role line, and a metric row.

**Refined:** on phones the scrim is strengthened
(`rgba(5,7,15,.80) → .55 → .88`) so display type holds contrast against arbitrary video frames.
Section rhythm now steps down below 600px rather than holding 88px padding to 320px.

### 4.3 Portfolio — `#transformation` · `#erp` · `#performance`

In static mode these render as **collapsed rows**: eyebrow, `h2`, and a circular affordance
(`.dl-go`) that opens the detail overlay. This is the product's index — a 17-section document made
scannable.

**Refined:** `.dl-go` raised from 36px to 44px on touch viewports. Hover transforms and brightness
shifts are already suppressed in static mode to eliminate glitching; that behaviour is preserved.

### 4.4 Project Details / Case Study — `#detail-view` (`.dv`)

The real case-study reader: a focus-trapped overlay with a sticky `.dv-bar` (back button + title)
over a scrollable `.dv-body`, plus an optional per-section background video with a scrim.

**Refined:** `.dv-back` raised to a 44px target and, below 380px, reduced to icon-only so the title
never wraps. Body padding tightened to `18px 16px 44px` on phones. Bar padding honours
`env(safe-area-inset-*)`.
**Preserved:** focus trap, history integration, `Escape` to close, and print-safe expansion of all
panels.

### 4.5 Contact — `#branding`

Closing statement, signature block, two primary CTAs (LinkedIn, email), and a four-cell trust row.

**Refined:** CTA rows reflow to a single column below 760px; the brand statement's padding drops to
`40px 26px`. Both CTAs are full-width tap targets on phones. The `mailto:` nav CTA remains pinned in
the nav rail at every viewport — it is the one link that never scrolls out of the rail's initial
view.

### 4.6 Dashboard overlay — `#dashboard`

5 KPI sparklines + 7 analytical Chart.js charts, built on demand via `__buildDashboardCharts()` and
resized by `resizeCharts()` on overlay open.

**Refined:** canvas heights tuned for phones (`.chart-canvas` 240px, `.tall` 300px, `.kpi-spark`
40px). **No Chart.js dataset, option, colour, or canvas ID was touched** — only the container box.

### 4.7 Cross-cutting — data tables

`.ratio-table` is a 5-column `border-collapse` table that cannot reflow below ~520px without
truncating content. It now scrolls inside its own container (`display:block; overflow-x:auto`) with
every column and cell preserved, so the page body never scrolls horizontally.

---

## 5. Design System Documentation

### 5.1 Token architecture

Two token systems had coexisted with no bridge between them: the base cinematic palette and the
`--rd-*` premium scale. A single `--ds-*` semantic layer now aliases both, giving downstream code one
vocabulary to target.

**Every `--ds-*` token that maps an existing value is an alias**, so no colour, radius, spacing, or
shadow value is introduced or altered and rendering is byte-identical — the layer can be adopted
incrementally.

Four tokens are **primitives**, not aliases, because they had no pre-existing counterpart to point
at:

| Primitive | Value | Why it is not an alias |
|---|---|---|
| `--ds-tap-min` | `44px` | The WCAG 2.5.8 touch floor; no prior token expressed it |
| `--ds-gutter` | `96px` → `14px` | Replaces four hardcoded per-breakpoint `.section` paddings |
| `--ds-rhythm` | `120px` → `56px` | Same, for vertical rhythm |
| `--ds-mobile-header-h` | `calc(72px + max(8px, env(safe-area-inset-top)))` | Measured height of the fixed mobile rail; used for anchor offsets |

`--ds-gutter` and `--ds-rhythm` reproduce the existing desktop values exactly at every pre-existing
breakpoint, so they change nothing above 600px; they only extend the ramp to smaller phones.

```css
:root{
  /* Surfaces */
  --ds-surface-base:    var(--bg-0);
  --ds-surface-raised:  var(--bg-1);
  --ds-surface-overlay: var(--bg-2);
  --ds-surface-glass:   var(--rd-surface);
  --ds-surface-inset:   var(--rd-inset);

  /* Ink */
  --ds-ink-primary:     var(--rd-ink);
  --ds-ink-secondary:   var(--rd-ink-2);
  --ds-ink-tertiary:    var(--rd-ink-3);
  --ds-ink-muted:       var(--rd-ink-4);

  /* Semantic accents */
  --ds-accent-primary:  var(--blue);
  --ds-accent-success:  var(--mint);
  --ds-accent-brand:    var(--violet);
  --ds-accent-warning:  var(--gold);
  --ds-accent-danger:   var(--coral);

  /* Spacing · 8pt */
  --ds-space-1: 8px;  --ds-space-2: 16px; --ds-space-3: 24px;
  --ds-space-4: 32px; --ds-space-5: 40px; --ds-space-6: 48px;

  /* Radius */
  --ds-radius-sm: 12px; --ds-radius-md: 16px;
  --ds-radius-lg: 20px; --ds-radius-xl: 24px; --ds-radius-pill: 999px;

  /* Elevation */
  --ds-elevation-1: var(--rd-shadow);
  --ds-elevation-2: var(--rd-shadow-2);
  --ds-focus-ring:  var(--rd-ring);

  /* Touch floor */
  --ds-tap-min: 44px;
}
```

### 5.2 Elevation

| Level | Value | Usage |
|---|---|---|
| `--ds-elevation-1` | `0 1px 2px rgba(2,5,15,.30), 0 14px 34px -16px rgba(2,5,15,.62)` | Cards, rows at rest |
| `--ds-elevation-2` | `0 1px 0 rgba(255,255,255,.06) inset, 0 22px 56px -20px rgba(2,5,15,.70)` | Overlays, raised panels |
| `--ds-focus-ring` | `0 0 0 4px rgba(86,180,255,.22)` | Focus, paired with `:focus-visible` |

Shadows are low-chroma and cool — they read as depth against navy, not as grey haze.

### 5.3 Component library

| Component | Spec |
|---|---|
| **Nav pill** (`.top-nav`) | Fixed, glass, `blur(20px) saturate(180%)`, `radius-pill`. ≤860px: static within `<header>`, `radius-lg`, horizontal scroll rail |
| **Nav item** | ≥44px tall on touch, 12.5px, `white-space:nowrap`, `scroll-snap-align:start` |
| **Nav CTA** (`.nav-item.cta`) | Mint gradient, `#03101a` ink, 700 weight, sheen sweep on hover |
| **Collapsed row** (`.dl-trigger`) | Full-width flex, eyebrow + `h2` + 44px circular `.dl-go` |
| **Detail overlay** (`.dv`) | Sticky `.dv-bar` over scrollable `.dv-body`, focus-trapped, `Escape` to close |
| **Quick Jump** (`.quick-jump`) | JS-injected `role="menu"`, ≥44px links, active item flagged with a mint dot |
| **Theme toggle** | 44px, moon/sun SVG swap, repaints charts on switch |
| **Back to top** | 46px (42px ≤600px) glass circle, appears past 0.9 viewport, returns focus to brand |
| **Skip link** | First focusable, `translateY(-140%)` → `0` on focus, targets `#main` |
| **Ratio table** | ≤860px `display:block; overflow-x:auto`, all columns preserved |
| **Chart card** | `radius-md`, glass, canvas 240px / 300px tall on phones |

### 5.4 Usage rules

1. **Never hardcode a colour.** Use a `--ds-*` token; if none fits, the need is a new semantic, not a
   new hex.
2. **Colour carries meaning in data.** Mint = positive, coral = negative, gold = caution. Never
   invert these for aesthetics.
3. **Monospace is the data voice.** Figures, labels, eyebrows. Never prose.
4. **44px is a floor, not a target.** Applies to every interactive element on touch viewports.
5. **Animate `transform` and `opacity` only.** Never `width`, `height`, `top`, `left`.
6. **Every animation composes with `prefers-reduced-motion`.**
7. **Nothing may require JavaScript to be reachable.** JS enhances; it never gates content or
   navigation.

---

## 6. Interaction & Motion Guidelines

### 6.1 Timing and easing

| Class | Duration | Easing |
|---|---|---|
| Micro (press, hover) | 100–150ms | `cubic-bezier(.22,1,.36,1)` |
| Standard (reveal, toggle) | 200–300ms | `cubic-bezier(.22,1,.36,1)` |
| Emphasis (splash, overlay) | 400–600ms | `cubic-bezier(.22,1,.36,1)` |
| Theme transition | 500ms | `cubic-bezier(.22,1,.36,1)` |

### 6.2 Navigation behaviour

- **Scroll spy** — rAF-throttled `tickActive()`, sets `.is-active` **and** `aria-current="page"` on
  the matching nav link. Single source of truth.
- **Mobile rail** — horizontal scroll with `scroll-snap-type:x proximity` and
  `overscroll-behavior-x:contain` so rail scrolling never chains to the page.
- **Scroll margin** — below 860px, `main` and `.section` carry
  `scroll-margin-top: var(--ds-mobile-header-h)`, i.e.
  `calc(72px + max(8px, env(safe-area-inset-top)))`, so anchor targets clear the fixed rail. The
  72px is the rail's measured height (44px tap-target items plus padding); the inset term covers
  notched devices, where a flat value leaves headings hidden behind the header.

### 6.3 Page transitions

Splash → page is an opacity handoff. Collapsed row → detail overlay is a transform+opacity entry
with a focus trap; back reverses it and restores focus and history. Tab-equivalent moves between
sections are native anchor scrolls, smooth by default and instant under reduced motion.

### 6.4 Loading states

Charts build on the first of four triggers — `IntersectionObserver` (300px margin), capture-phase
click on any overlay-opening link, deep-link at load, or `requestIdleCallback` (1800ms timeout).
Every path is idempotent and self-guarding, so a chart can never render empty. Below-fold text
sections use `content-visibility:auto` with `contain-intrinsic-size: auto 1000px` — no layout shift,
no anchor drift.

### 6.5 Button and control states

| State | Treatment |
|---|---|
| Rest | `--ds-elevation-1` |
| Hover (`hover:hover` only) | Lift `-1` to `-2px`, brighten hairline to `--ds-line-hover` |
| Press | `scale(.94–.96)` |
| Focus | `:focus-visible` ring, `--ds-focus-ring` |
| Disabled | 40% opacity, no shadow |

Hover treatments are gated behind `@media(hover:hover)` so touch devices never inherit a sticky
hover state.

### 6.6 Reduced motion

`prefers-reduced-motion: reduce` collapses all durations to `.01ms`, forces `.reveal` to its
resting state, removes the particle canvas and ambient orbs, disables scroll-snap on the mobile
rail, and switches back-to-top to instant `scrollTo`. Verified: every interaction flow completes
in this context with no console errors.

---

## 7. Navigation Improvements

### 7.1 The primary fix

Below 860px, `.top-nav .nav-item:not(.cta){display:none}` hid every section link, and a
higher-specificity rule at ≤720px hid them again via a sibling combinator. All wayfinding fell to
the Quick Jump menu — which is **injected by JavaScript**. A phone with JS disabled had a brand mark
and a mailto button, and no way to reach any of the 17 sections.

The links are now restored as a horizontally scrollable rail inside the `<header>`. Quick Jump
remains as the progressive enhancement layered on top. Two implementation notes matter for anyone
touching this later:

1. **Specificity.** The ≤720px rule
   `.nav-item:not(.cta):not(.brand) ~ .nav-item:not(.cta)` scores (0,5,0) and outranks a plain
   `.top-nav .nav-item:not(.cta)` override at (0,3,0). It must be matched explicitly.
2. **`justify-content`.** The ≤720px tier sets `justify-content:center`. Centring a *scrollable*
   flex container overflows it on both sides and makes the leading items permanently unreachable.
   The rail forces `flex-start`.

### 7.2 Information architecture — unchanged

```
Splash → Cover
Cover  → any of 16 sections (nav rail · Quick Jump · scroll)
Section (collapsed row) → Detail overlay → back → Section
Dashboard → chart overlay → back
Branding → LinkedIn (external) · mailto (external)
```

### 7.3 Landmarks

`<header>` (nav) · `<main id="main" tabindex="-1">` (all 17 sections) · `<footer>` (stamp). The skip
link now targets `#main` rather than `#summary`, so the bypass block lands on the content region
rather than the second section. `#topNav` keeps its `<nav aria-label="Primary">` contract intact.

The `tabindex="-1"` is load-bearing, not decoration. A landmark is not focusable by default, so
fragment navigation moves the scroll position but leaves keyboard focus where it was — the next Tab
continues from inside the nav, and the bypass block does nothing for the users it exists for.
`tabindex="-1"` makes the target programmatically focusable without adding it to the tab order.
Its focus outline is suppressed (`main[tabindex="-1"]:focus{outline:none}`) because such an element
cannot be reached by tabbing, so the focus is always programmatic and a ring around the entire page
would be noise rather than information.

### 7.4 Gestures

Rail scrolls horizontally with snap; the detail overlay scrolls vertically with a sticky bar;
`Escape` closes the overlay; the browser back button unwinds overlay history.

---

## 8. Developer Handoff Specifications

### 8.1 Where the code lives

`src/index.html` is the single source of truth. New work is appended as discrete blocks at the end
of the cascade, following the established `enh-styles` / `motion-surface` / `a11y-nav-perf`
convention:

| Block | Contents |
|---|---|
| `<style id="design-tokens">` | The `--ds-*` semantic layer + responsive gutter/rhythm ramp |
| `<style id="mobile-layer">` | Everything scoped to ≤860px / ≤600px |

Nothing above these blocks was edited except the four landmark elements and the skip-link target.

### 8.2 Grid and measurements

- Base unit 4px; component rhythm 8pt.
- Section gutter and vertical rhythm from `--ds-gutter` / `--ds-rhythm` (§3.5 table).
- Nav rail: `margin:0 8px`, `padding:6px 8px`, `gap:2px`, items `0 12px` with a 44px min height.
- Detail overlay body: `18px 16px 44px` on phones.
- Safe-area insets honoured on the splash, the detail bar, and the mobile header.

### 8.3 Responsive rules

| Breakpoint | Behaviour |
|---|---|
| >1280px | Full desktop; nav pill centred and floating |
| ≤1280px | Gutter 56px |
| ≤1024px | Gutter 40px; chart grids collapse to one column |
| ≤860px | **Nav becomes a scrollable rail in a fixed header**; 44px touch floor; tables scroll internally |
| ≤720px | Gutter 22px; `min-height:auto` on sections |
| ≤600px | Gutter 18px; chart canvases 240/300px; stronger hero scrim |
| ≤420px | Gutter 16px |
| ≤380px | Detail back button becomes icon-only |
| ≤360px | Gutter 14px |

### 8.4 Implementation notes

- **No new dependencies, no build step, no network references.** The file stays 100% offline.
- **Charts untouched.** No dataset, option, colour, or canvas ID was modified — only container
  heights.
- **`src/index-standalone.html` is kept in sync.** The same changes were applied to it directly
  rather than regenerating the build: every asset is already inlined there, so a rebuild would
  produce a ~41MB diff for no benefit. The edits are applied by an idempotent script that asserts an
  exact occurrence count of 1 per anchor and checks post-conditions before writing — a silent no-op
  on a generated file that size would otherwise be very hard to notice.
- **Validating the standalone.** Nothing in `tests/` reads it, so it has no automated coverage. It is
  verified by loading it in Chromium from a directory containing **no `assets/` folder**, asserting
  zero external or failed requests (still self-contained), zero horizontal overflow, 17 sections
  inside `<main>`, and the full nav link set at 390px.
- **Adopting the token layer.** `--ds-*` aliases are live but not yet consumed by legacy rules.
  Migration is safe to do incrementally, one component at a time, because each alias resolves to the
  value the legacy rule already uses.
- **Reverting.** The commits are independent and can be reverted individually: landmarks,
  tokens + mobile layer, spec, the merge with main, the standalone sync, and the review fixes.

### 8.5 Verification performed

- `npm test` → 4 suites, **233/233 green**, before and after every commit.
- Chromium at 1280 / 768 / 390 / 360px: `scrollWidth - clientWidth === 0` at every width.
- No console errors in default **or** `prefers-reduced-motion: reduce` contexts.
- Flow coverage at 390px in both motion contexts: splash → enter → scroll → open detail overlay →
  back → theme toggle. All pass.
- **8/8 nav links reachable with JavaScript disabled** — the regression this pass exists to fix.
- All nav items, the overlay back button, Quick Jump links, and detail-row buttons measured ≥44px.

---

## 9. Final Design Principles

1. **Preserve, then refine.** The product's identity, content, and architecture are the constraint,
   not the canvas. A redesign that discards them is a different product, not a better one.

2. **Nothing may require JavaScript to be reachable.** JS enhances; it never gates content or
   navigation. The mobile-nav defect this pass fixed existed precisely because that line was
   crossed.

3. **Accessibility is structural.** Landmarks, skip links, `aria-current`, real buttons, 44px
   targets, and motion safety are defaults, not additions.

4. **Colour carries meaning.** In a finance portfolio, mint and coral are data, not decoration.
   Never invert them for aesthetics.

5. **Systems scale; values don't.** Build with tokens. A change to one alias should cascade
   everywhere, and a spacing change should never break a layout.

6. **Defer cost, never correctness.** Every performance optimisation must carry a guaranteed
   correctness path — a chart may never render empty, a section may never shift.

7. **Measure everything.** Zero horizontal overflow, 233 green tests, no console errors, verified in
   a real browser at four widths in two motion contexts. A claim without a measurement is a guess.
