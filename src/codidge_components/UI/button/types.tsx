export enum ButtonSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
  XLARGE = 'xlg',
  XXLARGE = 'xxlg',
  XXXLARGE = 'xxxlg',
}

export const sizeStyles = {
  [ButtonSize.SMALL]: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 12 },
  [ButtonSize.MEDIUM]: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 12 },
  [ButtonSize.LARGE]: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 14 },
  [ButtonSize.XLARGE]: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16 },
  [ButtonSize.XXLARGE]: { paddingVertical: 16, paddingHorizontal: 28, fontSize: 18 },
  [ButtonSize.XXXLARGE]: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 20 },
};
