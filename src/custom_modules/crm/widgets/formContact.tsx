import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import * as Icons from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { Header } from '~/codidge_components/UI/header';
import { ContactType, IContact, PhoneContact } from '../interfaces';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import Constants from 'expo-constants';
import DropdownComponent from '~/codidge_components/UI/dropdown';
import { CONTACT_CATEGORY_OPTIONS, CONTACT_TYPE_OPTIONS, formatPhoneNumberInput } from '../helpers';
import { theme } from '~/theme/theme';
import { useContactsQueries } from '../hooks/contactMutations';
import { ContactSelector } from './contactsPhone/contactSelector';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import * as Contacts from 'expo-contacts';
import PhoneInput from '~/codidge_components/UI/form/inputs/phoneNumberInput';
import { parsePhoneNumber, validatePhoneNumber } from '~/codidge_components/helpers';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export default function ContactForm({
  disposeModalHandler,
  contact,
}: {
  disposeModalHandler: (contact?: IContact) => void;
  contact?: IContact;
}) {
  const user = useReactiveVar(userData);
  const [loadedFromPhone, setLoadedFromPhone] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IContact>({
    defaultValues: {
      firstName: contact?.firstName ?? '',
      lastName: contact?.lastName ?? '',
      phone: contact?.phone ? formatPhoneNumberInput(contact?.phone) : '',
      email: contact?.email ?? '',
      address: contact?.address ?? '',
      notes: contact?.notes ?? '',
      category: contact?.category,
      priority: contact?.priority ?? 'medium',
      type: contact?.type ?? ContactType.LEAD,
      leadStatus: contact?.leadStatus ?? 'new',
    },
    mode: 'onChange',
  });

  const {
    handleAddContact,
    handleUpdateContact,
    saveContactToPhone,
    loadingAdd,
    updateUserContactData,
    loadingUpdate,
    phoneContacts,
    loadPhoneContacts,
    showPhoneContacts,
    setShowPhoneContacts,
    loadingPhoneContacts,
  } = useContactsQueries();

  const selectPhoneContact = (phoneContact: PhoneContact) => {
    // Parse the full name if firstName/lastName not available
    let firstName = phoneContact.firstName || '';
    let lastName = phoneContact.lastName || '';

    if (!firstName && !lastName && phoneContact.name) {
      const nameParts = phoneContact.name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    // Get primary contact details
    const primaryPhone = phoneContact.phoneNumbers?.[0]?.digits || '';
    const primaryEmail = phoneContact.emails?.[0]?.email || '';
    const primaryAddress = phoneContact.addresses?.[0];

    // Format address
    let addressString = '';
    if (primaryAddress) {
      const parts = [
        primaryAddress.street,
        primaryAddress.city,
        primaryAddress.region,
        primaryAddress.postalCode,
      ].filter(Boolean);
      addressString = parts.join(', ');
    }

    // Set form values
    setValue('firstName', firstName, { shouldValidate: true });
    setValue('lastName', lastName, { shouldValidate: true });
    setValue('phone', primaryPhone, { shouldValidate: true });
    setValue('email', primaryEmail, { shouldValidate: true });
    setValue('address', addressString);

    // Add company info to notes if available
    if (phoneContact.company || phoneContact.jobTitle) {
      const companyInfo = [phoneContact.jobTitle, phoneContact.company]
        .filter(Boolean)
        .join(' at ');
      setValue('notes', `Company: ${companyInfo}`);
    }
    setLoadedFromPhone(true);
    setShowPhoneContacts(false);
  };

  const onSubmit = async (data: IContact) => {
    try {
      const sanitizedData = {
        ...data,
        phone: data.phone.replace(/\D/g, ''),
      };

      if (contact?.id) {
        const res = await handleUpdateContact({
          tenant: { tenantId },
          userId: user?.id,
          contactId: contact.id,
          contactData: sanitizedData,
        });

        const updatedContact = res?.data?.updateUserContact;

        if (updatedContact) {
          reset({
            firstName: updatedContact.firstName ?? '',
            lastName: updatedContact.lastName ?? '',
            phone: updatedContact.phone ?? '',
            email: updatedContact.email ?? '',
            address: updatedContact.address ?? '',
            notes: updatedContact.notes ?? '',
            category: updatedContact.category ?? undefined,
            priority: updatedContact.priority ?? 'medium',
            type: updatedContact.type ?? ContactType.LEAD,
            leadStatus: updatedContact.leadStatus ?? 'new',
          });
        }

        disposeModalHandler(updatedContact);
      } else {
        const res = await handleAddContact({
          tenant: { tenantId },
          userId: user?.id,
          contactData: sanitizedData,
        });

        const { status } = await Contacts.getPermissionsAsync();

        if (res?.data?.addUserContact && !loadedFromPhone && status === 'granted') {
          Alert.alert(
            'Save to Phone Contacts?',
            'Would you like to also save this contact to your phone?',
            [
              {
                text: 'No',
                style: 'cancel',
                onPress: () => disposeModalHandler(res.data?.addUserContact),
              },
              {
                text: 'Yes',
                onPress: async () => {
                  try {
                    await saveContactToPhone(data);
                  } catch (error) {
                    Alert.alert('Error', 'Could not save to phone contacts');
                  }
                  disposeModalHandler(res.data?.addUserContact);
                },
              },
            ]
          );
        }

        reset({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          address: '',
          notes: '',
          category: undefined,
          priority: 'medium',
          type: ContactType.LEAD,
          leadStatus: 'new',
        });

        disposeModalHandler();
      }
    } catch (error) {
      Alert.alert('Error', 'Error adding contact!');
      console.log('data', data);
    }
  };

  return (
    <PageSafeContainer style={styles.container}>
      <Header
        title={contact?.id ? 'Edit Contact' : 'New Contact'}
        showBack={true}
        onBack={() => {
          if (contact?.id) {
            const updatedContact = updateUserContactData?.updateUserContact;
            disposeModalHandler(updatedContact);
          } else {
            disposeModalHandler();
          }
        }}
        rightAction={handleSubmit(onSubmit)}
        rightText="Save"
        loadingRight={loadingAdd || loadingUpdate}
      />

      {/* Import from Phone Button - Only show for new contacts */}
      {!contact?.id && (
        <TouchableOpacity
          style={styles.importButton}
          onPress={loadPhoneContacts}
          disabled={loadingPhoneContacts}>
          <Icons.Import size={20} color={theme.colors.primary} />
          <Text style={styles.importButtonText}>
            {loadingPhoneContacts ? 'Loading...' : 'Import from Phone Contacts'}
          </Text>
        </TouchableOpacity>
      )}

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <ScrollView
          style={styles.form}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formContent}>
          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="firstName"
                rules={{
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    leftIcon={<Icons.User size={16} color="#6B7280" />}
                    label="First name"
                    required={true}
                    placeholder="First name"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.firstName}
                    errorMessage={errors.firstName?.message}
                  />
                )}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="lastName"
                rules={{
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Last name"
                    placeholder="Last name"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.lastName}
                    errorMessage={errors.lastName?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Phone Field */}
          <View style={styles.fieldContainer}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="phone"
                rules={{
                  required: 'Phone number is required',
                  validate: (value) => {
                    const parsed = parsePhoneNumber(value);
                    const validation = validatePhoneNumber(parsed.number, parsed.country);
                    return validation.isValid || validation.message || 'Invalid phone number';
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    value={value}
                    onChangeValue={onChange}
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    required={true}
                    error={!!errors.phone}
                    errorMessage={errors.phone?.message}
                    defaultCountry="US"
                  />
                )}
              />
            </View>
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="email"
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    leftIcon={<Icons.Mail size={16} color="#6B7280" />}
                    label="Email"
                    placeholder="email@example.com"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={!!errors.email}
                    errorMessage={errors.email?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Category Field */}
          <View style={styles.fieldContainer}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="category"
                rules={{
                  required: 'Category is required',
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <DropdownComponent
                    label="Category"
                    required={true}
                    data={CONTACT_CATEGORY_OPTIONS}
                    placeholder="Select contact category"
                    value={value ?? ''}
                    onChange={onChange}
                    error={!!error}
                    errorMessage={error?.message}
                    icon={<Icons.User size={16} color="gray" />}
                  />
                )}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <DropdownComponent
                    label="Type"
                    required={true}
                    data={CONTACT_TYPE_OPTIONS}
                    placeholder="Select contact type"
                    value={value ?? ContactType.LEAD}
                    onChange={onChange}
                    error={!!error}
                    errorMessage={error?.message}
                    icon={<Icons.UserCircle size={16} color="gray" />}
                  />
                )}
              />
            </View>
          </View>

          {/* Address Field */}
          <View style={styles.fieldContainer}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    leftIcon={<Icons.Map size={16} color="#6B7280" />}
                    label="Address"
                    placeholder="123 Main St, City, State 12345"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
          </View>

          {/* Notes Field */}
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Notes"
                placeholder="Additional notes"
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{
                  minHeight: 80,
                }}
              />
            )}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Phone Contacts Modal */}
      <ContactSelector
        showPhoneContacts={showPhoneContacts}
        onContactSelect={selectPhoneContact}
        onClose={() => setShowPhoneContacts(false)}
        phoneContacts={phoneContacts}
      />
    </PageSafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  form: {
    flex: 1,
    padding: 24,
  },
  formContent: {
    paddingBottom: 100,
  },
  fieldContainer: {
    marginBottom: 10,
    gap: 10,
    flexDirection: 'row',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
  },
  importButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
  },
});
