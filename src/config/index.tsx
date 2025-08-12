import { ProfileScreen } from '~/core_modules/profile';
import { CRMScreen } from '~/custom_modules/crm';
import { ContactDetailsScreen } from '~/custom_modules/crm/sections/addContactForm';
import { Dashboard } from '~/custom_modules/dashboard';
import { ScheduleScreen } from '~/custom_modules/schedule';
import { TasksScreen } from '~/custom_modules/task';
import { AddTaskScreen } from '~/custom_modules/task/sections/addTask';
import { ToolsScreen } from '~/custom_modules/tools';
import { ExpiredListingsScreen } from '~/custom_modules/tools/sections/expiredListing';
import { MortgageCalculatorScreen } from '~/custom_modules/tools/sections/mortgageCalculator';
import { PrequalifiedLoanScreen } from '~/custom_modules/tools/sections/prequalifiedTools';
import { PropertyInfoScreen } from '~/custom_modules/tools/sections/propertyDetails';
import { TrainingScreen } from '~/custom_modules/training';
import { CourseDetailsScreen } from '~/custom_modules/training/sections/CourseDetailsScreen';
import { VideoPlayerScreen } from '~/custom_modules/training/sections/VideoPlayerScreen';

export interface ModuleConfig {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
  navigationType: 'bottom' | 'drawer';
  routes?: RouteConfig[];
  position: number;
}

export interface RouteConfig {
  name: string;
  component: React.ComponentType<any>;
  options?: any;
}

export interface AppModule {
  config: ModuleConfig;
  screens: { [key: string]: React.ComponentType<any> };
}

export const modules: ModuleConfig[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: 'BarChart3',
    component: Dashboard,
    navigationType: 'bottom',
    position: 0,
  },
  {
    id: 'crm',
    name: 'CRM',
    icon: 'Users',
    component: CRMScreen,
    navigationType: 'bottom',
    position: 1,
    routes: [
      {
        name: 'ContactDetails',
        component: ContactDetailsScreen,
      },
    ],
  },
  {
    id: 'tasks',
    name: 'Tasks',
    icon: 'CheckSquare',
    component: TasksScreen,
    navigationType: 'bottom',
    position: 2,
    routes: [
      {
        name: 'AddTask',
        component: AddTaskScreen,
      },
    ],
  },
  {
    id: 'schedule',
    name: 'Schedule',
    icon: 'Calendar',
    component: ScheduleScreen,
    navigationType: 'bottom',
    position: 3,
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: 'Bell',
    component: require('../modules/Notifications/NotificationsScreen').NotificationsScreen,
    navigationType: 'drawer',
    position: 3,
  },
  {
    id: 'profile',
    name: 'Profile',
    icon: 'User',
    component: ProfileScreen,
    navigationType: 'drawer',
    position: 4,
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: 'Calculator',
    component: ToolsScreen,
    navigationType: 'drawer',
    position: 5,
    routes: [
      {
        name: 'MortgageCalculator',
        component: MortgageCalculatorScreen,
      },
      {
        name: 'PrequalifiedLoan',
        component: PrequalifiedLoanScreen,
      },
      {
        name: 'PropertyInfo',
        component: PropertyInfoScreen,
      },
      {
        name: 'ExpiredListings',
        component: ExpiredListingsScreen,
      },
    ],
  },
  {
    id: 'training',
    name: 'Training',
    icon: 'GraduationCap',
    component: TrainingScreen,
    navigationType: 'drawer',
    position: 6,
    routes: [
      {
        name: 'CourseDetails',
        component: CourseDetailsScreen,
      },
      {
        name: 'VideoPlayer',
        component: VideoPlayerScreen,
      },
    ],
  },
];
