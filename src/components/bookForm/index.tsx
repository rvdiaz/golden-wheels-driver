import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { GlassButton } from '~/codidge_components/UI/button/GlassButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import { IBookingFormInput } from './interfaces';
import { BookingModal } from './widgets/formModal';

export const BookingTrigger = ({
  label = 'Book a Trip',
  onSubmit,
  onPickupPress,
  onDropoffPress,
  onDatePress,
}: {
  label?: string;
  onSubmit?: (data: IBookingFormInput) => void;
  onPickupPress?: () => void;
  onDropoffPress?: () => void;
  onDatePress?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <GlassButton
        size={ButtonSize.XLARGE}
        onPress={() => setOpen(true)}
        title={label}
        rightIcon={<ChevronRight size={24} color="#FFF" />}
        style={{ width: '70%' }}
      />
      <BookingModal
        visible={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => {
          setOpen(false);
          onSubmit?.(data);
        }}
      />
    </>
  );
};
