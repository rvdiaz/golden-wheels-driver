import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import Text from '~/codidge_components/UI/text';
import { formatCurrency } from '../../helpers';
import { CalculationResults } from '../../interfaces';

export const FutureProjections = ({ results }: { results: CalculationResults }) => {
  return (
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
                  {formatCurrency(results?.projections.year3.rent)}
                </Text>
              </View>
              <View style={styles.projectionMetric}>
                <Text style={styles.projectionLabel}>Property Value:</Text>
                <Text style={styles.projectionValue}>
                  {formatCurrency(results?.projections.year3.propertyValue)}
                </Text>
              </View>
              <View style={styles.projectionMetric}>
                <Text style={styles.projectionLabel}>Annual Cash Flow:</Text>
                <Text style={styles.projectionValue}>
                  {formatCurrency(results?.projections.year3.cashFlow)}
                </Text>
              </View>
              <View style={styles.projectionMetric}>
                <Text style={styles.projectionLabel}>Net Equity:</Text>
                <Text style={styles.projectionValue}>
                  {formatCurrency(results?.projections.year3.equity)}
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
                  {formatCurrency(results?.projections.year5.rent)}
                </Text>
              </View>
              <View style={styles.projectionMetric}>
                <Text style={styles.projectionLabel}>Property Value:</Text>
                <Text style={styles.projectionValue}>
                  {formatCurrency(results?.projections.year5.propertyValue)}
                </Text>
              </View>
              <View style={styles.projectionMetric}>
                <Text style={styles.projectionLabel}>Annual Cash Flow:</Text>
                <Text style={styles.projectionValue}>
                  {formatCurrency(results?.projections.year5.cashFlow)}
                </Text>
              </View>
              <View style={styles.projectionMetric}>
                <Text style={styles.projectionLabel}>Net Equity:</Text>
                <Text style={styles.projectionValue}>
                  {formatCurrency(results?.projections.year5.equity)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
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
