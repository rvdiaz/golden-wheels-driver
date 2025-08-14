import React, { useState } from 'react';
import { ConfirmResetPassword } from '~/codidge_components/auth/confirm_reset_password';
import { useAuthContext } from '~/codidge_components/auth/context';
import { ForcePasswordChange } from '~/codidge_components/auth/force_password_change';
import { IAuthModuleKeys } from '~/codidge_components/auth/interfaces';
import { MfaAuth } from '~/codidge_components/auth/mfa_auth';
import { ResetPassword } from '~/codidge_components/auth/reset_password';
import { SignIn } from '~/codidge_components/auth/sign_in';
import { SignUp } from '~/codidge_components/auth/sign_up';

interface IAuthWrapperEvents {
  onLoginSuccess: (userId: string) => void;
  onSignUpSuccess: (userId: string, formData: any) => void;
}

export const AuthFormWrapper = () => {
  const { currentView } = useAuthContext();

  const handleLoginSuccess = async (userId: string) => {};

  const handleRegisterSuccess = async (userId: string, formData: any) => {};

  switch (currentView) {
    case IAuthModuleKeys.signUp:
      return <SignUp onSignUpSuccess={handleRegisterSuccess} />;

    case IAuthModuleKeys.forcePasswordChange:
      return <ForcePasswordChange onSignUpSuccess={handleRegisterSuccess} />;

    case IAuthModuleKeys.resetPassword:
      return <ResetPassword onSignUpSuccess={handleRegisterSuccess} />;

    case IAuthModuleKeys.confirmResetPassword:
      return <ConfirmResetPassword />;

    case IAuthModuleKeys.verifyEmail:
      return <MfaAuth />;
      return;
    default:
      return <SignIn onLoginSuccess={handleLoginSuccess} />;
  }
};
