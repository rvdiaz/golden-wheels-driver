import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LoadingSpinner } from '../loading/loadingSpinner';

export enum ButtonSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
}

interface PrimaryButtonProps {
  loading?: boolean;
  size?: ButtonSize;
  disabled?: boolean;
  onPress?: () => void;
  title: string;
  rightWidget?: ReactNode;
  leftWidget?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const sizeStyles = {
  [ButtonSize.SMALL]: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 14 },
  [ButtonSize.MEDIUM]: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 16 },
  [ButtonSize.LARGE]: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 18 },
};

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
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabledAux}
      style={[
        styles.button,
        {
          backgroundColor: disabledAux ? '#D1D5DB' : '#2563EB', // gray-300 or brand-500
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
        },
        style,
      ]}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <View style={styles.buttonBody}>
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
    minWidth: 96, // ~min-w-24
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  text: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default PrimaryButton;
