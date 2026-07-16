# Figma Transfer Spec V3 — Palace Entry / Living Passport

**Status:** DONOR PROTOTYPE · NOT PRODUCTION  
**Purpose:** Allow rapid recreation of editable Figma file from this prototype

---

## 1. Frame Map

| Frame Name | Route | Dimensions | Description |
|------------|-------|------------|-------------|
| `01-Threshold` | `/threshold` | 390×844 | Single entry screen with sigil |
| `02-DateEntry` | `/(tabs)/calculate` | 390×844 | DOB input form |
| `03-Reveal` | `/reveal` | 390×844 | Cinematic constellation sequence |
| `04-FirstMirror` | `/first-mirror` | 390×844 | Recognition-first result |
| `05-LivingPassport-R1` | `/living-passport` | 390×844 | Room 1: Formula |
| `05-LivingPassport-R2` | `/living-passport` | 390×3200 | Rooms 2–4: Positions/Conflict/Resource |
| `05-LivingPassport-R5` | `/living-passport` | 390×1200 | Room 5: Practices |
| `05-LivingPassport-R6` | `/living-passport` | 390×1200 | Room 6: Money |
| `05-LivingPassport-R7` | `/living-passport` | 390×1600 | Room 7: Depth + CTA |
| `06-Continuation` | `/continuation` | 390×844 | Product selection |
| `07-Continuation-Scroll` | `/continuation` | 390×2400 | Full continuation scroll |

---

## 2. Component Inventory

### Design system components

| Component | Variants | Props |
|-----------|---------|-------|
| `GoldButton` | Primary / Secondary / Disabled | label, icon, loading |
| `GoldButtonGradient` | Default | label, icon |
| `GlassCard` | Default / Accent | accent (color), padding |
| `RoomHeader` | Default | roomNumber, label, title |
| `JourneyProgress` | Default | current, total |
| `PositionCircle` | Default | number, composite, color |
| `PlanetChip` | Default | planet, color |
| `PrototypeBadge` | Default | — |
| `MockDataBadge` | Default | — |
| `SectionLabel` | Default | text, color |

### Page-specific components

| Component | Page | Variants |
|-----------|------|---------|
| `MirrorSigil` | Threshold | Animated (code) / Static (Figma) |
| `ConstellationReveal` | Reveal | 0–5 dots visible |
| `RecognitionCard` | First Mirror | Default |
| `TriptychCard` | First Mirror | strength / tension / action |
| `PositionNode` | First Mirror | Default |
| `PositionCard` | Living Passport | Collapsed / Expanded |
| `PracticeCard` | Living Passport | observation / action / recovery / communication |
| `MoneyPositionCard` | Living Passport | Unlocked / Locked |
| `LockedDepthCard` | Living Passport | Default |
| `PersonalMythBridge` | Living Passport / Continuation | Default |
| `ProductCard` | Continuation | Standard / Featured |

---

## 3. States Per Component

| Component | States |
|-----------|--------|
| `PositionCard` | Collapsed / Expanded |
| `ProductCard` | Default / Featured / Pressed |
| `GoldButton` | Default / Pressed / Disabled / Loading |
| `PositionCircle` | Default / Pulse (animation frame) |
| `JourneyProgress` | 0/7 through 7/7 |
| `MirrorSigil` | Static / Orbit-rotating |

---

## 4. Naming Convention

```
Frame: NN-ScreenName-State
  e.g., 04-FirstMirror-Default
        05-LivingPassport-R2-Expanded

Component: ComponentName/Variant/State
  e.g., PositionCard/Default/Collapsed
        ProductCard/Featured/Default
        GoldButton/Primary/Pressed

Color style: Semantics/Token
  e.g., Surfaces/Background
        Brand/Gold
        Planets/Venus
        Text/Primary

Text style: Scale/Weight
  e.g., Typography/Display/700
        Typography/Body/400
        Typography/Label/600
```

---

## 5. Prototype Connections

| From | Trigger | To |
|------|---------|-----|
| `01-Threshold` CTA tap | Click | `02-DateEntry` |
| `02-DateEntry` CTA tap | Click | `03-Reveal` |
| `03-Reveal` auto | Delay 4.2s | `04-FirstMirror` |
| `04-FirstMirror` primary CTA | Click | `05-LivingPassport-R1` |
| `04-FirstMirror` secondary | Click | `06-Continuation` |
| `05-LivingPassport-R7` CTA | Click | `06-Continuation` |
| `06-Continuation` close | Click | Back |

---

## 6. Color Styles to Create

```
Surfaces/Background       #090909
Surfaces/Surface          #141312
Surfaces/SurfaceDark      #0B0B0A
Surfaces/SurfaceAlt       #181614
Brand/Gold                #D8B36A
Brand/GoldSoft            #B99352
Brand/GoldGlow            rgba(216,179,106,0.10)
Brand/GoldTint            rgba(216,179,106,0.07)
Text/Primary              #F4EFE4
Text/Secondary            #C9C0AE
Text/Muted                #9A9183
Text/Disabled             #5A5448
Borders/Gold              rgba(212,174,104,0.22)
Borders/Light             rgba(255,255,255,0.06)
Planets/Venus             #C87A8A
Planets/Moon              #A8B8C8
Planets/Saturn            #6A6A7A
Planets/Mercury           #5A8A7A
Planets/Sun               #E8C040
Planets/Jupiter           #7A9858
Planets/Rahu              #6A5A8A
Planets/Ketu              #7A6A5A
Planets/Mars              #C86A5A
```

---

## 7. Text Styles to Create

```
Display/700     34px / 700 / 42px lineHeight / -0.5 tracking
Title/700       26px / 700 / 32px lineHeight / -0.3 tracking
Heading/600     20px / 600 / 26px lineHeight
Subheading/600  16px / 600 / 22px lineHeight
Body/400        16px / 400 / 26px lineHeight
BodySm/400      14px / 400 / 22px lineHeight
Caption/400     12px / 400 / 18px lineHeight / 0.2 tracking
Label/600       11px / 600 / 16px lineHeight / 1.2 tracking
Button/600      15px / 600 / 20px lineHeight / 0.3 tracking
Mono/400        12px / 400 / 18px lineHeight / monospace / 0.5 tracking
```

---

## 8. Motion Specs for Prototype

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Screen enter | 500ms | Ease-out-expo |
| Card expand | 300ms | Spring (tension 80, friction 10) |
| CTA press | 120ms | Linear |
| Stagger items | 80ms per item | Ease-out |
| Reveal sequence | 4200ms | Keyframe sequence |

---

## 9. Asset References

| Asset | Type | Source |
|-------|------|--------|
| `onboarding-hero.png` | Image | `assets/images/` |
| Mirror sigil | SVG/Code | `app/threshold.tsx` inline |
| Constellation map | SVG/Code | `components/brand/ConstellationMap.tsx` |
| Motion: Mirror Opens | HTML | `motion/palace-entry-v3/mirror-opens.html` |
| Motion: Five Lights | HTML | `motion/palace-entry-v3/five-lights.html` |
