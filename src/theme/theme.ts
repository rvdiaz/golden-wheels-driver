export const theme = {
  colors: {
    primary: '#D4A843', // gold — fills, borders, icons, active states
    /**
     * Gold for TEXT. The brand gold is only 2.2:1 on white, so anything set in
     * `primary` reads as washed out and half-disabled. This is the darkest
     * on-brand gold that still clears 4.5:1 on both white cards and the gold
     * surface wash. Use `primary` for anything filled, this for anything read.
     */
    primaryTextAccent: '#8A6716',
    primaryDark: '#9A7322',
    primaryAlpha: {
      5: 'rgba(212,168,67,0.05)',
      10: 'rgba(212,168,67,0.10)',
      20: 'rgba(212,168,67,0.20)',
      35: 'rgba(212,168,67,0.35)',
      50: 'rgba(212,168,67,0.50)',
    },
    accent: '#EA580C',
    primaryText: '#111827',
    secondary: '#F3F4F6',
    secondaryText: '#374151',
    textColor: '#5F6672',
    danger: '#DC2626',
    dangerText: '#FFFFFF',
    primaryGradient: ['#D4A843', '#B8902E'] as const,
    headerBackground: '#FFFFFF',
    bodyBackground: '#F8F9FA',
    primaryBodyBackground: '#FDF8EE',
    // Surface wash rendered by BodyWrapper: a warm gold tint at the top that
    // resolves into bodyBackground before content starts, so card and text
    // contrast is unaffected.
    gradientTop: '#FDF3DE',
    gradientMid: '#FDF8EE',
    surfaceSectionsBackgroundColor: '#FFFFFF',
    menuItemActive: '#D4A843',
    menuItemInactive: '#6B7280',
    headerModal: '#FDF8EE',
    headerModalText: '#92400E',
    success: '#16A34A',
    borderNeutralColor: '#E5E7EB',
    info: '#3B82F6',
    baseGray: '#F5F5F5',
    errorText: '#EF4444',
    // light-theme surface colours used in cards/bars
    cardBackground: '#FFFFFF',
    cardBorder: '#DDE2E9',
    /**
     * For edges that must stay legible against the near-white surface —
     * dividers, the tab bar, anything that would otherwise dissolve into the
     * background. cardBorder alone is too faint on white-on-white.
     */
    borderStrong: '#CBD2DB',
    shadowColor: '#0B1220',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 14,
    xl: 20,
    xxl: 24,
    full: 9999,
  },
} as const;
