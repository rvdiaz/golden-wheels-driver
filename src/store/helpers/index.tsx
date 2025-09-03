import { TypedNavigator } from '@react-navigation/native';
import { IModule, IUser, ModuleKeys } from '../interface';
import { Ionicons } from '@expo/vector-icons';
import { moduleScreens } from '../config';
import { Image } from 'react-native';

export const getTenantRoutes = (user: IUser | null) => {
  //  const modules = user?.tenantModules ?? [];

  const modules: IModule[] = [
    {
      label: 'Dashboard',
      moduleKey: ModuleKeys.dashboard,
      path: '/dashboard',
      type: 'main',
      metaData: '{}',
      icon: 'home-outline',
      isBottomBar: true,
      customIcon: 'dashboard',
    },
    {
      label: 'Tasks',
      moduleKey: ModuleKeys.tasks,
      path: '/tasks',
      type: 'main',
      metaData: '{}',
      icon: 'calendar-outline',
      isBottomBar: true,
      customIcon: 'task',
    },
    {
      label: 'Profile',
      moduleKey: ModuleKeys.profile,
      path: '/profile',
      type: 'main',
      metaData: '{}',
      icon: 'calendar-outline',
      modules: [
        {
          label: 'Income',
          moduleKey: ModuleKeys.income,
          metaData: {},
        },
      ],
    },
    {
      label: 'Notifications',
      moduleKey: ModuleKeys.notifications,
      path: '/notifications',
      type: 'main',
      metaData: '{}',
      icon: 'calendar-outline',
    },
    {
      label: 'CRM',
      moduleKey: ModuleKeys.crm,
      path: '/crm',
      type: 'main',
      metaData: '{}',
      icon: 'people-outline',
      modules: [
        {
          label: 'Contact Details',
          moduleKey: ModuleKeys.contactDetals,
          metaData: {},
        },
      ],
      isBottomBar: true,
      customIcon: 'crm',
    },
    {
      label: 'Tools',
      moduleKey: ModuleKeys.tools,
      path: '/tools',
      type: 'main',
      metaData: '{}',
      icon: 'hammer-outline',
      isBottomBar: true,
      customIcon: 'tools',
      modules: [
        {
          label: 'Mortgage Calculator',
          moduleKey: ModuleKeys.mortgageCalculator,
          metaData: {},
        },
        {
          label: 'Property Tools',
          moduleKey: ModuleKeys.propertyTools,
          metaData: {},
        },
        {
          label: 'Prequalified Loan',
          moduleKey: ModuleKeys.prequalifiedTools,
          metaData: {},
        },
        {
          label: 'Expired Listings',
          moduleKey: ModuleKeys.expiredListing,
          metaData: {},
        },
        {
          label: 'Quick CMA Tool',
          moduleKey: ModuleKeys.propertyEstimations,
          metaData: {},
        },
      ],
    },
    {
      label: 'Training',
      moduleKey: ModuleKeys.training,
      path: '/training',
      type: 'main',
      metaData: '{}',
      icon: 'school',
      isBottomBar: true,
      customIcon: 'training',
      modules: [
        {
          label: 'Course Details',
          moduleKey: ModuleKeys.trainingDetailPage,
          metaData: {},
        },
      ],
    },
  ];

  return modules;
};

export const customIcons: Record<string, { active: any; inactive: any }> = {
  dashboard: {
    active: require('../../assets/icons/dashboard-active.png'),
    inactive: require('../../assets/icons/dashboard-inactive.png'),
  },
  task: {
    active: require('../../assets/icons/task-active.png'),
    inactive: require('../../assets/icons/task-inactive.png'),
  },
  crm: {
    active: require('../../assets/icons/crm-active.png'),
    inactive: require('../../assets/icons/crm-inactive.png'),
  },
  tools: {
    active: require('../../assets/icons/tools-active.png'),
    inactive: require('../../assets/icons/tools-inactive.png'),
  },
  training: {
    active: require('../../assets/icons/training-active.png'),
    inactive: require('../../assets/icons/training-inactive.png'),
  },
};

export const createNestedNavigationScreens = (modules: IModule[], stack: TypedNavigator<any>) => {
  return modules.flatMap((mod) => {
    const screens: React.ReactNode[] = [];

    // 1️⃣ Add main module if it does NOT have bottom tab navigation
    if (!mod.isBottomBar) {
      const Comp = moduleScreens[mod.moduleKey];
      if (Comp) {
        screens.push(
          <stack.Screen
            key={mod.moduleKey}
            name={mod.moduleKey}
            component={moduleScreens[mod.moduleKey].body}
            options={{ title: mod.label ?? mod.moduleKey }}
          />
        );
      }
    }

    // 2️⃣ Add nested feature modules
    if (mod.modules && mod.modules.length > 0) {
      mod.modules.forEach((feat) => {
        const FeatureComp = moduleScreens[feat.moduleKey].body;
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
