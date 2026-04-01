import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useFormContext } from 'react-hook-form';
import {
  Navigation,
  MapPin,
  Calendar,
  Clock,
  Car,
  CreditCard,
  Sparkles,
  Users,
  DollarSign,
  Lock,
} from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { Booking, BookMode } from '~/screens/trips/interfaces';
import { theme } from '~/theme/theme';
import { formatCurrency, formatDate, formatDateTime } from '~/screens/trips/helpers';
import { BookingFooter } from '../../widgets/bookFooter';
import {
  SummaryPriceRow,
  SummaryReviewRow,
  SummarySection,
  SummaryTrustBanner,
} from './subComponents';
import { useCustomerTrips } from '~/screens/trips/hooks/useCustomerTrips';
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { ENV_Vars } from '~/store/env';

let useStripe: () => {
  initPaymentSheet: (params: any) => Promise<{ error?: { message: string } }>;
  presentPaymentSheet: () => Promise<{ error?: { code: string; message: string } }>;
};

try {
  useStripe = require('@stripe/stripe-react-native').useStripe;
} catch {
  useStripe = () => ({
    initPaymentSheet: async () => {
      console.warn('[Stripe] Native module not available');
      return {};
    },
    presentPaymentSheet: async () => {
      console.warn('[Stripe] Native module not available');
      return {};
    },
  });
}

const GOLD = theme.colors.primary;

export const SummaryAndPayment = ({
  onBack,
  finish,
}: {
  onBack: () => void;
  finish: () => void;
}) => {
  const { watch } = useFormContext<Booking>();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const { handlePaymentIntent, loadingPaymentProcessment } = useCustomerTrips({
    skipQueries: true,
  });
  const user = useReactiveVar(userData);
  const [loadingSheet, setLoadingSheet] = useState(false);

  const data = watch();
  const biz = data.bookingBusinessData;
  const isHourly = biz?.bookMode === BookMode.hourly;
  const carType = biz?.carType; // ← the selected ICarType
  const extraServices = biz?.extraServices ?? [];
  const extraServicesTotal = extraServices.reduce((sum, ext) => {
    return sum + (ext.price.amount ?? 0);
  }, 0);
  const totalPrice = biz?.totalPrice ?? 0;
  const loading = loadingPaymentProcessment || loadingSheet;

  const onPayPressHandler = async () => {
    if (!totalPrice || !data.id || !user?.id) {
      Alert.alert('Missing info', 'Booking or user information is incomplete.');
      return;
    }

    setLoadingSheet(true);

    try {
      // 1. Create PaymentIntent on backend
      //    capture_method: 'manual' — card HELD, not charged
      //    Charge happens later when driver confirms via capturePayment resolver
      const intentData = await handlePaymentIntent({
        tenant: ENV_Vars.tenant,
        bookingId: data.id,
        customerId: user.id,
      });

      if (!intentData?.clientSecret) {
        throw new Error('Failed to initialize payment. Please try again.');
      }

      // 2. Init Stripe payment sheet with the clientSecret
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: intentData.clientSecret,
        customerId: intentData.stripeCustomerId,
        customerEphemeralKeySecret: intentData.ephemeralKey,
        merchantDisplayName: 'Golden Wheels',
        primaryButtonLabel: `Authorize ${formatCurrency(totalPrice.amount, totalPrice.currencyCode)}`,
        appearance: {
          colors: {
            primary: GOLD,
            background: '#020617',
            componentBackground: '#0f172a',
            componentBorder: '#ffffff14', // rgba(255,255,255,0.08)
            componentDivider: '#ffffff0f', // rgba(255,255,255,0.06)
            primaryText: '#ffffff',
            secondaryText: '#ffffff8c', // rgba(255,255,255,0.55)
            componentText: '#ffffff',
            placeholderText: '#ffffff4d', // rgba(255,255,255,0.30)
            icon: GOLD,
          },
          shapes: { borderRadius: 12, borderWidth: 1 },
        },
      });

      if (initError) throw new Error(initError.message);

      // 3. Present sheet — user enters card, Stripe handles 3DS automatically
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        // User dismissed — silent. Any other error gets shown.
        if (presentError.code !== 'Canceled') {
          Alert.alert('Payment error', presentError.message);
        }
        return;
      }

      // 4. Authorization complete — card held, NOT charged
      //    Backend paymentStatus is now 'authorized'
      //    Driver confirmation will trigger capturePayment → actual charge
      finish();
    } catch (error: any) {
      Alert.alert('Something went wrong', error?.message ?? 'Please try again.');
    } finally {
      setLoadingSheet(false);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <SummaryTrustBanner />
        {/* ── Trip ── */}
        <SummarySection title="Trip">
          <SummaryReviewRow
            icon={<Navigation size={14} color={GOLD} />}
            label="Pickup"
            value={biz?.pickupLocation?.displayName ?? ''}
          />
          {!isHourly ? (
            <SummaryReviewRow
              icon={<MapPin size={14} color={GOLD} />}
              label="Destination"
              value={biz?.dropoffLocation?.displayName ?? ''}
            />
          ) : (
            <SummaryReviewRow
              icon={<Clock size={14} color={GOLD} />}
              label="Duration"
              value={`${biz?.bookHours ?? 0} hours`}
            />
          )}
          <SummaryReviewRow
            icon={<Calendar size={14} color={GOLD} />}
            label="Date & Time"
            value={formatDateTime(data.startDate)}
            last
          />
        </SummarySection>

        {/* ── Vehicle category ── */}
        {carType ? (
          <SummarySection title="Vehicle Category">
            <SummaryReviewRow
              icon={<Car size={14} color={GOLD} />}
              label="Category"
              value={carType.name}
            />
            {carType.maxPassengers ? (
              <SummaryReviewRow
                icon={<Users size={14} color={GOLD} />}
                label="Max Passengers"
                value={`${carType.maxPassengers}`}
              />
            ) : null}
            {carType.tripQuotePrice ? (
              <SummaryReviewRow
                icon={<DollarSign size={14} color={GOLD} />}
                label="Trip Price"
                value={formatCurrency(carType.tripQuotePrice, totalPrice.currencyCode)}
                last={true}
              />
            ) : null}
          </SummarySection>
        ) : null}

        {/* ── Extras ── */}
        {extraServices.length > 0 ? (
          <SummarySection title="Extras">
            <SummaryReviewRow
              icon={<Sparkles size={14} color={GOLD} />}
              label="Add-ons"
              value={`${extraServices.length} extra service${extraServices.length > 1 ? 's' : ''} included`}
              last
            />
          </SummarySection>
        ) : null}

        {/* ── Pricing ── */}
        {totalPrice ? (
          <View style={priceS.wrapper}>
            <Text style={sec.title}>Price</Text>
            <View style={priceS.card}>
              <SummaryPriceRow
                label={isHourly ? 'Hourly rate' : 'Base fare'}
                value={formatCurrency(carType?.tripQuotePrice, totalPrice.currencyCode)}
              />
              {extraServices.length > 0 ? (
                <SummaryPriceRow
                  label="Extras"
                  value={formatCurrency(extraServicesTotal, totalPrice.currencyCode)}
                />
              ) : (
                <View />
              )}
              <View style={priceS.divider} />
              <SummaryPriceRow
                label="Total"
                value={formatCurrency(totalPrice.amount, totalPrice.currencyCode)}
                bold
                gold
              />
            </View>
          </View>
        ) : null}

        {/* ── Policy ── */}
        <View style={s.policy}>
          <View style={s.policyBar} />
          <Text style={s.policyText}>
            Free cancellation up to 2 hours before pickup. By confirming you agree to our terms of
            service and cancellation policy.
          </Text>
        </View>

        {/* Stripe badge */}
        <View style={s.secureBadge}>
          <Lock size={11} color="rgba(255,255,255,0.45)" />
          <Text style={s.secureText}>Payments secured by Stripe</Text>
        </View>

        <View style={{ height: 8 }} />
      </ScrollView>
      <BookingFooter
        onNext={onPayPressHandler}
        nextLabel={
          totalPrice
            ? `Authorize ${formatCurrency(totalPrice.amount, totalPrice.currencyCode)}`
            : 'Proceed to Payment'
        }
        nextLoading={loading}
        rightWidget={<CreditCard size={18} />}
      />
    </>
  );
};

const s = StyleSheet.create({
  scroll: { gap: 16 },
  policy: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  policyBar: { width: 3, borderRadius: 2, backgroundColor: GOLD, alignSelf: 'stretch' },
  policyText: { flex: 1, fontSize: 12, color: '#fff', lineHeight: 18 },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  secureText: { fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '500' },
});
const sec = StyleSheet.create({
  wrapper: { gap: 8 },
  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: theme.colors.primary,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
});

const priceS = StyleSheet.create({
  wrapper: { gap: 8 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 14,
    gap: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '400',
  },
  value: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  bold: {
    fontWeight: '700',
    fontSize: 16,
    color: '#ffffff',
  },
  gold: { color: '#D4A853' },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 2,
  },
});
