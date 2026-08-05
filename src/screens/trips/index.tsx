import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { ENV_Vars } from '~/store/env';
import { getDriverBookingsQuery } from './graphql/queries';
import { updateDriverStatusMutation } from './graphql/mutation';
import { Booking } from './interfaces';
import { filterByTab, formatCurrency, formatDateTime } from './helpers';
import { LoadingSpinner } from '~/codidge_components/UI/loading/loadingSpinner';
import {
  MapPin,
  Flag,
  User,
  Car,
  Navigation,
  CircleDot,
  CheckCircle,
  Phone,
} from 'lucide-react-native';
import { TouchableOpacity, Linking } from 'react-native';

type DriverTabKey = 'upcoming' | 'past' | 'cancelled';

const TABS: { key: DriverTabKey; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const NEXT_STATUS: Record<string, string> = {
  assigned: 'en_route',
  en_route: 'arrived',
  arrived: 'in_progress',
  in_progress: 'completed',
};

const NEXT_LABEL: Record<string, string> = {
  assigned: 'Start driving →',
  en_route: 'Mark arrived →',
  arrived: 'Begin trip →',
  in_progress: 'Complete trip →',
};

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
      if (tab === 'upcoming')
        return b.status === 'confirmed' || b.status === 'in_progress';
      if (tab === 'past') return b.status === 'completed';
      if (tab === 'cancelled') return b.status === 'cancelled';
      return false;
    })
    .sort(
      (a, b) =>
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
  onChange: (t: DriverTabKey) => void;
}) => (
  <View style={tabStyles.wrapper}>
    {TABS.map((t) => (
      <TouchableOpacity
        key={t.key}
        onPress={() => onChange(t.key)}
        style={[tabStyles.tab, active === t.key && tabStyles.tabActive]}>
        <Text style={[tabStyles.label, active === t.key && tabStyles.labelActive]}>
          {t.label}
        </Text>
        {counts[t.key] > 0 && (
          <View style={[tabStyles.badge, active === t.key && tabStyles.badgeActive]}>
            <Text style={[tabStyles.badgeText, active === t.key && tabStyles.badgeTextActive]}>
              {counts[t.key]}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    ))}
  </View>
);

// ─── Trip card ────────────────────────────────────────────────────────────────

const DriverTripCard = ({
  booking,
  onStatusUpdate,
  updatingId,
}: {
  booking: Booking;
  onStatusUpdate: (id: string, status: string) => void;
  updatingId: string | null;
}) => {
  const { bookingBusinessData: biz, driverStatus, status } = booking;
  const isActive = status === 'confirmed' || status === 'in_progress';
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';
  const nextStatus = driverStatus ? NEXT_STATUS[driverStatus] : null;
  const isUpdating = updatingId === booking.id;

  const statusColor = driverStatus ? STATUS_COLOR[driverStatus] : theme.colors.textColor;

  return (
    <View style={[cardStyles.card, isCancelled && cardStyles.cardCancelled]}>
      {/* Header */}
      <View style={cardStyles.header}>
        <Text style={cardStyles.code}>{booking.bookingCode}</Text>
        {driverStatus && isActive && (
          <View style={[cardStyles.statusPill, { borderColor: statusColor + '40', backgroundColor: statusColor + '12' }]}>
            <View style={[cardStyles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[cardStyles.statusText, { color: statusColor }]}>
              {driverStatus.replace('_', ' ')}
            </Text>
          </View>
        )}
        {isCompleted && (
          <View style={[cardStyles.statusPill, { borderColor: '#16A34A40', backgroundColor: '#16A34A12' }]}>
            <CheckCircle size={10} color="#16A34A" />
            <Text style={[cardStyles.statusText, { color: '#16A34A' }]}>Completed</Text>
          </View>
        )}
        {isCancelled && (
          <View style={[cardStyles.statusPill, { borderColor: '#DC262640', backgroundColor: '#DC262612' }]}>
            <Text style={[cardStyles.statusText, { color: '#DC2626' }]}>Cancelled</Text>
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

      {/* Customer + vehicle row */}
      <View style={cardStyles.meta}>
        <View style={cardStyles.metaItem}>
          <User size={12} color={theme.colors.textColor} />
          <Text style={cardStyles.metaText} numberOfLines={1}>
            {biz.customer?.name ?? '—'}
          </Text>
          {biz.customer?.phone && (
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${biz.customer.phone}`)}
              style={cardStyles.callBtn}>
              <Phone size={11} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        <View style={cardStyles.metaItem}>
          <Car size={12} color={theme.colors.textColor} />
          <Text style={cardStyles.metaText}>{biz.car?.brand ?? biz.carType?.name ?? '—'}</Text>
        </View>
        {/* The driver's own payout — never the trip total, which the backend
            strips out of every driver-facing response. */}
        {booking.driverEarnings?.amount != null && (
          <View style={cardStyles.earningsWrap}>
            <Text style={cardStyles.earningsLabel}>You earn</Text>
            <Text style={cardStyles.price}>
              {formatCurrency(
                booking.driverEarnings.amount,
                booking.driverEarnings.currencyCode
              )}
            </Text>
          </View>
        )}
      </View>

      {/* CTA */}
      {isActive && nextStatus && (
        <TouchableOpacity
          onPress={() => onStatusUpdate(booking.id, nextStatus)}
          disabled={isUpdating}
          style={[cardStyles.cta, isUpdating && cardStyles.ctaDisabled]}>
          <Text style={cardStyles.ctaText}>
            {isUpdating ? 'Updating…' : NEXT_LABEL[driverStatus!]}
          </Text>
          {!isUpdating && <Navigation size={14} color="#fff" />}
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export const TripsScreen = () => {
  const [activeTab, setActiveTab] = useState<DriverTabKey>('upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const userInfo = useReactiveVar(userData);

  const { data, loading, refetch } = useQuery<{ getDriverBookings: Booking[] }>(
    getDriverBookingsQuery,
    {
      variables: { tenant: ENV_Vars.tenant },
      fetchPolicy: 'network-only',
      skip: !userInfo?.id,
    }
  );

  const [updateStatus] = useMutation(updateDriverStatusMutation);

  const bookings = data?.getDriverBookings ?? [];
  const counts: Record<DriverTabKey, number> = {
    upcoming: filterDriverBookings(bookings, 'upcoming').length,
    past: filterDriverBookings(bookings, 'past').length,
    cancelled: filterDriverBookings(bookings, 'cancelled').length,
  };
  const filtered = filterDriverBookings(bookings, activeTab);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      await updateStatus({
        variables: {
          tenant: ENV_Vars.tenant,
          bookingId,
          driverStatus: newStatus,
        },
      });
      await refetch();
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

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
      {/* Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>My Trips</Text>
      </View>

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
          renderItem={({ item }) => (
            <DriverTripCard
              booking={item}
              onStatusUpdate={handleStatusUpdate}
              updatingId={updatingId}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <CircleDot size={28} color={theme.colors.borderNeutralColor} />
              <Text style={styles.emptyText}>No {activeTab} trips</Text>
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
    </PageSafeContainer>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: theme.colors.bodyBackground },
  pageHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.primaryText,
  },
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
  emptyText: { fontSize: 15, color: theme.colors.textColor },
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
  label: { fontSize: 13, color: theme.colors.textColor, fontWeight: '500' },
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
  badgeText: { fontSize: 10, color: theme.colors.textColor, fontWeight: '700' },
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
    fontSize: 11,
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
  statusText: { fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  date: { fontSize: 12, color: theme.colors.textColor, marginBottom: 10 },
  route: { gap: 4, marginBottom: 12 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  routeConnector: {
    width: 1,
    height: 10,
    backgroundColor: theme.colors.borderNeutralColor,
    marginLeft: 6,
  },
  routeText: { flex: 1, fontSize: 13, color: theme.colors.primaryText, fontWeight: '500' },
  divider: { height: 1, backgroundColor: theme.colors.borderNeutralColor, marginBottom: 10 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  metaText: { fontSize: 12, color: theme.colors.secondaryText, flex: 1 },
  callBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryAlpha[10],
    alignItems: 'center',
    justifyContent: 'center',
  },
  earningsWrap: { alignItems: 'flex-end', marginLeft: 'auto' },
  earningsLabel: { fontSize: 10, color: theme.colors.textColor },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  cta: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
