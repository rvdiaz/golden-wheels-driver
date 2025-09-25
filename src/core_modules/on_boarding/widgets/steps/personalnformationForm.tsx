import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { FooterConfig, FormWrapper, HeaderConfig } from '../formsWrapper';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { OnboardingFormData } from '../../interface';

// Validation rules
const validationRules = {
  firstName: {
    required: 'First name is required',
    minLength: {
      value: 2,
      message: 'First name must be at least 2 characters',
    },
  },
  lastName: {
    required: 'Last name is required',
    minLength: {
      value: 2,
      message: 'Last name must be at least 2 characters',
    },
  },
  mlsNumber: {
    required: 'License Number is required',
    minLength: {
      value: 2,
      message: 'License Number must be at least 2 characters',
    },
  },
  zipCode: {
    required: 'Zip Code is required',
    minLength: {
      value: 2,
      message: 'Zip Code must be at least 2 characters',
    },
  },
  brokerage: {
    minLength: {
      value: 2,
      message: 'Last name must be at least 2 characters',
    },
  },
  /*  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
  },
  phone: {
    required: 'Phone number is required',
    minLength: {
      value: 10,
      message: 'Phone number must be at least 10 digits',
    },
  }, */
};

// Main Personal Information Component
export const PersonalInformation = ({
  header,
  footer,
  props,
  currentStep,
}: {
  header: HeaderConfig;
  footer: FooterConfig;
  props: any;
  currentStep: number;
}) => {
  // Get form methods from context (provided by FormProvider in parent)
  const {
    control,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  return (
    <FormWrapper header={header} footer={footer} props={props} currentStep={currentStep}>
      <View style={styles.formContent}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            <Controller
              name="personalInfo.firstName"
              control={control}
              rules={validationRules.firstName}
              render={({ field: { onChange, value, onBlur } }) => (
                <InputField
                  label="First Name"
                  required={true}
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your first name"
                  placeholderTextColor="#999"
                  errorMessage={errors.personalInfo?.firstName?.message}
                  error={!!errors.personalInfo?.firstName}
                />
              )}
            />
          </View>

          <View style={styles.inputContainer}>
            <Controller
              name="personalInfo.lastName"
              control={control}
              rules={validationRules.lastName}
              render={({ field: { onChange, value, onBlur } }) => (
                <InputField
                  label="Last Name"
                  required={true}
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your last name"
                  placeholderTextColor="#999"
                  errorMessage={errors.personalInfo?.lastName?.message}
                  error={!!errors.personalInfo?.lastName}
                />
              )}
            />
          </View>

          <View style={styles.inputContainer}>
            <Controller
              name="personalInfo.mlsNumber"
              control={control}
              rules={validationRules.mlsNumber}
              render={({ field: { onChange, value, onBlur } }) => (
                <InputField
                  label="License Number"
                  required={true}
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your mls number"
                  placeholderTextColor="#999"
                  errorMessage={errors.personalInfo?.mlsNumber?.message}
                  error={!!errors.personalInfo?.mlsNumber}
                />
              )}
            />
          </View>

          <View style={styles.inputContainer}>
            <Controller
              name="personalInfo.zipCode"
              control={control}
              rules={validationRules.zipCode}
              render={({ field: { onChange, value, onBlur } }) => (
                <InputField
                  label="Zip Code"
                  required={true}
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your zip code"
                  placeholderTextColor="#999"
                  errorMessage={errors.personalInfo?.zipCode?.message}
                  error={!!errors.personalInfo?.zipCode}
                />
              )}
            />
          </View>

          {/* <View style={styles.inputContainer}>
            <Controller
              name="personalInfo.email"
              control={control}
              rules={validationRules.email}
              render={({ field: { onChange, value, onBlur } }) => (
                <InputField
                  label="Email"
                  required={true}
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  errorMessage={errors.personalInfo?.email?.message}
                  error={!!errors.personalInfo?.email}
                />
              )}
            />
          </View>

          <View style={styles.inputContainer}>
            <Controller
              name="personalInfo.phone"
              control={control}
              rules={validationRules.phone}
              render={({ field: { onChange, value, onBlur } }) => (
                <InputField
                  label="Phone"
                  required={true}
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  errorMessage={errors.personalInfo?.phone?.message}
                  error={!!errors.personalInfo?.phone}
                />
              )}
            />
          </View> */}
        </ScrollView>
      </View>
    </FormWrapper>
  );
};

const styles = StyleSheet.create({
  formContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 8,
  },
});
