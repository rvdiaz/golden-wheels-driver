import React, { ReactNode } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

interface IconButtonProps {
  loading?: boolean;
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'plain';
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const variantStyles = {
  primary: {
    backgroundColor: '#EFF6FF', // brand-50
    color: '#1D4ED8', // brand-700
  },
  secondary: {
    backgroundColor: '#F3F4F6', // gray-100
    color: '#4B5563', // gray-600
  },
  danger: {
    backgroundColor: '#FEE2E2', // red-100
    color: '#DC2626', // red-600
  },
  plain: {
    backgroundColor: '#fff', // red-100
    color: '#4B5563', // red-600
  },
};

const IconButton: React.FC<IconButtonProps> = ({
  loading = false,
  icon,
  variant = 'secondary',
  disabled = false,
  onPress,
  style,
}) => {
  const disabledAux = loading || disabled;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabledAux}
      style={[styles.button, { backgroundColor: variantStyles[variant].backgroundColor }, style]}>
      {loading ? <ActivityIndicator color={variantStyles[variant].color} /> : icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
