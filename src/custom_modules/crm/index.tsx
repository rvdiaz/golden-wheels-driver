import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import * as Icons from 'lucide-react-native';
import { FloatingMenu } from '~/components/FloatingMenu';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'hot' | 'warm' | 'cold';
  lastContact: string;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1 (555) 123-4567',
    email: 'john.smith@email.com',
    status: 'hot',
    lastContact: '2 days ago',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '+1 (555) 987-6543',
    email: 'sarah.johnson@email.com',
    status: 'warm',
    lastContact: '1 week ago',
  },
  {
    id: '3',
    name: 'Mike Brown',
    phone: '+1 (555) 456-7890',
    email: 'mike.brown@email.com',
    status: 'cold',
    lastContact: '2 weeks ago',
  },
];

export const CRMScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts] = useState<Contact[]>(mockContacts);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot':
        return '#EF4444';
      case 'warm':
        return '#F59E0B';
      case 'cold':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <Card style={styles.contactCard}>
      <TouchableOpacity onPress={() => {}} style={styles.contactContent}>
        <View style={styles.contactHeader}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{item.name}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.contactActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Icons.Phone size={20} color="#2563EB" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icons.Mail size={20} color="#10B981" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contactDetails}>
          <Text style={styles.contactEmail}>{item.email}</Text>
          <Text style={styles.contactPhone}>{item.phone}</Text>
          <Text style={styles.lastContact}>Last contact: {item.lastContact}</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icons.Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        <Card style={[styles.statCard, { backgroundColor: '#FEF2F2' }]}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Total Contacts</Text>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: '#FFFBEB' }]}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Hot Leads</Text>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: '#ECFDF5' }]}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Follow-ups</Text>
        </Card>
      </View>

      <FlatList
        data={filteredContacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      <FloatingMenu title="Add Task" icon="Plus" onPress={() => console.log('Add Task pressed')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  contactCard: {
    marginBottom: 12,
  },
  contactContent: {
    padding: 16,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contactActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  contactDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  contactEmail: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  lastContact: {
    fontSize: 12,
    color: '#6B7280',
  },
});
