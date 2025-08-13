import React, { useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { TaskList } from '../task/widgets/taskList';
import { ITask } from '../task/interfaces';
import { HeaderBanner } from './widgets/headerBanner';
import { ShortCutsButtons } from './widgets/shortCutsButtons';
import { WeeklyActivityChart } from './widgets/weekActivity';
import { TaskMetricsStats } from './widgets/metricsStats';
import { QuoteWidget } from './widgets/quoteHeader';
import AllQuotes from './widgets/quoteHeader2';

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([
    {
      id: '1',
      title: 'Morning Social Media Posts',
      description: 'Post 1-2 engaging real estate content pieces',
      dateTime: '8:30 AM',
      category: 'Marketing',
      completed: false,
      color: '#2563EB',
      priority: 'High',
    },
    {
      id: '2',
      title: '50 FSBO Cold Calls',
      description: 'Call 50 For Sale By Owner listings to generate leads',
      dateTime: '9:00 AM',
      category: 'Lead Generation',
      completed: false,
      color: '#DC2626',
      priority: 'Low',
    },
    {
      id: '3',
      title: '50 Expired Listing Calls',
      description: 'Contact expired listings to offer listing services',
      dateTime: '11:00 AM',
      category: 'Lead Generation',
      completed: false,
      color: '#DC2626',
      priority: 'Medium',
    },
    {
      id: '4',
      title: 'Client Follow-up Calls',
      description: 'Follow up with recent clients for referrals',
      dateTime: '2:00 PM',
      category: 'Relationship Building',
      completed: false,
      color: '#059669',
      priority: 'Low',
    },
    {
      id: '5',
      title: 'Social Media Engagement',
      description: 'Like and comment on 25 posts to build relationships',
      dateTime: '3:00 PM',
      category: 'Marketing',
      completed: false,
      color: '#2563EB',
      priority: 'High',
    },
  ]);

  const completedTasks = tasks.filter((task) => task.completed);

  const toggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Banner */}

        <QuoteWidget />

        <ShortCutsButtons />

        <TaskMetricsStats completedTasks={completedTasks} />

        <TaskList tasks={tasks} onToggle={toggleTask} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
