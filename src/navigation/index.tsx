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
import { MortgageCalculatorScreen } from '~/custom_modules/tools/sections/mortgageCalculator';
import { NotificationButton } from '~/components/NotificationButton';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { NotificationsScreen } from '~/core_modules/notifications';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerRight: () => <NotificationButton navigation={navigation} />,
      })}>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CRM"
        component={CRMScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tools"
        component={ToolsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hammer-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

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
            <Stack.Screen name="MainTabs" component={BottomTabs} />

            {/* Tools sub-pages */}
            <Stack.Screen name="mortdageCalculator" component={MortgageCalculatorScreen} />
            <Stack.Screen name="propertyTools" component={PropertyInfoScreen} />
            <Stack.Screen name="prequalifiedTools" component={PrequalifiedLoanScreen} />
            <Stack.Screen name="ExpiredListing" component={ExpiredListingsScreen} />
            {/* Notifications */}
            <Stack.Screen name="Notifications" component={() => <NotificationsScreen />} />
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
