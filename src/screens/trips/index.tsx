import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import Text from '~/codidge_components/UI/text';
import { Booking, TabKey } from './interfaces';
import { filterByTab } from './helpers';
import { TripCard } from './components/tripCard';
import { theme } from '~/theme/theme';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { useCustomerTrips } from './hooks/useCustomerTrips';
import { TabBar } from './components/statusTabs';
import { LoadingSpinner } from '~/codidge_components/UI/loading/loadingSpinner';
import { Header } from '~/codidge_components/UI/header';

const GOLD = theme.colors.primary;

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
  const { tripLists, loadingTrips } = useCustomerTrips({});

  const counts: Record<TabKey, number> = {
    upcoming: filterByTab(tripLists, 'upcoming').length,
    past: filterByTab(tripLists, 'past').length,

    cancelled: filterByTab(tripLists, 'cancelled').length,
    draft: filterByTab(tripLists, 'draft').length,
  };

  const filtered = filterByTab(tripLists, activeTab);

  return (
    <BodyWrapper gradientCoverage={0.45}>
      <PageSafeContainer>
        {/* Header */}
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
              <Text style={styles.screenTitle}>My Trips</Text>
            </View>
          }
          title={''}
          showBack
        />

        {/* Tabs — always visible */}
        <TabBar activeTab={activeTab} counts={counts} onTabChange={setActiveTab} />

        {/* Content — spinner or list */}
        {loadingTrips ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <LoadingSpinner />
          </View>
        ) : filtered.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <TripCard booking={item} tab={activeTab} />}
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
    paddingBottom: theme.spacing.md,
  },

  screenTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: GOLD,
    letterSpacing: 0.4,
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
    color: 'rgba(255,255,255,0.62)',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
  },
  emptySubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
