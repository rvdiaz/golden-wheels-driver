import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { Card } from '~/codidge_components/UI/card';

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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PrequalifiedFormData>({});

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
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Prequalified Loan Calculator" showBack onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <Text style={styles.cardTitle}>Loan Prequalification Calculator</Text>
          <Text style={styles.cardSubtitle}>
            Calculate how much your client can potentially borrow
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Monthly Gross Income ($)</Text>
            <Controller
              control={control}
              name="monthlyIncome"
              render={({ field: { onChange, value } }) => (
                <TextInput
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
                <TextInput
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
                <TextInput
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
                  <TextInput
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
                  <TextInput
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

          <TouchableOpacity
            style={styles.calculateButton}
            onPress={handleSubmit(calculatePrequalification)}>
            <Text style={styles.calculateButtonText}>Calculate Prequalification</Text>
          </TouchableOpacity>

          {result && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <Icons.CheckCircle size={24} color={result.isQualified ? '#10B981' : '#EF4444'} />
                <Text
                  style={[
                    styles.resultStatus,
                    { color: result.isQualified ? '#10B981' : '#EF4444' },
                  ]}>
                  {result.isQualified ? 'Likely Qualified' : 'May Need Improvement'}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Maximum Home Price:</Text>
                <Text style={styles.resultValue}>${result.maxHomePrice}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Maximum Loan Amount:</Text>
                <Text style={styles.resultValue}>${result.maxLoanAmount}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Max Monthly Payment:</Text>
                <Text style={styles.resultValue}>${result.maxMonthlyPayment}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Available for Mortgage:</Text>
                <Text style={styles.resultValue}>${result.availableForMortgage}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Debt-to-Income Ratio:</Text>
                <Text
                  style={[
                    styles.resultValue,
                    { color: parseFloat(result.debtToIncomeRatio) <= 43 ? '#10B981' : '#EF4444' },
                  ]}>
                  {result.debtToIncomeRatio}%
                </Text>
              </View>

              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>Tips for Improvement:</Text>
                <Text style={styles.tipText}>• Keep debt-to-income ratio below 43%</Text>
                <Text style={styles.tipText}>• Increase down payment to reduce loan amount</Text>
                <Text style={styles.tipText}>• Pay down existing debts before applying</Text>
              </View>
            </View>
          )}
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
    marginBottom: 8,
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
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  calculateButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultStatus: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  tipsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },
});
