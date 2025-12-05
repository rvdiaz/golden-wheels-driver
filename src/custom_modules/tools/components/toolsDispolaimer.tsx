import { Info } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Text from '~/codidge_components/UI/text';

export const ToolDisclaimer = ({
  value,
  containerStyles,
}: {
  value: string;
  containerStyles?: ViewStyle;
}) => {
  return (
    <View style={[styles.alert, containerStyles && containerStyles]}>
      <Info color="#3b82f6" size={16} />
      <Text style={styles.alertText}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  alert: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    marginBottom: 16,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
});
