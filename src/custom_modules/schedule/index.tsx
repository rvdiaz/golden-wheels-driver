import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../codidge_components/UI/header';
import { Card } from '../../codidge_components/UI/card';
import * as Icons from 'lucide-react-native';

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  type: 'task' | 'appointment' | 'meeting';
  status: 'upcoming' | 'completed' | 'missed';
}

const mockSchedule: ScheduleItem[] = [
  {
    id: '1',
    title: 'Call John Smith',
    time: '9:00 AM',
    type: 'task',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Property showing - 123 Oak St',
    time: '11:00 AM',
    type: 'appointment',
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'Team meeting',
    time: '2:00 PM',
    type: 'meeting',
    status: 'upcoming',
  },
  {
    id: '4',
    title: 'Follow up with Sarah',
    time: '4:00 PM',
    type: 'task',
    status: 'upcoming',
  },
];

export const ScheduleScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule] = useState<ScheduleItem[]>(mockSchedule);

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'task':
        return Icons.CheckSquare;
      case 'appointment':
        return Icons.Home;
      case 'meeting':
        return Icons.Users;
      default:
        return Icons.Calendar;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'upcoming':
        return '#2563EB';
      case 'missed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const renderScheduleItem = (item: ScheduleItem) => {
    const IconComponent = getItemIcon(item.type);

    return (
      <Card key={item.id} style={styles.scheduleItem}>
        <View style={styles.itemHeader}>
          <View style={styles.itemIcon}>
            <IconComponent size={20} color={getStatusColor(item.status)} />
          </View>
          <View style={styles.itemContent}>
            <Text style={[styles.itemTitle, item.status === 'completed' && styles.completedText]}>
              {item.title}
            </Text>
            <Text style={styles.itemTime}>{item.time}</Text>
          </View>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
        </View>
      </Card>
    );
  };

  const todayItems = schedule.filter((item) => item.status !== 'missed');
  const completedCount = schedule.filter((item) => item.status === 'completed').length;
  const upcomingCount = schedule.filter((item) => item.status === 'upcoming').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>Today, March 15</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Icons.Calendar size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <Card style={[styles.statCard, { backgroundColor: '#ECFDF5' }]}>
          <Text style={styles.statNumber}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: '#EEF2FF' }]}>
          <Text style={styles.statNumber}>{upcomingCount}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: '#FFFBEB' }]}>
          <Text style={styles.statNumber}>{schedule.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </Card>
      </View>

      <ScrollView style={styles.scheduleList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        {todayItems.map(renderScheduleItem)}

        <Card style={styles.addItemCard}>
          <TouchableOpacity style={styles.addItemButton}>
            <Icons.Plus size={20} color="#2563EB" />
            <Text style={styles.addItemText}>Add to Schedule</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  calendarButton: {
    padding: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  scheduleList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  scheduleItem: {
    marginBottom: 8,
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  addItemCard: {
    marginBottom: 16,
    marginTop: 8,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  addItemText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 8,
  },
});
