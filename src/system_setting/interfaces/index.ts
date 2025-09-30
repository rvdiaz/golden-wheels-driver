import {
  Users,
  Target,
  TrendingUp,
  Star,
  Lightbulb,
  Award,
  Clock,
  AlertTriangle,
  DollarSign,
  Smartphone,
  Book,
  Home,
  MapPin,
  TrendingDown,
  Zap,
} from 'lucide-react-native';

export const iconMap = {
  Users,
  Target,
  TrendingUp,
  Star,
  Lightbulb,
  Award,
  Clock,
  AlertTriangle,
  DollarSign,
  Smartphone,
  Book,
  Home,
  MapPin,
  TrendingDown,
  Zap,
} as const; // `as const` makes the keys literal types

type IconName = keyof typeof iconMap; // "Users" | "Target" | ...

export interface SwottItem {
  id: string;
  label: string;
  icon: IconName; // restricts to allowed icon strings
}

export interface ISystemSetting {
  categories: IProfileCategory[];
  onBoardingSchema: OnBoardingSchema;
}

export interface IProfileSubitem {
  id: string;
  title: string;
}

export interface IProfileTask {
  id: string;
  title: string;
  description: string;
  fullDescriptionHtml: string;
  recommendations: string; // HTML string
  subitems: IProfileSubitem[];
}

export interface IProfileCategory {
  id: string;
  title: string;
  tasks: IProfileTask[];
}

export interface SwottItem {
  id: string;
  label: string;
  icon: IconName; // storing the icon as a string (e.g. "Users", "Target")
}

// The full SWOTT structure
export interface SwottAnalysis {
  strengthsItems: SwottItem[];
  weaknessesItems: SwottItem[];
  opportunitiesItems: SwottItem[];
  threatsItems: SwottItem[];
}

// The onboarding schema
export interface OnBoardingSchema {
  swottAnalysis: SwottAnalysis;
}
