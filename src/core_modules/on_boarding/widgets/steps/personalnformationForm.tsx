import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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
};

// Main Personal Information Component
export const PersonalInformation = ({
  header,
  footer,
  props,
  currentStep,
  totalSteps,
}: {
  header: HeaderConfig;
  footer: FooterConfig;
  props: any;
  currentStep: number;
  totalSteps: number;
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  return (
    <FormWrapper
      header={header}
      footer={footer}
      props={props}
      currentStep={currentStep}
      totalSteps={totalSteps}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 280 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                      errorMessage={errors.personalInfo?.zipCode?.message}
                      error={!!errors.personalInfo?.zipCode}
                    />
                  )}
                />
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </FormWrapper>
  );
};

const styles = StyleSheet.create({
  formContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  keyboardAvoidingView: {
    flex: 1,
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
