import React from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { CollectionFormData } from '../../interfaces';

interface CollectionFormMainProps {
  control: Control<CollectionFormData>;
  errors: FieldErrors<CollectionFormData>;
}

export const CollectionFormMain: React.FC<CollectionFormMainProps> = ({ control, errors }) => {
  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Collection Name <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: 'Collection name is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter collection name"
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
              placeholder="Enter collection description"
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
        <Text style={styles.helpText}>Optional rich text description for web display</Text>
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
        <Controller
          control={control}
          name="isActive"
          render={({ field: { onChange, value } }) => (
            <View style={styles.switchContainer}>
              <View>
                <Text style={styles.label}>Active Collection</Text>
                <Text style={styles.helpText}>Active collections are visible to customers</Text>
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
