import React, { useState } from 'react';
import { StyleSheet, FlatList, Modal, SafeAreaView, View, RefreshControl } from 'react-native';
import { TaskItem } from './widgets/taskItem';
import { ActiveTab, ITask } from './interfaces';
import { FloatingMenu } from '~/codidge_components/UI/button/FloatingMenu';
import { AddTaskScreen } from './widgets/addTask';
import { useReactiveVar } from '@apollo/client';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import { TabHeader } from '~/codidge_components/UI/tabs';
import { ListChecks, Pencil } from 'lucide-react-native';
import { getCustomTasks, sortTasks } from './helpers';
import { theme } from '~/theme/theme';
import { daySelection } from './hooks/dailySelectionVar';
import { useTasksByUser } from './hooks/listTask';

export const TasksScreen: React.FC = () => {
  const selectedDay = useReactiveVar(daySelection);

  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.admin);

  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const disposeModalHandler = () => {
    setModalVisible(false);
  };

  const { tasks: taskList, isLoading, refetch } = useTasksByUser();

  const tasks = sortTasks(taskList ?? []);

  const customeTask = getCustomTasks(tasks);
  const inCompleteCustomTask = customeTask.filter((ta) => !ta.isCompleted).length;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <TabHeader
        tabs={[
          {
            key: ActiveTab.admin,
            label: 'Daily Schedule',
            Icon: ListChecks,
            indexNumber: 8,
          },
          {
            key: ActiveTab.custom,
            label: 'Custom Tasks',
            Icon: Pencil,
            indexNumber: inCompleteCustomTask,
          },
        ]}
        onTabChange={(key) => setActiveTab(key as ActiveTab)}
      />

      {isLoading ? (
        <PageLoading />
      ) : (
        <FlatList
          data={activeTab === ActiveTab.admin ? tasks : customeTask}
          renderItem={({ item }: { item: ITask }) => <TaskItem task={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
      <FloatingMenu
        title="Add Task"
        icon="Plus"
        onPress={() => {
          setModalVisible(true);
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={disposeModalHandler}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <AddTaskScreen defaultDate={selectedDay} disposeModalHandler={disposeModalHandler} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bodyBackground,
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
