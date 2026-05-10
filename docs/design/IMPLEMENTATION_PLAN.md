# Зеркало себя — Implementation Plan v1

## Status

- [x] Calculation engine (5 numbers, composite mode, acceptance tests pass)
- [x] Design system documented
- [x] UI tokens documented
- [ ] Dark theme applied to constants/theme.ts
- [ ] 4 MVP screens implemented
- [ ] MirrorSymbol component created
- [ ] PWA manifest configured

---

## Phase 1 — Design foundation (current)

1. Update `constants/theme.ts` → dark token set
2. Create `components/brand/MirrorSymbol.tsx`
3. Update `app/onboarding.tsx` → Welcome screen (dark, minimal)
4. Update `app/(tabs)/calculate.tsx` → Date Input screen
5. Update `app/result.tsx` → Free Result screen (dark tabs)
6. Update `app/paywall.tsx` → Big Research CTA (dark full)

---

## Phase 2 — PWA readiness

1. Update `app.json` → add web output, PWA meta
2. Add `public/manifest.json` for PWA install
3. Add `public/sw.js` stub for service worker
4. Test on Safari iOS (safe areas, viewport)

---

## Phase 3 — Payment integration

1. Connect Stripe one-time payment (2 900 ₽)
2. Create Edge Function for payment webhook
3. Persist premium status in Supabase
4. Generate PDF report (edge function)
5. Telegram delivery webhook

---

## Phase 4 — Account (minimal)

1. Email magic link auth
2. Save reports to Supabase
3. Re-open previous reports

---

## Smoke test checklist

- [ ] DOB 06.05.1986 → formula 6—2—8—5—1
- [ ] Composites shown: 11 / 35 / 41 / 82
- [ ] Direction = 41 → 5 (NOT 14)
- [ ] Result = 82 → 1 (NOT 19)
- [ ] Personal year 2026 = 3
- [ ] Money code = 6 · 5 · 6 · 8
- [ ] No old labels (Ума / Действия / Реализации / Итога)
- [ ] No esoteric noise (луны, звёзды, магия)
- [ ] Premium CTA visible on Free Result
- [ ] Legal disclaimer on all key screens
- [ ] Safe area: no overlap with status bar
- [ ] No debug/wrench button visible

---

## Definition of Done

A screen is DONE when:
1. Dark premium visual matches design system
2. All tokens used (no hardcoded hex)
3. Safe area insets applied
4. Self-critique passed (Philosophy / Hierarchy / Detail / Function / Innovation)
5. No anti-patterns present
6. CTA leads toward purchase/signup
