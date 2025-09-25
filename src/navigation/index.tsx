import React, { useEffect, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// App modules screens
import { userData } from '~/store/user';
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
import { OnboardingFlow } from '~/core_modules/on_boarding';
import { LoadingSpinner } from '~/codidge_components/UI/loading/loadingSpinner';

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

export default function Navigation() {
  const userInfo = useReactiveVar(userData);

  const tenantModules = getTenantRoutes(userInfo);
  const nestedNav = createNestedNavigationScreens(tenantModules, Stack);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingLoading, setOnboardingLoading] = useState(true);

  useEffect(() => {
    if (userInfo) {
      checkOnboardingStatus();
    } else {
      setOnboardingLoading(false);
    }
  }, [userInfo]);

  const checkOnboardingStatus = async () => {
    try {
      const isCompleted = false;
      setShowOnboarding(!isCompleted);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setShowOnboarding(false);
    } finally {
      setOnboardingLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (onboardingLoading) {
    return <LoadingSpinner />;
  }

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
            {showOnboarding ? (
              <Stack.Screen name="Auth">
                {() => (
                  <AuthProvider>
                    <AuthFormWrapper />
                  </AuthProvider>
                )}
              </Stack.Screen>
            ) : (
              <Stack.Screen name="Onboarding">
                {() => <OnboardingFlow onComplete={handleOnboardingComplete} />}
              </Stack.Screen>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
