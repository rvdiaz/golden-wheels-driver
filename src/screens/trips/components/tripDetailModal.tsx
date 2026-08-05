import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ChevronRight,
  Flag,
  MapPin,
  MessageSquare,
  Navigation2,
  Phone,
  User,
  X,
  Zap,
} from 'lucide-react-native';

import Text from '~/codidge_components/UI/text';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { theme } from '~/theme/theme';
import { typography } from '~/theme/typography';
import { surfaces } from '~/theme/surfaces';
import { Booking } from '../interfaces';
import { formatDateTime } from '../helpers';
import {
  NEXT_ACTION_KEY,
  NEXT_STATUS,
  callCustomer,
  messageCustomer,
  openNavigation,
  useTripActions,
} from '../hooks/useTripActions';
import { TripProgressCard } from './tripProgressCard';
import { useTranslation } from '~/i18n';

/**
 * Which stop the driver is heading to right now.
 *
 * Before the customer is aboard it's the pickup; after, it's the destination.
 * Returns null once the trip is over — there is nowhere left to go, and
 * showing a destination on a finished trip is actively confusing.
 */
const activeLeg = (booking: Booking, t: (k: any, v?: any) => string) => {
  const status = booking.driverStatus ?? 'assigned';
  if (status === 'completed') return null;

  const biz = booking.bookingBusinessData;
  return status === 'in_progress'
    ? {
        label: t('trip.dropoff'),
        location: biz?.dropoffLocation,
        Icon: Flag,
        tint: theme.colors.accent,
      }
    : {
        label: t('trip.pickup'),
        location: biz?.pickupLocation,
        Icon: MapPin,
        tint: theme.colors.primary,
      };
};

/** Compact action in the fixed bottom bar. */
const BarAction = ({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.barAction} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.barActionIcon}>{icon}</View>
    <Text style={styles.barActionLabel}>{label}</Text>
  </TouchableOpacity>
);

export const TripDetailModal = ({
  booking,
  visible,
  onClose,
  onChanged,
  /**
   * "claim" is the same screen for a trip the driver doesn't own yet — full
   * detail so they can decide, with a claim CTA instead of a status advance.
   */
  mode = 'assigned',
  onClaim,
  claiming = false,
}: {
  booking: Booking | null;
  visible: boolean;
  onClose: () => void;
  onChanged?: () => void;
  mode?: 'assigned' | 'claim';
  onClaim?: (booking: Booking) => void;
  claiming?: boolean;
}) => {
  const { t } = useTranslation();
  const { advance, advancing } = useTripActions(onChanged);

  const status = booking?.driverStatus ?? 'assigned';
  const isDone = status === 'completed' || booking?.status === 'completed';
  const isCancelled = booking?.status === 'cancelled';
  const nextStatus = NEXT_STATUS[status];
  const isLive = status === 'en_route' || status === 'in_progress';

  // Slow breathing pulse — readable in peripheral vision without demanding
  // attention from someone who is driving.
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isLive || !visible) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isLive, visible, pulse]);

  if (!booking) return null;

  const biz = booking.bookingBusinessData;
  const isClaimMode = mode === 'claim';
  const leg = isClaimMode ? null : activeLeg(booking, t);
  const customer = biz?.customer;
  const phone = customer?.phone;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}>
      <BodyWrapper>
        <PageSafeContainer>
          {/* ── Header ── */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={12}>
              <X size={22} color={theme.colors.secondaryText} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerCode}>#{booking.bookingCode}</Text>
              <Text style={styles.headerDate}>{formatDateTime(booking.startDate)}</Text>
            </View>
            <View style={styles.closeBtn} />
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {!isClaimMode && <TripProgressCard booking={booking} />}

            {/* ── Next stop. Hidden once there is nowhere left to go. ── */}
            {leg && !isCancelled && (
              <View style={styles.card}>
                <View style={styles.legHeader}>
                  <Text style={styles.cardTitle}>{t('trip.nextStop', { stop: leg.label })}</Text>
                  {/* Minimal: the full-width navigate button lives in the bar */}
                  <TouchableOpacity
                    style={styles.mapLink}
                    hitSlop={8}
                    onPress={() =>
                      openNavigation(
                        leg.location?.formattedAddress ?? leg.location?.displayName,
                        leg.label
                      )
                    }>
                    <Navigation2 size={14} color={theme.colors.primaryTextAccent} />
                    <Text style={styles.mapLinkText}>{t('action.map')}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.legRow}>
                  <View style={[styles.legIcon, { backgroundColor: leg.tint + '1A' }]}>
                    <leg.Icon size={18} color={leg.tint} />
                  </View>
                  <View style={styles.legText}>
                    <Text style={styles.legName}>{leg.location?.displayName ?? '—'}</Text>
                    {leg.location?.formattedAddress ? (
                      <Text style={styles.legAddress} numberOfLines={2}>
                        {leg.location.formattedAddress}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
            )}

            {/* ── Customer ── */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t('trip.customer')}</Text>
              <View style={styles.customerRow}>
                <View style={styles.avatar}>
                  <User size={18} color={theme.colors.primaryTextAccent} />
                </View>
                <Text style={styles.customerName} numberOfLines={1}>
                  {customer?.name ?? '—'}
                </Text>
                {/* Reach the customer without leaving the card */}
                <TouchableOpacity
                  style={styles.iconBtn}
                  hitSlop={8}
                  onPress={() => callCustomer(phone)}>
                  <Phone size={17} color={theme.colors.primaryTextAccent} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconBtn}
                  hitSlop={8}
                  onPress={() => messageCustomer(phone)}>
                  <MessageSquare size={17} color={theme.colors.secondaryText} />
                </TouchableOpacity>
              </View>

              {booking.note ? (
                <View style={styles.noteBlock}>
                  <Text style={styles.noteLabel}>{t('trip.noteLabel')}</Text>
                  <Text style={styles.note}>{booking.note}</Text>
                </View>
              ) : null}
            </View>

            {/* ── Full route ── */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t('trip.route')}</Text>
              {[
                {
                  label: t('trip.pickup'),
                  loc: biz?.pickupLocation,
                  tint: theme.colors.primary,
                  Icon: MapPin,
                },
                {
                  label: t('trip.dropoff'),
                  loc: biz?.dropoffLocation,
                  tint: theme.colors.accent,
                  Icon: Flag,
                },
              ].map(({ label, loc, tint, Icon }) => (
                <TouchableOpacity
                  key={label}
                  style={styles.stopRow}
                  activeOpacity={0.7}
                  onPress={() => openNavigation(loc?.formattedAddress ?? loc?.displayName, label)}>
                  <Icon size={16} color={tint} />
                  <View style={styles.stopText}>
                    <Text style={styles.stopLabel}>{label}</Text>
                    <Text style={styles.stopName} numberOfLines={1}>
                      {loc?.displayName ?? '—'}
                    </Text>
                  </View>
                  <Navigation2 size={16} color={theme.colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* ── Every action, pinned. Nothing here requires scrolling. ── */}
          <View style={styles.actionBar}>
            {leg && !isCancelled && (
              <View style={styles.barRow}>
                <BarAction
                  icon={<Navigation2 size={19} color={theme.colors.secondaryText} />}
                  label={t('action.navigateTo', {
                    stop: leg.label.toLowerCase(),
                  })}
                  onPress={() =>
                    openNavigation(
                      leg.location?.formattedAddress ?? leg.location?.displayName,
                      leg.label
                    )
                  }
                />
              </View>
            )}

            {isClaimMode ? (
              <TouchableOpacity
                style={[styles.claimCta, claiming && styles.primaryCtaDisabled]}
                activeOpacity={0.85}
                disabled={claiming}
                onPress={() => onClaim?.(booking)}>
                {claiming ? (
                  <ActivityIndicator color={theme.colors.primaryText} />
                ) : (
                  <>
                    <Zap size={19} color={theme.colors.primaryText} />
                    <Text style={styles.claimCtaText}>{t('pool.claim')}</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : nextStatus && !isCancelled ? (
              <TouchableOpacity
                style={[styles.primaryCta, advancing && styles.primaryCtaDisabled]}
                activeOpacity={0.85}
                disabled={advancing}
                onPress={() => advance(booking)}>
                {advancing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.primaryCtaText}>{t(NEXT_ACTION_KEY[status]!)}</Text>
                    <ChevronRight size={20} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.secondaryCta} activeOpacity={0.85} onPress={onClose}>
                <Text style={styles.secondaryCtaText}>
                  {t(isDone ? 'action.done' : 'action.close')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </PageSafeContainer>
      </BodyWrapper>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerCode: {
    fontSize: typography.md,
    fontWeight: '700',
    color: theme.colors.primaryText,
  },
  headerDate: { fontSize: typography.xs, color: theme.colors.textColor, marginTop: 1 },

  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },

  card: { ...surfaces.card, padding: theme.spacing.lg, gap: theme.spacing.md },
  cardTitle: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: theme.colors.textColor,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  legHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mapLinkText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: theme.colors.primaryTextAccent,
  },
  legRow: { flexDirection: 'row', gap: theme.spacing.md, alignItems: 'flex-start' },
  legIcon: {
    width: 38,
    height: 38,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legText: { flex: 1 },
  legName: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: theme.colors.primaryText,
  },
  legAddress: {
    fontSize: typography.sm,
    color: theme.colors.textColor,
    marginTop: 2,
    lineHeight: 20,
  },

  customerRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryAlpha[10],
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerName: {
    flex: 1,
    fontSize: typography.lg,
    fontWeight: '600',
    color: theme.colors.primaryText,
  },
  // Compact, inline with the name — not competing with the primary CTA.
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.baseGray,
  },
  noteBlock: {
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  noteLabel: {
    fontSize: typography.xs,
    color: theme.colors.textColor,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
    marginBottom: 4,
  },

  stopRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  stopText: { flex: 1 },
  stopLabel: { fontSize: typography.xs, color: theme.colors.textColor },
  stopName: {
    fontSize: typography.md,
    fontWeight: '600',
    color: theme.colors.primaryText,
    marginTop: 1,
  },

  note: { fontSize: typography.sm, color: theme.colors.secondaryText, lineHeight: 21 },

  actionBar: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.cardBackground,
    gap: theme.spacing.md,
  },
  barRow: { flexDirection: 'row', gap: theme.spacing.sm },
  barAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.baseGray,
  },
  barActionIcon: { height: 22, justifyContent: 'center' },
  barActionLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: theme.colors.secondaryText,
  },

  claimCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 18,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.primaryText,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 18,
  },
  primaryCtaDisabled: { opacity: 0.6 },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: typography.lg,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  /**
   * Ink on gold, not white: white on the brand gold is 2.2:1 and washes out in
   * daylight. Ink is 8:1 and keeps the button just as loud — gold stays the
   * one accent fill in the app, reserved for claiming a pooled trip.
   */
  claimCtaText: {
    color: theme.colors.primaryText,
    fontSize: typography.lg,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  secondaryCta: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingVertical: 16,
  },
  secondaryCtaText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: theme.colors.secondaryText,
  },
});
