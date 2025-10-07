import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import Text from '~/codidge_components/UI/text';
import { CalculationResults } from '../../interfaces';
import { useFormatters } from '../../custom_hooks';

interface FinancialBreakdownProps {
  results: CalculationResults;
  otherIncome: number;
  projectedVacancy: number;
  projectedInsurance: number;
  projectedPropertyTaxes: number;
  projectedMaintenance: number;
  projectedManagementPercent: number;
  projectedOtherExpenses: number;
}

export const FinancialBreakdown: React.FC<FinancialBreakdownProps> = ({
  results,
  otherIncome,
  projectedVacancy,
  projectedInsurance,
  projectedPropertyTaxes,
  projectedMaintenance,
  projectedManagementPercent,
  projectedOtherExpenses,
}) => {
  const { formatCurrency } = useFormatters();

  const grossRentalIncome = results.units.reduce(
    (total, unit) => total + unit.potentialRent * 12,
    0
  );

  const annualOtherIncome = otherIncome * 12;
  const totalGrossIncome = grossRentalIncome + annualOtherIncome;
  const vacancyLoss = (totalGrossIncome * projectedVacancy) / 100;

  const annualInsurance = projectedInsurance * 12;
  const annualPropertyTaxes = projectedPropertyTaxes * 12;
  const annualMaintenance = projectedMaintenance * 12;
  const annualOtherExpenses = projectedOtherExpenses * 12;
  const managementFees = (results.totalIncome * projectedManagementPercent) / 100;

  return (
    <View style={styles.container}>
      {/* Income Analysis */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Income Analysis</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text style={styles.label}>Gross Rental Income ({results.units.length} units)</Text>
            <Text style={styles.value}>{formatCurrency(grossRentalIncome)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Other Income</Text>
            <Text style={styles.value}>{formatCurrency(annualOtherIncome)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Vacancy Loss (-{projectedVacancy}%)</Text>
            <Text style={[styles.value, styles.negative]}>-{formatCurrency(vacancyLoss)}</Text>
          </View>

          {/* <Separator style={styles.separator} /> */}

          <View style={styles.row}>
            <Text style={styles.boldLabel}>Effective Gross Income</Text>
            <Text style={[styles.value, styles.boldValue, styles.positive]}>
              {formatCurrency(results.totalIncome)}
            </Text>
          </View>
        </View>
      </Card>

      {/* Expense Analysis */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Expense Analysis</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text style={styles.label}>Insurance</Text>
            <Text style={styles.value}>{formatCurrency(annualInsurance)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Property Taxes</Text>
            <Text style={styles.value}>{formatCurrency(annualPropertyTaxes)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Maintenance & Repairs</Text>
            <Text style={styles.value}>{formatCurrency(annualMaintenance)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Management ({projectedManagementPercent}%)</Text>
            <Text style={styles.value}>{formatCurrency(managementFees)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Other Expenses</Text>
            <Text style={styles.value}>{formatCurrency(annualOtherExpenses)}</Text>
          </View>

          {/*   <Separator style={styles.separator} /> */}

          <View style={styles.row}>
            <Text style={styles.boldLabel}>Total Operating Expenses</Text>
            <Text style={[styles.value, styles.boldValue, styles.negative]}>
              {formatCurrency(results.totalExpenses)}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginBottom: 16,
  },
  card: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardContent: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  boldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  boldValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  positive: {
    color: '#16a34a',
  },
  negative: {
    color: '#dc2626',
  },
  separator: {
    marginVertical: 4,
  },
});
