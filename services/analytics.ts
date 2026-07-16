
/**
 * Analytics Service — V3
 * Privacy-safe event tracking with allowlist.
 * No PII leaves the device.
 */

// ── Allowlist (only these keys may be sent in event payloads) ────────────────

const PAYLOAD_ALLOWLIST = new Set([
  'source',
  'position_key',
  'tab_id',
  'product_id',
  'section_id',
  'is_premium',
  'journey_step',
  'time_to_value_ms',
  'prototype_mode',
]);

// ── Event names ──────────────────────────────────────────────────────────────

export type AnalyticsEvent =
  | 'mirror_entry_viewed'
  | 'mirror_started'
  | 'birth_date_submitted'
  | 'reveal_started'
  | 'reveal_completed'
  | 'first_mirror_viewed'
  | 'first_mirror_recognition_seen'
  | 'first_mirror_triptych_seen'
  | 'first_mirror_positions_seen'
  | 'first_mirror_completed'
  | 'passport_opened'
  | 'passport_section_viewed'
  | 'position_opened'
  | 'deep_preview_viewed'
  | 'deep_cta_clicked'
  | 'continuation_product_selected'
  | 'telegram_continuation_clicked'
  | 'personal_myth_interest_clicked'
  | 'prototype_cta_clicked';

export type SafePayload = Partial<Record<typeof PAYLOAD_ALLOWLIST extends Set<infer T> ? T : never, string | number | boolean>>;

// ── Sanitizer ────────────────────────────────────────────────────────────────

function sanitizePayload(raw: Record<string, any>): SafePayload {
  const safe: SafePayload = {};
  for (const [k, v] of Object.entries(raw)) {
    if (PAYLOAD_ALLOWLIST.has(k)) {
      (safe as any)[k] = v;
    }
  }
  return safe;
}

// ── Analytics interface ──────────────────────────────────────────────────────

export interface AnalyticsAdapter {
  track(event: AnalyticsEvent, payload?: SafePayload): void;
}

// ── Console adapter (development / prototype) ────────────────────────────────

class ConsoleAnalyticsAdapter implements AnalyticsAdapter {
  track(event: AnalyticsEvent, payload?: SafePayload): void {
    if (__DEV__) {
      console.log(`[Analytics:V3] ${event}`, payload ?? {});
    }
  }
}

// ── Analytics service singleton ───────────────────────────────────────────────

class AnalyticsService {
  private adapter: AnalyticsAdapter = new ConsoleAnalyticsAdapter();
  private sessionStart = Date.now();

  setAdapter(adapter: AnalyticsAdapter) {
    this.adapter = adapter;
  }

  track(event: AnalyticsEvent, rawPayload?: Record<string, any>): void {
    const payload = rawPayload ? sanitizePayload(rawPayload) : undefined;
    this.adapter.track(event, payload);
  }

  timeToValueMs(): number {
    return Date.now() - this.sessionStart;
  }

  resetSessionClock(): void {
    this.sessionStart = Date.now();
  }
}

export const analytics = new AnalyticsService();
