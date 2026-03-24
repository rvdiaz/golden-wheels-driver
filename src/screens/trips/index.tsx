import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import Text from '~/codidge_components/UI/text';
import { Booking, TabKey } from './interfaces';
import { filterByTab, GOLD, GOLD_20, GOLD_30, TABS } from './helpers';
import { MOCK_BOOKINGS } from './data';
import { TripCard } from './components/tripCard';
import { theme } from '~/theme/theme';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

interface TabBarProps {
  activeTab: TabKey;
  counts: Record<TabKey, number>;
  onTabChange: (tab: TabKey) => void;
}

const TabBar = ({ activeTab, counts, onTabChange }: TabBarProps) => (
  <View style={styles.tabBar}>
    {TABS.map((t) => {
      const isActive = t.key === activeTab;
      return (
        <TouchableOpacity
          key={t.key}
          onPress={() => onTabChange(t.key)}
          activeOpacity={0.75}
          style={[styles.tabItem, isActive && styles.tabItemActive]}>
          {isActive && <View style={styles.tabDot} />}
          <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{t.label}</Text>
          <View style={[styles.tabCount, !isActive && styles.tabCountInactive]}>
            <Text style={[styles.tabCountText, !isActive && styles.tabCountTextInactive]}>
              {counts[t.key]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ tab }: { tab: TabKey }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>○</Text>
    <Text style={styles.emptyTitle}>No {tab} trips</Text>
    <Text style={styles.emptySubtitle}>
      {tab === 'upcoming'
        ? 'Book a ride to get started'
        : tab === 'past'
          ? 'Your completed trips will appear here'
          : 'No cancellations on record'}
    </Text>
  </View>
);

// ─── Trips Screen ─────────────────────────────────────────────────────────────

export const TripsScreen = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('upcoming');

  // Replace MOCK_BOOKINGS with your real data source / API hook:
  // const { data: bookings = [], isLoading } = useBookings();
  const bookings: Booking[] = MOCK_BOOKINGS;

  const counts: Record<TabKey, number> = {
    upcoming: filterByTab(bookings, 'upcoming').length,
    past: filterByTab(bookings, 'past').length,
    cancelled: filterByTab(bookings, 'cancelled').length,
  };

  const filtered = filterByTab(bookings, activeTab);

  const handleCardPress = (booking: Booking) => {
    // Wire up your navigation here:
    // navigation.navigate('TripDetail', { bookingId: booking.id });
    console.log('Tapped booking:', booking.bookingCode);
  };

  return (
    <BodyWrapper gradientCoverage={0.45}>
      <PageSafeContainer>
        {/* Header */}
        <View style={styles.screenHeader}>
          <View style={styles.titleIconWrap}>
            <View style={styles.titleIconDot} />
          </View>
          <Text style={styles.screenTitle}>My Trips</Text>
        </View>

        {/* Tabs */}
        <TabBar activeTab={activeTab} counts={counts} onTabChange={setActiveTab} />

        {/* Content */}
        {filtered.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TripCard booking={item} tab={activeTab} onPress={handleCardPress} />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          />
        )}
      </PageSafeContainer>
    </BodyWrapper>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Screen header ──
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  titleIconWrap: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleIconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0a0a0f',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: GOLD,
    letterSpacing: 0.4,
  },

  // ── Tab bar ──
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 0.5,
    borderColor: 'rgba(218,192,114,0.14)',
    borderRadius: theme.borderRadius.lg,
    padding: 4,
    gap: 4,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 5,
  },
  tabItemActive: {
    backgroundColor: GOLD_20,
    borderWidth: 0.5,
    borderColor: GOLD_30,
  },
  tabDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: GOLD,
  },
  tabLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '400',
  },
  tabLabelActive: {
    color: GOLD,
    fontWeight: '500',
  },
  tabCount: {
    backgroundColor: GOLD_20,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 20,
  },
  tabCountInactive: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  tabCountText: {
    fontSize: 10,
    color: GOLD,
    fontWeight: '500',
  },
  tabCountTextInactive: {
    color: 'rgba(255,255,255,0.3)',
  },

  // ── List ──
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 32,
  },

  // ── Empty state ──
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 80,
  },
  emptyIcon: {
    fontSize: 28,
    color: 'rgba(255,255,255,0.12)',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.25)',
    fontWeight: '500',
  },
  emptySubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.15)',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
