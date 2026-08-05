import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import {
  Car,
  ChevronRight,
  Clock,
  Flag,
  MapPin,
  Navigation2,
  Phone,
  Zap,
} from 'lucide-react-native';

import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { ScreenHeader } from '~/codidge_components/UI/screenHeader';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { typography } from '~/theme/typography';
import { surfaces } from '~/theme/surfaces';
import { userData } from '~/store/user';
import { ENV_Vars } from '~/store/env';
import {
  getDriverBookingsQuery,
  getOpenTripsQuery,
} from '~/screens/trips/graphql/queries';
import { Booking } from '~/screens/trips/interfaces';
import { formatDateTime } from '~/screens/trips/helpers';
import { TripDetailModal } from '~/screens/trips/components/tripDetailModal';
import { claimTripMutation } from '~/screens/trips/graphql/mutation';
import {
  NEXT_ACTION_KEY,
  STATUS_LABEL_KEY,
  callCustomer,
  openNavigation,
} from '~/screens/trips/hooks/useTripActions';
import { AvailabilityCard } from './components/availabilityCard';
import { useTranslation } from '~/i18n';

const GOLD = theme.colors.primary;

/** Underway reads as "happening now"; assigned-but-not-started reads as "next". */
const isUnderway = (b: Booking) =>
  b.driverStatus === 'en_route' ||
  b.driverStatus === 'arrived' ||
  b.driverStatus === 'in_progress';

export const HomeScreen = () => {
  const { t } = useTranslation();
  const userInfo = useReactiveVar(userData);
  const [tab, setTab] = useState<'upcoming' | 'pool'>('upcoming');
  const [openTrip, setOpenTrip] = useState<Booking | null>(null);
  const [claimTarget, setClaimTarget] = useState<Booking | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery<{ getDriverBookings: Booking[] }>(
    getDriverBookingsQuery,
    {
      variables: { tenant: ENV_Vars.tenant },
      fetchPolicy: 'network-only',
      skip: !userInfo?.id,
    }
  );

  const { data: poolData, refetch: refetchPool } = useQuery<{
    getOpenTrips: Booking[];
  }>(getOpenTripsQuery, {
    variables: { tenant: ENV_Vars.tenant },
    fetchPolicy: 'cache-and-network',
  });
  const poolTrips = poolData?.getOpenTrips ?? [];

  const [claimTripFn] = useMutation(claimTripMutation, {
    refetchQueries: [
      { query: getOpenTripsQuery, variables: { tenant: ENV_Vars.tenant } },
      { query: getDriverBookingsQuery, variables: { tenant: ENV_Vars.tenant } },
    ],
  });

  const handleClaim = async (booking: Booking) => {
    setClaimingId(booking.id);
    try {
      await claimTripFn({
        variables: { tenant: ENV_Vars.tenant, bookingId: booking.id },
      });
      setClaimTarget(null);
      setTab('upcoming');
      Alert.alert(t('pool.claimedTitle'), t('pool.claimedBody'));
    } catch (error: any) {
      // Losing the race is normal — the backend guarantees one winner.
      Alert.alert(t('pool.takenTitle'), error?.message ?? t('pool.takenBody'));
      await refetchPool();
    } finally {
      setClaimingId(null);
    }
  };

  const bookings = data?.getDriverBookings ?? [];
  const live = bookings.filter(
    (b) =>
      b.status === 'confirmed' ||
      b.status === 'in_progress' ||
      // Assigned but not yet confirmed by the operator — still the driver's job.
      (b.status === 'pending' && !!b.bookingBusinessData?.driver?.id)
  );

  // A trip actually underway wins the hero slot; otherwise the soonest assigned.
  const active =
    live.find(isUnderway) ??
    live
      .filter((b) => b.driverStatus === 'assigned')
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )[0];

  const upcoming = live
    .filter((b) => b.id !== active?.id)
    .sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  // Re-read the open trip from fresh data so advancing a status updates the
  // sheet the driver is currently looking at.
  const openTripLive = openTrip
    ? (bookings.find((b) => b.id === openTrip.id) ?? openTrip)
    : null;

  return (
    <PageSafeContainer style={styles.page}>
      <ScreenHeader eyebrow={t('dashboard.greeting')} title={userInfo?.name ?? t('dashboard.driver')} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor={GOLD}
          />
        }>
        {/* Always visible — a driver must never wonder whether they're on duty */}
        <AvailabilityCard />

        <SegmentedTabs
          tab={tab}
          onChange={setTab}
          upcomingCount={upcoming.length}
          poolCount={poolTrips.length}
        />

        {tab === 'upcoming' ? (
          loading && !bookings.length ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={GOLD} />
            </View>
          ) : active ? (
            <>
              <ActiveTripCard booking={active} onOpen={() => setOpenTrip(active)} />
              {upcoming.map((b) => (
                <TripRow key={b.id} booking={b} onPress={() => setOpenTrip(b)} />
              ))}
            </>
          ) : (
            <View style={styles.noActiveCard}>
              <Car size={34} color={theme.colors.borderStrong} />
              <Text style={styles.noActiveText}>{t('dashboard.noActive')}</Text>
              <Text style={styles.noActiveSubtext}>
                {t('dashboard.noActiveHint')}
              </Text>
            </View>
          )
        ) : poolTrips.length ? (
          poolTrips.map((b) => (
            <TripRow
              key={b.id}
              booking={b}
              highlight
              onPress={() => setClaimTarget(b)}
            />
          ))
        ) : (
          <View style={styles.noActiveCard}>
            <Zap size={30} color={theme.colors.borderStrong} />
            <Text style={styles.noActiveText}>{t('pool.emptyTitle')}</Text>
            <Text style={styles.noActiveSubtext}>{t('pool.emptyBody')}</Text>
          </View>
        )}

      </ScrollView>

      <TripDetailModal
        booking={openTripLive}
        visible={!!openTrip}
        onClose={() => setOpenTrip(null)}
        onChanged={refetch}
      />

      <TripDetailModal
        mode="claim"
        booking={claimTarget}
        visible={!!claimTarget}
        onClose={() => setClaimTarget(null)}
        onClaim={handleClaim}
        claiming={!!claimingId}
      />
    </PageSafeContainer>
  );
};

/** Upcoming vs the open pool, with live counts. */
const SegmentedTabs = ({
  tab,
  onChange,
  upcomingCount,
  poolCount,
}: {
  tab: 'upcoming' | 'pool';
  onChange: (t: 'upcoming' | 'pool') => void;
  upcomingCount: number;
  poolCount: number;
}) => {
  const { t } = useTranslation();
  const items = [
    { key: 'upcoming' as const, label: t('trips.upcoming'), count: upcomingCount },
    { key: 'pool' as const, label: t('pool.title'), count: poolCount },
  ];

  return (
    <View style={styles.segmentWrap}>
      {items.map((item) => {
        const active = tab === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            style={[styles.segment, active && styles.segmentActive]}
            activeOpacity={0.8}
            onPress={() => onChange(item.key)}>
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
              {item.label}
            </Text>
            {item.count > 0 && (
              <View style={[styles.badge, active && styles.badgeActive]}>
                <Text style={[styles.badgeText, active && styles.badgeTextActive]}>
                  {item.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/** One compact row, used by both tabs so the two lists read alike. */
const TripRow = ({
  booking,
  onPress,
  highlight,
}: {
  booking: Booking;
  onPress: () => void;
  highlight?: boolean;
}) => {
  const { t } = useTranslation();
  const earnings = booking.driverEarnings;

  return (
    <TouchableOpacity
      style={[styles.tripRow, highlight && styles.tripRowHighlight]}
      activeOpacity={0.8}
      onPress={onPress}>
      <View style={[styles.tripRowIcon, highlight && styles.tripRowIconHighlight]}>
        {highlight ? (
          <Zap size={16} color={GOLD} />
        ) : (
          <Clock size={16} color={GOLD} />
        )}
      </View>
      <View style={styles.tripRowText}>
        <Text style={styles.tripRowDate}>{formatDateTime(booking.startDate)}</Text>
        <Text style={styles.tripRowPickup} numberOfLines={1}>
          {booking.bookingBusinessData?.pickupLocation?.displayName ?? '—'}
        </Text>
      </View>
      {earnings?.amount != null ? (
        <View style={styles.tripRowEarnings}>
          <Text style={styles.tripRowEarningsLabel}>{t('trip.youEarn')}</Text>
          <Text style={styles.tripRowEarningsValue}>
            {earnings.currencyCode === 'USD' ? '$' : ''}
            {earnings.amount.toFixed(2)}
          </Text>
        </View>
      ) : (
        <ChevronRight size={18} color={theme.colors.borderStrong} />
      )}
    </TouchableOpacity>
  );
};

/**
 * The hero card. Deliberately shallow — status, where to go next, and the two
 * actions a driver reaches for without opening anything. Detail lives in the
 * modal so this stays glanceable at arm's length.
 */
const ActiveTripCard = ({
  booking,
  onOpen,
}: {
  booking: Booking;
  onOpen: () => void;
}) => {
  const { t } = useTranslation();
  const status = booking.driverStatus ?? 'assigned';
  const underway = isUnderway(booking);
  const biz = booking.bookingBusinessData;

  const heading =
    status === 'in_progress'
      ? {
          label: t('trip.dropoff'),
          loc: biz?.dropoffLocation,
          Icon: Flag,
          tint: theme.colors.accent,
        }
      : { label: t('trip.pickup'), loc: biz?.pickupLocation, Icon: MapPin, tint: GOLD };

  const HeadingIcon = heading.Icon;

  return (
    <TouchableOpacity style={styles.activeCard} activeOpacity={0.9} onPress={onOpen}>
      <View style={styles.activeTop}>
        <View style={styles.activeBadge}>
          <View
            style={[
              styles.activeDot,
              { backgroundColor: underway ? theme.colors.success : GOLD },
            ]}
          />
          <Text style={styles.activeBadgeText}>
            {underway ? t('dashboard.inProgress') : t('dashboard.nextTrip')}
          </Text>
        </View>
        <Text style={styles.activeCode}>#{booking.bookingCode}</Text>
      </View>

      <Text style={styles.activeStatus}>{t(STATUS_LABEL_KEY[status])}</Text>
      <Text style={styles.activeTime}>{formatDateTime(booking.startDate)}</Text>

      <View style={styles.headingRow}>
        <HeadingIcon size={16} color={heading.tint} />
        <View style={styles.headingText}>
          <Text style={styles.headingLabel}>{heading.label}</Text>
          <Text style={styles.headingName} numberOfLines={1}>
            {heading.loc?.displayName ?? '—'}
          </Text>
        </View>
      </View>

      <View style={styles.quickRow}>
        <TouchableOpacity
          style={styles.quickBtn}
          activeOpacity={0.75}
          onPress={() =>
            openNavigation(
              heading.loc?.formattedAddress ?? heading.loc?.displayName,
              heading.label
            )
          }>
          <Navigation2 size={16} color={theme.colors.secondaryText} />
          <Text style={styles.quickText}>{t('action.navigate')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickBtn}
          activeOpacity={0.75}
          onPress={() => callCustomer(biz?.customer?.phone)}>
          <Phone size={16} color={theme.colors.secondaryText} />
          <Text style={styles.quickText}>{t('action.call')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.openRow}>
        <Text style={styles.openText}>
          {NEXT_ACTION_KEY[status]
            ? t(NEXT_ACTION_KEY[status]!)
            : t('dashboard.openTrip')}
        </Text>
        <ChevronRight size={20} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Transparent so BodyWrapper's gradient shows through.
  page: { flex: 1 },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 120,
    gap: theme.spacing.lg,
  },


  loadingBox: { paddingVertical: 48, alignItems: 'center' },

  segmentWrap: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: theme.colors.baseGray,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: 4,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: theme.borderRadius.sm,
  },
  segmentActive: { backgroundColor: theme.colors.cardBackground },
  segmentText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: theme.colors.textColor,
  },
  segmentTextActive: { color: theme.colors.primaryText, fontWeight: '700' },
  badge: {
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.borderStrong,
    alignItems: 'center',
  },
  badgeActive: { backgroundColor: theme.colors.primary },
  badgeText: { fontSize: typography.xxs, fontWeight: '700', color: '#FFFFFF' },
  badgeTextActive: { color: '#FFFFFF' },

  tripRow: {
    ...surfaces.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  tripRowHighlight: { borderColor: theme.colors.primaryAlpha[35] },
  tripRowIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.primaryAlpha[10],
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripRowIconHighlight: { backgroundColor: theme.colors.primaryAlpha[20] },
  tripRowText: { flex: 1 },
  tripRowDate: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: theme.colors.primaryText,
  },
  tripRowPickup: {
    fontSize: typography.xs,
    color: theme.colors.textColor,
    marginTop: 1,
  },
  tripRowEarnings: { alignItems: 'flex-end' },
  tripRowEarningsLabel: { fontSize: typography.xxs, color: theme.colors.textColor },
  tripRowEarningsValue: {
    fontSize: typography.md,
    fontWeight: '700',
    color: theme.colors.primaryTextAccent,
  },

  activeCard: { ...surfaces.card, padding: theme.spacing.lg, gap: 6 },
  activeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  activeDot: { width: 9, height: 9, borderRadius: 5 },
  activeBadgeText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: theme.colors.textColor,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  activeCode: { fontSize: typography.xs, color: theme.colors.textColor },
  activeStatus: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: theme.colors.primaryText,
    letterSpacing: -0.3,
    marginTop: 2,
  },
  activeTime: { fontSize: typography.sm, color: theme.colors.textColor },

  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  headingText: { flex: 1 },
  headingLabel: { fontSize: typography.xs, color: theme.colors.textColor },
  headingName: {
    fontSize: typography.md,
    fontWeight: '600',
    color: theme.colors.primaryText,
    marginTop: 1,
  },

  quickRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.baseGray,
  },
  quickText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: theme.colors.secondaryText,
  },

  openRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primaryText,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 16,
  },
  openText: { color: '#FFFFFF', fontSize: typography.md, fontWeight: '700' },

  noActiveCard: {
    ...surfaces.card,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: theme.spacing.lg,
    gap: 6,
  },
  noActiveText: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: theme.colors.secondaryText,
    marginTop: 6,
  },
  noActiveSubtext: {
    fontSize: typography.sm,
    color: theme.colors.textColor,
    textAlign: 'center',
  },

});
