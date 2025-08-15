import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { UserPlus, User, Phone, Mail, MapPin, FileText, Tag } from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';

interface Contact {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  category: 'lead' | 'follow-up' | 'closed-deal';
}

const categoryOptions = [
  { value: 'lead', label: 'Lead', color: '#f59e0b' },
  { value: 'follow-up', label: 'Follow Up', color: '#3b82f6' },
  { value: 'Client', label: 'Client', color: '#10b981' },
];

export default function ContactForm({ disposeModalHandler }: { disposeModalHandler: () => void }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<Contact>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
      category: 'lead',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: Contact) => {
    const selectedCategory = categoryOptions.find((c) => c.value === data.category);

    Alert.alert('Contact Saved', `${data.name} has been added as a ${selectedCategory?.label}.`, [
      {
        text: 'Add Another',
        onPress: () => reset(),
      },
      { text: 'OK' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="New Contact"
        rightAction={() => {
          disposeModalHandler();
        }}
        rightText="Close"
      />

      <ScrollView
        style={styles.form}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formContent}>
        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <User size={16} color="#6b7280" />
            <Text style={styles.fieldLabel}>Full Name *</Text>
          </View>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.textInput, errors.name && styles.textInputError]}
                placeholder="Enter full name"
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
        </View>

        {/* Phone Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Phone size={16} color="#6b7280" />
            <Text style={styles.fieldLabel}>Phone Number *</Text>
          </View>
          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'Phone number is required',
              pattern: {
                value: /^[\+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid phone number',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.textInput, errors.phone && styles.textInputError]}
                placeholder="(555) 123-4567"
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
              />
            )}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
        </View>

        {/* Email Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Mail size={16} color="#6b7280" />
            <Text style={styles.fieldLabel}>Email Address *</Text>
          </View>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.textInput, errors.email && styles.textInputError]}
                placeholder="email@example.com"
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
        </View>

        {/* Address Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <MapPin size={16} color="#6b7280" />
            <Text style={styles.fieldLabel}>Address</Text>
          </View>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textInput}
                placeholder="123 Main St, City, State 12345"
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Tag size={16} color="#6b7280" />
            <Text style={styles.fieldLabel}>Category</Text>
          </View>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <View style={styles.categoryContainer}>
                {categoryOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.categoryOption,
                      value === option.value && styles.categoryOptionSelected,
                    ]}
                    onPress={() => onChange(option.value)}>
                    <View style={[styles.categoryDot, { backgroundColor: option.color }]} />
                    <Text
                      style={[
                        styles.categoryText,
                        value === option.value && styles.categoryTextSelected,
                      ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>

        {/* Notes Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <FileText size={16} color="#6b7280" />
            <Text style={styles.fieldLabel}>Notes</Text>
          </View>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                placeholder="Add any additional notes about this contact..."
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            )}
          />
        </View>
      </ScrollView>
      <View style={styles.bottomBarContainer}>
        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}>
          <UserPlus size={20} color="#ffffff" />
          <Text style={styles.submitButtonText}>Save Contact</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    padding: 24,
  },
  formContent: {
    paddingBottom: 100,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#ffffff',
  },
  textInputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  notesInput: {
    height: 100,
    paddingTop: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  categoryOptionSelected: {
    borderColor: '#374151',
    backgroundColor: '#f9fafb',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#374151',
    fontWeight: '600',
  },
  bottomBarContainer: {
    paddingHorizontal: 20,
  },
  submitButton: {
    backgroundColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  requiredNote: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
  },
});
