# Зеркало себя — Components v1

## Component inventory

### Foundation
- `AppShell` — root wrapper with safe areas, dark bg
- `ScreenContainer` — scrollable screen wrapper
- `LegalMicrocopy` — bottom disclaimer line

### Brand
- `MirrorSymbol` — SVG oval + orbit rings + number sigils
- `BrandWordmark` — «Зеркало себя» + author line

### Input
- `DateInputForm` — DD/MM/YYYY date picker with large serif display
- `NameInput` — optional text input
- `GenderPicker` — pill chips
- `CollapsibleFields` — expandable optional fields

### Result
- `ResultHeader` — dark card with name, DOB, formula, composites
- `FormulaDisplay` — large numbers with dashes, color-coded
- `CompositeHint` — italic composites row under formula
- `NumberCard` — circle + label + planet + chain + light/tension/orientation
- `NumberCircle` — planet-colored circle with final + composite
- `ChainRow` — monospace calculation chain display
- `PassportRow` — horizontal row in passport tab
- `SynthesisBlock` — key vector + bullets

### Premium
- `LockedBlock` — gold border card with lock icon and CTA
- `PremiumCTAButton` — full-width gold button with price
- `BigResearchCard` — dark hero card for paywall
- `IncludesList` — bullet list of what's included
- `TrustSignals` — verified rows (author, no subscription, etc.)
- `FormulaBox` — formula + composites in dark bordered box

### Modules (quick access)
- `ModuleShortcut` — icon + label tile (Матрица / Циклы / Деньги)
- `ModuleRow` — list row with icon, title, description, chevron

### Navigation
- `TabBar` — bottom navigation (Главная / Расчёт / Разборы / Профиль)
- `ResultTabs` — Паспорт / Числа / Синтез / Глубина
- `BackButton` — simple arrow + optional title

### Feedback
- `LoadingState` — centered spinner with label
- `ErrorState` — icon + message + retry button
- `EmptyState` — icon + title + body + CTA

---

## Design rules per component

### MirrorSymbol
- SVG-based oval, ratio ~4:5
- Tонкие орбитальные эллипсы вокруг
- 5–9 маленьких точек / сиглов по орбитам
- Subtle inner glow: rgba(216,179,106,0.08)
- NO heavy shadows, NO gradients inside oval
- Работает на dark bg только

### NumberCard
- Width: 100% (full card)
- Left: NumberCircle (64px, planet color)
- Right: label, internal label, planet, chain
- Bottom sections: light (colored bg) + tension (neutral) + orientation (gold tint)
- Card border: 1px rgba(D8B36A, 0.22)

### LockedBlock
- Border: 1.5px gold + 40% opacity
- Background: gold 6% opacity
- Lock icon: MaterialIcons, gold
- Title: gold, medium weight
- CTA inside: gold button, dark text

### PremiumCTAButton
- Height: 56px
- Background: #D8B36A (gold)
- Text: #090909 (black), 700 weight, 16px
- Price: right side, larger 18px bold
- Border radius: 14px
- Shadow: subtle gold glow

### DateInputForm
- DOB field: 34–40px serif, gold when filled, ivory placeholder
- Under border: 2px, changes to gold when filled
- Helper text: shows progress (день / месяц / год)
- Validation: red border + icon on error

---

## Accessibility

- All interactive elements: min hitSlop 44×44
- Text contrast: ≥4.5:1 on dark backgrounds
- Inputs: accessibilityLabel required
- Buttons: accessibilityHint where useful
- Error states: color + icon + text (never color alone)
