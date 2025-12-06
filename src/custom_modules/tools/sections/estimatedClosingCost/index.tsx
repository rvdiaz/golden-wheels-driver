// EstimatedClosingCostCalculator.tsx
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { useNavigation } from '@react-navigation/native';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { EstimatedClosingCostResults } from './results';
import { EstimatedClosingCostCalculatorForm } from './components/form';
import { ClosingCostResult, CostBreakdownItem, EstimatedClosingCostFormValues } from './interfaces';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';

export default function EstimatedClosingCostCalculator() {
  const [isDownPaymentPercent, setIsDownPaymentPercent] = useState(true);
  const [isBuyerBrokerPercent, setIsBuyerBrokerPercent] = useState(true);
  const [result, setResult] = useState<ClosingCostResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const navigation = useNavigation();

  const methods = useForm<EstimatedClosingCostFormValues>({
    defaultValues: {
      purchasePrice: '500000',
      downPayment: '',
      downPaymentPercent: '20',
      buyerBrokerComp: '',
      buyerBrokerCompPercent: '',
      originationPoints: '3',
      appraisalFee: '500',
      inspectionFee: '400',
      creditReportFee: '50',
      surveyFee: '550',
      recordingFees: '150',
      prepaidTaxes: '3',
      prepaidInsurance: '1200',
      prepaidHOA: '',
      escrowFee: '600',
    },
  });

  const calculateClosingCosts = (data: EstimatedClosingCostFormValues) => {
    const price = parseFloat(data.purchasePrice) || 0;

    if (price <= 0) {
      Alert.alert('Error', 'Please enter a valid purchase price');
      return;
    }

    // Calculate down payment
    let downPayment = 0;
    if (isDownPaymentPercent) {
      const downValue = parseFloat(data.downPaymentPercent) || 0;
      if (downValue < 0 || downValue > 100) {
        Alert.alert('Error', 'Down payment percentage must be between 0 and 100');
        return;
      }
      downPayment = price * (downValue / 100);
    } else {
      downPayment = parseFloat(data.downPayment) || 0;
    }

    const loanAmt = price - downPayment;
    const points = parseFloat(data.originationPoints) || 0;

    const breakdownItems: CostBreakdownItem[] = [];
    let totalCosts = 0;

    // Buyer Broker Compensation
    if (isBuyerBrokerPercent) {
      const brokerValue = parseFloat(data.buyerBrokerCompPercent) || 0;
      if (brokerValue > 0) {
        const brokerAmount = price * (brokerValue / 100);
        breakdownItems.push({
          category: 'Buyer Broker Compensation',
          description: `${brokerValue}% of purchase price`,
          amount: brokerAmount,
          percentage: brokerValue,
          editable: true,
        });
        totalCosts += brokerAmount;
      }
    } else {
      const brokerAmount = parseFloat(data.buyerBrokerComp) || 0;
      if (brokerAmount > 0) {
        breakdownItems.push({
          category: 'Buyer Broker Compensation',
          description: 'Fixed fee',
          amount: brokerAmount,
          editable: true,
        });
        totalCosts += brokerAmount;
      }
    }

    // Owner's Title Insurance
    const ownersTitleInsurance = price * 0.005;
    breakdownItems.push({
      category: "Owner's Title Insurance",
      description: 'One-time premium to protect your ownership',
      amount: ownersTitleInsurance,
      percentage: 0.5,
      editable: true,
    });
    totalCosts += ownersTitleInsurance;

    // Lender's Title Insurance
    const lendersTitleInsurance = loanAmt * 0.003;
    breakdownItems.push({
      category: "Lender's Title Insurance",
      description: "Protects the lender's interest",
      amount: lendersTitleInsurance,
      percentage: 0.3,
      editable: true,
    });
    totalCosts += lendersTitleInsurance;

    // Origination Fee
    const originationFee = loanAmt * (points / 100);
    breakdownItems.push({
      category: 'Loan Origination Fee',
      description: `${points} point${points !== 1 ? 's' : ''} (${points}% of loan amount)`,
      amount: originationFee,
      percentage: points,
      editable: true,
    });
    totalCosts += originationFee;

    // Add other fees
    const fees = [
      {
        value: data.appraisalFee,
        category: 'Appraisal Fee',
        description: 'Professional property valuation',
      },
      {
        value: data.inspectionFee,
        category: 'Home Inspection',
        description: 'Professional property inspection',
      },
      {
        value: data.creditReportFee,
        category: 'Credit Report',
        description: "Lender's credit check",
      },
      {
        value: data.surveyFee,
        category: 'Property Survey',
        description: 'Land survey and boundaries',
      },
      {
        value: data.recordingFees,
        category: 'Recording Fees',
        description: 'County recording and filing fees',
      },
      {
        value: data.escrowFee,
        category: 'Attorney/Escrow Fee',
        description: 'Settlement and legal services',
      },
    ];

    fees.forEach(({ value, category, description }) => {
      const amount = parseFloat(value) || 0;
      if (amount > 0) {
        breakdownItems.push({ category, description, amount, editable: true });
        totalCosts += amount;
      }
    });

    // Prepaid Property Taxes
    const prepaidTax = parseFloat(data.prepaidTaxes) || 0;
    if (prepaidTax > 0) {
      const taxAmount = price * 0.012 * (prepaidTax / 12);
      breakdownItems.push({
        category: 'Prepaid Property Taxes',
        description: `${prepaidTax} month${prepaidTax !== 1 ? 's' : ''} escrowed`,
        amount: taxAmount,
        editable: true,
      });
      totalCosts += taxAmount;
    }

    // Prepaid Insurance & HOA
    const insurance = parseFloat(data.prepaidInsurance) || 0;
    if (insurance > 0) {
      breakdownItems.push({
        category: "Prepaid Homeowner's Insurance",
        description: 'First year premium',
        amount: insurance,
        editable: true,
      });
      totalCosts += insurance;
    }

    const hoa = parseFloat(data.prepaidHOA) || 0;
    if (hoa > 0) {
      breakdownItems.push({
        category: 'Prepaid HOA Fees',
        description: "Homeowner's association dues",
        amount: hoa,
        editable: true,
      });
      totalCosts += hoa;
    }

    // Flood Certification
    const floodCert = 25;
    breakdownItems.push({
      category: 'Flood Certification',
      description: 'Flood zone determination',
      amount: floodCert,
      editable: true,
    });
    totalCosts += floodCert;

    setResult({
      purchasePrice: price,
      downPaymentAmount: downPayment,
      loanAmount: loanAmt,
      totalClosingCosts: totalCosts,
      totalCashNeeded: downPayment + totalCosts,
      breakdown: breakdownItems,
    });
    setShowResults(true);
  };

  return (
    <PageSafeContainer>
      <Header title="Estimated closing cost" showBack={true} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icons.Calculator size={24} color="#2563EB" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Estimated Closing Cost Calculator</Text>
            <Text style={styles.subtitle}>
              Calculate how much cash you'll need to close on your home purchase
            </Text>
          </View>
        </View>

        <FormProvider {...methods}>
          <EstimatedClosingCostCalculatorForm
            isDownPaymentPercent={isDownPaymentPercent}
            setIsDownPaymentPercent={setIsDownPaymentPercent}
            isBuyerBrokerPercent={isBuyerBrokerPercent}
            setIsBuyerBrokerPercent={setIsBuyerBrokerPercent}
          />
        </FormProvider>
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 10,
        }}>
        <PrimaryButton
          size={ButtonSize.LARGE}
          title="Show Results"
          onPress={methods.handleSubmit(calculateClosingCosts)}
          style={{
            flex: 1,
          }}
          rightWidget={<Icons.ChevronRight color="#FFF" />}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showResults && !!result}
        onRequestClose={() => {
          setShowResults(false);
        }}>
        <EstimatedClosingCostResults
          onBack={() => {
            setShowResults(false);
          }}
          result={result!}
        />
      </Modal>
    </PageSafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});
