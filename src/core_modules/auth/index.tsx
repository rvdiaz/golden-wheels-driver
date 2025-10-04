import React, { useState } from 'react';
import { ConfirmResetPassword } from '~/codidge_components/auth/forms/confirm_reset_password';
import { useAuthContext } from '~/codidge_components/auth/context';
import { useReactiveVar } from '@apollo/client';
import Constants from 'expo-constants';
import { useLazyQuery, useMutation } from '@apollo/client';
import { addUserMutation } from './graphql/mutations';
import { updateUser } from '~/store/user';
import { pushTokenVar } from '~/store/user/pushToken';
import { IUser } from '~/store/interface';
import { signOut } from 'aws-amplify/auth/cognito';
import { getUserQuery } from './graphql/queries';
import { IAuthModuleKeys } from '~/codidge_components/auth/interfaces';
import { SignUpForm } from '~/codidge_components/auth/forms/sign_up';
import { ForcePasswordChange } from '~/codidge_components/auth/forms/force_password_change';
import { ResetPassword } from '~/codidge_components/auth/forms/reset_password';
import { VerifyEmail } from '~/codidge_components/auth/forms/verify_email';
import { SignInForm } from '~/codidge_components/auth/forms/sign_in';
import { AuthFormWrapper } from './authContainer';
import { Image, StyleSheet, View } from 'react-native';
import { OnboardingStorage } from '../on_boarding';
import Text from '~/codidge_components/UI/text';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const AuthWrapper = ({
  firstRender,
  onRegister,
}: {
  firstRender: boolean;
  onRegister: () => void;
}) => {
  const { currentView } = useAuthContext();
  const [addUserFn] = useMutation<{ addUser: IUser }>(addUserMutation);
  const [getUserFn] = useLazyQuery<{ getUser: IUser }>(getUserQuery);
  const pushToken = useReactiveVar(pushTokenVar);
  const [allowLogin, setallowLogin] = useState(false);

  const handleLoginSuccess = async (userId: string) => {
    try {
      const user = await getUserFn({
        variables: {
          tenant: {
            tenantId,
          },
          token: pushToken,
          userId,
        },
      });

      if (!user.data?.getUser) {
        console.error(user.error);
        throw Error('Error getting user');
      }

      updateUser(user.data?.getUser);
    } catch (error) {
      console.log('::::error getting customer', error);
      await signOut();
    }
  };

  const handleRegisterSuccess = async (userId: string, formData: any) => {
    try {
      const onBoargingData = await OnboardingStorage.getSavedData();

      const personalInfo = onBoargingData?.personalInfo;
      const financialGoals = onBoargingData?.financialGoals;
      const swotAnalysis = onBoargingData?.swotAnalysis;
      const visionMission = onBoargingData?.visionMission;

      const userData = await addUserFn({
        variables: {
          tenant: {
            tenantId: tenantId,
          },
          user: {
            firstName: personalInfo?.firstName,
            lastName: personalInfo?.lastName,
            email: formData.email,
            phone: formData.phone,
            address: {
              addressLine1: onBoargingData?.personalInfo.addressLine1,
              postalCode: onBoargingData?.personalInfo.postalCode,
              region: onBoargingData?.personalInfo.region,
              country: onBoargingData?.personalInfo.country,
              locality: onBoargingData?.personalInfo.city,
            },
            financialGoals,
            swotAnalysis,
            visionMission,
            notificationToken: pushToken,
          },
          userId,
        },
      });

      await OnboardingStorage.setAccountCreated();

      if (!userData.data?.addUser) {
        throw Error('Error getting user');
      }

      updateUser(userData.data?.addUser);
      onRegister();
    } catch (error) {
      await signOut();
      console.log(':::error', error);
    }
  };

  const header = (
    <View style={styles.headerContainer}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image style={styles.image} source={require('assets/auth.png')} resizeMode="contain" />
      </View>

      <Text style={styles.mainTitle}>Account Creation</Text>

      <Text style={styles.subtitle}>
        Save your progress by creating your account so you won’t lose what you’ve already built.
      </Text>
    </View>
  );

  if (firstRender && currentView === IAuthModuleKeys.signIn && !allowLogin) {
    return (
      <AuthFormWrapper header={header}>
        <SignUpForm
          strictView={false}
          loginScreenRequest={() => {
            setallowLogin(true);
          }}
          onSignUpSuccess={handleRegisterSuccess}
        />
      </AuthFormWrapper>
    );
  }

  switch (currentView) {
    case IAuthModuleKeys.signUp:
      return (
        <AuthFormWrapper header={header}>
          <SignUpForm onSignUpSuccess={handleRegisterSuccess} />
        </AuthFormWrapper>
      );

    case IAuthModuleKeys.forcePasswordChange:
      return (
        <AuthFormWrapper header={header}>
          <ForcePasswordChange onSignUpSuccess={handleRegisterSuccess} />
        </AuthFormWrapper>
      );

    case IAuthModuleKeys.resetPassword:
      return (
        <AuthFormWrapper header={header}>
          <ResetPassword onSignUpSuccess={handleRegisterSuccess} />
        </AuthFormWrapper>
      );

    case IAuthModuleKeys.confirmResetPassword:
      return (
        <AuthFormWrapper header={header}>
          <ConfirmResetPassword />
        </AuthFormWrapper>
      );

    case IAuthModuleKeys.verifyEmail:
      return (
        <AuthFormWrapper header={header}>
          <VerifyEmail onSignUpSuccess={handleRegisterSuccess} />
        </AuthFormWrapper>
      );

    default:
      return (
        <AuthFormWrapper
          header={
            <View style={styles.headerContainer}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={styles.image}
                  source={require('assets/auth.png')}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.mainTitle}>Sign In</Text>
            </View>
          }>
          <SignInForm strictView={allowLogin} onLoginSuccess={handleLoginSuccess} />
        </AuthFormWrapper>
      );
  }
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  image: {
    width: 90,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    width: '100%',
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '400',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    paddingHorizontal: 0,
  },
});
