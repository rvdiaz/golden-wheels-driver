import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '~/components/Card';
import * as Icons from 'lucide-react-native';

export const ShortCutsButtons = () => {
  return (
    <Card style={styles.shortcutsCard}>
      <Text style={styles.shortcutsTitle}>Quick Tools</Text>
      <View style={styles.shortcutsGrid}>
        <TouchableOpacity style={styles.shortcutItem}>
          <View style={[styles.shortcutIcon, { backgroundColor: '#EEF2FF' }]}>
            <Icons.FileText size={24} color="#2563EB" />
          </View>
          <Text style={styles.shortcutText}>Rent Application</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shortcutItem}>
          <View style={[styles.shortcutIcon, { backgroundColor: '#ECFDF5' }]}>
            <Icons.Calculator size={24} color="#059669" />
          </View>
          <Text style={styles.shortcutText}>Mortgage Calculator</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shortcutItem}>
          <View style={[styles.shortcutIcon, { backgroundColor: '#FFF7ED' }]}>
            <Icons.Plus size={24} color="#EA580C" />
          </View>
          <Text style={styles.shortcutText}>Add Task</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shortcutItem}>
          <View style={[styles.shortcutIcon, { backgroundColor: '#F3E8FF' }]}>
            <Icons.UserPlus size={24} color="#7C3AED" />
          </View>
          <Text style={styles.shortcutText}>Add Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shortcutItem}>
          <View style={[styles.shortcutIcon, { backgroundColor: '#FEF2F2' }]}>
            <Icons.Home size={24} color="#DC2626" />
          </View>
          <Text style={styles.shortcutText}>Property Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shortcutItem}>
          <View style={[styles.shortcutIcon, { backgroundColor: '#FFFBEB' }]}>
            <Icons.Calendar size={24} color="#D97706" />
          </View>
          <Text style={styles.shortcutText}>Schedule Showing</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  shortcutsCard: {
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  shortcutsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginHorizontal: -8,
  },
  shortcutItem: {
    width: '33.33%',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  shortcutIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shortcutText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 16,
  },
});
