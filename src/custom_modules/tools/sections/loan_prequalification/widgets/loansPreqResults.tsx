import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  CheckCircle,
  XCircle,
  Info,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CreditCard,
  Home,
  Building2,
} from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { Card } from '~/codidge_components/UI/card';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { GridTabs } from '~/codidge_components/UI/tabs';
import { theme } from '~/theme/theme';
import { ToolDisclaimer } from '~/custom_modules/tools/components/toolsDisclaimer';
import { toolsDisclaimers } from '~/custom_modules/tools/data';

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

interface LoansPreqResultsProps {
  results: CalculationResult[];
  onDispose: () => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercentage = (ratio: number): string => {
  return `${ratio.toFixed(1)}%`;
};

export const LoansPreqResults: React.FC<LoansPreqResultsProps> = ({ results, onDispose }) => {
  // Initialize with the first loan program's name
  const [activeTab, setActiveTab] = useState(results[0]?.loanProgram.name || 'Conventional');

  // Find the current result based on active tab
  const currentResult = results.find((r) => r.loanProgram.name === activeTab) || results[0];

  // Create tabs from results
  const tabs = results.map((result) => ({
    key: result.loanProgram.name,
    label: result.loanProgram.name,
    Icon: result.loanProgram.name === 'FHA' ? Home : Building2,
  }));

  const qualificationColor = currentResult.qualifies ? '#059669' : '#DC2626';
  const qualificationBgColor = currentResult.qualifies ? '#F0FDF4' : '#FEF2F2';
  const isGoodHousingRatio =
    currentResult.housingRatioUsed <= currentResult.loanProgram.housingRatio;
  const isGoodTotalRatio = currentResult.totalRatioUsed <= currentResult.loanProgram.totalRatio;

  return (
    <PageSafeContainer style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <Header title="Prequalification Results" showBack={true} onBack={onDispose} />

      {/* Tabs */}
      <View
        style={{
          marginTop: 5,
        }}>
        <GridTabs
          tabs={tabs}
          initialTabKey={activeTab}
          onTabChange={setActiveTab}
          containerStyle={styles.tabContainer}
          activeTabBackground={theme.colors.primary}
          activeTabColor="#FFF"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Card
              style={[
                styles.loanCard,
                {
                  borderColor: qualificationColor,
                  borderWidth: 2,
                  backgroundColor: qualificationBgColor,
                },
              ]}>
              {/* Header */}
              <View style={[styles.cardHeaderSection]}>
                <View style={styles.headerRow}>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <Text style={styles.loanTitle}>{currentResult.loanProgram.name} Loan</Text>
                    <Text style={styles.loanDescription}>
                      {currentResult.loanProgram.description}
                    </Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: qualificationColor }]}>
                    {currentResult.qualifies ? (
                      <CheckCircle size={16} color="#FFF" />
                    ) : (
                      <XCircle size={16} color="#FFF" />
                    )}
                    <Text style={styles.badgeText}>
                      {currentResult.qualifies ? 'Qualifies' : 'Does Not Qualify'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Main Content */}
              {currentResult.qualifies && currentResult.maxLoanAmount > 0 ? (
                <View style={styles.cardContent}>
                  {/* Loan Amounts */}
                  <View style={styles.amountSection}>
                    <View style={styles.amountItem}>
                      <Text style={styles.amountLabel}>Maximum Loan Amount</Text>
                      <Text style={styles.amountValuePrimary}>
                        {formatCurrency(currentResult.maxLoanAmount)}
                      </Text>
                    </View>
                    <View style={styles.amountItem}>
                      <Text style={styles.amountLabel}>Maximum Home Price</Text>
                      <Text style={styles.amountValue}>
                        {formatCurrency(currentResult.maxHomePrice)}
                      </Text>
                    </View>
                    <View style={styles.amountItem}>
                      <Text style={styles.amountLabel}>Monthly Housing Payment</Text>
                      <Text style={styles.amountValue}>
                        {formatCurrency(currentResult.monthlyHousingPayment)}
                      </Text>
                    </View>
                  </View>

                  {/* Payment Breakdown */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <CreditCard size={18} color="#2563EB" />
                      <Text style={styles.sectionTitle}>Payment Breakdown</Text>
                    </View>
                    <View style={styles.breakdownBox}>
                      <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Principal & Interest</Text>
                        <Text style={styles.breakdownValue}>
                          {formatCurrency(currentResult.paymentBreakdown.principalAndInterest)}
                        </Text>
                      </View>
                      <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Property Taxes</Text>
                        <Text style={styles.breakdownValue}>
                          {formatCurrency(currentResult.paymentBreakdown.propertyTaxes)}
                        </Text>
                      </View>
                      <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Homeowners Insurance</Text>
                        <Text style={styles.breakdownValue}>
                          {formatCurrency(currentResult.paymentBreakdown.homeownersInsurance)}
                        </Text>
                      </View>
                      {currentResult.paymentBreakdown.mortgageInsurance > 0 && (
                        <View style={styles.breakdownRow}>
                          <Text style={styles.breakdownLabel}>Mortgage Insurance (PMI)</Text>
                          <Text style={styles.breakdownValue}>
                            {formatCurrency(currentResult.paymentBreakdown.mortgageInsurance)}
                          </Text>
                        </View>
                      )}
                      {currentResult.paymentBreakdown.hoaFees > 0 && (
                        <View style={styles.breakdownRow}>
                          <Text style={styles.breakdownLabel}>HOA Fees</Text>
                          <Text style={styles.breakdownValue}>
                            {formatCurrency(currentResult.paymentBreakdown.hoaFees)}
                          </Text>
                        </View>
                      )}
                      <View style={styles.divider} />
                      <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabelBold}>Total Monthly Payment</Text>
                        <Text style={styles.breakdownValueBold}>
                          {formatCurrency(currentResult.paymentBreakdown.totalMonthlyPayment)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Debt-to-Income Analysis */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <TrendingUp size={18} color="#2563EB" />
                      <Text style={styles.sectionTitle}>Debt-to-Income Analysis</Text>
                    </View>
                    <View style={styles.ratioContainer}>
                      <View style={styles.ratioCard}>
                        <Text style={styles.ratioLabel}>Housing Expense Ratio</Text>
                        <View style={styles.ratioValues}>
                          <Text
                            style={[
                              styles.ratioActual,
                              { color: isGoodHousingRatio ? '#059669' : '#DC2626' },
                            ]}>
                            {formatPercentage(currentResult.housingRatioUsed)}
                          </Text>
                          <Text style={styles.ratioLimit}>
                            / {currentResult.loanProgram.housingRatio}% max
                          </Text>
                        </View>
                        {!isGoodHousingRatio && (
                          <View style={styles.warningBadge}>
                            <AlertTriangle size={14} color="#F59E0B" />
                            <Text style={styles.warningText}>Exceeds limit</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.ratioCard}>
                        <Text style={styles.ratioLabel}>Total Debt-to-Income</Text>
                        <View style={styles.ratioValues}>
                          <Text
                            style={[
                              styles.ratioActual,
                              { color: isGoodTotalRatio ? '#059669' : '#DC2626' },
                            ]}>
                            {formatPercentage(currentResult.totalRatioUsed)}
                          </Text>
                          <Text style={styles.ratioLimit}>
                            / {currentResult.loanProgram.totalRatio}% max
                          </Text>
                        </View>
                        {!isGoodTotalRatio && (
                          <View style={styles.warningBadge}>
                            <AlertTriangle size={14} color="#F59E0B" />
                            <Text style={styles.warningText}>Exceeds limit</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Cash to Close Analysis */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <DollarSign size={18} color="#2563EB" />
                      <Text style={styles.sectionTitle}>Cash to Close Analysis</Text>
                      {!currentResult.cashToClose.hasEnoughCash && (
                        <View style={styles.insufficientBadge}>
                          <AlertTriangle size={12} color="#DC2626" />
                          <Text style={styles.insufficientText}>Insufficient Cash</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.cashBox}>
                      <View style={styles.cashRow}>
                        <Text style={styles.cashLabel}>
                          Minimum Down Payment ({currentResult.loanProgram.minDownPaymentPercentage}
                          %)
                        </Text>
                        <Text style={styles.cashValue}>
                          {formatCurrency(currentResult.cashToClose.downPaymentRequired)}
                        </Text>
                      </View>
                      <View style={styles.cashRow}>
                        <Text style={styles.cashLabel}>Estimated Closing Costs</Text>
                        <Text style={styles.cashValue}>
                          {formatCurrency(currentResult.cashToClose.closingCosts)}
                        </Text>
                      </View>
                      <View style={styles.divider} />
                      <View style={styles.cashRow}>
                        <Text style={styles.cashLabelBold}>Total Cash Needed</Text>
                        <Text style={styles.cashValueBold}>
                          {formatCurrency(currentResult.cashToClose.totalCashNeeded)}
                        </Text>
                      </View>

                      {currentResult.cashToClose.cashShortfall > 0 ? (
                        <View style={styles.shortfallBox}>
                          <View style={styles.shortfallHeader}>
                            <AlertTriangle size={16} color="#DC2626" />
                            <Text style={styles.shortfallTitle}>Cash Shortfall</Text>
                          </View>
                          <Text style={styles.shortfallAmount}>
                            {formatCurrency(currentResult.cashToClose.cashShortfall)}
                          </Text>

                          {currentResult.cashToClose.suggestedClosingCostReduction > 0 && (
                            <View style={styles.suggestionBox}>
                              <Text style={styles.suggestionLabel}>
                                Suggested Seller Concessions:
                              </Text>
                              <Text style={styles.suggestionValue}>
                                {formatCurrency(
                                  currentResult.cashToClose.suggestedClosingCostReduction
                                )}
                              </Text>
                              <Text style={styles.suggestionNote}>(to reduce closing costs)</Text>
                            </View>
                          )}

                          {currentResult.cashToClose.remainingDeficiency > 0 && (
                            <View style={styles.deficiencyBox}>
                              <Text style={styles.deficiencyLabel}>
                                Additional Funds Still Needed:
                              </Text>
                              <Text style={styles.deficiencyValue}>
                                {formatCurrency(currentResult.cashToClose.remainingDeficiency)}
                              </Text>
                            </View>
                          )}
                        </View>
                      ) : (
                        <View style={styles.sufficientBox}>
                          <CheckCircle size={16} color="#059669" />
                          <Text style={styles.sufficientText}>
                            Sufficient funds available for closing
                          </Text>
                        </View>
                      )}

                      <View style={styles.noteBox}>
                        <Info size={14} color="#2563EB" />
                        <Text style={styles.noteText}>
                          Seller can contribute to buyer's closing costs.
                          {currentResult.loanProgram.name === 'FHA'
                            ? ' FHA allows up to 6% of purchase price.'
                            : ' Conventional loans typically allow 3-6% of purchase price.'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.noQualifySection}>
                  <XCircle size={48} color="#DC2626" />
                  <Text style={styles.noQualifyTitle}>Does Not Qualify</Text>
                  <Text style={styles.noQualifyText}>
                    Client does not meet the debt-to-income requirements for this loan type
                  </Text>

                  {/* Show the ratios even when not qualifying */}
                  <View style={styles.ratioContainerNoQualify}>
                    <View style={styles.ratioItemNoQualify}>
                      <Text style={styles.ratioLabelNoQualify}>Housing Ratio</Text>
                      <Text style={styles.ratioValueNoQualify}>
                        {formatPercentage(currentResult.housingRatioUsed)} /{' '}
                        {currentResult.loanProgram.housingRatio}%
                      </Text>
                    </View>
                    <View style={styles.ratioItemNoQualify}>
                      <Text style={styles.ratioLabelNoQualify}>Total Debt Ratio</Text>
                      <Text style={styles.ratioValueNoQualify}>
                        {formatPercentage(currentResult.totalRatioUsed)} /{' '}
                        {currentResult.loanProgram.totalRatio}%
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </Card>
          </View>
        </View>
        <ToolDisclaimer
          containerStyles={{
            marginHorizontal: 16,
          }}
          value={toolsDisclaimers.preQualificationCalculator}
        />
      </ScrollView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  tabContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  loanCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeaderSection: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  loanTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  loanDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  cardContent: {
    padding: 20,
  },
  amountSection: {
    marginBottom: 24,
  },
  amountItem: {
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  amountValuePrimary: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2563EB',
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  insufficientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  insufficientText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
  },
  breakdownBox: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#374151',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  breakdownLabelBold: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E40AF',
  },
  breakdownValueBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
  },
  ratioContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  ratioCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ratioLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  ratioValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  ratioActual: {
    fontSize: 20,
    fontWeight: '700',
  },
  ratioLimit: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  warningText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '600',
  },
  cashBox: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  cashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  cashLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  cashValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  cashLabelBold: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  cashValueBold: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  shortfallBox: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  shortfallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  shortfallTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  shortfallAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 12,
  },
  suggestionBox: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  suggestionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  suggestionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginVertical: 4,
  },
  suggestionNote: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  deficiencyBox: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 6,
  },
  deficiencyLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C2D12',
  },
  deficiencyValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 4,
  },
  sufficientBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  sufficientText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
    flex: 1,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 18,
  },
  noQualifySection: {
    padding: 40,
    alignItems: 'center',
  },
  noQualifyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 16,
    marginBottom: 8,
  },
  noQualifyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  ratioContainerNoQualify: {
    width: '100%',
    gap: 12,
  },
  ratioItemNoQualify: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  ratioLabelNoQualify: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratioValueNoQualify: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
});
