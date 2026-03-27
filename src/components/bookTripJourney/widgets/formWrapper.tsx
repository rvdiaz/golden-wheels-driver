// ─── BookingFlowWrapper.tsx ───────────────────────────────────────────────────
// The branded header + footer shell for every step in the booking flow.
// Replaces the onboarding FormWrapper with Golden Wheels dark aesthetic.

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ArrowRight, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '~/codidge_components/UI/text';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { theme } from '~/theme/theme';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { StepIndicator } from './stepIndicator';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';

const GOLD = theme.colors.primary;

// ─── Step indicator ───────────────────────────────────────────────────────────

// ─── Props ────────────────────────────────────────────────────────────────────

export interface BookingFlowWrapperProps {
  children: React.ReactNode;

  // Step state
  currentStep: number; // 0-indexed
  totalSteps: number;

  // Header
  stepLabel: string; // e.g. "Trip Details"
  stepSubtitle?: string;

  // Footer
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  hideBack?: boolean;
  customFooter?: React.ReactNode;

  // Dismiss (top-right X)
  onDismiss?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BookingFlowWrapper: React.FC<BookingFlowWrapperProps> = ({
  children,
  currentStep,
  totalSteps,
  stepLabel,
  stepSubtitle,
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
  nextLoading = false,
  hideBack = false,
  customFooter,
  onDismiss,
}) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade in content on step change
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  return (
    <BodyWrapper>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* ── Dark header ── */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          {/* Background */}

          {/* Top row: back + dismiss */}
          <View style={styles.headerTopRow}>
            {!hideBack && onBack ? (
              <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
                <ArrowLeft size={18} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            ) : (
              <View style={styles.iconBtnPlaceholder} />
            )}

            {/* Step counter pill */}
            <View style={styles.stepPill}>
              <Text style={styles.stepPillText}>
                {currentStep + 1} / {totalSteps}
              </Text>
            </View>

            {onDismiss ? (
              <TouchableOpacity onPress={onDismiss} style={styles.iconBtn} activeOpacity={0.7}>
                <X size={18} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
            ) : (
              <View style={styles.iconBtnPlaceholder} />
            )}
          </View>

          {/* Step indicator */}
          <View style={styles.indicatorWrap}>
            <StepIndicator current={currentStep} total={totalSteps} />
          </View>
        </View>

        {/* ── White/light content card ── */}
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <View style={styles.cardInner}>{children}</View>

          {/* ── Footer ── */}
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            {customFooter ?? (
              <View style={styles.footerRow}>
                {!hideBack && onBack && (
                  <OutlineButton
                    onPress={onBack}
                    title="Back"
                    leftWidget={<ArrowLeft size={16} color={theme.colors.primary} />}
                  />
                )}
                <PrimaryButton
                  size={ButtonSize.LARGE}
                  title={nextLabel}
                  onPress={onNext}
                  disabled={nextDisabled}
                  loading={nextLoading}
                  rightWidget={<ArrowRight size={16} color="#fff" />}
                  style={[styles.nextBtn, hideBack || !onBack ? { flex: 1 } : {}]}
                />
              </View>
            )}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </BodyWrapper>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  iconBtnPlaceholder: {
    width: 36,
    height: 36,
  },
  stepPill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(212,168,83,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.25)',
  },
  stepPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: GOLD,
    letterSpacing: 0.5,
  },
  indicatorWrap: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  // ── Content card ────────────────────────────────────────────────────────────
  card: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  backLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  nextBtn: {
    flex: 1,
  },
});
