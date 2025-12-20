import { TypedNavigator } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { moduleScreens } from '../config';
import { IFeatureModule, ITenantModule } from '../user/interfaces';
import { ITenant } from '../tenant/interface';

export const localToolModules: IFeatureModule[] = [];

export const getTenantRoutes = (tenant: ITenant): ITenantModule[] => {
  const userModules = tenant?.modules ?? [];

  return userModules;
};

export const createNestedNavigationScreens = (
  modules: ITenantModule[],
  stack: TypedNavigator<any>
) => {
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
            initialParams={{ moduleData: mod }} // ✅ Pass module data here
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
              initialParams={{
                moduleData: feat,
                parentModule: mod, // ✅ Also pass parent module if needed
              }}
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
      component={moduleScreens[module.moduleKey].body}
      navigationKey={module.moduleKey}
      initialParams={{ moduleData: module }}
      options={{
        tabBarIcon: ({ color, size, focused }: any) => {
          let name = module.icon ?? 'home';

          if (focused) {
            name = module.activeIcon ?? module.icon ?? 'home';
          }

          return <Ionicons name={name as any} size={size} color={color} />;
        },
      }}
    />
  );
};

export const commonModules = () => [];
