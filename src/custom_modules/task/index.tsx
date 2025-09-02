import React, { useState } from 'react';
import { StyleSheet, FlatList, Modal, SafeAreaView, View, RefreshControl } from 'react-native';
import { TaskItem } from './widgets/taskItem';
import { ActiveTab, ITask } from './interfaces';
import { FloatingMenu } from '~/codidge_components/UI/button/FloatingMenu';
import { AddTaskScreen } from './sections/addTask';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { getTaskByUserQuery } from './graphql/queries';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import Constants from 'expo-constants';
import { TabHeader } from '~/codidge_components/UI/tabs';
import { ListChecks, Pencil } from 'lucide-react-native';
import { getCustomTasks, sortTasks } from './helpers';
import { ExpandableCalendar, CalendarProvider } from 'react-native-calendars';
import { Positions } from 'react-native-calendars/src/expandableCalendar';
import { theme } from '~/theme/theme';

const today = new Date().toISOString().split('T')[0];
const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const TasksScreen: React.FC = () => {
  const [selected, setSelected] = useState(today);
  const customer = useReactiveVar(userData);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.admin);

  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const disposeModalHandler = () => {
    setModalVisible(false);
  };

  const {
    data,
    loading: isLoading,
    refetch,
  } = useQuery<{ getTasksByUser: ITask[] }>(getTaskByUserQuery, {
    variables: {
      tenant: {
        tenantId,
      },
      userId: customer?.id,
      date: selected,
      userActiveTemplateId: customer?.activeTemplateId,
    },
  });

  const tasks = sortTasks(data?.getTasksByUser ?? []);

  const customeTask = getCustomTasks(tasks);
  const inCompleteCustomTask = customeTask.filter((ta) => !ta.isCompleted).length;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <CalendarProvider
        date={new Date().toISOString().split('T')[0]} // today
        onDateChanged={(date) => setSelected(date)}>
        <ExpandableCalendar
          initialPosition={Positions.CLOSED} // start in week mode
          disablePan={true} // lock it in week mode
          firstDay={1}
          markedDates={{
            [selected]: {
              selected: true,
              selectedColor: theme.colors.primary, // ✅ primary color for selected day
              disableTouchEvent: true,
            },
          }}
          theme={{
            selectedDayBackgroundColor: theme.colors.primary,
            todayTextColor: theme.colors.primary,
            arrowColor: theme.colors.primary,
            dotColor: theme.colors.primary,
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
          }}
        />

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
            <AddTaskScreen defaultDate={selected} disposeModalHandler={disposeModalHandler} />
          </View>
        </Modal>
      </CalendarProvider>
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
