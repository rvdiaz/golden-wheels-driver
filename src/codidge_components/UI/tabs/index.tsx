import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
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
            {!!tab?.indexNumber && (
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
            )}
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
