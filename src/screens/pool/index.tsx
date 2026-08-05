import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { Clock, MapPin, Navigation, Zap } from 'lucide-react-native';

import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { ENV_Vars } from '~/store/env';
import { getOpenTripsQuery } from '~/screens/trips/graphql/queries';
import { claimTripMutation } from '~/screens/trips/graphql/mutation';
import { getDriverBookingsQuery } from '~/screens/trips/graphql/queries';
import { Booking } from '~/screens/trips/interfaces';
import { formatDateTime } from '~/screens/trips/helpers';

const formatEarnings = (booking: Booking) => {
  if (!booking.driverEarnings) return null;
  const { amount, currencyCode } = booking.driverEarnings;
  const symbol = currencyCode === 'USD' ? '$' : '';
  return `${symbol}${amount.toFixed(2)}`;
};

export const OpenTripCard = ({
  booking,
  onClaim,
  claiming,
}: {
  booking: Booking;
  onClaim: (booking: Booking) => void;
  claiming: boolean;
}) => {
  const earnings = formatEarnings(booking);
  const { pickupLocation, dropoffLocation } = booking.bookingBusinessData ?? {};

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.codeWrap}>
          <Text style={styles.code}>#{booking.bookingCode}</Text>
          <View style={styles.timeRow}>
            <Clock size={13} color={theme.colors.textColor} />
            <Text style={styles.time}>{formatDateTime(booking.startDate)}</Text>
          </View>
        </View>
        {/* The number that decides whether they take it — lead with it. */}
        {earnings && (
          <View style={styles.earningsPill}>
            <Text style={styles.earningsLabel}>You earn</Text>
            <Text style={styles.earningsValue}>{earnings}</Text>
          </View>
        )}
      </View>

      <View style={styles.routeBlock}>
        <View style={styles.routeRow}>
          <MapPin size={15} color={theme.colors.primary} />
          <Text style={styles.routeText} numberOfLines={1}>
            {pickupLocation?.displayName ?? '—'}
          </Text>
        </View>
        {dropoffLocation?.displayName ? (
          <View style={styles.routeRow}>
            <Navigation size={15} color={theme.colors.textColor} />
            <Text style={styles.routeText} numberOfLines={1}>
              {dropoffLocation.displayName}
            </Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.claimButton, claiming && styles.claimButtonDisabled]}
        disabled={claiming}
        onPress={() => onClaim(booking)}>
        {claiming ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Zap size={16} color="#FFFFFF" />
            <Text style={styles.claimText}>Claim this trip</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const PoolScreen = ({ onBack }: { onBack?: () => void }) => {
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery<{ getOpenTrips: Booking[] }>(
    getOpenTripsQuery,
    {
      variables: { tenant: ENV_Vars.tenant },
      fetchPolicy: 'network-only',
    }
  );

  const [claimTripFn] = useMutation(claimTripMutation, {
    refetchQueries: [
      { query: getOpenTripsQuery, variables: { tenant: ENV_Vars.tenant } },
      { query: getDriverBookingsQuery, variables: { tenant: ENV_Vars.tenant } },
    ],
  });

  const trips = data?.getOpenTrips ?? [];

  const handleClaim = async (booking: Booking) => {
    setClaimingId(booking.id);
    try {
      await claimTripFn({
        variables: { tenant: ENV_Vars.tenant, bookingId: booking.id },
      });
      Alert.alert('Trip claimed', "It's yours. You'll find it under Trips.");
    } catch (error: any) {
      // Losing a race is normal here, not an error state — the backend's
      // conditional write guarantees exactly one winner.
      Alert.alert(
        'Trip unavailable',
        error?.message ?? 'This trip has already been taken by another driver.'
      );
      await refetch();
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <BodyWrapper>
      <PageSafeContainer>
        <Header title="Open trips" onBack={onBack} />
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={theme.colors.primary}
            />
          }
          renderItem={({ item }) => (
            <OpenTripCard
              booking={item}
              claiming={claimingId === item.id}
              onClaim={handleClaim}
            />
          )}
          ListEmptyComponent={
            loading ? null : (
              <View style={styles.empty}>
                <Zap size={28} color={theme.colors.borderNeutralColor} />
                <Text style={styles.emptyTitle}>No open trips right now</Text>
                <Text style={styles.emptyBody}>
                  When your operator publishes a trip to the pool, it shows up
                  here and the first driver to claim it gets it.
                </Text>
              </View>
            )
          }
        />
      </PageSafeContainer>
    </BodyWrapper>
  );
};

const styles = StyleSheet.create({
  list: { padding: theme.spacing.lg, gap: theme.spacing.md, flexGrow: 1 },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  codeWrap: { flex: 1, gap: 4 },
  code: { fontSize: 15, fontWeight: '700', color: theme.colors.primaryText },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  time: { fontSize: 13, color: theme.colors.textColor },
  earningsPill: {
    backgroundColor: theme.colors.primaryAlpha[10],
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'flex-end',
  },
  earningsLabel: { fontSize: 10, color: theme.colors.textColor },
  earningsValue: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  routeBlock: { gap: theme.spacing.sm },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  routeText: { flex: 1, fontSize: 14, color: theme.colors.secondaryText },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
  },
  claimButtonDisabled: { opacity: 0.6 },
  claimText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primaryText,
    marginTop: theme.spacing.sm,
  },
  emptyBody: {
    fontSize: 13,
    color: theme.colors.textColor,
    textAlign: 'center',
  },
});
