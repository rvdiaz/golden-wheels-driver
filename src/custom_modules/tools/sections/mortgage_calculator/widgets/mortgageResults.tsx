import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Calculator, Info, DollarSign, TrendingUp } from 'lucide-react-native';
import { useFormContext } from 'react-hook-form';
import { MortgageCalculation, MortgageFormValues } from '../interfaces';
import { formatCurrency, formatCurrencyDetailed } from '../helpers';
import { Header } from '~/codidge_components/UI/header';
import { Card } from '~/codidge_components/UI/card';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';

interface MortgageCalculatorResultsProps {
  calculation: MortgageCalculation;
  onDispose: () => void;
}

export const MortgageCalculatorResults: React.FC<MortgageCalculatorResultsProps> = ({
  calculation,
  onDispose,
}) => {
  const { watch } = useFormContext<MortgageFormValues>();

  const downPayment = watch('downPayment');
  const homePrice = watch('homePrice');

  const downPaymentPercent = (
    ((parseFloat(downPayment) || 0) / (parseFloat(homePrice) || 1)) *
    100
  ).toFixed(1);

  // If no calculation is available, show the empty state
  if (!calculation || !calculation.monthlyPayment) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconContainer}>
          <Calculator size={48} color="#6B7280" />
        </View>
        <Text style={styles.emptyTitle}>Enter Loan Details</Text>
        <Text style={styles.emptySubtitle}>
          Fill in the home price and loan information to see your monthly payment breakdown
        </Text>
      </View>
    );
  }

  return (
    <PageSafeContainer style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'flex-end' }}>
      <Header showBack={true} onBack={onDispose} title="Mortgage Results" rightAction={onDispose} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Monthly Payment Breakdown */}
          <View
            style={{
              paddingHorizontal: 16,
              gap: 16,
            }}>
            <Card>
              <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                  <View style={styles.iconContainer}>
                    <Calculator size={20} color="#059669" />
                  </View>
                  <Text style={styles.cardTitle}>Monthly Payment</Text>
                </View>
                <Text style={styles.totalAmount}>{formatCurrency(calculation.monthlyPayment)}</Text>
              </View>

              <View style={styles.cardContent}>
                {/* Primary Components */}
                <View style={styles.paymentBreakdown}>
                  <View style={styles.paymentItem}>
                    <Text style={styles.paymentLabel}>Principal & Interest</Text>
                    <Text style={styles.paymentAmount}>
                      {formatCurrencyDetailed(calculation.principal + calculation.interest)}
                    </Text>
                  </View>

                  {/* Sub-breakdown */}
                  <View style={styles.subBreakdown}>
                    <View style={styles.subItem}>
                      <Text style={styles.subLabel}>• Principal</Text>
                      <Text style={styles.subAmount}>
                        {formatCurrencyDetailed(calculation.principal)}
                      </Text>
                    </View>
                    <View style={styles.subItem}>
                      <Text style={styles.subLabel}>• Interest</Text>
                      <Text style={styles.subAmount}>
                        {formatCurrencyDetailed(calculation.interest)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.paymentItem}>
                    <Text style={styles.paymentLabel}>Property Tax</Text>
                    <Text style={styles.paymentAmount}>
                      {formatCurrencyDetailed(calculation.propertyTax)}
                    </Text>
                  </View>

                  <View style={styles.paymentItem}>
                    <Text style={styles.paymentLabel}>Home Insurance</Text>
                    <Text style={styles.paymentAmount}>
                      {formatCurrencyDetailed(calculation.insurance)}
                    </Text>
                  </View>

                  {calculation.pmi > 0 && (
                    <View style={styles.paymentItem}>
                      <View style={styles.labelWithBadge}>
                        <Text style={styles.paymentLabel}>PMI</Text>
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>&lt;20% down</Text>
                        </View>
                      </View>
                      <Text style={styles.paymentAmount}>
                        {formatCurrencyDetailed(calculation.pmi)}
                      </Text>
                    </View>
                  )}

                  {calculation.hoa > 0 && (
                    <View style={styles.paymentItem}>
                      <Text style={styles.paymentLabel}>HOA Fees</Text>
                      <Text style={styles.paymentAmount}>
                        {formatCurrencyDetailed(calculation.hoa)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Card>

            {/* Loan Summary */}
            <Card style={{ marginBottom: 16 }}>
              <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                  <View style={styles.iconContainer}>
                    <Info size={20} color="#2563EB" />
                  </View>
                  <Text style={styles.cardTitle}>Loan Summary</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.summaryGrid}>
                  <View style={styles.summaryItem}>
                    <View style={styles.summaryIconContainer}>
                      <DollarSign size={16} color="#6B7280" />
                    </View>
                    <View style={styles.summaryContent}>
                      <Text style={styles.summaryLabel}>Loan Amount</Text>
                      <Text style={styles.summaryValue}>
                        {formatCurrency(calculation.totalLoanAmount)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.summaryItem}>
                    <View style={styles.summaryIconContainer}>
                      <TrendingUp size={16} color="#6B7280" />
                    </View>
                    <View style={styles.summaryContent}>
                      <Text style={styles.summaryLabel}>Total Interest</Text>
                      <Text style={styles.summaryValue}>
                        {formatCurrency(calculation.totalInterest)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.summaryItem}>
                    <View style={styles.summaryIconContainer}>
                      <DollarSign size={16} color="#6B7280" />
                    </View>
                    <View style={styles.summaryContent}>
                      <Text style={styles.summaryLabel}>Total Cost</Text>
                      <Text style={[styles.summaryValue, styles.totalCostValue]}>
                        {formatCurrency(calculation.totalCost)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.downPaymentInfo}>
                  <Text style={styles.downPaymentText}>
                    Down Payment: {formatCurrency(parseFloat(downPayment) || 0)}
                    <Text style={styles.percentageText}> ({downPaymentPercent}%)</Text>
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    marginTop: 16,
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
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },

  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
  },

  cardContent: {
    padding: 20,
  },

  paymentBreakdown: {
    gap: 12,
  },

  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  paymentLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },

  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  subBreakdown: {
    marginLeft: 16,
    gap: 4,
    marginBottom: 8,
  },

  subItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },

  subLabel: {
    fontSize: 14,
    color: '#6B7280',
  },

  subAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },

  labelWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  badge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#92400E',
  },

  summaryGrid: {
    gap: 16,
  },

  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },

  summaryIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  summaryContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 15,
    color: '#374151',
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  totalCostValue: {
    color: '#DC2626',
    fontWeight: '700',
  },

  downPaymentInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  downPaymentText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },

  percentageText: {
    fontWeight: '600',
    color: '#059669',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },

  emptyIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F9FAFB',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
