import { TypedNavigator } from '@react-navigation/native';
import { ITenantModule, IUser, ModuleKeys } from '../interface';
import { Ionicons } from '@expo/vector-icons';
import { moduleScreens } from '../config';

export const getTenantRoutes = (user: IUser | null) => {
  //  const modules = user?.tenantModules ?? [];

  const modules: ITenantModule[] = [
    {
      label: 'Dashboard',
      moduleKey: ModuleKeys.dashboard,
      path: '/dashboard',
      type: 'main',
      metaData: '{}',
      icon: 'home-outline',
      isBottomBar: true,
    },
    {
      label: 'Tasks',
      moduleKey: ModuleKeys.tasks,
      path: '/tasks',
      type: 'main',
      metaData: '{}',
      icon: 'calendar-outline',
      isBottomBar: true,
    },
    {
      label: 'Profile',
      moduleKey: ModuleKeys.profile,
      path: '/profile',
      type: 'main',
      metaData: '{}',
      icon: 'calendar-outline',
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
    },
    {
      label: 'Tools',
      moduleKey: ModuleKeys.tools,
      path: '/tools',
      type: 'main',
      metaData: '{}',
      icon: 'hammer-outline',
      isBottomBar: true,
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

export const createNestedNavigationScreens = (
  modules: ITenantModule[],
  stack: TypedNavigator<any>
) => {
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
            component={moduleScreens[mod.moduleKey]}
            options={{ title: mod.label ?? mod.moduleKey }}
          />
        );
      }
    }

    // 2️⃣ Add nested feature modules
    if (mod.modules && mod.modules.length > 0) {
      mod.modules.forEach((feat) => {
        const FeatureComp = moduleScreens[feat.moduleKey];
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

export const createTabNavigationBottomBar = (
  tab: TypedNavigator<any>,
  modules: ITenantModule[]
) => {
  return modules.map((mod) => mod.isBottomBar && createTabNavigationItem(tab, mod));
};

export const createTabNavigationItem = (tab: TypedNavigator<any>, module: ITenantModule) => {
  return (
    <tab.Screen
      key={module.moduleKey}
      name={module.label ?? ''}
      component={moduleScreens[module.moduleKey]}
      options={{
        tabBarIcon: ({ color, size }: any) => (
          <Ionicons name={(module.icon ?? 'home') as any} size={size} color={color} />
        ),
      }}
    />
  );
};

export const commonModules = () => [];
