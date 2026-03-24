import { LucideIcon } from 'lucide-react-native';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface QuickBookOption {
  id: string;
  title: string;
  imageUri?: string;
  icon: LucideIcon;
}
