import { IImage } from '~/codidge_components/interfaces';
import { ModuleKeys } from '~/store/interface';

export enum ProductModules {
  variants = 'variants',
  pricing = 'pricing',
  metafields = 'metafields',
  modifiersGroups = 'modifiersGroups',
}

export interface IFeatureModule {
  label?: string;
  moduleKey: ModuleKeys;
  metaData: { [key: string]: any };
  modules: ITenantModule[];
  icon?: string;
  color?: string;
}

export interface ITenantTheme {
  colorPalette: {
    primary: string;
  };
  logo: IImage;
  cover: IImage;
}

export interface ITenantModule {
  label?: string;
  moduleKey: ModuleKeys;
  path: string;
  type?: string;
  metaData: any;
  modules?: IFeatureModule[];
  permissions?: IPermission[];
  icon?: string;
  activeIcon?: string;
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
  userID: string;
  name: string;
  status: StatusUser | string;
  role: UserRoles | 'OWNER';
  tenantsList: {
    role: string;
    tenantID: string;
  }[];
  metaData: any;
  permissions?: IPermission[];
  activeTenantId?: string;
}
