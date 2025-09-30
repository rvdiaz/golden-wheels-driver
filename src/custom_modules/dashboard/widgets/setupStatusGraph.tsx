import { useMutation, useReactiveVar } from '@apollo/client';
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { updateUserMutation } from '~/core_modules/auth/graphql/mutations';
import { SetupProfile } from '~/core_modules/profile_setup';
import { useProfileSetupConfig } from '~/core_modules/profile_setup/customHook';
import { ProfileSetupShortcut } from '~/core_modules/profile_setup/widgets/home_shortcut';
import { updateUser, userData } from '~/store/user';
import Constants from 'expo-constants';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const ProfileCompletionWidget = () => {
  const { allTasks } = useProfileSetupConfig();

  const [modal, setModal] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [updateUserFn] = useMutation(updateUserMutation);

  const user = useReactiveVar(userData);

  // Track if we've already shown the congratulations
  const hasShownCongratsRef = useRef(false);
  const previousCompletionRef = useRef(false);

  // Calculate truly completed steps (only count if all substeps match)
  const completedStepsCount = React.useMemo(() => {
    if (!user?.profileSteps || !allTasks) return 0;

    return user.profileSteps.filter((userStep) => {
      const matchingTask = allTasks.find((task) => task.id === userStep.id);

      if (!matchingTask) return false;

      // Only count as completed if substeps length matches
      return userStep.subSteps.length === matchingTask.subitems.length;
    }).length;
  }, [user?.profileSteps, allTasks]);

  const isProfileComplete = completedStepsCount === allTasks.length;

  // Check if profile was just completed and show congratulations
  useEffect(() => {
    const updateUserAux = async (hasSeenProfileCompletionCongrats: boolean) => {
      try {
        await updateUserFn({
          variables: {
            tenant: {
              tenantId: tenantId,
            },
            updates: {
              hasSeenProfileCompletionCongrats,
            },
            userId: user?.id,
          },
        });
        updateUser({
          ...user!,
          hasSeenProfileCompletionCongrats: hasSeenProfileCompletionCongrats,
        });
      } catch (error) {
        console.log('::error updatuing user', error);
      }
    };

    // Check if profile just became complete (wasn't complete before, but is now)
    const justCompleted = isProfileComplete && !previousCompletionRef.current;

    // Check if user has already been congratulated (you'll need to store this)
    const hasBeenCongratulated = user?.hasSeenProfileCompletionCongrats === true;

    if (justCompleted && !hasBeenCongratulated && !hasShownCongratsRef.current) {
      if (!user?.profileSetupSkipped && !user?.hasSeenProfileCompletionCongrats) {
        setShowCongrats(true);
        updateUserAux(true);
      }

      hasShownCongratsRef.current = true;
    }

    // Update the previous completion state
    previousCompletionRef.current = isProfileComplete;
  }, [isProfileComplete, user?.hasSeenProfileCompletionCongrats]);

  if (isProfileComplete) {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCongrats}
        onRequestClose={() => {
          setShowCongrats(false);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 32,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              minWidth: 300,
            }}>
            {/* Add your congratulations content here */}
            <Text style={{ fontSize: 32, marginBottom: 16 }}>🎉</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
              Congratulations!
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
              You've completed your profile setup!
            </Text>
            <PrimaryButton title="Great" onPress={() => setShowCongrats(false)} />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View>
      <ProfileSetupShortcut
        onButtonPress={() => {
          setModal(true);
        }}
        completedSteps={completedStepsCount}
        totalSteps={allTasks.length}
      />
      <Modal
        animationType="slide"
        visible={modal}
        onDismiss={() => {
          setModal(false);
        }}>
        <SetupProfile
          dispose={() => {
            setModal(false);
          }}
        />
      </Modal>
    </View>
  );
};
