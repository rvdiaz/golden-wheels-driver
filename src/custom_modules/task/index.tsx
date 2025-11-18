import React, { useState } from 'react';
import { StyleSheet, FlatList, Modal, View, RefreshControl, TouchableOpacity } from 'react-native';
import { TaskItem } from './widgets/taskItem';
import { ActiveTab, ITask } from './interfaces';
import { FloatingMenu } from '~/codidge_components/UI/button/FloatingMenu';
import { AddTaskScreen } from './widgets/addTask';
import { useReactiveVar } from '@apollo/client';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import { TabHeader } from '~/codidge_components/UI/tabs';
import { Crown, ListChecks, Pencil, Sparkles } from 'lucide-react-native';
import { getActiveTasks, getCustomTasks, sortTasks } from './helpers';
import { theme } from '~/theme/theme';
import { daySelection } from './hooks/dailySelectionVar';
import { useTasksByUser } from './hooks/listTask';
import { paywallVisibility, subscriptionStatusData } from '~/store/subscription';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '~/codidge_components/UI/text';

export const TasksScreen: React.FC = () => {
  const { hasActiveSubscription: hasSubscription } = useReactiveVar(subscriptionStatusData);

  const selectedDay = useReactiveVar(daySelection);

  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.admin);

  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const disposeModalHandler = () => {
    setModalVisible(false);
  };

  const { tasks: taskList, isLoading, refetch } = useTasksByUser();
  //all tasks
  const tasks = sortTasks(taskList ?? []);

  //active Tasks Today
  const activeTasks = getActiveTasks(tasks);

  // Separate active and inactive tasks based on tab
  const currentTabTasks = activeTab === ActiveTab.admin ? tasks : getCustomTasks(tasks);

  //incomplete active schedule tasks
  const inCompleteScheduleTasks = activeTasks.filter((ta) => !ta.isCompleted).length;

  //incomplete active custom tasks
  const customTask = getCustomTasks(activeTasks);
  const inCompleteCustomTask = customTask.filter((ta) => !ta.isCompleted).length;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderTaskSection = (data: ITask[]) => {
    if (data.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <FlatList
          data={data}
          renderItem={({ item }: { item: ITask }) => <TaskItem task={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Premium Banner - Only show if no subscription and not dismissed */}
      {!hasSubscription  && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => paywallVisibility(true)}
          style={styles.premiumBannerContainer}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.info]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumBanner}
          >
            <View style={styles.bannerContent}>
              <View style={styles.bannerIconContainer}>
                <Crown size={16} color="#FFF" />
              </View>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>
                  Unlock Daily Schedule with Premium
                </Text>
                <Text style={styles.bannerSubtitle}>
                  Get personalized daily tasks • Boost productivity
                </Text>
              </View>
              <View style={styles.bannerArrow}>
                <Sparkles size={16} color="#FFF" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
      <TabHeader
        tabs={[
          {
            key: ActiveTab.admin,
            label: 'Daily Schedule',
            Icon: ListChecks,
            indexNumber: inCompleteScheduleTasks,
          },
          {
            key: ActiveTab.custom,
            label: 'My Tasks',
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
          data={[]}
          renderItem={() => null}
          ListHeaderComponent={
            <View
              style={{
                marginTop: 16,
              }}>
              {renderTaskSection(currentTabTasks)}
            </View>
          }
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
    </View>
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
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  premiumBannerContainer: {
    marginHorizontal: 12,
    marginBottom: 4,
  },
  premiumBanner: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    position: 'relative',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 24, // Space for dismiss button
  },
  bannerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 14,
  },
  bannerArrow: {
    marginLeft: 8,
  },
});
