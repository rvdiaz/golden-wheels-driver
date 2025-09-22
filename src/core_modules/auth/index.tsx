import React from 'react';
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

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const AuthFormWrapper = () => {
  const { currentView } = useAuthContext();
  const pushToken = useReactiveVar(pushTokenVar);
  const [addCustomerFn] = useMutation<{ addUser: IUser }>(addUserMutation);
  const [getCustomerFn] = useLazyQuery<{ getUser: IUser }>(getUserQuery);

  const handleLoginSuccess = async (userId: string) => {
    try {
      const user = await getCustomerFn({
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
      const customerData = await addCustomerFn({
        variables: {
          tenant: {
            tenantId: tenantId,
          },
          customer: {
            ...formData,
            id: userId,
            notificationToken: pushToken,
          },
        },
      });

      if (!customerData.data?.addUser) {
        throw Error('Error getting user');
      }

      updateUser(customerData.data?.addUser);
    } catch (error) {
      await signOut();
      console.log(':::error', error);
    }
  };

  switch (currentView) {
    case IAuthModuleKeys.signUp:
      return <SignUpForm onSignUpSuccess={handleRegisterSuccess} />;

    case IAuthModuleKeys.forcePasswordChange:
      return <ForcePasswordChange onSignUpSuccess={handleRegisterSuccess} />;

    case IAuthModuleKeys.resetPassword:
      return <ResetPassword onSignUpSuccess={handleRegisterSuccess} />;

    case IAuthModuleKeys.confirmResetPassword:
      return <ConfirmResetPassword />;

    case IAuthModuleKeys.verifyEmail:
      return <VerifyEmail onSignUpSuccess={handleRegisterSuccess} />;

    default:
      return <SignInForm onLoginSuccess={handleLoginSuccess} />;
  }
};
