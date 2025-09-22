// components/results/ResultsDisplay.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFormatters, useInvestmentForm } from '../custom_hooks';
import { CalculationResults } from '../interfaces';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import { Building, DollarSign, Edit, RotateCcw, Target, TrendingUp } from 'lucide-react-native';
import { Card } from '~/codidge_components/UI/card';
import { TargetAnalysis } from './targetAnalysis';

interface ResultsDisplayProps {
  results: CalculationResults;
  onEditInputs: () => void;
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  onEditInputs,
  onReset,
}) => {
  const { formatCurrency, formatPercentage } = useFormatters();

  const { targetResults, showTargetAnalysis, setShowTargetAnalysis, calculateTarget } =
    useInvestmentForm();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Investment Analysis Results</Text>
        <View style={styles.buttonGroup}>
          <OutlineButton
            onPress={onEditInputs}
            style={styles.headerButton}
            title="Edit Inputs"
            rightWidget={<Edit size={16} color="#3b82f6" />}
          />
          <OutlineButton
            onPress={onReset}
            style={styles.headerButton}
            title="New Analysis"
            rightWidget={<RotateCcw size={16} color="#3b82f6" />}
          />
        </View>
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
              <Text style={styles.currentValue}>{formatPercentage(results.currentCapRate)}</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Annual Income:</Text>
              <Text style={styles.metricValue}>
                {formatCurrency(results.totalIncome - results.totalIncomeIncrease)}
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
              <Text style={styles.improvedValue}>{formatPercentage(results.improvedCapRate)}</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Annual Income:</Text>
              <Text style={styles.metricValue}>{formatCurrency(results.totalIncome)}</Text>
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
              <Text style={styles.valueGainValue}>{formatCurrency(results.totalRepairCosts)}</Text>
            </View>
            <View style={styles.valueGainItem}>
              <Text style={styles.valueGainLabel}>Annual Income Increase</Text>
              <Text style={styles.valueGainValue}>
                {formatCurrency(results.totalIncomeIncrease)}
              </Text>
            </View>
            <View style={styles.valueGainItem}>
              <Text style={styles.valueGainLabel}>Estimated Value Gain</Text>
              <Text style={styles.valueGainValue}>{formatCurrency(results.valueGain)}</Text>
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
            <Text style={styles.metricMainValue}>{formatPercentage(results.cashOnCashReturn)}</Text>
            <Text style={styles.metricSubtext}>Annual return on cash invested</Text>
          </View>
        </Card>

        <Card style={styles.metricCard}>
          <View style={styles.metricContent}>
            <View style={styles.metricIconContainer}>
              <DollarSign size={20} color="#7c3aed" />
              <Text style={styles.metricTitle}>Annual Cash Flow</Text>
            </View>
            <Text style={styles.metricMainValue}>{formatCurrency(results.annualCashFlow)}</Text>
            <Text style={styles.metricSubtext}>
              {formatCurrency(results.annualCashFlow / 12)}/month
            </Text>
          </View>
        </Card>

        <Card style={styles.metricCard}>
          <View style={styles.metricContent}>
            <View style={styles.metricIconContainer}>
              <Target size={20} color="#16a34a" />
              <Text style={styles.metricTitle}>Net Operating Income</Text>
            </View>
            <Text style={styles.metricMainValue}>{formatCurrency(results.netOperatingIncome)}</Text>
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
              {results.debtServiceCoverageRatio.toFixed(2)}x
            </Text>
            <Text style={styles.metricSubtext}>
              {results.debtServiceCoverageRatio >= 1.25
                ? 'Strong Coverage'
                : results.debtServiceCoverageRatio >= 1.0
                  ? 'Adequate Coverage'
                  : 'Insufficient Coverage'}
            </Text>
          </View>
        </Card>
      </View>

      {/* Future Projections */}
      <Card style={styles.projectionsCard}>
        <View>
          <Text style={styles.projectionsTitle}>Future Projections</Text>
          <Text style={styles.projectionsSubtitle}>
            Based on 5% annual rent growth and 3% property appreciation
          </Text>
        </View>
        <View style={styles.projectionsContent}>
          <View style={styles.projectionsGrid}>
            {/* 3-Year Projection */}
            <View style={styles.projectionSection}>
              <Text style={styles.projectionTitle}>3-Year Projection</Text>
              <View style={styles.projectionMetrics}>
                <View style={styles.projectionMetric}>
                  <Text style={styles.projectionLabel}>Annual Rental Income:</Text>
                  <Text style={styles.projectionValue}>
                    {formatCurrency(results.projections.year3.rent)}
                  </Text>
                </View>
                <View style={styles.projectionMetric}>
                  <Text style={styles.projectionLabel}>Property Value:</Text>
                  <Text style={styles.projectionValue}>
                    {formatCurrency(results.projections.year3.propertyValue)}
                  </Text>
                </View>
                <View style={styles.projectionMetric}>
                  <Text style={styles.projectionLabel}>Annual Cash Flow:</Text>
                  <Text style={styles.projectionValue}>
                    {formatCurrency(results.projections.year3.cashFlow)}
                  </Text>
                </View>
                <View style={styles.projectionMetric}>
                  <Text style={styles.projectionLabel}>Net Equity:</Text>
                  <Text style={styles.projectionValue}>
                    {formatCurrency(results.projections.year3.equity)}
                  </Text>
                </View>
              </View>
            </View>

            {/* 5-Year Projection */}
            <View style={styles.projectionSection}>
              <Text style={styles.projectionTitle}>5-Year Projection</Text>
              <View style={styles.projectionMetrics}>
                <View style={styles.projectionMetric}>
                  <Text style={styles.projectionLabel}>Annual Rental Income:</Text>
                  <Text style={styles.projectionValue}>
                    {formatCurrency(results.projections.year5.rent)}
                  </Text>
                </View>
                <View style={styles.projectionMetric}>
                  <Text style={styles.projectionLabel}>Property Value:</Text>
                  <Text style={styles.projectionValue}>
                    {formatCurrency(results.projections.year5.propertyValue)}
                  </Text>
                </View>
                <View style={styles.projectionMetric}>
                  <Text style={styles.projectionLabel}>Annual Cash Flow:</Text>
                  <Text style={styles.projectionValue}>
                    {formatCurrency(results.projections.year5.cashFlow)}
                  </Text>
                </View>
                <View style={styles.projectionMetric}>
                  <Text style={styles.projectionLabel}>Net Equity:</Text>
                  <Text style={styles.projectionValue}>
                    {formatCurrency(results.projections.year5.equity)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Card>

      {/* Target Analisyts */}
      <TargetAnalysis
        onCalculateTarget={calculateTarget}
        targetResults={targetResults}
        showTargetAnalysis={showTargetAnalysis}
        onToggleTargetAnalysis={setShowTargetAnalysis}
      />
    </ScrollView>
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
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    marginTop: 10,
  },
  headerButton: {
    flex: 1,
  },
  buttonText: {
    fontSize: 14,
    color: '#3b82f6',
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
  projectionsCard: {
    marginBottom: 16,
    padding: 12,
  },
  projectionsTitle: {
    color: '#4338ca',
    fontSize: 16,
  },
  projectionsSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  projectionsContent: {
    paddingTop: 12,
  },
  projectionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  projectionSection: {
    flex: 1,
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  projectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0c4a6e',
    marginBottom: 12,
  },
  projectionMetrics: {
    gap: 8,
  },
  projectionMetric: {
    justifyContent: 'space-between',
    gap: 5,
  },
  projectionLabel: {
    fontSize: 12,
    color: '#0369a1',
  },
  projectionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0c4a6e',
  },
});
