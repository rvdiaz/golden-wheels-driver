import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { Booking } from '../interfaces';
import { useCustomerTrips } from '../hooks/useCustomerTrips';
import { useMutation, useReactiveVar } from '@apollo/client';
import { cancelPaymentIntentMutation } from '../graphql/mutation';
import { ENV_Vars } from '~/store/env';
import { userData } from '~/store/user';
import { theme } from '~/theme/theme';

let useStripe: () => {
  initPaymentSheet: (params: any) => Promise<{ error?: { message: string } }>;
  presentPaymentSheet: () => Promise<{ error?: { code: string; message: string } }>;
};

try {
  useStripe = require('@stripe/stripe-react-native').useStripe;
} catch {
  useStripe = () => ({
    initPaymentSheet: async () => ({}),
    presentPaymentSheet: async () => ({}),
  });
}

const GOLD = theme.colors.primary;

interface PaymentUpdateProps {
  booking: Booking;
  onSuccess: () => void;
}

export const PaymentUpdate = ({ booking, onSuccess }: PaymentUpdateProps) => {
  const user = useReactiveVar(userData);
  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { handlePaymentIntent, handleUpdateTrip } = useCustomerTrips({ skipQueries: true });
  const [cancelPaymentIntentFn] = useMutation(cancelPaymentIntentMutation);

  const handlePress = async () => {
    if (!booking.id || !user?.id || loading) return;
    setLoading(true);

    try {
      // 1. Cancel the failed/expired intent
      const oldIntentId = booking.externalChargeReference?.referenceId;
      if (oldIntentId) {
        await cancelPaymentIntentFn({
          variables: {
            tenant: ENV_Vars.tenant,
            bookingId: booking.id,
          },
        });
      }

      // 2. Create fresh PaymentIntent
      const response = await handlePaymentIntent({
        tenant: ENV_Vars.tenant,
        bookingId: booking.id,
      });

      if (!response?.clientSecret) {
        throw new Error('Failed to initialize payment. Please try again.');
      }

      // 3. Init Stripe sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: response.clientSecret,
        customerId: response.stripeCustomerId,
        customerEphemeralKeySecret: response.ephemeralKey,
        merchantDisplayName: 'Golden Wheels',
        appearance: { colors: { primary: GOLD, icon: GOLD } },
      });

      if (initError) throw new Error(initError.message);

      // 4. Present sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code !== 'Canceled') {
          Alert.alert('Payment error', presentError.message);
        }
        return; // canceled — do nothing, keep banner visible
      }

      // 5. Clear failure fields + mark as authorized
      await handleUpdateTrip({
        tenant: ENV_Vars.tenant,
        bookingId: booking.id,
        booking: {
          paymentStatus: 'authorized',
        },
      });

      onSuccess();
    } catch (error: any) {
      Alert.alert('Something went wrong', error?.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      disabled={loading}
      style={[s.cta, loading && s.ctaDisabled]}>
      <Text style={s.ctaText}>{loading ? 'Processing...' : 'Update'}</Text>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  cta: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(251,146,60,0.35)',
    backgroundColor: 'rgba(251,146,60,0.08)',
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fb923c',
  },
});
