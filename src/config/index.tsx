import { ProfileScreen } from '~/core_modules/profile';
import { CRMScreen } from '~/custom_modules/crm';
import { ContactDetailsScreen } from '~/custom_modules/crm/widgets/contactDetail';
import { Dashboard } from '~/custom_modules/dashboard';
import { ScheduleScreen } from '~/custom_modules/schedule';
import { TasksScreen } from '~/custom_modules/task';
import { AddTaskScreen } from '~/custom_modules/task/widgets/addTask';
import { ToolsScreen } from '~/custom_modules/tools';
import { ExpiredListingPage } from '~/custom_modules/tools/sections/mls_listing/expired_listing';
import { MortgageCalculatorScreen } from '~/custom_modules/tools/sections/mortgage_calculator';
import { PropertyInfoScreen } from '~/custom_modules/tools/sections/owner_property_details';
import { PrequalifiedLoanScreen } from '~/custom_modules/tools/sections/pre_qualified_tools';
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
