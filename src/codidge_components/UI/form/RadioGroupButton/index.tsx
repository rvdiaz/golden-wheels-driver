import React from 'react';
import { View, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import Text from '../../text';
import { theme } from '~/theme/theme';

interface Option {
  label: string;
  value: string;
}

interface RadioGroupProps {
  value?: string; // current value
  onChange: (val: string) => void; // callback when changed
  options: Option[];
  getColor?: (val: string) => string; // optional color function
  label?: string;
  labelStyle?: TextStyle;
}

export const RadioGroupButtons: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  options,
  getColor,
  label,
  labelStyle,
}) => {
  return (
    <View>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={styles.container}>
        {options.map((option) => {
          const isSelected = value === option.value;
          const color = getColor ? getColor(option.value) : '#2563EB'; // fallback blue

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.button,
                isSelected && {
                  backgroundColor: color + '20',
                  borderColor: color,
                },
              ]}
              onPress={() => onChange(option.value)}>
              <Text style={[styles.text, isSelected && { color }]}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 5,
  },
  button: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
});
