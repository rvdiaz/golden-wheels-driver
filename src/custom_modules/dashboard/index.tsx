import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { TaskList } from '../task/widgets/taskList';
import { TaskMetricsStats } from './widgets/metricsStats';
import { QuoteWidget } from './widgets/quoteHeader';
import { TodayTasks } from '../task/widgets/todayTasks';
import { theme } from '~/theme/theme';
import { ProfileCompletionWidget } from './widgets/setupStatusGraph';

export const Dashboard: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileCompletionWidget completedSteps={2} totalSteps={10} />
        <TaskMetricsStats completedTasks={[]} />
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
    padding: 16,
  },
});
