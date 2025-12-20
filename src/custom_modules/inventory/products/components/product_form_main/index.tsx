import React from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { ProductFormData } from '../../interfaces';

interface ProductFormMainProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export const ProductFormMain: React.FC<ProductFormMainProps> = ({ control, errors }) => {
  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Product Name <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: 'Product name is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter product name"
              placeholderTextColor="#9CA3AF"
            />
          )}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter product description"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>HTML Description</Text>
        <Controller
          control={control}
          name="htmlDescription"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter HTML description (optional)"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>SKU</Text>
        <Controller
          control={control}
          name="sku"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter SKU (optional)"
              placeholderTextColor="#9CA3AF"
            />
          )}
        />
      </View>

      <View style={styles.formGroup}>
        <Controller
          control={control}
          name="isActive"
          render={({ field: { onChange, value } }) => (
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Available for Sale</Text>
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
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
