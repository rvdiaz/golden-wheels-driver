import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { Booking, BookingStatus, TabKey } from '../interfaces';
import {
  GOLD,
  GOLD_30,
  GLASS_BG,
  WHITE_08,
  WHITE_10,
  WHITE_12,
  WHITE_35,
  formatDate,
  formatTime,
  formatCurrency,
  getInitials,
} from '../helpers';
import { theme } from '~/theme/theme';

// ─── Status Badge ─────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: BookingStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config: Record<BookingStatus, { label: string; bg: string; text: string; border: string }> =
    {
      confirmed: {
        label: 'Confirmed',
        bg: 'rgba(218,192,114,0.12)',
        text: GOLD,
        border: GOLD_30,
      },
      in_progress: {
        label: 'In Progress',
        bg: 'rgba(59,130,246,0.12)',
        text: '#60a5fa',
        border: 'rgba(59,130,246,0.3)',
      },
      completed: {
        label: 'Completed',
        bg: 'rgba(34,197,94,0.10)',
        text: '#4ade80',
        border: 'rgba(34,197,94,0.2)',
      },
      cancelled: {
        label: 'Cancelled',
        bg: 'rgba(220,38,38,0.10)',
        text: '#f87171',
        border: 'rgba(220,38,38,0.2)',
      },
    };

  const c = config[status];
  return (
    <View style={[badgeStyles.badge, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[badgeStyles.text, { color: c.text }]}>{c.label}</Text>
    </View>
  );
};

const badgeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

// ─── Trip Card ────────────────────────────────────────────────────────────────

interface TripCardProps {
  booking: Booking;
  tab: TabKey;
  onPress?: (booking: Booking) => void;
}

export const TripCard = ({ booking, tab, onPress }: TripCardProps) => {
  const { bookingBusinessData: biz, bookingCode, status, startDate } = booking;

  const isPast = tab === 'past';
  const isCancelled = tab === 'cancelled';

  // ── Glass card surface ──
  const cardBg = GLASS_BG;

  // ── Borders ──
  const cardBorder = isCancelled
    ? 'rgba(220,38,38,0.22)'
    : isPast
      ? 'rgba(255,255,255,0.11)'
      : 'rgba(218,192,114,0.22)';

  // ── Top shimmer line ──
  const shimmerColor = isCancelled
    ? 'rgba(220,38,38,0.22)'
    : isPast
      ? 'rgba(255,255,255,0.14)'
      : 'rgba(218,192,114,0.38)';

  // ── Text alphas ──
  const textOpacity = isPast || isCancelled ? 0.88 : 1;
  const labelOpacity = isPast || isCancelled ? 0.88 : 1;

  // ── Route dots ──
  const dotColor = isCancelled ? 'rgba(220,38,38,0.45)' : isPast ? 'rgba(255,255,255,0.28)' : GOLD;
  const dotEndColor = isCancelled
    ? 'rgba(220,38,38,0.18)'
    : isPast
      ? 'rgba(255,255,255,0.12)'
      : 'rgba(218,192,114,0.38)';

  const lineColor = isCancelled ? 'rgba(220,38,38,0.18)' : 'rgba(218,192,114,0.22)';

  // ── Price & driver ──
  const priceColor = isCancelled ? '#4ade80' : GOLD;
  const avatarBg = isPast || isCancelled ? 'rgba(255,255,255,0.06)' : 'rgba(218,192,114,0.15)';
  const avatarBorder = isPast || isCancelled ? 'rgba(255,255,255,0.1)' : GOLD_30;
  const avatarTextColor = isPast || isCancelled ? 'rgba(255,255,255,0.3)' : GOLD;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={() => onPress?.(booking)}
      style={[cardStyles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      {/* Top shimmer accent */}
      <View style={[cardStyles.shimmer, { backgroundColor: shimmerColor }]} />

      {/* Subtle inner white glow at top-left corner */}
      <View style={cardStyles.glassHighlight} />

      {/* Header */}
      <View style={cardStyles.header}>
        <Text
          style={[
            cardStyles.bookingCode,
            {
              color: isCancelled ? 'rgba(248,113,113,0.85)' : 'rgba(218,192,114,0.85)',
            },
          ]}>
          {bookingCode}
        </Text>
        <StatusBadge status={status} />
      </View>

      {/* Route */}
      <View style={cardStyles.routeRow}>
        <View style={cardStyles.routeLine}>
          <View style={[cardStyles.routeDot, { backgroundColor: dotColor }]} />
          <View style={[cardStyles.routeConnector, { backgroundColor: lineColor }]} />
          <View style={[cardStyles.routeDot, { backgroundColor: dotEndColor }]} />
        </View>
        <View style={cardStyles.routeAddresses}>
          <View style={cardStyles.locationBlock}>
            <Text
              style={[cardStyles.locationLabel, { color: `rgba(218,192,114,${labelOpacity})` }]}>
              Pickup · {formatDate(startDate)} · {formatTime(startDate)}
            </Text>
            <Text
              style={[cardStyles.locationName, { color: `rgba(255,255,255,${textOpacity})` }]}
              numberOfLines={1}>
              {biz.pickupLocation.displayName}
            </Text>
            <Text style={cardStyles.locationAddr} numberOfLines={1}>
              {biz.pickupLocation.formattedAddress}
            </Text>
          </View>
          <View style={cardStyles.locationBlock}>
            <Text
              style={[cardStyles.locationLabel, { color: `rgba(218,192,114,${labelOpacity})` }]}>
              Drop-off
            </Text>
            <Text
              style={[cardStyles.locationName, { color: `rgba(255,255,255,${textOpacity})` }]}
              numberOfLines={1}>
              {biz.dropoffLocation.displayName}
            </Text>
            <Text style={cardStyles.locationAddr} numberOfLines={1}>
              {biz.dropoffLocation.formattedAddress}
            </Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={[cardStyles.divider, { backgroundColor: WHITE_10 }]} />

      {/* Meta row */}
      <View style={cardStyles.metaRow}>
        <View style={cardStyles.metaItem}>
          <Text style={cardStyles.metaLabel}>Vehicle</Text>
          <Text
            style={[cardStyles.metaValue, { color: `rgba(255,255,255,${textOpacity})` }]}
            numberOfLines={1}>
            {biz.car.carType.name}
          </Text>
        </View>
        <View style={cardStyles.metaItem}>
          <Text style={cardStyles.metaLabel}>Mode</Text>
          <Text style={[cardStyles.metaValue, { color: `rgba(255,255,255,${textOpacity})` }]}>
            {biz.bookMode === 'trip' ? 'Trip' : 'Hourly'}
          </Text>
        </View>
        <View style={cardStyles.metaItem}>
          <Text style={cardStyles.metaLabel}>{isCancelled ? 'Refund' : 'Total'}</Text>
          <Text style={[cardStyles.metaPrice, { color: priceColor }]}>
            {formatCurrency(biz.totalPrice.amount, biz.totalPrice.currencyCode)}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[cardStyles.divider, { backgroundColor: WHITE_10 }]} />

      {/* Footer */}
      <View style={cardStyles.footer}>
        <View style={cardStyles.driverPill}>
          <View
            style={[
              cardStyles.driverAvatar,
              { backgroundColor: avatarBg, borderColor: avatarBorder },
            ]}>
            <Text style={[cardStyles.driverInitials, { color: avatarTextColor }]}>
              {getInitials(biz.driver.name)}
            </Text>
          </View>
          <Text style={cardStyles.driverName}>{biz.driver.name}</Text>
        </View>
        <View style={cardStyles.carTag}>
          <Text style={cardStyles.carTagText} numberOfLines={1}>
            {biz.car.brand}
          </Text>
        </View>
      </View>

      {/* Cancel note */}
      {isCancelled && booking.note ? (
        <View style={cardStyles.cancelNote}>
          <Text style={cardStyles.cancelNoteText}>{booking.note}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 16,
    paddingBottom: 14,
    overflow: 'hidden',
  },
  // Horizontal shimmer line across top edge
  shimmer: {
    position: 'absolute',
    top: 0,
    left: '12%',
    right: '12%',
    height: 1,
    borderRadius: 1,
  },
  // Subtle white inner glow — simulates glass catching light
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  bookingCode: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  routeRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 14,
  },
  routeLine: {
    alignItems: 'center',
    paddingTop: 4,
  },
  routeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  routeConnector: {
    width: 1,
    flex: 1,
    minHeight: 24,
    marginVertical: 4,
  },
  routeAddresses: {
    flex: 1,
    gap: 10,
  },
  locationBlock: {
    gap: 1,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  locationName: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    marginTop: 1,
  },
  locationAddr: {
    fontSize: 11,
    color: WHITE_35,
    marginTop: 1,
  },
  divider: {
    height: 0.5,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  metaItem: {
    flex: 1,
    gap: 3,
  },
  metaLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.28)',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '400',
  },
  metaPrice: {
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  driverAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInitials: {
    fontSize: 10,
    fontWeight: '500',
  },
  driverName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
  },
  carTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: WHITE_08,
    borderWidth: 0.5,
    borderColor: WHITE_12,
    borderRadius: theme.borderRadius.sm,
    maxWidth: 140,
  },
  carTagText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
  },
  cancelNote: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(220,38,38,0.15)',
  },
  cancelNoteText: {
    fontSize: 11,
    color: 'rgba(248,113,113,0.85)',
  },
});
