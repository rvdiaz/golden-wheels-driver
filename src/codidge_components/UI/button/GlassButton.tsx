import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  StyleProp,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '~/theme/theme';
import Text from '../text';
import { ButtonSize, sizeStyles } from './types';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassButtonProps {
  onPress?: () => void;
  icon?: ReactNode;
  iconSize?: number; // pixel size for icon-only circular button
  size?: ButtonSize; // sm/md/lg — controls padding + font for label buttons
  title?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeOpacity?: number;
  disabled?: boolean;
  blurIntensity?: number;
  tint?: 'light' | 'dark' | 'default';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  onPress,
  icon,
  iconSize = 42,
  size = ButtonSize.MEDIUM,
  title,
  leftIcon,
  rightIcon,
  borderRadius,
  style,
  textStyle,
  activeOpacity = 0.7,
  disabled = false,
  blurIntensity = 40,
  tint = 'dark',
}) => {
  const iconOnly = !title;
  const sizeStyle = sizeStyles[size];
  const resolvedRadius = borderRadius ?? (iconOnly ? iconSize / 2 : theme.borderRadius.lg);

  const containerStyle: ViewStyle = iconOnly
    ? { width: iconSize, height: iconSize, borderRadius: resolvedRadius }
    : {
        borderRadius: resolvedRadius,
        paddingVertical: sizeStyle.paddingVertical,
        paddingHorizontal: sizeStyle.paddingHorizontal,
      };

  const inner = (
    <View style={styles.inner}>
      {!iconOnly && leftIcon}
      {iconOnly && icon}
      {title && (
        <Text style={[styles.label, { fontSize: sizeStyle.fontSize }, textStyle]}>{title}</Text>
      )}
      {!iconOnly && rightIcon}
    </View>
  );

  return (
    <LinearGradient
      colors={[theme.colors.primaryAlpha[20], theme.colors.primaryAlpha[5]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientBorder, style]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activeOpacity}
        disabled={disabled}
        style={[styles.button, containerStyle, disabled && styles.disabled]}>
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={blurIntensity}
            tint={tint}
            style={[StyleSheet.absoluteFill, { borderRadius: resolvedRadius, overflow: 'hidden' }]}
          />
        ) : null}
        {inner}
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  inner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  label: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.4,
  },
  gradientBorder: {
    borderRadius: theme.borderRadius.md,
  },
});
