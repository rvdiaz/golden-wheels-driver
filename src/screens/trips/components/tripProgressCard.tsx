import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';

import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { typography } from '~/theme/typography';
import { surfaces } from '~/theme/surfaces';
import { Booking } from '../interfaces';
import { formatCurrency } from '../helpers';
import {
  DRIVER_STATUS_FLOW,
  NEXT_ACTION_KEY,
  NEXT_STATUS,
  STATUS_LABEL_KEY,
  STATUS_SHORT_KEY,
} from '../hooks/useTripActions';
import { useTranslation } from '~/i18n';

const DOT = 18;

/**
 * Where the trip is and what is left of it, in one card.
 *
 * This replaces the separate status hero and vertical timeline, which showed
 * the same state twice in two designs. The strip is horizontal so the whole
 * journey — including the steps still ahead — is visible without scrolling,
 * and the current step is named in full above it.
 */
export const TripProgressCard = ({ booking }: { booking: Booking }) => {
  const { t } = useTranslation();
  const status = booking.driverStatus ?? 'assigned';
  const isCancelled = booking.status === 'cancelled';
  const isDone = status === 'completed' || booking.status === 'completed';
  const isLive = status === 'en_route' || status === 'in_progress';

  const currentIndex = Math.max(0, DRIVER_STATUS_FLOW.indexOf(status));
  const lastIndex = DRIVER_STATUS_FLOW.length - 1;
  const stepsLeft = lastIndex - currentIndex;
  const nextStatus = NEXT_STATUS[status];

  // Fill animates between steps so an advance reads as movement, not a repaint.
  const progress = useRef(new Animated.Value(currentIndex)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: currentIndex,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // animating width
    }).start();
  }, [currentIndex, progress]);

  useEffect(() => {
    if (isDone || isCancelled) {
      pulse.stopAnimation();
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 950,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 950,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isDone, isCancelled, pulse]);

  const fillWidth = progress.interpolate({
    inputRange: [0, lastIndex],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      {/* ── Current state, named ── */}
      <View style={styles.badgeRow}>
        {isLive && (
          <View style={styles.liveDotWrap}>
            <Animated.View
              style={[
                styles.liveHalo,
                {
                  opacity: pulse.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 0],
                  }),
                  transform: [
                    {
                      scale: pulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 2.4],
                      }),
                    },
                  ],
                },
              ]}
            />
            <View style={styles.liveDot} />
          </View>
        )}
        {isDone && <CheckCircle2 size={15} color={theme.colors.success} />}
        <Text style={styles.badgeText}>
          {isCancelled
            ? t('trip.cancelled')
            : isDone
              ? t('trip.finished')
              : isLive
                ? t('trip.tripInProgress')
                : t('trip.currentStatus')}
        </Text>
      </View>

      <Text style={styles.statusValue}>
        {isCancelled ? t('trip.cancelledValue') : t(STATUS_LABEL_KEY[status])}
      </Text>

      {!isCancelled && (
        <>
          {/* ── The whole journey, including what's left ── */}
          <View style={styles.strip}>
            <View style={styles.track} />
            <Animated.View style={[styles.trackFill, { width: fillWidth }]} />

            <View style={styles.dotsRow}>
              {DRIVER_STATUS_FLOW.map((step, idx) => {
                const done = idx < currentIndex;
                const current = idx === currentIndex;
                return (
                  <View key={step} style={styles.dotSlot}>
                    <View
                      style={[styles.dot, done && styles.dotDone, current && styles.dotCurrent]}
                    />
                    <Text
                      style={[
                        styles.stepLabel,
                        done && styles.stepLabelDone,
                        current && styles.stepLabelCurrent,
                      ]}
                      numberOfLines={1}>
                      {t(STATUS_SHORT_KEY[step])}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* ── What happens next ── */}
          {nextStatus ? (
            <View style={styles.nextRow}>
              <Text style={styles.nextLabel}>{t('trip.upNext')}</Text>
              <Text style={styles.nextValue}>
                {t(NEXT_ACTION_KEY[status]!)}
                <Text style={styles.nextCount}>
                  {'   '}
                  {t('trip.stepsLeft', { count: stepsLeft })}
                </Text>
              </Text>
            </View>
          ) : null}
        </>
      )}

      {booking.driverEarnings?.amount != null && !isCancelled && (
        <View style={styles.earningsRow}>
          <Text style={styles.earningsLabel}>
            {t(isDone ? 'trip.youEarned' : 'trip.youEarn')}
          </Text>
          <Text style={styles.earningsValue}>
            {formatCurrency(booking.driverEarnings.amount, booking.driverEarnings.currencyCode)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { ...surfaces.card, padding: theme.spacing.lg, gap: 6 },
  cardDone: { borderColor: theme.colors.success + '55' },

  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDotWrap: { width: 10, height: 10, alignItems: 'center', justifyContent: 'center' },
  liveHalo: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.success,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.success,
  },
  badgeText: {
    fontSize: typography.xs,
    color: theme.colors.textColor,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
  },
  statusValue: {
    fontSize: typography.display,
    fontWeight: '700',
    color: theme.colors.primaryText,
    letterSpacing: -0.4,
  },

  strip: { marginTop: theme.spacing.lg, position: 'relative' },
  track: {
    position: 'absolute',
    left: DOT / 2,
    right: DOT / 2,
    top: DOT / 2 - 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.cardBorder,
  },
  trackFill: {
    position: 'absolute',
    left: DOT / 2,
    top: DOT / 2 - 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },
  dotsRow: { flexDirection: 'row' },
  dotSlot: { flex: 1, alignItems: 'center', gap: 6 },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 2,
    borderColor: theme.colors.cardBorder,
  },
  dotDone: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dotCurrent: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryAlpha[50],
    transform: [{ scale: 1.25 }],
  },
  stepLabel: {
    fontSize: typography.xxs,
    color: theme.colors.borderStrong,
    fontWeight: '600',
  },
  stepLabelDone: { color: theme.colors.textColor },
  stepLabelCurrent: { color: theme.colors.primaryTextAccent, fontWeight: '700' },

  nextRow: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  nextLabel: {
    fontSize: typography.xs,
    color: theme.colors.textColor,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
  },
  nextValue: {
    fontSize: typography.md,
    fontWeight: '600',
    color: theme.colors.primaryText,
    marginTop: 2,
  },
  nextCount: { fontSize: typography.xs, color: theme.colors.textColor, fontWeight: '500' },

  earningsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  earningsLabel: { fontSize: typography.sm, color: theme.colors.textColor },
  earningsValue: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: theme.colors.primaryTextAccent,
  },
});
