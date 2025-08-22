import React, { useState } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import { ContactCard } from './contactCard';
import { IContact } from '../interfaces';
import InputField from '~/codidge_components/UI/form/inputs/inputField';

import * as Icons from 'lucide-react-native';

export const ContactList = ({ title, contacts }: { title: string; contacts: IContact[] }) => {
  const [inputSearch, setinputSearch] = useState<string>('');

  // Filter contacts based on search input
  const filteredContacts = contacts.filter((contact) => {
    const search = inputSearch.toLowerCase();

    // Search in first name, last name, email, phone, and category
    return (
      contact.firstName.toLowerCase().includes(search) ||
      contact.lastName.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      contact.phone.toLowerCase().includes(search) ||
      (contact.category?.toLowerCase().includes(search) ?? false)
    );
  });

  return (
    <View style={styles.contactsSection}>
      <Card style={styles.contactsCard}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <InputField
          value={inputSearch}
          onChangeText={(e) => {
            setinputSearch(e);
          }}
          placeholder="Search Contacts"
          leftIcon={<Icons.Search size={16} color="#2563EB" />}
        />

        {filteredContacts.length === 0 ? (
          <Text style={styles.noContactsText}>
            {inputSearch ? `No contacts found for "${inputSearch}"` : 'No contacts available'}
          </Text>
        ) : (
          <FlatList
            data={filteredContacts}
            renderItem={(item) => <ContactCard contact={item.item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  contactsSection: {
    flex: 2,
  },
  contactsCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
  },
  noContactsText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginVertical: 20,
  },
});
