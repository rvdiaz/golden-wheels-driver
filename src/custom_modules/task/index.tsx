import React, { useState } from 'react';
import { StyleSheet, FlatList, Modal, SafeAreaView, View } from 'react-native';
import { TaskItem } from './widgets/taskItem';
import { ActiveTab, ITask, TaskSource } from './interfaces';
import { FloatingMenu } from '~/codidge_components/UI/button/FloatingMenu';
import { AddTaskScreen } from './sections/addTask';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { getTaskByUserQuery } from './graphql/queries';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import Constants from 'expo-constants';
import { TabHeader } from '~/codidge_components/UI/tabs';
import { CheckSquare, Clock } from 'lucide-react-native';
import { getCustomTasks, sortTasks } from './helpers';

const today = new Date().toISOString().split('T')[0];
const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const TasksScreen: React.FC = () => {
  const customer = useReactiveVar(userData);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.admin);

  const [modalVisible, setModalVisible] = useState(false);

  const disposeModalHandler = () => {
    setModalVisible(false);
  };

  const { data, loading: isLoading } = useQuery<{ getTasksByUser: ITask[] }>(getTaskByUserQuery, {
    variables: {
      tenant: {
        tenantId,
      },
      userId: customer?.id,
      date: today,
      userActiveTemplateId: customer?.activeTemplateId,
    },
  });

  if (isLoading) {
    return <PageLoading />;
  }

  const tasks = sortTasks(data?.getTasksByUser ?? []);

  const customeTask = getCustomTasks(tasks);
  const inCompleteCustomTask = customeTask.filter((ta) => !ta.isCompleted).length;

  return (
    <SafeAreaView style={styles.container}>
      <TabHeader
        tabs={[
          {
            key: ActiveTab.admin,
            label: 'Daily Schedule',
            Icon: Clock,
          },
          {
            key: ActiveTab.custom,
            label: 'Custom Tasks',
            Icon: CheckSquare,
            indexNumber: inCompleteCustomTask,
          },
        ]}
        onTabChange={(key) => setActiveTab(key as ActiveTab)}
      />

      <FlatList
        data={activeTab === ActiveTab.admin ? tasks : customeTask}
        renderItem={({ item }: { item: ITask }) => <TaskItem task={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
          <AddTaskScreen disposeModalHandler={disposeModalHandler} />
        </View>
      </Modal>
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
