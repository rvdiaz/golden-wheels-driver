import { IImage } from '~/codidge_components/interfaces';
import { ITenantModule } from '~/store/user/interfaces';

export interface ITenant {
  fullName: string;
  description: string;
  tenantID: string;
  isLoading: boolean;
  currencyCode: string;
  theme?: ITenantTheme;
  address: string;
  domain: {
    url: string;
  };
  communications: ICommunications;
  businessHours: BusinessHour[];
  modules: ITenantModule[];
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
