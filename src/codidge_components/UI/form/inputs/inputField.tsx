import React, { forwardRef, ReactNode, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { X } from 'lucide-react-native'; // make sure you have RN version
import { LoadingSpinner } from '../../loading/loadingSpinner';
import { theme } from '~/theme/theme';
import Text from '../../text';

interface InputProps extends TextInputProps {
  label?: string;
  hint?: string;
  errorMessage?: string;
  success?: boolean;
  error?: boolean;
  clearable?: boolean;
  loading?: boolean;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  labelStyle?: TextStyle;
  required?: boolean;
  containerStyle?: ViewStyle;
  allowCommas?: boolean; // New prop
}

const InputField = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      hint,
      errorMessage,
      success,
      error,
      clearable,
      loading,
      rightIcon,
      leftIcon,
      value,
      onChangeText,
      style,
      labelStyle,
      required,
      containerStyle,
      allowFontScaling = false,
      allowCommas = false, // Default to false
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // Format number with commas
    const formatWithCommas = (text: string): string => {
      // Remove all non-digit characters except decimal point
      const cleanNumber = text.replace(/[^0-9.]/g, '');

      if (cleanNumber === '') return '';

      // Split by decimal point to handle decimal numbers
      const parts = cleanNumber.split('.');

      // Format the integer part with commas
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      // Join back with decimal if it exists
      return parts.join('.');
    };

    // Remove commas for editing
    const removeCommas = (text: string): string => {
      return text.replace(/,/g, '');
    };

    const showClearButton = clearable && value !== undefined && value.toString().length > 0;

    const handleClear = () => {
      if (onChangeText) {
        onChangeText('');
      }
    };

    const handleFocus = (e: any) => {
      setIsFocused(true);
      if (rest.onFocus) {
        rest.onFocus(e);
      }
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      if (rest.onBlur) {
        rest.onBlur(e);
      }
    };

    const handleChangeText = (text: string) => {
      if (allowCommas) {
        // Remove commas to get the clean number
        const cleanText = removeCommas(text);

        // Pass the clean number to parent
        if (onChangeText) {
          onChangeText(cleanText);
        }
      } else {
        if (onChangeText) {
          onChangeText(text);
        }
      }
    };

    // Display formatted value with commas
    const displayValue = allowCommas && value ? formatWithCommas(value.toString()) : (value ?? '');

    const inputBorderColor = error
      ? '#EF4444' // red
      : success
        ? '#22C55E' // green
        : '#D1D5DB'; // gray

    const inputPaddingLeft = leftIcon ? 46 : 12;
    const inputPaddingRight = rightIcon ? 38 : 12;

    return (
      <View style={[{ marginBottom: 12 }, containerStyle]}>
        {label && (
          <Text style={[styles.label, labelStyle]}>
            {label}
            {required && <Text style={{ color: 'red' }}> *</Text>}
          </Text>
        )}
        <View style={styles.container}>
          {leftIcon && <View style={[styles.leftIcon]}>{leftIcon}</View>}
          <TextInput
            allowFontScaling={allowFontScaling}
            ref={ref}
            value={displayValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            style={[
              styles.input,
              {
                borderColor: inputBorderColor,
                paddingLeft: inputPaddingLeft,
                paddingRight: inputPaddingRight,
              },
              style,
            ]}
            {...rest}
          />
          {showClearButton && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <X size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          {loading && (
            <View style={styles.loading}>
              <LoadingSpinner />
            </View>
          )}
          {!showClearButton && rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
        {hint && (
          <Text style={[styles.hint, error ? styles.errorText : success ? styles.successText : {}]}>
            {hint}
          </Text>
        )}
        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      </View>
    );
  }
);

InputField.displayName = 'Input';

export default InputField;

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 5,
  },
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 48,
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  loading: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  leftIcon: {
    position: 'absolute',
    left: 2,
    top: '50%',
    transform: [{ translateY: -8 }],
    marginLeft: 16,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 2,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  hint: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  errorText: {
    color: '#EF4444',
  },
  successText: {
    color: '#22C55E',
  },
  errorMessage: {
    marginTop: 4,
    fontSize: 14,
    color: '#EF4444',
  },
});
