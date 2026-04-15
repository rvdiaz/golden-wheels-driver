import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { Navigation, MapPin, Calendar } from 'lucide-react-native';
import { BookModeToggle } from '~/components/bookTripJourney/widgets/tripToggle';
import { DurationPicker } from '~/components/bookTripJourney/widgets/durationPicker';
import {
  AddressPickerModal,
  IAddressSuggestion,
} from '~/components/bookTripJourney/widgets/addressPicker';
import { DateTimeInputField } from '~/codidge_components/UI/form/inputs/dateTimePicker';
import { BookingForm, BookMode } from '~/screens/trips/interfaces';
import Text from '~/codidge_components/UI/text';
import { BookingFooter } from '../../widgets/bookFooter';
import { useCustomerTrips } from '~/screens/trips/hooks/useCustomerTrips';
import { ENV_Vars } from '~/store/env';
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import InputField from '~/codidge_components/UI/form/inputs/inputField';

type ActivePicker = 'pickup' | 'dropoff' | null;

export const TrioBookForm = ({ onNext }: { onNext: () => void }) => {
  const userInfo = useReactiveVar(userData);

  const {
    control,
    watch,
    setValue,
    clearErrors,
    getValues,
    formState: { errors },
  } = useFormContext<BookingForm>();

  const { handleAddTrip, handleUpdateTrip, loadingTripUpdate, loadingTripCreation } =
    useCustomerTrips({
      skipQueries: true,
    });
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
      types: address.types ?? [''],
    });
    clearErrors(field);
    setActivePicker(null);
  };

  const handlerBookingDraftCreation = async () => {
    try {
      const values = getValues();

      let response = undefined;
      const id = values.id;
      if (id) {
        response = await handleUpdateTrip({
          tenant: ENV_Vars.tenant,
          bookingId: id,
          booking: {
            startDate: values.startDate,
            bookingBusinessData: {
              pickupLocation: values.bookingBusinessData.pickupLocation,
              dropoffLocation: values.bookingBusinessData.dropoffLocation,
              bookMode: values.bookingBusinessData.bookMode,
              bookHours: values.bookingBusinessData.bookHours,
            },
          },
        });
        if (!response?.id) {
          throw new Error('Failed to updating booking');
        }
      } else {
        response = await handleAddTrip({
          tenant: ENV_Vars.tenant,
          booking: {
            startDate: values.startDate,
            status: 'draft',
            bookingBusinessData: {
              customer: {
                id: userInfo?.id,
                name: userInfo?.name,
                email: userInfo?.email,
                phone: userInfo?.phone,
              },
              pickupLocation: values.bookingBusinessData.pickupLocation,
              dropoffLocation: values.bookingBusinessData.dropoffLocation,
              bookMode: values.bookingBusinessData.bookMode,
              bookHours: values.bookingBusinessData.bookHours,
            },
          },
        });
        if (!response?.id) {
          throw new Error('Failed to create booking');
        }

        setValue('id', response.id);
      }

      setValue('bookingBusinessData', response.bookingBusinessData);
      setValue('bookingCode', response.bookingCode);

      // ✅ Move to next step
      onNext();
    } catch (err) {
      console.error('Booking creation failed:', err);
    }
  };

  return (
    <>
      <View style={s.wrapper}>
        {/* Trip mode toggle */}
        <View
          style={{
            marginBottom: 10,
          }}>
          <Controller
            name="bookingBusinessData.bookMode"
            control={control}
            render={({ field }) => <BookModeToggle value={field.value} onChange={field.onChange} />}
          />
        </View>

        {/* Pickup */}
        <Controller
          name="bookingBusinessData.pickupLocation"
          control={control}
          rules={{ validate: (v) => !!v?.id || 'Pickup location is required' }}
          render={({ field }) => (
            <InputField
              variant="dark"
              label="Pickup Location"
              value={field.value?.displayName}
              placeholder="Where are you?"
              icon={<Navigation size={16} color="#D4A853" />}
              onPress={() => setActivePicker('pickup')}
              error={!!errors.bookingBusinessData?.pickupLocation}
              errorMessage={errors.bookingBusinessData?.pickupLocation?.message}
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
              <InputField
                variant="dark"
                label="Destination"
                value={field.value?.displayName}
                placeholder="Where to?"
                icon={<MapPin size={16} color="#D4A853" />}
                onPress={() => setActivePicker('dropoff')}
                error={!!errors.bookingBusinessData?.dropoffLocation}
                errorMessage={errors.bookingBusinessData?.dropoffLocation?.message}
              />
            )}
          />
        )}

        {/* Date / Time */}
        <View>
          <Controller
            name="startDate"
            control={control}
            rules={{
              required: 'Pickup date is required',
              validate: (value) => {
                if (!value) return true;
                const selected = new Date(value);
                const minDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // now + 2 hours
                return selected >= minDate || 'Pickup time must be at least 2 hours from now';
              },
            }}
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
              <View>
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
        onNext={handlerBookingDraftCreation}
        nextLoading={loadingTripCreation || loadingTripUpdate}
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
    gap: 10,
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
