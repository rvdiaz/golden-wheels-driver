import React from 'react';
import { ConfirmResetPassword } from '~/codidge_components/auth/forms/confirm_reset_password';
import { useAuthContext } from '~/codidge_components/auth/context';
import Constants from 'expo-constants';
import { useLazyQuery, useMutation } from '@apollo/client';
import { addCustomerMutation } from './graphql/mutations';
import { updateUser } from '~/store/user';
import { IUser } from '~/store/interface';
import { signOut } from 'aws-amplify/auth/cognito';
import { getCustomerQuery } from './graphql/queries';
import { IAuthModuleKeys } from '~/codidge_components/auth/interfaces';
import { SignUpForm } from '~/codidge_components/auth/forms/sign_up';
import { ForcePasswordChange } from '~/codidge_components/auth/forms/force_password_change';
import { ResetPassword } from '~/codidge_components/auth/forms/reset_password';
import { VerifyEmail } from '~/codidge_components/auth/forms/verify_email';
import { SignInForm } from '~/codidge_components/auth/forms/sign_in';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const AuthFormWrapper = () => {
  const { currentView } = useAuthContext();
  const [addCustomerFn] = useMutation<{ addCustomer: IUser }>(addCustomerMutation);
  const [getCustomerFn] = useLazyQuery<{ getCustomer: IUser }>(getCustomerQuery);

  const handleLoginSuccess = async (userId: string) => {
    try {
      const customer = await getCustomerFn({
        variables: {
          tenant: {
            tenantId: tenantId,
          },
          customerId: userId,
        },
      });

      if (!customer.data?.getCustomer) {
        throw Error('Error getting user');
      }

      updateUser(customer.data?.getCustomer);
    } catch (error) {
      console.log('::::error getting uustome', error);
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
          },
        },
      });

      if (!customerData.data?.addCustomer) {
        throw Error('Error getting user');
      }

      updateUser(customerData.data?.addCustomer);
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
