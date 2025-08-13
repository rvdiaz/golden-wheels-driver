import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';

export const TaskManagementHeader = () => {
  const [filterLabel, setFilterLabel] = useState('Priority');

  return (
    <View style={styles.header}>
      <View style={styles.headerButtons}>
        {/* Filter Button */}
        {/*   <TouchableOpacity style={styles.outlineButton} onPress={() => {}}>
          <Feather name="filter" size={16} color="#374151" />
          <Text style={styles.outlineButtonText}>{filterLabel}</Text>
          <Feather name="chevron-down" size={16} color="#374151" />
        </TouchableOpacity>
 */}
        {/* Schedule Button */}
        <TouchableOpacity style={styles.outlineButton} onPress={() => {}}>
          <Feather name="menu" size={16} color="#374151" />
          <Text style={styles.outlineButtonText}>Schedule</Text>
          <Feather name="chevron-down" size={16} color="#374151" />
        </TouchableOpacity>

        {/* New Task Button */}
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>New Task</Text>
          <Feather name="plus" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
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
  outlineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    gap: 4,
  },
  outlineButtonText: {
    fontSize: 14,
    color: '#374151',
    marginHorizontal: 4,
    flex: 1,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    gap: 4,
  },
  primaryButtonText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 4,
  },
});
