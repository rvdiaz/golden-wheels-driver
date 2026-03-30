import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ScrollView } from 'react-native';
import { CheckCircle, Clock, Car, Calendar, MapPin } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { formatCurrency, formatDateTime } from '~/screens/trips/helpers';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import TextButton from '~/codidge_components/UI/button/TextButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

const GOLD = theme.colors.primary;

// ─── Props ────────────────────────────────────────────────────────────────────

interface BookingConfirmationProps {
  // Pass the minimal details needed to show the confirmation
  bookingCode: string;
  pickupDisplayName: string;
  destinationDisplayName: string;

  startDate: string;
  carTypeName?: string;
  totalAmount?: number;
  currencyCode?: string;

  // Callbacks
  onViewTrips: () => void;
  onGoHome: () => void;
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

const DetailRow = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
  <View style={detail.row}>
    <View style={detail.iconWrap}>{icon}</View>
    <Text style={detail.value} numberOfLines={2}>
      {value}
    </Text>
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────────────────

export const BookingConfirmationScreen: React.FC<BookingConfirmationProps> = ({
  bookingCode,
  pickupDisplayName,
  destinationDisplayName,
  startDate,
  carTypeName,
  totalAmount,
  currencyCode = 'USD',
  onViewTrips,
  onGoHome,
}) => {
  const contentAnim = useRef(new Animated.Value(0)).current;

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
          {/* Subtle gold glow behind check */}
          <View style={screen.glow} />

          <View style={screen.content}>
            {/* Check animation */}
            <AnimatedCheck />

            {/* Heading */}
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
              <Text style={screen.code}>{bookingCode}</Text>
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
              <DetailRow icon={<MapPin size={13} color={GOLD} />} value={pickupDisplayName} />
              <DetailRow icon={<MapPin size={13} color={GOLD} />} value={destinationDisplayName} />
              <View style={screen.summaryDivider} />

              <View style={screen.summaryDivider} />
              <DetailRow
                icon={<Calendar size={13} color={GOLD} />}
                value={formatDateTime(startDate)}
              />
              {carTypeName ? (
                <>
                  <View style={screen.summaryDivider} />
                  <DetailRow icon={<Car size={13} color={GOLD} />} value={carTypeName} />
                </>
              ) : null}
              {totalAmount ? (
                <>
                  <View style={screen.summaryDivider} />
                  <DetailRow
                    icon={<Clock size={13} color={GOLD} />}
                    value={`${formatCurrency(totalAmount, currencyCode)} — charged on confirmation`}
                  />
                </>
              ) : null}
            </Animated.View>

            {/* Notice */}
            <Animated.View style={[screen.notice, { opacity: contentAnim }]}>
              <View style={screen.noticeDot} />
              <Text style={screen.noticeText}>
                Your card has been saved but not charged. Payment is collected only after a driver
                accepts your trip.
              </Text>
            </Animated.View>
          </View>

          {/* CTAs */}
          <Animated.View style={[screen.actions, { opacity: contentAnim }]}>
            <PrimaryButton size={ButtonSize.XLARGE} onPress={onViewTrips} title="View My Trips" />
            <TextButton size={ButtonSize.XLARGE} onPress={onGoHome} title="Back to Home" />
          </Animated.View>
        </PageSafeContainer>
      </ScrollView>
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
  value: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    lineHeight: 19,
  },
});

const screen = StyleSheet.create({
  glow: {
    position: 'absolute',
    top: '20%',
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
    paddingTop: 48,
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
    color: 'rgba(212,168,83,0.55)',
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
});
