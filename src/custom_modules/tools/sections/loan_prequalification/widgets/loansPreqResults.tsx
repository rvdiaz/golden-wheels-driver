import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  CheckCircle,
  XCircle,
  Info,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { Card } from '~/codidge_components/UI/card';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LoansPreqResultsProps {
  result: {
    maxHomePrice: string;
    maxLoanAmount: string;
    maxMonthlyPayment: string;
    availableForMortgage: string;
    debtToIncomeRatio: string;
    isQualified: boolean;
    formData?: {
      monthlyIncome: number;
      monthlyDebts: number;
      downPayment: number;
      interestRate: number;
      loanTerm: number;
    };
  };
  onDispose: () => void;
}

const formatCurrency = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
};

const formatCurrencyDetailed = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
};

export const LoansPreqResults: React.FC<LoansPreqResultsProps> = ({ result, onDispose }) => {
  const qualificationColor = result.isQualified ? '#059669' : '#DC2626';
  const qualificationBgColor = result.isQualified ? '#F0FDF4' : '#FEF2F2';

  const debtToIncomeFloat = parseFloat(result.debtToIncomeRatio);
  const isGoodDebtRatio = debtToIncomeFloat <= 43;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', marginTop: 40 }}>
      <Header title="Prequalification Results" rightText="Close" rightAction={onDispose} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.content}>
            {/* Qualification Status */}
            <Card>
              <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: qualificationBgColor }]}>
                    {result.isQualified ? (
                      <CheckCircle size={20} color={qualificationColor} />
                    ) : (
                      <XCircle size={20} color={qualificationColor} />
                    )}
                  </View>
                  <Text style={styles.cardTitle}>Qualification Status</Text>
                </View>
              </View>
              <View
                style={{
                  padding: 20,
                }}>
                <Text style={[styles.statusText, { color: qualificationColor }]}>
                  {result.isQualified ? 'Likely Qualified' : 'May Need Improvement'}
                </Text>
              </View>
              <View style={styles.cardContent}>
                <View style={styles.qualificationBreakdown}>
                  <View style={styles.qualificationItem}>
                    <Text style={styles.qualificationLabel}>Debt-to-Income Ratio</Text>
                    <View style={styles.ratioContainer}>
                      <Text
                        style={[
                          styles.ratioValue,
                          { color: isGoodDebtRatio ? '#059669' : '#DC2626' },
                        ]}>
                        {result.debtToIncomeRatio}%
                      </Text>
                      <Text style={styles.ratioTarget}>/ 43% max</Text>
                    </View>
                  </View>

                  {!isGoodDebtRatio && (
                    <View style={styles.warningContainer}>
                      <AlertTriangle size={16} color="#F59E0B" />
                      <Text style={styles.warningText}>
                        Debt ratio exceeds recommended 43% threshold
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Card>

            {/* Borrowing Capacity */}
            <Card style={{ marginTop: 16 }}>
              <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                  <View style={styles.iconContainer}>
                    <DollarSign size={20} color="#2563EB" />
                  </View>
                  <Text style={styles.cardTitle}>Borrowing Capacity</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.capacityBreakdown}>
                  <View style={styles.capacityItem}>
                    <Text style={styles.capacityLabel}>Maximum Home Price</Text>
                    <Text style={styles.capacityValue}>{formatCurrency(result.maxHomePrice)}</Text>
                  </View>

                  <View style={styles.capacityItem}>
                    <Text style={styles.capacityLabel}>Maximum Loan Amount</Text>
                    <Text style={styles.capacityValue}>{formatCurrency(result.maxLoanAmount)}</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.capacityItem}>
                    <Text style={styles.capacityLabel}>Max Monthly Payment</Text>
                    <Text style={styles.capacityValue}>
                      {formatCurrencyDetailed(result.maxMonthlyPayment)}
                    </Text>
                  </View>

                  <View style={styles.capacityItem}>
                    <Text style={styles.capacityLabel}>Available for Mortgage</Text>
                    <Text
                      style={[
                        styles.capacityValue,
                        {
                          color:
                            parseFloat(result.availableForMortgage) > 0 ? '#059669' : '#DC2626',
                        },
                      ]}>
                      {formatCurrencyDetailed(result.availableForMortgage)}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* Loan Parameters */}
            {result.formData && (
              <Card style={{ marginTop: 16 }}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                      <Info size={20} color="#059669" />
                    </View>
                    <Text style={styles.cardTitle}>Loan Parameters</Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.parametersGrid}>
                    <View style={styles.parameterItem}>
                      <View style={styles.parameterIconContainer}>
                        <DollarSign size={16} color="#6B7280" />
                      </View>
                      <View style={styles.parameterContent}>
                        <Text style={styles.parameterLabel}>Monthly Income</Text>
                        <Text style={styles.parameterValue}>
                          {formatCurrency(result.formData.monthlyIncome)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.parameterItem}>
                      <View style={styles.parameterIconContainer}>
                        <TrendingUp size={16} color="#6B7280" />
                      </View>
                      <View style={styles.parameterContent}>
                        <Text style={styles.parameterLabel}>Interest Rate</Text>
                        <Text style={styles.parameterValue}>{result.formData.interestRate}%</Text>
                      </View>
                    </View>

                    <View style={styles.parameterItem}>
                      <View style={styles.parameterIconContainer}>
                        <Info size={16} color="#6B7280" />
                      </View>
                      <View style={styles.parameterContent}>
                        <Text style={styles.parameterLabel}>Loan Term</Text>
                        <Text style={styles.parameterValue}>{result.formData.loanTerm} years</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            )}

            {/* Improvement Tips */}
            {!result.isQualified && (
              <Card style={{ marginTop: 16, backgroundColor: '#FEF3C7' }}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                      <AlertTriangle size={20} color="#F59E0B" />
                    </View>
                    <Text style={styles.cardTitle}>Tips for Improvement</Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.tipsContainer}>
                    <View style={styles.tipItem}>
                      <Text style={styles.tipBullet}>•</Text>
                      <Text style={styles.tipText}>Keep debt-to-income ratio below 43%</Text>
                    </View>
                    <View style={styles.tipItem}>
                      <Text style={styles.tipBullet}>•</Text>
                      <Text style={styles.tipText}>
                        Increase down payment to reduce loan amount
                      </Text>
                    </View>
                    <View style={styles.tipItem}>
                      <Text style={styles.tipBullet}>•</Text>
                      <Text style={styles.tipText}>Pay down existing debts before applying</Text>
                    </View>
                    <View style={styles.tipItem}>
                      <Text style={styles.tipBullet}>•</Text>
                      <Text style={styles.tipText}>Consider increasing monthly income</Text>
                    </View>
                  </View>
                </View>
              </Card>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  statusText: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardContent: {
    padding: 20,
  },
  qualificationBreakdown: {
    gap: 16,
  },
  qualificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qualificationLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  ratioContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  ratioValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  ratioTarget: {
    fontSize: 14,
    color: '#6B7280',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
    flex: 1,
  },
  capacityBreakdown: {
    gap: 12,
  },
  capacityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  capacityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  capacityValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  parametersGrid: {
    gap: 16,
  },
  parameterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  parameterIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  parameterContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  parameterLabel: {
    fontSize: 15,
    color: '#374151',
  },
  parameterValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  tipsContainer: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#92400E',
    fontWeight: '600',
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#92400E',
    flex: 1,
    lineHeight: 20,
  },
});
