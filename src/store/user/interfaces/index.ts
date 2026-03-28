import { IImage } from '~/codidge_components/interfaces';

export enum ProductModules {
  variants = 'variants',
  pricing = 'pricing',
  metafields = 'metafields',
  modifiersGroups = 'modifiersGroups',
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
  tenantsList: {
    role: string;
    tenantID: string;
  }[];
  metaData: any;
  permissions?: IPermission[];
  activeTenantId?: string;
}
