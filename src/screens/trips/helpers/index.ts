// ─── Color tokens ─────────────────────────────────────────────────────────────

import { Booking, TabKey } from '../interfaces';

export const GOLD = '#dac072';
export const GOLD_10 = 'rgba(218,192,114,0.10)';
export const GOLD_20 = 'rgba(218,192,114,0.20)';
export const GOLD_30 = 'rgba(218,192,114,0.30)';

// Subtle white glass — bumped up from 0.04/0.05 for a softer frosted feel
export const GLASS_BG = 'rgba(255,255,255,0.08)';

export const WHITE_08 = 'rgba(255,255,255,0.08)';
export const WHITE_10 = 'rgba(255,255,255,0.10)';
export const WHITE_12 = 'rgba(255,255,255,0.12)';
export const WHITE_35 = 'rgba(255,255,255,0.35)';

// ─── Tab config ───────────────────────────────────────────────────────────────

export const TABS: { key: TabKey; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
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
  if (tab === 'upcoming')
    return bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress');
  if (tab === 'past') return bookings.filter((b) => b.status === 'completed');
  return bookings.filter((b) => b.status === 'cancelled');
};
