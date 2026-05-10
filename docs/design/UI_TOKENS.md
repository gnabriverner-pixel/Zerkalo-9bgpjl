# Зеркало себя — UI Tokens v1

## Colors

### Surfaces
```
background-primary:   #090909
background-secondary: #0B0B0A
background-card:      #141312
background-card-alt:  #181614
background-elevated:  #1E1C18
```

### Brand
```
gold-primary:         #D8B36A
gold-soft:            #B99352
gold-dim:             rgba(216, 179, 106, 0.35)
gold-glow:            rgba(216, 179, 106, 0.12)
```

### Text
```
ivory-primary:        #F4EFE4
ivory-secondary:      #C9C0AE
text-muted:           #9A9183
text-disabled:        #5A5448
```

### Borders
```
border-gold:          rgba(212, 174, 104, 0.22)
border-subtle:        rgba(255, 255, 255, 0.06)
border-card:          rgba(255, 255, 255, 0.04)
```

### Planet colors (number mapping)
```
1 - Солнце:    #E8C040
2 - Луна:      #A8B8C8
3 - Юпитер:    #7A9858
4 - Раху:      #6A5A8A
5 - Меркурий:  #5A8A7A
6 - Венера:    #C87A8A
7 - Кету:      #7A6A5A
8 - Сатурн:    #6A6A7A
9 - Марс:      #C86A5A
```

### Semantic
```
success:   #4A7A5A
warning:   #A87840
error:     #8A3A3A
```

---

## Typography

### Scale
```
display:    36px / 700 / -0.5 letterSpacing / serif
title:      26px / 700 / -0.3 / serif or heavy sans
heading:    20px / 600 / serif
subheading: 16px / 600 / sans
body:       16px / 400 / sans / lineHeight 26
bodySmall:  14px / 400 / sans / lineHeight 22
caption:    12px / 400 / sans / 0.2 letterSpacing
label:      11px / 600 / sans / 1.2 letterSpacing / uppercase
button:     15px / 600 / sans / 0.3 letterSpacing
monospace:  12px / 400 / monospace (chains, formulas)
```

### Hierarchy rule
- Numbers in formulas: large serif display, gold or planet color
- Section headers: ivory, medium serif
- Body copy: ivory-secondary, clean sans
- Labels/metadata: text-muted, uppercase label

---

## Spacing

```
unit:    8px
xs:      4px   (0.5×)
sm:      8px   (1×)
md:      16px  (2×)
lg:      24px  (3×)
xl:      32px  (4×)
xxl:     48px  (6×)
xxxl:    64px  (8×)
```

### Screen anatomy
```
horizontal-padding:  24px
card-padding:        18–24px
section-gap:         28–40px
bottom-nav-offset:   64–88px
status-bar-offset:   safe-area-inset-top
```

---

## Components dimensions

```
button-height:       56px
button-radius:       14px
button-font:         15px / 600

card-radius:         16–22px
card-border:         1px border-gold

input-height:        56px
input-radius:        12px
input-font:          18px (DOB input), 16px (other)

mirror-oval:         width 240, height 300, radius 50%
orbit-ring-stroke:   1px gold-dim
number-circle-sm:    44px
number-circle-lg:    64px
number-circle-xl:    80px
```

---

## Shadows / Effects

```
card-shadow:   none (use border + background)
glow-subtle:   box-shadow: 0 0 40px rgba(216,179,106,0.08)
glow-mirror:   radial gradient inner glow inside oval
overlay:       rgba(9,9,9,0.75)
```

Rule: Минимум теней. Глубина достигается через разницу фонов и тонкие бордюры.

---

## Animations

```
transition-base:    200ms ease
transition-slow:    400ms ease
transition-spring:  300ms cubic-bezier(0.34,1.56,0.64,1)
```

Rule: Только функциональные переходы. Без декоративных loop-анимаций.
