import React from 'react';
import { View, ScrollView, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Navigation,
  MapPin,
  Calendar,
  Clock,
  Car,
  CreditCard,
  Sparkles,
} from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { Booking, BookMode } from '~/screens/trips/interfaces';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import { theme } from '~/theme/theme';
import { formatDate } from '~/screens/trips/helpers';

const GOLD = theme.colors.primary;

const ReviewRow = ({
  icon,
  label,
  value,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) => (
  <View style={[row.wrapper, last && { borderBottomWidth: 0 }]}>
    <View style={row.iconWrap}>{icon}</View>
    <View style={row.content}>
      <Text style={row.label}>{label}</Text>
      <Text style={row.value} numberOfLines={2}>
        {value || '—'}
      </Text>
    </View>
  </View>
);

// ─── Section card ─────────────────────────────────────────────────────────────

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={sec.wrapper}>
    <Text style={sec.title}>{title}</Text>
    <View style={sec.card}>{children}</View>
  </View>
);

// ─── Price row ────────────────────────────────────────────────────────────────

const PriceRow = ({
  label,
  value,
  bold,
  gold,
}: {
  label: string;
  value: string;
  bold?: boolean;
  gold?: boolean;
}) => (
  <View style={price.row}>
    <Text style={[price.label, bold && price.bold]}>{label}</Text>
    <Text style={[price.value, bold && price.bold, gold && price.gold]}>{value}</Text>
  </View>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const SummaryAndPayment = ({ onPayPress }: { onPayPress?: () => void }) => {
  const { watch } = useFormContext<Booking>();

  const data = watch();
  const biz = data.bookingBusinessData;
  const isHourly = biz?.bookMode === BookMode.hourly;
  const car = biz?.car;
  const extraServices: string[] = biz?.extraServices ?? [];
  const totalPrice = biz?.totalPrice;

  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      {/* ── Car image card ── */}
      {car && (
        <View style={carCard.wrapper}>
          <ImageBackground
            source={car.carType.image?.url ? { uri: car.carType.image.url } : undefined}
            style={carCard.image}
            resizeMode="cover">
            {/* Fallback bg if no image */}
            <View style={[StyleSheet.absoluteFill, carCard.fallback]} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.75)']}
              start={{ x: 0.5, y: 0.2 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={carCard.overlay}>
              <View>
                <Text style={carCard.carName}>{car.brand}</Text>
                <Text style={carCard.carModel}>{car.model}</Text>
              </View>
              {totalPrice && (
                <View style={carCard.priceWrap}>
                  <Text style={carCard.priceLabel}>Total</Text>
                  <Text style={carCard.priceAmount}>${totalPrice.amount}</Text>
                </View>
              )}
            </View>
          </ImageBackground>
        </View>
      )}

      {/* ── Trip details ── */}
      <Section title="Trip">
        <ReviewRow
          icon={<Navigation size={14} color={GOLD} />}
          label="Pickup"
          value={biz?.pickupLocation?.displayName ?? ''}
        />
        {!isHourly ? (
          <ReviewRow
            icon={<MapPin size={14} color={GOLD} />}
            label="Destination"
            value={biz?.dropoffLocation?.displayName ?? ''}
          />
        ) : (
          <ReviewRow
            icon={<Clock size={14} color={GOLD} />}
            label="Duration"
            value={`${biz?.bookHours ?? 0} hours`}
          />
        )}
        <ReviewRow
          icon={<Calendar size={14} color={GOLD} />}
          label="Date & Time"
          value={formatDate(data.startDate)}
          last
        />
      </Section>

      {/* ── Vehicle ── */}
      {car && (
        <Section title="Vehicle">
          <ReviewRow
            icon={<Car size={14} color={GOLD} />}
            label="Car"
            value={`${car.brand} ${car.model}`}
          />
          <ReviewRow
            icon={<Car size={14} color={GOLD} />}
            label="Category"
            value={car.carType?.name ?? ''}
            last
          />
        </Section>
      )}

      {/* ── Extras ── */}
      {extraServices.length > 0 && (
        <Section title="Extras">
          <ReviewRow
            icon={<Sparkles size={14} color={GOLD} />}
            label="Add-ons"
            value={`${extraServices.length} extra service${extraServices.length > 1 ? 's' : ''} included`}
            last
          />
        </Section>
      )}

      {/* ── Pricing breakdown ── */}
      {totalPrice && (
        <View style={price.wrapper}>
          <Text style={sec.title}>Price</Text>
          <View style={price.card}>
            <PriceRow
              label={isHourly ? 'Hourly rate' : 'Base fare'}
              value={`$${car?.carType?.minimumFare ?? 0}`}
            />
            {extraServices.length > 0 && <PriceRow label="Extras" value={`+$0`} />}
            <View style={price.divider} />
            <PriceRow
              label="Total"
              value={`$${totalPrice.amount} ${totalPrice.currencyCode}`}
              bold
              gold
            />
          </View>
        </View>
      )}

      {/* ── Policy note ── */}
      <View style={s.policy}>
        <View style={s.policyBar} />
        <Text style={s.policyText}>
          Free cancellation up to 2 hours before pickup. By confirming you agree to our terms of
          service and cancellation policy.
        </Text>
      </View>

      {/* ── Pay button ── */}
      <PrimaryButton
        size={ButtonSize.LARGE}
        title="Proceed to Payment"
        onPress={onPayPress}
        style={s.payBtn}
        rightWidget={<CreditCard size={18} color="#fff" />}
      />

      <View style={{ height: 8 }} />
    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  policy: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  policyBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: GOLD,
    alignSelf: 'stretch',
  },
  policyText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  payBtn: {
    width: '100%',
    marginTop: 4,
  },
});

const carCard = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(212,168,83,0.3)',
  },
  image: {
    height: 160,
    justifyContent: 'flex-end',
    backgroundColor: '#0f172a',
  },
  fallback: {
    backgroundColor: '#0f172a',
  },
  overlay: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 14,
  },
  carName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  carModel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 1,
  },
  priceWrap: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
  },
  priceAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: GOLD,
  },
});

const sec = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#9CA3AF',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
});

const row = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(212,168,83,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 1,
  },
  label: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 19,
  },
});

const price = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    padding: 14,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  value: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  bold: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111827',
  },
  gold: {
    color: GOLD,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginVertical: 2,
  },
});
