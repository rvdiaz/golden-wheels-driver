import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Switch, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useReactiveVar } from '@apollo/client';
import { IIncome } from '../interfaces';
import { addUserIncome } from '../graphql/mutations';
import { getUserIncomes } from '../graphql/queries';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import * as Icons from 'lucide-react-native';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { Header } from '~/codidge_components/UI/header';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import DropdownComponent from '~/codidge_components/UI/dropdown';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

// Income source options
const INCOME_SOURCE_OPTIONS = [
  { label: 'Salary', value: 'salary' },
  { label: 'Rental Income', value: 'rental' },
  { label: 'Freelance', value: 'freelance' },
  { label: 'Business Income', value: 'business' },
  { label: 'Investment Returns', value: 'investment' },
  { label: 'Commission', value: 'commission' },
  { label: 'Bonus', value: 'bonus' },
  { label: 'Pension', value: 'pension' },
  { label: 'Other', value: 'other' },
];

export default function AddIncomeScreen({ dispose }: { dispose: () => void }) {
  const customer = useReactiveVar(userData);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<IIncome>({
    defaultValues: {
      source: '',
      amount: 0,
      description: '',
      propertyAddress: '',
      completed: false,
      expectedDate: '',
    },
  });

  const [addIncome, { loading }] = useMutation(addUserIncome, {
    refetchQueries: [getUserIncomes],
  });

  const watchIsPending = watch('completed');
  const watchSource = watch('source');

  const onSubmit = async (data: IIncome) => {
    try {
      const incomeData = {
        source: data.source,
        amount: data.amount,
        description: data.description || null,
        propertyAddress: data.propertyAddress || null,
        status: data.completed ? 'pending' : 'completed',
      };
      await addIncome({
        variables: {
          tenant: {
            tenantId,
          },
          userId: customer?.id,
          incomeData,
        },
      });
      reset({
        source: '',
        amount: 0,
        description: '',
        propertyAddress: '',
        completed: false,
        expectedDate: '',
      });
      Alert.alert('Success', 'Income added successfully!');
    } catch (error) {
      console.log('::error', error);
      Alert.alert('Error', 'Failed to add income. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="New Income"
        rightAction={() => {
          dispose();
        }}
        rightText="Close"
      />

      <ScrollView
        style={styles.form}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formContent}>
        <View style={styles.fieldContainer}>
          <Controller
            control={control}
            name="source"
            rules={{
              required: 'Income source is required',
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DropdownComponent
                label="Source"
                data={INCOME_SOURCE_OPTIONS}
                placeholder="Select income source"
                value={value}
                onChange={onChange}
                error={!!error}
                errorMessage={error?.message}
              />
            )}
          />

          {watchSource === 'other' && (
            <Controller
              control={control}
              name="source"
              rules={{
                required: watchSource === 'other' ? 'Please specify the income source' : false,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  leftIcon={<Icons.FileText size={16} color="#6B7280" />}
                  label="Specify Income Source"
                  placeholder="Enter custom income source"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.source}
                  errorMessage={errors.source?.message}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="amount"
            rules={{
              required: 'Amount is required',
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: 'Please enter a valid amount',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                leftIcon={<Icons.DollarSign size={16} color="#6B7280" style={styles.inputIcon} />}
                label="Amount"
                placeholder="0.00"
                value={value ? String(value) : ''} // convert number to string for UI
                onChangeText={(text) => onChange(parseFloat(text) || 0)} // convert back to number
                onBlur={onBlur}
                keyboardType="decimal-pad"
                error={!!errors.amount}
                errorMessage={errors.amount?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                leftIcon={<Icons.FileText size={16} color="#6B7280" style={styles.inputIcon} />}
                label="Description (Optional)"
                placeholder="Additional details about this income"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={3}
                style={styles.textArea}
              />
            )}
          />

          <Controller
            control={control}
            name="propertyAddress"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                leftIcon={<Icons.Home size={16} color="#6B7280" style={styles.inputIcon} />}
                label="Property Address (Optional)"
                placeholder="For rental income"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />

          <View style={styles.switchContainer}>
            <View style={styles.switchLabel}>
              <Text style={styles.switchText}>This is a pending income</Text>
              <Text style={styles.switchSubtext}>Income not yet received but expected</Text>
            </View>
            <Controller
              control={control}
              name="completed"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onValueChange={(newValue) => {
                    onChange(newValue);
                  }}
                  trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                  thumbColor={value ? '#3B82F6' : '#FFFFFF'}
                />
              )}
            />
          </View>

          {watchIsPending && (
            <Controller
              control={control}
              name="expectedDate"
              rules={{
                required: watchIsPending ? 'Expected date is required for pending income' : false,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  leftIcon={<Icons.Calendar size={16} color="#6B7280" style={styles.inputIcon} />}
                  label="Expected Date"
                  placeholder="YYYY-MM-DD"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.expectedDate}
                  errorMessage={errors.expectedDate?.message}
                />
              )}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          style={styles.footerButton}
          size={ButtonSize.LARGE}
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          title="Add Income"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 40,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 10,
    flexDirection: 'column',
    gap: 15,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formContent: {
    paddingBottom: 100,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 5,
  },
  switchLabel: {
    flex: 1,
    marginRight: 16,
  },
  switchText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  switchSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerButton: {
    flex: 1,
  },
  inputIcon: {
    marginLeft: 16,
  },
});
