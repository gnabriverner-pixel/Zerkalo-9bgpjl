# Data Contract V3 — Зеркало себя / Living Passport

**Status:** DONOR PROTOTYPE — NOT PRODUCTION  
**Version:** V3 · Palace Entry

---

## 1. Core Type: MirrorProfile

The single data object consumed by all V3 UI components.

```typescript
type MirrorProfile = {
  sessionId: string;
  provenance: {
    calculationVersion: string;
    interpretationSource: 'canonical' | 'practical' | 'artistic';
    isMockData: boolean;
  };
  identity: MirrorIdentity;
  recognition: RecognitionStatement;
  positions: PositionProfile[];
  synthesis: Synthesis;
  practices: Practice[];
  moneyPreview: MoneyPreview;
  continuation: ContinuationState;
};
```

**File:** `services/mirror-data.ts`

---

## 2. Identity

```typescript
type MirrorIdentity = {
  displayName?: string;          // optional, for personalization only
  dateOfBirth: string;           // "DD.MM.YYYY"
  grammaticalForm: 'masculine' | 'feminine' | 'neutral';
};
```

**PII note:** `displayName` and `dateOfBirth` MUST NOT be sent in analytics payloads.

---

## 3. RecognitionStatement (First Mirror)

```typescript
type RecognitionStatement = {
  headline: string;          // 2–4 lines, human pattern, NOT number meaning
  symbolicImage: string;     // threshold | mirror | route | room | bridge | source | rhythm
  triptych: InsightTriptych;
};

type InsightTriptych = {
  strength: string;   // 2–3 sentences
  tension: string;    // 2–3 sentences
  action: string;     // 2–3 sentences
};
```

The `headline` must describe a **human behavioral pattern**, not a numerological fact.

---

## 4. PositionProfile

```typescript
type PositionProfile = {
  key: 'soul' | 'expression' | 'path' | 'direction' | 'result';
  label: string;             // "Число Души"
  roleLabel: string;         // "Внутренняя природа"
  humanDescription: string;  // human meaning first
  planet: string;
  planetColor: string;
  finalNumber: number;
  compositeNumber: number;
  calculationChain: string;
  light: string;
  shadow: string;
  practicalOrient: string;
  isAuthorExtension?: boolean;
};
```

**Rule:** `humanDescription` always leads. `finalNumber` is secondary information.

---

## 5. Synthesis

```typescript
type Synthesis = {
  mainRoute: string;
  centralConflict: string;
  matureDirection: string;
  howOthersSeeYou: string;
  whereYouExpand: string;
};
```

---

## 6. Practices

```typescript
type Practice = {
  type: 'observation' | 'action' | 'recovery' | 'communication';
  typeLabel: string;
  title: string;
  body: string;
  planetColor: string;
};
```

**Disclaimer required:** all practices must be accompanied by the standard disclaimer text.

---

## 7. MoneyPreview

```typescript
type MoneyPreview = {
  positions: MoneyPreviewPosition[];
  vectorSummary: string;
};

type MoneyPreviewPosition = {
  positionIndex: number;
  label: string;
  number: number;
  planet: string;
  planetColor: string;
  description: string;
  isUnlocked: boolean;  // positions 1-2 free, 3-4 locked
};
```

**Legal:** Money section must show disclaimer. No financial promises.

---

## 8. ContinuationState

```typescript
type ContinuationState = {
  products: ContinuationProduct[];
  depthSections: DepthSection[];
};

type ContinuationProduct = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  includes: string[];
  priceConfigKey: string;  // key into PRICE_CONFIG, never hardcoded in component
};
```

**Price rule:** All prices resolved through `PRICE_CONFIG` object, never hardcoded in UI components.

---

## 9. PRICE_CONFIG

```typescript
export const PRICE_CONFIG: Record<string, string> = {
  auto_deep_report: '990 ₽',
  big_personal_research: '2 900 ₽',
  personal_myth: '1 490 ₽',
};
```

Change prices here only. Zero UI changes required.

---

## 10. Provenance slots

Every MirrorProfile carries provenance metadata:

| Field | Values | Meaning |
|-------|--------|---------|
| `calculationVersion` | `"v4.0"` | Engine version used |
| `interpretationSource` | `canonical` / `practical` / `artistic` | Text origin |
| `isMockData` | `boolean` | Must be visible in prototype UI |

---

## 11. Adapter interface

```typescript
interface MirrorProfileAdapter {
  buildFromSession(
    core: CoreNumbers,
    identity: MirrorIdentity,
    sessionId: string
  ): MirrorProfile;
}
```

`buildMirrorProfileFromSession()` in `services/mirror-data.ts` is the prototype adapter.  
Replace with real interpretation service in canonical backend.

---

## 12. What MUST NOT be in analytics payloads

- `displayName`
- `dateOfBirth`
- Full text of interpretations
- `headline`
- Raw number values tied to identity

See `services/analytics.ts` for the full allowlist.
