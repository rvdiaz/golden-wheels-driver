import React, { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Notifications from 'expo-notifications';

// App modules screens
import { userData } from '~/store/user';
import { pushTokenVar, setPushToken } from '~/store/user/pushToken';
import { IModule, ModuleKeys } from '~/store/interface';
import {
  createNestedNavigationScreens,
  createTabNavigationBottomBar,
  getTenantRoutes,
} from '~/store/helpers';
import { AuthFormWrapper } from '~/core_modules/auth';
import { AuthProvider } from '~/codidge_components/auth/context';
import { CustomHeader } from './header/customHeader';
import { theme } from '~/theme/theme';
import { View } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs({
  tenantModules,
  onTabChange,
}: {
  tenantModules: IModule[];
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
function TabsWithCustomHeader({ tenantModules }: { tenantModules: IModule[] }) {
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

const getPushNotificationToken = async () => {
  // assume it is a physical device
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  // Get the token that uniquely identifies this device
  const tokenData = await Notifications.getDevicePushTokenAsync();
  console.log('Push notification token:', tokenData);
  return tokenData;
}

export default function Navigation() {
  const userInfo = useReactiveVar(userData);

  const tenantModules = getTenantRoutes(userInfo);
  const nestedNav = createNestedNavigationScreens(tenantModules, Stack);
  const pushToken = useReactiveVar(pushTokenVar);

  useEffect(() => {
    (async () => {
      if (!pushToken) {
        const tokenData = await getPushNotificationToken();
        if (tokenData?.data) {
          setPushToken(tokenData.data);
        }
      }
    })();
  }, [pushToken]);

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
