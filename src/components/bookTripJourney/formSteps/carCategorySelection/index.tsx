import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import Text from '~/codidge_components/UI/text';
import { useCarCategories } from '~/screens/home/components/cars_categories/hooks/useCarCategories';
import { CarCategoriesSkeleton } from '~/screens/home/components/cars_categories/widgets/carTypesSkeletons';
import { Booking } from '~/screens/trips/interfaces';
import { CarOptionCard } from '../../widgets/carCategoryCard';
import { BookingFooter } from '../../widgets/bookFooter';

// ─── Main component ───────────────────────────────────────────────────────────

export const CarCategorySelection = ({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) => {
  const { carCategories, loading } = useCarCategories();

  const {
    control,
    trigger,
    formState: { errors },
  } = useFormContext<Booking>();

  const handleNext = async () => {
    const valid = await trigger('bookingBusinessData.carType');
    if (valid) onNext();
  };

  if (loading) {
    return <CarCategoriesSkeleton />;
  }

  const error = errors.bookingBusinessData?.carType;

  return (
    <>
      <Controller
        name="bookingBusinessData.carType"
        control={control}
        rules={{ required: 'Please select a category' }}
        render={({ field: { value, onChange } }) => (
          <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
            <Text style={s.resultCount}>
              {carCategories.length} {carCategories.length === 1 ? 'car' : 'cars'} available
            </Text>

            {carCategories.map((car) => (
              <CarOptionCard
                key={car.id}
                car={car}
                selected={value?.id === car.id}
                onPress={() => {
                  onChange(car);
                }} // ← onChange replaces setValue
              />
            ))}
          </ScrollView>
        )}
      />
      <BookingFooter errorMessage={error?.message} onBack={onBack} onNext={handleNext} />
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  scroll: {
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
});
