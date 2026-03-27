import React from 'react';
import { View, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Check } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
const { width } = Dimensions.get('window');

const GOLD = theme.colors.primary;
const CARD_WIDTH = width - 48;

export const CarOptionCard = ({
  car,
  selected,
  onPress,
}: {
  car: any;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.82}
    style={[styles.card, selected && styles.cardSelected]}>
    {/* Image */}
    <View style={styles.imageWrap}>
      {car.image?.url ? (
        <ImageBackground
          source={{ uri: car.image.url }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.imageFallback]} />
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)']}
        start={{ x: 0.5, y: 0.3 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>

    {/* Info row */}
    <View style={[styles.info, selected && styles.infoSelected]}>
      <View style={styles.infoLeft}>
        <Text style={styles.carName}>{car.name}</Text>
        {/* Passenger badge */}
        {car.maxPassengers && (
          <View style={styles.passengerWrapper}>
            <Users size={11} color={GOLD} strokeWidth={2} />
            <Text style={styles.badgeText}>Up to {car.maxPassengers}</Text>
          </View>
        )}
      </View>

      {/* Price */}
      {(car.minimumFare || car.tripQuotePrice) && (
        <View style={styles.priceWrap}>
          <Text style={styles.price}>${car.tripQuotePrice ?? car.minimumFare}</Text>
        </View>
      )}
    </View>

    {/* Gold border when selected */}
    {selected && <View style={styles.selectedBorder} pointerEvents="none" />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  cardSelected: {
    borderColor: 'transparent',
  },
  imageWrap: {
    width: '100%',
    height: CARD_WIDTH * 0.45,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
  },
  imageFallback: {
    backgroundColor: theme.colors.primaryAlpha[10],
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: GOLD,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    gap: 12,
  },
  infoSelected: {
    backgroundColor: 'rgba(212,168,83,0.04)',
  },
  infoLeft: {
    flex: 1,
    gap: 2,
  },
  carName: {
    fontSize: 20,
    fontWeight: '700',
    color: GOLD,
  },
  priceWrap: {
    alignItems: 'flex-end',
    gap: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: GOLD,
  },
  selectedBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: GOLD,
  },
  passengerWrapper: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 6,
  },
});
