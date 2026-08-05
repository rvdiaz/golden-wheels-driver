import { FlatList, StyleSheet, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { ScreenHeader } from '~/codidge_components/UI/screenHeader';
import Text from '~/codidge_components/UI/text';
import { useState, useCallback } from 'react';
import { theme } from '~/theme/theme';
import { useUserNotifications } from './hooks/useUserNotifications';
import { NotificationCard } from './widgets/notificationCard';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import { translate, useTranslation } from '~/i18n';

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
    <Text style={styles.emptyTitle}>{translate('alerts.allCaughtUp')}</Text>
    <Text style={styles.emptyMessage}>{translate('alerts.emptyBody')}</Text>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export const NotificationsScreen = () => {
  const { t } = useTranslation();
  const { notifications, loadingNotifications, refetchNotifications } = useUserNotifications();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchNotifications();
    setTimeout(() => {
      //setNotifications(MOCK_NOTIFICATIONS);
      setRefreshing(false);
    }, 800);
  }, []);

  const unread = notifications?.filter((n) => !n.read).length ?? 0;

  const header = (
    <ScreenHeader
      title={t('alerts.title')}
      subtitle={
        notifications.length === 0
          ? undefined
          : unread > 0
            ? t('alerts.summary', { unread, total: notifications.length })
            : t('alerts.allCaughtUp')
      }
    />
  );

  if (loadingNotifications) {
    return (
      <PageSafeContainer style={styles.container}>
        {header}
        <PageLoading />
      </PageSafeContainer>
    );
  }


  return (
    <PageSafeContainer style={styles.container}>
      {header}
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
    fontSize: 17,
    fontWeight: '500',
    color: theme.colors.secondaryText,
  },
  emptyMessage: {
    fontSize: 14,
    color: theme.colors.textColor,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
