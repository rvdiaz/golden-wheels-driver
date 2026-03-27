import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { ArrowLeft, X } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { StepIndicator } from './stepIndicator';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

const GOLD = theme.colors.primary;

export interface BookingFlowWrapperProps {
  children: React.ReactNode;

  // Step state
  currentStep: number; // 0-indexed
  totalSteps: number;

  // Header
  stepLabel: string; // e.g. "Trip Details"
  stepSubtitle?: string;
  onBack: () => void;
  // Dismiss (top-right X)
  onDismiss?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BookingFlowWrapper: React.FC<BookingFlowWrapperProps> = ({
  children,
  currentStep,
  totalSteps,
  onDismiss,
  onBack,
}) => {
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
      <PageSafeContainer>
        <KeyboardAvoidingView
          style={styles.root}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* ── Dark header ── */}
          <View style={styles.header}>
            {/* Background */}

            {/* Top row: back + dismiss */}
            <View style={styles.headerTopRow}>
              <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
                <ArrowLeft size={18} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>

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

          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <View style={styles.cardInner}>{children}</View>
          </Animated.View>
        </KeyboardAvoidingView>
      </PageSafeContainer>
    </BodyWrapper>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
});
