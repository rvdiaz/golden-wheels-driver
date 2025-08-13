import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Icons from 'lucide-react-native';
import { TaskItem } from './widgets/taskItem';
import { ITask } from './interfaces';
import { TaskManagementHeader } from './widgets/taskManagementHeader';
import { FloatingMenu } from '~/components/FloatingMenu';

const allTasks: ITask[] = [
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
];

export const TasksScreen: React.FC = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState<ITask[]>(allTasks);

  const toggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const renderTask = ({ item }: { item: ITask }) => <TaskItem task={item} onToggle={toggleTask} />;

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <SafeAreaView style={styles.container}>
      <TaskManagementHeader />

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      <FloatingMenu
        title="Add Task"
        icon="ClipboardPlus"
        onPress={() => console.log('Add Task pressed')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
});
