import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { QuickBookItem } from './widgets/quickBookItem';
import { useQuickBooks } from './hooks/useQuickBooks';
import { QuickBookSkeleton_List } from './widgets/quickBookSkeletons';

const GRID_THRESHOLD = 4;

export const QuickBook = () => {
  const { quickBooks, loadingQuickBooks } = useQuickBooks();

  const useGrid = quickBooks.length <= GRID_THRESHOLD;

  if (loadingQuickBooks) {
    return <QuickBookSkeleton_List />;
  }

  if (quickBooks.length === 0) {
    return <View></View>;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>Frecuent Departures</Text>
      </View>

      {useGrid ? (
        // 2-column grid
        <View style={styles.grid}>
          {quickBooks.map((item) => (
            <QuickBookItem key={item.id} item={item} />
          ))}
        </View>
      ) : (
        // Horizontal scroll for 5+
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {quickBooks.map((item) => (
            <QuickBookItem key={item.id} item={item} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

// Each item fills exactly half the available width in grid mode

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    gap: 14,
  },
  header: {
    gap: 2,
  },
  sectionLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },

  // ── Grid ──────────────────────────────────────────────────────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scrollContent: {
    gap: 10,
    paddingRight: 20,
  },
});
