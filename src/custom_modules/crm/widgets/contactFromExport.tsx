// widgets/phoneContactImport/ImportContactsModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Icons from 'lucide-react-native';
import { Search, Check, X, Phone, Mail, Building } from 'lucide-react-native';
import { theme } from '~/theme/theme';
import DropdownComponent from '~/codidge_components/UI/dropdown';
import { CONTACT_CATEGORY_OPTIONS } from '../helpers';
import { ContactCategory } from '../interfaces';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import * as Contacts from 'expo-contacts';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import Text from '~/codidge_components/UI/text';

interface PhoneContact {
  id: string;
  name?: string;
  phoneNumbers?: Array<{ number: string; label?: string }>;
  emails?: Array<{ email: string; label?: string }>;
  company?: string;
  jobTitle?: string;
}

interface ImportContactsModalProps {
  visible: boolean;
  onClose: () => void;
  onImport: (contacts: PhoneContact[], asLeads: boolean, category: any) => Promise<void>;
  existingContactPhones: string[]; // To check duplicates
}

export const ImportContactsModal: React.FC<ImportContactsModalProps> = ({
  visible,
  onClose,
  onImport,
  existingContactPhones,
}) => {
  const [phoneContacts, setPhoneContacts] = useState<PhoneContact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<PhoneContact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [importAsLeads, setImportAsLeads] = useState(true);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const [category, setCategory] = useState(ContactCategory.BUYER);

  // Load phone contacts when modal opens
  useEffect(() => {
    if (visible) {
      loadPhoneContacts();
    }
  }, [visible]);

  // Filter contacts based on search
  useEffect(() => {
    if (searchQuery) {
      const filtered = phoneContacts.filter((contact) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          contact.name?.toLowerCase().includes(searchLower) ||
          contact.company?.toLowerCase().includes(searchLower) ||
          contact.phoneNumbers?.some((p) => p.number.includes(searchQuery))
        );
      });
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(phoneContacts);
    }
  }, [searchQuery, phoneContacts]);

  const loadPhoneContacts = async () => {
    setLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Cannot access contacts without permission');
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails,
          Contacts.Fields.Company,
          Contacts.Fields.JobTitle,
        ],
      });

      // Filter out contacts that are already in CRM
      const newContacts = data.filter((contact) => {
        const phoneNumbers =
          contact.phoneNumbers?.map(
            (p) => p?.number?.replace(/\D/g, '') // Remove non-digits for comparison
          ) || [];

        return !phoneNumbers.some((phone) =>
          existingContactPhones.some((existing) => existing.replace(/\D/g, '') === phone)
        );
      });

      // Sort by name and filter out contacts without phone numbers
      const sortedContacts = newContacts
        .filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0)
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

      setPhoneContacts(sortedContacts as PhoneContact[]);
      setFilteredContacts(sortedContacts as PhoneContact[]);
    } catch (error) {
      console.error('Error loading contacts:', error);
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const toggleContactSelection = (contactId: string) => {
    const newSelection = new Set(selectedContacts);
    if (newSelection.has(contactId)) {
      newSelection.delete(contactId);
    } else {
      newSelection.add(contactId);
    }
    setSelectedContacts(newSelection);
  };

  const handleImport = async () => {
    if (selectedContacts.size === 0) {
      Alert.alert('No Selection', 'Please select at least one contact to import');
      return;
    }

    setImporting(true);
    try {
      const contactsToImport = phoneContacts.filter((c) => selectedContacts.has(c.id));

      await onImport(contactsToImport, importAsLeads, category);

      Alert.alert(
        'Success',
        `Imported ${contactsToImport.length} ${importAsLeads ? 'leads' : 'contacts'}`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to import contacts');
    } finally {
      setImporting(false);
    }
  };

  const renderContact = ({ item }: { item: PhoneContact }) => {
    const isSelected = selectedContacts.has(item.id);
    const primaryPhone = item.phoneNumbers?.[0]?.number;
    const primaryEmail = item.emails?.[0]?.email;

    return (
      <TouchableOpacity
        style={[styles.contactItem, isSelected && styles.contactItemSelected]}
        onPress={() => toggleContactSelection(item.id)}>
        <View style={styles.contactCheckbox}>
          {isSelected && <Check size={16} color={theme.colors.primary} />}
        </View>

        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name || 'Unknown'}</Text>

          {item.company && (
            <View style={styles.contactDetail}>
              <Building size={12} color="#6B7280" />
              <Text style={styles.contactDetailText}>{item.company}</Text>
            </View>
          )}

          {primaryPhone && (
            <View style={styles.contactDetail}>
              <Phone size={12} color="#6B7280" />
              <Text style={styles.contactDetailText}>{primaryPhone}</Text>
            </View>
          )}

          {primaryEmail && (
            <View style={styles.contactDetail}>
              <Mail size={12} color="#6B7280" />
              <Text style={styles.contactDetailText} numberOfLines={1}>
                {primaryEmail}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Import Phone Contacts</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <InputField
              style={styles.searchInput}
              placeholder="Search contacts..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Import Type Toggle */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Import as:</Text>
            <View style={styles.toggleOptions}>
              <TouchableOpacity
                style={[styles.toggleOption, importAsLeads && styles.toggleOptionActive]}
                onPress={() => setImportAsLeads(true)}>
                <Text style={[styles.toggleText, importAsLeads && styles.toggleTextActive]}>
                  Leads
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleOption, !importAsLeads && styles.toggleOptionActive]}
                onPress={() => setImportAsLeads(false)}>
                <Text style={[styles.toggleText, !importAsLeads && styles.toggleTextActive]}>
                  Contacts
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 16,
            }}>
            <DropdownComponent
              required={true}
              data={CONTACT_CATEGORY_OPTIONS}
              placeholder="Select contact category"
              value={category}
              onChange={(cat) => {
                setCategory(cat as ContactCategory);
              }}
              icon={<Icons.User size={16} color="gray" />}
            />
          </View>
          {/* Selection Info */}
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>
              {selectedContacts.size} of {filteredContacts.length} selected
            </Text>
            {selectedContacts.size > 0 && (
              <TouchableOpacity onPress={() => setSelectedContacts(new Set())}>
                <Text style={styles.clearText}>Clear all</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Contact List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading contacts...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.id}
              renderItem={renderContact}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {searchQuery ? 'No contacts found' : 'No new contacts to import'}
                  </Text>
                </View>
              }
            />
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <PrimaryButton
              size={ButtonSize.LARGE}
              style={{
                ...styles.cancelButton,
                flex: 1,
              }}
              textStyle={styles.cancelButtonText}
              onPress={onClose}
              loading={importing}
              title="Cancel"
              disabled={selectedContacts.size === 0 || importing}
            />
            <PrimaryButton
              size={ButtonSize.LARGE}
              style={{
                flex: 1,
              }}
              onPress={handleImport}
              loading={importing}
              title={`Import ${selectedContacts.size > 0 && `(${selectedContacts.size})`}`}
              disabled={selectedContacts.size === 0 || importing}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  toggleOptions: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  toggleOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  toggleOptionActive: {
    backgroundColor: '#fff',
  },
  toggleText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: theme.colors.primary,
  },
  selectionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  selectionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  clearText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactItemSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: theme.colors.primary,
  },
  contactCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  contactDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  contactDetailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#6B7280',
  },
  importButton: {
    backgroundColor: theme.colors.primary,
  },
  importButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
