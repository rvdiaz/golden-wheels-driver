import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoadingFirstScreen } from './header/loadingFirstScreen';
import { useReactiveVar } from '@apollo/client';
import { userData, userHydrated } from '~/store/user';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { HomeScreen } from '~/screens/home';
import { TripsScreen } from '~/screens/trips';
import { NotificationsScreen } from '~/screens/notifications';
import { ProfileScreen } from '~/screens/profile';
import { CustomTabBar } from './bottomBar';
import { GetStartedScreen } from '~/screens/welcome_screen';
import { AuthWrapper } from '~/screens/auth/authWrapper';
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

/**
 * The app is gated on authentication.
 *
 * Unlike the customer app this was forked from, a driver app has nothing to
 * show someone who isn't signed in — every screen needs a driver identity. So
 * auth is a full screen here, not the bottom-sheet modal the customer app opens
 * lazily when you tap a protected tab.
 *
 *   loading → welcome (first install only) → auth → ready
 */
export const Navigation = () => {
  const userInfo = useReactiveVar(userData);
  const hydrated = useReactiveVar(userHydrated);
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);

  useBookingNotificationListener();
  usePushNotificationTokenSetup();

  useEffect(() => {
    AsyncStorage.getItem(HAS_LAUNCHED_KEY)
      .then((hasLaunched) => setHasSeenWelcome(!!hasLaunched))
      // If storage is unreadable, skip the welcome rather than block the app.
      .catch(() => setHasSeenWelcome(true));
  }, []);

  const handleGetStarted = async () => {
    await AsyncStorage.setItem(HAS_LAUNCHED_KEY, 'true');
    setHasSeenWelcome(true);
  };

  // Wait for BOTH the launch flag and the stored-user read. Rendering before
  // hydration finishes shows the login screen for a frame to a driver who is
  // already signed in.
  if (hasSeenWelcome === null || !hydrated || userInfo?.loading) {
    return <LoadingFirstScreen />;
  }

  if (!hasSeenWelcome) {
    return <GetStartedScreen onGetStarted={handleGetStarted} />;
  }

  // No driver → nothing but the auth screen. Sign-out and token expiry both
  // clear userData, so both land back here with no extra wiring.
  if (!userInfo?.id) {
    return <AuthWrapper />;
  }

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
