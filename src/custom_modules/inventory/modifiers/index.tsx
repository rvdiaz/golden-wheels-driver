import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { ModifiersList } from './components/modifiers_list';
import { ModifierGroupsList } from './components/modifier_groups_list';
import Text from '~/codidge_components/UI/text';
import { useTenant } from '~/store/tenant/useTenant';
import { Header } from '~/codidge_components/UI/header';
import { useNavigation } from '@react-navigation/native';

type TabType = 'modifiers' | 'groups';

export const ModifiersPage = () => {
  const navigation = useNavigation();

  const { userInfo } = useTenant();

  const [activeTab, setActiveTab] = useState<TabType>('modifiers');

  return (
    <PageSafeContainer style={styles.container}>
      <Header
        onBack={() => {
          navigation.goBack();
        }}
        title=""
        showBack={true}
      />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'modifiers' && styles.activeTab]}
          onPress={() => setActiveTab('modifiers')}>
          <Text style={[styles.tabText, activeTab === 'modifiers' && styles.activeTabText]}>
            Modifiers
          </Text>
          {activeTab === 'modifiers' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}>
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>
            Groups
          </Text>
          {activeTab === 'groups' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'modifiers' ? (
          <ModifiersList tenantID={userInfo?.activeTenantId!} />
        ) : (
          <View></View>
        )}
        {activeTab === 'groups' ? (
          <ModifierGroupsList tenantID={userInfo?.activeTenantId!} />
        ) : (
          <View></View>
        )}
      </View>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    // Active tab styling is handled by indicator
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#3B82F6',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  content: {
    flex: 1,
  },
});
