import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HighPriorityTaskMetric } from '~/custom_modules/task/widgets/highPriorityTaskMetric';
import { FollowUpMetric } from '~/custom_modules/crm/widgets/followUps/followUpMetric';

// Container component for multiple metrics
export const TaskMetricsStats = () => {
  const metricWidgets = [<HighPriorityTaskMetric />, <FollowUpMetric />];

  return (
    <View style={styles.metricsGrid}>
      {metricWidgets.map((wid, index) => (
        <View key={index}>{wid}</View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
});
