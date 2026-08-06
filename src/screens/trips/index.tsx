import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
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
import { TripListSkeleton } from '~/components/loadingSkeletons';
import { TripDetailModal } from './components/tripDetailModal';
import { STATUS_LABEL_KEY, callCustomer, messageCustomer } from './hooks/useTripActions';
import { typography } from '~/theme/typography';
import { surfaces } from '~/theme/surfaces';
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
import { TAB_BAR_CLEARANCE } from '~/navigation/bottomBar';

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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={tabStyles.scroller}
      contentContainerStyle={tabStyles.wrapper}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onChange(tab.key)}
          style={[tabStyles.tab, active === tab.key && tabStyles.tabActive]}>
          <Text
            numberOfLines={1}
            style={[tabStyles.label, active === tab.key && tabStyles.labelActive]}>
            {t(tab.labelKey)}
          </Text>
          {counts[tab.key] > 0 && (
            <View style={[tabStyles.badge, active === tab.key && tabStyles.badgeActive]}>
              <Text style={[tabStyles.badgeText, active === tab.key && tabStyles.badgeTextActive]}>
                {counts[tab.key]}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
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
              {formatCurrency(booking.driverEarnings.amount, booking.driverEarnings.currencyCode)}
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
  // While the user hydrates from storage the query is skipped and Apollo
  // reports loading:false, which flashed "no trips" before the first request.
  const showSkeleton = !userInfo?.id || (loading && !refreshing);
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

      {showSkeleton ? (
        <View style={styles.skeleton}>
          <TripListSkeleton />
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
                {t('trips.empty', {
                  tab: t(
                    `trips.${activeTab === 'past' ? 'completed' : activeTab}` as TKey
                  ).toLowerCase(),
                })}
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
  skeleton: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: TAB_BAR_CLEARANCE,
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

/**
 * A contained segmented control, matching the dashboard's.
 *
 * The previous version was loose pills tinted 10% gold on a grey chip — against
 * the gold body gradient they read as plain text rather than a control, and the
 * active label used the brand gold, which is only 2.2:1 on white. A solid track
 * with a raised white pill makes the selection unmistakable.
 */
/**
 * Individual chips rather than one segmented track.
 *
 * The track version read as a single grey block with three labels in it — there
 * was nothing separating an inactive tab from its neighbour. Each chip now
 * carries its own surface and border, so they're distinct whether selected or
 * not.
 *
 * The scroller deliberately bleeds past both screen edges (no horizontal
 * margin; the inset lives on the content instead). When the chips overflow, one
 * is clipped at the edge, which is what tells the driver the row scrolls.
 */
const tabStyles = StyleSheet.create({
  scroller: {
    // flexGrow: 0 stops the row expanding; flexShrink: 0 stops it being
    // compressed. Both are needed. The screen is a flex column - header, this
    // row, then the trip list - and the list creates enough pressure to squash
    // this scroller vertically, which clipped the chips and cut their labels.
    // Removing the list made the symptom vanish, which is what pinned it here.
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: theme.spacing.md,
  },
  wrapper: {
    flexDirection: 'row',
    // Required now the chip sets its own height. A ScrollView's content
    // container defaults to alignItems: 'stretch', and on a horizontal
    // scroller the cross axis is vertical - so it stretches each chip to the
    // container's height while the container's height is itself derived from
    // the chips. Centring opts the chips out of that and lets height: 42 hold.
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  tab: {
    // Never let a chip be compressed to fit the viewport. Without this the row
    // squeezes every chip once the three no longer fit - which is why selecting
    // Completed, the longest label, cut all three at once - and the label ends
    // up clipped inside a chip narrower than its own text. The scroller is what
    // handles overflow; the chips keep their natural width.
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.cardBackground,
  },
  tabActive: {
    backgroundColor: theme.colors.primaryText,
    borderColor: theme.colors.primaryText,
  },
  label: {
    // Matches the badge's flexShrink: 0. The chip is sized by its contents, so
    // anything here that can shrink is a way for the text to be cut.
    flexShrink: 0,
    fontSize: typography.xs,
    color: theme.colors.secondaryText,
    fontWeight: '700',
  },
  labelActive: { color: '#FFFFFF', fontWeight: '700' },
  badge: {
    flexShrink: 0,
    minWidth: 18,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.baseGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActive: { backgroundColor: theme.colors.primary },
  badgeText: {
    fontSize: typography.xxs - 1,
    color: theme.colors.textColor,
    fontWeight: '700',
  },
  // Ink on gold — white is 2.2:1, and this is the smallest type in the app.
  badgeTextActive: { color: theme.colors.primaryText },
});

const cardStyles = StyleSheet.create({
  card: {
    ...surfaces.card,
    padding: theme.spacing.lg,
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
    borderRadius: theme.borderRadius.lg,
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
    borderRadius: theme.borderRadius.lg,
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
