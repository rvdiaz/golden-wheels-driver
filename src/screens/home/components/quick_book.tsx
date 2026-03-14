import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LucideIcon, Plane, Ship, MapPin, Train, Palmtree } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { QuickBookItem } from './quickBooks/quickBookItem';

export const DEMO_OPTIONS: QuickBookOption[] = [
  {
    id: 'mia',
    title: "Miami Int'l Airport",
    icon: Plane,
    imageUri: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
  },
  {
    id: 'port-miami',
    title: 'Port of Miami',
    icon: Ship,
    imageUri: 'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=400',
  },
  {
    id: 'brickell',
    title: 'Brickell City Centre',
    icon: MapPin,
    imageUri: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=400',
  },
  {
    id: 'south-beach',
    title: 'South Beach',
    icon: Palmtree,
    imageUri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
];
export const GAP_QUICK_BOOKS = 10;
// ── Types ─────────────────────────────────────────────────────────────────────
export interface QuickBookOption {
  id: string;
  title: string;
  imageUri?: string;
  icon: LucideIcon;
}

const GRID_THRESHOLD = 4;

export const QuickBook = ({ options }: { options?: QuickBookOption[] }) => {
  const items: QuickBookOption[] = options ?? DEMO_OPTIONS;

  const useGrid = items.length <= GRID_THRESHOLD;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>Quick Book</Text>
        <Text style={styles.sectionSub}>Where are you departing from?</Text>
      </View>

      {useGrid ? (
        // 2-column grid
        <View style={styles.grid}>
          {items.map((item) => (
            <QuickBookItem key={item.id} item={item} />
          ))}
        </View>
      ) : (
        // Horizontal scroll for 5+
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {items.map((item) => (
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
  },
  sectionSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.2,
  },

  // ── Grid ──────────────────────────────────────────────────────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP_QUICK_BOOKS,
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scrollContent: {
    gap: GAP_QUICK_BOOKS,
    paddingRight: 20,
  },
});
