import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { ProductFormData } from '../../interfaces';

interface ProductFormPricingProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export const ProductFormPricing: React.FC<ProductFormPricingProps> = ({ control, errors }) => {
  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Base Price <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="basePrice"
          rules={{
            required: 'Base price is required',
            validate: (value) => {
              const num = parseFloat(value);
              if (isNaN(num) || num < 0) {
                return 'Price must be a valid positive number';
              }
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.input, errors.basePrice && styles.inputError]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
            </View>
          )}
        />
        {errors.basePrice && <Text style={styles.errorText}>{errors.basePrice.message}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Sale Price</Text>
        <Text style={styles.helpText}>Leave empty if not on sale</Text>
        <Controller
          control={control}
          name="salePrice"
          rules={{
            validate: (value) => {
              if (!value) return true;
              const num = parseFloat(value);
              if (isNaN(num) || num < 0) {
                return 'Sale price must be a valid positive number';
              }
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.input, errors.salePrice && styles.inputError]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
            </View>
          )}
        />
        {errors.salePrice && <Text style={styles.errorText}>{errors.salePrice.message}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Currency</Text>
        <Controller
          control={control}
          name="currencyCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="USD"
              placeholderTextColor="#9CA3AF"
              maxLength={3}
              autoCapitalize="characters"
            />
          )}
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>Sale price must be lower than base price to be applied</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  formGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  currencySymbol: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    height: '100%',
    paddingTop: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 0,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    marginTop: 8,
  },
  infoIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
});
