import { IImage } from '~/codidge_components/interfaces';
import { TripLocation } from '~/screens/trips/interfaces';

export interface QuickBookOption {
  id: string;
  title: string;
  image: IImage;
  address: TripLocation;
  icon: string;
}
