import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { BookingDriverStatus } from '../interfaces';
import { theme } from '~/theme/theme';

// ─── Constants ────────────────────────────────────────────────────────────────

const GREEN = '#4ade80';
const GREEN_12 = 'rgba(34,197,94,0.12)';
const GREEN_22 = 'rgba(34,197,94,0.22)';
const GREEN_35 = 'rgba(34,197,94,0.35)';
const GOLD = theme.colors.primary;
const BLUE = '#60a5fa';
const BLUE_12 = 'rgba(96,165,250,0.12)';
const BLUE_22 = 'rgba(96,165,250,0.22)';
const BLUE_35 = 'rgba(96,165,250,0.35)';
const PURPLE = '#a78bfa';
const PURPLE_12 = 'rgba(167,139,250,0.12)';
const PURPLE_35 = 'rgba(167,139,250,0.35)';

// ─── Step config ──────────────────────────────────────────────────────────────

interface StepConfig {
  key: BookingDriverStatus;
  shortLabel: string;
  icon: string;
}

const STEPS: StepConfig[] = [
  { key: 'assigned', shortLabel: 'Assigned', icon: '✓' },
  { key: 'en_route', shortLabel: 'En Route', icon: '→' },
  { key: 'arrived', shortLabel: 'Arrived', icon: '📍' },
  { key: 'in_progress', shortLabel: 'Driving', icon: '⚡' },
  { key: 'completed', shortLabel: 'Done', icon: '✓' },
];

const STEP_ORDER: BookingDriverStatus[] = STEPS.map((s) => s.key);

// ─── Per-status display config ─────────────────────────────────────────────────

interface StatusDisplay {
  /** Passenger-facing headline */
  passengerHeadline: string;
  /** Manager-facing headline */
  managerHeadline: string;
  /** Subtext shown below headline */
  subtext: string;
  /** Accent colour for the active step & pulse */
  color: string;
  colorBg: string;
  colorBorder: string;
  /** Whether the pulse dot should animate */
  pulse: boolean;
}

export const STATUS_DISPLAY: Record<BookingDriverStatus, StatusDisplay> = {
  assigned: {
    passengerHeadline: 'Driver Assigned',
    managerHeadline: 'Driver Assigned',
    subtext: 'Your driver has been assigned and will head your way soon.',
    color: GOLD,
    colorBg: 'rgba(218,192,114,0.12)',
    colorBorder: 'rgba(218,192,114,0.28)',
    pulse: false,
  },
  en_route: {
    passengerHeadline: 'Driver Is On the Way',
    managerHeadline: 'Driver In Route to Pickup',
    subtext: 'Your driver is heading to the pickup location.',
    color: BLUE,
    colorBg: BLUE_12,
    colorBorder: BLUE_22,
    pulse: true,
  },
  arrived: {
    passengerHeadline: 'Driver Has Arrived',
    managerHeadline: 'Driver Arrived at Pickup',
    subtext: 'Your driver is waiting at the pickup point.',
    color: GREEN,
    colorBg: GREEN_12,
    colorBorder: GREEN_22,
    pulse: true,
  },
  in_progress: {
    passengerHeadline: 'Trip in Progress',
    managerHeadline: 'Trip in Progress',
    subtext: 'On the way to the destination.',
    color: BLUE,
    colorBg: BLUE_12,
    colorBorder: BLUE_35,
    pulse: true,
  },
  completed: {
    passengerHeadline: 'Trip Completed',
    managerHeadline: 'Trip Completed ✓',
    subtext: 'You have arrived at your destination.',
    color: GREEN,
    colorBg: GREEN_12,
    colorBorder: GREEN_35,
    pulse: false,
  },
};

// ─── Pulse Dot ─────────────────────────────────────────────────────────────────

interface PulseDotProps {
  color: string;
  size?: number;
}

const PulseDot = ({ color, size = 8 }: PulseDotProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.55,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.85,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(300),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [scale, opacity]);

  return (
    <View style={{ width: size, height: size }}>
      {/* Static core */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }}
      />
      {/* Animated ring */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ scale }],
          opacity,
        }}
      />
    </View>
  );
};

// ─── Step Pip ──────────────────────────────────────────────────────────────────

interface StepPipProps {
  state: 'done' | 'active' | 'upcoming';
  color: string;
  isLast: boolean;
}

const StepPip = ({ state, color, isLast }: StepPipProps) => {
  const isDone = state === 'done';
  const isActive = state === 'active';

  return (
    <View style={pipStyles.wrapper}>
      <View
        style={[
          pipStyles.dot,
          isDone && { backgroundColor: color, borderColor: color },
          isActive && { backgroundColor: 'transparent', borderColor: color, borderWidth: 1.5 },
          state === 'upcoming' && {
            backgroundColor: 'transparent',
            borderColor: 'rgba(255,255,255,0.14)',
            borderWidth: 1,
          },
        ]}>
        {isActive && <View style={[pipStyles.activeFill, { backgroundColor: color }]} />}
        {isDone && <Text style={[pipStyles.checkmark, { color: '#000' }]}>✓</Text>}
      </View>
      {!isLast && (
        <View
          style={[
            pipStyles.connector,
            isDone
              ? { backgroundColor: color, opacity: 0.5 }
              : { backgroundColor: 'rgba(255,255,255,0.08)' },
          ]}
        />
      )}
    </View>
  );
};

const pipStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFill: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  checkmark: {
    fontSize: 7,
    fontWeight: '700',
    lineHeight: 14,
  },
  connector: {
    position: 'absolute',
    top: 7,
    left: '50%',
    width: '100%',
    height: 1,
    // connector drawn via the row layout — see ProgressTrack
  },
});

// ─── Progress Track ────────────────────────────────────────────────────────────

interface ProgressTrackProps {
  driverStatus: BookingDriverStatus;
  color: string;
}

const ProgressTrack = ({ driverStatus, color }: ProgressTrackProps) => {
  const currentIndex = STEP_ORDER.indexOf(driverStatus);

  return (
    <View style={trackStyles.container}>
      {STEPS.map((step, i) => {
        const state: 'done' | 'active' | 'upcoming' =
          i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'upcoming';

        return (
          <View key={step.key} style={trackStyles.stepCol}>
            <View style={trackStyles.pipRow}>
              <View
                style={[
                  trackStyles.connectorLeft,
                  i === 0 && { opacity: 0 },
                  i <= currentIndex
                    ? { backgroundColor: color, opacity: 0.45 }
                    : { backgroundColor: 'rgba(255,255,255,0.08)' },
                ]}
              />
              <View
                style={[
                  trackStyles.pip,
                  state === 'done' && { backgroundColor: color },
                  state === 'active' && {
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: color,
                  },
                  state === 'upcoming' && {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.14)',
                  },
                ]}>
                {state === 'active' && (
                  <View style={[trackStyles.pipFill, { backgroundColor: color }]} />
                )}
                {state === 'done' && <Text style={trackStyles.pipCheck}>✓</Text>}
              </View>
              <View
                style={[
                  trackStyles.connectorRight,
                  i === STEPS.length - 1 && { opacity: 0 },
                  i < currentIndex
                    ? { backgroundColor: color, opacity: 0.45 }
                    : { backgroundColor: 'rgba(255,255,255,0.08)' },
                ]}
              />
            </View>
            <Text
              style={[
                trackStyles.stepLabel,
                state === 'active' && { color, opacity: 1 },
                state === 'done' && { color, opacity: 0.7 },
                state === 'upcoming' && { color: 'rgba(255,255,255,0.22)', opacity: 1 },
              ]}
              numberOfLines={1}>
              {step.shortLabel}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const trackStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 2,
  },
  stepCol: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  pipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  connectorLeft: {
    flex: 1,
    height: 1,
  },
  connectorRight: {
    flex: 1,
    height: 1,
  },
  pip: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipFill: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pipCheck: {
    fontSize: 7,
    fontWeight: '700',
    color: '#000',
    lineHeight: 14,
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});

// ─── Driver Status Bar (main export) ──────────────────────────────────────────

export interface DriverStatusBarProps {
  driverStatus: BookingDriverStatus;
  driverName?: string;
  /** If true, shows manager-specific copy (e.g. "Passenger Picked Up ✓") */
  isManager?: boolean;
}

export const DriverStatusBar = ({ driverStatus, driverName }: DriverStatusBarProps) => {
  const cfg = STATUS_DISPLAY[driverStatus];
  const headline = cfg.passengerHeadline;

  return (
    <View
      style={[barStyles.container, { backgroundColor: cfg.colorBg, borderColor: cfg.colorBorder }]}>
      {/* Header row */}
      <View style={barStyles.headerRow}>
        <View style={barStyles.headlineRow}>
          {cfg.pulse ? (
            <PulseDot color={cfg.color} size={8} />
          ) : (
            <View style={[barStyles.staticDot, { backgroundColor: cfg.color }]} />
          )}
          <Text style={[barStyles.headline, { color: cfg.color }]}>{headline}</Text>
        </View>
        {driverName && (
          <Text style={barStyles.driverLabel} numberOfLines={1}>
            {driverName}
          </Text>
        )}
      </View>

      {/* Subtext */}
      <Text style={barStyles.subtext}>{cfg.subtext}</Text>

      {/* Progress track */}
      <ProgressTrack driverStatus={driverStatus} color={cfg.color} />
    </View>
  );
};

const barStyles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 0.5,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    marginTop: 10,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  staticDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headline: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  driverLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  subtext: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 16,
    marginLeft: 15, // aligns under headline text (past dot + gap)
  },
});
