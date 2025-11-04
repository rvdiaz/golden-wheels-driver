import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface CustomSliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  color?: string;
  helperText?: string;
  formatValue?: (value: number) => string;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  label,
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  prefix = '',
  suffix = '',
  color = '#2563EB',
  helperText,
  formatValue,
}) => {
  const displayValue = formatValue
    ? formatValue(value)
    : `${prefix}${value.toLocaleString()}${suffix}`;

  // Calculate percentage for visual indicator
  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color }]}>{displayValue}</Text>
        </View>
      </View>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          value={value}
          onValueChange={onValueChange}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={step}
          minimumTrackTintColor={color}
          maximumTrackTintColor="#E5E7EB"
          thumbTintColor={color}
        />

        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabel}>
            {prefix}
            {minimumValue.toLocaleString()}
            {suffix}
          </Text>
          <Text style={styles.rangeLabel}>
            {prefix}
            {maximumValue.toLocaleString()}
            {suffix}
          </Text>
        </View>
      </View>

      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  valueContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
  sliderContainer: {
    paddingHorizontal: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
    paddingHorizontal: 8,
  },
  rangeLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    paddingHorizontal: 4,
  },
});

export default CustomSlider;
