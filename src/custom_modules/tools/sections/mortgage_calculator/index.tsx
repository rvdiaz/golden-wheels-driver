import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, FormProvider } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { Card } from '~/codidge_components/UI/card';
import { MortgageCalculatorForm } from './widgets/basicForm';
import { MortgageCalculatorResults } from './widgets/mortgageResults';
import { MortgageCalculation, MortgageFormValues } from './interfaces';
import { calculateMortgage } from './helpers';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

export const MortgageCalculatorScreen: React.FC = () => {
  const navigation = useNavigation();

  const [isDownPaymentPercent, setIsDownPaymentPercent] = useState<boolean>(true);

  const methods = useForm<MortgageFormValues>({
    defaultValues: {
      homePrice: '450000',
      downPayment: '90000',
      downPaymentPercent: '20',
      interestRate: '7.25',
      loanTerm: '30',
      propertyTaxRate: '1.2',
      homeInsurance: '1800', //TODO:::: calculate based on home price
      pmiRate: '0.5',
      hoaFees: '0',
    },
  });

  const { watch, setValue } = methods;

  const homePrice = watch('homePrice');
  const downPayment = watch('downPayment');
  const downPaymentPercent = watch('downPaymentPercent');
  const interestRate = watch('interestRate');
  const loanTerm = watch('loanTerm');
  const propertyTaxRate = watch('propertyTaxRate');
  const homeInsurance = watch('homeInsurance');
  const pmiRate = watch('pmiRate');
  const hoaFees = watch('hoaFees');

  // Calculated values
  const [calculation, setCalculation] = useState<MortgageCalculation | null>(null);
  const [showResults, setshowResults] = useState(false);

  // Update down payment when switching between dollar and percentage
  useEffect(() => {
    const price = parseFloat(homePrice) || 0;
    const downDollar = parseFloat(downPayment) || 0;
    const downPercent = parseFloat(downPaymentPercent) || 0;

    if (isDownPaymentPercent && price > 0) {
      setValue('downPayment', ((price * downPercent) / 100).toString());
    } else if (!isDownPaymentPercent && price > 0 && downDollar > 0) {
      setValue('downPaymentPercent', ((downDollar / price) * 100).toFixed(1));
    }
  }, [homePrice, downPaymentPercent, downPayment, isDownPaymentPercent]);

  // Auto-calculate when inputs change
  useEffect(() => {
    const results = calculateMortgage({
      homePrice,
      downPayment,
      interestRate,
      loanTerm,
      propertyTaxRate,
      homeInsurance,
      pmiRate,
      hoaFees,
    });
    if (results) {
      setCalculation(results);
    }
  }, [
    homePrice,
    downPayment,
    interestRate,
    loanTerm,
    propertyTaxRate,
    homeInsurance,
    pmiRate,
    hoaFees,
  ]);

  return (
    <FormProvider {...methods}>
      <PageSafeContainer>
        <Header
          title="Mortgage Calculator"
          showBack={true}
          onBack={() => {
            navigation.goBack();
          }}
        />
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Card style={styles.formCard}>
            <View style={styles.cardHeader}>
              <Icons.Calculator size={24} color="#2563EB" />
              <Text style={styles.cardTitle}>Mortgage Payment Calculator</Text>
            </View>
            <Text style={styles.cardSubtitle}>Calculate monthly mortgage payments</Text>

            <MortgageCalculatorForm
              isDownPaymentPercent={isDownPaymentPercent}
              setIsDownPaymentPercent={setIsDownPaymentPercent}
            />
            <PrimaryButton
              size={ButtonSize.LARGE}
              title="Show Results"
              onPress={() => {
                setshowResults(true);
              }}
              rightWidget={<Icons.ChevronRight color="#FFF" />}
            />
          </Card>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showResults}
          onRequestClose={() => {
            setshowResults(false);
          }}>
          {calculation && (
            <MortgageCalculatorResults
              calculation={calculation}
              onDispose={() => {
                setshowResults(false);
              }}
            />
          )}
        </Modal>
      </PageSafeContainer>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
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
