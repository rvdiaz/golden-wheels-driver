import { useQuery, useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { GetUserNotificationsResponse, INotification } from './interfaces';
import { getUserNotificationsQuery } from './graphql';
import { userData } from '~/store/user';
import Constants from 'expo-constants';
import { Card } from '~/codidge_components/UI/card';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import * as Icons from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '~/codidge_components/UI/header';
import { RefreshControl } from 'react-native-gesture-handler';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';

const mockNotifications: INotification[] = [
  {
    notificationId: '1',
    title: 'Welcome to the App!',
    body: 'Thank you for joining us. Get started by exploring your dashboard.',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  },
  {
    notificationId: '2',
    title: 'New Message Received',
    body: 'John Smith sent you a message about the property inquiry.',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    notificationId: '3',
    title: 'Appointment Reminder',
    body: 'Your appointment with Sarah Johnson is scheduled for tomorrow at 2:00 PM.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    notificationId: '4',
    title: 'Task Due Soon',
    body: 'Complete property inspection report - due in 3 hours.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    notificationId: '5',
    title: 'Payment Received',
    body: 'Monthly subscription payment of $49.99 has been processed successfully.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
  },
  {
    notificationId: '6',
    title: 'New Lead Alert',
    body: 'Michael Brown is interested in properties in the downtown area. Budget: $500k-$750k.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    notificationId: '7',
    title: 'Document Uploaded',
    body: 'Client uploaded signed contract for 123 Oak Street property.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    notificationId: '8',
    title: 'Market Update',
    body: 'New market analysis report is available for your area. Average prices increased by 3.2%.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    notificationId: '9',
    title: 'Training Course Available',
    body: 'New course "Advanced Negotiation Tactics" is now available in your learning portal.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
  },
  {
    notificationId: '10',
    title: 'System Maintenance',
    body: 'Scheduled maintenance will occur on Sunday, March 17th from 2:00 AM to 4:00 AM.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    notificationId: '11',
    title: 'Review Request',
    body: 'Please take a moment to review your recent property showing experience.',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
  },
  {
    notificationId: '12',
    title: 'Feature Update',
    body: 'New calculator tools and report templates have been added to your dashboard.',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
  },
];

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const NotificationsScreen = () => {
  const navigation = useNavigation();
  const user = useReactiveVar(userData);

  const { data, loading, refetch } = useQuery<GetUserNotificationsResponse>(
    getUserNotificationsQuery,
    {
      variables: {
        tenant: {
          tenantId,
        },
        userId: user?.id,
        limit: 50,
      },
    }
  );

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
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays}d ago`;
      return date.toLocaleDateString();
    }
  };

  const renderNotification = ({ item }: { item: INotification }) => {
    return (
      <Card style={styles.notificationCard}>
        <View style={styles.notificationContent}>
          <View style={styles.notificationIcon}>
            <Icons.Bell size={20} color="#2563EB" />
          </View>

          <View style={styles.notificationInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.notificationTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
            </View>
            <Text style={styles.notificationBody} numberOfLines={2}>
              {item.body}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icons.Bell size={48} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>No notifications</Text>
      <Text style={styles.emptyMessage}>You're all caught up! No notifications to show.</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Notifications" showBack onBack={() => navigation.goBack()} />
        <PageLoading />
      </SafeAreaView>
    );
  }

  const notifications = data?.getUserNotifications?.items || [];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Notifications" showBack onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <FlatList
          data={mockNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.notificationId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} tintColor="#2563EB" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationCard: {
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  notificationContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
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
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    flexShrink: 0,
  },
  notificationBody: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
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
