// ─── Color tokens ─────────────────────────────────────────────────────────────

import { BadgeType } from '~/codidge_components/UI/badge';
import { Booking, TabKey } from '../interfaces';

// Subtle white glass — bumped up from 0.04/0.05 for a softer frosted feel
export const GLASS_BG = 'rgba(255,255,255,0.08)';

export const WHITE_08 = 'rgba(255,255,255,0.08)';
export const WHITE_10 = 'rgba(255,255,255,0.10)';
export const WHITE_12 = 'rgba(255,255,255,0.12)';
export const WHITE_35 = 'rgba(255,255,255,0.35)';

// ─── Tab config ───────────────────────────────────────────────────────────────

export const TABS: { key: TabKey; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'draft', label: 'Draft' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'past', label: 'Past' },
];

// ─── Formatters ───────────────────────────────────────────────────────────────

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatTime = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

export const formatDateTime = (iso?: string | null): string => {
  if (!iso) return '';

  const d = new Date(iso);

  if (isNaN(d.getTime())) return '';

  return `${d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} ${d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })}`;
};

export const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export const formatCurrency = (amount: number, code: string): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(amount);

// ─── Filter ───────────────────────────────────────────────────────────────────

export const filterByTab = (bookings: Booking[], tab: TabKey): Booking[] => {
  const filtered = bookings.filter((b) => {
    switch (tab) {
      case 'upcoming':
        return b.status === 'confirmed' || b.status === 'pending' || b.status === 'in_progress';
      case 'past':
        return b.status === 'completed';
      case 'cancelled':
        return b.status === 'cancelled';
      case 'draft':
        return b.status === 'draft';
      default:
        return false;
    }
  });

  filtered.sort((a, b) => {
    // ✅ Special rule for upcoming
    if (tab === 'upcoming') {
      if (a.status === 'confirmed' && b.status !== 'confirmed') return -1;
      if (a.status !== 'confirmed' && b.status === 'confirmed') return 1;

      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }

    // ✅ Sort by startDate
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return filtered;
};

const DRIVER_STATUS_BADGE_TYPE: Record<string, BadgeType> = {
  assigned: 'info',
  en_route: 'info',
  arrived: 'warning',
  in_progress: 'success',
  completed: 'normal',
};

export const getDriverBadgeType = (status: string): BadgeType =>
  DRIVER_STATUS_BADGE_TYPE[status] ?? 'info';
