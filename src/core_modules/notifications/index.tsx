import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getUserNotificationsQuery } from './graphql/queries';
import { markNotificationsAsReadMutation } from './graphql/mutations';
import { userData } from '~/store/user';
import Constants from 'expo-constants';
import { Card } from '~/codidge_components/UI/card';
import { FlatList, StyleSheet, View } from 'react-native';
import * as Icons from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { RefreshControl } from 'react-native-gesture-handler';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { useCallback } from 'react';
import {
  GetUserNotificationsResponse,
  INotification,
  MarkNotificationsReadedResponse,
} from './interfaces';
import * as Notifications from 'expo-notifications';
import { theme } from '~/theme/theme';

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
        limit: 30,
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  const [markAsRead] = useMutation<MarkNotificationsReadedResponse>(
    markNotificationsAsReadMutation,
    {
      refetchQueries: [
        {
          query: getUserNotificationsQuery,
          variables: {
            tenant: {
              tenantId,
            },
            userId: user?.id,
            limit: 30,
          },
        },
      ],
      awaitRefetchQueries: true,
    }
  );

  // Mark notifications as read when screen is focused
  useFocusEffect(
    useCallback(() => {
      const markUnreadNotifications = async () => {
        if (!data?.getUserNotifications?.items) return;

        const unreadNotificationIds = data.getUserNotifications.items
          .filter((n) => !n.read)
          .map((n) => n.notificationId);

        if (unreadNotificationIds.length > 0) {
          try {
            await markAsRead({
              variables: {
                tenant: {
                  tenantId,
                },
                userId: user?.id,
                notificationIds: unreadNotificationIds,
              },
            });
          } catch (error) {
            console.error('Error marking notifications as read:', error);
          }
        }
      };

      // Small delay to ensure data is loaded
      const timer = setTimeout(() => {
        markUnreadNotifications();
        Notifications.setBadgeCountAsync(0);
      }, 500);

      return () => clearTimeout(timer);
    }, [data?.getUserNotifications?.items, markAsRead, user?.id])
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
      <Card style={[styles.notificationCard, !item.read && styles.unreadNotification]}>
        <View style={styles.notificationContent}>
          <View style={[styles.notificationIcon, !item.read && styles.unreadIcon]}>
            <Icons.Bell size={20} color={!item.read ? '#2563EB' : '#666'} />
          </View>

          <View style={styles.notificationInfo}>
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                <Text
                  style={[styles.notificationTitle, !item.read && styles.unreadTitle]}
                  numberOfLines={1}>
                  {item.title}
                </Text>
                {!item.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
            </View>
            <Text
              style={[styles.notificationBody, !item.read && styles.unreadBody]}
              numberOfLines={2}>
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

  if (loading && !data) {
    return (
      <PageSafeContainer style={styles.container}>
        <Header title="Notifications" showBack onBack={() => navigation.goBack()} />
        <PageLoading />
      </PageSafeContainer>
    );
  }

  const notifications = data?.getUserNotifications?.items || [];

  return (
    <PageSafeContainer style={styles.container}>
      <Header title="Notifications" showBack onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <FlatList
          data={notifications}
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
    </PageSafeContainer>
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
  listContainer: {
    paddingBottom: 20,
  },
  notificationCard: {
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.borderNeutralColor,
  },
  unreadNotification: {
    borderLeftColor: '#2563EB',
    backgroundColor: '#F0F9FF',
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
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  unreadIcon: {
    backgroundColor: '#EEF2FF',
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
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '600',
    color: '#1F2937',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginLeft: 6,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    flexShrink: 0,
  },
  notificationBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  unreadBody: {
    color: '#6B7280',
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
