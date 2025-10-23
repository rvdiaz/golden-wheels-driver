import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useFormatters } from '../../custom_hooks';
import { CalculationResults } from '../../interfaces';
import { Building, DollarSign, Target, TrendingUp } from 'lucide-react-native';
import { Card } from '~/codidge_components/UI/card';
import { TargetAnalysis } from './targetAnalysis';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';
import Text from '~/codidge_components/UI/text';
import { UnitsCarousel } from './unitResults';
import { FutureProjections } from './futureProjections';

interface ResultsDisplayProps {
  results: CalculationResults;
  onDispose: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onDispose }) => {
  const { formatCurrency, formatPercentage } = useFormatters();

  const units = results.units;

  return (
    <PageSafeContainer>
      <Header
        title="Results"
        showBack={true}
        onBack={() => {
          onDispose();
        }}
      />
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Investment Analysis Results</Text>
        </View>

        {/* Current vs Improved Comparison */}
        <View style={styles.comparisonGrid}>
          <Card style={[styles.comparisonCard, styles.currentCard]}>
            <View style={styles.comparisonHeader}>
              <Text style={styles.currentTitle}>Current Performance</Text>
            </View>
            <View style={styles.comparisonContent}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Cap Rate:</Text>
                <Text style={styles.currentValue}>{formatPercentage(results?.currentCapRate)}</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Annual Income:</Text>
                <Text style={styles.metricValue}>
                  {formatCurrency(results?.totalIncome - results?.totalIncomeIncrease)}
                </Text>
              </View>
            </View>
          </Card>

          <Card style={[styles.comparisonCard, styles.improvedCard]}>
            <View style={styles.comparisonHeader}>
              <Text style={styles.improvedTitle}>After Improvements</Text>
            </View>
            <View style={styles.comparisonContent}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Cap Rate:</Text>
                <Text style={styles.improvedValue}>
                  {formatPercentage(results?.improvedCapRate)}
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Annual Income:</Text>
                <Text style={styles.metricValue}>{formatCurrency(results?.totalIncome)}</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Value Gain Analysis */}
        <Card style={styles.valueGainCard}>
          <View>
            <Text style={styles.valueGainTitle}>Investment Analysis Summary</Text>
          </View>
          <View style={styles.valueGainContent}>
            <View style={styles.valueGainGrid}>
              <View style={styles.valueGainItem}>
                <Text style={styles.valueGainLabel}>Total Repair Investment</Text>
                <Text style={styles.valueGainValue}>
                  {formatCurrency(results?.totalRepairCosts)}
                </Text>
              </View>
              <View style={styles.valueGainItem}>
                <Text style={styles.valueGainLabel}>Annual Income Increase</Text>
                <Text style={styles.valueGainValue}>
                  {formatCurrency(results?.totalIncomeIncrease)}
                </Text>
              </View>
              <View style={styles.valueGainItem}>
                <Text style={styles.valueGainLabel}>Estimated Value Gain</Text>
                <Text style={styles.valueGainValue}>{formatCurrency(results?.valueGain)}</Text>
              </View>
            </View>
            <Text style={styles.valueGainSubtext}>
              *Property value increase based on improved income
            </Text>
          </View>
        </Card>

        {/* Performance Metrics */}
        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <View style={styles.metricContent}>
              <View style={styles.metricIconContainer}>
                <TrendingUp size={20} color="#2563eb" />
                <Text style={styles.metricTitle}>Cash-on-Cash Return</Text>
              </View>
              <Text style={styles.metricMainValue}>
                {formatPercentage(results?.cashOnCashReturn)}
              </Text>
              <Text style={styles.metricSubtext}>Annual return on cash invested</Text>
            </View>
          </Card>

          <Card style={styles.metricCard}>
            <View style={styles.metricContent}>
              <View style={styles.metricIconContainer}>
                <DollarSign size={20} color="#7c3aed" />
                <Text style={styles.metricTitle}>Annual Cash Flow</Text>
              </View>
              <Text style={styles.metricMainValue}>{formatCurrency(results?.annualCashFlow)}</Text>
              <Text style={styles.metricSubtext}>
                {formatCurrency(results?.annualCashFlow / 12)}/month
              </Text>
            </View>
          </Card>

          <Card style={styles.metricCard}>
            <View style={styles.metricContent}>
              <View style={styles.metricIconContainer}>
                <Target size={20} color="#16a34a" />
                <Text style={styles.metricTitle}>Net Operating Income</Text>
              </View>
              <Text style={styles.metricMainValue}>
                {formatCurrency(results?.netOperatingIncome)}
              </Text>
              <Text style={styles.metricSubtext}>After all operating expenses</Text>
            </View>
          </Card>

          <Card style={styles.metricCard}>
            <View style={styles.metricContent}>
              <View style={styles.metricIconContainer}>
                <Building size={20} color="#ea580c" />
                <Text style={styles.metricTitle}>Debt Service Coverage</Text>
              </View>
              <Text style={styles.metricMainValue}>
                {results?.debtServiceCoverageRatio.toFixed(2)}x
              </Text>
              <Text style={styles.metricSubtext}>
                {results?.debtServiceCoverageRatio >= 1.25
                  ? 'Strong Coverage'
                  : results?.debtServiceCoverageRatio >= 1.0
                    ? 'Adequate Coverage'
                    : 'Insufficient Coverage'}
              </Text>
            </View>
          </Card>
        </View>

        {/* Future Projections */}
        <FutureProjections results={results} />
        {/* Units Carousel */}

        <UnitsCarousel
          units={units}
          formatCurrency={formatCurrency}
          formatPercentage={formatPercentage}
        />
        {/* Target Analisyts */}
        <TargetAnalysis results={results} />
      </ScrollView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  comparisonGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  comparisonCard: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 14,
  },
  currentCard: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  improvedCard: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
  },
  comparisonHeader: {
    paddingBottom: 8,
  },
  currentTitle: {
    color: '#92400e',
    fontSize: 14,
  },
  improvedTitle: {
    color: '#166534',
    fontSize: 14,
  },
  comparisonContent: {
    gap: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  currentValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#d97706',
  },
  improvedValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  valueGainCard: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 14,
  },
  valueGainTitle: {
    color: '#1e40af',
    fontSize: 14,
  },
  valueGainContent: {
    paddingTop: 8,
  },
  valueGainGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueGainItem: {
    flex: 1,
    alignItems: 'center',
  },
  valueGainLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1e40af',
    marginBottom: 8,
    textAlign: 'center',
  },
  valueGainValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 4,
  },
  valueGainSubtext: {
    fontSize: 12,
    color: '#2563eb',
    paddingHorizontal: 8,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    paddingHorizontal: 8,
    paddingVertical: 14,
  },
  metricContent: {
    alignItems: 'center',
    gap: 8,
  },
  metricIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  metricMainValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  metricSubtext: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
});
