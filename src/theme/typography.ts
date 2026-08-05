/**
 * Type scale for the driver app.
 *
 * Sizes run a notch larger than a typical consumer app on purpose: a driver
 * reads this at arm's length, in daylight, often mid-manoeuvre. Anything a
 * driver acts on — status, addresses, the customer's name, the primary CTA —
 * should be `md` or above.
 */
export const typography = {
  /** Badges and counters only. Never body copy. */
  xxs: 12,
  /** Field labels, timestamps, secondary metadata. */
  xs: 13,
  /** Supporting copy. */
  sm: 15,
  /** Default body. */
  md: 16,
  /** Emphasised body — addresses, names, list titles. */
  lg: 18,
  /** Section and card titles. */
  xl: 20,
  /** Screen titles. */
  xxl: 24,
  /** The one number that matters on screen (earnings, current status). */
  display: 30,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
