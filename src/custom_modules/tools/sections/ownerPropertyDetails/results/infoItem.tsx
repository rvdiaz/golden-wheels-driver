import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface InfoItemProps {
  label: string;
  value: string | number | undefined;
  labelStyles?: TextStyle;
  detailStyles?: TextStyle;
  containerStyle?: ViewStyle;
}

export const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  labelStyles,
  detailStyles,
  containerStyle,
}) => {
  return (
    <View style={[styles.detailRow, containerStyle]}>
      <Text style={[styles.detailLabel, labelStyles]}>{label}:</Text>
      <Text style={[styles.detailValue, detailStyles]}>{value ?? '_'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'flex-start',
    gap: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
});
