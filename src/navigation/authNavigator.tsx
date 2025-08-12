import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SignIn } from '~/codidge_components/auth/sign_in';
import { SignUp } from '~/codidge_components/auth/sign_up';
import { ForcePasswordChange } from '~/codidge_components/auth/force_password_change';
import { ConfirmResetPassword } from '~/codidge_components/auth/confirm_reset_password';
import { ResetPassword } from '~/codidge_components/auth/reset_password';
import { MfaAuth } from '~/codidge_components/auth/mfa_auth';

const Stack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F9FAFB' },
      }}>
      <Stack.Screen name="ForcePasswordChange" component={ForcePasswordChange} />
      <Stack.Screen name="ConfirmResetPassword" component={ConfirmResetPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Mfa" component={MfaAuth} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
    </Stack.Navigator>
  );
};
