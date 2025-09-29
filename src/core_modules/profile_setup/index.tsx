import React, { useState } from 'react';
import { useProfileSetupConfig } from './customHook';
import { SetupItem } from './widgets/setup_list_item';
import { theme } from '~/theme/theme';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IProfileTask } from './interfaces';
import { PageTransition } from '~/codidge_components/UI/pageTransition';
import { TaskDetailScreen } from './widgets/setup_item_detail';
import { Slider } from '~/codidge_components/UI/slider';
import { userData } from '~/store/user';
import { useReactiveVar } from '@apollo/client';
import { ProfileScreensWrapper } from './widgets/wrapper';
import { ArrowLeft } from 'lucide-react-native';

export const SetupProfile = ({ dispose }: { dispose: () => void }) => {
  const { allTasks } = useProfileSetupConfig();
  const [selectedTask, setSelectedTask] = useState<IProfileTask | null>(null);

  const user = useReactiveVar(userData);
  const userStepsCompleted = user?.profileSteps?.length ?? 0;

  return (
    <>
      <ProfileScreensWrapper
        header={
          <View
            style={{
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              width: '100%',
            }}>
            <TouchableOpacity onPress={dispose}>
              <ArrowLeft size={24} color={'#FFF'} />
            </TouchableOpacity>
            <View>
              <Text style={styles.title} numberOfLines={1}>
                Set up
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                Complete these tasks to finish your profile setup
              </Text>
            </View>
          </View>
        }>
        <View style={styles.container}>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderTitle}>Your Progress</Text>
              <Text style={styles.sliderDesc}>
                {userStepsCompleted}/{allTasks.length} Complete
              </Text>
            </View>
            <Slider progressPercentage={(userStepsCompleted / allTasks.length) * 100} />
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainer}>
            {allTasks.map((task) => (
              <SetupItem key={task.id} task={task} onPress={() => setSelectedTask(task)} />
            ))}
          </ScrollView>
        </View>
      </ProfileScreensWrapper>
      <PageTransition isVisible={!!selectedTask} duration={350}>
        {selectedTask && (
          <TaskDetailScreen task={selectedTask} onBack={() => setSelectedTask(null)} />
        )}
      </PageTransition>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'right',
  },
  subtitle: {
    color: '#A5B4FC',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'right',
  },
  scrollContainer: {
    gap: 12,
    flex: 1,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sliderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  sliderDesc: {
    fontSize: 12,
    color: '#0A0A0A',
    fontWeight: '400',
  },
});
