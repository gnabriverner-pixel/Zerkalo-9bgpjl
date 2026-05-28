// Зеркало себя — Dark Premium Design System v2
// Physical metaphor: Sealed document · Material: matte graphite + gold foil · Depth: border-layered

export const Colors = {
  // ── Surfaces ──────────────────────────────────────────────────────────
  background: '#090909',        // Deepest black — main bg
  surface: '#141312',           // Dark card surface
  surfaceAlt: '#181614',        // Alternate card
  surfaceElevated: '#1E1C18',   // Elevated element
  surfaceDark: '#0B0B0A',       // Near-black for hero sections
  surfaceMid: '#1C1A16',        // Mid graphite

  // ── Brand ─────────────────────────────────────────────────────────────
  gold: '#D8B36A',              // Warm gold — primary accent
  goldLight: '#E7C987',         // Light gold — readable highlight on dark bg
  goldSoft: '#B99352',          // Softer gold — secondary
  goldDim: 'rgba(216,179,106,0.35)', // Dim gold — borders
  goldGlow: 'rgba(216,179,106,0.10)', // Glow layer
  goldTint: 'rgba(216,179,106,0.07)', // Very subtle tint

  // ── Text ──────────────────────────────────────────────────────────────
  textPrimary: '#F4EFE4',       // Ivory — primary text
  textSecondary: '#C9C0AE',     // Muted ivory — secondary
  textMuted: '#9A9183',         // Muted — captions/labels
  textDisabled: '#5A5448',      // Disabled state
  textLight: '#F4EFE4',         // Alias for dark-bg text
  textLightMuted: '#C9C0AE',    // Alias for dark-bg secondary

  // ── Borders ───────────────────────────────────────────────────────────
  border: 'rgba(212,174,104,0.22)',       // Gold border
  borderLight: 'rgba(255,255,255,0.06)',  // Subtle white border
  borderCard: 'rgba(255,255,255,0.04)',   // Card dividers

  // ── Semantic ──────────────────────────────────────────────────────────
  success: '#4A7A5A',
  warning: '#A87840',
  error: '#8A3A3A',
  overlay: 'rgba(9,9,9,0.80)',

  // ── Planet colors (number → planet) ───────────────────────────────────
  sun: '#E8C040',       // 1 — Солнце
  moon: '#A8B8C8',      // 2 — Луна
  jupiter: '#7A9858',   // 3 — Юпитер
  rahu: '#6A5A8A',      // 4 — Раху (indigo)
  mercury: '#5A8A7A',   // 5 — Меркурий
  venus: '#C87A8A',     // 6 — Венера
  ketu: '#7A6A5A',      // 7 — Кету
  saturn: '#6A6A7A',    // 8 — Сатурн
  mars: '#C86A5A',      // 9 — Марс
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 32,
  full: 999,
};

export const Typography = {
  display: {
    fontSize: 34,
    fontWeight: '700' as const,
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 26,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 1.2,
  },
  button: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  mono: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
    fontFamily: 'monospace' as const,
    letterSpacing: 0.5,
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  gold: {
    shadowColor: '#D8B36A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  goldLg: {
    shadowColor: '#D8B36A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 6,
  },
};

export const PLANET_NAMES: Record<number, string> = {
  1: 'Солнце',
  2: 'Луна',
  3: 'Юпитер',
  4: 'Раху',
  5: 'Меркурий',
  6: 'Венера',
  7: 'Кету',
  8: 'Сатурн',
  9: 'Марс',
};

export const PLANET_COLORS: Record<number, string> = {
  1: Colors.sun,
  2: Colors.moon,
  3: Colors.jupiter,
  4: Colors.rahu,
  5: Colors.mercury,
  6: Colors.venus,
  7: Colors.ketu,
  8: Colors.saturn,
  9: Colors.mars,
};
