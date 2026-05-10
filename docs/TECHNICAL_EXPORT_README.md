# Zerkalo — Technical Export README
## MVP v0.4 — Premium Telegram/WebApp Export Candidate

---

## 1. Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 51+ |
| Routing | Expo Router (file-based, tab navigation) |
| State | React Context (AppContext) |
| Language | TypeScript (strict) |
| Icons | @expo/vector-icons (MaterialIcons) |
| Animations | expo-linear-gradient |
| Safe Areas | react-native-safe-area-context |
| Alerts | Custom AlertProvider (@/template) |

---

## 2. Run locally

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Open in browser (PWA/web)
npx expo start --web

# Open in iOS Simulator
npx expo start --ios

# Open in Android Emulator
npx expo start --android
```

---

## 3. Production build

```bash
# Web build (output: dist/)
npx expo export --platform web

# iOS (requires Apple Developer account)
npx eas build --platform ios

# Android
npx eas build --platform android

# Android APK (for testing)
npx eas build --platform android --profile preview
```

---

## 4. Export to GitHub

```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/zerkalo-app.git
git add .
git commit -m "Zerkalo MVP v0.4"
git push -u origin main
```

---

## 5. Deploy as website/webapp

After `npx expo export --platform web`, the `dist/` folder contains a static web build.

Deploy options:
- **Vercel**: `vercel deploy dist/`
- **Netlify**: drag-and-drop `dist/` to Netlify UI
- **GitHub Pages**: push `dist/` contents to `gh-pages` branch
- **Custom server**: serve `dist/` as static files (nginx, caddy, etc.)

For PWA support, ensure `app.json` has correct `web.favicon`, `web.name`, `web.themeColor`.

---

## 6. Use as Telegram Mini App

See: `docs/TELEGRAM_MINI_APP_README.md`

Short version:
1. Deploy web build to a public HTTPS URL
2. Open BotFather → your bot → Menu Button → set URL
3. App opens in Telegram WebView
4. The app auto-detects Telegram via `services/telegram.ts`

---

## 7. Screen locations

```
app/onboarding.tsx          — Welcome / onboarding slides
app/(tabs)/calculate.tsx    — Date input form
app/result.tsx              — Main result screen (tabs: Паспорт/Числа/Синтез/Глубина)
app/matrix-detail.tsx       — Matrix module
app/cycles.tsx              — Personal cycles
app/money-code.tsx          — Money code
app/paywall.tsx             — Premium upsell / Большое исследование
app/auth.tsx                — Login / guest selection
app/(tabs)/index.tsx        — Home dashboard
app/(tabs)/saved.tsx        — Saved reports
app/(tabs)/profile.tsx      — User profile
```

---

## 8. UI components

```
components/ui/PremiumCard.tsx       — Dark bordered card
components/ui/GoldButton.tsx        — Primary gold CTA button
components/ui/NumberBadge.tsx       — Circular number display with planet color
components/ui/DisclaimerBanner.tsx  — Legal disclaimer
components/ui/SectionLabel.tsx      — Section header label
components/brand/MirrorSymbol.tsx   — SVG mirror/orbit symbol
components/feature/CodePassport.tsx — 5-number formula display
components/feature/MatrixGrid.tsx   — Matrix visualization
```

---

## 9. Design system

```
constants/theme.ts          — Colors, Typography, Spacing, Radii, Shadows, PLANET_COLORS
docs/design/DESIGN_SYSTEM.md
docs/design/UI_TOKENS.md
docs/design/COMPONENTS.md
```

---

## 10. Calculation logic

All math lives in: `services/calculations.ts`

Key functions:
```ts
calculateCoreNumbers(day, month, year)  → CoreNumbers (5 числа + composites)
calculateMatrix(core)                   → MatrixData
calculateMoneyCode(day, month, year)    → MoneyCode
calculatePersonalCycles(day, month, targetYear, currentMonth) → PersonalCycleData
```

Acceptance test for 06.05.1986:
- Душа: 6 | Выражение: 11→2 | Путь: 35→8 | Направление: 41→5 | Результат: 82→1
- Личный год 2026: 3 (Юпитер) | Деньги: 6·5·6·8

---

## 11. Interpretation texts

```
constants/numerology-data.ts
  NUMBER_LABELS             — public number names
  NUMBER_INTERNAL_LABELS    — secondary labels
  NUMBER_DETAILED           — light/shadow/practice per number
  EXPRESSION_DETAILED       — expression-specific interpretations
  NUMBER_POSITION_ESSENCE   — per-position essence texts
  PERSONAL_YEAR_MEANINGS    — cycle descriptions
  MATRIX_EMPTY_ZONE_TEXTS   — matrix empty zone texts
  MONEY_POSITIONS           — money code position descriptions
```

---

## 12. Replace mock data with canonical engine

Current state: interpretations are **placeholder/demo quality** — structurally correct but not fully authored.

To replace with canonical content:
1. Open `constants/numerology-data.ts`
2. Replace text values in `NUMBER_DETAILED`, `EXPRESSION_DETAILED`, `NUMBER_POSITION_ESSENCE`
3. Add full authored texts for all 9 numbers × 5 positions
4. No structural changes needed — only content replacement

---

## 13. Connect backend

Placeholder location: `contexts/AppContext.tsx`

Replace these local state operations:
```ts
setSavedReports(...)     → Supabase / OnSpace Cloud insert
setIsPremium(true)       → Backend purchase verification
setUser(...)             → Auth provider (Supabase, Telegram user id)
```

See: `docs/BACKEND_NOTES.md`

---

## 14. Connect payment

See: `docs/PAYMENT_INTEGRATION_NOTES.md`

CTA button is in: `app/paywall.tsx` → `handlePurchase()`
Currently calls `unlockPremium()` as mock.

---

## 15. Connect PDF generation

Planned location: `services/pdfExport.ts` (not yet created)

Options:
- `expo-print` — React Native native print/PDF
- Server-side: send calculation data to edge function → generate PDF → return URL
- Third-party: PDFShift, WeasyPrint, Puppeteer on server

---

## 16. Mock / demo parts

| Part | Status |
|---|---|
| Calculation engine | ✅ Real — verified against 06.05.1986 |
| Interpretation texts | ⚠️  Placeholder — needs canonical authoring |
| Payment (unlockPremium) | 🔴 Mock — no real payment |
| Authentication | 🔴 Mock — local state only |
| Saved reports | 🔴 Session only — lost on app restart |
| PDF export | 🔴 Not implemented |
| Backend | 🔴 Not connected |

---

## 17. Not production-ready

- Payments (no Stripe / YooKassa / Telegram Stars)
- Auth (no backend user accounts)
- Persistent storage (no database)
- PDF export
- Interpretation database (placeholder texts)
- Push notifications
- Admin console

All structural code, UI, calculations, and design system are production-quality.
