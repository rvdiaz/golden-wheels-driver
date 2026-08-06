import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ShimmerPlaceholder } from '~/codidge_components/UI/skeleton/shimmerPlaceholder';
import { theme } from '~/theme/theme';
import { surfaces } from '~/theme/surfaces';

/**
 * Skeletons rather than a bare spinner on the two list screens: both render a
 * known layout (a hero plus a list), so showing that layout's shape while it
 * loads tells the driver what is coming instead of leaving the screen blank.
 */

/** The earnings balance hero. */
export const BalanceCardSkeleton = () => (
  <View style={styles.heroCard}>
    <ShimmerPlaceholder width={110} height={11} borderRadius={theme.borderRadius.sm} />
    <ShimmerPlaceholder
      width={170}
      height={32}
      borderRadius={theme.borderRadius.sm}
      style={styles.heroAmount}
    />
    <View style={styles.heroDivider} />
    <View style={styles.heroStats}>
      <View style={styles.heroStat}>
        <ShimmerPlaceholder width={70} height={10} borderRadius={theme.borderRadius.sm} />
        <ShimmerPlaceholder width={90} height={15} borderRadius={theme.borderRadius.sm} />
      </View>
      <View style={styles.heroStat}>
        <ShimmerPlaceholder width={70} height={10} borderRadius={theme.borderRadius.sm} />
        <ShimmerPlaceholder width={90} height={15} borderRadius={theme.borderRadius.sm} />
      </View>
    </View>
  </View>
);

/**
 * Rows that mimic the ledger card — one continuous fill with only the ends
 * rounded, so the skeleton and the loaded list occupy the same shape.
 */
export const LedgerListSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <View>
    {Array.from({ length: rows }).map((_, i) => (
      <View
        key={i}
        style={[
          styles.ledgerRow,
          i === 0 && styles.ledgerRowFirst,
          i === rows - 1 && styles.ledgerRowLast,
        ]}>
        <ShimmerPlaceholder width={32} height={32} borderRadius={theme.borderRadius.lg} />
        <View style={styles.ledgerText}>
          <ShimmerPlaceholder width={'55%'} height={13} borderRadius={theme.borderRadius.sm} />
          <ShimmerPlaceholder width={'35%'} height={10} borderRadius={theme.borderRadius.sm} />
        </View>
        <ShimmerPlaceholder width={62} height={14} borderRadius={theme.borderRadius.sm} />
      </View>
    ))}
  </View>
);

/**
 * The dashboard's compact rows. Narrower than the trip list's cards because the
 * dashboard stacks rows under the availability card, and a skeleton that does
 * not match the shape it replaces makes the screen jump when data lands.
 */
export const TripRowListSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <View style={styles.rowList}>
    {Array.from({ length: rows }).map((_, i) => (
      <View key={i} style={styles.tripRow}>
        <ShimmerPlaceholder width={34} height={34} borderRadius={theme.borderRadius.lg} />
        <View style={styles.tripRowText}>
          <ShimmerPlaceholder width={'58%'} height={13} borderRadius={theme.borderRadius.sm} />
          <ShimmerPlaceholder width={'40%'} height={10} borderRadius={theme.borderRadius.sm} />
        </View>
        <View style={styles.tripRowEnd}>
          <ShimmerPlaceholder width={44} height={9} borderRadius={theme.borderRadius.sm} />
          <ShimmerPlaceholder width={58} height={14} borderRadius={theme.borderRadius.sm} />
        </View>
      </View>
    ))}
  </View>
);

/** Standalone cards, matching the trip list. */
export const TripListSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <View style={styles.tripList}>
    {Array.from({ length: rows }).map((_, i) => (
      <View key={i} style={styles.tripCard}>
        <View style={styles.tripHeader}>
          <ShimmerPlaceholder width={96} height={13} borderRadius={theme.borderRadius.sm} />
          <ShimmerPlaceholder width={72} height={20} borderRadius={theme.borderRadius.full} />
        </View>
        <ShimmerPlaceholder width={'82%'} height={12} borderRadius={theme.borderRadius.sm} />
        <ShimmerPlaceholder width={'64%'} height={12} borderRadius={theme.borderRadius.sm} />
        <View style={styles.tripDivider} />
        <View style={styles.tripFooter}>
          <ShimmerPlaceholder width={110} height={11} borderRadius={theme.borderRadius.sm} />
          <ShimmerPlaceholder width={64} height={15} borderRadius={theme.borderRadius.sm} />
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  heroCard: {
    ...surfaces.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  heroAmount: { marginTop: 8 },
  heroDivider: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
    marginVertical: theme.spacing.md,
  },
  heroStats: { flexDirection: 'row' },
  heroStat: { flex: 1, gap: 6 },

  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.cardBackground,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  ledgerRowFirst: {
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  ledgerRowLast: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
  },
  ledgerText: { flex: 1, gap: 6 },

  rowList: { gap: theme.spacing.md },
  tripRow: {
    ...surfaces.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  tripRowText: { flex: 1, gap: 6 },
  tripRowEnd: { alignItems: 'flex-end', gap: 5 },

  tripList: { gap: theme.spacing.md },
  tripCard: {
    ...surfaces.card,
    padding: theme.spacing.lg,
    gap: 8,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  tripDivider: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
    marginTop: 4,
  },
  tripFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
