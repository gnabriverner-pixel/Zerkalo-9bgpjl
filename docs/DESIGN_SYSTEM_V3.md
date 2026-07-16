# Design System V3 — Зеркало себя / Palace Entry

**Status:** DONOR PROTOTYPE · NOT PRODUCTION  
**Version:** V3 · Palace Entry · Living Passport

---

## 1. Product Soul

**Who:** Adults seeking self-understanding through their birth date  
**Context:** Private, quiet moment of self-reflection  
**Emotion targets:** calm · precise · intimate · slightly mysterious · not esoteric

---

## 2. Physical Metaphor

**Metaphor:** Sealed personal archive / Palace of rooms  
**Material:** Matte graphite + warm gold foil  
**Depth:** Border-layered, not shadow-reliant  
**Consistency:** All cards, panels, modals, bars follow this metaphor

---

## 3. Color Semantics

**File:** `constants/theme.ts`

| Token | Hex | Use |
|-------|-----|-----|
| `Colors.background` | `#090909` | Deepest background |
| `Colors.surface` | `#141312` | Card surface |
| `Colors.surfaceDark` | `#0B0B0A` | Hero sections, headers |
| `Colors.gold` | `#D8B36A` | Primary accent, CTA, numbers |
| `Colors.goldSoft` | `#B99352` | Secondary gold, gradients |
| `Colors.goldGlow` | `rgba(216,179,106,0.10)` | Icon backgrounds |
| `Colors.goldTint` | `rgba(216,179,106,0.07)` | Card tints |
| `Colors.textPrimary` | `#F4EFE4` | Main text (ivory) |
| `Colors.textSecondary` | `#C9C0AE` | Body text |
| `Colors.textMuted` | `#9A9183` | Captions, labels |
| `Colors.textDisabled` | `#5A5448` | Disabled, legal text |
| `Colors.border` | `rgba(212,174,104,0.22)` | Gold border |
| `Colors.borderLight` | `rgba(255,255,255,0.06)` | Card dividers |

**Planet colors (by number):**

| Number | Planet | Color |
|--------|--------|-------|
| 1 | Солнце | `#E8C040` |
| 2 | Луна | `#A8B8C8` |
| 3 | Юпитер | `#7A9858` |
| 4 | Раху | `#6A5A8A` |
| 5 | Меркурий | `#5A8A7A` |
| 6 | Венера | `#C87A8A` |
| 7 | Кету | `#7A6A5A` |
| 8 | Сатурн | `#6A6A7A` |
| 9 | Марс | `#C86A5A` |

---

## 4. Typography

**File:** `constants/theme.ts` — `Typography` object

| Scale | Size | Weight | Use |
|-------|------|--------|-----|
| `display` | 34 | 700 | Page heroes |
| `title` | 26 | 700 | Section titles |
| `heading` | 20 | 600 | Section headers |
| `subheading` | 16 | 600 | Card titles |
| `body` | 16 | 400 | Main body text |
| `bodySmall` | 14 | 400 | Card body |
| `caption` | 12 | 400 | Labels, meta |
| `label` | 11 | 600 | Uppercase labels, letterSpacing 1.2 |
| `button` | 15 | 600 | CTA buttons |
| `mono` | 12 | 400 | Calculation chains |

---

## 5. Spacing Scale

**File:** `constants/theme.ts` — `Spacing` object

| Token | Value |
|-------|-------|
| `xs` | 4 |
| `sm` | 8 |
| `md` | 16 |
| `lg` | 24 |
| `xl` | 32 |
| `xxl` | 48 |
| `xxxl` | 64 |

---

## 6. Border Radius Scale

| Token | Value |
|-------|-------|
| `sm` | 8 |
| `md` | 12 |
| `lg` | 16 |
| `xl` | 22 |
| `xxl` | 32 |
| `full` | 999 |

---

## 7. Motion Tokens

**File:** `constants/motion.ts`

| Token | Value | Use |
|-------|-------|-----|
| `micro` | 120ms | Button presses |
| `fast` | 200ms | Tab switches |
| `normal` | 300ms | Card opens |
| `slow` | 500ms | Page entries |
| `cinematic` | 800ms | Reveal entrances |
| `reveal` | 1200ms | Full reveal sequences |

Spring configs: `gentle`, `snappy`, `bouncy`

**Reduce Motion:** All animations must check `AccessibilityInfo.isReduceMotionEnabled`. Use `Motion.reduced.duration = 0`.

---

## 8. Shadows

| Token | Use |
|-------|-----|
| `Shadows.sm` | Cards in lists |
| `Shadows.md` | Featured cards |
| `Shadows.lg` | Modals, headers |
| `Shadows.gold` | CTA buttons, premium |
| `Shadows.goldLg` | Hero elements |

---

## 9. Signature Visual Elements

1. **Five-position formula strip** — circular nodes with planet colors + composite numbers
2. **Room header** — numbered room indicator + section label + title
3. **Journey progress bar** — 7-segment linear progress in sticky header
4. **Gold gradient CTA** — `Colors.gold → Colors.goldSoft`, horizontal
5. **Prototype badge** — warning-colored pill when `isMockData: true`

---

## 10. Component Inventory

| Component | File | Status |
|-----------|------|--------|
| `MirrorSigil` | `app/threshold.tsx` (inline) | V3 new |
| `ConstellationDot` | `app/reveal.tsx` (inline) | V3 new |
| `TriptychCard` | `app/first-mirror.tsx` (inline) | V3 new |
| `PositionNode` | `app/first-mirror.tsx` (inline) | V3 new |
| `RoomHeader` | `app/living-passport.tsx` (inline) | V3 new |
| `GlassCard` | `app/living-passport.tsx` (inline) | V3 new |
| `PositionCard` | `app/living-passport.tsx` (inline) | V3 new |
| `PracticeCard` | `app/living-passport.tsx` (inline) | V3 new |
| `JourneyProgress` | `app/living-passport.tsx` (inline) | V3 new |
| `LockedDepthCard` | `app/living-passport.tsx` (inline) | V3 new |
| `ProductCard` | `app/continuation.tsx` (inline) | V3 new |
| `ConstellationMap` | `components/brand/ConstellationMap.tsx` | V2 donor |
| `MirrorSymbol` | `components/brand/MirrorSymbol.tsx` | V1 donor |

---

## 11. Anti-patterns (do not use)

- `Colors.background` text on `Colors.background` (zero contrast)
- Purple without brand justification
- Gradient on every card
- Cards nested inside cards
- Every element in its own border
- Inline calculation logic in components
- Hardcoded prices in components
- `unlockPremium()` called from prototype CTA buttons
