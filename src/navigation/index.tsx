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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TopBar } from './topBarNavigation';
import { ITenantModule } from '~/store/interface';
import {
  createNestedNavigationScreens,
  createTabNavigationBottomBar,
  getTenantRoutes,
} from '~/store/helpers';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs({ tenantModules }: { tenantModules: ITenantModule[] }) {
  const bottomBarNavigation = createTabNavigationBottomBar(Tab, tenantModules);

  return <Tab.Navigator screenOptions={TopBar}>{bottomBarNavigation}</Tab.Navigator>;
}

export default function Navigation() {
  const userInfo = useReactiveVar(userData);

  // Tenant-specific dynamic screens (like in web)
  const tenantModules = getTenantRoutes(userInfo);

  const nestedNav = createNestedNavigationScreens(tenantModules, Stack);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userInfo ? (
          // Authenticated stack
          <>
            {/* <Stack.Screen name="MainTabs" component={() => BottomTabs(tenantModules)} /> */}
            <Stack.Screen name="MainTabs">
              {() => <BottomTabs tenantModules={tenantModules} />}
            </Stack.Screen>
            {nestedNav}
          </>
        ) : (
          // Public/auth stack
          <>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="ForcePasswordChange" component={ForcePasswordChange} />
            <Stack.Screen name="ConfirmResetPassword" component={ConfirmResetPassword} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="Mfa" component={MfaAuth} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
