import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { FormWrapper } from './formsWrapper';
import { Controller, useFormContext } from 'react-hook-form';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { OnboardingFormData } from '../../../on_boarding/interface';
import Text from '~/codidge_components/UI/text';

// Validation rules
const validationRules = {
  desiredAnnualIncome: {
    required: 'Desired Annual Income is required',
  },
  avgCommissionBySales: {
    required: 'Average Commissions on Sales',
  },
  avgCommissionByRents: {
    required: 'Average Commissions on Rentals',
  },
};

// Preferences Component Example
export const FinantialGoals = ({ header, footer, props, currentStep, totalSteps }: any) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  const updatedFooter = {
    ...footer,
    progressPercentage: 100,
  };

  return (
    <FormWrapper
      header={header}
      footer={updatedFooter}
      props={props}
      currentStep={currentStep}
      totalSteps={totalSteps}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 280 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.formContent}>
            <Text style={styles.sectionTitle}>Finantial Goals</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputContainer}>
                <Controller
                  name="financialGoals.desiredAnnualIncome"
                  control={control}
                  rules={validationRules.desiredAnnualIncome}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="Desired Annual Income"
                      required={true}
                      value={value !== undefined && value !== null ? value.toString() : ''}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        const parsed = text.replace(/[^0-9]/g, ''); // keep only digits
                        onChange(parsed ? Number(parsed) : undefined);
                      }}
                      onBlur={onBlur}
                      placeholder="Ex: 150000"
                      errorMessage={errors.financialGoals?.desiredAnnualIncome?.message}
                      error={!!errors.financialGoals?.desiredAnnualIncome}
                    />
                  )}
                />
              </View>

              <View style={styles.inputContainer}>
                <Controller
                  name="financialGoals.avgCommissionBySales"
                  control={control}
                  rules={validationRules.avgCommissionBySales}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="Average commission per sales"
                      required={true}
                      value={value !== undefined && value !== null ? value.toString() : ''}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        const parsed = text.replace(/[^0-9]/g, ''); // keep only digits
                        onChange(parsed ? Number(parsed) : undefined);
                      }}
                      onBlur={onBlur}
                      placeholder="Enter your commissions in sales"
                      errorMessage={errors.financialGoals?.avgCommissionBySales?.message}
                      error={!!errors.financialGoals?.avgCommissionBySales}
                    />
                  )}
                />
              </View>

              <View style={styles.inputContainer}>
                <Controller
                  name="financialGoals.avgCommissionByRents"
                  control={control}
                  rules={validationRules.avgCommissionByRents}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="Average commission per rental"
                      required={true}
                      keyboardType="numeric"
                      value={value !== undefined && value !== null ? value.toString() : ''}
                      onChangeText={(text) => {
                        const parsed = text.replace(/[^0-9]/g, ''); // keep only digits
                        onChange(parsed ? Number(parsed) : undefined);
                      }}
                      onBlur={onBlur}
                      placeholder="Enter your commissions in rentals"
                      errorMessage={errors.financialGoals?.avgCommissionByRents?.message}
                      error={!!errors.financialGoals?.avgCommissionByRents}
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
