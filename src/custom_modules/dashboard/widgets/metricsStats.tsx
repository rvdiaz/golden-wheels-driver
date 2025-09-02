import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { theme } from '~/theme/theme';
import { HighPriorityTaskMetric } from '~/custom_modules/task/widgets/highPriorityTaskMetric';
import { FollowUpMetric } from '~/custom_modules/crm/widgets/followUpMetric';

const screenWidth = Dimensions.get('window').width;

export interface IMetric {
  label: string;
  value: string;
  subLabel: string;
  iconName: ReactNode;
  iconColor?: string;
  iconBackgroundColor?: string;
  cardBackgroundColor?: string;
  valueColor?: string;
  subLabelColor?: string;
  labelColor?: string;
  width?: number;
}

export const TaskMetricsCard = ({
  label,
  value,
  subLabel,
  iconName,
  iconBackgroundColor = '#86EFAC',
  cardBackgroundColor = '#F0FDF4',
  valueColor = '#0A0A0A',
  subLabelColor = '#166534',
  labelColor = '#0A0A0A',
  width = (screenWidth - 48) / 2,
}: IMetric) => {
  return (
    <View
      style={[
        styles.metricCard,
        {
          backgroundColor: cardBackgroundColor,
          width: width,
        },
      ]}>
      <View style={styles.metricContent}>
        <View style={styles.metricInfo}>
          <Text style={[styles.metricLabel, { color: labelColor }]}>{label}</Text>
          <View style={styles.metricFooter}>
            <Text style={[styles.metricValue, { color: valueColor }]}>{value}</Text>
            <Text style={[styles.metricSubLabel, { color: subLabelColor }]}>{subLabel}</Text>
          </View>
        </View>
        <View style={[styles.metricIcon, { backgroundColor: iconBackgroundColor }]}>
          {iconName}
        </View>
      </View>
    </View>
  );
};

// Container component for multiple metrics
export const TaskMetricsStats = () => {
  const metricWidgets = [<HighPriorityTaskMetric />, <FollowUpMetric />];

  return <View style={styles.metricsGrid}>{metricWidgets}</View>;
};

const styles = StyleSheet.create({
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  metricCard: {
    marginHorizontal: 8,
    marginBottom: 16,
    borderRadius: theme.borderRadius.lg,
    padding: 14,
  },
  metricContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metricInfo: {
    flex: 1,
  },
  metricFooter: {
    flexDirection: 'row',
    marginTop: 22,
    alignItems: 'center',
    gap: 5,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  metricSubLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
