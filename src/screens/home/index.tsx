import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { userData } from '~/store/user';
import { ENV_Vars } from '~/store/env';
import { getDriverBookingsQuery } from '~/screens/trips/graphql/queries';
import { updateDriverStatusMutation } from '~/screens/trips/graphql/mutation';
import { updateDriverMutation } from '~/screens/auth/graphql/mutations';
import { Booking } from '~/screens/trips/interfaces';
import { formatDateTime } from '~/screens/trips/helpers';
import {
  MapPin,
  Clock,
  User,
  Car,
  CheckCircle,
  Navigation,
  CircleDot,
  Flag,
} from 'lucide-react-native';
import { setActiveTab } from '~/store/navigationTabs';
import { PageTransition } from '~/codidge_components/UI/pageTransition';
import { PoolScreen } from '~/screens/pool';
import { getOpenTripsQuery } from '~/screens/trips/graphql/queries';
import { Zap, ChevronRight } from 'lucide-react-native';

const GOLD = theme.colors.primary;

const STATUS_STEPS: { key: Booking['driverStatus']; label: string; icon: any }[] = [
  { key: 'assigned', label: 'Assigned', icon: CheckCircle },
  { key: 'en_route', label: 'En Route', icon: Navigation },
  { key: 'arrived', label: 'Arrived', icon: CircleDot },
  { key: 'in_progress', label: 'In Progress', icon: Car },
  { key: 'completed', label: 'Completed', icon: Flag },
];

const NEXT_STATUS: Record<string, Booking['driverStatus']> = {
  assigned: 'en_route',
  en_route: 'arrived',
  arrived: 'in_progress',
  in_progress: 'completed',
};

const NEXT_LABEL: Record<string, string> = {
  assigned: 'Start driving',
  en_route: 'Mark arrived',
  arrived: 'Begin trip',
  in_progress: 'Complete trip',
};

export const HomeScreen = () => {
  const userInfo = useReactiveVar(userData);

  const { data, loading, refetch } = useQuery<{ getDriverBookings: Booking[] }>(
    getDriverBookingsQuery,
    {
      variables: { tenant: ENV_Vars.tenant },
      fetchPolicy: 'network-only',
      skip: !userInfo?.id,
    }
  );

  const [updateStatus, { loading: updatingStatus }] = useMutation(updateDriverStatusMutation);
  const [updateDriver, { loading: updatingAvailability }] = useMutation(updateDriverMutation);

  const bookings = data?.getDriverBookings ?? [];
  const active = bookings.find(
    (b) => b.status === 'confirmed' && b.driverStatus !== 'completed'
  );
  const upcoming = bookings.filter(
    (b) => b.status === 'confirmed' && b.driverStatus === 'assigned' && b.id !== active?.id
  );

  const handleStatusUpdate = async (bookingId: string, newStatus: Booking['driverStatus']) => {
    if (!newStatus) return;
    try {
      await updateStatus({
        variables: {
          tenant: ENV_Vars.tenant,
          bookingId,
          driverStatus: newStatus,
        },
      });
      refetch();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const toggleAvailability = async () => {
    if (!userInfo?.id) return;
    try {
      await updateDriver({
        variables: {
          tenant: ENV_Vars.tenant,
          driverId: userInfo.id,
          driver: { available: !userInfo.available },
        },
      });
    } catch (err) {
      console.error('Availability toggle failed:', err);
    }
  };

  const isAvailable = userInfo?.available ?? false;

  const [showPool, setShowPool] = useState(false);

  // Only tenants running an open pool get anything back here, so the section
  // simply never renders for the rest.
  const { data: poolData } = useQuery<{ getOpenTrips: Booking[] }>(getOpenTripsQuery, {
    variables: { tenant: ENV_Vars.tenant },
    fetchPolicy: 'cache-and-network',
  });
  const openTripCount = poolData?.getOpenTrips?.length ?? 0;

  return (
    <PageSafeContainer style={styles.page}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good day,</Text>
            <Text style={styles.driverName}>{userInfo?.name ?? 'Driver'}</Text>
          </View>
          <TouchableOpacity
            onPress={toggleAvailability}
            disabled={updatingAvailability}
            style={[
              styles.availabilityBadge,
              isAvailable ? styles.availableOn : styles.availableOff,
            ]}>
            {updatingAvailability ? (
              <ActivityIndicator size="small" color={isAvailable ? '#fff' : GOLD} />
            ) : (
              <Text
                style={[
                  styles.availabilityText,
                  isAvailable ? styles.availableTextOn : styles.availableTextOff,
                ]}>
                {isAvailable ? 'Available' : 'Off Duty'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Open pool — only when there is something to claim */}
        {openTripCount > 0 && (
          <TouchableOpacity style={styles.poolBanner} onPress={() => setShowPool(true)}>
            <View style={styles.poolIcon}>
              <Zap size={16} color={GOLD} />
            </View>
            <View style={styles.poolTextWrap}>
              <Text style={styles.poolTitle}>
                {openTripCount} trip{openTripCount === 1 ? '' : 's'} available
              </Text>
              <Text style={styles.poolSubtitle}>First to claim gets it</Text>
            </View>
            <ChevronRight size={18} color={theme.colors.textColor} />
          </TouchableOpacity>
        )}

        {/* Active trip */}
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={GOLD} />
          </View>
        ) : active ? (
          <View style={styles.activeCard}>
            <View style={styles.activeCardHeader}>
              <View style={styles.activePulseDot} />
              <Text style={styles.activeCardTitle}>Active Trip</Text>
              <Text style={styles.activeCode}>{active.bookingCode}</Text>
            </View>

            {/* Progress stepper */}
            <View style={styles.stepper}>
              {STATUS_STEPS.map((step, idx) => {
                const stepIndex = STATUS_STEPS.findIndex((s) => s.key === active.driverStatus);
                const isDone = idx < stepIndex;
                const isCurrent = idx === stepIndex;
                const IconComp = step.icon;
                return (
                  <React.Fragment key={String(step.key)}>
                    <View style={styles.stepItem}>
                      <View
                        style={[
                          styles.stepDot,
                          isDone && styles.stepDotDone,
                          isCurrent && styles.stepDotCurrent,
                        ]}>
                        <IconComp
                          size={12}
                          color={isCurrent ? '#fff' : isDone ? GOLD : '#CBD5E1'}
                          strokeWidth={2}
                        />
                      </View>
                      <Text style={[styles.stepLabel, isCurrent && styles.stepLabelActive]}>
                        {step.label}
                      </Text>
                    </View>
                    {idx < STATUS_STEPS.length - 1 && (
                      <View style={[styles.stepLine, isDone && styles.stepLineDone]} />
                    )}
                  </React.Fragment>
                );
              })}
            </View>

            {/* Route */}
            <View style={styles.routeSection}>
              <View style={styles.routeRow}>
                <MapPin size={14} color={GOLD} />
                <View style={styles.routeTextBlock}>
                  <Text style={styles.routeLabel}>Pickup</Text>
                  <Text style={styles.routeAddress} numberOfLines={1}>
                    {active.bookingBusinessData.pickupLocation.displayName}
                  </Text>
                </View>
              </View>
              <View style={styles.routeRow}>
                <Flag size={14} color={theme.colors.accent} />
                <View style={styles.routeTextBlock}>
                  <Text style={styles.routeLabel}>Drop-off</Text>
                  <Text style={styles.routeAddress} numberOfLines={1}>
                    {active.bookingBusinessData.dropoffLocation.displayName}
                  </Text>
                </View>
              </View>
            </View>

            {/* Customer */}
            <View style={styles.customerRow}>
              <User size={14} color={theme.colors.textColor} />
              <Text style={styles.customerName}>
                {active.bookingBusinessData.customer?.name ?? '—'}
              </Text>
            </View>

            {/* CTA */}
            {active.driverStatus && NEXT_STATUS[active.driverStatus] && (
              <TouchableOpacity
                onPress={() =>
                  handleStatusUpdate(active.id, NEXT_STATUS[active.driverStatus!])
                }
                disabled={updatingStatus}
                style={styles.ctaButton}>
                {updatingStatus ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.ctaButtonText}>{NEXT_LABEL[active.driverStatus]}</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.noActiveCard}>
            <Car size={32} color={theme.colors.borderNeutralColor} />
            <Text style={styles.noActiveText}>No active trip</Text>
            <Text style={styles.noActiveSubtext}>
              You'll be notified when a trip is assigned to you.
            </Text>
          </View>
        )}

        {/* Upcoming trips */}
        {upcoming.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            {upcoming.slice(0, 3).map((b) => (
              <View key={b.id} style={styles.upcomingCard}>
                <View style={styles.upcomingLeft}>
                  <Clock size={14} color={GOLD} />
                  <View style={styles.upcomingText}>
                    <Text style={styles.upcomingDate}>{formatDateTime(b.startDate)}</Text>
                    <Text style={styles.upcomingPickup} numberOfLines={1}>
                      {b.bookingBusinessData.pickupLocation.displayName}
                    </Text>
                  </View>
                </View>
                <Text style={styles.upcomingCode}>{b.bookingCode}</Text>
              </View>
            ))}
            {upcoming.length > 3 && (
              <TouchableOpacity onPress={() => setActiveTab('Trips')}>
                <Text style={styles.seeAllLink}>See all trips →</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
      <PageTransition isVisible={showPool}>
        {showPool ? <PoolScreen onBack={() => setShowPool(false)} /> : null}
      </PageTransition>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  poolBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.primaryAlpha[10],
    borderWidth: 1,
    borderColor: theme.colors.primaryAlpha[35],
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  poolIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poolTextWrap: { flex: 1 },
  poolTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.primaryText },
  poolSubtitle: { fontSize: 12, color: theme.colors.textColor, marginTop: 1 },
  page: {
    flex: 1,
    backgroundColor: theme.colors.bodyBackground,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.sm,
  },
  greeting: {
    fontSize: 13,
    color: theme.colors.textColor,
  },
  driverName: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.primaryText,
    marginTop: 2,
  },
  availabilityBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.borderRadius.full,
    minWidth: 90,
    alignItems: 'center',
  },
  availableOn: { backgroundColor: theme.colors.success },
  availableOff: {
    backgroundColor: theme.colors.secondary,
    borderWidth: 1,
    borderColor: theme.colors.borderNeutralColor,
  },
  availabilityText: { fontSize: 12, fontWeight: '600' },
  availableTextOn: { color: '#fff' },
  availableTextOff: { color: theme.colors.textColor },
  loadingBox: { height: 180, alignItems: 'center', justifyContent: 'center' },
  activeCard: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primaryAlpha[20],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: theme.spacing.xl,
  },
  activeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.lg,
  },
  activePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  activeCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.success,
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeCode: { fontSize: 11, color: theme.colors.textColor, letterSpacing: 0.8 },
  stepper: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.lg },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderNeutralColor,
  },
  stepDotDone: {
    backgroundColor: theme.colors.primaryAlpha[10],
    borderColor: theme.colors.primaryAlpha[35],
  },
  stepDotCurrent: { backgroundColor: GOLD, borderColor: GOLD },
  stepLabel: { fontSize: 8, color: theme.colors.textColor, textAlign: 'center' },
  stepLabelActive: { color: GOLD, fontWeight: '600' },
  stepLine: { flex: 1, height: 1, backgroundColor: theme.colors.borderNeutralColor, marginBottom: 16 },
  stepLineDone: { backgroundColor: theme.colors.primaryAlpha[35] },
  routeSection: { gap: 10, marginBottom: theme.spacing.md },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  routeTextBlock: { flex: 1 },
  routeLabel: {
    fontSize: 10,
    color: theme.colors.textColor,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  routeAddress: {
    fontSize: 13,
    color: theme.colors.primaryText,
    fontWeight: '500',
    marginTop: 1,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderNeutralColor,
  },
  customerName: { fontSize: 13, color: theme.colors.secondaryText },
  ctaButton: {
    backgroundColor: GOLD,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaButtonText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  noActiveCard: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.borderNeutralColor,
    marginBottom: theme.spacing.xl,
  },
  noActiveText: { fontSize: 16, fontWeight: '600', color: theme.colors.primaryText },
  noActiveSubtext: {
    fontSize: 13,
    color: theme.colors.textColor,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: { gap: theme.spacing.sm },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  upcomingCard: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderNeutralColor,
  },
  upcomingLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  upcomingText: { flex: 1 },
  upcomingDate: { fontSize: 11, color: GOLD, fontWeight: '600' },
  upcomingPickup: { fontSize: 13, color: theme.colors.primaryText, marginTop: 1 },
  upcomingCode: { fontSize: 10, color: theme.colors.textColor, letterSpacing: 0.8 },
  seeAllLink: { fontSize: 13, color: GOLD, fontWeight: '600', textAlign: 'right', paddingTop: 4 },
});
