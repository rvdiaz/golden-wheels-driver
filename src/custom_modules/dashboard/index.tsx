import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { IMetric, TaskMetricsStats } from './widgets/metricsStats';
import { TodayTasks } from '../task/widgets/todayTasks';
import { theme } from '~/theme/theme';
import { ProfileCompletionWidget } from './widgets/setupStatusGraph';
import * as Icons from 'lucide-react-native';
import { InfoWidget } from './widgets/rentApplication';

const metricsData: IMetric[] = [
  {
    label: "Today's Tasks",
    value: '25',
    subLabel: 'On Track',
    iconName: <Icons.Goal color="#166534" size={20} />,
    iconBackgroundColor: '#86EFAC',
    cardBackgroundColor: '#F0FDF4',
  },
  {
    label: 'Contacts',
    value: '+18',
    subLabel: 'Follow-Ups',
    iconName: <Icons.ContactRound color="#B45309" size={20} />,
    iconBackgroundColor: '#FED7AA',
    cardBackgroundColor: '#FFF7ED',
    subLabelColor: '#B45309',
  },
];

export const Dashboard: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileCompletionWidget completedSteps={2} totalSteps={10} />
        {}
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
