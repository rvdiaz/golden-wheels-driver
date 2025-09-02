import { ModuleKeys } from '../interface';
import { Dashboard } from '~/custom_modules/dashboard';
import { TasksScreen } from '~/custom_modules/task';
import { CRMScreen } from '~/custom_modules/crm';
import { ToolsScreen } from '~/custom_modules/tools';
import { TrainingScreen } from '~/custom_modules/training';
import { MortgageCalculatorScreen } from '~/custom_modules/tools/sections/mortgage_calculator';
import { NotificationsScreen } from '~/core_modules/notifications';
import { ContactDetailsScreen } from '~/custom_modules/crm/widgets/contactDetail';
import { CourseDetailsScreen } from '~/custom_modules/training/sections/CourseDetailsScreen';
import { ProfileScreen } from '~/core_modules/profile';
import { PropertyInfoScreen } from '~/custom_modules/tools/sections/owner_property_details';
import { PrequalifiedLoanScreen } from '~/custom_modules/tools/sections/pre_qualified_tools';
import { UserIncomes } from '~/core_modules/profile/income/widgets';
import { PropertyEstimationsPage } from '~/custom_modules/tools/sections/propertyEstimations';
import { ExpiredListingPage } from '~/custom_modules/tools/sections/mls_listing/expired_listing';
import { DashboardBottomHeader } from '~/custom_modules/dashboard/widgets/headers';
import { DailyTaskSelector } from '~/custom_modules/task/widgets/dailyTaskSelector';

export const moduleScreens: Record<
  ModuleKeys,
  {
    body: React.ComponentType<any>;
    rightHeader?: React.ComponentType<any>;
    bottomHeader?: React.ComponentType<any>;
  }
> = {
  Dashboard: {
    body: Dashboard,
    bottomHeader: DashboardBottomHeader,
  },
  Tasks: {
    body: TasksScreen,
    bottomHeader: DailyTaskSelector,
  },
  CRM: {
    body: CRMScreen,
  },
  Tools: {
    body: ToolsScreen,
  },
  Training: {
    body: TrainingScreen,
  },
  MortgageCalculator: {
    body: MortgageCalculatorScreen,
  },
  PropertyTools: {
    body: PropertyInfoScreen,
  },
  PrequalifiedTools: {
    body: PrequalifiedLoanScreen,
  },
  ExpiredListing: {
    body: ExpiredListingPage,
  },
  Notifications: {
    body: NotificationsScreen,
  },
  TrainingDetailPage: {
    body: CourseDetailsScreen,
  },
  ContactDetals: {
    body: ContactDetailsScreen,
  },
  Profile: {
    body: ProfileScreen,
  },
  Incomes: {
    body: UserIncomes,
  },
  PropertyEstimations: {
    body: PropertyEstimationsPage,
  },
};
