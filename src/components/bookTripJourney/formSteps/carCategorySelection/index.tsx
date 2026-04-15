import React from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import Text from '~/codidge_components/UI/text';
import { useCarCategories } from '~/screens/home/components/cars_categories/hooks/useCarCategories';
import { CarCategoriesSkeleton } from '~/screens/home/components/cars_categories/widgets/carTypesSkeletons';
import { BookingForm } from '~/screens/trips/interfaces';
import { CarOptionCard } from '../../widgets/carCategoryCard';
import { BookingFooter } from '../../widgets/bookFooter';
import { useCustomerTrips } from '~/screens/trips/hooks/useCustomerTrips';
import { ENV_Vars } from '~/store/env';

// ─── Main component ───────────────────────────────────────────────────────────

export const CarCategorySelection = ({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) => {
  const {
    control,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BookingForm>();

  const { bookHours, bookMode, dropoffLocation, pickupLocation } = watch('bookingBusinessData');

  const { carCategoriesWithQuote, loadingGetCarTypesByTrip } = useCarCategories({
    queryInput: {
      bookHours,
      bookMode,
      dropoffLocation,
      pickupLocation,
    },
  });

  const { handleUpdateTrip, loadingTripUpdate } = useCustomerTrips({ skipQueries: false });

  const handleNext = async () => {
    try {
      const valid = await trigger('bookingBusinessData.carType');
      if (valid) {
        const values = getValues();
        const bookingId = values.id;
        const carTypeSelection = values.bookingBusinessData.carType;

        const tripUpdateResponse = await handleUpdateTrip({
          tenant: ENV_Vars.tenant,
          bookingId,
          booking: {
            bookingBusinessData: {
              carType: {
                id: carTypeSelection.id,
                name: carTypeSelection.name,
                supportsHourly: carTypeSelection.supportsHourly,
                hourlyRate: carTypeSelection.hourlyRate,
                supportsDistance: carTypeSelection.supportsDistance,
                pricePerMiles: carTypeSelection.pricePerMiles,
                baseFare: carTypeSelection.baseFare,
                minimumFare: carTypeSelection.minimumFare,
                maxPassengers: carTypeSelection.maxPassengers,
                features: carTypeSelection.features,
                tripQuotePrice: carTypeSelection.tripQuotePrice,
              },
            },
          },
        });
        if (!tripUpdateResponse?.id) {
          throw new Error('Failed to updating booking');
        }

        setValue('bookingBusinessData.carType', tripUpdateResponse.bookingBusinessData.carType);
        setValue(
          'bookingBusinessData.totalPrice',
          tripUpdateResponse.bookingBusinessData.totalPrice
        );

        onNext();
      }
    } catch (error) {
      console.log(':::error', error);
      Alert.alert('Something went wrong while trying to process car selection');
    }
  };

  if (loadingGetCarTypesByTrip) {
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
              {carCategoriesWithQuote.length} {carCategoriesWithQuote.length === 1 ? 'car' : 'cars'}{' '}
              available
            </Text>

            {carCategoriesWithQuote.map((car) => (
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
      <BookingFooter
        backDisabled={loadingTripUpdate}
        nextLoading={loadingTripUpdate}
        errorMessage={error?.message}
        onBack={onBack}
        onNext={handleNext}
      />
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
    color: '#FFF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
