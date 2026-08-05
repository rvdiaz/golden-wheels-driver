import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { ScreenHeader } from '~/codidge_components/UI/screenHeader';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { ENV_Vars } from '~/store/env';
import { getDriverBookingsQuery } from './graphql/queries';
import { Booking } from './interfaces';
import { formatCurrency, formatDateTime } from './helpers';
import { LoadingSpinner } from '~/codidge_components/UI/loading/loadingSpinner';
import { TripDetailModal } from './components/tripDetailModal';
import {
  STATUS_LABEL_KEY,
  callCustomer,
  messageCustomer,
} from './hooks/useTripActions';
import { typography } from '~/theme/typography';
import { TKey, useTranslation } from '~/i18n';
import {
  MapPin,
  Flag,
  User,
  Car,
  CircleDot,
  CheckCircle,
  Phone,
  MessageSquare,
} from 'lucide-react-native';

type DriverTabKey = 'upcoming' | 'past' | 'cancelled';

const TABS: { key: DriverTabKey; labelKey: TKey }[] = [
  { key: 'upcoming', labelKey: 'trips.upcoming' },
  { key: 'past', labelKey: 'trips.completed' },
  { key: 'cancelled', labelKey: 'trips.cancelled' },
];

const STATUS_COLOR: Record<string, string> = {
  assigned: theme.colors.info,
  en_route: '#7C3AED',
  arrived: '#D97706',
  in_progress: theme.colors.success,
  completed: theme.colors.textColor,
};

const filterDriverBookings = (bookings: Booking[], tab: DriverTabKey): Booking[] => {
  return bookings
    .filter((b) => {
      if (tab === 'upcoming') return b.status === 'confirmed' || b.status === 'in_progress';
      if (tab === 'past') return b.status === 'completed';
      if (tab === 'cancelled') return b.status === 'cancelled';
      return false;
    })
    .sort((a, b) =>
      tab === 'upcoming'
        ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        : new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
};

// ─── Tab bar ──────────────────────────────────────────────────────────────────

const TabBar = ({
  active,
  counts,
  onChange,
}: {
  active: DriverTabKey;
  counts: Record<DriverTabKey, number>;
  onChange: (tab: DriverTabKey) => void;
}) => {
  const { t } = useTranslation();

  return (
    <View style={tabStyles.wrapper}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onChange(tab.key)}
          style={[tabStyles.tab, active === tab.key && tabStyles.tabActive]}>
          <Text
            style={[tabStyles.label, active === tab.key && tabStyles.labelActive]}>
            {t(tab.labelKey)}
          </Text>
          {counts[tab.key] > 0 && (
            <View
              style={[tabStyles.badge, active === tab.key && tabStyles.badgeActive]}>
              <Text
                style={[
                  tabStyles.badgeText,
                  active === tab.key && tabStyles.badgeTextActive,
                ]}>
                {counts[tab.key]}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ─── Trip card ────────────────────────────────────────────────────────────────

const DriverTripCard = ({
  booking,
  onOpen,
}: {
  booking: Booking;
  onOpen: (booking: Booking) => void;
}) => {
  const { t } = useTranslation();
  const { bookingBusinessData: biz, driverStatus, status } = booking;
  const isActive = status === 'confirmed' || status === 'in_progress';
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';

  const statusColor = driverStatus ? STATUS_COLOR[driverStatus] : theme.colors.textColor;

  return (
    <TouchableOpacity
      style={[cardStyles.card, isCancelled && cardStyles.cardCancelled]}
      activeOpacity={0.9}
      onPress={() => onOpen(booking)}>
      {/* Header */}
      <View style={cardStyles.header}>
        <Text style={cardStyles.code}>{booking.bookingCode}</Text>
        {driverStatus && isActive && (
          <View
            style={[
              cardStyles.statusPill,
              { borderColor: statusColor + '40', backgroundColor: statusColor + '12' },
            ]}>
            <View style={[cardStyles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[cardStyles.statusText, { color: statusColor }]}>
              {t(STATUS_LABEL_KEY[driverStatus])}
            </Text>
          </View>
        )}
        {isCompleted && (
          <View
            style={[
              cardStyles.statusPill,
              { borderColor: '#16A34A40', backgroundColor: '#16A34A12' },
            ]}>
            <CheckCircle size={10} color="#16A34A" />
            <Text style={[cardStyles.statusText, { color: '#16A34A' }]}>
              {t('trips.completed')}
            </Text>
          </View>
        )}
        {isCancelled && (
          <View
            style={[
              cardStyles.statusPill,
              { borderColor: '#DC262640', backgroundColor: '#DC262612' },
            ]}>
            <Text style={[cardStyles.statusText, { color: '#DC2626' }]}>
              {t('trips.cancelled')}
            </Text>
          </View>
        )}
      </View>

      {/* Date */}
      <Text style={cardStyles.date}>{formatDateTime(booking.startDate)}</Text>

      {/* Route */}
      <View style={cardStyles.route}>
        <View style={cardStyles.routeRow}>
          <MapPin size={13} color={theme.colors.primary} />
          <Text style={cardStyles.routeText} numberOfLines={1}>
            {biz.pickupLocation.displayName}
          </Text>
        </View>
        <View style={cardStyles.routeConnector} />
        <View style={cardStyles.routeRow}>
          <Flag size={13} color={theme.colors.accent} />
          <Text style={cardStyles.routeText} numberOfLines={1}>
            {biz.dropoffLocation.displayName}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={cardStyles.divider} />

      {/* ── Customer, vehicle, payout ── */}
      <View style={cardStyles.footer}>
        <View style={cardStyles.customerRow}>
          <View style={cardStyles.customerAvatar}>
            <User size={15} color={theme.colors.primaryTextAccent} />
          </View>
          <View style={cardStyles.customerText}>
            <Text style={cardStyles.customerName} numberOfLines={1}>
              {biz.customer?.name ?? '—'}
            </Text>
            <View style={cardStyles.vehicleRow}>
              <Car size={12} color={theme.colors.textColor} />
              <Text style={cardStyles.vehicleText} numberOfLines={1}>
                {biz.car?.brand
                  ? `${biz.car.brand}${biz.car.model ? ` ${biz.car.model}` : ''}`
                  : (biz.carType?.name ?? '—')}
              </Text>
            </View>
          </View>

          {/* Reach the customer straight from the list — no need to open the trip */}
          {biz.customer?.phone && !isCancelled && (
            <View style={cardStyles.contactRow}>
              <TouchableOpacity
                style={cardStyles.iconBtn}
                hitSlop={8}
                onPress={() => callCustomer(biz.customer?.phone)}>
                <Phone size={15} color={theme.colors.primaryTextAccent} />
              </TouchableOpacity>
              <TouchableOpacity
                style={cardStyles.iconBtn}
                hitSlop={8}
                onPress={() => messageCustomer(biz.customer?.phone)}>
                <MessageSquare size={15} color={theme.colors.secondaryText} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* The driver's own payout — never the trip total, which the backend
            strips out of every driver-facing response. */}
        {booking.driverEarnings?.amount != null && (
          <View style={cardStyles.earningsRow}>
            <Text style={cardStyles.earningsLabel}>
              {isCompleted ? t('trip.youEarned') : t('trip.youEarn')}
            </Text>
            <Text style={cardStyles.price}>
              {formatCurrency(
                booking.driverEarnings.amount,
                booking.driverEarnings.currencyCode
              )}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export const TripsScreen = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<DriverTabKey>('upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const [openTrip, setOpenTrip] = useState<Booking | null>(null);
  const userInfo = useReactiveVar(userData);

  const { data, loading, refetch } = useQuery<{ getDriverBookings: Booking[] }>(
    getDriverBookingsQuery,
    {
      variables: { tenant: ENV_Vars.tenant },
      fetchPolicy: 'network-only',
      skip: !userInfo?.id,
    }
  );

  const bookings = data?.getDriverBookings ?? [];
  const counts: Record<DriverTabKey, number> = {
    upcoming: filterDriverBookings(bookings, 'upcoming').length,
    past: filterDriverBookings(bookings, 'past').length,
    cancelled: filterDriverBookings(bookings, 'cancelled').length,
  };
  const filtered = filterDriverBookings(bookings, activeTab);

  // Re-read from fresh data so a status change updates the open sheet.
  const openTripLive = openTrip ? (bookings.find((b) => b.id === openTrip.id) ?? openTrip) : null;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <PageSafeContainer style={styles.page}>
      <ScreenHeader
        title={t('trips.title')}
        subtitle={t('trips.summary', { upcoming: counts.upcoming, past: counts.past })}
      />

      <TabBar active={activeTab} counts={counts} onChange={setActiveTab} />

      {loading && !refreshing ? (
        <View style={styles.center}>
          <LoadingSpinner />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => <DriverTripCard booking={item} onOpen={setOpenTrip} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <CircleDot size={28} color={theme.colors.borderNeutralColor} />
              <Text style={styles.emptyText}>
                {t('trips.empty', { tab: t(`trips.${activeTab === 'past' ? 'completed' : activeTab}` as TKey).toLowerCase() })}
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}

      <TripDetailModal
        booking={openTripLive}
        visible={!!openTrip}
        onClose={() => setOpenTrip(null)}
        onChanged={refetch}
      />
    </PageSafeContainer>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Transparent so BodyWrapper's gradient shows through.
  page: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100,
    paddingTop: theme.spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 80,
  },
  emptyText: { fontSize: 16, color: theme.colors.textColor },
});

const tabStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: 6,
    marginBottom: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.secondary,
  },
  tabActive: { backgroundColor: theme.colors.primaryAlpha[10] },
  label: { fontSize: 14, color: theme.colors.textColor, fontWeight: '500' },
  labelActive: { color: theme.colors.primary, fontWeight: '600' },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.borderNeutralColor,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeActive: { backgroundColor: theme.colors.primaryAlpha[20] },
  badgeText: { fontSize: 11, color: theme.colors.textColor, fontWeight: '700' },
  badgeTextActive: { color: theme.colors.primary },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderNeutralColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardCancelled: { borderColor: '#FCA5A5', backgroundColor: '#FFF5F5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  code: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textColor,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.full,
    borderWidth: 0.5,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  date: { fontSize: 13, color: theme.colors.textColor, marginBottom: 10 },
  route: { gap: 4, marginBottom: 12 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  routeConnector: {
    width: 1,
    height: 10,
    backgroundColor: theme.colors.borderNeutralColor,
    marginLeft: 6,
  },
  routeText: { flex: 1, fontSize: 14, color: theme.colors.primaryText, fontWeight: '500' },
  divider: { height: 1, backgroundColor: theme.colors.borderNeutralColor, marginBottom: 10 },
  footer: { gap: theme.spacing.md },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  customerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryAlpha[10],
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerText: { flex: 1 },
  customerName: {
    fontSize: typography.md,
    fontWeight: '600',
    color: theme.colors.primaryText,
  },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  vehicleText: { fontSize: typography.xs, color: theme.colors.textColor, flex: 1 },
  contactRow: { flexDirection: 'row', gap: 6 },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.baseGray,
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  earningsLabel: { fontSize: typography.xs, color: theme.colors.textColor },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primaryTextAccent,
  },
});
