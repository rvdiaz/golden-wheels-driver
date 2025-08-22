import React from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import { ContactCard } from './contactCard';
import { IContact } from '../interfaces';
import { useQuery, useReactiveVar } from '@apollo/client';
import { getUserContacts } from '../graphql/queries';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import { userData } from '~/store/user';
import Constants from 'expo-constants';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const ContactList = () => {
  const customer = useReactiveVar(userData);

  const { data, loading } = useQuery<{ getUserContacts: IContact[] }>(getUserContacts, {
    variables: {
      tenant: {
        tenantId,
      },
      userId: customer?.id,
    },
  });

  if (loading) {
    return <PageLoading />;
  }

  const contacts = (data?.getUserContacts ?? []).slice().sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <View style={styles.contactsSection}>
      <Card style={styles.contactsCard}>
        <Text style={styles.sectionTitle}>Recent Contacts</Text>
        <FlatList
          data={contacts}
          renderItem={(item) => <ContactCard contact={item.item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
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
});
