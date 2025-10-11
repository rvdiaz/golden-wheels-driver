import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { Calculator, DollarSign, Home, AlertCircle, MapPin } from 'lucide-react-native';
import { BreakdownItem, detectStateFromZip, GEOGRAPHIC_COSTS, NetSheetResult } from './mocked';

export const SellerNetSheetPage = () => {
  const navigation = useNavigation();

  const [salePrice, setSalePrice] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [mortgageBalance, setMortgageBalance] = useState<string>('');
  const [commissionRate, setCommissionRate] = useState<string>('6.0');
  const [repairs, setRepairs] = useState<string>('');
  const [homeWarranty, setHomeWarranty] = useState<string>('500');
  const [result, setResult] = useState<NetSheetResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [detectedState, setDetectedState] = useState<string>('');

  useEffect(() => {
    const state = detectStateFromZip(zipCode);
    setDetectedState(state);
  }, [zipCode]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number): string => {
    return `${percentage.toFixed(2)}%`;
  };

  const calculateNetSheet = () => {
    const grossPrice = parseFloat(salePrice);
    const mortgage = parseFloat(mortgageBalance || '0');
    const commission = parseFloat(commissionRate);
    const repairCosts = parseFloat(repairs || '0');
    const warranty = parseFloat(homeWarranty || '0');

    if (!grossPrice || grossPrice <= 0) {
      alert('Please enter a valid sale price');
      return;
    }

    const state = detectStateFromZip(zipCode);
    const costs = GEOGRAPHIC_COSTS[state] || GEOGRAPHIC_COSTS.DEFAULT;

    const breakdownItems: BreakdownItem[] = [];
    let totalDeductions = 0;

    // Mortgage payoff
    if (mortgage > 0) {
      breakdownItems.push({
        category: 'Loan Payoff',
        description: 'Existing mortgage balance',
        amount: mortgage,
        percentage: (mortgage / grossPrice) * 100,
      });
      totalDeductions += mortgage;
    }

    // Real estate commission
    const commissionAmount = grossPrice * (commission / 100);
    breakdownItems.push({
      category: 'Real Estate Commission',
      description: `${commission}% total commission`,
      amount: commissionAmount,
      percentage: commission,
    });
    totalDeductions += commissionAmount;

    // Transfer tax
    const transferTaxAmount = grossPrice * (costs.transferTax / 100);
    if (transferTaxAmount > 0) {
      breakdownItems.push({
        category: 'Transfer Tax',
        description: `${costs.stateName} transfer tax`,
        amount: transferTaxAmount,
        percentage: costs.transferTax,
      });
      totalDeductions += transferTaxAmount;
    }

    // Title insurance
    const titleAmount = grossPrice * (costs.titleInsurance / 100);
    breakdownItems.push({
      category: 'Title Insurance',
      description: "Owner's title insurance policy",
      amount: titleAmount,
      percentage: costs.titleInsurance,
    });
    totalDeductions += titleAmount;

    // Attorney fees
    if (costs.attorneyFees > 0) {
      breakdownItems.push({
        category: 'Attorney Fees',
        description: 'Legal representation at closing',
        amount: costs.attorneyFees,
        percentage: (costs.attorneyFees / grossPrice) * 100,
      });
      totalDeductions += costs.attorneyFees;
    }

    // Recording fees
    breakdownItems.push({
      category: 'Recording Fees',
      description: 'Document recording with county',
      amount: costs.recordingFees,
      percentage: (costs.recordingFees / grossPrice) * 100,
    });
    totalDeductions += costs.recordingFees;

    // Escrow/settlement fees
    const escrowAmount = grossPrice * (costs.escrowFees / 100);
    breakdownItems.push({
      category: 'Escrow/Settlement Fees',
      description: 'Third-party transaction management',
      amount: escrowAmount,
      percentage: costs.escrowFees,
    });
    totalDeductions += escrowAmount;

    // Property taxes (prorated)
    const propertyTaxAmount = (grossPrice * (costs.propertyTaxRate / 100)) / 2;
    breakdownItems.push({
      category: 'Prorated Property Taxes',
      description: 'Property taxes through closing date',
      amount: propertyTaxAmount,
      percentage: (propertyTaxAmount / grossPrice) * 100,
    });
    totalDeductions += propertyTaxAmount;

    // Repairs/concessions
    if (repairCosts > 0) {
      breakdownItems.push({
        category: 'Repairs/Concessions',
        description: 'Negotiated repairs or buyer concessions',
        amount: repairCosts,
        percentage: (repairCosts / grossPrice) * 100,
      });
      totalDeductions += repairCosts;
    }

    // Home warranty
    if (warranty > 0) {
      breakdownItems.push({
        category: 'Home Warranty',
        description: 'One-year home warranty for buyer',
        amount: warranty,
        percentage: (warranty / grossPrice) * 100,
      });
      totalDeductions += warranty;
    }

    const netProceeds = grossPrice - totalDeductions;

    setResult({
      grossSalePrice: grossPrice,
      totalDeductions: totalDeductions,
      netProceeds: netProceeds,
      breakdownItems: breakdownItems.sort((a, b) => b.amount - a.amount),
    });
    setShowResults(true);
  };

  const resetCalculator = () => {
    setSalePrice('');
    setZipCode('');
    setMortgageBalance('');
    setCommissionRate('6.0');
    setRepairs('');
    setHomeWarranty('500');
    setResult(null);
    setShowResults(false);
    setDetectedState('');
  };

  if (showResults && result) {
    return (
      <PageSafeContainer>
        <Header title="Seller's Net Sheet" showBack={true} onBack={resetCalculator} />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.headerSection}>
            <Text style={styles.sectionTitle}>Seller's Net Sheet</Text>
            <TouchableOpacity style={styles.newCalcButton} onPress={resetCalculator}>
              <Text style={styles.newCalcButtonText}>New Calculation</Text>
            </TouchableOpacity>
          </View>

          {/* Summary Cards */}
          <View style={styles.summaryGrid}>
            <View style={[styles.summaryCard, styles.summaryCardBlue]}>
              <Text style={styles.summaryLabel}>Gross Sale Price</Text>
              <Text style={styles.summaryValue}>{formatCurrency(result.grossSalePrice)}</Text>
            </View>

            <View style={[styles.summaryCard, styles.summaryCardRed]}>
              <Text style={styles.summaryLabel}>Total Deductions</Text>
              <Text style={styles.summaryValue}>{formatCurrency(result.totalDeductions)}</Text>
              <Text style={styles.summarySubtext}>
                {formatPercentage((result.totalDeductions / result.grossSalePrice) * 100)} of sale
                price
              </Text>
            </View>

            <View
              style={[
                styles.summaryCard,
                result.netProceeds > 0 ? styles.summaryCardGreen : styles.summaryCardRedAlert,
              ]}>
              <Text style={styles.summaryLabel}>Net Proceeds</Text>
              <Text style={styles.summaryValue}>{formatCurrency(result.netProceeds)}</Text>
              {result.netProceeds <= 0 && (
                <Text style={styles.summaryWarning}>⚠️ Costs exceed sale price</Text>
              )}
            </View>
          </View>

          {/* Detailed Breakdown */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Cost Breakdown</Text>
              <Text style={styles.cardSubtitle}>
                Based on {GEOGRAPHIC_COSTS[detectedState]?.stateName || 'national average'} closing
                costs
              </Text>
            </View>
            <View style={styles.cardContent}>
              {result.breakdownItems.map((item: any, index: number) => (
                <View key={index} style={styles.breakdownItem}>
                  <View style={styles.breakdownLeft}>
                    <Text style={styles.breakdownCategory}>{item.category}</Text>
                    <Text style={styles.breakdownDescription}>{item.description}</Text>
                  </View>
                  <View style={styles.breakdownRight}>
                    <Text style={styles.breakdownAmount}>{formatCurrency(item.amount)}</Text>
                    <Text style={styles.breakdownPercentage}>
                      {formatPercentage(item.percentage)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Editable Parameters */}
          <View style={[styles.card, styles.editCard]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, styles.editCardTitle]}>Adjust Parameters</Text>
              <Text style={[styles.cardSubtitle, styles.editCardSubtitle]}>
                Modify any value below and recalculate to see updated results
              </Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.editGrid}>
                <View style={styles.editItem}>
                  <Text style={styles.editLabel}>Sale Price</Text>
                  <TextInput
                    style={styles.input}
                    value={salePrice}
                    onChangeText={setSalePrice}
                    keyboardType="numeric"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.editItem}>
                  <Text style={styles.editLabel}>Zip Code</Text>
                  <TextInput
                    style={styles.input}
                    value={zipCode}
                    onChangeText={setZipCode}
                    keyboardType="numeric"
                    maxLength={5}
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.editItem}>
                  <Text style={styles.editLabel}>Mortgage Balance</Text>
                  <TextInput
                    style={styles.input}
                    value={mortgageBalance}
                    onChangeText={setMortgageBalance}
                    keyboardType="numeric"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.editItem}>
                  <Text style={styles.editLabel}>Commission (%)</Text>
                  <TextInput
                    style={styles.input}
                    value={commissionRate}
                    onChangeText={setCommissionRate}
                    keyboardType="decimal-pad"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.editItem}>
                  <Text style={styles.editLabel}>Repairs/Concessions</Text>
                  <TextInput
                    style={styles.input}
                    value={repairs}
                    onChangeText={setRepairs}
                    keyboardType="numeric"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.editItem}>
                  <Text style={styles.editLabel}>Home Warranty</Text>
                  <TextInput
                    style={styles.input}
                    value={homeWarranty}
                    onChangeText={setHomeWarranty}
                    keyboardType="numeric"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonPrimary, styles.buttonFlex]}
                  onPress={calculateNetSheet}>
                  <Text style={styles.buttonText}>Recalculate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonOutline, styles.buttonFlex]}
                  onPress={resetCalculator}>
                  <Text style={styles.buttonOutlineText}>Start Over</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </PageSafeContainer>
    );
  }

  return (
    <PageSafeContainer>
      <Header
        title="Seller Net Sheet"
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Calculator color="#7c3aed" size={24} />
            <View style={styles.flex1}>
              <Text style={styles.cardTitle}>Seller's Net Sheet Calculator</Text>
              <Text style={styles.cardSubtitle}>
                Calculate your estimated net proceeds from the sale using location-specific costs
              </Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            {/* Input Form - Column 1 */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Home color="#374151" size={16} />
                <Text style={styles.label}>Sale Price</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="500000"
                value={salePrice}
                onChangeText={setSalePrice}
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
              />
              <Text style={styles.inputHint}>Expected or agreed sale price</Text>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <MapPin color="#374151" size={16} />
                <Text style={styles.label}>Property Zip Code</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="12345"
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="numeric"
                maxLength={5}
                placeholderTextColor="#9ca3af"
              />
              {detectedState && detectedState !== 'DEFAULT' && (
                <Text style={styles.inputHintSuccess}>
                  ✓ Detected: {GEOGRAPHIC_COSTS[detectedState].stateName}
                </Text>
              )}
              {detectedState === 'DEFAULT' && zipCode.length >= 5 && (
                <Text style={styles.inputHintWarning}>
                  Using national averages for this location
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Mortgage Balance</Text>
              <TextInput
                style={styles.input}
                placeholder="250000"
                value={mortgageBalance}
                onChangeText={setMortgageBalance}
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
              />
              <Text style={styles.inputHint}>Outstanding loan balance (optional)</Text>
            </View>

            {/* Input Form - Column 2 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Real Estate Commission (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="6.0"
                value={commissionRate}
                onChangeText={setCommissionRate}
                keyboardType="decimal-pad"
                placeholderTextColor="#9ca3af"
              />
              <Text style={styles.inputHint}>Total commission for both agents (typical: 5-6%)</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Repairs/Concessions</Text>
              <TextInput
                style={styles.input}
                placeholder="2000"
                value={repairs}
                onChangeText={setRepairs}
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
              />
              <Text style={styles.inputHint}>
                Negotiated repairs or buyer concessions (optional)
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Home Warranty</Text>
              <TextInput
                style={styles.input}
                placeholder="500"
                value={homeWarranty}
                onChangeText={setHomeWarranty}
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
              />
              <Text style={styles.inputHint}>One-year home warranty for buyer (optional)</Text>
            </View>

            {/* Calculate Button */}
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary, styles.mt24]}
              onPress={calculateNetSheet}>
              <Calculator color="#fff" size={20} />
              <Text style={styles.buttonText}>Calculate Net Proceeds</Text>
            </TouchableOpacity>

            {/* Info Alert */}
            <View style={styles.alert}>
              <AlertCircle color="#3b82f6" size={16} />
              <View style={styles.alertContent}>
                <Text style={styles.alertText}>
                  <Text style={styles.alertBold}>Location-Based Costs:</Text> This calculator uses
                  average costs for your zip code area. Actual costs may vary based on specific
                  title companies, attorneys, and local regulations. Always consult with your real
                  estate professional for precise estimates.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  cardContent: {
    padding: 16,
  },
  flex1: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  inputHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  inputHintSuccess: {
    fontSize: 12,
    color: '#16a34a',
    marginTop: 4,
  },
  inputHintWarning: {
    fontSize: 12,
    color: '#ea580c',
    marginTop: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonPrimary: {
    backgroundColor: '#7c3aed',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutlineText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  buttonFlex: {
    flex: 1,
  },
  mt24: {
    marginTop: 24,
  },
  alert: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    marginTop: 24,
  },
  alertContent: {
    flex: 1,
  },
  alertText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  alertBold: {
    fontWeight: '700',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  newCalcButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  newCalcButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  summaryGrid: {
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  summaryCardBlue: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  summaryCardRed: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  summaryCardGreen: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  summaryCardRedAlert: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  summarySubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  summaryWarning: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 12,
  },
  breakdownLeft: {
    flex: 1,
    paddingRight: 16,
  },
  breakdownCategory: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  breakdownDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  breakdownRight: {
    alignItems: 'flex-end',
  },
  breakdownAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  breakdownPercentage: {
    fontSize: 12,
    color: '#6b7280',
  },
  editCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  editCardTitle: {
    color: '#1e40af',
  },
  editCardSubtitle: {
    color: '#3b82f6',
  },
  editGrid: {
    gap: 16,
  },
  editItem: {
    gap: 8,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});
