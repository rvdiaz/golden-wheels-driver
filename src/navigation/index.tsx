import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoadingFirstScreen } from './header/loadingFirstScreen';
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { HomeScreen } from '~/screens/home';
import { TripsScreen } from '~/screens/trips';
import { NotificationsScreen } from '~/screens/notifications';
import { ProfileScreen } from '~/screens/profile';
import { CustomTabBar } from './bottomBar';
import { GetStartedScreen } from '~/screens/welcome_screen';
import { activeTabVar, setActiveTab } from '~/store/navigationTabs';
import { usePushNotificationTokenSetup } from '~/screens/auth/hooks/usePushNotificationToken';
import { useBookingNotificationListener } from '~/screens/trips/hooks/useTripsNotifictions';

const Stack = createStackNavigator();
const HAS_LAUNCHED_KEY = 'gw_driver_has_launched1'; // driver app launch key

type TabName = 'Home' | 'Trips' | 'Notifications' | 'Account';

const SCREENS: Record<TabName, React.ComponentType<any>> = {
  Home: HomeScreen,
  Trips: TripsScreen,
  Notifications: NotificationsScreen,
  Account: ProfileScreen,
};

function TabsWithHeader() {
  const activeTab = useReactiveVar(activeTabVar);
  const ActiveScreen = SCREENS[activeTab];

  return (
    <BodyWrapper gradientCoverage={1}>
      <View style={styles.screenContainer}>
        <ActiveScreen onNavigateHome={() => setActiveTab('Home')} />
      </View>
      <CustomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </BodyWrapper>
  );
}

export const Navigation = () => {
  const userInfo = useReactiveVar(userData);
  const [appState, setAppState] = useState<'loading' | 'welcome' | 'ready'>('loading');

  useBookingNotificationListener();
  usePushNotificationTokenSetup();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem(HAS_LAUNCHED_KEY);
        if (!hasLaunched) {
          // First time ever — show welcome screen
          setAppState('welcome');
        } else {
          // Returning user — go straight to auth check
          setAppState('ready');
        }
      } catch {
        // If storage fails, skip welcome and go to auth
        setAppState('ready');
      }
    };

    checkFirstLaunch();
  }, []);

  const handleGetStarted = async () => {
    // Mark as launched so welcome never shows again
    await AsyncStorage.setItem(HAS_LAUNCHED_KEY, 'true');
    setAppState('ready');
  };

  // Still checking AsyncStorage or waiting for auth
  if (appState === 'loading' || userInfo?.loading) {
    return <LoadingFirstScreen />;
  }

  // First time launch
  if (appState === 'welcome') {
    return <GetStartedScreen onGetStarted={handleGetStarted} />;
  }

  // Returning user — now check auth
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabsWithHeader} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
});
