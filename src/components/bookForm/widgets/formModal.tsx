import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { ChevronRight, MapPin, Navigation, Calendar, X } from 'lucide-react-native';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import Text from '~/codidge_components/UI/text';
import { BookMode, IBookingFormInput } from '../interfaces';
import { FormField } from './formField';
import { DurationPicker } from './durationPicker';
import { BookModeToggle } from './tripToggle';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { AddressPickerModal, IAddressSuggestion } from './addressPicker';
import { DateTimeInputField } from '~/codidge_components/UI/form/inputs/dateTimePicker';
import { BottomSheetModal } from '~/components/bottomSheetModal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.82;
type ActivePicker = 'pickup' | 'dropoff' | null;

export const BookingModal = ({
  visible,
  onClose,
  onSubmit: onExternalSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (data: IBookingFormInput) => void;
}) => {
  const slideAnim = useRef(new Animated.Value(MODAL_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const [activePicker, setActivePicker] = useState<ActivePicker>(null);

  // Animate in/out
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 22,
          stiffness: 160,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: MODAL_HEIGHT,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm<IBookingFormInput>({
    defaultValues: {
      bookMode: BookMode.trip,
      bookHours: 2,
      pickupLocation: { displayName: '', formattedAddress: '', id: '' },
      dropoffLocation: { displayName: '', formattedAddress: '', id: '' },
      startDate: '',
      endDate: '',
    },
  });

  const bookMode = watch('bookMode');
  const pickup = watch('pickupLocation');
  const dropoff = watch('dropoffLocation');
  const startDate = watch('startDate');

  const onSubmit = (data: IBookingFormInput) => {
    onExternalSubmit?.(data);
  };

  // Called when user selects an address from the picker
  const handleAddressSelect = (address: IAddressSuggestion) => {
    const fieldName = activePicker === 'pickup' ? 'pickupLocation' : 'dropoffLocation';
    setValue(fieldName, {
      displayName: address.displayName,
      formattedAddress: address.address,
      id: address.placeId,
    });
    clearErrors(fieldName);
    setActivePicker(null);
  };

  return (
    <>
      <BottomSheetModal visible={visible} onClose={onClose} title="Book Your Ride">
        {/* Mode Toggle */}
        <Controller
          name="bookMode"
          control={control}
          render={({ field }) => <BookModeToggle value={field.value} onChange={field.onChange} />}
        />

        {/* Pickup */}
        <Controller
          name="pickupLocation"
          control={control}
          rules={{ validate: (v) => !!v.id || 'Pickup location is required' }}
          render={({ field }) => (
            <FormField
              label="Pickup Location"
              value={field.value.displayName}
              placeholder="Enter pickup location"
              icon={<Navigation size={16} color="#D4A853" />}
              onPress={() => {
                console.log(':::sss');
                setActivePicker('pickup');
              }}
              error={errors.pickupLocation?.message}
              style={{ marginTop: 20 }}
            />
          )}
        />

        {/* Dropoff — trip mode only */}
        {bookMode === BookMode.trip && (
          <Controller
            name="dropoffLocation"
            control={control}
            rules={{ validate: (v) => !!v.id || 'Destination is required' }}
            render={({ field }) => (
              <FormField
                label="Destination"
                value={field.value.displayName}
                placeholder="Where to?"
                icon={<MapPin size={16} color="#D4A853" />}
                onPress={() => setActivePicker('dropoff')}
                error={errors.dropoffLocation?.message}
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
                  const iso = res instanceof Date ? res.toISOString() : res;
                  onChange(iso);
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
            name="bookHours"
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

        {/* CTA */}
        <PrimaryButton
          size={ButtonSize.XLARGE}
          title="Find Your Perfect Ride"
          onPress={handleSubmit((data) => onExternalSubmit?.(data))}
          style={{ marginTop: 28, width: '100%' }}
          rightWidget={<ChevronRight size={24} />}
        />

        <View style={{ height: 12 }} />
        {/* Address picker — outside BookingModal so it layers on top */}
        <AddressPickerModal
          visible={activePicker !== null}
          variant={activePicker ?? 'pickup'}
          onClose={() => setActivePicker(null)}
          onSelect={handleAddressSelect}
          initialValue={
            activePicker === 'pickup'
              ? watch('pickupLocation').displayName
              : watch('dropoffLocation').displayName
          }
        />
      </BottomSheetModal>
    </>
  );
};

const modal = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: MODAL_HEIGHT,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'android' ? 'rgba(2,6,23,0.97)' : 'transparent',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
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
