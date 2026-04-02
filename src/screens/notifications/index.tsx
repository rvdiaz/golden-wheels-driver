import { FlatList, StyleSheet, View } from 'react-native';
import { Bell, CheckCheck } from 'lucide-react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { useState, useCallback } from 'react';
import { theme } from '~/theme/theme';
import { useUserNotifications } from './hooks/useUserNotifications';
import { NotificationCard } from './widgets/notificationCard';
import { Header } from '~/codidge_components/UI/header';

// ─── Color tokens ─────────────────────────────────────────────────────────────

const GOLD = theme.colors.primary;
const GOLD_10 = 'rgba(218,192,114,0.10)';
const GOLD_18 = 'rgba(218,192,114,0.18)';
const GOLD_30 = 'rgba(218,192,114,0.30)';

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconWrap}>
      <Bell size={28} color={GOLD} strokeWidth={1.5} />
    </View>
    <Text style={styles.emptyTitle}>All caught up</Text>
    <Text style={styles.emptyMessage}>No notifications to show right now.</Text>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export const NotificationsScreen = () => {
  const { notifications, loadingNotifications } = useUserNotifications();

  const [refreshing, setRefreshing] = useState(false);

  // Mark all unread as read after a short delay (simulates screen focus)
  const markAllRead = useCallback(() => {
    const timer = setTimeout(() => {
      //setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      //setNotifications(MOCK_NOTIFICATIONS);
      setRefreshing(false);
    }, 800);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <PageSafeContainer style={styles.container}>
      <Header
        contentContainerStyle={{
          backgroundColor: 'transparent',
        }}
        contentStyle={{
          paddingVertical: 0,
        }}
        titleStyles={{
          color: '#FFF',
        }}
        leftWidget={
          <View style={styles.screenHeader}>
            <Text style={styles.screenTitle}>Notifications</Text>
          </View>
        }
        title={''}
        showBack
      />

      {/* Subtitle row */}
      {notifications.length > 0 && (
        <View style={styles.subtitleRow}>
          {unreadCount > 0 ? (
            <>
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount} new</Text>
              </View>
              <Text style={styles.subtitleText}>{notifications.length} total</Text>
            </>
          ) : (
            <View style={styles.allReadRow}>
              <CheckCheck size={13} color="rgba(218,192,114,0.5)" strokeWidth={1.8} />
              <Text style={styles.allReadText}>All caught up</Text>
            </View>
          )}
        </View>
      )}

      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationCard item={item} />}
        keyExtractor={(item) => item.notificationId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={GOLD} />
        }
      />
    </PageSafeContainer>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },

  screenTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: GOLD,
    letterSpacing: 0.4,
  },
  container: {
    flex: 1,
  },

  // ── Subtitle row ──
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  unreadBadge: {
    backgroundColor: GOLD_10,
    borderWidth: 0.5,
    borderColor: GOLD_30,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadBadgeText: {
    fontSize: 11,
    color: GOLD,
    fontWeight: '500',
  },
  subtitleText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.25)',
  },
  allReadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  allReadText: {
    fontSize: 12,
    color: 'rgba(218,192,114,0.45)',
  },

  // ── List ──
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 32,
  },

  // ── Empty ──
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 10,
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: GOLD_10,
    borderWidth: 0.5,
    borderColor: GOLD_18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.45)',
  },
  emptyMessage: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.22)',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
