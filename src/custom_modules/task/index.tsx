import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../../components/Card';
import * as Icons from 'lucide-react-native';
import { Header } from '~/components/Header';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  category: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Call John Smith',
    description: 'Follow up on property inquiry',
    completed: false,
    priority: 'high',
    dueDate: 'Today, 2:00 PM',
    category: 'Follow-up',
  },
  {
    id: '2',
    title: 'Prepare listing presentation',
    description: 'Create presentation for 123 Oak Street',
    completed: false,
    priority: 'medium',
    dueDate: 'Tomorrow, 10:00 AM',
    category: 'Listing',
  },
  {
    id: '3',
    title: 'Market analysis report',
    description: 'Complete CMA for downtown properties',
    completed: true,
    priority: 'low',
    dueDate: 'Yesterday',
    category: 'Research',
  },
];

export const TasksScreen: React.FC = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const toggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <Card style={[styles.taskCard, item.completed && styles.completedTask]}>
      <View style={styles.taskHeader}>
        <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.checkbox}>
          {item.completed ? (
            <Icons.CheckCircle2 size={24} color="#10B981" />
          ) : (
            <Icons.Circle size={24} color="#9CA3AF" />
          )}
        </TouchableOpacity>

        <View style={styles.taskContent}>
          <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
            {item.title}
          </Text>
          <Text style={[styles.taskDescription, item.completed && styles.completedText]}>
            {item.description}
          </Text>

          <View style={styles.taskMeta}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(item.priority) + '20' },
              ]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
                {item.priority.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.taskDate}>{item.dueDate}</Text>
          </View>
        </View>
      </View>
    </Card>
  );

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Tasks" />

      <View style={styles.statsRow}>
        <Card style={[styles.statCard, { backgroundColor: '#EEF2FF' }]}>
          <Text style={styles.statNumber}>{activeTasks.length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: '#ECFDF5' }]}>
          <Text style={styles.statNumber}>{completedTasks.length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: '#FFFBEB' }]}>
          <Text style={styles.statNumber}>
            {tasks.filter((t) => t.priority === 'high' && !t.completed).length}
          </Text>
          <Text style={styles.statLabel}>High Priority</Text>
        </Card>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddTask' as never)}>
        <Icons.Plus size={24} color="white" />
      </TouchableOpacity>
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
  taskCard: {
    marginBottom: 12,
    padding: 16,
  },
  completedTask: {
    opacity: 0.6,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  taskDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
