import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import * as Icons from 'lucide-react-native';

interface Notification {
  id: string;
  type: 'task' | 'appointment' | 'lead' | 'system' | 'training';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionable?: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'task',
    title: 'Task Due Soon',
    message: 'Call John Smith - Property inquiry follow-up is due in 30 minutes',
    timestamp: '2024-03-15T14:30:00Z',
    read: false,
    priority: 'high',
    actionable: true,
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Upcoming Appointment',
    message: 'Property showing at 123 Oak Street scheduled for 3:00 PM today',
    timestamp: '2024-03-15T13:45:00Z',
    read: false,
    priority: 'high',
    actionable: true,
  },
  {
    id: '3',
    type: 'lead',
    title: 'New Lead',
    message: 'Sarah Johnson submitted an inquiry for properties in downtown area',
    timestamp: '2024-03-15T12:20:00Z',
    read: true,
    priority: 'medium',
    actionable: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'Market Update',
    message: 'New market analysis report available for your area',
    timestamp: '2024-03-15T10:15:00Z',
    read: true,
    priority: 'low',
    actionable: false,
  },
  {
    id: '5',
    type: 'training',
    title: 'Course Reminder',
    message: 'Complete "Advanced Negotiation Tactics" course - 2 videos remaining',
    timestamp: '2024-03-15T09:30:00Z',
    read: false,
    priority: 'medium',
    actionable: true,
  },
  {
    id: '6',
    type: 'task',
    title: 'Task Completed',
    message: 'Market analysis report for downtown properties has been completed',
    timestamp: '2024-03-14T16:45:00Z',
    read: true,
    priority: 'low',
    actionable: false,
  },
  {
    id: '7',
    type: 'lead',
    title: 'Follow-up Required',
    message: "Mike Brown hasn't responded to your email from 3 days ago",
    timestamp: '2024-03-14T14:20:00Z',
    read: false,
    priority: 'medium',
    actionable: true,
  },
  {
    id: '8',
    type: 'system',
    title: 'App Update',
    message: 'New features available! Update to version 2.1.0 for enhanced calculator tools',
    timestamp: '2024-03-14T08:00:00Z',
    read: true,
    priority: 'low',
    actionable: false,
  },
];

export const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const navigation = useNavigation();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task':
        return Icons.CheckSquare;
      case 'appointment':
        return Icons.Calendar;
      case 'lead':
        return Icons.Users;
      case 'system':
        return Icons.Settings;
      case 'training':
        return Icons.GraduationCap;
      default:
        return Icons.Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'task':
        return '#2563EB';
      case 'appointment':
        return '#059669';
      case 'lead':
        return '#DC2626';
      case 'system':
        return '#6B7280';
      case 'training':
        return '#7C3AED';
      default:
        return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    Alert.alert('Delete Notification', 'Are you sure you want to delete this notification?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        },
      },
    ]);
  };

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'high':
        return notification.priority === 'high';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const highPriorityCount = notifications.filter((n) => n.priority === 'high').length;

  const renderNotification = ({ item }: { item: Notification }) => {
    const IconComponent = getNotificationIcon(item.type);
    const iconColor = getNotificationColor(item.type);
    const priorityColor = getPriorityColor(item.priority);

    return (
      <Card style={[styles.notificationCard, !item.read && styles.unreadCard]}>
        <TouchableOpacity onPress={() => markAsRead(item.id)} style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <View style={styles.notificationIcon}>
              <IconComponent size={20} color={iconColor} />
            </View>
            <View style={styles.notificationInfo}>
              <View style={styles.titleRow}>
                <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
                  {item.title}
                </Text>
                <View style={styles.notificationMeta}>
                  <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
                  <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
                </View>
              </View>
              <Text style={styles.notificationMessage}>{item.message}</Text>

              {item.actionable && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Icons.Eye size={16} color="#2563EB" />
                    <Text style={styles.actionButtonText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Icons.ExternalLink size={16} color="#2563EB" />
                    <Text style={styles.actionButtonText}>Open</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => deleteNotification(item.id)}
              style={styles.deleteButton}>
              <Icons.X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Notifications"
        showBack
        onBack={() => navigation.goBack()}
        rightAction={markAllAsRead}
        rightText="Mark All Read"
      />

      <View style={styles.content}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Card style={[styles.statCard, { backgroundColor: '#EEF2FF' }]}>
            <Text style={styles.statNumber}>{notifications.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </Card>
          <Card style={[styles.statCard, { backgroundColor: '#FEF2F2' }]}>
            <Text style={styles.statNumber}>{unreadCount}</Text>
            <Text style={styles.statLabel}>Unread</Text>
          </Card>
          <Card style={[styles.statCard, { backgroundColor: '#FFFBEB' }]}>
            <Text style={styles.statNumber}>{highPriorityCount}</Text>
            <Text style={styles.statLabel}>High Priority</Text>
          </Card>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
            onPress={() => setFilter('all')}>
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'unread' && styles.activeFilter]}
            onPress={() => setFilter('unread')}>
            <Text style={[styles.filterText, filter === 'unread' && styles.activeFilterText]}>
              Unread ({unreadCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'high' && styles.activeFilter]}
            onPress={() => setFilter('high')}>
            <Text style={[styles.filterText, filter === 'high' && styles.activeFilterText]}>
              High Priority
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Card style={styles.emptyCard}>
              <Icons.Bell size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No notifications</Text>
              <Text style={styles.emptyMessage}>
                {filter === 'all'
                  ? "You're all caught up! No notifications to show."
                  : `No ${filter} notifications found.`}
              </Text>
            </Card>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
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
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#2563EB',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationCard: {
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  unreadCard: {
    borderLeftColor: '#2563EB',
    backgroundColor: '#FEFEFF',
  },
  notificationContent: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
    marginLeft: 4,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
