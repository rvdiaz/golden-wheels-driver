/* import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBarIcon } from '~/components/TabBarIcon';
import { AuthNavigator } from './authNavigator';
import { ITenantModule } from '~/store/interface';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabNavigator = () => {
  const bottomModules = modules
    .filter((module) => module.navigationType === 'bottom')
    .sort((a, b) => a.position - b.position);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const module = bottomModules.find((m) => m.name === route.name);
          return (
            <TabBarIcon name={module?.icon || 'Home'} focused={focused} color={color} size={size} />
          );
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
      })}>
      {bottomModules.map((module) => (
        <Tab.Screen key={module.id} name={module.name} component={createModuleNavigator(module)} />
      ))}
    </Tab.Navigator>
  );
};

const createModuleNavigator = (module: ITenantModule) => {
  if (!module.modules || module.modules.length === 0) {
    return module.modules;
  }

  const ModuleStack = createStackNavigator();

  return () => (
    <ModuleStack.Navigator>
      <ModuleStack.Screen
        name={`${module.moduleKey}Main`}
        component={module.component}
        options={{ headerShown: false }}
      />
      {module.modules?.map((route) => (
        <ModuleStack.Screen
          key={route.moduleKey}
          name={route.label ?? ''}
          component={route.component}
          options={{ headerShown: true }}
        />
      ))}
    </ModuleStack.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, isLoading, requiresMfa, requiresPasswordChange } = useAuth();

  if (isLoading) {
    return null; // You could add a loading screen here
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  if (requiresMfa) {
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  if (requiresPasswordChange) {
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  const drawerModules = modules
    .filter((module) => module.navigationType === 'drawer')
    .sort((a, b) => a.position - b.position);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} modules={drawerModules} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: 'white',
            width: 280,
          },
        }}>
        <Drawer.Screen name="MainTabs" component={BottomTabNavigator} />
        {drawerModules.map((module) => (
          <Drawer.Screen
            key={module.id}
            name={module.name}
            component={createModuleNavigator(module)}
          />
        ))}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
 */
