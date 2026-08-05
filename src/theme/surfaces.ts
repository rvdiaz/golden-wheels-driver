import { StyleSheet } from 'react-native';
import { theme } from './theme';

/**
 * Shared elevation for anything sitting on the app's near-white gradient.
 *
 * A white card on a near-white background needs a visible edge and a real
 * shadow or it dissolves. These are the two levels used across the app — spread
 * them into a component's own style rather than re-deriving borders and shadows
 * per screen, which is how the surfaces drifted apart in the first place.
 */
export const surfaces = StyleSheet.create({
  /** Default card: content sitting directly on the surface. */
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  /** Floating chrome: the tab bar and anything overlaying scrolled content. */
  floating: {
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 12,
  },
});
