import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react-native'; // icons

type BadgeType = 'success' | 'error' | 'warning' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  type?: BadgeType;
  style?: any;
  textStyle?: any;
}

export const Badge: React.FC<BadgeProps> = ({ children, type = 'info', style, textStyle }) => {
  // color mapping
  const typeColors = {
    success: { bg: '#34D399', border: '#059669', icon: <CheckCircle size={14} color="white" /> },
    error: { bg: '#F87171', border: '#B91C1C', icon: <XCircle size={14} color="white" /> },
    warning: { bg: '#FBBF24', border: '#B45309', icon: <AlertTriangle size={14} color="white" /> },
    info: { bg: '#60A5FA', border: '#2563EB', icon: <Info size={14} color="white" /> },
  };

  const { bg, border, icon } = typeColors[type];

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: border }, style]}>
      <View style={styles.content}>
        {icon}
        <Text style={[styles.badgeText, textStyle]}>{children}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 2,
    alignSelf: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // space between icon and text
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
});
