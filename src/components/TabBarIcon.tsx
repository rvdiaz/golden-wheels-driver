import React from 'react';
import * as Icons from 'lucide-react-native';

interface TabBarIconProps {
  name: string;
  focused: boolean;
  color: string;
  size: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ name, focused, color, size }) => {
  const IconComponent = (Icons as any)[name] || Icons.Home;

  return <IconComponent size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
};
