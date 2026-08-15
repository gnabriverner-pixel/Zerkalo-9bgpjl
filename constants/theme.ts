// Зеркало себя — Lovable Visual Canon v3
// Physical metaphor: Deep cosmic chamber · Material: matte glass + ancient gold foil · Depth: layered luminescence

export const Colors = {
  // ── Surfaces ──────────────────────────────────────────────────────────
  background: '#090D15',        // Deep cosmic blue-graphite canvas
  surface: '#0F141F',           // Matte glass card surface
  surfaceAlt: '#111620',        // Alternate card
  surfaceElevated: '#161C2A',   // Elevated element
  surfaceDark: '#060A10',       // Near-black for hero sections
  surfaceMid: '#131926',        // Mid graphite-blue

  // ── Brand ─────────────────────────────────────────────────────────────
  gold: '#C8A45D',              // Antique warm gold — primary accent
  goldSoft: '#E8D39E',          // Light warm gold — secondary
  goldDim: 'rgba(200,164,93,0.22)',  // Dim gold — borders
  goldGlow: 'rgba(200,164,93,0.12)', // Veil / glow layer
  goldTint: 'rgba(200,164,93,0.07)', // Very subtle tint

  // ── Text ──────────────────────────────────────────────────────────────
  textPrimary: '#F0EAD8',       // Ivory — primary text
  textSecondary: '#C2B89A',     // Muted ivory — secondary
  textMuted: '#8A8272',         // Muted — captions/labels
  textDisabled: '#50493C',      // Disabled state
  textLight: '#F0EAD8',         // Alias for dark-bg text
  textLightMuted: '#C2B89A',    // Alias for dark-bg secondary

  // ── Borders ───────────────────────────────────────────────────────────
  border: 'rgba(200,164,93,0.22)',        // Gold border
  borderLight: 'rgba(255,255,255,0.06)',  // Subtle white border
  borderCard: 'rgba(255,255,255,0.04)',   // Card dividers

  // ── Semantic ──────────────────────────────────────────────────────────
  success: '#3A6A4A',
  warning: '#9A7030',
  error: '#7A2A2A',
  overlay: 'rgba(6,10,16,0.85)',

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

  // ── Myth lens ─────────────────────────────────────────────────────────
  mythPrimary: '#8A6AAA',       // Purple — myth / personal myth orb
  mythGlow: 'rgba(138,106,170,0.12)',
  mythDim: 'rgba(138,106,170,0.22)',
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
  // Lovable editorial fonts
  serif: {
    // Cormorant Garamond — for display/titles
    // Falls back to Georgia/serif if font not loaded
    fontSize: 32,
    fontWeight: '400' as const,
    lineHeight: 40,
    letterSpacing: 0.2,
    fontFamily: 'CormorantGaramond-Regular' as any,
  },
  serifMedium: {
    fontSize: 24,
    fontWeight: '500' as const,
    lineHeight: 32,
    letterSpacing: 0.1,
    fontFamily: 'CormorantGaramond-Medium' as any,
  },
  sansUI: {
    // Manrope — for interface labels/body
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 22,
    fontFamily: 'Manrope-Regular' as any,
  },
  sansSemiBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    fontFamily: 'Manrope-SemiBold' as any,
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  gold: {
    shadowColor: '#C8A45D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
  },
  goldLg: {
    shadowColor: '#C8A45D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 6,
  },
  myth: {
    shadowColor: '#8A6AAA',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 5,
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
