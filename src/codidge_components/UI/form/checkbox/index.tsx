import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import * as Icons from 'lucide-react-native';
import { theme } from '~/theme/theme';

export const Checkbox = ({
  checked = false,
  onToggle,
  label,
  disabled = false,
  size = 20,
  checkedColor = '#3B82F6',
  uncheckedColor = '#E5E7EB',
  checkColor = '#FFFFFF',
  borderRadius = 4,
  labelStyle,
  checkboxStyle,
  containerStyle,
  spacing = 8,
}: {
  checked?: boolean;
  onToggle?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: number;
  checkedColor?: string;
  uncheckedColor?: string;
  checkColor?: string;
  borderRadius?: number;
  labelStyle?: object;
  checkboxStyle?: object;
  containerStyle?: object;
  spacing?: number;
}) => {
  const handlePress = () => {
    if (!disabled && onToggle) {
      onToggle(!checked);
    }
  };

  const checkboxStyles = [
    styles.checkbox,
    {
      width: size,
      height: size,
      borderRadius,
      backgroundColor: checked ? checkedColor : uncheckedColor,
      borderColor: checked ? checkedColor : uncheckedColor,
    },
    disabled && styles.disabled,
    checkboxStyle,
  ];

  const containerStyles = [styles.container, containerStyle];

  const labelStyles = [
    styles.label,
    { marginLeft: spacing },
    disabled && styles.labelDisabled,
    labelStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}>
      <View style={checkboxStyles}>
        {checked && <Icons.Check size={size * 0.6} color={checkColor} strokeWidth={3} />}
      </View>
      {label && <Text style={labelStyles}>{label}</Text>}
    </TouchableOpacity>
  );
};

// Alternative minimal version for simple use cases
export const SimpleCheckbox = ({
  checked = false,
  onToggle,
  size = 20,
  color = theme.colors.primary,
}: {
  checked?: boolean;
  onToggle?: (checked: boolean) => void;
  size?: number;
  color?: string;
}) => {
  return (
    <TouchableOpacity
      onPress={() => onToggle?.(!checked)}
      style={[
        styles.simpleCheckbox,
        {
          width: size,
          height: size,
          backgroundColor: checked ? color : 'transparent',
          borderColor: color,
        },
      ]}
      activeOpacity={0.7}>
      {checked && <Icons.Check size={size * 0.6} color="#FFFFFF" strokeWidth={3} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simpleCheckbox: {
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  labelDisabled: {
    color: '#9CA3AF',
  },
});

// Usage Examples:
/*
// Basic checkbox without label
<Checkbox 
  checked={isChecked} 
  onToggle={setIsChecked} 
/>

// Checkbox with label
<Checkbox 
  checked={isChecked} 
  onToggle={setIsChecked}
  label="Accept terms and conditions"
/>

// Custom styled checkbox
<Checkbox 
  checked={isChecked} 
  onToggle={setIsChecked}
  label="Custom checkbox"
  size={24}
  checkedColor="#10B981"
  borderRadius={8}
  iconName="CheckCircle"
/>

// Simple minimal version
<SimpleCheckbox 
  checked={isChecked} 
  onToggle={setIsChecked}
  color="#EF4444"
/>

// Disabled checkbox
<Checkbox 
  checked={isChecked} 
  onToggle={setIsChecked}
  label="Disabled option"
  disabled={true}
/>
*/
