import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import * as Icons from 'lucide-react-native';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { ToolDisclaimer } from '~/custom_modules/tools/components/toolsDisclaimer';
import { toolsDisclaimers } from '~/custom_modules/tools/data';
import { ClosingCostResult } from '../interfaces';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { Header } from '~/codidge_components/UI/header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export const EstimatedClosingCostResults = ({
  result,
  onBack,
}: {
  result: ClosingCostResult;
  onBack: () => void;
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PageSafeContainer>
      <Header onBack={onBack} showBack={true} title="Results" />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 0 : 80}
        keyboardShouldPersistTaps="handled">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Summary Cards */}
          <View style={styles.summaryCardsContainer}>
            <View style={[styles.summaryCard, styles.purchasePriceCard]}>
              <View style={styles.summaryCardContent}>
                <Text style={styles.summaryLabel}>Purchase Price</Text>
                <Text style={styles.summaryAmount}>{formatCurrency(result.purchasePrice)}</Text>
              </View>
              <Icons.Home size={28} color="#2563EB" />
            </View>

            <View style={[styles.summaryCard, styles.downPaymentCard]}>
              <View style={styles.summaryCardContent}>
                <Text style={styles.summaryLabel}>Down Payment</Text>
                <Text style={styles.summaryAmount}>{formatCurrency(result.downPaymentAmount)}</Text>
                <Text style={styles.summarySubtext}>
                  {((result.downPaymentAmount / result.purchasePrice) * 100).toFixed(1)}% of price
                </Text>
              </View>
              <Icons.DollarSign size={28} color="#10B981" />
            </View>

            <View style={[styles.summaryCard, styles.loanAmountCard]}>
              <View style={styles.summaryCardContent}>
                <Text style={styles.summaryLabel}>Loan Amount</Text>
                <Text style={styles.summaryAmount}>{formatCurrency(result.loanAmount)}</Text>
              </View>
              <Icons.Calculator size={28} color="#F97316" />
            </View>

            <View style={[styles.summaryCard, styles.closingCostsCard]}>
              <View style={styles.summaryCardContent}>
                <Text style={styles.summaryLabel}>Total Closing Costs</Text>
                <Text style={styles.summaryAmount}>{formatCurrency(result.totalClosingCosts)}</Text>
                <Text style={styles.summarySubtext}>
                  {((result.totalClosingCosts / result.purchasePrice) * 100).toFixed(1)}% of price
                </Text>
              </View>
              <Icons.CheckCircle size={28} color="#8B5CF6" />
            </View>
          </View>

          {/* Total Cash Needed */}
          <View style={styles.totalCashCard}>
            <View style={styles.totalCashContent}>
              <Text style={styles.totalCashLabel}>Total Cash Needed to Close</Text>
              <Text style={styles.totalCashAmount}>{formatCurrency(result.totalCashNeeded)}</Text>
              <Text style={styles.totalCashSubtext}>Down payment + closing costs</Text>
            </View>
            <Icons.DollarSignIcon size={36} color="#10B981" />
          </View>

          {/* Cost Breakdown */}
          <View style={styles.breakdownSection}>
            <View style={styles.breakdownHeader}>
              <Text style={styles.breakdownTitle}>Cost Breakdown</Text>
              <View style={styles.editBadge}>
                <Text style={styles.editBadgeText}>Tap amounts to edit</Text>
              </View>
            </View>

            {result.breakdown.map((item, index) => (
              <View key={index} style={styles.breakdownItem}>
                <View style={styles.breakdownItemInfo}>
                  <Text style={styles.breakdownCategory}>{item.category}</Text>
                  <Text style={styles.breakdownDescription}>{item.description}</Text>
                </View>
                <View style={styles.breakdownItemRight}>
                  {item.percentage !== undefined && (
                    <View style={styles.percentageBadge}>
                      <Text style={styles.percentageBadgeText}>{item.percentage}%</Text>
                    </View>
                  )}
                  {editingIndex === index ? (
                    <InputField
                      containerStyle={{
                        backgroundColor: '#FFF',
                        marginBottom: 0,
                      }}
                      value={String(item.amount)}
                      onChangeText={(text) => {}}
                      onBlur={() => setEditingIndex(null)}
                      keyboardType="decimal-pad"
                      autoFocus
                    />
                  ) : (
                    <TouchableOpacity
                      style={styles.breakdownAmount}
                      onPress={() => setEditingIndex(index)}>
                      <Text style={styles.breakdownAmountText}>{formatCurrency(item.amount)}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Bottom Total Cash Needed */}
          <View style={styles.totalCashCard}>
            <View style={styles.totalCashContent}>
              <Text style={styles.totalCashLabel}>Total Cash Needed to Close</Text>
              <Text style={styles.totalCashAmount}>{formatCurrency(result.totalCashNeeded)}</Text>
              <Text style={styles.totalCashSubtext}>Down payment + closing costs</Text>
            </View>
            <Icons.DollarSign size={36} color="#10B981" />
          </View>
          <ToolDisclaimer
            containerStyles={{
              marginHorizontal: 16,
            }}
            value={toolsDisclaimers.closingCostCalculator}
          />
        </ScrollView>
      </KeyboardAwareScrollView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  summaryCardsContainer: {
    padding: 16,
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  purchasePriceCard: {
    backgroundColor: '#DBEAFE',
    borderColor: '#93C5FD',
  },
  downPaymentCard: {
    backgroundColor: '#D1FAE5',
    borderColor: '#6EE7B7',
  },
  loanAmountCard: {
    backgroundColor: '#FED7AA',
    borderColor: '#FDBA74',
  },
  summaryCardContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
  },
  summarySubtext: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  totalCashCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  closingCostsCard: {
    backgroundColor: '#E9D5FF',
    borderColor: '#C084FC',
  },
  totalCashContent: {
    flex: 1,
  },
  totalCashLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  totalCashAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 6,
  },
  totalCashSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  breakdownSection: {
    backgroundColor: 'white',
    marginTop: 12,
    padding: 16,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  editBadge: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  editBadgeText: {
    fontSize: 11,
    color: '#6B7280',
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  breakdownItemInfo: {
    flex: 1,
  },
  breakdownCategory: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  breakdownDescription: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  breakdownItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageBadge: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  editingInput: {
    width: 100,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    backgroundColor: 'white',
  },
  percentageBadgeText: {
    fontSize: 11,
    color: '#6B7280',
  },
  breakdownAmount: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  breakdownAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});
