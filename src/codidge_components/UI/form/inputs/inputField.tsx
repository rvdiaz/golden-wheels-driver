import React, { forwardRef, ReactNode } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  TextStyle,
} from 'react-native';
import { X } from 'lucide-react-native'; // make sure you have RN version
import { LoadingSpinner } from '../../loading/loadingSpinner';

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
      ...rest
    },
    ref
  ) => {
    const showClearButton = clearable && value !== undefined && value.toString().length > 0;

    const handleClear = () => {
      if (onChangeText) {
        onChangeText('');
      }
    };

    const inputBorderColor = error
      ? '#EF4444' // red
      : success
        ? '#22C55E' // green
        : '#D1D5DB'; // gray

    const inputPaddingLeft = leftIcon ? 46 : 12;
    const inputPaddingRight = rightIcon ? 38 : 12;

    return (
      <View style={{ marginBottom: 12 }}>
        {label && (
          <Text style={[styles.label, labelStyle]}>
            {label}
            {required && <Text style={{ color: 'red' }}> *</Text>}
          </Text>
        )}
        <View style={styles.container}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            value={value?.toString()}
            onChangeText={onChangeText}
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
    borderRadius: 8,
    flex: 1,
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
