// components/forms/PropertyForm.tsx
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import { Home, Percent } from 'lucide-react-native';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import Text from '~/codidge_components/UI/text';

interface PropertyFormProps {
  form: UseFormReturn<any>;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ form }) => {
  const { control, setValue, watch } = form;

  const watchedPropertyValue = watch('propertyValue');
  const watchedDownPayment = watch('downPayment');

  const handlePropertyValueChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setValue('propertyValue', numValue);

    // Auto-calculate closing costs at 3% of property value
    const calculatedClosingCosts = Math.round(numValue * 0.03);
    setValue('closingCosts', calculatedClosingCosts);

    // Auto-calculate loan amount
    if (numValue > watchedDownPayment) {
      setValue('loanAmount', numValue - watchedDownPayment);
    }
  };

  const handleDownPaymentChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setValue('downPayment', numValue);

    // Auto-calculate loan amount
    if (watchedPropertyValue > numValue) {
      setValue('loanAmount', watchedPropertyValue - numValue);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card
        style={[
          styles.card,
          {
            marginTop: 16,
          },
        ]}>
        <View>
          <View style={styles.headerContainer}>
            <Home size={20} color="#3b82f6" />
            <Text style={styles.title}>Property Information</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.grid}>
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="address"
                render={({ field: { value, onChange } }) => (
                  <InputField
                    label="Address (Optional)"
                    placeholder="Main Street"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(text)}
                    keyboardType="default"
                  />
                )}
              />
              {/*  {errors.address && (
                <Text style={styles.errorText}>{errors.address.message}</Text>
              )} */}
            </View>

            {/* Asking Price */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="propertyValue"
                render={({ field: { value } }) => (
                  <InputField
                    label="Asking Price"
                    placeholder="500000"
                    value={value?.toString() || ''}
                    onChangeText={(text) => handlePropertyValueChange(text.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                  />
                )}
              />
              {/*  {errors.propertyValue && (
                <Text style={styles.errorText}>{errors.propertyValue.message}</Text>
              )} */}
            </View>

            {/* Down Payment */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="downPayment"
                render={({ field: { value } }) => (
                  <InputField
                    label="Down Payment"
                    placeholder="100000"
                    value={value?.toString() || ''}
                    onChangeText={(text) => handleDownPaymentChange(text)}
                    keyboardType="numeric"
                  />
                )}
              />
              {/*  {errors.downPayment && (
                <Text style={styles.errorText}>{errors.downPayment.message}</Text>
              )} */}
            </View>

            {/* Closing Costs */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="closingCosts"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    label="Closing Costs"
                    placeholder="15000"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(parseFloat(text) || 0)}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
          </View>
        </View>
      </Card>

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
                    style={[styles.input /* errors.loanAmount &&   styles.inputError*/]}
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
                    style={[styles.input /* errors.interestRate &&   styles.inputError*/]}
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
                    style={[styles.input /* errors.loanTerm &&   styles.inputError*/]}
                    placeholder="30"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(parseInt(text) || 0)}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
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
    marginVertical: 8,
    marginHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  grid: {
    gap: 8,
  },
  inputContainer: {
    gap: 4,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  currencyInputContainer: {
    flexDirection: 'row',
  },
  currencySymbol: {
    paddingLeft: 12,
    color: '#6b7280',
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  addButtonText: {
    fontSize: 14,
    color: '#3b82f6',
  },
  renovationItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  renovationItemContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  renovationInput: {
    flex: 1,
  },
  selectTrigger: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
  },
  removeButton: {
    borderColor: '#fca5a5',
    backgroundColor: '#fef2f2',
    width: 30,
    minWidth: 30,
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
});
