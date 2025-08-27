import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import React, { useState } from 'react';

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
            {tab.Icon && (
              <tab.Icon size={20} color={activeTab === tab.key ? '#2563EB' : '#6b7280'} />
            )}
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label} {tab?.indexNumber ? `(${tab.indexNumber})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 5,
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  activeTabText: {
    color: '#2563EB',
  },
});
