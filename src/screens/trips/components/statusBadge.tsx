import { StyleSheet, View } from 'react-native';
import { BookingStatus } from '../interfaces';
import Text from '~/codidge_components/UI/text';

interface StatusBadgeProps {
  status: BookingStatus;
}

const GREEN = '#4ade80';
const GREEN_12 = 'rgba(34,197,94,0.12)';
const GREEN_30 = 'rgba(34,197,94,0.30)';

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config: Record<BookingStatus, { label: string; bg: string; text: string; border: string }> =
    {
      draft: {
        label: 'Draft',
        bg: 'rgba(156,163,175,0.12)',
        text: '#9ca3af',
        border: 'rgba(156,163,175,0.3)',
      },
      pending: {
        label: 'Pending',
        bg: 'rgba(251,191,36,0.12)',
        text: '#fbbf24',
        border: 'rgba(251,191,36,0.3)',
      },
      confirmed: {
        label: 'Confirmed',
        bg: GREEN_12,
        text: GREEN,
        border: GREEN_30,
      },
      in_progress: {
        label: 'In Progress',
        bg: 'rgba(59,130,246,0.12)',
        text: '#60a5fa',
        border: 'rgba(59,130,246,0.3)',
      },
      completed: {
        label: 'Completed',
        bg: 'rgba(34,197,94,0.10)',
        text: '#4ade80',
        border: 'rgba(34,197,94,0.2)',
      },
      cancelled: {
        label: 'Cancelled',
        bg: 'rgba(220,38,38,0.10)',
        text: '#f87171',
        border: 'rgba(220,38,38,0.2)',
      },
    };

  const c = config[status];
  return (
    <View style={[badgeStyles.badge, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[badgeStyles.text, { color: c.text }]}>{c.label}</Text>
    </View>
  );
};

const badgeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
