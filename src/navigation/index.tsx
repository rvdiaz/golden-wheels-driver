import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// App modules screens
import { userData } from '~/store/user';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TopBar } from './topBarNavigation';
import { IModule } from '~/store/interface';
import {
  createNestedNavigationScreens,
  createTabNavigationBottomBar,
  getTenantRoutes,
} from '~/store/helpers';
import { AuthFormWrapper } from '~/core_modules/auth';
import { AuthProvider } from '~/codidge_components/auth/context';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs({ tenantModules }: { tenantModules: IModule[] }) {
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
        {userInfo ? (
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
            <Stack.Screen name="Auth">
              {() => (
                <AuthProvider>
                  <AuthFormWrapper />
                </AuthProvider>
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
