import React from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import { Controller, Control, FieldErrors, useWatch } from 'react-hook-form';
import { ProductFormData } from '../../interfaces';

interface ProductFormQuantityProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export const ProductFormQuantity: React.FC<ProductFormQuantityProps> = ({ control, errors }) => {
  const isUnlimited = useWatch({
    control,
    name: 'quantity.unlimited',
  });

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Controller
          control={control}
          name="quantity.unlimited"
          render={({ field: { onChange, value } }) => (
            <View style={styles.switchContainer}>
              <View>
                <Text style={styles.label}>Unlimited Stock</Text>
                <Text style={styles.helpText}>Enable if product is always available</Text>
              </View>
              <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>
          )}
        />
      </View>

      {!isUnlimited && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Available Quantity <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="quantity.availableQuantity"
            rules={{
              validate: (value) => {
                if (isUnlimited) return true;
                const num = parseInt(value.toString());
                if (isNaN(num) || num < 0) {
                  return 'Quantity must be a valid positive number';
                }
                return true;
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.quantity?.availableQuantity && styles.inputError]}
                value={value.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  onChange(num);
                }}
                onBlur={onBlur}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
              />
            )}
          />
          {errors.quantity?.availableQuantity && (
            <Text style={styles.errorText}>{errors.quantity.availableQuantity.message}</Text>
          )}
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={styles.infoText}>
          {isUnlimited
            ? 'This product will always be available for purchase'
            : 'Stock will decrease with each purchase. Set to 0 to make unavailable.'}
        </Text>
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
    marginTop: 2,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    marginTop: 8,
  },
  infoIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
});
