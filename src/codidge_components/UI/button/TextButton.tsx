import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ButtonSize, sizeStyles } from './types';
import Text from '../text';

interface TextButtonProps {
  loading?: boolean;
  size?: ButtonSize;
  disabled?: boolean;
  onPress?: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  rightWidget?: ReactNode;
  leftWidget?: ReactNode;
}

const TextButton: React.FC<TextButtonProps> = ({
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
      {leftWidget && leftWidget}
      {loading ? (
        <ActivityIndicator color="#6B7280" />
      ) : (
        <Text style={[styles.text, { fontSize: sizeStyle.fontSize }, textStyle]}>{title}</Text>
      )}
      {rightWidget && rightWidget}
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
