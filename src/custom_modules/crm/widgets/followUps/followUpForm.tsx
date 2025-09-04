import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, User } from 'lucide-react-native';
import { IContact, IFollowUp } from '../../interfaces';

interface AddFollowUpModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (followUp: Partial<IFollowUp>) => void;
  contacts?: IContact[];
}

export const AddFollowUpModal: React.FC<AddFollowUpModalProps> = ({
  visible,
  onClose,
  onSave,
  contacts = [],
}) => {
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [selectedContactName, setSelectedContactName] = useState<string>('');
  const [selectedLastName, setSelectedLastName] = useState<string>('');
  const [selectedContactPhone, setSelectedContactPhone] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('09:00');
  const [notes, setNotes] = useState<string>('');
  const [showContactList, setShowContactList] = useState<boolean>(false);

  // Set default date to tomorrow
  React.useEffect(() => {
    if (visible && !date) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [visible]);

  const resetForm = () => {
    setSelectedContact('');
    setSelectedContactName('');
    setSelectedContactPhone('');
    setTitle('');
    setDate('');
    setTime('09:00');
    setNotes('');
    setShowContactList(false);
  };

  const handleSave = () => {
    if (!selectedContact || !selectedContactName || !title || !date) return;

    const followUpData: Partial<IFollowUp> = {
      contact: {
        contactId: selectedContact,
        firstName: selectedContactName,
        phone: selectedContactPhone,
        lastName: selectedLastName,
      },
      notes: title,
      date: `${date}T${time}:00`,
    };

    onSave(followUpData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSelectContact = (contact: IContact) => {
    setSelectedContact(contact.id);
    setSelectedContactName(`${contact.firstName} ${contact.lastName || ''}`.trim());
    setSelectedContactPhone(contact.phone || '');
    setShowContactList(false);
  };

  const quickTitles = [
    'Follow up call',
    'Check in',
    'Send quote',
    'Schedule meeting',
    'Send proposal',
    'Welcome call',
  ];

  const isFormValid = selectedContact && title && date;

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={handleClose} />

        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Follow-up</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* Contact Selection */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Contact *</Text>
              <TouchableOpacity
                style={styles.contactSelector}
                onPress={() => setShowContactList(!showContactList)}>
                <User size={20} color="#6B7280" />
                <Text
                  style={[styles.contactSelectorText, !selectedContactName && styles.placeholder]}>
                  {selectedContactName || 'Select contact'}
                </Text>
              </TouchableOpacity>

              {showContactList && (
                <View style={styles.contactList}>
                  <ScrollView style={styles.contactScrollView} nestedScrollEnabled>
                    {contacts.map((contact) => (
                      <TouchableOpacity
                        key={contact.id}
                        style={styles.contactItem}
                        onPress={() => handleSelectContact(contact)}>
                        <Text style={styles.contactItemName}>
                          {contact.firstName} {contact.lastName}
                        </Text>
                        {contact.phone && (
                          <Text style={styles.contactItemPhone}>{contact.phone}</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Title */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>What to do? *</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Follow up call"
                placeholderTextColor="#9CA3AF"
              />

              {/* Quick title suggestions */}
              <View style={styles.quickTitles}>
                {quickTitles.map((quickTitle) => (
                  <TouchableOpacity
                    key={quickTitle}
                    style={styles.quickTitleButton}
                    onPress={() => setTitle(quickTitle)}>
                    <Text style={styles.quickTitleText}>{quickTitle}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date and Time */}
            <View style={styles.rowContainer}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Date *</Text>
                <TextInput
                  style={styles.textInput}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Time</Text>
                <TextInput
                  style={styles.textInput}
                  value={time}
                  onChangeText={setTime}
                  placeholder="HH:MM"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Notes */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Notes (optional)</Text>
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any additional notes..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!isFormValid}>
              <Text style={styles.saveButtonText}>Add Follow-up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  fieldHalf: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  notesInput: {
    height: 80,
  },
  contactSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFF',
  },
  contactSelectorText: {
    fontSize: 16,
    color: '#1F2937',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  contactList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFF',
    maxHeight: 150,
  },
  contactScrollView: {
    maxHeight: 148,
  },
  contactItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  contactItemPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  quickTitles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  quickTitleButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  quickTitleText: {
    fontSize: 14,
    color: '#6B7280',
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
