import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { BookingFooter } from '~/components/bookTripJourney/widgets/bookFooter';
import { useCustomerTrips } from '~/screens/trips/hooks/useCustomerTrips';
import { Booking, BookingForm } from '~/screens/trips/interfaces';
import { ENV_Vars } from '~/store/env';

export const ExtraNotes = ({ onBack, onNext }: { onBack: () => void; onNext: () => void }) => {
  const {
    control,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BookingForm>();

  const { pickupLocation, dropoffLocation } = watch('bookingBusinessData');

  const flightNumber = watch('flightNumber');
  const terminal = watch('terminal');
  const flightDestinationNumber = watch('flightDestinationNumber');
  const terminalDestination = watch('terminalDestination');
  const extraNotes = watch('extraNotes');

  const isAirport = pickupLocation?.types?.includes('airport');
  const isPort = pickupLocation?.types?.includes('port');
  const isDestinationAirport = dropoffLocation?.types?.includes('airport');
  const isDestinationPort = dropoffLocation?.types?.includes('port');

  const { handleUpdateTrip, loadingTripUpdate } = useCustomerTrips({ skipQueries: false });

  const buildNote = () => {
    const parts: string[] = [];

    if (isAirport && flightNumber) parts.push(`Flight: ${flightNumber}`);
    if (isPort && terminal) parts.push(`Terminal: ${terminal}`);
    if (isDestinationAirport && flightDestinationNumber)
      parts.push(`Destination Flight: ${flightDestinationNumber}`);
    if (isDestinationPort && terminalDestination)
      parts.push(`Destination Terminal: ${terminalDestination}`);
    if (extraNotes) parts.push(`Notes: ${extraNotes}`);

    return parts.join(' | ');
  };

  const handleNext = async () => {
    try {
      const fieldsToValidate: (keyof Booking)[] = ['bookingBusinessData'];

      if (isAirport) fieldsToValidate.push('flightNumber' as keyof Booking);
      if (isPort) fieldsToValidate.push('terminal' as keyof Booking);
      if (isDestinationAirport) fieldsToValidate.push('flightDestinationNumber' as keyof Booking);
      if (isDestinationPort) fieldsToValidate.push('terminalDestination' as keyof Booking);

      const valid = await trigger(fieldsToValidate as any);

      if (valid) {
        const values = getValues();
        const bookingId = values.id;
        const note = buildNote();

        const tripUpdateResponse = await handleUpdateTrip({
          tenant: ENV_Vars.tenant,
          bookingId,
          booking: { note },
        });

        if (!tripUpdateResponse?.id) {
          throw new Error('Failed to update booking');
        }

        setValue('note', note);
        onNext();
      }
    } catch (error) {
      console.log(':::error', error);
      Alert.alert('Something went wrong while trying to process your request');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* ── Pickup: Airport ── */}
        {isAirport && (
          <Controller
            control={control}
            name="flightNumber"
            rules={{ required: 'Flight number is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                variant="dark"
                label="Pickup Flight Number"
                placeholder="e.g. AA 1234"
                value={value}
                required
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.flightNumber}
                errorMessage={errors.flightNumber?.message}
              />
            )}
          />
        )}

        {/* ── Pickup: Port ── */}
        {isPort && (
          <Controller
            control={control}
            name="terminal"
            rules={{ required: 'Terminal is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                variant="dark"
                label="Pickup Terminal"
                placeholder="e.g. Terminal 3"
                value={value}
                required
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.terminal}
                errorMessage={errors.terminal?.message}
              />
            )}
          />
        )}

        {/* ── Dropoff: Airport ── */}
        {isDestinationAirport && (
          <Controller
            control={control}
            name="flightDestinationNumber"
            rules={{ required: 'Destination flight number is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                variant="dark"
                label="Destination Flight Number"
                placeholder="e.g. AA 5678"
                value={value}
                required
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.flightDestinationNumber}
                errorMessage={errors.flightDestinationNumber?.message}
              />
            )}
          />
        )}

        {/* ── Dropoff: Port ── */}
        {isDestinationPort && (
          <Controller
            control={control}
            name="terminalDestination"
            rules={{ required: 'Destination terminal is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                variant="dark"
                label="Destination Terminal"
                placeholder="e.g. Terminal B"
                value={value}
                required
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.terminalDestination}
                errorMessage={errors.terminalDestination?.message}
              />
            )}
          />
        )}

        {/* ── Extra Notes (always visible) ── */}
        <Controller
          control={control}
          name="extraNotes"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              variant="dark"
              label="Extra Notes"
              placeholder="Any additional instructions for your chauffeur..."
              value={value}
              required={false}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={4}
              error={false}
              style={{
                minHeight: 80,
                textAlignVertical: 'top',
              }}
            />
          )}
        />
      </ScrollView>

      <BookingFooter
        backDisabled={loadingTripUpdate}
        nextLoading={loadingTripUpdate}
        errorMessage={
          errors.flightNumber?.message ||
          errors.terminal?.message ||
          errors.flightDestinationNumber?.message ||
          errors.terminalDestination?.message
        }
        onBack={onBack}
        onNext={handleNext}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: 16,
  },
});
