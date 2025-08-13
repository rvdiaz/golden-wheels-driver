import { CheckSquare, Clock } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const TaskManagementHeader = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'custom'>('daily');

  return (
    <View style={styles.header}>
      <View style={styles.headerButtons}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
            onPress={() => setActiveTab('daily')}>
            <Clock size={20} color={activeTab === 'daily' ? '#2563EB' : '#6b7280'} />
            <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>
              Daily Schedule
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'custom' && styles.activeTab]}
            onPress={() => setActiveTab('custom')}>
            <CheckSquare size={20} color={activeTab === 'custom' ? '#2563EB' : '#6b7280'} />
            <Text style={[styles.tabText, activeTab === 'custom' && styles.activeTabText]}>
              Custom Tasks
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerButtons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    gap: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#2563EB',
  },
});
