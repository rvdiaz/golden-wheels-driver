import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ButtonSize } from './PrimaryButton';

interface TextButtonProps {
  loading?: boolean;
  size?: ButtonSize;
  disabled?: boolean;
  onPress?: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const sizeStyles = {
  [ButtonSize.SMALL]: { paddingVertical: 4, paddingHorizontal: 4, fontSize: 12 },
  [ButtonSize.MEDIUM]: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 },
  [ButtonSize.LARGE]: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 16 },
};

const TextButton: React.FC<TextButtonProps> = ({
  loading = false,
  size = ButtonSize.MEDIUM,
  disabled = false,
  onPress,
  title,
  style,
  textStyle,
}) => {
  const disabledAux = loading || disabled;
  const sizeStyle = sizeStyles[size];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabledAux}
      style={[
        styles.button,
        {
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color="#6B7280" />
      ) : (
        <Text style={[styles.text, { fontSize: sizeStyle.fontSize }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#6B7280', // gray-500
    fontWeight: '500',
  },
});

export default TextButton;
