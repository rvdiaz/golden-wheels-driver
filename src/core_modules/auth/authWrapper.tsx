import React, { ReactNode, useEffect, useState } from 'react';
import { ConfirmResetPassword } from '~/codidge_components/auth/forms/confirm_reset_password';
import { useAuthContext } from '~/codidge_components/auth/context';
import { useReactiveVar } from '@apollo/client';
import Constants from 'expo-constants';
import { useLazyQuery, useMutation } from '@apollo/client';
import { addUserMutation, updateUserMutation } from './graphql/mutations';
import { updateUser } from '~/store/user';
import { pushTokenVar } from '~/store/user/pushToken';
import { IUser } from '~/store/interface';
import { signOut } from 'aws-amplify/auth/cognito';
import { getUserQuery } from './graphql/queries';
import { IAuthModuleKeys } from '~/codidge_components/auth/interfaces';
import { SignUpForm } from '~/codidge_components/auth/forms/sign_up';
import { ResetPassword } from '~/codidge_components/auth/forms/reset_password';
import { VerifyEmail } from '~/codidge_components/auth/forms/verify_email';
import { SignInForm } from '~/codidge_components/auth/forms/sign_in';
import { AuthFormWrapper } from './authLayout';
import { Alert, StyleSheet, View } from 'react-native';
import Text from '~/codidge_components/UI/text';
import IconButton from '~/codidge_components/UI/button/IconButton';
import {
  ArrowLeft,
  CheckCircle,
  LockKeyhole,
  MailOpen,
  RefreshCcw,
  UserCheck,
  UserLock,
  UserPlus,
} from 'lucide-react-native';
import { StepIcon } from '../on_boarding/widgets/stepIcon';
import { OnboardingFlowStorage } from './helpers/onboardingStorage';
import { PersonalInformation } from './personalnformationForm';
import { IPersonalData } from '../on_boarding/interface';
import { apiKeyClient } from '~/store/config/apolloClient';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const AuthWrapper = () => {
  const { currentView, setCurrentView } = useAuthContext();
  const [addUserFn] = useMutation<{ addUser: IUser }>(addUserMutation, {
    client: apiKeyClient,
  });
  const [updateUserFn] = useMutation<{ updateUser: IUser }>(updateUserMutation);
  const [getUserFn] = useLazyQuery<{ getUser: IUser }>(getUserQuery);
  const pushToken = useReactiveVar(pushTokenVar);

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
      await OnboardingFlowStorage.setAccountCreated();
      updateUser(user.data?.getUser);
    } catch (error) {
      console.log('::::error getting user', error);
      await signOut();
    }
  };

  const handleRegisterSuccess = async (userId: string, formData: any) => {
    try {
      const personalInfo = await OnboardingFlowStorage.getPersonalInfoCompleted();

      if (!pushToken) {
        Alert.alert('Not token');
        return;
      }
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
              addressLine1: personalInfo.addressLine1,
              postalCode: personalInfo.postalCode,
              region: personalInfo.region,
              country: personalInfo.country,
              locality: personalInfo.city,
            },
            notificationToken: pushToken,
          },
          userId,
        },
      });

      if (!userData.data?.addUser) {
        throw Error('Error getting user');
      }
    } catch (error) {
      await signOut();
      console.log(':::error', error);
    }
  };

  const handleVerificationSuccess = async (userId: string) => {
    try {
      const userData = await updateUserFn({
        variables: {
          tenant: {
            tenantId: tenantId,
          },
          updates: {
            emailVerified: true,
          },
          userId,
        },
      });

      if (!userData.data?.updateUser) {
        throw Error('Error getting user');
      }

      updateUser(userData.data?.updateUser);
      await OnboardingFlowStorage.setAccountCreated();
    } catch (error) {
      await signOut();
      console.log(':::error', error);
    }
  };

  const getHeader = (title: string, icon: ReactNode, backFn?: () => void): ReactNode => {
    return (
      <View
        style={[
          styles.headerContainer,
          {
            marginBottom: 20,
          },
        ]}>
        {backFn && (
          <View
            style={{
              position: 'absolute',
              top: 40,
              left: 0,
            }}>
            <IconButton
              style={{
                backgroundColor: 'transparent',
              }}
              onPress={backFn}
              icon={<ArrowLeft color={'#FFF'} />}
            />
          </View>
        )}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {icon}
        </View>

        <Text style={[styles.mainTitle]}>{title}</Text>
      </View>
    );
  };

  switch (currentView) {
    case IAuthModuleKeys.signIn:
      return (
        <AuthFormWrapper
          header={
            <View
              style={[
                styles.headerContainer,
                {
                  marginBottom: 20,
                },
              ]}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <StepIcon icon={UserLock} />
              </View>

              <Text style={styles.mainTitle}>Sign In</Text>
            </View>
          }>
          <SignInForm
            onSignUp={async () => {
              const hasCompletedPersonalInfo =
                await OnboardingFlowStorage.hasCompletedPersonalInfo();
              if (!hasCompletedPersonalInfo) {
                setCurrentView(IAuthModuleKeys.personalInfo);
              } else {
                setCurrentView(IAuthModuleKeys.signUp);
              }
            }}
            strictView={false}
            onLoginSuccess={handleLoginSuccess}
          />
        </AuthFormWrapper>
      );

    case IAuthModuleKeys.forcePasswordChange:
      return (
        <AuthFormWrapper
          header={getHeader('Forget password', <StepIcon icon={LockKeyhole} />, () => {
            setCurrentView(IAuthModuleKeys.signIn);
          })}>
          <ResetPassword />
        </AuthFormWrapper>
      );

    case IAuthModuleKeys.resetPassword:
      return (
        <AuthFormWrapper header={getHeader('Reset password', <StepIcon icon={RefreshCcw} />)}>
          <ResetPassword />
        </AuthFormWrapper>
      );

    case IAuthModuleKeys.confirmResetPassword:
      return (
        <AuthFormWrapper
          header={getHeader('Confirm Reset password', <StepIcon icon={CheckCircle} />)}>
          <ConfirmResetPassword />
        </AuthFormWrapper>
      );

    case IAuthModuleKeys.verifyEmail:
      return (
        <AuthFormWrapper header={getHeader('Verify Email', <StepIcon icon={MailOpen} />)}>
          <VerifyEmail onVerificationSuccess={handleVerificationSuccess} />
        </AuthFormWrapper>
      );
    case IAuthModuleKeys.signUp:
      return (
        <AuthFormWrapper
          header={
            <View
              style={[
                styles.headerContainer,
                {
                  marginBottom: 20,
                },
              ]}>
              <View
                style={{
                  position: 'absolute',
                  top: 40,
                  left: 0,
                }}>
                <IconButton
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  onPress={() => {
                    setCurrentView(IAuthModuleKeys.personalInfo);
                  }}
                  icon={<ArrowLeft color={'#FFF'} />}
                />
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <StepIcon icon={UserPlus} />
              </View>

              <Text style={[styles.mainTitle]}>Account Creation</Text>
            </View>
          }>
          <SignUpForm onSignUpSuccess={handleRegisterSuccess} />
        </AuthFormWrapper>
      );
    default:
      return (
        <AuthFormWrapper
          header={
            <View
              style={[
                styles.headerContainer,
                {
                  marginBottom: 20,
                },
              ]}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <StepIcon icon={UserCheck} />
              </View>

              <Text
                style={[
                  styles.mainTitle,
                  {
                    fontSize: 24,
                  },
                ]}>
                Personal Information
              </Text>
            </View>
          }>
          <PersonalInformation
            onNext={async (personalData: IPersonalData) => {
              await OnboardingFlowStorage.setPersonalInfoCompleted(personalData);
              setCurrentView(IAuthModuleKeys.signUp);
            }}
            openSignIn={() => {
              setCurrentView(IAuthModuleKeys.signIn);
            }}
          />
        </AuthFormWrapper>
      );
  }
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
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
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    paddingHorizontal: 0,
  },
});
