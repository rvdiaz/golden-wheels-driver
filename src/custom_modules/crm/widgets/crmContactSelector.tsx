import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Text from '~/codidge_components/UI/text';
import { Search, X, Trash2, UserPlus } from 'lucide-react-native';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { useContactsQueries } from '../hooks/contactMutations';
import IconButton from '~/codidge_components/UI/button/IconButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import { theme } from '~/theme/theme';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import { isValidEmail } from '../helpers';

// Contact Interface (adjust according to your contact structure)
interface IContact {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  // Add other contact properties as needed
}

// Contact Email Input Component
interface ContactEmailInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onContactSelect?: (contact: IContact) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  showContactsButton?: boolean;
}

export const ContactEmailInput: React.FC<ContactEmailInputProps> = ({
  value,
  onChangeText,
  onContactSelect,
  placeholder = 'Enter email address',
  label = 'Email',
  error,
  showContactsButton = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleContactSelect = (contact: IContact) => {
    if (onContactSelect) {
      onContactSelect(contact);
    } else {
      // Fallback to just setting the email
      onChangeText(contact.email);
    }
    setModalVisible(false);
  };

  const inputError =
    error || (value && !isValidEmail(value) ? 'Please enter a valid email address' : '');

  return (
    <>
      <View style={styles.inputContainer}>
        {label && <Text style={styles.inputLabel}>{label}</Text>}
        <View style={styles.inputRow}>
          <View style={styles.textInputWrapper}>
            <InputField
              style={[styles.textInput, inputError && styles.textInputError]}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={!!inputError}
              errorMessage={inputError}
            />
          </View>
          {showContactsButton && (
            <TouchableOpacity style={styles.contactsButton} onPress={() => setModalVisible(true)}>
              <UserPlus size={20} color="#007AFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showContactsButton && (
        <ContactSelectorModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onContactSelect={handleContactSelect}
        />
      )}
    </>
  );
};

// Multiple Contact Emails Selector Component
interface MultipleContactEmailsProps {
  emails: string[];
  onEmailsChange: (emails: string[]) => void;
  label?: string;
  minEmails?: number;
  maxEmails?: number;
  error?: string;
}

export const MultipleContactEmails: React.FC<MultipleContactEmailsProps> = ({
  emails,
  onEmailsChange,
  label = 'Contact Emails',
  minEmails = 1,
  maxEmails = 10,
  error,
}) => {
  const addEmailSlot = () => {
    if (emails.length < maxEmails) {
      onEmailsChange([...emails, '']);
    }
  };

  const removeEmailSlot = (index: number) => {
    if (emails.length > minEmails) {
      const newEmails = emails.filter((_, i) => i !== index);
      onEmailsChange(newEmails);
    }
  };

  const updateEmail = (index: number, email: string) => {
    const newEmails = [...emails];
    newEmails[index] = email;
    onEmailsChange(newEmails);
  };

  const handleContactSelect = (index: number, contact: IContact) => {
    updateEmail(index, contact.email);
  };

  // Validation
  const getEmailError = (email: string, index: number) => {
    if (!email) return undefined;
    if (!isValidEmail(email)) return 'Invalid email format';

    // Check for duplicates
    const duplicateIndex = emails.findIndex(
      (e, i) => i !== index && e.toLowerCase() === email.toLowerCase()
    );
    if (duplicateIndex !== -1) return 'Email already added';

    return undefined;
  };

  const hasValidEmails = emails.some((email) => email && isValidEmail(email));

  return (
    <View>
      <View style={styles.multipleEmailsHeader}>
        <Text style={styles.multipleEmailsLabel}>{label}</Text>
      </View>

      {emails.map((email, index) => (
        <View key={index} style={styles.emailSlotContainer}>
          <View
            style={[
              styles.emailSlotContent,
              {
                marginRight: emails.length > minEmails ? 10 : 0,
              },
            ]}>
            <ContactEmailInput
              value={email}
              onChangeText={(text) => updateEmail(index, text)}
              onContactSelect={(contact) => handleContactSelect(index, contact)}
              placeholder={`Email ${index + 1}`}
              label=""
              error={getEmailError(email, index)}
              showContactsButton={false}
            />
          </View>
          {emails.length > minEmails && (
            <View
              style={{
                minHeight: 48,
              }}>
              <IconButton
                onPress={() => removeEmailSlot(index)}
                icon={<Trash2 size={20} color="#dc3545" />}
              />
            </View>
          )}
        </View>
      ))}

      {/* Overall validation message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!hasValidEmails && emails.some((e) => e) && (
        <Text style={styles.warningText}>Please enter at least one valid email address</Text>
      )}
      {emails.length < maxEmails && (
        <OutlineButton
          size={ButtonSize.LARGE}
          onPress={addEmailSlot}
          color={theme.colors.info}
          title="Add Applicant"
          leftWidget={<UserPlus size={20} color={theme.colors.info} />}
        />
      )}
    </View>
  );
};

// Contact Selector Modal Component
interface ContactSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onContactSelect: (contact: IContact) => void;
}

export const ContactSelectorModal: React.FC<ContactSelectorModalProps> = ({
  visible,
  onClose,
  onContactSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);

  const {
    loadingContacts,
    contacts: dataContacts,
    handleAddContact,
    refetch,
  } = useContactsQueries();

  // Filter contacts based on search term
  const filteredContacts = useMemo(() => {
    if (!dataContacts) return [];

    const contacts = Array.isArray(dataContacts) ? dataContacts : [dataContacts];

    if (!searchTerm.trim()) return contacts;

    return contacts.filter((contact: IContact) => {
      const searchLower = searchTerm.toLowerCase();
      const name = contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim();

      return (
        name.toLowerCase().includes(searchLower) ||
        contact.email?.toLowerCase().includes(searchLower) ||
        contact.phone?.toLowerCase().includes(searchLower) ||
        contact.company?.toLowerCase().includes(searchLower)
      );
    });
  }, [dataContacts, searchTerm]);

  const formatContactDisplay = (contact: IContact) => {
    const name = contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
    return {
      name: name || 'Unknown Name',
      email: contact.email || 'No email',
      company: contact.company,
      phone: contact.phone,
    };
  };

  const renderSelectableContactItem = ({ item }: { item: IContact }) => {
    const { name, email, company, phone } = formatContactDisplay(item);

    return (
      <TouchableOpacity
        style={styles.selectableContactCard}
        onPress={() => onContactSelect(item)}
        activeOpacity={0.7}>
        {/* Contact Content */}
        <View style={styles.selectableContactContent}>
          {/* Contact Header */}
          <View style={styles.contactHeader}>
            <Text style={styles.selectableContactName} numberOfLines={1}>
              {name}
            </Text>
          </View>

          {/* Contact Details */}
          <View style={styles.contactDetailsSection}>
            <Text style={styles.contactEmail} numberOfLines={1}>
              {email}
            </Text>
            {company && (
              <Text style={styles.contactCompany} numberOfLines={1}>
                {company}
              </Text>
            )}
            {phone && (
              <Text style={styles.contactPhone} numberOfLines={1}>
                {phone}
              </Text>
            )}
          </View>
        </View>

        {/* Select Indicator */}
        <View style={styles.selectIndicator}>
          <Text style={styles.selectText}>Select</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>👥</Text>
      <Text style={styles.emptyStateTitle}>
        {searchTerm ? 'No contacts found' : 'No contacts available'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchTerm ? `No contacts match "${searchTerm}"` : 'Add a new contact to get started'}
      </Text>
    </View>
  );

  const resetModal = () => {
    setSearchTerm('');
    setShowContactForm(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Contact</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {showContactForm ? (
            // Contact Form View (you'll need to implement this based on your contact form)
            <View style={styles.formContainer}>
              <Text style={styles.formPlaceholder}>
                Contact Form Component
                {/* Replace with your actual ContactForm component */}
              </Text>
              <TouchableOpacity
                style={styles.backToListButton}
                onPress={() => setShowContactForm(false)}>
                <Text style={styles.backToListText}>Back to List</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Contact List View
            <>
              {/* Search Section */}
              <View style={styles.searchContainer}>
                <InputField
                  placeholder="Search contacts by name or email"
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  leftIcon={<Search size={16} />}
                  label=""
                />
              </View>

              {/* Add New Contact Button */}
              <View style={styles.addButtonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={() => setShowContactForm(true)}>
                  <UserPlus size={20} color="#007AFF" />
                  <Text style={styles.addButtonText}>Add New Contact</Text>
                </TouchableOpacity>
              </View>

              {/* Contacts List */}
              {loadingContacts ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007AFF" />
                  <Text style={styles.loadingText}>Loading contacts...</Text>
                </View>
              ) : (
                <FlatList
                  data={filteredContacts}
                  renderItem={renderSelectableContactItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContainer}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={renderEmptyState}
                />
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Email Input Styles
  inputContainer: {
    marginVertical: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textInputWrapper: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  textInputError: {
    borderColor: '#dc3545',
  },
  contactsButton: {
    marginLeft: 12,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#f0f7ff',
    borderWidth: 1,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    marginVertical: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#ff8c00',
    marginVertical: 8,
  },
  // Multiple Emails Styles
  multipleEmailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  multipleEmailsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#737373',
  },
  addEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f7ff',
  },
  addEmailText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  emailSlotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailSlotContent: {
    flex: 1,
  },
  removeEmailButton: {
    marginLeft: 12,
    padding: 8,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  addButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: '#f8f9ff',
  },
  addButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formPlaceholder: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  backToListButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  backToListText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },

  // Selectable Contact Item Styles
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  selectableContactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectableContactContent: {
    flex: 1,
  },
  contactHeader: {
    marginBottom: 8,
  },
  selectableContactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  contactDetailsSection: {
    gap: 2,
  },
  contactEmail: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  contactCompany: {
    fontSize: 13,
    color: '#666666',
  },
  contactPhone: {
    fontSize: 13,
    color: '#666666',
  },
  selectIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  selectText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },

  // Shared Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 48,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
