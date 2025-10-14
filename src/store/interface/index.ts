import { IImage } from '~/codidge_components/interfaces';

export enum ModuleKeys {
  dashboard = 'Dashboard',
  tasks = 'Tasks',
  crm = 'Crm',
  //tools
  tools = 'Tools',
  mortgageCalculator = 'MortgageCalculator',
  investmentCalculator = 'InvestmentCalculator',
  propertyEstimations = 'PropertyEstimations',
  propertyTools = 'PropertyTools',
  prequalifiedTools = 'PrequalifiedTools',
  expiredListing = 'ExpiredListing',
  cma = 'Cma',
  foreclosures = 'Foreclosures',
  openHouses = 'OpenHouses',
  iARolePlayTraining = 'AIRolePlayTraining',
  sellerNetSheet = 'SellerNetSheet',
  transUnionRentApplications = 'RentApplications',
  //training
  training = 'Training',
  trainingDetailPage = 'TrainingDetailPage',
  trainingCategories = 'TrainingCategories',
  trainingPrograms = 'TrainingPrograms',
  trainingModules = 'TrainingModules',
  trainingCourses = 'TrainingCourses',
  trainingDetailCourses = 'TrainingDetailCourses',
  //
  notifications = 'Notifications',
  contactDetals = 'ContactDetals',
  profile = 'Profile',
  income = 'Incomes',
  goals = 'Goals',
}

export interface IFeatureModule {
  label?: string;
  moduleKey: ModuleKeys;
  metaData?: any;
  description: string;
  icon: string;
  color: string;
  backgroundColor: string;
  available: boolean;
  comingSoon: boolean;
  modules?: IFeatureModule[];
}

export interface ITenantTheme {
  colorPalette: {
    primary: string;
  };
  logo: IImage;
  cover: IImage;
}

export interface ICommunications {
  email: string;
  phone: string;
}

export interface BusinessHour {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface IModule {
  label: string;
  moduleKey: ModuleKeys;
  path: string;
  type?: string;
  metaData: any;
  modules?: IFeatureModule[];
  icon?: string;
  isBottomBar?: boolean;
  customIcon?: string;
  comingSoon: boolean;
}

export enum StatusUser {
  invitado,
  activo,
  eliminado,
  bloqueado,
}

export interface IUser {
  email: string;
  phone: string;
  id: string;
  firstName: string;
  lastName: string;
  metaData: any;
  modules: IModule[];
  activeTemplateId: string;
  address: IUserAddress;
  /*  systemData: {
    tasksConfiguration: ITaskSchemaItem[];
  }; */
  profileSteps: {
    id: string;
    title: string;
    subSteps: string[];
  }[];
  profileSetupSkipped: boolean;
  hasSeenProfileCompletionCongrats: boolean;
  financialGoals: IFinancialGoals;
  swotAnalysis: ISWOTAnalysis;
  visionMission: IVisionMission;
}

export interface IFinancialGoals {
  avgCommissionByRents: number;
  avgCommissionBySales: number;
  desiredAnnualIncome: number;
}

export interface ISWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface IVisionMission {
  statement: string;
  drivesYou: string;
  oneYear: string;
  fiveYear: string;
}

export interface IUserAddress {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
}
