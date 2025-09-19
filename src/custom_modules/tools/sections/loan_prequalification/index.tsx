import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { Card } from '~/codidge_components/UI/card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoansPreqResults } from './widgets/loansPreqResults';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/OutlineButton';
import InputField from '~/codidge_components/UI/form/inputs/inputField';

interface PrequalifiedFormData {
  monthlyIncome: number;
  monthlyDebts: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
}

export const PrequalifiedLoanScreen: React.FC = () => {
  const navigation = useNavigation();
  const [result, setResult] = useState<any>(null);
  const [showResults, setshowResults] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PrequalifiedFormData>({
    defaultValues: {
      monthlyIncome: 5000,
      monthlyDebts: 500,
      downPayment: 2,
      interestRate: 7.25,
      loanTerm: 30,
    },
  });

  const calculatePrequalification = (data: PrequalifiedFormData) => {
    const { monthlyIncome, monthlyDebts, downPayment, interestRate, loanTerm } = data;

    // Calculate debt-to-income ratio (typically should be below 43%)
    const debtToIncomeRatio = (monthlyDebts / monthlyIncome) * 100;

    // Calculate maximum monthly payment (28% of gross income rule)
    const maxMonthlyPayment = monthlyIncome * 0.28;

    // Calculate available for mortgage payment (subtract existing debts)
    const availableForMortgage = maxMonthlyPayment - monthlyDebts;

    // Calculate maximum loan amount based on payment capacity
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    let maxLoanAmount = 0;
    if (monthlyRate > 0) {
      maxLoanAmount =
        (availableForMortgage * (Math.pow(1 + monthlyRate, numberOfPayments) - 1)) /
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
    }

    // Total home price (loan + down payment)
    const maxHomePrice = maxLoanAmount + downPayment;

    // Qualification status
    const isQualified = debtToIncomeRatio <= 43 && availableForMortgage > 0;

    setResult({
      maxLoanAmount: maxLoanAmount.toFixed(2),
      maxHomePrice: maxHomePrice.toFixed(2),
      maxMonthlyPayment: maxMonthlyPayment.toFixed(2),
      availableForMortgage: availableForMortgage.toFixed(2),
      debtToIncomeRatio: debtToIncomeRatio.toFixed(1),
      isQualified,
      // Add original form data for the results component
      formData: data,
    });
    setshowResults(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Prequalified Loan Calculator" showBack onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <View style={styles.cardHeader}>
            <Icons.BadgeCheck size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Loan Prequalification Calculator</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Calculate how much your client can potentially borrow
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Monthly Gross Income ($)</Text>
            <Controller
              control={control}
              name="monthlyIncome"
              render={({ field: { onChange, value } }) => (
                <InputField
                  style={[styles.input, errors.monthlyIncome && styles.inputError]}
                  placeholder="5,000"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  keyboardType="numeric"
                />
              )}
            />
            {errors.monthlyIncome && (
              <Text style={styles.errorText}>{errors.monthlyIncome.message}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Monthly Debt Payments ($)</Text>
            <Controller
              control={control}
              name="monthlyDebts"
              render={({ field: { onChange, value } }) => (
                <InputField
                  style={[styles.input, errors.monthlyDebts && styles.inputError]}
                  placeholder="500"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  keyboardType="numeric"
                />
              )}
            />
            {errors.monthlyDebts && (
              <Text style={styles.errorText}>{errors.monthlyDebts.message}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Down Payment ($)</Text>
            <Controller
              control={control}
              name="downPayment"
              render={({ field: { onChange, value } }) => (
                <InputField
                  style={[styles.input, errors.downPayment && styles.inputError]}
                  placeholder="50,000"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  keyboardType="numeric"
                />
              )}
            />
            {errors.downPayment && (
              <Text style={styles.errorText}>{errors.downPayment.message}</Text>
            )}
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Interest Rate (%)</Text>
              <Controller
                control={control}
                name="interestRate"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    style={[styles.input, errors.interestRate && styles.inputError]}
                    placeholder="3.5"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(parseFloat(text) || 0)}
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.interestRate && (
                <Text style={styles.errorText}>{errors.interestRate.message}</Text>
              )}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Loan Term (Years)</Text>
              <Controller
                control={control}
                name="loanTerm"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    style={[styles.input, errors.loanTerm && styles.inputError]}
                    placeholder="30"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(parseFloat(text) || 0)}
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.loanTerm && <Text style={styles.errorText}>{errors.loanTerm.message}</Text>}
            </View>
          </View>

          <PrimaryButton
            onPress={handleSubmit(calculatePrequalification)}
            size={ButtonSize.LARGE}
            title="Calculate Prequalification"
            rightWidget={<Icons.ChevronRight color="#FFF" />}
          />

          <Modal
            animationType="slide"
            transparent={true}
            visible={showResults}
            onRequestClose={() => {
              setshowResults(false);
            }}>
            {showResults && (
              <LoansPreqResults
                result={result}
                onDispose={() => {
                  setshowResults(false);
                }}
              />
            )}
          </Modal>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formCard: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});
