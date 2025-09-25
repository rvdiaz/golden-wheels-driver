export const theme = {
  colors: {
    primary: '#4F46E5', // Indigo-600
    accent: '#EA580C',
    primaryText: '#FFFFFF',
    secondary: '#F3F4F6',
    secondaryText: '#374151',
    textColor: '#0A0A0A',
    danger: '#DC2626',
    dangerText: '#FFFFFF',
    primaryGradient: ['#4F46E5', '#4F46E5'] as const,
    headerBackground: '#1D0D66',
    bodyBackground: '#FFF',
    menuItemActive: '#312E81',
    menuItemInactive: '#64748B',
    headerModal: '#EEF2FF',
    headerModalText: '#3730A3',
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
