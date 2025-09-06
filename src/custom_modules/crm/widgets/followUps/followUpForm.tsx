import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import { X, User } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { IContact, IFollowUp } from '../../interfaces';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { DateInputField } from '~/codidge_components/UI/form/inputs/datePicker';
import { DateTimeInputField } from '~/codidge_components/UI/form/inputs/dateTimePicker';
import moment from 'moment';
import { Header } from '~/codidge_components/UI/header';

interface FollowUpFormValues {
  contactId: string;
  title: string;
  date: string;
  time: Date | string | null;
  notes?: string;
}

interface AddFollowUpModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (followUp: Partial<IFollowUp>) => void;
  defaultContact?: IContact;
  contacts?: IContact[];
  loading?: boolean;
}

export const AddFollowUpModal: React.FC<AddFollowUpModalProps> = ({
  visible,
  onClose,
  onSave,
  contacts = [],
  loading = false,
  defaultContact,
}) => {
  const [showContactList, setShowContactList] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<FollowUpFormValues>({
    defaultValues: {
      contactId: '',
      title: '',
      date: '',
      time: new Date(new Date().setHours(9, 0, 0, 0)), // Date at 09:00 today
      notes: '',
    },
  });

  // Set default date to tomorrow and contactId when modal opens
  useEffect(() => {
    if (visible) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedDate = moment(tomorrow).format('YYYY-MM-DD');
      setValue('date', formattedDate);

      // Set contactId if defaultContact is provided
      if (defaultContact) {
        setValue('contactId', defaultContact.id);
      }
    }
  }, [visible, setValue, defaultContact]);

  const resetForm = () => {
    reset({
      contactId: '',
      title: '',
      date: '',
      time: new Date(new Date().setHours(9, 0, 0, 0)), // Date at 09:00 today
      notes: '',
    });
    setSelectedContact(null);
    setShowContactList(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSelectContact = (contact: IContact) => {
    setSelectedContact(contact);
    setValue('contactId', contact.id);
    setShowContactList(false);
  };

  const onSubmit = async (data: FollowUpFormValues) => {
    try {
      if (!selectedContact && !defaultContact) {
        Alert.alert('Error', 'Please select a contact');
        return;
      }

      const timeAux = data.time
        ? new Date(data.time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // remove if you want AM/PM
          })
        : '09:00';

      const followUpData: Partial<IFollowUp> = {
        contact: {
          contactId: defaultContact?.id ?? selectedContact!.id,
          firstName: defaultContact?.firstName ?? selectedContact!.firstName,
          lastName: defaultContact?.lastName ?? (selectedContact!.lastName || ''),
          phone: defaultContact?.phone ?? (selectedContact!.phone || ''),
          email: defaultContact?.email ?? (selectedContact!.email || ''),
        },
        title: data.title ?? 'Follow up',
        notes: data.notes ?? '',
        time: timeAux,
        date: data.date,
      };

      await onSave(followUpData);
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add follow-up');
      console.error('Follow-up creation error:', error);
    }
  };

  const quickTitles = [
    'Follow up call',
    'Check in',
    'Send quote',
    'Schedule meeting',
    'Send proposal',
    'Welcome call',
  ];

  const handleQuickTitle = (title: string) => {
    setValue('title', title);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modalContent, { marginBottom: Platform.OS ? 50 : 0 }]}>
            <Header
              title="New Follow up"
              showBack={true}
              onBack={handleClose}
              rightAction={handleSubmit(onSubmit)}
              rightText="Save"
              loadingRight={loading}
              disabledRight={!isValid}
            />
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              {/* Contact Selection or Display */}
              {defaultContact ? (
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Contact</Text>
                  <View style={styles.defaultContactDisplay}>
                    <View style={styles.contactIcon}>
                      <User size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>
                        {defaultContact.firstName} {defaultContact.lastName || ''}
                      </Text>
                      {defaultContact.phone && (
                        <Text style={styles.contactDetail}>{defaultContact.phone}</Text>
                      )}
                      {defaultContact.email && (
                        <Text style={styles.contactDetail}>{defaultContact.email}</Text>
                      )}
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.fieldContainer}>
                  <Controller
                    control={control}
                    name="contactId"
                    rules={{ required: 'Contact is required' }}
                    render={({ fieldState: { error } }) => (
                      <View>
                        <Text style={styles.label}>Contact *</Text>
                        <TouchableOpacity
                          style={[styles.contactSelector, error && styles.contactSelectorError]}
                          onPress={() => setShowContactList(!showContactList)}>
                          <User size={20} color="#6B7280" />
                          <Text
                            style={[
                              styles.contactSelectorText,
                              !selectedContact && styles.placeholder,
                            ]}>
                            {selectedContact
                              ? `${selectedContact.firstName} ${selectedContact.lastName || ''}`.trim()
                              : 'Select contact'}
                          </Text>
                        </TouchableOpacity>
                        {error && <Text style={styles.errorText}>{error.message}</Text>}

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
                    )}
                  />
                </View>
              )}

              {/* Title */}
              <View style={styles.fieldContainer}>
                <Controller
                  control={control}
                  name="title"
                  rules={{ required: 'Title is required' }}
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      label="What to do?"
                      required={true}
                      placeholder="e.g., Follow up call"
                      value={value}
                      onChangeText={onChange}
                      error={!!errors.title}
                      errorMessage={errors.title?.message}
                    />
                  )}
                />

                {/* Quick title suggestions */}
                <View style={styles.quickTitles}>
                  {quickTitles.map((quickTitle) => (
                    <TouchableOpacity
                      key={quickTitle}
                      style={styles.quickTitleButton}
                      onPress={() => handleQuickTitle(quickTitle)}>
                      <Text style={styles.quickTitleText}>{quickTitle}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Date */}
              <View style={styles.fieldContainer}>
                <Controller
                  control={control}
                  name="date"
                  rules={{ required: 'Date is required' }}
                  render={({ field: { onChange, value } }) => (
                    <DateInputField
                      label="Date"
                      value={value ? new Date(value) : new Date()}
                      onChangeText={(date) => {
                        const formatted = moment(date).format('YYYY-MM-DD');
                        onChange(formatted);
                      }}
                      error={!!errors.date}
                      errorMessage={errors.date?.message}
                    />
                  )}
                />
              </View>

              {/* Time */}
              <View style={styles.fieldContainer}>
                <Controller
                  control={control}
                  name="time"
                  rules={{ required: 'Time is required' }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <DateTimeInputField
                      required={true}
                      mode="time"
                      label="Time"
                      value={value as Date}
                      onChangeText={onChange}
                      error={!!error}
                      errorMessage={error?.message}
                    />
                  )}
                />
              </View>

              {/* Notes */}
              <View style={styles.fieldContainer}>
                <Controller
                  control={control}
                  name="notes"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="Notes (optional)"
                      placeholder="Add any additional notes..."
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      multiline
                      numberOfLines={3}
                      style={styles.notesInput}
                    />
                  )}
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  // Default contact display styles
  defaultContactDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 1,
  },
  // Contact selector styles
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
  contactSelectorError: {
    borderColor: '#EF4444',
  },
  contactSelectorText: {
    fontSize: 16,
    color: '#1F2937',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
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
  notesInput: {
    height: 80,
  },
});
