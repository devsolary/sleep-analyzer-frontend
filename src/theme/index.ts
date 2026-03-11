// ─────────────────────────────────────────────────────────────────────────────
// Theme  –  Sleep Analyzer Design System
// ─────────────────────────────────────────────────────────────────────────────

export const Colors = {
  // Brand palette — deep indigo night sky
  primary:       '#6C63FF',
  primaryLight:  '#9B94FF',
  primaryDark:   '#4A44CC',

  secondary:     '#38BDF8',
  accent:        '#FB923C',

  // Sleep stage colors
  stage: {
    awake: '#F87171',
    light: '#60A5FA',
    deep:  '#818CF8',
    rem:   '#34D399',
  },

  // Mood colors
  mood: {
    terrible: '#EF4444',
    poor:     '#F97316',
    fair:     '#FBBF24',
    good:     '#4ADE80',
    excellent:'#22D3EE',
  },

  // Neutrals
  background:    '#0D0F1A',
  surface:       '#161929',
  surfaceLight:  '#1E2235',
  border:        '#2A2F4A',

  text:          '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted:     '#475569',

  success: '#22C55E',
  warning: '#F59E0B',
  error:   '#EF4444',
  info:    '#3B82F6',

  white: '#FFFFFF',
  black: '#000000',
};

export const Typography = {
  // Display font: use Sora (install via expo-font)
  fontDisplay: 'Sora_700Bold',
  fontSemiBold:'Sora_600SemiBold',
  fontMedium:  'Sora_500Medium',
  fontBody:    'Sora_400Regular',

  size: {
    xs:   11,
    sm:   13,
    md:   15,
    lg:   17,
    xl:   20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  lineHeight: {
    tight:  1.2,
    normal: 1.5,
    loose:  1.8,
  },
};

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

export const BorderRadius = {
  sm:   6,
  md:   12,
  lg:   18,
  xl:   24,
  full: 9999,
};

export const Shadow = {
  soft: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  glow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
};