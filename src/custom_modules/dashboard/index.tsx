import React, { useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { TaskList } from '../task/widgets/taskList';
import { ITask } from '../task/interfaces';
import { ShortCutsButtons } from './widgets/shortCutsButtons';
import { TaskMetricsStats } from './widgets/metricsStats';
import { QuoteWidget } from './widgets/quoteHeader';

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);

  const completedTasks = tasks.filter((task) => task.isCompleted);

  const toggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, completed: !task.isCompleted } : task))
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <QuoteWidget />

        {/*  <ShortCutsButtons /> */}

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
