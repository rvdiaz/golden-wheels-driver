// hooks/usePhoneContacts.ts
import * as Contacts from 'expo-contacts';
import { useState } from 'react';

export const usePhoneContacts = () => {
  const [phoneContacts, setPhoneContacts] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    return status === 'granted';
  };

  const loadPhoneContacts = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return [];
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

    return data;
  };

  return {
    phoneContacts,
    loadPhoneContacts,
    hasPermission,
    requestPermission,
  };
};
