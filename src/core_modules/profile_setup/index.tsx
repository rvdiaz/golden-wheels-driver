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
import { ArrowLeft, ChevronLast, AlertCircle, X } from 'lucide-react-native';
import TextButton from '~/codidge_components/UI/button/TextButton';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import { updateUserMutation } from '~/core_modules/auth/graphql/mutations';
import Constants from 'expo-constants';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { SetupItem } from './widgets/setup_list_item';
import Text from '~/codidge_components/UI/text';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const SetupProfile = ({ dispose }: { dispose: () => void }) => {
  const { allTasks } = useSystemSettings();
  const [selectedTask, setSelectedTask] = useState<IProfileTask | null>(null);
  const [showSkipModal, setShowSkipModal] = useState(false);

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
            {/*    <SetupItem
              key="special"
              task={{ id: 'special', label: 'Featured Tool', description: 'Try this first' }}
              onPress={() => setSelectedTask({ id: 'special' })}
            /> */}
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

      <Modal
        visible={showSkipModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSkipModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowSkipModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>

            <View style={styles.modalIconContainer}>
              <AlertCircle size={48} color={theme.colors.primary} />
            </View>

            <Text style={styles.modalTitle}>Skip All Setup Tasks?</Text>
            <Text style={styles.modalDescription}>
              These are very important steps to build yur real estate career, this is the
              foundation. Are you sure you want to skip these steps?
            </Text>

            <View style={styles.modalButtons}>
              <OutlineButton
                title="Cancel"
                onPress={() => setShowSkipModal(false)}
                style={styles.modalButton}
              />
              <PrimaryButton
                style={{
                  backgroundColor: theme.colors.primary,
                  ...styles.modalButton,
                }}
                loading={isSkipping}
                onPress={handleSkipAll}
                title="Yes, Skip All"
              />
            </View>
          </View>
        </View>
      </Modal>
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  modalIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
