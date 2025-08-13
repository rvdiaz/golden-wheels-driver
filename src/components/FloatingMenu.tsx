import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import * as Icons from 'lucide-react-native';

interface FloatingMenuProps {
  title?: string;
  icon?: keyof typeof Icons;
  onPress?: () => void;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({
  title = 'Add',
  icon = 'Plus',
  onPress = () => {},
}) => {
  const IconComponent = (Icons[icon] ?? Icons.Plus) as React.ComponentType<{
    size?: number;
    color?: string;
  }>;

  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.content}>
        <IconComponent size={24} color="white" />
        {title ? <Text style={styles.label}>{title}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
