# Analytics Contract V3 — Зеркало себя

**Status:** DONOR PROTOTYPE · NOT PRODUCTION  
**Version:** V3 · Palace Entry

---

## 1. Privacy-Safe Event Tracking

**File:** `services/analytics.ts`

All events use a strict payload **allowlist**. No PII leaves the device.

### Payload Allowlist

```
source, position_key, tab_id, product_id, section_id,
is_premium, journey_step, time_to_value_ms, prototype_mode
```

**NEVER in payloads:**
- `displayName`, `dateOfBirth`, `email`
- Full interpretation text
- `headline`, `recognition`
- Raw identity numbers tied to specific person

---

## 2. Event Catalog

### Entry funnel

| Event | Trigger | Key payload |
|-------|---------|-------------|
| `mirror_entry_viewed` | Threshold screen appears | — |
| `mirror_started` | Tap "Открыть первое зеркало" | — |
| `birth_date_submitted` | Date accepted, calc started | — |
| `reveal_started` | Reveal sequence begins | — |
| `reveal_completed` | Auto-navigate to First Mirror | — |

### First Mirror

| Event | Trigger | Key payload |
|-------|---------|-------------|
| `first_mirror_viewed` | Screen appears | `time_to_value_ms`, `prototype_mode` |
| `first_mirror_recognition_seen` | Scroll > 100px | — |
| `first_mirror_triptych_seen` | Scroll > 380px | — |
| `first_mirror_positions_seen` | Scroll > 700px | — |
| `first_mirror_completed` | Tap primary CTA | `source` |

### Passport

| Event | Trigger | Key payload |
|-------|---------|-------------|
| `passport_opened` | Living Passport appears | — |
| `passport_section_viewed` | Room changes | `journey_step` (0–6) |
| `position_opened` | PositionCard expanded | `position_key` |

### Conversion

| Event | Trigger | Key payload |
|-------|---------|-------------|
| `deep_preview_viewed` | Continuation screen appears | — |
| `deep_cta_clicked` | Deep CTA tapped | `source` |
| `continuation_product_selected` | Product card tapped | `product_id` |
| `telegram_continuation_clicked` | Telegram CTA tapped | `source` |
| `personal_myth_interest_clicked` | Myth bridge tapped | — |
| `prototype_cta_clicked` | Any prototype purchase CTA | — |

---

## 3. Key Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| First Mirror activation | `first_mirror_viewed / mirror_started` | > 80% |
| First Mirror completion | `first_mirror_completed / first_mirror_viewed` | > 60% |
| Passport continuation | `passport_opened / first_mirror_completed` | > 70% |
| Qualified continuation | `deep_cta_clicked / first_mirror_completed` | > 25% |
| Time to first value | `time_to_value_ms` at `first_mirror_recognition_seen` | < 20s |

---

## 4. UX Quality Thresholds

| Threshold | Target |
|-----------|--------|
| First recognition phrase | ≤ 20 seconds from entry |
| Actions to First Mirror | ≤ 3 |
| First Mirror read time | 60–90 seconds |
| No required registration before result | Yes |
| One primary CTA per viewport | Yes |

---

## 5. Implementation Notes

Current adapter: `ConsoleAnalyticsAdapter` (logs to dev console only).

To connect real analytics:

```typescript
import { analytics } from '@/services/analytics';
analytics.setAdapter(new MyRealAnalyticsAdapter());
```

`AnalyticsAdapter` interface:
```typescript
interface AnalyticsAdapter {
  track(event: AnalyticsEvent, payload?: SafePayload): void;
}
```

Do NOT:
- Send full `MirrorProfile` to analytics
- Send `identity.dateOfBirth` or `identity.displayName`
- Log raw formula numbers tied to identifiable sessions
