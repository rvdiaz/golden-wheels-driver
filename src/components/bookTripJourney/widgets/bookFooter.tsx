import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';

export interface FooterBookingProps {
  // Footer
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  hideBack?: boolean;
  errorMessage?: string;
  rightWidget?: ReactNode;
}

export const BookingFooter: React.FC<FooterBookingProps> = ({
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
  nextLoading = false,
  hideBack = false,
  errorMessage,
  rightWidget,
}) => {
  return (
    <View style={styles.footer}>
      {errorMessage && (
        <Text
          style={{
            fontSize: 14,
            color: '#EF4444',
            marginBottom: 10,
          }}>
          {errorMessage}
        </Text>
      )}

      <View style={styles.footerRow}>
        {!hideBack && onBack && (
          <OutlineButton
            size={ButtonSize.LARGE}
            onPress={onBack}
            title="Back"
            leftWidget={<ArrowLeft size={16} color={theme.colors.primary} />}
          />
        )}
        <PrimaryButton
          size={ButtonSize.XLARGE}
          title={nextLabel}
          onPress={onNext}
          disabled={nextDisabled}
          loading={nextLoading}
          rightWidget={rightWidget ?? <ArrowRight size={16} />}
          style={[styles.nextBtn, hideBack || !onBack ? { flex: 1 } : {}]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: {
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
