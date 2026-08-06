import React, { ReactNode } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle, View, StyleProp } from 'react-native';
import { LoadingSpinner } from '../loading/loadingSpinner';
import { theme } from '~/theme/theme';
import { ButtonSize, sizeStyles } from './types';
import Text from '../text';
import { LinearGradient } from 'expo-linear-gradient';

interface PrimaryButtonProps {
  loading?: boolean;
  size?: ButtonSize;
  disabled?: boolean;
  onPress?: () => void;
  title: string;
  rightWidget?: ReactNode;
  leftWidget?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

// Derived from theme.colors.primary (#dac072)
// lighter stop → base → darker stop for depth
const GRADIENT_COLORS = ['#D4A853', '#C49440', '#C49440'] as [string, string, string];
const GRADIENT_LOCATIONS = [0, 0.5, 1] as [number, number, number];
const SHINE_COLORS = ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0)'] as [string, string];

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  loading = false,
  size = ButtonSize.MEDIUM,
  disabled = false,
  onPress,
  title,
  style,
  textStyle,
  rightWidget,
  leftWidget,
}) => {
  const disabledAux = loading || disabled;
  const sizeStyle = sizeStyles[size];

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      disabled={disabledAux}
      style={[
        styles.button,
        {
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          opacity: disabledAux ? 0.5 : 1,
        },
        style,
      ]}>
      {/* Primary gold gradient */}
      <LinearGradient
        colors={GRADIENT_COLORS}
        locations={GRADIENT_LOCATIONS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, { borderRadius: theme.borderRadius.md }]}
      />
      {/* Top shine */}
      <LinearGradient
        colors={SHINE_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: theme.borderRadius.md }]}
      />

      {loading ? (
        // Ink, not the default: this button carries the gold gradient fill.
        <LoadingSpinner color={theme.colors.primaryText} />
      ) : (
        <View
          style={[
            styles.buttonBody,
            {
              justifyContent: rightWidget ? 'space-between' : 'center',
            },
          ]}>
          {leftWidget && leftWidget}
          <Text style={[styles.text, { fontSize: sizeStyle.fontSize }, textStyle]}>{title}</Text>
          {rightWidget && rightWidget}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 96,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    // Glow derived from primary color
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
  },
  buttonBody: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    color: '#1a1000', // dark brown — high contrast on gold
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});

export default PrimaryButton;
