import { LucideIcon } from 'lucide-react-native';
import { IImage } from '~/codidge_components/interfaces';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ILocation {
  id: string;
  displayName: string;
  formattedAddress: string;
}

export interface QuickBookOption {
  id: string;
  title: string;
  image: IImage;
  address: ILocation;
  icon: string;
}
