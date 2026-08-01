# Install as a Mobile App (PWA)

The portfolio is a **Progressive Web App** — it installs to a phone's home screen and
launches full-screen like a native app, works offline, and shows a custom icon and splash.
No app store, no APK sideloading, and nothing to compile.

## What was added

| File | Purpose |
|------|---------|
| `src/manifest.webmanifest` | App name, icons (192/512 + maskable), `display: standalone`, theme/background `#05070f`, relative `start_url`/`scope` so it works on any host or subpath. |
| `src/sw.js` | Service worker — precaches the app shell (HTML, fonts, key images) and runtime-caches everything else (images, videos) so the app opens **offline** after the first visit. |
| `src/index.html` (head) | `<link rel="manifest">`, `theme-color`, Apple/Android web-app meta, and touch icons. |
| `src/index.html` (body) | Registers the service worker (only over HTTPS / localhost; skipped on `file://`). |

## Requirement: serve over HTTPS

Service workers and install prompts only work over **HTTPS** (or `http://localhost` during
development). Opening `index.html` directly from disk (`file://`) shows the site but **cannot**
install as an app — deploy it first. Any static host works: GitHub Pages, Vercel, Netlify, etc.
Because all paths are relative, it installs correctly whether the app sits at the domain root
or a subpath.

### Quick local check
```bash
cd src
python3 -m http.server 8137
# open http://localhost:8137/index.html in Chrome → you'll see an install control
```

## Installing

**Android (Chrome / Edge / Samsung Internet)**
1. Open the deployed URL.
2. Tap the **⋮** menu → **Install app** / **Add to Home screen** (or accept the install prompt).
3. It appears on the home screen with the portfolio icon and launches full-screen.

**iOS / iPadOS (Safari)**
1. Open the deployed URL in Safari.
2. Tap **Share** → **Add to Home Screen** → **Add**.
3. Launches standalone with the app icon (iOS uses `apple-touch-icon`).

**Desktop (Chrome / Edge)**
- Click the **install icon** in the address bar, or menu → **Install…**.

## Offline behaviour

- **First visit** (online): the app shell and each asset are cached as they load.
- **Later visits** (offline): the app opens from cache. Navigations are network-first (so it
  updates when online) and fall back to the cached page when there is no connection.
- **Updating**: bump `SW_VERSION` in `src/sw.js` to ship a fresh shell; the new worker activates
  and clears the previous cache automatically.

## Want a real Play Store `.apk`/`.aab` later?

A PWA can be packaged into an Android app without changing this code, using the **deployed HTTPS
URL**:

- **[PWABuilder](https://www.pwabuilder.com/)** — paste the URL, download a signed Android package.
- **[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)** (Trusted Web Activity) — CLI that
  wraps the PWA; requires the Android SDK.

Both need the Android SDK toolchain, which is why the store package is produced from the hosted
PWA rather than in this repository. The PWA itself is fully installable today with no build step.
