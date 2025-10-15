import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput } from 'react-native';
import { User, Search, X } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { IContact } from '../interfaces';

interface ContactSelectorProps {
  contacts: IContact[];
  selectedContact: IContact | null;
  onSelectContact: (contact: IContact) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
}

export const ContactSelector: React.FC<ContactSelectorProps> = ({
  contacts,
  selectedContact,
  onSelectContact,
  label = 'Contact',
  required = false,
  error = false,
  errorMessage,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) {
      return contacts;
    }

    const query = searchQuery.toLowerCase();
    return contacts.filter((contact) => {
      const fullName = `${contact.firstName} ${contact.lastName || ''}`.toLowerCase();
      const phone = contact.phone?.toLowerCase() || '';
      const email = contact.email?.toLowerCase() || '';

      return fullName.includes(query) || phone.includes(query) || email.includes(query);
    });
  }, [contacts, searchQuery]);

  const handleSelectContact = (contact: IContact) => {
    onSelectContact(contact);
    setModalVisible(false);
    setSearchQuery('');
  };

  const handleClose = () => {
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View>
      {/* Label */}
      <Text style={styles.label}>
        {label}
        {required && ' *'}
      </Text>

      {/* Contact Selector Button */}
      <TouchableOpacity
        style={[styles.selector, error && styles.selectorError]}
        onPress={() => setModalVisible(true)}>
        <View style={styles.selectorContent}>
          <View style={styles.iconContainer}>
            <User size={20} color="#6B7280" />
          </View>
          <View style={styles.selectorTextContainer}>
            {selectedContact ? (
              <>
                <Text style={styles.selectedContactName}>
                  {selectedContact.firstName} {selectedContact.lastName || ''}
                </Text>
                {selectedContact.phone && (
                  <Text style={styles.selectedContactDetail}>{selectedContact.phone}</Text>
                )}
              </>
            ) : (
              <Text style={styles.placeholder}>Select a contact</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Error Message */}
      {error && errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {/* Contact Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}>
        <PageSafeContainer style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <Header title="Select Contact" showBack={true} onBack={handleClose} />

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputWrapper}>
                <Search size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name, phone, or email..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                    <X size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Contact List */}
            <ScrollView
              style={styles.contactList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contactListContent}>
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <TouchableOpacity
                    key={contact.id}
                    style={[
                      styles.contactCard,
                      selectedContact?.id === contact.id && styles.contactCardSelected,
                    ]}
                    onPress={() => handleSelectContact(contact)}>
                    <View style={styles.contactCardIcon}>
                      <User size={24} color="#3B82F6" />
                    </View>
                    <View style={styles.contactCardContent}>
                      <Text style={styles.contactCardName}>
                        {contact.firstName} {contact.lastName || ''}
                      </Text>
                      {contact.phone && (
                        <Text style={styles.contactCardDetail}>{contact.phone}</Text>
                      )}
                      {contact.email && (
                        <Text style={styles.contactCardDetail}>{contact.email}</Text>
                      )}
                    </View>
                    {selectedContact?.id === contact.id && (
                      <View style={styles.selectedIndicator} />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <User size={48} color="#D1D5DB" />
                  <Text style={styles.emptyStateText}>No contacts found</Text>
                  {searchQuery && (
                    <Text style={styles.emptyStateSubtext}>Try adjusting your search criteria</Text>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </PageSafeContainer>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  selector: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  selectorError: {
    borderColor: '#EF4444',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorTextContainer: {
    flex: 1,
  },
  selectedContactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  selectedContactDetail: {
    fontSize: 14,
    color: '#6B7280',
  },
  placeholder: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  contactList: {
    flex: 1,
  },
  contactListContent: {
    padding: 16,
    gap: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  contactCardSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  contactCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactCardContent: {
    flex: 1,
  },
  contactCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  contactCardDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
