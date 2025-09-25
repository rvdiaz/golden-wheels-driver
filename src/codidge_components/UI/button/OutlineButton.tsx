import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { LoadingSpinner } from '../loading/loadingSpinner';
import { theme } from '~/theme/theme';

export enum ButtonSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
}

interface OutlineButtonProps {
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
  [ButtonSize.SMALL]: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 12 },
  [ButtonSize.MEDIUM]: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 12 },
  [ButtonSize.LARGE]: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 14 },
};

const OutlineButton: React.FC<OutlineButtonProps> = ({
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
          borderColor: disabledAux ? '#D1D5DB' : theme.colors.primary, // gray-300 or brand-500
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
          {title && (
            <Text
              style={[
                styles.text,
                {
                  fontSize: sizeStyle.fontSize,
                  color: disabledAux ? '#9CA3AF' : theme.colors.primary, // gray-400 or brand-500
                },
                textStyle,
              ]}>
              {title}
            </Text>
          )}
          {rightWidget && rightWidget}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 96,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    backgroundColor: 'transparent', // no fill
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
    fontWeight: '500',
  },
});

export default OutlineButton;
