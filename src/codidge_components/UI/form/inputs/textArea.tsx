import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';

interface TextAreaProps extends Omit<TextInputProps, 'multiline' | 'style'> {
  label?: string;
  errorMessage?: string;
  error?: boolean;
  required?: boolean;
  hint?: string;
  minLines?: number;
  containerStyle?: ViewStyle;
  variant?: 'light' | 'dark';
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  errorMessage,
  error,
  required,
  hint,
  minLines = 4,
  containerStyle,
  variant = 'light',
  placeholder,
  value,
  onChangeText,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const minHeight = minLines * 24;

  if (variant === 'dark') {
    return (
      <View style={[dk.wrapper, containerStyle]}>
        {label && (
          <Text style={dk.label}>
            {label}
            {required && <Text style={{ color: '#EF4444' }}> *</Text>}
          </Text>
        )}
        <LinearGradient
          colors={['rgba(212,168,83,0.08)', 'rgba(212,168,83,0.03)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[dk.gradient, !!error && dk.gradientError]}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.35)"
            multiline
            textAlignVertical="top"
            allowFontScaling={false}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[dk.input, { minHeight }]}
            {...rest}
          />
        </LinearGradient>
        {hint && <Text style={dk.hint}>{hint}</Text>}
        {errorMessage && <Text style={dk.error}>{errorMessage}</Text>}
      </View>
    );
  }

  const borderColor = error ? '#EF4444' : isFocused ? '#9CA3AF' : '#D1D5DB';

  return (
    <View style={[lt.wrapper, containerStyle]}>
      {label && (
        <Text style={lt.label}>
          {label}
          {required && <Text style={{ color: 'red' }}> *</Text>}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
        allowFontScaling={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[lt.input, { minHeight, borderColor }]}
        {...rest}
      />
      {hint && <Text style={[lt.hint, error && lt.errorText]}>{hint}</Text>}
      {errorMessage && <Text style={lt.errorMessage}>{errorMessage}</Text>}
    </View>
  );
};

const dk = StyleSheet.create({
  wrapper: { width: '100%', marginBottom: 12 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: 'white',
    marginBottom: 8,
  },
  gradient: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    padding: 14,
  },
  gradientError: { borderColor: 'rgba(239,68,68,0.6)' },
  input: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    padding: 0,
    margin: 0,
  },
  hint: { marginTop: 4, fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  error: { fontSize: 12, color: '#EF4444', marginTop: 5 },
});

const lt = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  hint: { marginTop: 4, fontSize: 12, color: '#6B7280' },
  errorText: { color: '#EF4444' },
  errorMessage: { marginTop: 4, fontSize: 14, color: '#EF4444' },
});
