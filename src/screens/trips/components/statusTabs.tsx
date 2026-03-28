import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { TabKey } from '../interfaces';
import { TABS } from '../helpers';
const GOLD = theme.colors.primary;

interface TabBarProps {
  activeTab: TabKey;
  counts: Record<TabKey, number>;
  onTabChange: (tab: TabKey) => void;
}
export const TabBar = ({ activeTab, counts, onTabChange }: TabBarProps) => (
  <View style={styles.wrapper}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabBar}>
      {TABS.map((t) => {
        const isActive = t.key === activeTab;
        return (
          <TouchableOpacity
            key={t.key}
            onPress={() => onTabChange(t.key)}
            activeOpacity={0.7}
            style={[styles.tab, isActive && styles.tabActive]}>
            <Text style={[styles.label, isActive && styles.labelActive]}>{t.label}</Text>
            <View style={[styles.badge, isActive && styles.badgeActive]}>
              <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                {counts[t.key]}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
    {/* Bottom rule */}
    <View style={styles.rule} />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing.lg,
  },
  tabBar: {
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    gap: 0,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: GOLD,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
  },
  labelActive: {
    color: GOLD,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  badgeActive: {
    backgroundColor: 'rgba(212,168,83,0.18)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.3)',
  },
  badgeTextActive: {
    color: GOLD,
  },
  rule: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: theme.spacing.lg,
  },
});
