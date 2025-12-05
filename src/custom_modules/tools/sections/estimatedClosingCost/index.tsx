import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Icons from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { useNavigation } from '@react-navigation/native';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { EstimatedClosingCostResults } from './results';

export interface CostBreakdownItem {
  category: string;
  description: string;
  amount: number;
  editable?: boolean;
  percentage?: number;
}

export interface ClosingCostResult {
  purchasePrice: number;
  downPaymentAmount: number;
  loanAmount: number;
  totalClosingCosts: number;
  totalCashNeeded: number;
  breakdown: CostBreakdownItem[];
}

export default function EstimatedClosingCostCalculator() {
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [downPaymentValue, setDownPaymentValue] = useState<string>('20');
  const [downPaymentType, setDownPaymentType] = useState<'percent' | 'dollar'>('percent');
  const [buyerBrokerComp, setBuyerBrokerComp] = useState<string>('');
  const [buyerBrokerType, setBuyerBrokerType] = useState<'percent' | 'dollar'>('percent');
  const [originationPoints, setOriginationPoints] = useState<string>('3');
  const [appraisalFee, setAppraisalFee] = useState<string>('500');
  const [inspectionFee, setInspectionFee] = useState<string>('400');
  const [creditReportFee, setCreditReportFee] = useState<string>('50');
  const [surveyFee, setSurveyFee] = useState<string>('550');
  const [recordingFees, setRecordingFees] = useState<string>('150');
  const [prepaidTaxes, setPrepaidTaxes] = useState<string>('3');
  const [prepaidInsurance, setPrepaidInsurance] = useState<string>('1200');
  const [prepaidHOA, setPrepaidHOA] = useState<string>('');
  const [escrowFee, setEscrowFee] = useState<string>('600');

  const [result, setResult] = useState<ClosingCostResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [editableBreakdown, setEditableBreakdown] = useState<CostBreakdownItem[]>([]);

  const navigation = useNavigation();

  const calculateClosingCosts = () => {
    const price = parseFloat(purchasePrice) || 0;
    const downValue = parseFloat(downPaymentValue) || 0;
    const points = parseFloat(originationPoints) || 0;

    if (price <= 0) {
      Alert.alert('Error', 'Please enter a valid purchase price');
      return;
    }

    // Calculate down payment
    let downPayment = 0;
    if (downPaymentType === 'percent') {
      if (downValue < 0 || downValue > 100) {
        Alert.alert('Error', 'Down payment percentage must be between 0 and 100');
        return;
      }
      downPayment = price * (downValue / 100);
    } else {
      downPayment = downValue;
    }

    const loanAmt = price - downPayment;

    const breakdownItems: CostBreakdownItem[] = [];
    let totalCosts = 0;

    // Buyer Broker Compensation
    if (buyerBrokerComp && parseFloat(buyerBrokerComp) > 0) {
      const brokerValue = parseFloat(buyerBrokerComp);
      let brokerAmount = 0;
      if (buyerBrokerType === 'percent') {
        brokerAmount = price * (brokerValue / 100);
        breakdownItems.push({
          category: 'Buyer Broker Compensation',
          description: `${brokerValue}% of purchase price`,
          amount: brokerAmount,
          percentage: brokerValue,
          editable: true,
        });
      } else {
        brokerAmount = brokerValue;
        breakdownItems.push({
          category: 'Buyer Broker Compensation',
          description: 'Fixed fee',
          amount: brokerAmount,
          editable: true,
        });
      }
      totalCosts += brokerAmount;
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

    // Appraisal Fee
    const appraisal = parseFloat(appraisalFee) || 0;
    if (appraisal > 0) {
      breakdownItems.push({
        category: 'Appraisal Fee',
        description: 'Professional property valuation',
        amount: appraisal,
        editable: true,
      });
      totalCosts += appraisal;
    }

    // Home Inspection
    const inspection = parseFloat(inspectionFee) || 0;
    if (inspection > 0) {
      breakdownItems.push({
        category: 'Home Inspection',
        description: 'Professional property inspection',
        amount: inspection,
        editable: true,
      });
      totalCosts += inspection;
    }

    // Credit Report
    const creditReport = parseFloat(creditReportFee) || 0;
    if (creditReport > 0) {
      breakdownItems.push({
        category: 'Credit Report',
        description: "Lender's credit check",
        amount: creditReport,
        editable: true,
      });
      totalCosts += creditReport;
    }

    // Survey Fee
    const survey = parseFloat(surveyFee) || 0;
    if (survey > 0) {
      breakdownItems.push({
        category: 'Property Survey',
        description: 'Land survey and boundaries',
        amount: survey,
        editable: true,
      });
      totalCosts += survey;
    }

    // Recording Fees
    const recording = parseFloat(recordingFees) || 0;
    if (recording > 0) {
      breakdownItems.push({
        category: 'Recording Fees',
        description: 'County recording and filing fees',
        amount: recording,
        editable: true,
      });
      totalCosts += recording;
    }

    // Escrow/Attorney Fee
    const escrow = parseFloat(escrowFee) || 0;
    if (escrow > 0) {
      breakdownItems.push({
        category: 'Attorney/Escrow Fee',
        description: 'Settlement and legal services',
        amount: escrow,
        editable: true,
      });
      totalCosts += escrow;
    }

    // Prepaid Property Taxes
    const prepaidTax = parseFloat(prepaidTaxes) || 0;
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

    // Prepaid Homeowner's Insurance
    const insurance = parseFloat(prepaidInsurance) || 0;
    if (insurance > 0) {
      breakdownItems.push({
        category: "Prepaid Homeowner's Insurance",
        description: 'First year premium',
        amount: insurance,
        editable: true,
      });
      totalCosts += insurance;
    }

    // Prepaid HOA
    const hoa = parseFloat(prepaidHOA) || 0;
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

    setEditableBreakdown(breakdownItems);
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

  const updateBreakdownItem = (index: number, newAmount: string) => {
    const amount = parseFloat(newAmount) || 0;
    const updatedBreakdown = [...editableBreakdown];
    updatedBreakdown[index] = { ...updatedBreakdown[index], amount };
    setEditableBreakdown(updatedBreakdown);

    const totalClosingCosts = updatedBreakdown.reduce((sum, item) => sum + item.amount, 0);
    if (result) {
      setResult({
        ...result,
        totalClosingCosts,
        totalCashNeeded: result.downPaymentAmount + totalClosingCosts,
        breakdown: updatedBreakdown,
      });
    }
  };

  const resetCalculator = () => {
    setPurchasePrice('');
    setDownPaymentValue('20');
    setDownPaymentType('percent');
    setBuyerBrokerComp('');
    setBuyerBrokerType('percent');
    setOriginationPoints('3');
    setAppraisalFee('500');
    setInspectionFee('400');
    setCreditReportFee('50');
    setSurveyFee('550');
    setRecordingFees('150');
    setPrepaidTaxes('3');
    setPrepaidInsurance('1200');
    setPrepaidHOA('');
    setEscrowFee('600');
    setResult(null);
    setShowResults(false);
    setEditableBreakdown([]);
  };

  const renderInput = () => (
    <PageSafeContainer>
      <Header
        title="Estimated closing cost"
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
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

        {/* Purchase Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Purchase Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Purchase Price</Text>
            <TextInput
              style={styles.input}
              placeholder="500000"
              value={purchasePrice}
              onChangeText={setPurchasePrice}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
            <Text style={styles.helperText}>Total purchase price of the property</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Down Payment</Text>
            <View style={styles.inputWithToggle}>
              <TextInput
                style={[styles.input, styles.flexInput]}
                placeholder={downPaymentType === 'percent' ? '20' : '100000'}
                value={downPaymentValue}
                onChangeText={setDownPaymentValue}
                keyboardType="decimal-pad"
                placeholderTextColor="#999"
              />
              <View style={styles.toggleGroup}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    downPaymentType === 'percent' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setDownPaymentType('percent')}>
                  <Text
                    style={[
                      styles.toggleText,
                      downPaymentType === 'percent' && styles.toggleTextActive,
                    ]}>
                    %
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    downPaymentType === 'dollar' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setDownPaymentType('dollar')}>
                  <Text
                    style={[
                      styles.toggleText,
                      downPaymentType === 'dollar' && styles.toggleTextActive,
                    ]}>
                    $
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.helperText}>
              {downPaymentType === 'percent'
                ? 'Percentage of purchase price (typical: 20%)'
                : 'Dollar amount'}
            </Text>
          </View>
        </View>

        {/* Buyer Broker Compensation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buyer Broker Compensation</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Compensation Amount (Optional)</Text>
            <View style={styles.inputWithToggle}>
              <TextInput
                style={[styles.input, styles.flexInput]}
                placeholder={buyerBrokerType === 'percent' ? '2.5' : '15000'}
                value={buyerBrokerComp}
                onChangeText={setBuyerBrokerComp}
                keyboardType="decimal-pad"
                placeholderTextColor="#999"
              />
              <View style={styles.toggleGroup}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    buyerBrokerType === 'percent' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setBuyerBrokerType('percent')}>
                  <Text
                    style={[
                      styles.toggleText,
                      buyerBrokerType === 'percent' && styles.toggleTextActive,
                    ]}>
                    %
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    buyerBrokerType === 'dollar' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setBuyerBrokerType('dollar')}>
                  <Text
                    style={[
                      styles.toggleText,
                      buyerBrokerType === 'dollar' && styles.toggleTextActive,
                    ]}>
                    $
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.helperText}>
              {buyerBrokerType === 'percent'
                ? 'Percentage of purchase price (if buyer is paying)'
                : 'Fixed dollar amount (if buyer is paying)'}
            </Text>
          </View>
        </View>

        {/* Lender Fees */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lender Fees</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Origination Fee (Points)</Text>
            <TextInput
              style={styles.input}
              placeholder="3"
              value={originationPoints}
              onChangeText={setOriginationPoints}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
            <Text style={styles.helperText}>Lender charges (default: 3 points = 3%)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Appraisal Fee</Text>
            <TextInput
              style={styles.input}
              placeholder="500"
              value={appraisalFee}
              onChangeText={setAppraisalFee}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
            <Text style={styles.helperText}>Property valuation fee (typical: $400-600)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Credit Report Fee</Text>
            <TextInput
              style={styles.input}
              placeholder="50"
              value={creditReportFee}
              onChangeText={setCreditReportFee}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
            <Text style={styles.helperText}>Lender's credit check (typical: $25-75)</Text>
          </View>
        </View>

        {/* Inspections & Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inspections & Services</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Home Inspection</Text>
            <TextInput
              style={styles.input}
              placeholder="400"
              value={inspectionFee}
              onChangeText={setInspectionFee}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
            <Text style={styles.helperText}>Professional inspection (typical: $300-500)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Property Survey</Text>
            <TextInput
              style={styles.input}
              placeholder="550"
              value={surveyFee}
              onChangeText={setSurveyFee}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
            <Text style={styles.helperText}>Land survey (typical: $400-600)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recording Fees</Text>
            <TextInput
              style={styles.input}
              placeholder="150"
              value={recordingFees}
              onChangeText={setRecordingFees}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
            <Text style={styles.helperText}>County filing fees (typical: $100-200)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Attorney/Escrow Fee</Text>
            <TextInput
              style={styles.input}
              placeholder="600"
              value={escrowFee}
              onChangeText={setEscrowFee}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
            <Text style={styles.helperText}>Settlement and legal services (typical: $500-800)</Text>
          </View>
        </View>

        {/* Prepaid Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prepaid Items (Escrow)</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prepaid Property Taxes (Months)</Text>
            <TextInput
              style={styles.input}
              placeholder="3"
              value={prepaidTaxes}
              onChangeText={setPrepaidTaxes}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
            <Text style={styles.helperText}>Months of taxes to escrow (typical: 2-6 months)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prepaid Homeowner's Insurance</Text>
            <TextInput
              style={styles.input}
              placeholder="1200"
              value={prepaidInsurance}
              onChangeText={setPrepaidInsurance}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
            <Text style={styles.helperText}>First year premium (typical: $800-1500)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prepaid HOA Fees (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={prepaidHOA}
              onChangeText={setPrepaidHOA}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
            <Text style={styles.helperText}>If applicable (varies by community)</Text>
          </View>
        </View>

        {/* Calculate Button */}
        <TouchableOpacity style={styles.calculateButton} onPress={calculateClosingCosts}>
          <Text style={styles.calculateButtonText}>Calculate Closing Costs</Text>
        </TouchableOpacity>
      </ScrollView>
    </PageSafeContainer>
  );

  const renderResults = () => {
    if (!result) return null;

    return (
      <EstimatedClosingCostResults
        resetCalculator={resetCalculator}
        result={result}
        editableBreakdown={editableBreakdown}
        updateBreakdownItem={updateBreakdownItem}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {showResults ? renderResults() : renderInput()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  section: {
    backgroundColor: 'white',
    marginTop: 12,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  flexInput: {
    flex: 1,
    marginRight: 8,
  },
  inputWithToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleGroup: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  toggleButtonActive: {
    backgroundColor: '#3B82F6',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: 'white',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  calculateButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
