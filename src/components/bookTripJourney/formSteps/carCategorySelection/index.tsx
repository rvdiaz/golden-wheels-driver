import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useFormContext } from 'react-hook-form';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Check } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { useCarCategories } from '~/screens/home/components/cars_categories/hooks/useCarCategories';
import { CarCategoriesSkeleton } from '~/screens/home/components/cars_categories/widgets/carTypesSkeletons';
import { Booking } from '~/screens/trips/interfaces';
import { theme } from '~/theme/theme';

const { width } = Dimensions.get('window');
const GOLD = theme.colors.primary;
const CARD_WIDTH = width - 48;

// ─── Car option card ──────────────────────────────────────────────────────────

const CarOptionCard = ({
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
      {/* Passenger badge */}
      {car.maxPassengers && (
        <View style={styles.badge}>
          <Users size={11} color={GOLD} strokeWidth={2} />
          <Text style={styles.badgeText}>Up to {car.maxPassengers}</Text>
        </View>
      )}
    </View>

    {/* Info row */}
    <View style={[styles.info, selected && styles.infoSelected]}>
      <View style={styles.infoLeft}>
        <Text style={styles.carName}>{car.name}</Text>
        {car.description ? (
          <Text style={styles.carDesc} numberOfLines={1}>
            {car.description}
          </Text>
        ) : null}
      </View>

      {/* Price */}
      {(car.minimumFare || car.tripQuotePrice) && (
        <View style={styles.priceWrap}>
          <Text style={styles.priceLabel}>From</Text>
          <Text style={styles.price}>${car.tripQuotePrice ?? car.minimumFare}</Text>
        </View>
      )}

      {/* Checkmark */}
      <View style={[styles.checkCircle, selected && styles.checkCircleActive]}>
        {selected && <Check size={13} color="#fff" strokeWidth={2.5} />}
      </View>
    </View>

    {/* Gold border when selected */}
    {selected && <View style={styles.selectedBorder} pointerEvents="none" />}
  </TouchableOpacity>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const CarCategorySelection = () => {
  const { carCategories, loading } = useCarCategories();

  const {
    watch,
    formState: { errors },
  } = useFormContext<Booking>();

  const selectedCar = watch('bookingBusinessData.car');

  const handleSelectCar = (car: any) => {
    // TODO: implement selection logic
  };

  if (loading) {
    return <CarCategoriesSkeleton />;
  }

  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <Text style={s.resultCount}>
        {carCategories.length} {carCategories.length === 1 ? 'car' : 'cars'} available
      </Text>

      {carCategories.map((car) => (
        <CarOptionCard
          key={car.id}
          car={car}
          selected={selectedCar?.id === car.id}
          onPress={() => handleSelectCar(car)}
        />
      ))}

      {errors.bookingBusinessData?.car && (
        <Text style={s.error}>{errors.bookingBusinessData.car.message}</Text>
      )}
    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 14,
  },
  resultCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
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
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(2,6,23,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.35)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: GOLD,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    backgroundColor: '#fff',
  },
  infoSelected: {
    backgroundColor: 'rgba(212,168,83,0.04)',
  },
  infoLeft: {
    flex: 1,
    gap: 2,
  },
  carName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  carDesc: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priceWrap: {
    alignItems: 'flex-end',
    gap: 1,
  },
  priceLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  selectedBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: GOLD,
  },
});
