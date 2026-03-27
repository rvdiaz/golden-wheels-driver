import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
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
} from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { Booking, BookMode } from '~/screens/trips/interfaces';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import { theme } from '~/theme/theme';
import { formatDate } from '~/screens/trips/helpers';
import { CarCard } from '~/screens/home/components/cars_categories/widgets/carTypeCard';
import { BookingFooter } from '../../widgets/bookFooter';

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

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={sec.wrapper}>
    <Text style={sec.title}>{title}</Text>
    <View style={sec.card}>{children}</View>
  </View>
);

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
  <View style={priceS.row}>
    <Text style={[priceS.label, bold && priceS.bold]}>{label}</Text>
    <Text style={[priceS.value, bold && priceS.bold, gold && priceS.gold]}>{value}</Text>
  </View>
);

export const SummaryAndPayment = ({
  onBack,
  onPayPress,
}: {
  onBack: () => void;
  onPayPress?: () => void;
}) => {
  const { watch } = useFormContext<Booking>();

  const data = watch();
  const biz = data.bookingBusinessData;
  const isHourly = biz?.bookMode === BookMode.hourly;
  const carType = biz?.carType; // ← the selected ICarType
  const extraServices: string[] = biz?.extraServices ?? [];
  const totalPrice = biz?.totalPrice;

  return (
    <>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Car type image card ── */}
        {carType && (
          <CarCard
            onPress={() => {}}
            item={carType}
            style={{
              width: '100%',
            }}
          />
        )}

        {/* ── Trip ── */}
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

        {/* ── Vehicle category ── */}
        {carType && (
          <Section title="Vehicle Category">
            <ReviewRow
              icon={<Car size={14} color={GOLD} />}
              label="Category"
              value={carType.name}
            />
            {carType.maxPassengers ? (
              <ReviewRow
                icon={<Users size={14} color={GOLD} />}
                label="Max Passengers"
                value={`${carType.maxPassengers}`}
              />
            ) : null}
            {carType.minimumFare ? (
              <ReviewRow
                icon={<CreditCard size={14} color={GOLD} />}
                label="Minimum Fare"
                value={`$${carType.minimumFare}`}
                last={!carType.hourlyRate}
              />
            ) : null}
            {carType.hourlyRate ? (
              <ReviewRow
                icon={<Clock size={14} color={GOLD} />}
                label="Hourly Rate"
                value={`$${carType.hourlyRate}/hr`}
                last
              />
            ) : null}
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

        {/* ── Pricing ── */}
        {totalPrice && (
          <View style={priceS.wrapper}>
            <Text style={sec.title}>Price</Text>
            <View style={priceS.card}>
              <PriceRow
                label={isHourly ? 'Hourly rate' : 'Base fare'}
                value={`$${carType?.minimumFare ?? 0}`}
              />
              {extraServices.length > 0 && <PriceRow label="Extras" value="+$0" />}
              <View style={priceS.divider} />
              <PriceRow
                label="Total"
                value={`$${totalPrice.amount} ${totalPrice.currencyCode}`}
                bold
                gold
              />
            </View>
          </View>
        )}

        {/* ── Policy ── */}
        <View style={s.policy}>
          <View style={s.policyBar} />
          <Text style={s.policyText}>
            Free cancellation up to 2 hours before pickup. By confirming you agree to our terms of
            service and cancellation policy.
          </Text>
        </View>

        <View style={{ height: 8 }} />
      </ScrollView>
      <BookingFooter
        onNext={onPayPress}
        nextLabel="Proceed to Payment"
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

const row = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)', // dark divider
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(212,168,83,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, gap: 4 },
  label: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)', // muted white
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)', // bright white
    lineHeight: 19,
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
