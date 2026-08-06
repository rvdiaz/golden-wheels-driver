import { StyleSheet } from 'react-native';
import { theme } from './theme';

/**
 * Shared surfaces for anything sitting on the app's near-white gradient.
 *
 * A white card on a near-white background needs a visible edge, and the edge is
 * the border's job — not a shadow's. Definition comes from the outline; shadow
 * is held to the minimum that reads as "this floats", and only where something
 * genuinely overlays moving content. Spread these into a component's own style
 * rather than re-deriving borders per screen, which is how the surfaces drifted
 * apart in the first place.
 */
export const surfaces = StyleSheet.create({
  /**
   * Default card: content sitting directly on the surface. Border only — a card
   * that overlaps nothing has nothing to cast a shadow onto.
   */
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },

  /**
   * Floating chrome: the tab bar, and anything overlaying *scrolled* content.
   * The one case a border cannot carry alone — content slides underneath, so it
   * needs some depth to stay separate. The stronger border does most of the
   * work and the shadow is deliberately faint.
   */
  floating: {
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
});
