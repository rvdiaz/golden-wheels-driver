import { useReactiveVar } from '@apollo/client';
import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import { SetupProfile } from '~/core_modules/profile_setup';
import { useProfileSetupConfig } from '~/core_modules/profile_setup/customHook';
import { ProfileSetupShortcut } from '~/core_modules/profile_setup/widgets/home_shortcut';
import { userData } from '~/store/user';

export const ProfileCompletionWidget = () => {
  const { allTasks } = useProfileSetupConfig();

  const [modal, setModal] = useState(false);

  const user = useReactiveVar(userData);
  const userStepsCompleted = user?.profileSteps?.length ?? 0;

  return (
    <View>
      <ProfileSetupShortcut
        onButtonPress={() => {
          setModal(true);
        }}
        completedSteps={userStepsCompleted ?? 0}
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
