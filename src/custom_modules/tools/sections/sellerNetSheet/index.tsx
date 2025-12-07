import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { Calculator } from 'lucide-react-native';
import { BreakdownItem, detectStateFromZip, GEOGRAPHIC_COSTS, NetSheetResult } from './mocked';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { ToolDisclaimer } from '../../components/toolsDisclaimer';
import { toolsDisclaimers } from '../../data';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
        <Header
          title="Seller's Net Sheet"
          showBack={true}
          onBack={() => {
            setShowResults(false);
          }}
        />
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === 'ios' ? 0 : 80}
          keyboardShouldPersistTaps="handled">
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
                  Based on {GEOGRAPHIC_COSTS[detectedState]?.stateName || 'national average'}{' '}
                  closing costs
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
                <View
                  style={{
                    gap: 8,
                  }}>
                  <View>
                    <InputField
                      allowCommas={true}
                      label="Sale Price"
                      value={salePrice}
                      onChangeText={setSalePrice}
                      keyboardType="numeric"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>

                  <View>
                    <InputField
                      label="Zip Code"
                      value={zipCode}
                      onChangeText={setZipCode}
                      keyboardType="numeric"
                      maxLength={5}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>

                  <View>
                    <InputField
                      allowCommas={true}
                      label="Mortgage Balance"
                      value={mortgageBalance}
                      onChangeText={setMortgageBalance}
                      keyboardType="numeric"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>

                  <View>
                    <InputField
                      label="Commission (%)"
                      value={commissionRate}
                      onChangeText={setCommissionRate}
                      keyboardType="decimal-pad"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>

                  <View>
                    <InputField
                      allowCommas={true}
                      label="Repairs/Concessions"
                      value={repairs}
                      onChangeText={setRepairs}
                      keyboardType="numeric"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>

                  <View>
                    <InputField
                      allowCommas={true}
                      label="Home Warranty"
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
            <ToolDisclaimer value={toolsDisclaimers.sellerNetSheet} />
          </ScrollView>
        </KeyboardAwareScrollView>
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
            <View>
              <InputField
                allowCommas={true}
                label="Sale Price"
                placeholder="500000"
                value={salePrice}
                onChangeText={setSalePrice}
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
                hint="Expected or agreed sale price"
              />
            </View>

            <View>
              <InputField
                label="Property Zip Code"
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

            <View>
              <InputField
                allowCommas={true}
                label="Loan Amount"
                placeholder="250000"
                value={mortgageBalance}
                onChangeText={setMortgageBalance}
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
                hint="Outstanding loan balance (optional)"
              />
            </View>

            {/* Input Form - Column 2 */}
            <View>
              <InputField
                label="Real Estate Commission (%)"
                placeholder="6.0"
                value={commissionRate}
                onChangeText={setCommissionRate}
                keyboardType="decimal-pad"
                placeholderTextColor="#9ca3af"
                hint="Total commission for both agents (typical: 5-6%)"
              />
            </View>

            <View>
              <InputField
                allowCommas={true}
                label="Repairs/Concessions"
                placeholder="2000"
                value={repairs}
                onChangeText={setRepairs}
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
                hint="Negotiated repairs or buyer concessions (optional)"
              />
            </View>

            <View>
              <InputField
                allowCommas={true}
                label="Home Warranty"
                placeholder="500"
                value={homeWarranty}
                onChangeText={setHomeWarranty}
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
                hint="One-year home warranty for buyer (optional)"
              />
            </View>
          </View>
        </View>
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
          leftWidget={<Calculator color="#fff" size={20} />}
          onPress={calculateNetSheet}
          size={ButtonSize.LARGE}
          title="Calculate Net Proceeds"
          style={{
            flex: 1,
          }}
        />
      </View>
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
    gap: 8,
  },
  flex1: {
    flex: 1,
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

  editLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
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
});
