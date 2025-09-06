import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Icons from 'lucide-react-native';
import { PhoneContact } from '../../interfaces';
import InputField from '~/codidge_components/UI/form/inputs/inputField';

interface IContactSelectorProps {
  showPhoneContacts: boolean;
  onClose: () => void;
  onContactSelect: (contactInfo: PhoneContact) => void;
  phoneContacts: PhoneContact[];
}

export const ContactSelector = ({
  showPhoneContacts,
  onClose,
  onContactSelect,
  phoneContacts,
}: IContactSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const renderPhoneContact = ({ item }: { item: PhoneContact }) => {
    const primaryPhone = item.phoneNumbers?.[0]?.number;
    const primaryEmail = item.emails?.[0]?.email;

    return (
      <TouchableOpacity style={styles.phoneContactItem} onPress={() => onContactSelect(item)}>
        <View style={styles.phoneContactInfo}>
          <Text style={styles.phoneContactName}>{item.name || 'Unknown'}</Text>
          {item.company && <Text style={styles.phoneContactDetail}>🏢 {item.company}</Text>}
          {primaryPhone && <Text style={styles.phoneContactDetail}>📱 {primaryPhone}</Text>}
          {primaryEmail && (
            <Text style={styles.phoneContactDetail} numberOfLines={1}>
              ✉️ {primaryEmail}
            </Text>
          )}
        </View>
        <Icons.ChevronRight size={20} color="#9CA3AF" />
      </TouchableOpacity>
    );
  };

  const filteredContacts = phoneContacts.filter((contact) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(searchLower) ||
      contact.company?.toLowerCase().includes(searchLower) ||
      contact.phoneNumbers?.some((p) => p.number.includes(searchQuery))
    );
  });

  return (
    <Modal
      visible={showPhoneContacts}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Contact</Text>
            <TouchableOpacity onPress={onClose}>
              <Icons.X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 16,
            }}>
            <InputField
              placeholder="Search contacts..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<Icons.Search size={16} color="#6B7280" />}
            />
          </View>

          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={renderPhoneContact}
            contentContainerStyle={styles.contactsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No contacts found</Text>
              </View>
            }
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  phoneContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  phoneContactInfo: {
    flex: 1,
  },
  phoneContactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  phoneContactDetail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    maxHeight: '90%', // Prevents modal from taking full screen
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  contactsList: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexGrow: 1, // Allows list to expand but also shrink when needed
  },
});
