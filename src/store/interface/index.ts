import { IImage } from '~/codidge_components/interfaces';

export enum ModuleKeys {
  dashboard = 'Dashboard',
  tasks = 'Tasks',
  crm = 'CRM',
  tools = 'Tools',
  training = 'Training',
  mortgageCalculator = 'MortgageCalculator',
  propertyTools = 'PropertyTools',
  prequalifiedTools = 'PrequalifiedTools',
  expiredListing = 'ExpiredListing',
  notifications = 'Notifications',
  trainingDetailPage = 'TrainingDetailPage',
  contactDetals = 'ContactDetals',
  profile = 'Profile',
  /*   contentGallery = "contentGallery", */
}

export interface IFeatureModule {
  label?: string;
  moduleKey: ModuleKeys;
  metaData: { [key: string]: any };
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

export interface ITenantModule {
  label: string;
  moduleKey: ModuleKeys;
  path: string;
  type?: string;
  metaData: string;
  modules?: IFeatureModule[];
  permissions?: IPermission[];
  icon?: string;
  isBottomBar?: boolean;
}

export enum StatusUser {
  invitado,
  activo,
  eliminado,
  bloqueado,
}

export interface IPermission {
  slug: string;
  label: string;
}

export enum UserRoles {
  admin = 'ADMIN',
  manager = 'MANAGER',
}

export interface IUser {
  email: string;
  loading?: boolean;
  phone: string;
  id: string;
  name: string;
  status: StatusUser | string;
  role: UserRoles | 'OWNER';
  metaData: any;
  permissions?: IPermission[];
  tenantModules: ITenantModule[];
}
