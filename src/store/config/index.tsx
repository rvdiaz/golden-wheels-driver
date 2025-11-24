import { ModuleKeys } from '../interface';
import { Dashboard } from '~/custom_modules/dashboard';
import { TasksScreen } from '~/custom_modules/task';
import { CRMScreen } from '~/custom_modules/crm';
import { ToolsScreen } from '~/custom_modules/tools';
import { MortgageCalculatorScreen } from '~/custom_modules/tools/sections/mortgage_calculator';
import { NotificationsScreen } from '~/core_modules/notifications';
import { ContactDetailsScreen } from '~/custom_modules/crm/widgets/contactDetail';
import { CourseDetailsScreen } from '~/custom_modules/training/sections/CourseDetailsScreen';
import { ProfileScreen } from '~/core_modules/profile';
import { PropertyInfoScreen } from '~/custom_modules/tools/sections/owner_property_details';
import { UserIncomes } from '~/core_modules/profile/income';
import { ExpiredListingPage } from '~/custom_modules/tools/sections/mls_listing/expired_listing';
import { QuoteWidget } from '~/custom_modules/dashboard/widgets/quoteWidget';
import { DailyTaskSelector } from '~/custom_modules/task/widgets/dailyTaskSelector';
import { SearchCrmBoxIA } from '~/custom_modules/crm/widgets/searchCrmIABox';
import { TransunionRentsApplications } from '~/custom_modules/tools/sections/transunion_rent_applications';
import { PropertyEstimationsPage } from '~/custom_modules/tools/sections/property_estimations';
import { GoalsScreen } from '~/core_modules/profile/goals';
import { PrequalifiedLoanScreen } from '~/custom_modules/tools/sections/loan_prequalification';
import InvestmentCalculatorScreen from '~/custom_modules/tools/sections/investment_calculator';
import { CmaComparativesPage } from '~/custom_modules/tools/sections/cma_tools';
import { ForeClosuresPage } from '~/custom_modules/tools/sections/foreclosures';
import { OpenHousesPage } from '~/custom_modules/tools/sections/openHouses';
import { SellerNetSheetPage } from '~/custom_modules/tools/sections/sellerNetSheet';
import { IARolePlayingPage } from '~/custom_modules/tools/sections/ia_role_playing';
import { TrainingProgramsScreen } from '~/custom_modules/training/sections/programs/programsList';
import { TrainingCategoriesScreen } from '~/custom_modules/training/sections/categories/categoriesList';
import { TrainingModulesScreen } from '~/custom_modules/training/sections/modules/modulesList';
import { TrainingCoursesScreen } from '~/custom_modules/training/sections/courses/coursesList';
import EstimatedClosingCostCalculator from '~/custom_modules/tools/sections/estimatedClosingCost';
import { IncomeCalculatorPage } from '~/custom_modules/tools/sections/income_calculator';
import { PrivacyPolicyScreen } from '~/core_modules/profile/privacyPolicy';
import { FeedbacksScreen } from '~/core_modules/profile/feedbacks';
import { UserDeletionScreen } from '~/core_modules/profile/userDeletion';
import { TrainingCourseDetailScreen } from '~/custom_modules/training/sections/courses/courseDetailScreen';

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
    bottomHeader: QuoteWidget,
  },
  Tasks: {
    body: TasksScreen,
    bottomHeader: DailyTaskSelector,
  },
  Crm: {
    body: CRMScreen,
    bottomHeader: SearchCrmBoxIA,
  },
  //Training
  Training: {
    body: TrainingModulesScreen,
  },
  TrainingDetailPage: {
    body: CourseDetailsScreen,
  },
  TrainingPrograms: {
    body: TrainingProgramsScreen,
  },
  TrainingCategories: {
    body: TrainingCategoriesScreen,
  },
  TrainingModules: {
    body: TrainingModulesScreen,
  },
  TrainingCourses: {
    body: TrainingCoursesScreen,
  },
  TrainingDetailCourses: {
    body: TrainingCourseDetailScreen,
  },
  //Tools
  Tools: {
    body: ToolsScreen,
  },
  RentApplications: {
    body: TransunionRentsApplications,
  },
  MortgageCalculator: {
    body: MortgageCalculatorScreen,
  },
  PrequalifiedTools: {
    body: PrequalifiedLoanScreen,
  },
  InvestmentCalculator: {
    body: InvestmentCalculatorScreen,
  },
  PropertyTools: {
    body: PropertyInfoScreen,
  },
  ExpiredListing: {
    body: ExpiredListingPage,
  },
  PropertyEstimations: {
    body: PropertyEstimationsPage,
  },
  Cma: {
    body: CmaComparativesPage,
  },
  Foreclosures: {
    body: ForeClosuresPage,
  },
  OpenHouses: {
    body: OpenHousesPage,
  },
  AIRolePlayTraining: {
    body: IARolePlayingPage,
  },
  SellerNetSheet: {
    body: SellerNetSheetPage,
  },
  EstimatedClosingCost: {
    body: EstimatedClosingCostCalculator,
  },
  IncomeCalculator: {
    body: IncomeCalculatorPage,
  },
  //Notifications
  Notifications: {
    body: NotificationsScreen,
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
  Goals: {
    body: GoalsScreen,
  },
  PrivacyPolicy: {
    body: PrivacyPolicyScreen,
  },
  FeedBack: {
    body: FeedbacksScreen,
  },
  AccountDeletion: {
    body: UserDeletionScreen,
  },
};
