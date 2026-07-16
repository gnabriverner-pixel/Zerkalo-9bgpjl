# Canonical Transfer Map V3

**Status:** DONOR PROTOTYPE · NOT PRODUCTION  
**Purpose:** Guide selective transfer of V3 components to `digital-code-system/webapp`

---

## Transfer Decision Legend

| Symbol | Meaning |
|--------|---------|
| ✅ Transfer fully | Extract with minimal changes |
| 🔧 Adapt | Good concept, needs platform/stack translation |
| ⚠️ Partial | Use specific parts only |
| ❌ Do not transfer | Prototype-only, wrong for production |

---

## 1. Data Contract

| Donor | File | Decision | Why | Destination | Notes |
|-------|------|----------|-----|-------------|-------|
| `MirrorProfile` type | `services/mirror-data.ts` | ✅ Transfer fully | Clean interface with provenance, no business logic in UI | `webapp/src/types/mirror-profile.ts` | Remove RN-specific imports |
| `PRICE_CONFIG` | `services/mirror-data.ts` | ✅ Transfer fully | Decoupled pricing, no UI changes needed for price updates | `webapp/src/config/prices.ts` | Add currency detection |
| `buildMirrorProfileFromSession` | `services/mirror-data.ts` | 🔧 Adapt | Logic is correct, mock content needs real interpretation service | `webapp/src/services/mirror-adapter.ts` | Replace artistic mock with canonical interpretation DB |
| `MOCK_PROFILE` | `services/mirror-data.ts` | ⚠️ Partial | Use as schema reference and default fallback | `webapp/src/mocks/` | Keep separate from production code |

---

## 2. Analytics Service

| Donor | File | Decision | Why | Destination | Notes |
|-------|------|----------|-----|-------------|-------|
| `AnalyticsEvent` union type | `services/analytics.ts` | ✅ Transfer fully | Complete, well-considered event catalog | `webapp/src/analytics/events.ts` | — |
| `PAYLOAD_ALLOWLIST` | `services/analytics.ts` | ✅ Transfer fully | Privacy-critical, prevents PII leakage | `webapp/src/analytics/allowlist.ts` | — |
| `AnalyticsAdapter` interface | `services/analytics.ts` | ✅ Transfer fully | Clean adapter pattern | `webapp/src/analytics/adapter.ts` | Implement with Amplitude/Mixpanel |
| `analytics` singleton | `services/analytics.ts` | 🔧 Adapt | Good pattern, needs real adapter | `webapp/src/analytics/index.ts` | Wire production adapter |

---

## 3. Motion Tokens

| Donor | File | Decision | Why | Destination | Notes |
|-------|------|----------|-----|-------------|-------|
| `Motion` constants | `constants/motion.ts` | ✅ Transfer fully | Complete motion system | `webapp/src/constants/motion.ts` | Convert to CSS custom properties for web |

---

## 4. Flagship V3 Screens

### 4a. Threshold

| Aspect | Decision | Notes |
|--------|----------|-------|
| Single-screen entry concept | ✅ Transfer | Superior to 3-slide onboarding |
| `MirrorSigil` animated component | 🔧 Adapt | Rewrite with CSS/SVG animation for web |
| Entry copy + CTA structure | ✅ Transfer | Proven emotional structure |
| "Without registration" principle | ✅ Transfer | Critical for conversion |

**Required data:** None (static)  
**Complexity:** Low  
**Destination:** `webapp/src/pages/threshold/`

---

### 4b. Reveal Sequence

| Aspect | Decision | Notes |
|--------|----------|-------|
| 3–5 second cinematic wait | ✅ Transfer | Transforms loading into anticipation |
| `ConstellationDot` animation | 🔧 Adapt | CSS keyframe rewrite |
| Step copy ("Собираем пять позиций") | ✅ Transfer | Tone is exactly right |
| Auto-navigate after 4.2s | ✅ Transfer | UX timing validated |

**Required data:** `MirrorIdentity.displayName` (optional)  
**Complexity:** Low  
**Destination:** `webapp/src/pages/reveal/`

---

### 4c. First Mirror

| Aspect | Decision | Why better than current | Destination |
|--------|----------|------------------------|-------------|
| Recognition headline BEFORE numbers | ✅ Transfer | Solves "number-first" conversion problem | `webapp/src/pages/first-mirror/` |
| Triptych (Strength / Tension / Action) | ✅ Transfer | Best content structure in entire prototype | `webapp/src/components/TriptychCard/` |
| Five-position strip (human first) | ✅ Transfer | roleLabel before finalNumber is correct hierarchy | `webapp/src/components/PositionStrip/` |
| Scroll-based analytics tracking | ✅ Transfer | Measures first_mirror_recognition_seen accurately | — |
| Dual CTA (primary + Telegram secondary) | ✅ Transfer | Right conversion architecture | — |

**Required data:** Full `MirrorProfile.recognition` + `MirrorProfile.positions`  
**Complexity:** Medium  
**Dependency:** Real interpretation service for `recognition.headline`

---

### 4d. Living Passport

| Aspect | Decision | Notes |
|--------|----------|-------|
| 7-room sequential story-flow | ✅ Transfer | Eliminates dashboard feeling |
| `RoomHeader` component | ✅ Transfer | Excellent wayfinding pattern |
| `JourneyProgress` progress bar | ✅ Transfer | Keeps users oriented |
| `PositionCard` expand/collapse | ✅ Transfer | Clean pattern, mobile-first |
| `PersonalMythBridge` | ✅ Transfer | Unique product element |
| Vertical scroll vs tabs | ✅ Transfer | Better for deep content |
| Practice cards 4-type grid | ✅ Transfer | Clean self-care UX pattern |

**Required data:** Full `MirrorProfile`  
**Complexity:** High  
**Mobile notes:** Test on iPhone SE (375px width) — fNode flex layout may need adjustment

---

### 4e. Continuation

| Aspect | Decision | Notes |
|--------|----------|-------|
| Prototype-safe CTA (no fake payment) | ✅ Transfer principle | Maintain honesty in all states |
| Three-product tier structure | 🔧 Adapt | Add real payment integration |
| `PRICE_CONFIG` lookup pattern | ✅ Transfer | Never hardcode prices in components |
| Personal Myth as separate product | ✅ Transfer | Correct product separation |
| Telegram secondary CTA | ✅ Transfer | Real bot integration needed |

**Required data:** `MirrorProfile.continuation` + `PRICE_CONFIG`  
**Complexity:** Medium + payment integration  
**Destination:** `webapp/src/pages/continuation/`

---

## 5. What NOT to Transfer

| Item | Reason |
|------|--------|
| `unlockPremium()` in CTA | Fake payment — wrong signal to users |
| `MOCK_PROFILE` as production default | Mock content as canon |
| Hardcoded "Артём" anywhere in reusable components | Personalization must come from data |
| `ConsoleAnalyticsAdapter` in production | Development-only |
| `OnSpace`-specific architecture (`template/`, `contexts/AppContext`) | Platform-specific |
| `visual-passport.tsx` (V2) | Replaced by `living-passport.tsx` (V3) |
| Old `onboarding.tsx` (3-slide) | Replaced by `threshold.tsx` |
| Old `paywall.tsx` | Replaced by `continuation.tsx` |

---

## 6. Recommended Transfer Order

1. **Data contract** (`MirrorProfile`, `PRICE_CONFIG`, `AnalyticsEvent`)
2. **Analytics service** (allowlist + adapter interface)
3. **Motion tokens** → CSS custom properties
4. **Design tokens** → CSS custom properties / Tailwind config
5. **Threshold screen** (low complexity, high conversion value)
6. **Reveal sequence** (low complexity, experience-critical)
7. **First Mirror** — `TriptychCard` + `PositionStrip` first
8. **First Mirror** — full screen with scroll analytics
9. **Living Passport** — room by room
10. **Continuation** — after payment system is ready

---

## 7. Three Strongest Product Findings

1. **Recognition before numbers** — showing a human behavioral pattern before a digit removes the "what does this number mean" barrier entirely. First Mirror's `recognition.headline` is the most important single text in the product.

2. **7-room sequential palace** — replacing tabs with sequential rooms transforms the UX from browsing a catalog to reading a personal document. Users stay because each room feels like turning a page, not switching channels.

3. **PRICE_CONFIG separation** — removing prices from components into a single config object means pricing experiments require zero UI work. This is a business-critical architecture decision.

---

## 8. Three Main Risks

1. **Interpretation quality** — `recognition.headline` and `synthesis.mainRoute` in MOCK_PROFILE are artistic. The real canonical interpretation service must produce content of equal or better quality. If text quality drops, conversion will drop.

2. **Reveal sequence timing** — 4.2 seconds works in prototype. With real server latency (calculation API + interpretation API), the reveal must extend or show intermediate progress. Do not let reveal complete before data is ready.

3. **Personal Myth positioning** — introducing it as a separate product with its own price creates a new product tier. Ensure pricing strategy is decided before implementing. Do not bundle it by default into big research — keep it distinct.
