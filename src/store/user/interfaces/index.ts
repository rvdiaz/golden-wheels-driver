import { IImage } from '~/codidge_components/interfaces';

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  licenseNumber?: string;
  available?: boolean;
  preferenceLanguage?: string[];
  pushToken?: string;
  image?: IImage;
  loading?: boolean;
  loadedFromStorage?: boolean;
}
