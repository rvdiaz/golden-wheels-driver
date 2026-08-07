import React, { ReactNode } from 'react';
import { ConfirmResetPassword } from '~/codidge_components/auth/forms/confirm_reset_password';
import { useAuthContext } from '~/codidge_components/auth/context';
import { updateUser } from '~/store/user';
import { signOut } from 'aws-amplify/auth/cognito';
import { IAuthModuleKeys } from '~/codidge_components/auth/interfaces';
import { ResetPassword } from '~/codidge_components/auth/forms/reset_password';
import { ForcePasswordChange } from '~/codidge_components/auth/forms/force_password_change';
import { SignInForm } from '~/codidge_components/auth/forms/sign_in';
import { EmailOtpForm } from '~/codidge_components/auth/forms/email_otp';
import { AuthFormWrapper } from './authLayout';
import { StyleSheet } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { ENV_Vars } from '~/store/env';
import { useUser } from './hooks/useUser';

export const AuthWrapper = () => {
  const { currentView, tempData } = useAuthContext();
  const { getDriverProfileFn } = useUser();

  const handleLoginSuccess = async () => {
    try {
      // Codidge identifies the driver from the verified token; tenantID only says which
      // location's roster to search. See src/screens/auth/graphql/queries.ts.
      const result = await getDriverProfileFn({
        variables: { tenantID: ENV_Vars.TENANT_ID },
      });

      const driverData = result.data?.getDriverProfile;

      if (!driverData) {
        // Authentication succeeded but this participant is not on this location's roster —
        // they're a customer, or drive for another organization. Signing out is right: there
        // is nothing for them here.
        console.error('Driver profile not found — this account is not a driver at this location.');
        await signOut();
        return;
      }

      // Language preference is deliberately not applied yet — the profile query does not
      // select it. Restore this once language handling is decided (see queries.ts).

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
    // Passwordless sign-in: the driver types the code Cognito just emailed. This is the only
    // path an invited driver takes — they never have a password to set or change.
    case IAuthModuleKeys.emailOtp:
      return (
        <AuthFormWrapper header={getHeader('Check your email')}>
          <EmailOtpForm email={tempData?.email ?? ''} onSuccess={handleLoginSuccess} />
        </AuthFormWrapper>
      );

    // Invited driver setting their password for the first time. Distinct from
    // resetPassword below, which is the emailed-code forgot-password flow.
    //
    // Unreachable on Codidge — kept for pools that still issue temporary passwords.
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
