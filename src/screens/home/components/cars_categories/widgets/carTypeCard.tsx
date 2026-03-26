import { LinearGradient } from 'expo-linear-gradient';
import { Users } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { CarType } from '~/screens/trips/interfaces';
import { theme } from '~/theme/theme';
const { width } = Dimensions.get('window');

const CARD_WIDTH = width * 0.62;
const IMAGE_HEIGHT = CARD_WIDTH * 0.62;

export const CarCard = ({ item, onPress }: { item: CarType; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.82} style={styles.card}>
    {/* Image section */}
    <View style={styles.imageContainer}>
      <ImageBackground
        source={{ uri: item.image.url }}
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
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.name}
      </Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Passenger row */}
      <View style={styles.passengerRow}>
        {item.description && <Text style={styles.cardSubtitle}>{item.description}</Text>}
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.8,
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
});
