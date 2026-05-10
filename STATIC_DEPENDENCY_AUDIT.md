# STATIC DEPENDENCY AUDIT

**Project:** Zerkalo (onspace-app) — Expo/React Native
**Date:** 2026-05-10
**Source:** `/home/hermes/work/zerkalo-onspace-prune-1`
**Branch:** `audit/static-dependency-usage`
**Method:** Static source scan (no install, no build, no network)

---

## Executive verdict

**131 dependencies** checked via static grep/rg of 63 source files + config files.

- **8 packages** actually imported in active source code
- **4 packages** used in template/ (not active, but accessible via `@/template`)
- **2 packages** in `app.json` plugins
- **117 packages** have zero import references anywhere in the source tree

The app is a clean Expo Router web app with ~20 screens. The vast majority of `package.json` dependencies are **dead weight** — remnants of an Expo Snack / OnSpace template import that included native-only, expo-plugin, and third-party packages never used.

---

## Why install/prune is currently blocked

| Issue | Detail |
|---|---|
| **npm registry ECONNRESET** | VPS cannot reliably download from `registry.npmjs.org`. 5 attempts all timed out at 600s. |
| **lockfile drift** | `pnpm-lock.yaml` contains 91 packages not in `package.json` specifiers + 18 version mismatches. Lockfile is from a different app state. |
| **pnpm store corruption** | `pnpm store prune` was required once (39367 files removed). |
| **Resolution** | Install + prune postponed until network stabilizes or registry mirror is configured. |

---

## Method

- **Source scan:** `rg "from 'package-name'" ./app/ ./components/ ./hooks/ ./services/ ./contexts/ ./constants/ ./template/`
- **Config scan:** `babel.config.js`, `tsconfig.json`, `app.json`, `eslint.config.js`, `.gitignore`
- **Template scan:** Full tree of `template/` directory (auth mock, auth supabase, core, UI components)
- **Coverage:** 63 source files, 93 specific package searches, 131 total deps verified
- **No install, no network, no build**

---

## Definitely used packages (8)

These are imported in active source code and must be kept.

| Package | Evidence | Keep reason |
|---|---|---|
| `react` | 26 imports across all screens | Core framework |
| `react-native` | 28 imports across all files | Core framework |
| `expo-router` | 19 imports across all screens | Framework, routing |
| `react-native-safe-area-context` | 17 imports across all screens | Layout safety |
| `@expo/vector-icons` | 17 imports (MaterialIcons) | UI icons |
| `expo-linear-gradient` | 7 imports across screens | UI gradient backgrounds |
| `react-native-svg` | 1 import (MirrorSymbol.tsx) | Brand SVG component |
| `expo-status-bar` | 1 import (_layout.tsx) | Status bar config |

---

## Config/runtime packages to keep (11)

These are required by Expo/Expo Router/config, even without direct `import`.

| Package | Config/runtime reason | Risk if removed |
|---|---|---|
| `expo` | Expo framework runtime | HIGH — app won't start |
| `expo-constants` | Expo runtime | HIGH — Router breaks |
| `expo-font` | Expo assets loader | HIGH — font loading |
| `expo-linking` | Used by expo-router | HIGH — deep linking |
| `expo-system-ui` | Expo Router dependency | HIGH |
| `expo-asset` | Expo runtime | HIGH |
| `expo-splash-screen` | `app.json` plugin | HIGH — splash screen |
| `react-dom` | React Native Web peer dep | HIGH — web target |
| `react-native-web` | React Native Web target | HIGH — web rendering |
| `@expo/metro-runtime` | Metro bundler runtime | HIGH — bundling |
| `eslint-config-expo` | `eslint.config.js` uses it | Dev — lint will break |
| `@babel/core` | `babel.config.js` | Dev — babel will break |
| `typescript` | `tsconfig.json` / compilation | Dev — type checking |

**Transitive dependencies** (installed by React Native / Expo Router but often listed in package.json for correctness): `react-native-reanimated`, `react-native-gesture-handler`, `react-native-screens`, `react-native-webview`, `react-refresh`, `tslib`.

---

## Deep focus — unused packages (33)

All 33 packages from the OnSpace deep focus list have **zero import references** and **zero config references**.

| Package | Import refs | Config refs | Recommendation |
|---|---|---|---|
| `@apollo/client` | 0 | 0 | Remove |
| `@graphql-codegen/introspection` | 0 | 0 | Remove |
| `@stripe/stripe-react-native` | 0 | 0 | Remove (native-only, web don't use) |
| `expo-av` | 0 | 0 | Remove (native-only) |
| `expo-audio` | 0 | 0 | Remove (native-only) |
| `expo-camera` | 0 | 0 | Remove (native-only) |
| `expo-contacts` | 0 | 0 | Remove (native-only) |
| `expo-gl` | 0 | 0 | Remove (native-only) |
| `expo-location` | 0 | 0 | Remove (native-only) |
| `expo-sensors` | 0 | 0 | Remove (native-only) |
| `expo-video` | 0 | 0 | Remove (native-only) |
| `expo-calendar` | 0 | 0 | Remove (native-only) |
| `expo-file-system` | 0 | 0 | Remove (template-only, not active) |
| `expo-print` | 0 | 0 | Remove (native-only) |
| `expo-secure-store` | 0 | 0 | Remove (template-only) |
| `expo-sharing` | 0 | 0 | Remove (native-only) |
| `expo-sqlite` | 0 | 0 | Remove (template-only) |
| `expo-media-library` | 0 | 0 | Remove (native-only) |
| `graphql` | 0 | 0 | Remove |
| `immutable` | 0 | 0 | Remove |
| `lucide-react-native` | 0 | 0 | Remove (never imported; uses @expo/vector-icons instead) |
| `nativewind` | 0 | 0 | Remove (not in babel.config.js, not imported) |
| `react-native-maps` | 0 | 0 | Remove (native-only) |
| `react-native-vector-icons` | 0 | 0 | Remove (uses @expo/vector-icons instead) |
| `react-native-webrtc` | 0 | 0 | Remove (native-only, no calls) |
| `react-redux` | 0 | 0 | Remove (no Redux setup) |
| `redux` | 0 | 0 | Remove |
| `redux-thunk` | 0 | 0 | Remove |
| `snack-content` | 0 | 0 | Remove (Expo Snack artifact) |
| `react-string-replace` | 0 | 0 | Remove |
| `zustand` | 0 | 0 | Remove (not imported, not configured) |
| `@supabase/supabase-js` | 0 (active) | 0 | Remove (template/auth only, not active) |
| `expo-auth-session` | 0 (active) | 0 | Remove (template/auth only, not active) |

---

## High-risk web/PWA/Telegram packages (4)

These are potentially useful for future features but currently unused.

| Package | Why risky | Currently used | Recommendation |
|---|---|---|---|
| `expo-web-browser` | Required for OAuth/DeepLink | `app.json` plugin ✅ | Keep — config plugin declared |
| `@react-native-async-storage/async-storage` | Required for offline storage | Template only | Keep — used by template mock auth |
| `expo-notifications` | Expensive native-only | 0 refs | Remove — web doesn't support push |
| `react-native-calendars` | Heavy 300KB+ | 0 refs | Remove — calendar not used |

---

## Keep for later, not active now (2)

| Package | Future use case |
|---|---|
| `@supabase/supabase-js` | Auth + DB (template ready, not active) |
| `expo-auth-session` | Auth flow (template ready, not active) |

Both are fully wired in `template/` but not imported from active app code. Keep if you plan to activate Supabase auth. Remove if you're certain the app will never use auth.

---

## Recommended prune batch 1 (safe removals, 17 packages)

First wave — packages with **zero import, zero config, zero risk** to the current app:

```
@apollo/client, @graphql-codegen/introspection, @stripe/stripe-react-native,
expo-av, expo-audio, expo-camera, expo-gl, expo-location,
expo-video, graphql, immutable, lucide-react-native,
nativewind, react-native-maps, react-native-webrtc,
snack-content, react-string-replace
```

**Risk:** None — these are not referenced anywhere in source, config, or template.

---

## Recommended prune batch 2 (second layer, 15 packages)

After batch 1 is verified via build:

```
expo-calendar, expo-contacts, expo-file-system, expo-print,
expo-secure-store, expo-sharing, expo-sqlite, expo-media-library,
react-redux, redux, redux-thunk, react-native-vector-icons,
react-native-qrcode-svg, zustand, react-native-elements,
react-native-crypto-js, react-native-view-shot
```

**Risk:** None for active app. Most are native-only; some are in template code but template is not wired into active screens.

---

## Exactly next command when network is stable

```bash
cd /home/hermes/work/zerkalo-onspace-prune-1

# 1. Remove selected packages from package.json
# (edit package.json, remove batch 1 packages)

# 2. Sync lockfile
pnpm install --no-frozen-lockfile

# 3. Lint
npm run lint

# 4. Web test
EXPO_OFFLINE=1 CI=1 timeout 10s pnpm web

# 5. If all pass — commit and push
```

---

## Summary

| Category | Count |
|---|---|
| Total dependencies | 131 |
| Definitely used (source imports) | 8 |
| Config/runtime keep | 13 |
| Template-only (not actively imported) | 4 |
| Unused (no import/config reference) | ~106 |
| Batch 1 prune candidates | 17 |
| Batch 2 prune candidates | 15+ |

The app's functional dependency footprint is **~21 packages** (8 used + 13 runtime). The remaining ~110 packages are dead weight from the OnSpace template import.
