import { commonModules } from '../config';
import { IUser } from '../user/interface';

export const generateTenantNavItems = (user: IUser, currentPath: string) => {
  const modules = user?.tenantModules ?? [];

  const subItems: any = [];

  const appItems = commonModules();

  return [...appItems, ...subItems];
};
