import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { userData } from '~/store/user';
import { ModuleKeys } from '~/store/interface';
import {
  createNestedNavigationScreens,
  createTabNavigationBottomBar,
  getTenantRoutes,
} from '~/store/helpers';
import { AuthProvider } from '~/codidge_components/auth/context';
import { usePushNotificationTokenSetup } from '~/core_modules/auth/hooks/usePushNotificationToken';
import { CustomHeader } from './header/customHeader';
import { theme } from '~/theme/theme';
import { View } from 'react-native';
import { LoadingFirstScreen } from './header/loadingFirstScreen';
import { IAuthModuleKeys } from '~/codidge_components/auth/interfaces';
import { useGlobalSubscriptions } from '~/hooks/useGlobalSubscriptions';
import { AuthWrapper } from '~/core_modules/auth/authWrapper';
import { useTenant } from '~/store/tenant/useTenant';
import { ITenantModule } from '~/store/user/interfaces';
import { appModules, localMainModules } from '~/store/data/modules';
import { ITenant } from '~/store/tenant/interface';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs({
  tenantModules,
  onTabChange,
}: {
  tenantModules: ITenantModule[];
  onTabChange?: (routeName: ModuleKeys) => void;
}) {
  const bottomBarNavigation = createTabNavigationBottomBar(Tab, tenantModules);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Disable default header for tabs
        tabBarActiveTintColor: theme.colors.menuItemActive, // iOS blue
        tabBarInactiveTintColor: theme.colors.menuItemInactive, // iOS gray
        tabBarShowLabel: true,
      }}
      screenListeners={{
        state: (e) => {
          // Get the current tab route name
          const state = e.data.state;
          const currentRoute = state.routes[state.index];
          const currentRouteName = currentRoute?.name as ModuleKeys;

          if (currentRouteName && onTabChange) {
            onTabChange(currentRouteName);
          }
        },
      }}>
      {bottomBarNavigation}
    </Tab.Navigator>
  );
}

// Wrapper component that includes the custom header
function TabsWithCustomHeader({ tenantModules }: { tenantModules: ITenantModule[] }) {
  const [currentRouteName, setCurrentRouteName] = React.useState<ModuleKeys>(ModuleKeys.dashboard);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Disable default stack header
      }}>
      <Stack.Screen name="TabsContent">
        {({ navigation }) => {
          return (
            <View
              style={{
                backgroundColor: theme.colors.primary,
                flex: 1,
              }}>
              <CustomHeader
                navigation={navigation}
                route={currentRouteName}
                backgroundColor={theme.colors.headerBackground}
                textColor="#fff"
              />
              <BottomTabs
                tenantModules={tenantModules}
                onTabChange={(routeName) => {
                  setCurrentRouteName(routeName);
                }}
              />
            </View>
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export const Navigation = () => {
  const { tenantInfo, userInfo, loading } = useTenant();

  /*   useGlobalSubscriptions();
  usePushNotificationTokenSetup();
 */
  if (loading) {
    return <LoadingFirstScreen />;
  }

  const tempTenant: ITenant = {
    ...tenantInfo!,
    modules: [...appModules, ...localMainModules],
  };

  const tenantModules = getTenantRoutes(tempTenant);
  const nestedNav = createNestedNavigationScreens(tenantModules, Stack);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userInfo ? (
          <>
            <Stack.Screen name="MainTabs">
              {() => <TabsWithCustomHeader tenantModules={tenantModules} />}
            </Stack.Screen>
            {nestedNav}
          </>
        ) : (
          <>
            <Stack.Screen name="auth">
              {() => (
                <AuthProvider
                  defaultAuthScreen={userInfo === '' ? IAuthModuleKeys.signIn : undefined}>
                  <AuthWrapper />
                </AuthProvider>
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
