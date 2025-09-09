import { IImage } from '~/codidge_components/interfaces';

export enum ModuleKeys {
  dashboard = 'Dashboard',
  tasks = 'Tasks',
  crm = 'CRM',
  tools = 'Tools',
  training = 'Training',
  mortgageCalculator = 'MortgageCalculator',
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
  /*   contentGallery = "contentGallery", */
}

export interface IFeatureModule {
  label?: string;
  moduleKey: ModuleKeys;
  metaData: any;
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
  name: string;
  metaData: any;
  modules: IModule[];
  activeTemplateId: string;
  address: IUserAddress;
  systemData: {
    tasksConfiguration: ITaskSchemaItem[];
  };
}

// Field definition
export interface TaskField {
  label: string;
  goalKey: string;
  goalType: 'text' | 'number'; // new: type of the tracked data
}

export interface ITaskSchemaItem {
  label: string;
  description: string;
  key: string;
  fields: TaskField[];
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
