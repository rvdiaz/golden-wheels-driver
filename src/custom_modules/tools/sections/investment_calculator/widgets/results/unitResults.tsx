import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import Text from '~/codidge_components/UI/text';
import { UnitData } from '../../interfaces';

interface UnitsCarouselProps {
  units: UnitData[];
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
}

export const UnitsCarousel: React.FC<UnitsCarouselProps> = ({
  units,
  formatCurrency,
  formatPercentage,
}) => {
  if (!units || units.length === 0) {
    return null;
  }

  return (
    <View style={styles.unitsSection}>
      <Text style={styles.unitsSectionTitle}>Unit-by-Unit Analysis</Text>
      <Text style={styles.unitsSectionSubtitle}>
        {units.length} {units.length === 1 ? 'Unit' : 'Units'}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.unitsCarousel}
        snapToInterval={280}
        decelerationRate="fast"
        snapToAlignment="start">
        {units.map((unit) => {
          const monthlyIncrease = unit.potentialRent - unit.currentRent;
          const annualIncrease = monthlyIncrease * 12;
          const roi = unit.repairCosts > 0 ? annualIncrease / unit.repairCosts : 0;

          return (
            <Card key={unit.id} style={styles.unitCard}>
              <View style={styles.unitCardHeader}>
                <Text style={styles.unitNumber}>Unit #{unit.id}</Text>
                {unit.bedrooms !== undefined && unit.bathrooms !== undefined && (
                  <Text style={styles.unitSpecs}>
                    {unit.bedrooms} bed • {unit.bathrooms} bath
                  </Text>
                )}
              </View>

              <View style={styles.unitCardContent}>
                {/* Current vs Potential Rent */}
                <View style={styles.unitMetricGroup}>
                  <Text style={styles.unitMetricGroupTitle}>Rental Income</Text>
                  <View style={styles.unitRentComparison}>
                    <View style={styles.unitRentItem}>
                      <Text style={styles.unitRentLabel}>Current</Text>
                      <Text style={styles.unitCurrentRent}>{formatCurrency(unit.currentRent)}</Text>
                      <Text style={styles.unitRentPeriod}>/month</Text>
                    </View>
                    <View style={styles.unitRentArrow}>
                      <Text style={styles.unitRentArrowText}>→</Text>
                    </View>
                    <View style={styles.unitRentItem}>
                      <Text style={styles.unitRentLabel}>Potential</Text>
                      <Text style={styles.unitPotentialRent}>
                        {formatCurrency(unit.potentialRent)}
                      </Text>
                      <Text style={styles.unitRentPeriod}>/month</Text>
                    </View>
                  </View>

                  {/* Income Increase */}
                  {monthlyIncrease > 0 && (
                    <View style={styles.unitIncreaseContainer}>
                      <Text style={styles.unitIncreaseLabel}>Monthly Increase:</Text>
                      <Text style={styles.unitIncreaseValue}>
                        +{formatCurrency(monthlyIncrease)}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.unitDivider} />

                {/* Repair Costs */}
                <View style={styles.unitMetricRow}>
                  <Text style={styles.unitMetricLabel}>Repair Investment</Text>
                  <Text style={styles.unitRepairCost}>{formatCurrency(unit.repairCosts)}</Text>
                </View>

                {/* Market Value */}
                <View style={styles.unitMetricRow}>
                  <Text style={styles.unitMetricLabel}>Market Value</Text>
                  <Text style={styles.unitMarketValue}>{formatCurrency(unit.marketValue)}</Text>
                </View>

                {/* ROI Indicator */}
                {unit.repairCosts > 0 && (
                  <View style={styles.unitRoiContainer}>
                    <Text style={styles.unitRoiLabel}>Annual ROI:</Text>
                    <Text
                      style={[
                        styles.unitRoiValue,
                        roi > 0.15 ? styles.unitRoiGood : styles.unitRoiFair,
                      ]}>
                      {formatPercentage(roi)}
                    </Text>
                  </View>
                )}
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  unitsSection: {
    marginBottom: 16,
  },
  unitsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  unitsSectionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  unitsCarousel: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 12,
  },
  unitCard: {
    width: 268,
    borderRadius: 12,
    padding: 16,
  },
  unitCardHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  unitNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  unitSpecs: {
    fontSize: 12,
    color: '#6b7280',
  },
  unitCardContent: {
    gap: 12,
  },
  unitMetricGroup: {
    gap: 8,
  },
  unitMetricGroupTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  unitRentComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  unitRentItem: {
    alignItems: 'center',
    flex: 1,
  },
  unitRentLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
  },
  unitCurrentRent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#d97706',
  },
  unitPotentialRent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  unitRentPeriod: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  unitRentArrow: {
    paddingHorizontal: 8,
  },
  unitRentArrowText: {
    fontSize: 20,
    color: '#3b82f6',
    fontWeight: '600',
  },
  unitIncreaseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    padding: 8,
    borderRadius: 6,
  },
  unitIncreaseLabel: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '500',
  },
  unitIncreaseValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16a34a',
  },
  unitDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  unitMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitMetricLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  unitRepairCost: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
  unitMarketValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  unitRoiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  unitRoiLabel: {
    fontSize: 11,
    color: '#1e40af',
    fontWeight: '500',
  },
  unitRoiValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  unitRoiGood: {
    color: '#16a34a',
  },
  unitRoiFair: {
    color: '#d97706',
  },
});
