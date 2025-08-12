import { ITenantModule, IUser } from '../interface';

export enum ModuleKeys {
  configuration = 'configuration',
  /*   contentGallery = "contentGallery", */
}

export const getTenantRoutes = (user: IUser | null) => {
  const modules = user?.tenantModules ?? [];

  const moduleRoutes = modules.map((key) => {});
};

export const commonModules = () => [];
