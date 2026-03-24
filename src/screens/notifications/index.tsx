import { useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, View } from 'react-native';
import { Bell, CheckCheck, Clock } from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { RefreshControl } from 'react-native-gesture-handler';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { useState, useCallback } from 'react';
import { theme } from '~/theme/theme';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface INotification {
  notificationId: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const now = new Date();
const minsAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

const MOCK_NOTIFICATIONS: INotification[] = [
  {
    notificationId: 'n-001',
    title: 'Your ride is confirmed',
    body: 'Jesus Diaz will pick you up at Hotel Indigo Miami Brickell on Oct 18 at 2:00 PM.',
    createdAt: minsAgo(8),
    read: false,
  },
  {
    notificationId: 'n-002',
    title: 'Driver on the way',
    body: 'Your driver Marco Lopez is 5 minutes away. Chevrolet Suburban · Premier.',
    createdAt: minsAgo(42),
    read: false,
  },
  {
    notificationId: 'n-003',
    title: 'Trip completed',
    body: 'Your ride to Miami International Airport is complete. Total charged: $75.00.',
    createdAt: hoursAgo(3),
    read: false,
  },
  {
    notificationId: 'n-004',
    title: 'Receipt available',
    body: 'Your receipt for booking BK068486521 has been sent to javidp1997@gmail.com.',
    createdAt: hoursAgo(5),
    read: true,
  },
  {
    notificationId: 'n-005',
    title: 'Upcoming trip reminder',
    body: 'You have a trip scheduled for tomorrow at 9:00 AM from Fort Lauderdale Airport.',
    createdAt: hoursAgo(18),
    read: true,
  },
  {
    notificationId: 'n-006',
    title: 'Booking cancelled',
    body: 'Your booking BK059381027 has been cancelled. A full refund of $75.00 will be processed.',
    createdAt: daysAgo(2),
    read: true,
  },
  {
    notificationId: 'n-007',
    title: 'Rate your experience',
    body: 'How was your ride with Jesus Diaz? Leave a review to help us improve.',
    createdAt: daysAgo(3),
    read: true,
  },
  {
    notificationId: 'n-008',
    title: 'Special offer just for you',
    body: 'Book your next ride before Oct 31 and get 10% off with code RIDE10.',
    createdAt: daysAgo(5),
    read: true,
  },
];

// ─── Color tokens ─────────────────────────────────────────────────────────────

const GOLD = '#dac072';
const GOLD_10 = 'rgba(218,192,114,0.10)';
const GOLD_18 = 'rgba(218,192,114,0.18)';
const GOLD_30 = 'rgba(218,192,114,0.30)';
const GLASS_BG = 'rgba(255,255,255,0.07)';
const GLASS_UNREAD_BG = 'rgba(218,192,114,0.07)';
const WHITE_10 = 'rgba(255,255,255,0.10)';
const WHITE_28 = 'rgba(255,255,255,0.28)';
const WHITE_45 = 'rgba(255,255,255,0.45)';
const WHITE_70 = 'rgba(255,255,255,0.70)';
const WHITE_88 = 'rgba(255,255,255,0.88)';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTimestamp = (timestamp: string): string => {
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

// ─── Notification Card ────────────────────────────────────────────────────────

const NotificationCard = ({ item }: { item: INotification }) => {
  const isUnread = !item.read;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: isUnread ? GLASS_UNREAD_BG : GLASS_BG },
        { borderColor: isUnread ? GOLD_18 : 'rgba(255,255,255,0.09)' },
      ]}>
      {/* Top shimmer */}
      <View
        style={[
          styles.cardShimmer,
          { backgroundColor: isUnread ? 'rgba(218,192,114,0.32)' : 'rgba(255,255,255,0.12)' },
        ]}
      />

      {/* Glass highlight */}
      <View style={styles.glassHighlight} />

      {/* Left accent bar */}
      {isUnread && <View style={styles.accentBar} />}

      <View style={styles.cardInner}>
        {/* Icon */}
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: isUnread ? GOLD_10 : 'rgba(255,255,255,0.06)',
              borderColor: isUnread ? GOLD_30 : 'rgba(255,255,255,0.1)',
            },
          ]}>
          <Bell size={16} color={isUnread ? GOLD : 'rgba(255,255,255,0.35)'} strokeWidth={1.8} />
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <View style={styles.titleRow}>
            <View style={styles.titleWrap}>
              <Text
                style={[styles.title, { color: isUnread ? WHITE_88 : WHITE_45 }]}
                numberOfLines={1}>
                {item.title}
              </Text>
              {isUnread && <View style={styles.unreadDot} />}
            </View>
            <View style={styles.timeWrap}>
              <Clock size={10} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
              <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
            </View>
          </View>

          <Text style={[styles.body, { color: isUnread ? WHITE_70 : WHITE_28 }]} numberOfLines={2}>
            {item.body}
          </Text>
        </View>
      </View>
    </View>
  );
};

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
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<INotification[]>(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  // Mark all unread as read after a short delay (simulates screen focus)
  const markAllRead = useCallback(() => {
    const timer = setTimeout(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setNotifications(MOCK_NOTIFICATIONS);
      setRefreshing(false);
    }, 800);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <PageSafeContainer style={styles.container}>
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

  // ── Card ──
  card: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  cardShimmer: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 1,
    borderRadius: 1,
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 2.5,
    backgroundColor: GOLD,
    borderRadius: 2,
    opacity: 0.7,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
    gap: 5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GOLD,
    flexShrink: 0,
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexShrink: 0,
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.25)',
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
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
