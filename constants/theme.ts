/**
 * InterviewOS Brand Theme
 * Inspired by MIMO — friendly, fun, gamified learning.
 */

// ─── Brand Colors ────────────────────────────────────────────────
export const Colors = {
  // Primary palette
  primary: "#6C5CE7", // Vibrant Purple — trust, learning, growth
  primaryLight: "#A29BFE",
  primaryDark: "#5A4BD1",

  // Secondary
  secondary: "#FF9F43", // Bright Orange — energy, engagement, warmth
  secondaryLight: "#FECA57",
  secondaryDark: "#E88B2D",

  // Accent
  accent: "#00B894", // Teal — success, achievement, flow
  accentLight: "#55EFC4",
  accentDark: "#00A381",

  // Score colors
  scoreHigh: "#00B894", // 8+  — teal
  scoreMid: "#FF9F43", // 6-7 — orange
  scoreLow: "#FF6B6B", // <6  — warm red

  // Recording
  recordButton: "#FF9F43",
  stopButton: "#FF6B6B",

  // Neutrals
  white: "#FFFFFF",
  background: "#F8F7FC", // clean light lavender
  surface: "#FFFFFF",
  border: "#DDD8EE",
  borderLight: "#EEEAF7",

  // Text
  textPrimary: "#2D3436", // clean near-black — friendly, readable
  textSecondary: "#636E72",
  textMuted: "#B2BEC3",
  textOnPrimary: "#FFFFFF",
  textOnSecondary: "#FFFFFF",

  // Gradients (use as array for LinearGradient)
  gradientPurple: ["#F3E7FF", "#E8DCFF"] as const,
  gradientRecording: ["#F3E7FF", "#E8DCFF"] as const,
  gradientProgress: ["#FF9F43", "#00B894"] as const,

  // Tab bar
  tabBarBackground: "#FFFFFF",
  tabBarActive: "#6C5CE7",
  tabBarInactive: "#B2BEC3",
};

// ─── Domain Theme ────────────────────────────────────────────────
export const DomainColors = {
  tech: {
    color: "#6C5CE7",
    bg: "#F3E7FF",
    icon: "💻",
  },
  finance: {
    color: "#FF9F43",
    bg: "#FFF3E0",
    icon: "📊",
  },
  law: {
    color: "#00B894",
    bg: "#E0FFF4",
    icon: "⚖️",
  },
} as const;

// ─── Typography ──────────────────────────────────────────────────
export const Typography = {
  hero: {
    fontSize: 34,
    fontWeight: "800" as const,
    color: Colors.textPrimary,
  },
  h1: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    fontWeight: "400" as const,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.textMuted,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
};

// ─── Spacing ─────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// ─── Border Radius ───────────────────────────────────────────────
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

// ─── Shadows ─────────────────────────────────────────────────────
export const Shadows = {
  sm: {
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

// ─── Score Helpers ───────────────────────────────────────────────
export function getScoreColor(score: number) {
  if (score >= 8) return Colors.scoreHigh;
  if (score >= 6) return Colors.scoreMid;
  return Colors.scoreLow;
}

export function getScoreLabel(score: number) {
  if (score >= 8) return "Excellent";
  if (score >= 6) return "Good";
  return "Needs Work";
}

export function getScoreBg(score: number) {
  if (score >= 8) return "#E0FFF4";
  if (score >= 6) return "#FFF3E0";
  return "#FFE0E0";
}