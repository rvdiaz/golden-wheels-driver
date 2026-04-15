import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, ScrollView, TouchableOpacity } from 'react-native';
import {
  CheckCircle,
  Clock,
  Car,
  Calendar,
  MapPin,
  ArrowLeft,
  FileText,
  X,
} from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { formatCurrency, formatDateTime, getDriverBadgeType } from '~/screens/trips/helpers';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';
import { BookMode, Booking } from '~/screens/trips/interfaces';
import { STATUS_DISPLAY } from './driverStatusBar';
import { Badge } from '~/codidge_components/UI/badge';
import { CancelModal } from './cancelModal';
import { useCustomerTrips } from '../hooks/useCustomerTrips';
import { ENV_Vars } from '~/store/env';

const GOLD = theme.colors.primary;
const RED = '#f87171';
const RED_12 = 'rgba(248,113,113,0.12)';
const RED_22 = 'rgba(248,113,113,0.22)';

interface BookingDetailsProps {
  // Pass the minimal details needed to show the confirmation
  booking: Booking;
  onBack?: () => void;
  headerTitle?: string;
  onCancelBooking?: boolean;
}

// ─── Animated check icon ──────────────────────────────────────────────────────

const AnimatedCheck = () => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.6)).current;
  const ringOpacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Icon pops in
    Animated.spring(scale, {
      toValue: 1,
      damping: 14,
      stiffness: 180,
      useNativeDriver: true,
      delay: 200,
    }).start();

    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      delay: 200,
    }).start();

    // Ring pulses out and fades
    Animated.loop(
      Animated.parallel([
        Animated.timing(ringScale, { toValue: 1.6, duration: 1400, useNativeDriver: true }),
        Animated.timing(ringOpacity, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={check.wrapper}>
      {/* Pulsing ring */}
      <Animated.View
        style={[check.ring, { transform: [{ scale: ringScale }], opacity: ringOpacity }]}
      />
      {/* Icon */}
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <View style={check.iconWrap}>
          <CheckCircle size={52} color={GOLD} strokeWidth={1.5} />
        </View>
      </Animated.View>
    </View>
  );
};

// ─── Detail row ───────────────────────────────────────────────────────────────

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label?: string;
  value: string;
}) => (
  <View style={detail.row}>
    <View style={detail.iconWrap}>{icon}</View>
    <View style={detail.textWrap}>
      {label ? <Text style={detail.label}>{label}</Text> : null}
      <Text style={detail.value} numberOfLines={2}>
        {value}
      </Text>
    </View>
  </View>
);
// ─── Main screen ──────────────────────────────────────────────────────────────

export const BookingDetailsScreen: React.FC<BookingDetailsProps> = ({
  booking,
  onBack,
  headerTitle,
  onCancelBooking,
}) => {
  const contentAnim = useRef(new Animated.Value(0)).current;
  const { handleTripCancellation, loadingTripCancellation } = useCustomerTrips({
    skipQueries: true,
  });
  // ─── 3. Add state inside the component ───────────────────────────────────────

  const [cancelVisible, setCancelVisible] = useState(false);
  const [cancelStep, setCancelStep] = useState<1 | 2>(1);

  const openCancel = () => {
    setCancelStep(1);
    setCancelVisible(true);
  };

  const handleFirstConfirm = () => setCancelStep(2);

  const handleFinalConfirm = async () => {
    if (!onCancelBooking) return;
    try {
      await handleTripCancellation({
        tenant: ENV_Vars.tenant,
        bookingId: booking.id,
      });
    } finally {
      setCancelVisible(false);
    }
  };

  const handleCloseCancel = () => {
    if (loadingTripCancellation) return; // block dismiss while request is in flight
    setCancelVisible(false);
  };

  useEffect(() => {
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 500,
      delay: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <BodyWrapper>
      <ScrollView>
        <PageSafeContainer>
          {onBack && (
            <Header
              contentContainerStyle={{
                backgroundColor: 'transparent',
              }}
              titleStyles={{
                color: '#FFF',
              }}
              leftWidget={
                <TouchableOpacity onPress={onBack} style={screen.iconBtn} activeOpacity={0.7}>
                  <ArrowLeft size={18} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
              }
              title={headerTitle ?? ''}
              showBack
            />
          )}
          {/* Subtle gold glow behind check */}
          <View style={screen.glow} />

          <View style={screen.content}>
            {/* Check animation */}
            {!onBack && <AnimatedCheck />}

            {/* Heading */}
            {!onBack && (
              <Animated.View
                style={[
                  screen.headingWrap,
                  {
                    opacity: contentAnim,
                    transform: [
                      {
                        translateY: contentAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [16, 0],
                        }),
                      },
                    ],
                  },
                ]}>
                <Text style={screen.eyebrow}>GOLDEN WHEELS</Text>
                <Text style={screen.heading}>Request Received</Text>
                <Text style={screen.sub}>
                  We're finding the best driver for your trip. You'll be notified once confirmed.
                </Text>
              </Animated.View>
            )}

            {/* Booking code */}
            <Animated.View
              style={[
                screen.codeCard,
                {
                  opacity: contentAnim,
                  transform: [
                    {
                      translateY: contentAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}>
              <Text style={screen.codeLabel}>Booking Reference</Text>
              <Text style={screen.code}>{booking.bookingCode}</Text>
            </Animated.View>

            {/* Trip summary */}
            <Animated.View
              style={[
                screen.summaryCard,
                {
                  opacity: contentAnim,
                  transform: [
                    {
                      translateY: contentAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [24, 0],
                      }),
                    },
                  ],
                },
              ]}>
              {booking.bookingBusinessData.car ? (
                <>
                  <View style={screen.summaryDivider} />
                  <DetailRow
                    icon={<Car size={13} color={GOLD} />}
                    label="Car"
                    value={`${booking.bookingBusinessData.car.brand} ${booking.bookingBusinessData.car.model}`}
                  />
                </>
              ) : null}

              {booking.bookingBusinessData.driver ? (
                <>
                  <View style={screen.summaryDivider} />
                  <View style={detail.row}>
                    <View style={detail.iconWrap}>
                      {/* Initials avatar */}
                      <View style={driverS.avatar}>
                        <Text style={driverS.initials}>
                          {booking.bookingBusinessData.driver.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <View style={detail.textWrap}>
                      <Text style={detail.label}>Driver</Text>
                      <Text style={detail.value}>{booking.bookingBusinessData.driver.name}</Text>
                      <Text style={driverS.sub}>{booking.bookingBusinessData.driver.phone}</Text>
                    </View>
                    {/* Status badge — only when a driverStatus is present */}
                    {booking.driverStatus ? (
                      <Badge
                        type={getDriverBadgeType(booking.driverStatus)}
                        displayIcon={false} // keep it compact inline
                        style={{
                          ...driverS.badge,
                          backgroundColor: STATUS_DISPLAY[booking.driverStatus].colorBg,
                        }}
                        textStyle={driverS.badgeText}>
                        {STATUS_DISPLAY[booking.driverStatus].managerHeadline}
                      </Badge>
                    ) : null}
                  </View>
                </>
              ) : null}
              <DetailRow
                icon={<MapPin size={13} color={GOLD} />}
                label="Pickup"
                value={booking.bookingBusinessData.pickupLocation.displayName}
              />
              {booking.bookingBusinessData.bookMode === BookMode.trip ? (
                <DetailRow
                  icon={<MapPin size={13} color={GOLD} />}
                  label="Destination"
                  value={booking.bookingBusinessData.dropoffLocation.displayName}
                />
              ) : (
                <DetailRow
                  icon={<MapPin size={13} color={GOLD} />}
                  label="Hours"
                  value={`${booking.bookingBusinessData.bookHours}`}
                />
              )}

              <DetailRow
                icon={<Calendar size={13} color={GOLD} />}
                label="Date & time"
                value={formatDateTime(booking.startDate)}
              />
              {booking.bookingBusinessData.carType.name ? (
                <DetailRow
                  icon={<Car size={13} color={GOLD} />}
                  label="Vehicle"
                  value={booking.bookingBusinessData.carType.name}
                />
              ) : null}
              {booking.bookingBusinessData.totalPrice.amount ? (
                <DetailRow
                  icon={<Clock size={13} color={GOLD} />}
                  label="Payment"
                  value={`${formatCurrency(booking.bookingBusinessData.totalPrice.amount, booking.bookingBusinessData.totalPrice.currencyCode)} — charged on confirmation`}
                />
              ) : null}
              {/* ── Notes ── */}
              {booking.note
                ? booking.note.split(' | ').map((part, index) => {
                    const [label, ...rest] = part.split(': ');
                    const value = rest.join(': ');

                    return (
                      <DetailRow
                        key={index}
                        icon={<FileText size={13} color={GOLD} />}
                        label={label}
                        value={value}
                      />
                    );
                  })
                : null}

              {onCancelBooking ? (
                <Animated.View style={[screen.cancelWrap, { opacity: contentAnim }]}>
                  <TouchableOpacity
                    style={screen.cancelBtn}
                    onPress={openCancel}
                    activeOpacity={0.75}>
                    <X size={13} color={RED} strokeWidth={2} />
                    <Text style={screen.cancelBtnText}>Cancel Trip</Text>
                  </TouchableOpacity>
                </Animated.View>
              ) : null}
            </Animated.View>

            {/* Notice */}
            {!onBack && (
              <Animated.View style={[screen.notice, { opacity: contentAnim }]}>
                <View style={screen.noticeDot} />
                <Text style={screen.noticeText}>
                  Your card has been saved but not charged. Payment is collected only after a driver
                  accepts your trip.
                </Text>
              </Animated.View>
            )}
          </View>
        </PageSafeContainer>
      </ScrollView>
      {/* Two-step cancel confirmation modal */}
      <CancelModal
        visible={cancelVisible}
        step={cancelStep}
        loading={loadingTripCancellation}
        onFirstConfirm={handleFirstConfirm}
        onFinalConfirm={handleFinalConfirm}
        onClose={handleCloseCancel}
      />
    </BodyWrapper>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const check = StyleSheet.create({
  wrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  ring: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: 'rgba(212,168,83,0.4)',
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(212,168,83,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const detail = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 2,
  },
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: 'rgba(212,168,83,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  textWrap: {
    // ← new
    flex: 1,
    gap: 1,
  },
  label: {
    // ← new
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: 'rgba(212,168,83,0.85)',
  },
  value: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    lineHeight: 19,
  },
});

const screen = StyleSheet.create({
  glow: {
    position: 'absolute',
    top: '10%',
    alignSelf: 'center',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(212,168,83,0.06)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    gap: 20,
  },
  headingWrap: {
    alignItems: 'center',
    gap: 8,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: 'rgba(212,168,83,0.75)',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 8,
  },
  codeCard: {
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212,168,83,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'rgba(212,168,83,0.55)',
  },
  code: {
    fontSize: 22,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 2,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  notice: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    paddingHorizontal: 4,
  },
  noticeDot: {
    width: 3,
    borderRadius: 2,
    backgroundColor: GOLD,
    alignSelf: 'stretch',
    opacity: 0.5,
  },
  noticeText: {
    flex: 1,
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 17,
  },
  actions: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelWrap: {
    width: '100%',
    paddingVertical: 10,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: RED_12,
    borderWidth: 1,
    borderColor: RED_22,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: RED,
    letterSpacing: 0.2,
  },
});

const driverS = StyleSheet.create({
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(212,168,83,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 8,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 0.3,
  },
  sub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '400',
    marginTop: 1,
  },
  badge: {
    alignSelf: 'center', // vertically centres with the avatar / text block
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
