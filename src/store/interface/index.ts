import { IImage } from '~/codidge_components/interfaces';
import { GoalType } from '~/custom_modules/task/interfaces';

export enum ModuleKeys {
  dashboard = 'Dashboard',
  tasks = 'Tasks',
  crm = 'Crm',
  tools = 'Tools',
  training = 'Training',
  mortgageCalculator = 'MortgageCalculator',
  investmentCalculator = 'InvestmentCalculator',
  propertyEstimations = 'PropertyEstimations',
  propertyTools = 'PropertyTools',
  prequalifiedTools = 'PrequalifiedTools',
  expiredListing = 'ExpiredListing',
  notifications = 'Notifications',
  trainingDetailPage = 'TrainingDetailPage',
  contactDetals = 'ContactDetals',
  profile = 'Profile',
  income = 'Incomes',
  transUnionRentApplications = 'RentApplications',
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
  systemData: {
    tasksConfiguration: ITaskSchemaItem[];
  };
  profileSteps: {
    id: string;
    title: string;
    subSteps: string[];
  }[];
  profileSetupSkipped: boolean;
  hasSeenProfileCompletionCongrats: boolean;
}

export interface ITaskSchemaItem {
  label: string;
  description: string;
  key: string;
  fields: GoalType[];
  goalKey?: string;
  goalType?: string; // new: type of the tracked data
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
