import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Linking } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { Booking, PaymentStatus, TabKey } from '../interfaces';
import {
  GLASS_BG,
  WHITE_08,
  WHITE_10,
  WHITE_12,
  WHITE_35,
  formatCurrency,
  getInitials,
  formatDateTime,
} from '../helpers';
import { theme } from '~/theme/theme';
import { BookSelectionForm } from '~/components/bookTripJourney';
import { DriverStatusBar } from './driverStatusBar';
import { BookingDetailsScreen } from './tripDetails';
import { StatusBadge } from './statusBadge';
import { PaymentUpdate } from './paymentUpdate';
import { useCustomerTrips } from '../hooks/useCustomerTrips';
import { Phone } from 'lucide-react-native';

const GOLD = theme.colors.primary;
const GOLD_30 = theme.colors.primaryAlpha[35];

const GREEN = '#4ade80';
const GREEN_12 = 'rgba(34,197,94,0.12)';
const GREEN_30 = 'rgba(34,197,94,0.30)';
const GREEN_22 = 'rgba(34,197,94,0.22)';
const GREEN_50 = 'rgba(34,197,94,0.50)';

// ─── Trip Card ────────────────────────────────────────────────────────────────

interface TripCardProps {
  booking: Booking;
  tab: TabKey;
}

export const TripCard = ({ booking, tab }: TripCardProps) => {
  const { bookingBusinessData: biz, bookingCode, status, startDate, driverStatus } = booking;
  const [open, setOpen] = useState(false);
  const [bookingDetails, setbookingDetails] = useState(false);
  const isPast = tab === 'past';
  const isCancelled = tab === 'cancelled';
  const isConfirmed = status === 'confirmed';
  const { refetchTripList } = useCustomerTrips({});

  const cardBg = GLASS_BG;

  const showDriverStatus = (!!driverStatus || isConfirmed) && !isCancelled;

  // ── Borders ──
  const cardBorder = isCancelled
    ? 'rgba(220,38,38,0.22)'
    : isPast
      ? 'rgba(255,255,255,0.11)'
      : isConfirmed
        ? GREEN_30
        : 'rgba(218,192,114,0.22)';

  // ── Top shimmer line ──
  const shimmerColor = isCancelled
    ? 'rgba(220,38,38,0.22)'
    : isPast
      ? 'rgba(255,255,255,0.14)'
      : isConfirmed
        ? GREEN_50
        : 'rgba(218,192,114,0.38)';

  const textOpacity = isPast || isCancelled ? 0.88 : 1;
  const labelOpacity = isPast || isCancelled ? 0.88 : 1;

  // ── Route dots ──
  const dotColor = isCancelled
    ? 'rgba(220,38,38,0.45)'
    : isPast
      ? 'rgba(255,255,255,0.28)'
      : isConfirmed
        ? GREEN
        : GOLD;

  const dotEndColor = isCancelled
    ? 'rgba(220,38,38,0.18)'
    : isPast
      ? 'rgba(255,255,255,0.12)'
      : isConfirmed
        ? GREEN_30
        : 'rgba(218,192,114,0.38)';

  const lineColor = isCancelled
    ? 'rgba(220,38,38,0.18)'
    : isConfirmed
      ? GREEN_22
      : 'rgba(218,192,114,0.22)';

  // ── Location label color ──
  const locationLabelColor = isConfirmed
    ? `rgba(74,222,128,${labelOpacity})`
    : `rgba(218,192,114,${labelOpacity})`;

  // ── Price & driver ──
  const priceColor = isCancelled || isConfirmed ? GREEN : GOLD;

  const avatarBg =
    isPast || isCancelled
      ? 'rgba(255,255,255,0.06)'
      : isConfirmed
        ? GREEN_12
        : 'rgba(218,192,114,0.15)';

  const avatarBorder =
    isPast || isCancelled
      ? 'rgba(255,255,255,0.1)'
      : isConfirmed
        ? 'rgba(34,197,94,0.35)'
        : GOLD_30;

  const avatarTextColor =
    isPast || isCancelled ? 'rgba(255,255,255,0.3)' : isConfirmed ? GREEN : GOLD;

  const bookingCodeColor = isCancelled
    ? 'rgba(248,113,113,0.85)'
    : isConfirmed
      ? 'rgba(74,222,128,0.85)'
      : 'rgba(218,192,114,0.85)';

  const handleContinueBooking = () => {
    if (booking.status === 'draft') {
      setOpen(true);
    } else {
      setbookingDetails(true);
    }
  };
  const allowCancellation =
    (booking.status === 'confirmed' || booking.status === 'pending') &&
    new Date(booking.startDate).getTime() - Date.now() > 2 * 60 * 60 * 1000;
  const hasPaymentFailure =
    booking.paymentStatus === PaymentStatus.capture_failed && status === 'pending';

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={handleContinueBooking}
        style={[cardStyles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        {/* Top shimmer accent */}
        <View style={[cardStyles.shimmer, { backgroundColor: shimmerColor }]} />

        {/* Subtle inner white glow at top-left corner */}
        <View style={cardStyles.glassHighlight} />

        {/* Upcoming trip banner — confirmed only */}
        <View style={cardStyles.header}>
          <Text style={[cardStyles.bookingCode, { color: bookingCodeColor }]}>{bookingCode}</Text>
          {isConfirmed ? (
            <View style={cardStyles.upcomingBanner}>
              <View style={cardStyles.upcomingPulseDot} />
              <Text style={cardStyles.upcomingBannerText}>Upcoming Trip</Text>
            </View>
          ) : (
            <StatusBadge status={status} />
          )}
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
              <Text style={[cardStyles.locationLabel, { color: locationLabelColor }]}>
                Pickup · {formatDateTime(startDate)}
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
              <Text style={[cardStyles.locationLabel, { color: locationLabelColor }]}>
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
              {biz.carType?.name}
            </Text>
          </View>
          <View style={cardStyles.metaItem}>
            <Text style={cardStyles.metaLabel}>Mode</Text>
            <Text style={[cardStyles.metaValue, { color: `rgba(255,255,255,${textOpacity})` }]}>
              {biz.bookMode === 'trip' ? 'Trip' : 'Hourly'}
            </Text>
          </View>
          {biz.totalPrice?.amount && (
            <View style={cardStyles.metaItem}>
              <Text style={cardStyles.metaLabel}>{isCancelled ? 'Refund' : 'Total'}</Text>
              <Text style={[cardStyles.metaPrice, { color: priceColor }]}>
                {formatCurrency(biz.totalPrice?.amount, biz.totalPrice.currencyCode)}
              </Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={[cardStyles.divider, { backgroundColor: WHITE_10 }]} />

        {/* Footer */}
        <View style={cardStyles.footer}>
          {biz.driver ? (
            <View style={{ flexDirection: 'column' }}>
              <View style={cardStyles.driverLabelRow}>
                <View style={[cardStyles.driverLabelDot, { backgroundColor: avatarTextColor }]} />
                <Text style={[cardStyles.locationLabel, { color: locationLabelColor }]}>
                  Your Driver
                </Text>
              </View>
              <View style={cardStyles.driverPill}>
                <View style={cardStyles.driverRow}>
                  <View style={cardStyles.driverInfo}>
                    <Text style={cardStyles.driverName}>{biz.driver.name}</Text>
                    {biz.driver.phone && (
                      <Text style={cardStyles.driverPhone}>{biz.driver.phone}</Text>
                    )}
                  </View>
                  {biz.driver.phone && (
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        Linking.openURL(`tel:${biz.driver.phone}`);
                      }}
                      style={[
                        cardStyles.callBtn,
                        { borderColor: avatarBorder, backgroundColor: avatarBg },
                      ]}>
                      <Phone size={12} color={avatarTextColor} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View /> // empty — keeps car tag pushed right
          )}

          {biz.car && (
            <View
              style={{
                flexDirection: 'column',
              }}>
              <View style={cardStyles.driverLabelRow}>
                <View style={[cardStyles.driverLabelDot, { backgroundColor: avatarTextColor }]} />
                <Text style={[cardStyles.locationLabel, { color: locationLabelColor }]}>Car</Text>
              </View>
              <View style={cardStyles.carTag}>
                <Text style={cardStyles.carTagText} numberOfLines={1}>
                  {biz.car?.brand}
                </Text>
              </View>
            </View>
          )}
        </View>
        {/* ── Driver Status Bar ── */}
        {showDriverStatus && (
          <DriverStatusBar
            driverStatus={driverStatus ?? 'assigned'}
            driverName={biz.driver?.name}
          />
        )}

        {/* Payment Failure Banner */}
        {hasPaymentFailure && (
          <View style={cardStyles.paymentFailBanner}>
            <View style={cardStyles.paymentFailRow}>
              <View style={cardStyles.paymentFailDot} />
              <Text style={cardStyles.paymentFailMessage} numberOfLines={2}>
                {booking.paymentFailureMessageCustomer}
              </Text>
              <PaymentUpdate booking={booking} onSuccess={() => refetchTripList()} />
            </View>
          </View>
        )}
        {/* Cancel note */}
        {isCancelled && booking.note ? (
          <View style={cardStyles.cancelNote}>
            <Text style={cardStyles.cancelNoteText}>{booking.note}</Text>
          </View>
        ) : null}
      </TouchableOpacity>

      <Modal
        visible={open}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}>
        <BookSelectionForm
          onDismiss={() => setOpen(false)}
          onPayPress={(data) => {
            setOpen(false);
          }}
          initialValues={booking}
        />
      </Modal>

      <Modal
        visible={bookingDetails}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => {
          setbookingDetails(false);
        }}>
        <BookingDetailsScreen
          booking={booking}
          onBack={() => setbookingDetails(false)}
          headerTitle="Trip Details"
          onCancelBooking={allowCancellation}
        />
      </Modal>
    </>
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
  shimmer: {
    position: 'absolute',
    top: 0,
    left: '12%',
    right: '12%',
    height: 1,
    borderRadius: 1,
  },
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
  // ── Upcoming Trip banner (confirmed only) ──
  upcomingBanner: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(34,197,94,0.10)',
    borderWidth: 0.5,
    borderColor: 'rgba(34,197,94,0.28)',
    borderRadius: 6,
  },
  upcomingPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ade80',
  },
  upcomingBannerText: {
    fontSize: 10,
    color: '#4ade80',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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
    alignItems: 'flex-start',
  },
  driverPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  driverLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 5,
  },
  driverLabelDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  driverLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  driverName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
  },
  driverInfo: {
    flexDirection: 'column',
    gap: 1,
  },
  driverPhone: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.28)',
    letterSpacing: 0.3,
  },
  callBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
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
  paymentFailBanner: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(251,146,60,0.15)',
  },
  paymentFailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentFailDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#fb923c',
    flexShrink: 0,
  },
  paymentFailMessage: {
    flex: 1,
    fontSize: 11,
    color: 'rgba(251,146,60,0.85)',
    lineHeight: 15,
  },
  paymentFailCta: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(251,146,60,0.35)',
    backgroundColor: 'rgba(251,146,60,0.08)',
  },
  paymentFailCtaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fb923c',
  },
});
