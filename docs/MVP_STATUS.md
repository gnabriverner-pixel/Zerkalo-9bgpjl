# Zerkalo — MVP Status
## v0.4 — Premium Telegram/WebApp Export Candidate

---

## What is ready

### ✅ Core product
- 5-number calculation engine (verified against 06.05.1986)
- Composite number preservation (11/35/41/82)
- Detailed calculation chains displayed everywhere
- Expression number as авторское расширение
- Matrix module (simple + locked detailed)
- Personal cycles (year + monthly breakdown)
- Money code (4 positions, 2 free + 2 locked)
- Premium gating (isPremium flag)
- Guest mode with honest limitations
- Analytics event stubs

### ✅ Screens
- Onboarding (3 slides with MirrorSymbol)
- Date input with validation
- Result screen (Паспорт / Числа / Синтез / Глубина tabs)
- Paywall (Большое исследование)
- Cycles screen
- Money code screen
- Matrix detail screen
- Saved reports
- Profile
- Home dashboard

### ✅ Design system
- Dark premium theme (black/gold/ivory)
- Planet color system
- Typography scale
- Spacing tokens
- Component library (PremiumCard, GoldButton, NumberBadge, etc.)
- MirrorSymbol SVG component

### ✅ Documentation
- DESIGN_SYSTEM.md
- UI_TOKENS.md
- COMPONENTS.md
- TECHNICAL_EXPORT_README.md
- TELEGRAM_MINI_APP_README.md
- PAYMENT_INTEGRATION_NOTES.md
- BACKEND_NOTES.md
- AUTH_NOTES.md
- MVP_STATUS.md (this file)

---

## What is mock / demo

| Item | Status |
|---|---|
| Calculation engine | ✅ Real math, verified |
| Interpretation texts | ⚠️  Placeholder — need canonical authoring |
| Payment | 🔴 Mock — `unlockPremium()` local call only |
| Auth | 🔴 Mock — local React state |
| Saved reports | 🔴 Session only — lost on app restart |
| PDF export | 🔴 Not implemented |
| Backend | 🔴 Not connected |

---

## Known limitations

1. **No persistence** — all data lost on app restart
2. **No real payment** — premium unlocked locally only
3. **Interpretations are placeholders** — not final authored content
4. **No PDF** — premium report exists as UI only
5. **Compatibility module** — placeholder screen
6. **Age map** — placeholder screen

---

## Screens available

| Screen | File | Status |
|---|---|---|
| Onboarding | app/onboarding.tsx | ✅ |
| Calculate | app/(tabs)/calculate.tsx | ✅ |
| Result | app/result.tsx | ✅ |
| Paywall | app/paywall.tsx | ✅ |
| Cycles | app/cycles.tsx | ✅ |
| Money Code | app/money-code.tsx | ✅ |
| Matrix | app/matrix-detail.tsx | ✅ |
| Home | app/(tabs)/index.tsx | ✅ |
| Saved | app/(tabs)/saved.tsx | ✅ |
| Profile | app/(tabs)/profile.tsx | ✅ |
| Auth | app/auth.tsx | ⚠️ Placeholder |
| Compatibility | app/compatibility.tsx | ⚠️ Placeholder |
| Age Map | app/age-map.tsx | ⚠️ Placeholder |
| Report | app/report.tsx | ⚠️ Placeholder |

---

## Technical risks

1. **Expo Router version** — ensure package.json has compatible expo-router
2. **LinearGradient** — requires expo-linear-gradient (included)
3. **Safe areas** — tested for iOS notch; Android may need adjustment
4. **Web build** — some RN APIs unavailable on web; test before deploy
5. **Telegram WebView** — safe area may differ; test on real device

---

## Can the project run locally?

✅ Yes — `npm install && npx expo start` should work immediately.

---

## Can it be used as a Telegram Mini App?

✅ Yes — after web build and deployment to HTTPS domain.
See: `docs/TELEGRAM_MINI_APP_README.md`

---

## What is needed for production

### Priority 1 (launch blocker)
- [ ] Real payment integration (YooKassa / Telegram Stars)
- [ ] Persistent storage (backend or AsyncStorage)
- [ ] Authored interpretation texts

### Priority 2 (launch quality)
- [ ] Backend auth (Telegram or email)
- [ ] PDF report generation
- [ ] Telegram Mini App deployment

### Priority 3 (growth)
- [ ] Admin console for content management
- [ ] Analytics (real events, not console.log)
- [ ] Push notifications
- [ ] Compatibility module (full)
- [ ] Age map (full)

---

## Version history

| Version | Description |
|---|---|
| v0.1 | Initial prototype (4 numbers, light theme) |
| v0.2 | Dark premium theme, MirrorSymbol |
| v0.3 | Production patch — 5 numbers, composite mode, Expression number |
| **v0.4** | Stabilization, safe areas, Telegram prep, documentation export |
