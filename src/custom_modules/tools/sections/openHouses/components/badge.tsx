import { StyleSheet, Text, View } from 'react-native';

interface IBadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const Badge = (props: IBadgeProps) => {
  const { text, variant = 'default' } = props;
  const badgeStyle = [
    styles.badge,
    variant === 'success' && styles.badgeSuccess,
    variant === 'warning' && styles.badgeWarning,
    variant === 'danger' && styles.badgeDanger,
  ];
  const textStyle = [
    styles.badgeText,
    variant === 'success' && styles.badgeTextSuccess,
    variant === 'warning' && styles.badgeTextWarning,
    variant === 'danger' && styles.badgeTextDanger,
  ];

  return (
    <View style={badgeStyle}>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  badgeWarning: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  badgeDanger: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  badgeTextSuccess: {
    color: '#16a34a',
  },
  badgeTextWarning: {
    color: '#ca8a04',
  },
  badgeTextDanger: {
    color: '#dc2626',
  },
});
