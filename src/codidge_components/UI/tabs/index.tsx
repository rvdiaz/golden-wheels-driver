import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { theme } from '~/theme/theme';

interface Tab {
  key: string;
  label: string;
  Icon?: React.FC<{ size?: number; color?: string }>;
  indexNumber?: number;
}

interface TabHeaderProps {
  tabs: Tab[];
  initialTabKey?: string;
  onTabChange?: (key: string) => void;
  containerStyle?: ViewStyle; // <-- NEW PROP
}

export const TabHeader: React.FC<TabHeaderProps> = ({
  tabs,
  initialTabKey,
  onTabChange,
  containerStyle,
}) => {
  const [activeTab, setActiveTab] = useState(initialTabKey || tabs[0].key);

  const handleTabPress = (key: string) => {
    setActiveTab(key);
    onTabChange?.(key);
  };

  return (
    <View style={[styles.header, containerStyle]}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => handleTabPress(tab.key)}>
            {tab.Icon && <tab.Icon size={18} color={'#0A0A0A'} />}
            <Text style={[styles.tabText]}>{tab.label}</Text>
            {tab?.indexNumber ? (
              <View
                style={{
                  padding: 2,
                  borderRadius: 20,
                  backgroundColor: theme.colors.primary,
                  height: 20,
                  width: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: '#FFF',
                  }}>
                  {tab.indexNumber}
                </Text>
              </View>
            ) : (
              <View></View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

interface Tab {
  key: string;
  label: string;
  Icon?: React.FC<{ size?: number; color?: string }>;
  indexNumber?: number;
}

interface TabHeaderProps {
  tabs: Tab[];
  initialTabKey?: string;
  onTabChange?: (key: string) => void;
  containerStyle?: ViewStyle;
}

// SOLUTION 1: Vertical Stack with Cards (Recommended for small screens)
export const VerticalTabCards: React.FC<TabHeaderProps> = ({
  tabs,
  initialTabKey,
  onTabChange,
  containerStyle,
}) => {
  const [activeTab, setActiveTab] = useState(initialTabKey || tabs[0].key);

  const handleTabPress = (key: string) => {
    setActiveTab(key);
    onTabChange?.(key);
  };

  return (
    <View style={[styles.verticalContainer, containerStyle]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.verticalCard, activeTab === tab.key && styles.verticalActiveCard]}
          onPress={() => handleTabPress(tab.key)}>
          <View style={styles.cardContent}>
            <View style={styles.cardLeft}>
              {tab.Icon && (
                <tab.Icon
                  size={24}
                  color={activeTab === tab.key ? theme.colors.primary : '#6B7280'}
                />
              )}
              <Text style={[styles.cardLabel, activeTab === tab.key && styles.activeCardLabel]}>
                {tab.label}
              </Text>
            </View>
            {!!tab?.indexNumber && (
              <View style={[styles.badge, activeTab === tab.key && styles.activeBadge]}>
                <Text style={[styles.badgeText, activeTab === tab.key && styles.activeBadgeText]}>
                  {tab.indexNumber}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// SOLUTION 2: Scrollable Horizontal Tabs (Better spacing)
export const ScrollableTabHeader: React.FC<TabHeaderProps> = ({
  tabs,
  initialTabKey,
  onTabChange,
  containerStyle,
}) => {
  const [activeTab, setActiveTab] = useState(initialTabKey || tabs[0].key);

  const handleTabPress = (key: string) => {
    setActiveTab(key);
    onTabChange?.(key);
  };

  return (
    <View style={[styles.scrollableHeader, containerStyle]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollableContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.scrollableTab,
              activeTab === tab.key && styles.scrollableActiveTab,
              index === 0 && styles.firstTab,
              index === tabs.length - 1 && styles.lastTab,
            ]}
            onPress={() => handleTabPress(tab.key)}>
            {tab.Icon && <tab.Icon size={18} color={activeTab === tab.key ? '#FFF' : '#6B7280'} />}
            <Text
              style={[
                styles.scrollableTabText,
                activeTab === tab.key && styles.scrollableActiveTabText,
              ]}>
              {tab.label}
            </Text>
            {!!tab?.indexNumber && (
              <View style={styles.scrollableBadge}>
                <Text style={styles.scrollableBadgeText}>{tab.indexNumber}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// SOLUTION 3: Compact Icon-First Tabs
export const CompactTabHeader: React.FC<TabHeaderProps> = ({
  tabs,
  initialTabKey,
  onTabChange,
  containerStyle,
}) => {
  const [activeTab, setActiveTab] = useState(initialTabKey || tabs[0].key);

  const handleTabPress = (key: string) => {
    setActiveTab(key);
    onTabChange?.(key);
  };

  return (
    <View style={[styles.compactHeader, containerStyle]}>
      <View style={styles.compactTabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.compactTab, activeTab === tab.key && styles.compactActiveTab]}
            onPress={() => handleTabPress(tab.key)}>
            <View style={styles.compactIconContainer}>
              {tab.Icon && (
                <tab.Icon
                  size={20}
                  color={activeTab === tab.key ? theme.colors.primary : '#6B7280'}
                />
              )}
              {!!tab?.indexNumber && (
                <View style={styles.compactBadge}>
                  <Text style={styles.compactBadgeText}>{tab.indexNumber}</Text>
                </View>
              )}
            </View>
            <Text
              style={[styles.compactTabText, activeTab === tab.key && styles.compactActiveTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Vertical Cards Styles
  verticalContainer: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 8,
  },
  verticalCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  verticalActiveCard: {
    backgroundColor: '#FFF',
    borderColor: theme.colors.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  activeCardLabel: {
    color: theme.colors.primary,
  },
  badge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 28,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: theme.colors.primary,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  activeBadgeText: {
    color: '#FFF',
  },

  // Scrollable Tabs Styles
  scrollableHeader: {
    paddingVertical: 10,
  },
  scrollableContainer: {
    paddingHorizontal: 18,
    gap: 8,
  },
  scrollableTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    gap: 6,
    minWidth: 100,
  },
  scrollableActiveTab: {
    backgroundColor: theme.colors.primary,
  },
  firstTab: {
    marginLeft: 0,
  },
  lastTab: {
    marginRight: 0,
  },
  scrollableTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  scrollableActiveTabText: {
    color: '#FFF',
  },
  scrollableBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  scrollableBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFF',
  },

  // Compact Tabs Styles
  compactHeader: {
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  compactTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 4,
  },
  compactTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  compactActiveTab: {
    backgroundColor: '#FFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  compactIconContainer: {
    position: 'relative',
  },
  compactTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  compactActiveTabText: {
    color: theme.colors.primary,
  },
  compactBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 16,
    alignItems: 'center',
  },
  compactBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 18,
    paddingVertical: 3,
    paddingHorizontal: 3,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    gap: 5,
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A0A0A',
    marginLeft: 2,
  },
});
