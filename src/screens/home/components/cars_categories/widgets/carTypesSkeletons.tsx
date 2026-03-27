import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, ScrollView } from 'react-native';
import { theme } from '~/theme/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.62;
const IMAGE_HEIGHT = CARD_WIDTH * 0.62;

// ─── Shimmer ──────────────────────────────────────────────────────────────────

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
  return anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.65] });
};

// ─── Single skeleton card — mirrors CarCard exactly ──────────────────────────

const CarCardSkeleton = () => {
  const opacity = useShimmer();

  return (
    <Animated.View style={[sk.card, { opacity }]}>
      {/* Image area */}
      <View style={sk.imageContainer}>
        {/* Badge placeholder */}
        <View style={sk.badge} />
      </View>

      {/* Content area */}
      <View style={sk.cardContent}>
        {/* Title */}
        <View style={sk.titleLine} />
        {/* Divider */}
        <View style={sk.divider} />
        {/* Subtitle */}
        <View style={sk.subtitleLine} />
      </View>
    </Animated.View>
  );
};

// ─── Exported skeleton carousel ───────────────────────────────────────────────

export const CarCategoriesSkeleton = ({ count = 3 }: { count?: number }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    scrollEnabled={false}
    contentContainerStyle={sk.scrollContent}>
    {Array.from({ length: count }).map((_, i) => (
      <CarCardSkeleton key={i} />
    ))}
  </ScrollView>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const sk = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    gap: 14,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: theme.borderRadius.xxl,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: theme.colors.primaryAlpha[20],
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: theme.colors.primaryAlpha[10],
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 12,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 80,
    height: 24,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryAlpha[20],
  },
  cardContent: {
    padding: 14,
    gap: 8,
    backgroundColor: '#0f172a',
  },
  titleLine: {
    height: 14,
    width: '65%',
    borderRadius: 6,
    backgroundColor: theme.colors.primaryAlpha[20],
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 2,
  },
  subtitleLine: {
    height: 10,
    width: '45%',
    borderRadius: 6,
    backgroundColor: theme.colors.primaryAlpha[10],
  },
});
