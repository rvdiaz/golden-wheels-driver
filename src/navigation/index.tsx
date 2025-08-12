import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Auth screens
import { SignIn } from '~/codidge_components/auth/sign_in';
import { MfaAuth } from '~/codidge_components/auth/mfa_auth';
import { ResetPassword } from '~/codidge_components/auth/reset_password';
import { ConfirmResetPassword } from '~/codidge_components/auth/confirm_reset_password';
import { ForcePasswordChange } from '~/codidge_components/auth/force_password_change';
import { SignUp } from '~/codidge_components/auth/sign_up';

// App modules screens
import { userData } from '~/store/user';
import { getTenantRoutes } from '~/store/config';
import { TasksScreen } from '~/custom_modules/task';
import { CRMScreen } from '~/custom_modules/crm';
import { Dashboard } from '~/custom_modules/dashboard';
import { TrainingScreen } from '~/custom_modules/training';
import { ProfileScreen } from '~/core_modules/profile';
import { ScheduleScreen } from '~/custom_modules/schedule';
import { ExpiredListingsScreen } from '~/custom_modules/tools/sections/expiredListing';
import { ToolsScreen } from '~/custom_modules/tools';
import { PrequalifiedLoanScreen } from '~/custom_modules/tools/sections/prequalifiedTools';
import { PropertyInfoScreen } from '~/custom_modules/tools/sections/propertyDetails';

const Stack = createStackNavigator();

export default function Navigation() {
  const userInfo = useReactiveVar(userData);

  // Tenant-specific dynamic screens (like in web)
  const tenantRoutes = getTenantRoutes(userInfo);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userInfo ? (
          // Authenticated stack
          <>
            {/*     {tenantRoutes.map(({ name, component, options }) => (
              <Stack.Screen key={name} name={name} component={component} options={options} />
            ))} */}
            <Stack.Screen name="tools" component={ToolsScreen} />
            <Stack.Screen name="propertyTools" component={PropertyInfoScreen} />
            <Stack.Screen name="prequalifiedTools" component={PrequalifiedLoanScreen} />

            <Stack.Screen name="ExpiredListing" component={ExpiredListingsScreen} />
            <Stack.Screen name="Schedule" component={ScheduleScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Training" component={TrainingScreen} />
            <Stack.Screen name="Crm" component={CRMScreen} />
            <Stack.Screen name="Task" component={TasksScreen} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
          </>
        ) : (
          // Public/auth stack
          <>
            <Stack.Screen name="ForcePasswordChange" component={ForcePasswordChange} />
            <Stack.Screen name="ConfirmResetPassword" component={ConfirmResetPassword} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="Mfa" component={MfaAuth} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="SignIn" component={SignIn} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
