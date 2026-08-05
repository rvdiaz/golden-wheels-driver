// ─── Color tokens ─────────────────────────────────────────────────────────────

import { BadgeType } from '~/codidge_components/UI/badge';
import { Booking, TabKey } from '../interfaces';
import { formatMiamiTime } from '~/helpers';

// ─── Tab config ───────────────────────────────────────────────────────────────

export const TABS: { key: TabKey; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'draft', label: 'Draft' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'past', label: 'Past' },
];

// ─── Formatters ───────────────────────────────────────────────────────────────

export const formatDateTime = (iso?: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return formatMiamiTime(d, 'datetime');
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
