import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react-native'; // icons
import { theme } from '~/theme/theme';

type BadgeType = 'success' | 'error' | 'warning' | 'info' | 'normal';

interface BadgeProps {
  children: React.ReactNode;
  type?: BadgeType;
  style?: ViewStyle;
  textStyle?: TextStyle;
  displayIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  type = 'info',
  style,
  displayIcon = true,
  textStyle,
}) => {
  // color mapping
  const typeColors = {
    success: { bg: '#34D399', border: '#059669', icon: <CheckCircle size={14} color="white" /> },
    error: { bg: '#F87171', border: '#B91C1C', icon: <XCircle size={14} color="white" /> },
    warning: { bg: '#FBBF24', border: '#B45309', icon: <AlertTriangle size={14} color="white" /> },
    info: { bg: '#60A5FA', border: '#2563EB', icon: <Info size={14} color="white" /> },
    normal: { bg: '#E2E8F0', border: '#E2E8F0', icon: <Info size={14} color="gray" /> },
  };

  const { bg, border, icon } = typeColors[type];

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: border }, style]}>
      <View style={styles.content}>
        {displayIcon && icon}
        <Text style={[styles.badgeText, textStyle]}>{children}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // space between icon and text
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});
