import { ModuleKeys } from '../interface';
import { Dashboard } from '~/custom_modules/dashboard';
import { TasksScreen } from '~/custom_modules/task';
import { CRMScreen } from '~/custom_modules/crm';
import { ToolsScreen } from '~/custom_modules/tools';
import { TrainingScreen } from '~/custom_modules/training';
import { MortgageCalculatorScreen } from '~/custom_modules/tools/sections/mortgage_calculator';
import { ExpiredListingsScreen } from '~/custom_modules/tools/sections/expiredListing';
import { NotificationsScreen } from '~/core_modules/notifications';
import { ContactDetailsScreen } from '~/custom_modules/crm/widgets/contactDetail';
import { CourseDetailsScreen } from '~/custom_modules/training/sections/CourseDetailsScreen';
import { ProfileScreen } from '~/core_modules/profile';
import { PropertyInfoScreen } from '~/custom_modules/tools/sections/owner_property_details';
import { PrequalifiedLoanScreen } from '~/custom_modules/tools/sections/pre_qualified_tools';
import { UserIncomes } from '~/core_modules/profile/income/widgets';
import { PropertyEstimationsPage } from '~/custom_modules/tools/sections/propertyEstimations';

export const moduleScreens: Record<ModuleKeys, React.ComponentType<any>> = {
  Dashboard: Dashboard,
  Tasks: TasksScreen,
  CRM: CRMScreen,
  Tools: ToolsScreen,
  Training: TrainingScreen,

  // Feature modules (examples)
  MortgageCalculator: MortgageCalculatorScreen,
  PropertyTools: PropertyInfoScreen,
  PrequalifiedTools: PrequalifiedLoanScreen,
  ExpiredListing: ExpiredListingsScreen,
  Notifications: NotificationsScreen,
  TrainingDetailPage: CourseDetailsScreen,
  ContactDetals: ContactDetailsScreen,
  Profile: ProfileScreen,
  Incomes: UserIncomes,
  PropertyEstimations: PropertyEstimationsPage,
};
