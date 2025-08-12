import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { Header } from '~/components/Header';
import { Card } from '~/components/Card';

interface MortgageFormData {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  downPayment: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
}

export const MortgageCalculatorScreen: React.FC = () => {
  const navigation = useNavigation();
  const [result, setResult] = useState<any>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MortgageFormData>({});

  const watchedValues = watch();

  const calculateMortgage = (data: MortgageFormData) => {
    const { loanAmount, interestRate, loanTerm, downPayment, propertyTax, homeInsurance, pmi } =
      data;

    // Calculate actual loan amount after down payment
    const actualLoanAmount = loanAmount - downPayment;

    // Calculate monthly payment (Principal & Interest)
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    let monthlyPI = 0;
    if (monthlyRate > 0) {
      monthlyPI =
        (actualLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      monthlyPI = actualLoanAmount / numberOfPayments;
    }

    // Calculate other monthly costs
    const monthlyPropertyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const monthlyPMI = pmi / 12;

    // Total monthly payment
    const totalMonthlyPayment = monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyPMI;

    // Calculate totals
    const totalInterest = monthlyPI * numberOfPayments - actualLoanAmount;
    const totalPayments = monthlyPI * numberOfPayments;
    const totalCost =
      totalPayments +
      downPayment +
      propertyTax * loanTerm +
      homeInsurance * loanTerm +
      pmi * loanTerm;

    // Calculate down payment percentage
    const downPaymentPercentage = (downPayment / loanAmount) * 100;

    setResult({
      monthlyPI: monthlyPI.toFixed(2),
      monthlyPropertyTax: monthlyPropertyTax.toFixed(2),
      monthlyInsurance: monthlyInsurance.toFixed(2),
      monthlyPMI: monthlyPMI.toFixed(2),
      totalMonthlyPayment: totalMonthlyPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayments: totalPayments.toFixed(2),
      totalCost: totalCost.toFixed(2),
      actualLoanAmount: actualLoanAmount.toFixed(2),
      downPaymentPercentage: downPaymentPercentage.toFixed(1),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <View style={styles.cardHeader}>
            <Icons.Calculator size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Mortgage Payment Calculator</Text>
          </View>
          <Text style={styles.cardSubtitle}>Calculate monthly mortgage payments</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Home Price ($)</Text>
            <Controller
              control={control}
              name="loanAmount"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Icons.DollarSign size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.loanAmount && styles.inputError]}
                    placeholder="350,000"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(parseFloat(text.replace(/,/g, '')) || 0)}
                    keyboardType="numeric"
                  />
                </View>
              )}
            />
            {errors.loanAmount && <Text style={styles.errorText}>{errors.loanAmount.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Down Payment ($)</Text>
            <Controller
              control={control}
              name="downPayment"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Icons.DollarSign size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.downPayment && styles.inputError]}
                    placeholder="70,000"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(parseFloat(text.replace(/,/g, '')) || 0)}
                    keyboardType="numeric"
                  />
                  {watchedValues.loanAmount && watchedValues.downPayment && (
                    <Text style={styles.percentageText}>
                      {((watchedValues.downPayment / watchedValues.loanAmount) * 100).toFixed(1)}%
                    </Text>
                  )}
                </View>
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
                  <View style={styles.inputContainer}>
                    <Icons.Percent size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, errors.interestRate && styles.inputError]}
                      placeholder="6.5"
                      value={value?.toString() || ''}
                      onChangeText={(text) => onChange(parseFloat(text) || 0)}
                      keyboardType="numeric"
                    />
                  </View>
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
                  <View style={styles.inputContainer}>
                    <Icons.Calendar size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, errors.loanTerm && styles.inputError]}
                      placeholder="30"
                      value={value?.toString() || ''}
                      onChangeText={(text) => onChange(parseFloat(text) || 0)}
                      keyboardType="numeric"
                    />
                  </View>
                )}
              />
              {errors.loanTerm && <Text style={styles.errorText}>{errors.loanTerm.message}</Text>}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Additional Monthly Costs</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Annual Property Tax ($)</Text>
            <Controller
              control={control}
              name="propertyTax"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Icons.DollarSign size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="4,200"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(parseFloat(text.replace(/,/g, '')) || 0)}
                    keyboardType="numeric"
                  />
                </View>
              )}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Annual Insurance ($)</Text>
              <Controller
                control={control}
                name="homeInsurance"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputContainer}>
                    <Icons.DollarSign size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="1,200"
                      value={value?.toString() || ''}
                      onChangeText={(text) => onChange(parseFloat(text.replace(/,/g, '')) || 0)}
                      keyboardType="numeric"
                    />
                  </View>
                )}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Annual PMI ($)</Text>
              <Controller
                control={control}
                name="pmi"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputContainer}>
                    <Icons.DollarSign size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="2,400"
                      value={value?.toString() || ''}
                      onChangeText={(text) => onChange(parseFloat(text.replace(/,/g, '')) || 0)}
                      keyboardType="numeric"
                    />
                  </View>
                )}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.calculateButton}
            onPress={handleSubmit(calculateMortgage)}>
            <Icons.Calculator size={20} color="white" />
            <Text style={styles.calculateButtonText}>Calculate Payment</Text>
          </TouchableOpacity>

          {result && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <Icons.TrendingUp size={24} color="#10B981" />
                <Text style={styles.resultTitle}>Payment Breakdown</Text>
              </View>

              <View style={styles.monthlyPaymentCard}>
                <Text style={styles.monthlyPaymentLabel}>Total Monthly Payment</Text>
                <Text style={styles.monthlyPaymentAmount}>${result.totalMonthlyPayment}</Text>
              </View>

              <View style={styles.breakdownContainer}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Principal & Interest:</Text>
                  <Text style={styles.breakdownValue}>${result.monthlyPI}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Property Tax:</Text>
                  <Text style={styles.breakdownValue}>${result.monthlyPropertyTax}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Home Insurance:</Text>
                  <Text style={styles.breakdownValue}>${result.monthlyInsurance}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>PMI:</Text>
                  <Text style={styles.breakdownValue}>${result.monthlyPMI}</Text>
                </View>
              </View>

              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Loan Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Loan Amount:</Text>
                  <Text style={styles.summaryValue}>${result.actualLoanAmount}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Down Payment:</Text>
                  <Text style={styles.summaryValue}>
                    ${watchedValues.downPayment?.toLocaleString()} ({result.downPaymentPercentage}%)
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Interest:</Text>
                  <Text style={styles.summaryValue}>${result.totalInterest}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Cost:</Text>
                  <Text style={styles.summaryValue}>${result.totalCost}</Text>
                </View>
              </View>
            </View>
          )}
        </Card>

        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Icons.Info size={20} color="#2563EB" />
            <Text style={styles.infoTitle}>Mortgage Information</Text>
          </View>
          <Text style={styles.infoText}>
            • PMI is typically required when down payment is less than 20%
          </Text>
          <Text style={styles.infoText}>
            • Property taxes vary by location and are usually 1-3% of home value annually
          </Text>
          <Text style={styles.infoText}>
            • Home insurance typically costs 0.3-1.5% of home value annually
          </Text>
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
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 12,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  percentageText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginRight: 12,
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
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultContainer: {
    marginTop: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  monthlyPaymentCard: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  monthlyPaymentLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  monthlyPaymentAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  breakdownContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  summaryContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  infoCard: {
    padding: 16,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 16,
  },
});
