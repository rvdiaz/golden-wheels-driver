export enum ButtonSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
}
export const sizeStyles = {
  [ButtonSize.SMALL]: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 12 },
  [ButtonSize.MEDIUM]: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 12 },
  [ButtonSize.LARGE]: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 14 },
};
