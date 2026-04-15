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
import { X, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LoadingSpinner } from '../../loading/loadingSpinner';
import { theme } from '~/theme/theme';
import Text from '../../text';

// ─── Types ────────────────────────────────────────────────────────────────────

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
  allowCommas?: boolean;

  // ── Dark / branded mode ──────────────────────────────────────────────────
  // Pass variant="dark" to get the gold-bordered FormField look.
  // In dark mode, onPress makes the whole field tappable (readonly).
  variant?: 'light' | 'dark';
  onPress?: () => void; // dark mode: makes field a tappable readonly row
  showChevron?: boolean; // dark mode: show chevron (default true when onPress set)
  icon?: ReactNode; // dark mode: left icon badge (replaces leftIcon)
}

// ─── Component ────────────────────────────────────────────────────────────────

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
      allowCommas = false,
      variant = 'light',
      onPress,
      showChevron,
      icon,
      placeholder,
      editable = true,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // ── Comma formatting ─────────────────────────────────────────────────────

    const formatWithCommas = (text: string): string => {
      const cleanNumber = text.replace(/[^0-9.]/g, '');
      if (cleanNumber === '') return '';
      const parts = cleanNumber.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    };

    const removeCommas = (text: string): string => text.replace(/,/g, '');

    const displayValue = allowCommas && value ? formatWithCommas(value.toString()) : (value ?? '');

    // ── Handlers ─────────────────────────────────────────────────────────────

    const showClearButton = clearable && value !== undefined && value.toString().length > 0;

    const handleClear = () => onChangeText?.('');

    const handleFocus = (e: any) => {
      setIsFocused(true);
      rest.onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      rest.onBlur?.(e);
    };

    const handleChangeText = (text: string) => {
      if (allowCommas) {
        onChangeText?.(removeCommas(text));
      } else {
        onChangeText?.(text);
      }
    };

    // ── Dark variant ─────────────────────────────────────────────────────────

    if (variant === 'dark') {
      const isReadonly = !!onPress;
      const resolvedShowChevron = showChevron ?? isReadonly;
      const showClear = clearable && !isReadonly && value && value.toString().length > 0;

      const darkInner = (
        <LinearGradient
          colors={['rgba(212,168,83,0.08)', 'rgba(212,168,83,0.03)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[dark.gradient, !!error && dark.gradientError]}>
          {icon && <View style={dark.iconWrap}>{icon}</View>}

          {isReadonly ? (
            <Text style={[dark.valueText, !value && dark.placeholder]} numberOfLines={1}>
              {value || placeholder}
            </Text>
          ) : (
            <TextInput
              ref={ref}
              value={displayValue}
              onChangeText={handleChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              placeholderTextColor="rgba(255,255,255,0.4)"
              editable={editable}
              allowFontScaling={false}
              style={[dark.valueText, dark.input, style]}
              {...rest}
            />
          )}

          {resolvedShowChevron && <ChevronRight size={20} color="rgba(212,168,83,0.5)" />}
          {showClear && (
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={16} color="rgba(255,255,255,0.35)" />
            </TouchableOpacity>
          )}
          {loading && <LoadingSpinner />}
          {!resolvedShowChevron && !showClear && rightIcon && rightIcon}
        </LinearGradient>
      );

      return (
        <View style={[dark.wrapper, containerStyle]}>
          {label && (
            <Text style={[dark.label, labelStyle]}>
              {label}
              {required && <Text style={{ color: '#EF4444' }}> *</Text>}
            </Text>
          )}
          {isReadonly ? (
            <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
              {darkInner}
            </TouchableOpacity>
          ) : (
            darkInner
          )}
          {hint && <Text style={dark.hint}>{hint}</Text>}
          {errorMessage && <Text style={dark.error}>{errorMessage}</Text>}
        </View>
      );
    }

    // ── Light variant (original) ──────────────────────────────────────────────

    const inputBorderColor = error
      ? '#EF4444'
      : success
        ? '#22C55E'
        : isFocused
          ? '#9CA3AF'
          : '#D1D5DB';

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
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <TextInput
            allowFontScaling={allowFontScaling}
            ref={ref}
            value={displayValue}
            placeholder={placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            editable={editable}
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

InputField.displayName = 'InputField';

export default InputField;

// ─── Light styles (original, unchanged) ──────────────────────────────────────

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

// ─── Dark styles ──────────────────────────────────────────────────────────────

const dark = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: 'white',
    marginBottom: 8,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    gap: 10,
  },
  gradientError: {
    borderColor: 'rgba(239,68,68,0.6)',
  },
  iconWrap: {
    width: 25,
    height: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
  },
  input: {
    padding: 0,
    margin: 0,
  },
  placeholder: {
    color: 'rgba(255,255,255,0.4)',
  },
  hint: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 5,
    marginLeft: 2,
  },
});
