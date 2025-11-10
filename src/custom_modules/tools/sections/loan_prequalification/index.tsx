import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { Card } from '~/codidge_components/UI/card';
import { LoansPreqResults } from './widgets/loansPreqResults';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/OutlineButton';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';

interface PrequalifiedFormData {
  monthlyIncome: number;
  monthlyDebts: number;
  downPaymentAmount: number;
  interestRate: number;
  propertyTaxRate: number;
  insuranceRate: number;
  hoaFees: number;
  closingCostPercentage: number;
}

interface LoanProgram {
  name: string;
  housingRatio: number;
  totalRatio: number;
  description: string;
  minDownPaymentPercentage: number;
}

interface PaymentBreakdown {
  principalAndInterest: number;
  propertyTaxes: number;
  homeownersInsurance: number;
  mortgageInsurance: number;
  hoaFees: number;
  totalMonthlyPayment: number;
}

interface CashToCloseAnalysis {
  downPaymentRequired: number;
  downPaymentPercentage: number;
  closingCosts: number;
  totalCashNeeded: number;
  hasEnoughCash: boolean;
  cashShortfall: number;
  suggestedClosingCostReduction: number;
  remainingDeficiency: number;
}

interface CalculationResult {
  monthlyHousingPayment: number;
  maxLoanAmount: number;
  maxHomePrice: number;
  qualifies: boolean;
  loanProgram: LoanProgram;
  housingRatioUsed: number;
  totalRatioUsed: number;
  cashToClose: CashToCloseAnalysis;
  paymentBreakdown: PaymentBreakdown;
}

const LOAN_PROGRAMS: LoanProgram[] = [
  {
    name: 'Conventional',
    housingRatio: 28,
    totalRatio: 36,
    description: 'Standard conventional loan with competitive rates',
    minDownPaymentPercentage: 5.0,
  },
  {
    name: 'FHA',
    housingRatio: 31,
    totalRatio: 43,
    description: 'Government-backed loan with more flexible requirements',
    minDownPaymentPercentage: 3.5,
  },
];

const PMI_RATE = 0.005 / 12;

export const PrequalifiedLoanScreen: React.FC = () => {
  const navigation = useNavigation();
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PrequalifiedFormData>({
    defaultValues: {
      monthlyIncome: 5000,
      monthlyDebts: 500,
      downPaymentAmount: 50000,
      interestRate: 7.0,
      propertyTaxRate: 1.28,
      insuranceRate: 0.35,
      hoaFees: 0,
      closingCostPercentage: 3.0,
    },
  });

  const calculateMonthlyPayment = (principal: number, rate: number, years: number): number => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    );
  };

  const calculateCashToClose = (
    loanAmount: number,
    downPayment: number,
    loanProgram: LoanProgram,
    closingCostPercentage: number
  ): CashToCloseAnalysis => {
    const purchasePrice = loanAmount + downPayment;
    const fundsAvailable = downPayment;

    const minDownPaymentRequired = purchasePrice * (loanProgram.minDownPaymentPercentage / 100);
    const downPaymentPercentage = (fundsAvailable / purchasePrice) * 100;

    const closingCosts = purchasePrice * (closingCostPercentage / 100);
    const totalCashNeeded = minDownPaymentRequired + closingCosts;

    const hasEnoughCash = fundsAvailable >= totalCashNeeded;
    const cashShortfall = hasEnoughCash ? 0 : totalCashNeeded - fundsAvailable;

    let suggestedClosingCostReduction = 0;
    let remainingDeficiency = 0;

    if (cashShortfall > 0) {
      suggestedClosingCostReduction = Math.min(cashShortfall, closingCosts);
      remainingDeficiency = Math.max(0, cashShortfall - closingCosts);
    }

    return {
      downPaymentRequired: minDownPaymentRequired,
      downPaymentPercentage,
      closingCosts,
      totalCashNeeded,
      hasEnoughCash,
      cashShortfall,
      suggestedClosingCostReduction,
      remainingDeficiency,
    };
  };

  const calculatePrequalification = (data: PrequalifiedFormData) => {
    const {
      monthlyIncome,
      monthlyDebts,
      downPaymentAmount,
      interestRate,
      propertyTaxRate,
      insuranceRate,
      hoaFees,
      closingCostPercentage,
    } = data;

    if (!monthlyIncome || monthlyIncome <= 0 || !downPaymentAmount || downPaymentAmount <= 0) {
      return;
    }

    const propTaxRate = propertyTaxRate / 100 / 12;
    const insRate = insuranceRate / 100 / 12;
    const monthlyHoaFees = hoaFees || 0;

    const calculationResults: CalculationResult[] = [];

    LOAN_PROGRAMS.forEach((program) => {
      const maxHousingPayment = monthlyIncome * (program.housingRatio / 100);
      const maxTotalPayment = monthlyIncome * (program.totalRatio / 100);
      const maxHousingFromTotal = maxTotalPayment - monthlyDebts;

      const actualMaxHousingPayment = Math.min(maxHousingPayment, maxHousingFromTotal);

      if (actualMaxHousingPayment <= 0) {
        calculationResults.push({
          monthlyHousingPayment: 0,
          maxLoanAmount: 0,
          maxHomePrice: 0,
          qualifies: false,
          loanProgram: program,
          housingRatioUsed: (maxHousingPayment / monthlyIncome) * 100,
          totalRatioUsed: ((maxHousingPayment + monthlyDebts) / monthlyIncome) * 100,
          cashToClose: {
            downPaymentRequired: 0,
            downPaymentPercentage: 0,
            closingCosts: 0,
            totalCashNeeded: 0,
            hasEnoughCash: false,
            cashShortfall: 0,
            suggestedClosingCostReduction: 0,
            remainingDeficiency: 0,
          },
          paymentBreakdown: {
            principalAndInterest: 0,
            propertyTaxes: 0,
            homeownersInsurance: 0,
            mortgageInsurance: 0,
            hoaFees: 0,
            totalMonthlyPayment: 0,
          },
        });
        return;
      }

      let bestHomePrice = 0;
      let bestLoanAmount = 0;
      let bestMonthlyPayment = 0;

      for (let testHomePrice = 100000; testHomePrice <= 3000000; testHomePrice += 5000) {
        const loanAmount = testHomePrice - downPaymentAmount;

        if (loanAmount <= 0) continue;

        const downPaymentPercent = downPaymentAmount / testHomePrice;
        const principalAndInterest = calculateMonthlyPayment(loanAmount, interestRate, 30);
        const propertyTax = testHomePrice * propTaxRate;
        const insurance = testHomePrice * insRate;
        const pmi = downPaymentPercent < 0.2 ? loanAmount * PMI_RATE : 0;

        const totalMonthlyPayment =
          principalAndInterest + propertyTax + insurance + pmi + monthlyHoaFees;

        if (totalMonthlyPayment <= actualMaxHousingPayment) {
          bestHomePrice = testHomePrice;
          bestLoanAmount = loanAmount;
          bestMonthlyPayment = totalMonthlyPayment;
        } else {
          break;
        }
      }

      const housingRatio = (bestMonthlyPayment / monthlyIncome) * 100;
      const totalRatio = ((bestMonthlyPayment + monthlyDebts) / monthlyIncome) * 100;

      const cashToClose = calculateCashToClose(
        bestLoanAmount,
        downPaymentAmount,
        program,
        closingCostPercentage
      );

      const finalDownPaymentPercent = downPaymentAmount / bestHomePrice;
      const finalPrincipalAndInterest = calculateMonthlyPayment(bestLoanAmount, interestRate, 30);
      const finalPropertyTax = bestHomePrice * propTaxRate;
      const finalInsurance = bestHomePrice * insRate;
      const finalPmi = finalDownPaymentPercent < 0.2 ? bestLoanAmount * PMI_RATE : 0;

      const paymentBreakdown: PaymentBreakdown = {
        principalAndInterest: finalPrincipalAndInterest,
        propertyTaxes: finalPropertyTax,
        homeownersInsurance: finalInsurance,
        mortgageInsurance: finalPmi,
        hoaFees: monthlyHoaFees,
        totalMonthlyPayment: bestMonthlyPayment,
      };

      calculationResults.push({
        monthlyHousingPayment: bestMonthlyPayment,
        maxLoanAmount: bestLoanAmount,
        maxHomePrice: bestHomePrice,
        qualifies:
          housingRatio <= program.housingRatio &&
          totalRatio <= program.totalRatio &&
          bestLoanAmount > 0,
        loanProgram: program,
        housingRatioUsed: housingRatio,
        totalRatioUsed: totalRatio,
        cashToClose,
        paymentBreakdown,
      });
    });

    setResults(calculationResults);
    setShowResults(true);
  };

  return (
    <PageSafeContainer style={styles.container}>
      <Header title="Prequalified Loan Calculator" showBack onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Client Information Card */}
        <Card style={styles.formCard}>
          <View style={styles.cardHeader}>
            <Icons.User size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Client Information</Text>
          </View>
          <Text style={styles.cardSubtitle}>Enter your client's financial information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Monthly Gross Income ($)</Text>
            <Controller
              control={control}
              name="monthlyIncome"
              rules={{ required: 'Monthly income is required', min: 1 }}
              render={({ field: { onChange, value } }) => (
                <InputField
                  style={styles.input}
                  placeholder="5,000"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  keyboardType="numeric"
                  hint="Total monthly income before taxes"
                  error={!!errors.monthlyIncome}
                  errorMessage={errors.monthlyIncome?.message}
                />
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Monthly Long-Term Obligations ($)</Text>
            <Controller
              control={control}
              name="monthlyDebts"
              render={({ field: { onChange, value } }) => (
                <InputField
                  style={styles.input}
                  placeholder="500"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  keyboardType="numeric"
                  hint="Car payments, credit cards, student loans, etc."
                />
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Funds Available ($)</Text>
            <Controller
              control={control}
              name="downPaymentAmount"
              rules={{ required: 'Funds available is required', min: 1 }}
              render={({ field: { onChange, value } }) => (
                <InputField
                  style={styles.input}
                  placeholder="50,000"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  keyboardType="numeric"
                  hint="Total cash for down payment and closing costs"
                  error={!!errors.downPaymentAmount}
                  errorMessage={errors.downPaymentAmount?.message}
                />
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Interest Rate (%)</Text>
            <Controller
              control={control}
              name="interestRate"
              render={({ field: { onChange, value } }) => (
                <InputField
                  style={styles.input}
                  placeholder="7.0"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  keyboardType="numeric"
                  hint="Current market rate for 30-year fixed"
                />
              )}
            />
          </View>

          <View style={styles.infoBox}>
            <Icons.Info size={16} color="#2563EB" />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Loan Requirements:</Text>
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: '600' }}>Conventional:</Text> Housing ≤ 28%, Total Debt ≤
                36%
              </Text>
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: '600' }}>FHA:</Text> Housing ≤ 31%, Total Debt ≤ 43%
              </Text>
            </View>
          </View>
        </Card>

        {/* Home Expenses Card */}
        <Card style={styles.formCard}>
          <View style={styles.cardHeader}>
            <Icons.Home size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Home Expenses</Text>
          </View>
          <Text style={styles.cardSubtitle}>Property-related costs and fees</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Property Tax (% annually)</Text>
            <Controller
              control={control}
              name="propertyTaxRate"
              render={({ field: { onChange, value } }) => (
                <InputField
                  style={styles.input}
                  placeholder="1.28"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  keyboardType="numeric"
                  hint="Typical: 0.5% - 2.5%"
                />
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Insurance (% annually)</Text>
            <Controller
              control={control}
              name="insuranceRate"
              render={({ field: { onChange, value } }) => (
                <InputField
                  style={styles.input}
                  placeholder="0.35"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  keyboardType="numeric"
                  hint="Typical: 0.25% - 0.75%"
                />
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Monthly HOA Fees ($)</Text>
            <Controller
              control={control}
              name="hoaFees"
              render={({ field: { onChange, value } }) => (
                <InputField
                  style={styles.input}
                  placeholder="0"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  keyboardType="numeric"
                  hint="Optional"
                />
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Closing Costs (%)</Text>
            <Controller
              control={control}
              name="closingCostPercentage"
              render={({ field: { onChange, value } }) => (
                <InputField
                  style={styles.input}
                  placeholder="3.0"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  keyboardType="numeric"
                  hint="Typical: 2-4%"
                />
              )}
            />
          </View>
        </Card>
      </ScrollView>

      {/* Fixed Footer Button */}
      <View style={styles.footer}>
        <PrimaryButton
          onPress={handleSubmit(calculatePrequalification)}
          size={ButtonSize.LARGE}
          title="Calculate Prequalification"
          rightWidget={<Icons.ChevronRight color="#FFF" />}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showResults}
        onRequestClose={() => setShowResults(false)}>
        {showResults && (
          <LoansPreqResults results={results} onDispose={() => setShowResults(false)} />
        )}
      </Modal>
    </PageSafeContainer>
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
    paddingBottom: 0,
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
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 8,
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
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
    gap: 10,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
});
