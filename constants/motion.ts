/**
 * Motion tokens — V3
 * Centralized animation configuration.
 * All components reference these values.
 * Reduce Motion: check Platform.isTV or AccessibilityInfo.isReduceMotionEnabled.
 */

export const Motion = {
  // Durations (ms)
  micro: 120,
  fast: 200,
  normal: 300,
  slow: 500,
  cinematic: 800,
  reveal: 1200,

  // Spring configs
  spring: {
    gentle: { tension: 50, friction: 12 },
    snappy: { tension: 80, friction: 10 },
    bouncy: { tension: 100, friction: 8 },
  },

  // Stagger delays (ms)
  stagger: {
    xs: 40,
    sm: 80,
    md: 120,
    lg: 180,
  },

  // Easing
  ease: {
    in: [0.4, 0, 1, 1],
    out: [0, 0, 0.2, 1],
    inOut: [0.4, 0, 0.2, 1],
    reveal: [0.16, 1, 0.3, 1], // ease-out-expo
  },

  // Reduce motion safe values
  reduced: {
    duration: 0,
    stagger: 0,
  },
};
