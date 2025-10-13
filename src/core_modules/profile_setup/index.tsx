import React, { useState } from 'react';
import { useSystemSettings } from '../../system_setting/customHook';
import { theme } from '~/theme/theme';
import { ScrollView, StyleSheet, TouchableOpacity, View, Modal } from 'react-native';
import { IProfileTask } from '../../system_setting/interfaces';
import { PageTransition } from '~/codidge_components/UI/pageTransition';
import { TaskDetailScreen } from './widgets/setup_item_detail';
import { Slider } from '~/codidge_components/UI/slider';
import { userData, updateUser } from '~/store/user';
import { useReactiveVar, useMutation } from '@apollo/client';
import { ProfileScreensWrapper } from './widgets/wrapper';
import { ArrowLeft, ChevronLast, AlertCircle, X, Rocket } from 'lucide-react-native';
import TextButton from '~/codidge_components/UI/button/TextButton';
import OutlineButton, { ButtonSize } from '~/codidge_components/UI/button/OutlineButton';
import { updateUserMutation } from '~/core_modules/auth/graphql/mutations';
import Constants from 'expo-constants';
import { SetupItem } from './widgets/setup_list_item';
import Text from '~/codidge_components/UI/text';
import { BusinessPlanFlow } from './widgets/business_plan';
import { SkipAllModal } from './widgets/skip_all_modal';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const SetupProfile = ({ dispose }: { dispose: () => void }) => {
  const { allTasks } = useSystemSettings();
  const [selectedTask, setSelectedTask] = useState<IProfileTask | null>(null);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const [showBusinessPlan, setshowBusinessPlan] = useState(false);

  const user = useReactiveVar(userData);
  const userStepsCompleted = user?.profileSteps?.length ?? 0;

  const [updateUserFn, { loading: isSkipping }] = useMutation(updateUserMutation);

  // Get current task index
  const currentTaskIndex = selectedTask
    ? allTasks.findIndex((task) => task.id === selectedTask.id)
    : -1;
  const isFirstTask = currentTaskIndex === 0;
  const isLastTask = currentTaskIndex === allTasks.length - 1;

  const handleSkipAll = async () => {
    if (!user) return;

    try {
      const skippedProfileSteps = allTasks.map((task) => ({
        id: task.id,
        title: task.title,
        subSteps: task.subitems.map((subitem) => subitem.id),
      }));

      await updateUserFn({
        variables: {
          tenant: {
            tenantId: tenantId,
          },
          updates: {
            profileSteps: skippedProfileSteps,
            profileSetupSkipped: true,
          },
          userId: user.id,
        },
      });

      updateUser({
        ...user,
        profileSteps: skippedProfileSteps,
        profileSetupSkipped: true,
      });

      setShowSkipModal(false);
    } catch (error) {
      console.error('Error skipping all tasks:', error);
    }
  };

  const handleNext = () => {
    if (currentTaskIndex < allTasks.length - 1) {
      setSelectedTask(allTasks[currentTaskIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentTaskIndex > 0) {
      setSelectedTask(allTasks[currentTaskIndex - 1]);
    }
  };

  const userBusinessPlanFinished =
    user?.swotAnalysis && user?.financialGoals && user?.visionMission;

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
            {!userBusinessPlanFinished && (
              <OutlineButton
                title="Create Business Plan"
                size={ButtonSize.LARGE}
                style={{
                  marginBottom: 20,
                }}
                onPress={() => {
                  setshowBusinessPlan(true);
                }}
                rightWidget={<Rocket size={16} color={theme.colors.primary} />}
              />
            )}
            {allTasks.map((task) => (
              <SetupItem key={task.id} task={task} onPress={() => setSelectedTask(task)} />
            ))}
          </ScrollView>
          <View style={styles.footer}>
            <TextButton
              style={{
                marginLeft: 'auto',
                gap: 8,
              }}
              textStyle={{ color: theme.colors.primary }}
              title="Skip All"
              onPress={() => setShowSkipModal(true)}
              rightWidget={<ChevronLast size={16} color={theme.colors.primary} />}
            />
          </View>
        </View>
      </ProfileScreensWrapper>

      <PageTransition isVisible={!!selectedTask} duration={350}>
        {selectedTask && (
          <TaskDetailScreen
            task={selectedTask}
            onBack={() => setSelectedTask(null)}
            onNext={!isLastTask ? handleNext : undefined}
            onPreview={!isFirstTask ? handlePrevious : undefined}
          />
        )}
      </PageTransition>

      <PageTransition isVisible={showBusinessPlan} duration={350}>
        <BusinessPlanFlow
          onComplete={() => {
            setshowBusinessPlan(false);
          }}
          dispose={() => {
            setshowBusinessPlan(false);
          }}
        />
      </PageTransition>

      <SkipAllModal
        isSkipping={isSkipping}
        dismiss={() => {
          setShowSkipModal(false);
        }}
        handleSkipAll={handleSkipAll}
        showSkipModal={showSkipModal}
      />
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
  footer: {
    padding: 16,
    justifyContent: 'flex-end',
  },
});
