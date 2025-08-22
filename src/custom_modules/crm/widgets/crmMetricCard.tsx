import React from 'react';
import { Card } from '~/codidge_components/UI/card';
import { CrmMetrics } from '../interfaces';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Icons from 'lucide-react-native';
import Color from 'color'; // small utility to manipulate colors

const screenWidth = Dimensions.get('window').width;

export const CrmMetricsCard = ({ crmMetrics }: { crmMetrics: CrmMetrics }) => {
  const IconComponent = (Icons as any)[crmMetrics.icon] || Icons.Users;
  const isActive = crmMetrics.active;

  // Darken the background color slightly for the border
  const borderColor = !isActive ? Color(crmMetrics.bgColor).darken(0.2).hex() : 'transparent';
  const borderWidth = !isActive ? 1 : 0;

  return (
    <TouchableOpacity onPress={crmMetrics.onPress}>
      <Card
        style={[
          styles.statCard,
          { backgroundColor: crmMetrics.bgColor, borderColor, borderWidth },
        ]}>
        <View style={styles.statContent}>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{crmMetrics.value}</Text>
            <Text style={styles.statLabel}>{crmMetrics.label}</Text>
          </View>
          <IconComponent size={32} color={crmMetrics.color} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  statCard: {
    width: (screenWidth - 48) / 2,
    marginHorizontal: 8,
    marginBottom: 16,
    borderWidth: 0,
    borderRadius: 16,
    elevation: 0,
    shadowOpacity: 0,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
