import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { Navigation, MapPin, Calendar } from 'lucide-react-native';
import { FormField } from '~/components/bookTripJourney/widgets/formField';
import { BookModeToggle } from '~/components/bookTripJourney/widgets/tripToggle';
import { DurationPicker } from '~/components/bookTripJourney/widgets/durationPicker';
import {
  AddressPickerModal,
  IAddressSuggestion,
} from '~/components/bookTripJourney/widgets/addressPicker';
import { DateTimeInputField } from '~/codidge_components/UI/form/inputs/dateTimePicker';
import { BookMode, Booking } from '~/screens/trips/interfaces';
import Text from '~/codidge_components/UI/text';
import { BookingFooter } from '../../widgets/bookFooter';

type ActivePicker = 'pickup' | 'dropoff' | null;

export const TrioBookForm = ({ onNext }: { onNext: () => void }) => {
  const {
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<Booking>();

  const [activePicker, setActivePicker] = useState<ActivePicker>(null);

  const bookMode = watch('bookingBusinessData.bookMode');

  const handleAddressSelect = (address: IAddressSuggestion) => {
    const field =
      activePicker === 'pickup'
        ? 'bookingBusinessData.pickupLocation'
        : 'bookingBusinessData.dropoffLocation';

    setValue(field, {
      displayName: address.displayName,
      formattedAddress: address.formattedAddress,
      id: address.id,
    });
    clearErrors(field);
    setActivePicker(null);
  };

  return (
    <>
      <View style={s.wrapper}>
        {/* Trip mode toggle */}
        <Controller
          name="bookingBusinessData.bookMode"
          control={control}
          render={({ field }) => <BookModeToggle value={field.value} onChange={field.onChange} />}
        />

        {/* Pickup */}
        <Controller
          name="bookingBusinessData.pickupLocation"
          control={control}
          rules={{ validate: (v) => !!v?.id || 'Pickup location is required' }}
          render={({ field }) => (
            <FormField
              label="Pickup Location"
              value={field.value?.displayName}
              placeholder="Where are you?"
              icon={<Navigation size={16} color="#D4A853" />}
              onPress={() => setActivePicker('pickup')}
              error={errors.bookingBusinessData?.pickupLocation?.message}
              style={{ marginTop: 20 }}
            />
          )}
        />

        {/* Dropoff — trip mode only */}
        {bookMode === BookMode.trip && (
          <Controller
            name="bookingBusinessData.dropoffLocation"
            control={control}
            rules={{ validate: (v) => !!v?.id || 'Destination is required' }}
            render={({ field }) => (
              <FormField
                label="Destination"
                value={field.value?.displayName}
                placeholder="Where to?"
                icon={<MapPin size={16} color="#D4A853" />}
                onPress={() => setActivePicker('dropoff')}
                error={errors.bookingBusinessData?.dropoffLocation?.message}
                style={{ marginTop: 16 }}
              />
            )}
          />
        )}

        {/* Date / Time */}
        <View style={{ marginTop: 16 }}>
          <Controller
            name="startDate"
            control={control}
            rules={{ required: 'Pickup date is required' }}
            render={({ field: { onChange, value } }) => (
              <DateTimeInputField
                value={value ? new Date(value) : undefined}
                mode="datetime"
                label="Pickup Date & Time"
                placeholder="Select date and time"
                icon={<Calendar size={16} color="#D4A853" />}
                onChangeText={(res) => {
                  onChange(res instanceof Date ? res.toISOString() : res);
                }}
                error={!!errors.startDate}
                errorMessage={errors.startDate?.message}
              />
            )}
          />
        </View>

        {/* Duration — hourly mode only */}
        {bookMode === BookMode.hourly && (
          <Controller
            name="bookingBusinessData.bookHours"
            control={control}
            render={({ field }) => (
              <View style={{ marginTop: 16 }}>
                <DurationPicker value={field.value} onChange={field.onChange} />
              </View>
            )}
          />
        )}

        {/* Hourly note */}
        {bookMode === BookMode.hourly && (
          <View style={note.wrapper}>
            <View style={note.bar} />
            <Text style={note.text}>
              <Text style={note.bold}>* Note: </Text>
              Hourly trips are limited to Miami-Dade and Broward County. For trips outside this
              area, choose "One Trip".
            </Text>
          </View>
        )}
      </View>
      <BookingFooter
        nextLabel="Next"
        onNext={() => {
          onNext();
        }}
      />
      {/* Address picker modals */}
      <AddressPickerModal
        visible={activePicker !== null}
        variant={activePicker ?? 'pickup'}
        onClose={() => setActivePicker(null)}
        onSelect={handleAddressSelect}
        initialValue={
          activePicker === 'pickup'
            ? (watch('bookingBusinessData.pickupLocation')?.displayName ?? '')
            : (watch('bookingBusinessData.dropoffLocation')?.displayName ?? '')
        }
      />
    </>
  );
};

const s = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

const note = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
    alignItems: 'flex-start',
  },
  bar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    alignSelf: 'stretch',
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
