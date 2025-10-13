import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { TaskMetricsStats } from './widgets/metricsStats';
import { TodayTasks } from '../task/widgets/todayTasks';
import { theme } from '~/theme/theme';
import { ProfileCompletionWidget } from './widgets/setupStatusGraph';
import { RentAppShortcut } from '../tools/sections/transunion_rent_applications/widgets/rent_app_shortcut';

export const Dashboard: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileCompletionWidget />
        <RentAppShortcut />
        <TaskMetricsStats />
        <TodayTasks />
      </ScrollView>
    </View>
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
