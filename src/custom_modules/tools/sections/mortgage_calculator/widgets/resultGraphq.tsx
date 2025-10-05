import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Text from '~/codidge_components/UI/text';

interface MortgageSegment {
  label: string;
  amount: number;
  color: string;
}

interface MortgageBreakdownChartProps {
  principalAndInterest: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
  hoaFees: number;
  size?: number;
  strokeWidth?: number;
  showLegend?: boolean;
  style?: ViewStyle;
}

export const MortgageBreakdownChart: React.FC<MortgageBreakdownChartProps> = ({
  principalAndInterest,
  propertyTax,
  homeInsurance,
  pmi,
  hoaFees,
  size = 200,
  strokeWidth = 30,
  showLegend = true,
  style,
}) => {
  // Define segments with colors
  const segments: MortgageSegment[] = [
    { label: 'Principal & Interest', amount: principalAndInterest, color: '#2563EB' },
    { label: 'Property Tax', amount: propertyTax, color: '#10B981' },
    { label: 'Home Insurance', amount: homeInsurance, color: '#F59E0B' },
    { label: 'PMI', amount: pmi, color: '#EF4444' },
    { label: 'HOA Fees', amount: hoaFees, color: '#8B5CF6' },
  ].filter((segment) => segment.amount > 0); // Only show segments with value

  // Calculate total
  const total = segments.reduce((sum, segment) => sum + segment.amount, 0);

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate segments for the donut chart
  let currentOffset = 0;
  const chartSegments = segments.map((segment) => {
    const percentage = segment.amount / total;
    const segmentLength = circumference * percentage;
    const offset = currentOffset;
    currentOffset += segmentLength;

    return {
      ...segment,
      percentage,
      strokeDasharray: `${segmentLength} ${circumference - segmentLength}`,
      strokeDashoffset: -offset,
    };
  });

  return (
    <View style={[styles.container, style]}>
      {/* Donut Chart */}
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          <G rotation={-90} origin={`${center}, ${center}`}>
            {chartSegments.map((segment, index) => (
              <Circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={segment.strokeDasharray}
                strokeDashoffset={segment.strokeDashoffset}
                strokeLinecap="round"
              />
            ))}
          </G>
        </Svg>

        {/* Center Content - Total Payment */}
        <View style={styles.centerContent}>
          <Text style={styles.centerLabel}>Monthly Payment</Text>
          <Text style={styles.centerAmount}>
            ${total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </Text>
        </View>
      </View>

      {/* Legend */}
      {showLegend && (
        <View style={styles.legend}>
          {chartSegments.map((segment, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: segment.color }]} />
              <View style={styles.legendText}>
                <Text style={styles.legendLabel}>{segment.label}</Text>
                <Text style={styles.legendAmount}>
                  $
                  {segment.amount.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                  <Text style={styles.legendPercentage}>
                    {' '}
                    ({(segment.percentage * 100).toFixed(1)}%)
                  </Text>
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  centerAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  legend: {
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 2,
  },
  legendAmount: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
  },
  legendPercentage: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
  },
});
