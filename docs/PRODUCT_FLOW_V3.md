# Product Flow V3 — Palace Entry / Living Passport

**Status:** DONOR PROTOTYPE · NOT PRODUCTION  
**Version:** V3 · Palace Entry

---

## 1. Journey Architecture

```
THRESHOLD → DATE ENTRY → REVEAL → FIRST MIRROR → LIVING PASSPORT → CONTINUATION
```

Three top-level spaces:
1. **Первое зеркало** (Threshold → Reveal → First Mirror)
2. **Мой паспорт** (Living Passport — 7 rooms)
3. **Продолжение** (Continuation — product selection)

---

## 2. Emotional State at Each Transition

| Stage | User emotion | Key question | Friction | CTA promise |
|-------|-------------|--------------|---------|-------------|
| Threshold | Curious but guarded | "Is this for me?" | None | First mirror |
| Date Entry | Engaged | "Will it be quick?" | Typing | See result |
| Reveal | Anticipatory | "What will it say?" | Waiting (positive) | Almost ready |
| First Mirror | Recognition / surprise | "Does this describe me?" | Reading | See full route |
| Living Passport | Exploration | "What else is there?" | Scrolling 7 rooms | Open depth |
| Continuation | Desire | "How do I get more?" | Price decision | Start |

---

## 3. Screen Routes

| Screen | File | Route | Analytics trigger |
|--------|------|-------|-------------------|
| Threshold | `app/threshold.tsx` | `/threshold` | `mirror_entry_viewed` |
| Date Entry | `app/(tabs)/calculate.tsx` | `/(tabs)/calculate` | `birth_date_submitted` |
| Reveal | `app/reveal.tsx` | `/reveal` | `reveal_started` |
| First Mirror | `app/first-mirror.tsx` | `/first-mirror` | `first_mirror_viewed` |
| Living Passport | `app/living-passport.tsx` | `/living-passport` | `passport_opened` |
| Continuation | `app/continuation.tsx` | `/continuation` | `deep_preview_viewed` |

---

## 4. Navigation Rules

- Threshold → `/threshold` (replaces onboarding conceptually)
- Threshold CTA → `/(tabs)/calculate`
- Calculate → on success → `/reveal`
- Reveal → after 4.2s → `/first-mirror` (auto-navigate)
- First Mirror primary CTA → `/living-passport`
- First Mirror secondary → `/continuation`
- Living Passport Room 7 → `/continuation`
- Continuation close → back

**Note:** The existing `/result` route is preserved for backward compatibility but the V3 flagship journey skips it.

---

## 5. Maximum Actions to First Value

| Milestone | Max actions from entry |
|-----------|----------------------|
| First phrase of recognition | 3 actions (open → enter date → tap) |
| Full First Mirror | 3 actions |
| First position detail | 4 actions |
| First full passport room | 4 actions |

**Target: ≤ 3 actions to first recognition phrase.**

---

## 6. CTA Hierarchy (one primary per viewport)

| Screen | Primary CTA | Secondary CTA |
|--------|------------|---------------|
| Threshold | Открыть первое зеркало | Войти в аккаунт |
| Calculate | Рассчитать код | — |
| First Mirror | Увидеть весь маршрут | Задать вопрос в Telegram |
| Living Passport (R7) | Продолжить в полном продукте | Увидеть историю своего маршрута |
| Continuation | Product selection | Telegram |

---

## 7. What is NOT in V3 flagship journey

- Mandatory registration before first value
- Fake `unlockPremium()` calls
- `unitPrice` hardcoded in components
- "Артём" hardcoded in reusable components
- Three-slide onboarding

---

## 8. Prototype-Safe Rules

Every premium CTA must:
1. Show `PROTOTYPE · НЕ РЕАЛЬНАЯ ПОКУПКА` badge
2. Use `analytics.track('prototype_cta_clicked')` not `unlockPremium()`
3. Navigate to `/continuation` not execute payment logic

---

## 9. Personal Myth Bridge

Appears after Room 7 of Living Passport and in Continuation screen.

**Text:** "У числового маршрута есть ещё одна форма — история, в которой его можно увидеть не как схему, а как личный миф."

**CTA:** "Увидеть историю своего маршрута"

**State:** Prototype. Navigate to `/continuation` with `personal_myth_interest_clicked` analytics event.

---

## 10. V3 vs V2 Differences

| Aspect | V2 | V3 |
|--------|----|----|
| Entry | 3-slide onboarding | Single threshold screen |
| Result | Tab dashboard | Recognition-first First Mirror |
| Passport | 6 equal tabs | 7 sequential rooms |
| Premium CTA | `unlockPremium()` called | Prototype-safe, no fake payment |
| Data | Hardcoded "Артём" in components | `MirrorProfile` data contract |
| Analytics | Basic `trackEvent()` | Privacy-safe service with allowlist |
| Prices | Hardcoded "2 900 ₽" | `PRICE_CONFIG` lookup |
