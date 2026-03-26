import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { CarCard } from './widgets/carTypeCard';
import { useCarCategories } from './hooks/useCarCategories';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.62;

const Dots = ({ total, active }: { total: number; active: number }) => (
  <View style={styles.dots}>
    {Array.from({ length: total }).map((_, i) => (
      <View key={i} style={[styles.dot, i === active && styles.dotActive]} />
    ))}
  </View>
);

// ── Main ──────────────────────────────────────────────────────────────────────

export const CarsCategories = ({}: {}) => {
  const { carCategories } = useCarCategories();

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / (CARD_WIDTH + 14));
    setActiveIndex(index);
  };

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>Our Fleet</Text>
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 14}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}>
        {carCategories.map((item) => (
          <CarCard key={item.id} item={item} onPress={() => {}} />
        ))}
      </ScrollView>

      {/* Dots */}
      <Dots total={carCategories.length} active={activeIndex} />
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    gap: 16,
  },
  header: {
    paddingHorizontal: 20,
    gap: 2,
  },
  sectionLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  sectionSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
  },

  // ── Carousel ──────────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 20,
    gap: 14,
  },

  // ── Dots ──────────────────────────────────────────────────────────────────
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 20,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
});
