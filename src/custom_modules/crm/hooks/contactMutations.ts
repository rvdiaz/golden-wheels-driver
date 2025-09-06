import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { IContact, PhoneContact } from '../interfaces';
import { getUserContacts } from '../graphql/queries';
import { addContactMutation, updateContactMutation } from '../graphql/mutations';
import { userData } from '~/store/user';
import Constants from 'expo-constants';
import { Alert } from 'react-native';
import { useState } from 'react';
import * as Contacts from 'expo-contacts';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const useContactsQueries = () => {
  const currentUser = useReactiveVar(userData);

  const {
    data,
    loading: loadingContacts,
    refetch,
  } = useQuery<{ getUserContacts: IContact[] }>(getUserContacts, {
    variables: {
      tenant: { tenantId },
      userId: currentUser?.id,
    },
  });

  const [showPhoneContacts, setShowPhoneContacts] = useState(false);
  const [phoneContacts, setPhoneContacts] = useState<PhoneContact[]>([]);
  const [loadingPhoneContacts, setLoadingPhoneContacts] = useState(false);

  const loadPhoneContacts = async () => {
    setLoadingPhoneContacts(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Cannot access contacts without permission');
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.FirstName,
          Contacts.Fields.LastName,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails,
          Contacts.Fields.Company,
          Contacts.Fields.JobTitle,
          Contacts.Fields.Addresses,
        ],
      });

      // Sort contacts alphabetically
      const sortedContacts = data
        .filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0)
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

      setPhoneContacts(sortedContacts as PhoneContact[]);
      setShowPhoneContacts(true);
    } catch (error) {
      console.error('Error loading contacts:', error);
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setLoadingPhoneContacts(false);
    }
  };

  // Add contact mutation
  const [addContactFn, { loading: loadingAdd }] = useMutation<{
    addUserContact: IContact;
  }>(addContactMutation, {
    update(cache, { data }) {
      if (!data?.addUserContact) return;

      const newContact = data.addUserContact;

      const existingData = cache.readQuery<{ getUserContacts: IContact[] }>({
        query: getUserContacts,
        variables: { tenant: { tenantId }, userId: currentUser?.id },
      });

      if (existingData?.getUserContacts) {
        cache.writeQuery({
          query: getUserContacts,
          variables: { tenant: { tenantId }, userId: currentUser?.id },
          data: {
            getUserContacts: [...existingData.getUserContacts, newContact],
          },
        });
      }
    },
  });

  // Update contact mutation
  const [updateContactFn, { data: updateUserContactData, loading: loadingUpdate }] = useMutation<{
    updateUserContact: IContact;
  }>(updateContactMutation, {
    update(cache, { data }) {
      if (!data?.updateUserContact) return;
      const updatedContact = data.updateUserContact;

      cache.modify({
        fields: {
          getUserContacts(existingContactsRefs = [], { readField }) {
            return existingContactsRefs.map((contactRef: any) => {
              const id = readField('id', contactRef);
              if (id === updatedContact.id) {
                return { ...contactRef, ...updatedContact };
              }
              return contactRef;
            });
          },
        },
      });
    },
  });

  const saveContactToPhone = async (contactData: any) => {
    try {
      // Request permission
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Cannot save to contacts without permission');
        return;
      }

      // Create the contact
      const contactId = await Contacts.addContactAsync({
        name: `${contactData.firstName} ${contactData.lastName}`,
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        phoneNumbers: [
          {
            label: 'mobile',
            number: contactData.phone,
          },
        ],
        emails: [
          {
            label: 'work',
            email: contactData.email,
          },
        ],
        contactType: 'person',
        company: contactData.company,
        jobTitle: contactData.jobTitle,
        note: `Category: ${contactData.category}`,
        // You can add the category as a note or in other fields
      });

      return contactId;
    } catch (error) {
      console.error('Error saving to phone:', error);
      throw error;
    }
  };

  /**
   * Handlers (instead of exposing raw mutation functions)
   */
  const handleAddContact = async (input: any) => {
    try {
      return await addContactFn({ variables: input });
    } catch (error) {
      console.log('::error adding', error);
    }
  };

  const handleUpdateContact = async (input: any) => {
    try {
      return await updateContactFn({ variables: input });
    } catch (error) {
      console.log('::error updating', error);
    }
  };

  return {
    contacts: data?.getUserContacts ?? [],
    loadingContacts,
    loadingAdd,
    loadingUpdate,
    updateUserContactData,
    refetch,
    handleAddContact,
    handleUpdateContact,
    saveContactToPhone,
    loadPhoneContacts,
    phoneContacts,
    showPhoneContacts,
    setShowPhoneContacts,
    loadingPhoneContacts,
  };
};
