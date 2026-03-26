import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { BottomSheetModal } from '~/components/bottomSheetModal';
import { AuthWrapper } from '~/screens/auth/authWrapper';
import { authenticatedUser, updateAuthenticateStateUser } from './authSessionState';

export const AuthenticateScreen = () => {
  const showAuthModal = useReactiveVar(authenticatedUser);

  return (
    <BottomSheetModal
      heightFraction={0.85}
      visible={showAuthModal}
      onClose={() => updateAuthenticateStateUser(false)}>
      <AuthWrapper />
    </BottomSheetModal>
  );
};
