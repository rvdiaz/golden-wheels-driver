import React from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { ContactCategory, IContact } from '../interfaces';
import { useReactiveVar } from '@apollo/client';
import { crmSearhInput, selectedFiltersVar, selectedSortVar } from '../hooks/tabSelectionVar';
import { ContactCardIA } from './iaContactCard';

export const ContactList = ({ contacts }: { title: string; contacts: IContact[] }) => {
  const searchInputValue = useReactiveVar(crmSearhInput);

  const selectedFilters = useReactiveVar(selectedFiltersVar);
  const selectedSort = useReactiveVar(selectedSortVar);

  // Filter contacts based on search input
  const filteredContacts = contacts.filter((contact) => {
    const search = searchInputValue.toLowerCase();
    const contactCategory = contact.category?.toLowerCase();

    const matchesSearch =
      contact.firstName.toLowerCase().includes(search) ||
      contact.lastName.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      contact.phone.toLowerCase().includes(search) ||
      (contactCategory?.includes(search) ?? false);

    const matchesFilter =
      selectedFilters.size === 0 || // no filters applied → allow all
      (contactCategory && selectedFilters.has(contactCategory as ContactCategory));

    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.contactsSection}>
      {filteredContacts.length === 0 ? (
        <Text style={styles.noContactsText}>
          {searchInputValue
            ? `No contacts found for "${searchInputValue}"`
            : 'No contacts available'}
        </Text>
      ) : (
        <FlatList
          data={filteredContacts}
          renderItem={(item) => <ContactCardIA contact={item.item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contactsSection: {
    flex: 2,
  },
  noContactsText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginVertical: 20,
  },
});
