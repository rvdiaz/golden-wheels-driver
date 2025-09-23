import { TypedNavigator } from '@react-navigation/native';
import { IModule, IUser } from '../interface';
import { Ionicons } from '@expo/vector-icons';
import { moduleScreens } from '../config';
import { Image } from 'react-native';

export const getTenantRoutes = (user: IUser | null) => {
  const userModules = user?.modules ?? [];

  return userModules;
};

export const customIcons: Record<string, { active: any; inactive: any }> = {
  dashboard: {
    active: require('assets/icons/dashboard-active.png'),
    inactive: require('assets/icons/dashboard-inactive.png'),
  },
  task: {
    active: require('assets/icons/task-active.png'),
    inactive: require('assets/icons/task-inactive.png'),
  },
  crm: {
    active: require('assets/icons/crm-active.png'),
    inactive: require('assets/icons/crm-inactive.png'),
  },
  tools: {
    active: require('assets/icons/tools-active.png'),
    inactive: require('assets/icons/tools-inactive.png'),
  },
  training: {
    active: require('assets/icons/training-active.png'),
    inactive: require('assets/icons/training-inactive.png'),
  },
};

export const createNestedNavigationScreens = (modules: IModule[], stack: TypedNavigator<any>) => {
  return modules.flatMap((mod) => {
    const screens: React.ReactNode[] = [];

    if (!moduleScreens[mod.moduleKey]?.body) {
      console.log(':::', mod.moduleKey);
    }

    // 1️⃣ Add main module if it does NOT have bottom tab navigation
    if (!mod.isBottomBar) {
      const Comp = moduleScreens[mod.moduleKey];

      if (Comp) {
        screens.push(
          <stack.Screen
            key={mod.moduleKey}
            name={mod.moduleKey}
            component={moduleScreens[mod.moduleKey]?.body}
            options={{ title: mod.label ?? mod.moduleKey }}
          />
        );
      }
    }

    // 2️⃣ Add nested feature modules
    if (mod.modules && mod.modules.length > 0) {
      mod.modules.forEach((feat) => {
        const FeatureComp = moduleScreens[feat.moduleKey]?.body;
        if (FeatureComp) {
          screens.push(
            <stack.Screen
              key={feat.moduleKey}
              name={feat.moduleKey}
              component={FeatureComp}
              options={{ title: feat.label ?? feat.moduleKey }}
            />
          );
        }
      });
    }

    return screens;
  });
};

export const createTabNavigationBottomBar = (tab: TypedNavigator<any>, modules: IModule[]) => {
  return modules.map((mod) => mod.isBottomBar && createTabNavigationItem(tab, mod));
};

export const createTabNavigationItem = (tab: TypedNavigator<any>, module: IModule) => {
  return (
    <tab.Screen
      key={module.moduleKey}
      name={module.label ?? ''}
      component={moduleScreens[module.moduleKey].body}
      navigationKey={module.moduleKey}
      options={{
        tabBarIcon: ({ color, size, focused }: any) => {
          if (module.customIcon) {
            const { active, inactive } = customIcons[module.customIcon];

            return (
              <Image
                source={focused ? active : inactive}
                style={{ width: size, height: size, marginBottom: 2, resizeMode: 'contain' }}
              />
            );
          }
          return <Ionicons name={(module.icon ?? 'home') as any} size={size} color={color} />;
        },
      }}
    />
  );
};

export const commonModules = () => [];
