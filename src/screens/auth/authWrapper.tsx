import React, { ReactNode } from 'react';
import { ConfirmResetPassword } from '~/codidge_components/auth/forms/confirm_reset_password';
import { useAuthContext } from '~/codidge_components/auth/context';
import { updateUser } from '~/store/user';
import { signOut } from 'aws-amplify/auth/cognito';
import { IAuthModuleKeys } from '~/codidge_components/auth/interfaces';
import { ResetPassword } from '~/codidge_components/auth/forms/reset_password';
import { ForcePasswordChange } from '~/codidge_components/auth/forms/force_password_change';
import { SignInForm } from '~/codidge_components/auth/forms/sign_in';
import { AuthFormWrapper } from './authLayout';
import { StyleSheet } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { ENV_Vars } from '~/store/env';
import { useUser } from './hooks/useUser';
import { applyDriverLanguagePreference } from '~/i18n';

export const AuthWrapper = () => {
  const { currentView, tempData } = useAuthContext();
  const { getDriverProfileFn } = useUser();

  const handleLoginSuccess = async () => {
    try {
      const result = await getDriverProfileFn({
        variables: { tenant: ENV_Vars.tenant },
      });

      const driverData = result.data?.getDriverProfile;

      if (!driverData) {
        console.error('Driver profile not found — account may not be set up yet.');
        await signOut();
        return;
      }

      // Honour the language on the driver's record — unless they've already
      // picked one in the app, which applyDriverLanguagePreference respects.
      applyDriverLanguagePreference(driverData.preferenceLanguage);

      // Setting the driver is what dismisses the gate — the navigator reads
      // userData directly, so there is no separate "close the modal" step.
      updateUser(driverData);
    } catch (error) {
      console.log('Error fetching driver profile:', error);
      await signOut();
    }
  };

  const getHeader = (title: string): ReactNode => <Text style={styles.mainTitle}>{title}</Text>;

  switch (currentView) {
    // Invited driver setting their password for the first time. Distinct from
    // resetPassword below, which is the emailed-code forgot-password flow.
    case IAuthModuleKeys.forcePasswordChange:
      return (
        <AuthFormWrapper header={getHeader('Set Your Password')}>
          <ForcePasswordChange username={tempData?.email ?? ''} onSuccess={handleLoginSuccess} />
        </AuthFormWrapper>
      );

    case IAuthModuleKeys.resetPassword:
      return (
        <AuthFormWrapper header={getHeader('Reset Password')}>
          <ResetPassword />
        </AuthFormWrapper>
      );

    case IAuthModuleKeys.confirmResetPassword:
      return (
        <AuthFormWrapper>
          <ConfirmResetPassword />
        </AuthFormWrapper>
      );

    default:
      return (
        <AuthFormWrapper header={getHeader('Driver Login')}>
          <SignInForm onSignUp={() => {}} strictView onLoginSuccess={handleLoginSuccess} />
        </AuthFormWrapper>
      );
  }
};

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginVertical: 4,
    letterSpacing: -0.5,
  },
});
