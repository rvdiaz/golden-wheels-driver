import { ModuleKeys } from '../interface';
import { ITenantModule } from '../user/interfaces';

export const appModules: ITenantModule[] = [
  {
    label: 'Dashboard',
    moduleKey: ModuleKeys.dashboard,
    path: '/dashboard',
    type: 'main',
    metaData: '{}',
    icon: 'home-outline',
    activeIcon: 'home',
    isBottomBar: true,
  },
  {
    label: 'Inventory',
    moduleKey: ModuleKeys.inventory,
    path: '/inventory',
    type: 'main',
    metaData: '{}',
    icon: 'cube-outline',
    activeIcon: 'cube',
    isBottomBar: true,
    modules: [
      {
        moduleKey: ModuleKeys.products,
        label: 'Products',
        icon: '🍽️',
        color: '#10B981',
        modules: [
          /*{
            moduleKey: ProductModules.variants,
            modules: [],
            label: "Variants",
            metaData: {},
          },
          {
            moduleKey: ProductModules.pricing,
            modules: [],
            label: "Pricing",
            metaData: {},
          },
           {
            moduleKey: ProductModules.metafields,
            modules: [],
            label: "Metafields",
            metaData: {},
          }, */
        ],
        metaData: {},
      },
      {
        moduleKey: ModuleKeys.producategories,
        label: 'Category',
        modules: [],
        icon: '📁',
        metaData: {},
        color: '#3B82F6',
      },
      {
        moduleKey: ModuleKeys.modifiers,
        label: 'Modifiers',
        modules: [],
        icon: '⚙️',
        metaData: {},
        color: '#F59E0B',
      },
    ],
  },
  {
    label: 'Customers',
    moduleKey: ModuleKeys.customers,
    path: '/customers',
    type: 'main',
    metaData: '{}',
    icon: 'people-outline',
    activeIcon: 'people',
    isBottomBar: true,
  },
];

export const localMainModules: ITenantModule[] = [
  {
    label: 'Profile',
    moduleKey: ModuleKeys.profile,
    path: '/profile',
    type: 'main',
    metaData: {},
    modules: [
      {
        label: 'Feedback',
        moduleKey: ModuleKeys.feedBack,
        metaData: {},
        modules: [],
      },
      {
        label: 'Account',
        moduleKey: ModuleKeys.accountDeletion,
        metaData: {},
        modules: [],
      },
    ],
  },
];
