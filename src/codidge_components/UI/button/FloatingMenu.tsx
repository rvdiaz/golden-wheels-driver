import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import * as Icons from 'lucide-react-native';
import PrimaryButton, { ButtonSize } from './PrimaryButton';

interface FloatingMenuProps {
  title?: string;
  icon?: keyof typeof Icons;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({
  title = 'Add',
  icon = 'Plus',
  onPress = () => {},
  style, // receive custom style
}) => {
  const IconComponent = (Icons[icon] ?? Icons.Plus) as React.ComponentType<{
    size: number;
    color: string;
  }>;

  return (
    <PrimaryButton
      onPress={onPress}
      title={title}
      size={ButtonSize.LARGE}
      style={[styles.fab, style]}
      leftWidget={<IconComponent size={20} color="#fff" />}
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
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
