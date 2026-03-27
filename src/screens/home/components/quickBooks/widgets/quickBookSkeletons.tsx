import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, ScrollView } from 'react-native';
import { theme } from '~/theme/theme';
import { GAP_QUICK_BOOKS } from './quickBookItem';

const { width } = Dimensions.get('window');
const ITEM_SIZE = 149;
const GRID_ITEM = (width - 40 - GAP_QUICK_BOOKS) / 2;
const GRID_THRESHOLD = 4;

// ─── Shimmer hook ─────────────────────────────────────────────────────────────

const useShimmer = () => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.7] });
  return opacity;
};

// ─── Single skeleton card ─────────────────────────────────────────────────────

const QuickBookSkeleton = ({ width: itemWidth }: { width: number }) => {
  const opacity = useShimmer();

  return (
    <Animated.View style={[sk.item, { width: itemWidth, opacity }]}>
      {/* Icon placeholder */}
      <View style={sk.iconWrap} />
      {/* Label placeholder */}
      <View style={sk.labelLine} />
      <View style={[sk.labelLine, { width: '55%' }]} />
    </Animated.View>
  );
};

// ─── Exported skeleton list ───────────────────────────────────────────────────

export const QuickBookSkeleton_List = ({ count = 4 }: { count?: number }) => {
  const useGrid = count <= GRID_THRESHOLD;
  const items = Array.from({ length: count });

  if (useGrid) {
    return (
      <View style={sk.grid}>
        {items.map((_, i) => (
          <QuickBookSkeleton key={i} width={GRID_ITEM} />
        ))}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={sk.scrollContent}>
      {items.map((_, i) => (
        <QuickBookSkeleton key={i} width={GRID_ITEM} />
      ))}
    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const sk = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP_QUICK_BOOKS,
    paddingHorizontal: 16,
  },
  scrollContent: {
    gap: GAP_QUICK_BOOKS,
    paddingRight: 20,
  },
  item: {
    height: ITEM_SIZE,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: theme.colors.primaryAlpha[10],
    borderWidth: 1,
    borderColor: theme.colors.primaryAlpha[20],
    justifyContent: 'flex-end',
    padding: 14,
    gap: 8,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryAlpha[20],
  },
  labelLine: {
    height: 10,
    width: '80%',
    borderRadius: 6,
    backgroundColor: theme.colors.primaryAlpha[20],
  },
});
