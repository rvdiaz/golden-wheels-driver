import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';

const { width } = Dimensions.get('window');

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CarCategory {
  id: string;
  title: string;
  subtitle?: string;
  imageUri: string;
  maxPassengers: number;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

export const MOCK_CATEGORIES: CarCategory[] = [
  {
    id: 'sedan',
    title: 'Business Sedan',
    subtitle: 'Mercedes E-Class or similar',
    imageUri: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600',
    maxPassengers: 3,
  },
  {
    id: 'suv',
    title: 'Executive SUV',
    subtitle: 'Cadillac Escalade or similar',
    imageUri: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600',
    maxPassengers: 6,
  },
  {
    id: 'van',
    title: 'Luxury Van',
    subtitle: 'Mercedes Sprinter or similar',
    imageUri: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600',
    maxPassengers: 12,
  },
  {
    id: 'stretch',
    title: 'Stretch Limousine',
    subtitle: 'Lincoln Stretch or similar',
    imageUri: 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=600',
    maxPassengers: 8,
  },
  {
    id: 'coach',
    title: 'Mini Coach',
    subtitle: 'Executive Coach or similar',
    imageUri: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=600',
    maxPassengers: 24,
  },
];

// ── Card ──────────────────────────────────────────────────────────────────────

const CARD_WIDTH = width * 0.62;
const IMAGE_HEIGHT = CARD_WIDTH * 0.62;

const CarCard = ({ item, onPress }: { item: CarCategory; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.82} style={styles.card}>
    {/* Image section */}
    <View style={styles.imageContainer}>
      <ImageBackground
        source={{ uri: item.imageUri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      {/* Bottom fade into card body */}
      <LinearGradient
        colors={['transparent', '#0f172a'] as [string, string]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Passenger badge */}
      <View style={styles.badge}>
        <Users size={11} color={theme.colors.primary} strokeWidth={2} />
        <Text style={styles.badgeText}>Max {item.maxPassengers}</Text>
      </View>
    </View>

    {/* Info section below image */}
    <View style={styles.cardContent}>
      {item.subtitle && (
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
      )}
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Passenger row */}
      <View style={styles.passengerRow}>
        <Users size={13} color="rgba(255,255,255,0.4)" strokeWidth={1.8} />
        <Text style={styles.passengerText}>Up to {item.maxPassengers} passengers</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// ── Dot pagination ────────────────────────────────────────────────────────────

const Dots = ({ total, active }: { total: number; active: number }) => (
  <View style={styles.dots}>
    {Array.from({ length: total }).map((_, i) => (
      <View key={i} style={[styles.dot, i === active && styles.dotActive]} />
    ))}
  </View>
);

// ── Main ──────────────────────────────────────────────────────────────────────

export const CarsCategories = ({
  categories,
  onSelect,
}: {
  categories?: CarCategory[];
  onSelect?: (id: string) => void;
}) => {
  const items = categories ?? MOCK_CATEGORIES;
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
        {items.map((item) => (
          <CarCard key={item.id} item={item} onPress={() => onSelect?.(item.id)} />
        ))}
      </ScrollView>

      {/* Dots */}
      <Dots total={items.length} active={activeIndex} />
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

  // ── Card content ──────────────────────────────────────────────────────────
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
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(2,6,23,0.72)',
    borderWidth: 1,
    borderColor: theme.colors.primaryAlpha[35],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
    letterSpacing: 0.2,
  },
  cardContent: {
    padding: 14,
    gap: 6,
    backgroundColor: '#0f172a',
  },
  cardSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 4,
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  passengerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
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
