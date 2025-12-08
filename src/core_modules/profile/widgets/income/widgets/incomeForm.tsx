import React from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useReactiveVar } from '@apollo/client';
import { IFormData, IIncome, IncomeSource, IncomeStatus } from '../interfaces';
import { addUserIncome, updateUserIncome } from '../graphql/mutations';
import { getUserIncomes } from '../graphql/queries';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import * as Icons from 'lucide-react-native';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { Header } from '~/codidge_components/UI/header';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { DateInputField } from '~/codidge_components/UI/form/inputs/datePicker';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { GridTabs } from '~/codidge_components/UI/tabs';
import { theme } from '~/theme/theme';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

const tabs = [
  {
    key: 'rental',
    label: 'Rental',
    Icon: Icons.Wallet,
    indexNumber: 0,
  },
  {
    key: 'home',
    label: 'Home',
    Icon: Icons.Home,
    indexNumber: 0,
  },
];

export default function IncomeForm({ dispose, income }: { dispose: () => void; income?: IIncome }) {
  const user = useReactiveVar(userData);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<IFormData>({
    defaultValues: {
      amount: income?.amount ?? 0,
      customerName: income?.customerName ?? '',
      description: income?.description ?? '',
      propertyAddress: income?.propertyAddress ?? '',
      expectedDate: income?.expectedDate ?? '',
      sourceDropDown: income?.source ?? tabs[0].key,
      status: income?.status ?? IncomeStatus.completed,
    },
  });
  const [updateIncome, { loading: loadingUpdate }] = useMutation<{ updateUserIncome: IIncome }>(
    updateUserIncome,
    {
      update: (cache, { data: mutationData }) => {
        if (!mutationData?.updateUserIncome) return;

        const updatedIncome = mutationData.updateUserIncome;

        cache.modify({
          fields: {
            getUserIncomes(existingIncomeRefs = [], { readField }) {
              return existingIncomeRefs.map((incomeRef: any) => {
                const id = readField('id', incomeRef);
                if (id === updatedIncome.id) {
                  // Merge the updated income directly into the cached reference
                  return { ...incomeRef, ...updatedIncome };
                }
                return incomeRef;
              });
            },
          },
        });
      },
    }
  );

  const [addIncome, { loading }] = useMutation<{ addUserIncome: IIncome }>(addUserIncome, {
    update: (cache, { data: mutationData }) => {
      if (!mutationData?.addUserIncome) return;

      const newIncome = mutationData.addUserIncome;

      // Read existing cache
      const existingData: any = cache.readQuery({
        query: getUserIncomes,
        variables: {
          tenant: { tenantId },
          userId: user?.id,
        },
      });

      if (existingData) {
        // Merge new income with existing incomes
        cache.writeQuery({
          query: getUserIncomes,
          variables: {
            tenant: { tenantId },
            userId: user?.id,
          },
          data: {
            getUserIncomes: [...existingData.getUserIncomes, newIncome],
          },
        });
      }
    },
  });

  const isCompleted = watch('status') === IncomeStatus.completed;
  //const watchSource = watch('sourceDropDown');

  const onSubmit = async (data: IFormData) => {
    try {
      let source = data.sourceDropDown;

      const incomeData: Record<string, any> = {
        source,
        amount: data.amount,
        description: data.description || null,
        customerName: data.customerName || null,
        propertyAddress: data.propertyAddress || null,
        status: data.status ?? IncomeStatus.pending,
        ...(data.status && { expectedDate: data.expectedDate }),
      };

      if (income?.id) {
        const res = await updateIncome({
          variables: {
            tenant: {
              tenantId,
            },
            incomeId: income?.id,
            userId: user?.id,
            incomeData,
            templateId: user?.activeGoalsTemplateId,
          },
        });
        const updatedIncome = res.data?.updateUserIncome;
        if (updatedIncome) {
          reset({
            amount: updatedIncome.amount,
            description: updatedIncome.description,
            propertyAddress: updatedIncome.propertyAddress,
            status: updatedIncome.status,
            expectedDate: updatedIncome.expectedDate,
          });
          dispose();
        }
      } else {
        await addIncome({
          variables: {
            tenant: {
              tenantId,
            },
            userId: user?.id,
            incomeData,
            templateId: user?.activeGoalsTemplateId,
          },
        });
        reset({
          amount: 0,
          description: '',
          propertyAddress: '',
          status: IncomeStatus.completed,
          expectedDate: '',
        });

        dispose();
      }
    } catch (error) {
      console.log('::error', error);
      Alert.alert('Error', 'Failed to add income. Please try again.');
    }
  };

  return (
    <PageSafeContainer style={styles.container}>
      <Header
        title=""
        leftText={income ? 'Update Income' : 'New Income'}
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
          <Text style={styles.label}>Income Type</Text>
          <Controller
            control={control}
            name="sourceDropDown"
            rules={{
              required: 'Income type is required',
            }}
            render={({ field: { onChange, value } }) => (
              <GridTabs
                activeTabBackground={theme.colors.primary}
                activeTabColor="#FFF"
                tabs={tabs}
                initialTabKey={value || IncomeSource.Rental}
                onTabChange={(tab) => {
                  onChange(tab);
                }}
                containerStyle={{
                  paddingHorizontal: 0,
                }}
              />
            )}
          />
          {/*  {watchSource === 'other' && (
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
          )} */}

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
                leftIcon={<Icons.DollarSign size={16} color="#6B7280" />}
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
            name="customerName"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                leftIcon={<Icons.User size={16} color="#6B7280" />}
                label="Customer Name"
                placeholder="Jhon Doe"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />

          <Controller
            control={control}
            name="propertyAddress"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                leftIcon={<Icons.HousePlus size={16} color="#6B7280" />}
                label="Property Address (Optional)"
                placeholder="123 Main Street"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
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

          <View style={styles.switchContainer}>
            <View style={styles.switchLabel}>
              <Text style={styles.switchText}>This is a pending income</Text>
              <Text style={styles.switchSubtext}>Income not yet received but expected</Text>
            </View>
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value === IncomeStatus.pending}
                  onValueChange={(newValue) => {
                    if (newValue) {
                      onChange(IncomeStatus.pending);
                    } else {
                      onChange(IncomeStatus.completed);
                    }
                  }}
                  trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                  thumbColor={value === IncomeStatus.pending ? '#3B82F6' : '#FFFFFF'}
                />
              )}
            />
          </View>

          {!isCompleted && (
            <Controller
              control={control}
              name="expectedDate"
              rules={{
                required: isCompleted ? 'Expected date is required for pending income' : false,
              }}
              render={({ field: { onChange, value } }) => (
                <DateInputField
                  label="Expected Date"
                  value={value as Date}
                  onChangeText={onChange}
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
          loading={loading || loadingUpdate}
          onPress={handleSubmit(onSubmit)}
          title={'Save Income'}
        />
      </View>
    </PageSafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 10,
    flexDirection: 'column',
    gap: 8,
  },
  textArea: {
    minHeight: 80,
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
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 5,
  },
});
