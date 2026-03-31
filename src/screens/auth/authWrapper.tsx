import React, { ReactNode } from 'react';
import { ConfirmResetPassword } from '~/codidge_components/auth/forms/confirm_reset_password';
import { useAuthContext } from '~/codidge_components/auth/context';
import { useReactiveVar } from '@apollo/client';
import { updateUser } from '~/store/user';
import { pushTokenVar } from '~/store/user/pushToken';
import { signOut } from 'aws-amplify/auth/cognito';
import { IAuthModuleKeys } from '~/codidge_components/auth/interfaces';
import { SignUpForm } from '~/codidge_components/auth/forms/sign_up';
import { ResetPassword } from '~/codidge_components/auth/forms/reset_password';
import { VerifyEmail } from '~/codidge_components/auth/forms/verify_email';
import { SignInForm } from '~/codidge_components/auth/forms/sign_in';
import { AuthFormWrapper } from './authLayout';
import { StyleSheet } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { ENV_Vars } from '~/store/env';
import { useUser } from './hooks/useUser';
import { updateAuthenticateStateUser } from '~/store/user/authSessionState';
import { apiKeyClient } from '~/store/config/apolloClient';

export const AuthWrapper = () => {
  const { currentView, setCurrentView } = useAuthContext();

  const { getCustomerFn, updateCustomerFn, addCustomerFn } = useUser();

  const pushToken = useReactiveVar(pushTokenVar);

  const handleLoginSuccess = async (userId: string) => {
    try {
      const user = await getCustomerFn({
        variables: {
          tenant: ENV_Vars.tenant,
          customerId: userId,
        },
      });

      const userData = user.data?.getCustomer;

      if (!userData) {
        console.error(user.error);
        throw Error('Error getting user');
      }

      updateUser(userData);
      updateAuthenticateStateUser(false);
    } catch (error) {
      console.log('::::error getting user', error);
      await signOut();
    }
  };

  const handleRegisterSuccess = async (userId: string, formData: any) => {
    try {
      if (!pushToken) {
        console.log('::::not token creation');
        //Alert.alert('Not token');
        //return;
      }
      const userData = await addCustomerFn({
        variables: {
          tenant: ENV_Vars.tenant,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            notificationToken: pushToken,
          },
          customerID: userId,
        },
        client: apiKeyClient,
      });

      if (!userData.data?.addCustomer) {
        throw Error('Error getting user');
      }
    } catch (error) {
      await signOut();
      console.log(':::error', error);
    }
  };

  const handleVerificationSuccess = async (userId: string) => {
    try {
      const userData = await updateCustomerFn({
        variables: {
          tenant: ENV_Vars.tenant,
          customer: {
            emailVerified: true,
          },
          customerId: userId,
        },
      });

      const userRes = userData.data?.updateCustomer;

      if (!userRes) {
        throw Error('Error getting user');
      }

      updateUser(userRes);
      updateAuthenticateStateUser(false);
      setCurrentView(IAuthModuleKeys.signIn);
    } catch (error) {
      await signOut();
      console.log(':::error', error);
    }
  };

  const getHeader = (title: string): ReactNode => {
    return <Text style={[styles.mainTitle]}>{title}</Text>;
  };

  switch (currentView) {
    case IAuthModuleKeys.signIn:
      return (
        <AuthFormWrapper header={getHeader('Login')}>
          <SignInForm
            onSignUp={async () => {
              setCurrentView(IAuthModuleKeys.signUp);
            }}
            strictView={false}
            onLoginSuccess={handleLoginSuccess}
          />
        </AuthFormWrapper>
      );

    case IAuthModuleKeys.forcePasswordChange:
      return (
        <AuthFormWrapper>
          <ResetPassword />
        </AuthFormWrapper>
      );

    case IAuthModuleKeys.resetPassword:
      return (
        <AuthFormWrapper header={getHeader('Reset password')}>
          <ResetPassword />
        </AuthFormWrapper>
      );

    case IAuthModuleKeys.confirmResetPassword:
      return (
        <AuthFormWrapper>
          <ConfirmResetPassword />
        </AuthFormWrapper>
      );

    case IAuthModuleKeys.verifyEmail:
      return (
        <AuthFormWrapper>
          <VerifyEmail onVerificationSuccess={handleVerificationSuccess} />
        </AuthFormWrapper>
      );
    case IAuthModuleKeys.signUp:
      return (
        <AuthFormWrapper header={getHeader('Register')}>
          <SignUpForm onSignUpSuccess={handleRegisterSuccess} />
        </AuthFormWrapper>
      );
    default:
      return (
        <AuthFormWrapper>
          <SignUpForm onSignUpSuccess={handleRegisterSuccess} />
        </AuthFormWrapper>
      );
  }
};

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 4,
    letterSpacing: -0.5,
  },
});
