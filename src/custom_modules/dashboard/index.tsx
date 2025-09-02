import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { TaskMetricsStats } from './widgets/metricsStats';
import { TodayTasks } from '../task/widgets/todayTasks';
import { theme } from '~/theme/theme';
import { ProfileCompletionWidget } from './widgets/setupStatusGraph';
import { InfoWidget } from './widgets/rentApplication';

export const Dashboard: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileCompletionWidget completedSteps={2} totalSteps={10} />
        <TaskMetricsStats />
        <InfoWidget
          title="Rent Application"
          description="Submit your rental application quickly and securely."
          imageSource={require('../../assets/rentApplication.png')}
          backgroundColor="#f5f7ff"
        />
        <TodayTasks />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bodyBackground,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
