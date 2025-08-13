import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Card } from '~/components/Card';
import * as Icons from 'lucide-react-native';
import { ITask } from '~/custom_modules/task/interfaces';

const screenWidth = Dimensions.get('window').width;

export const TaskMetricsStats = ({ completedTasks }: { completedTasks: ITask[] }) => {
  return (
    <View style={styles.metricsGrid}>
      <Card style={styles.metricCard}>
        <View style={styles.metricContent}>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>Q1 Progress</Text>
            <Text style={styles.metricValue}>0%</Text>
            <Text style={styles.metricSubtext}>→ On track to goals</Text>
          </View>
          <View style={[styles.metricIcon, { backgroundColor: '#ECFDF5' }]}>
            <Icons.Target size={24} color="#059669" />
          </View>
        </View>
      </Card>

      <Card style={styles.metricCard}>
        <View style={styles.metricContent}>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>Today's Tasks</Text>
            <Text style={styles.metricValue}>{completedTasks.length}/5</Text>
            <Text style={[styles.metricSubtext, { color: '#2563EB' }]}>
              {5 - completedTasks.length} remaining
            </Text>
          </View>
          <View style={[styles.metricIcon, { backgroundColor: '#EEF2FF' }]}>
            <Icons.CheckCircle size={24} color="#2563EB" />
          </View>
        </View>
      </Card>

      <Card style={styles.metricCard}>
        <View style={styles.metricContent}>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>CRM Contacts</Text>
            <Text style={styles.metricValue}>24</Text>
            <Text style={[styles.metricSubtext, { color: '#EA580C' }]}>→ +3 today</Text>
          </View>
          <View style={[styles.metricIcon, { backgroundColor: '#FFF7ED' }]}>
            <Icons.Users size={24} color="#EA580C" />
          </View>
        </View>
      </Card>

      <Card style={styles.metricCard}>
        <View style={styles.metricContent}>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>This Quarter</Text>
            <Text style={styles.metricValue}>$8,500</Text>
            <Text style={[styles.metricSubtext, { color: '#059669' }]}>Goal: $31,250</Text>
          </View>
          <View style={[styles.metricIcon, { backgroundColor: '#ECFDF5' }]}>
            <Icons.DollarSign size={24} color="#059669" />
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    marginHorizontal: -8,
  },
  metricCard: {
    width: (screenWidth - 48) / 2,
    marginHorizontal: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  metricContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  metricSubtext: {
    fontSize: 10,
    color: '#059669',
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
