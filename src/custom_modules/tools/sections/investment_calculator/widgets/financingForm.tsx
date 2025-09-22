// components/forms/FinancingForm.tsx
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Percent, Calculator } from 'lucide-react-native';
import { Card } from '~/codidge_components/UI/card';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';

interface FinancingFormProps {
  form: UseFormReturn<any>;
  onCalculate: () => void;
  isCalculating: boolean;
}

export const FinancingForm: React.FC<FinancingFormProps> = ({
  form,
  onCalculate,
  isCalculating,
}) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <View>
          <View style={styles.headerContainer}>
            <Percent size={20} color="#2563eb" />
            <Text style={styles.title}>Financing</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.grid}>
            {/* Loan Amount */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Loan Amount</Text>
              <Controller
                control={control}
                name="loanAmount"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    style={[styles.input, errors.loanAmount && styles.inputError]}
                    placeholder="400000"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(parseFloat(text) || 0)}
                    keyboardType="numeric"
                  />
                )}
              />
              <Text style={styles.helperText}>
                Auto-calculated from property value - down payment
              </Text>
              {/*    {errors.loanAmount && (
                <Text style={styles.errorText}>{errors.loanAmount.message}</Text>
              )} */}
            </View>

            {/* Interest Rate */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Interest Rate (%)</Text>
              <Controller
                control={control}
                name="interestRate"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    style={[styles.input, errors.interestRate && styles.inputError]}
                    placeholder="7.5"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(parseFloat(text) || 0)}
                    keyboardType="numeric"
                  />
                )}
              />
              {/*  {errors.interestRate && (
                <Text style={styles.errorText}>{errors.interestRate.message}</Text>
              )} */}
            </View>

            {/* Loan Term */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Loan Term (years)</Text>
              <Controller
                control={control}
                name="loanTerm"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    style={[styles.input, errors.loanTerm && styles.inputError]}
                    placeholder="30"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(parseInt(text) || 0)}
                    keyboardType="numeric"
                  />
                )}
              />
              {/*    {errors.loanTerm && <Text style={styles.errorText}>{errors.loanTerm.message}</Text>} */}
            </View>
          </View>

          {/* Calculate Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              onPress={onCalculate}
              disabled={isCalculating}
              size={ButtonSize.LARGE}
              rightWidget={<Calculator size={20} color="#ffffff" />}
              title={isCalculating ? 'Calculating...' : 'Calculate Investment Analysis'}
            />
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    gap: 24,
  },
  grid: {
    gap: 16,
  },
  inputContainer: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 2,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  buttonContainer: {
    paddingTop: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
