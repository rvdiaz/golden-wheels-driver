import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { Calendar } from 'lucide-react-native';
import { CreateListingTab } from './CreateListingTab';
import { BrowseListingsTab } from './BrowseListingsTab';
import { theme } from '~/theme/theme';
import { ManageVisitRequestsTab } from './ManageVisitRequestsTab';

export const OpenHousesPage = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'create' | 'browse' | 'manage'>('create');

  const renderTabButton = (tab: 'create' | 'browse' | 'manage', label: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}>
      <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <PageSafeContainer>
      <Header
        title="Open House Listings"
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.banner}>
          <Calendar color={theme.colors.primary} size={24} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Open House Coordination</Text>
            <Text style={styles.bannerSubtitle}>
              Create listings and coordinate open house schedules with other agents
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {renderTabButton('create', 'Create')}
          {renderTabButton('browse', 'Browse')}
          {renderTabButton('manage', 'Manage')}
        </View>

        {/* Tab Content */}
        {activeTab === 'create' && <CreateListingTab />}
        {activeTab === 'browse' && <BrowseListingsTab />}
        {activeTab === 'manage' && <ManageVisitRequestsTab />}
      </ScrollView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  banner: {
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#ddd6fe',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5b21b6',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#fff',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#111827',
  },
  tabContent: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  cardContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonSuccess: {
    backgroundColor: '#16a34a',
  },
  buttonDanger: {
    backgroundColor: '#dc2626',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonOutlineText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonFlex: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listingAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  listingMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#6b7280',
  },
  listingDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  bookingForm: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
    gap: 16,
  },
  bookingFormTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  mt16: {
    marginTop: 16,
  },
  requestCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  requestAddress: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  requestMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  requestMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  messageBox: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 13,
    color: '#4b5563',
  },
  responseBox: {
    backgroundColor: '#f5f3ff',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
  },
  responseText: {
    fontSize: 13,
    color: '#5b21b6',
  },
  bold: {
    fontWeight: '600',
  },
});
