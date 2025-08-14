import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../../components/Card';
import * as Icons from 'lucide-react-native';
import { FloatingMenu } from '~/components/FloatingMenu';
import ContactForm from './sections/addContact';
import { moduleScreens } from '~/store/config';
import { ModuleKeys } from '~/store/interface';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: 'Buyer' | 'Seller' | 'Investor';
  status: 'Hot Lead' | 'Warm Lead' | 'Cold Lead';
  lastContact: string;
  location: string;
  notes: string;
  avatar?: string;
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting';
  contact: string;
  description: string;
  time: string;
}

interface FollowUp {
  id: string;
  contact: string;
  task: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Maria Gonzalez',
    phone: '(555) 123-4567',
    email: 'maria@email.com',
    type: 'Buyer',
    status: 'Hot Lead',
    lastContact: '2 days ago',
    location: 'Miami, FL',
    notes: 'Interested in Brickell condos, budget $500k-$700k',
  },
  {
    id: '2',
    name: 'Carlos Rodriguez',
    phone: '(555) 987-6543',
    email: 'carlos@email.com',
    type: 'Seller',
    status: 'Warm Lead',
    lastContact: '1 week ago',
    location: 'Coral Gables, FL',
    notes: 'Wants to sell family home, 4BR/3BA',
  },
  {
    id: '3',
    name: 'Jennifer Smith',
    phone: '(555) 456-7890',
    email: 'jennifer@email.com',
    type: 'Investor',
    status: 'Cold Lead',
    lastContact: '2 weeks ago',
    location: 'Aventura, FL',
    notes: 'Looking for investment properties, cash buyer',
  },
  {
    id: '4',
    name: 'Robert Johnson',
    phone: '(555) 321-9876',
    email: 'robert@email.com',
    type: 'Buyer',
    status: 'Warm Lead',
    lastContact: '3 days ago',
    location: 'Doral, FL',
    notes: 'First-time homebuyer, pre-approved for $400k',
  },
];

const mockActivity: Activity[] = [
  {
    id: '1',
    type: 'call',
    contact: 'Maria Gonzalez',
    description: 'Follow-up call - 15 min',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'email',
    contact: 'Carlos Rodriguez',
    description: 'Sent market analysis',
    time: '4 hours ago',
  },
  {
    id: '3',
    type: 'meeting',
    contact: 'Jennifer Smith',
    description: 'Scheduled showing for tomorrow',
    time: '1 day ago',
  },
];

const mockFollowUps: FollowUp[] = [
  {
    id: '1',
    contact: 'Maria Gonzalez',
    task: 'Schedule showing',
    dueDate: 'Today',
    priority: 'high',
  },
  {
    id: '2',
    contact: 'Carlos Rodriguez',
    task: 'Send proposal',
    dueDate: 'Tomorrow',
    priority: 'medium',
  },
  {
    id: '3',
    contact: 'Jennifer Smith',
    task: 'Follow-up call',
    dueDate: 'Friday',
    priority: 'low',
  },
];

const screenWidth = Dimensions.get('window').width;

export const CRMScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts] = useState<Contact[]>(mockContacts);
  const [activity] = useState<Activity[]>(mockActivity);
  const [followUps] = useState<FollowUp[]>(mockFollowUps);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Contacts', value: '147', icon: 'Users', color: '#2563EB', bgColor: '#EEF2FF' },
    { label: 'Hot Leads', value: '23', icon: 'TrendingUp', color: '#EF4444', bgColor: '#FEF2F2' },
    { label: 'Follow-ups', value: '12', icon: 'Calendar', color: '#10B981', bgColor: '#ECFDF5' },
    { label: 'Closed', value: '3', icon: 'Building', color: '#7C3AED', bgColor: '#F3E8FF' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot Lead':
        return { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' };
      case 'Warm Lead':
        return { bg: '#FFFBEB', text: '#92400E', border: '#FED7AA' };
      case 'Cold Lead':
        return { bg: '#EFF6FF', text: '#1E40AF', border: '#DBEAFE' };
      default:
        return { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB' };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Buyer':
        return { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' };
      case 'Seller':
        return { bg: '#FFF7ED', text: '#9A3412', border: '#FED7AA' };
      case 'Investor':
        return { bg: '#F3E8FF', text: '#6B21A8', border: '#DDD6FE' };
      default:
        return { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB' };
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return Icons.Phone;
      case 'email':
        return Icons.Mail;
      case 'meeting':
        return Icons.Calendar;
      default:
        return Icons.Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call':
        return { bg: '#ECFDF5', icon: '#059669' };
      case 'email':
        return { bg: '#EFF6FF', icon: '#2563EB' };
      case 'meeting':
        return { bg: '#F3E8FF', icon: '#7C3AED' };
      default:
        return { bg: '#F9FAFB', icon: '#6B7280' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#FFFBEB';
      case 'medium':
        return '#FFF7ED';
      case 'low':
        return '#EFF6FF';
      default:
        return '#F9FAFB';
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#D97706';
      case 'medium':
        return '#EA580C';
      case 'low':
        return '#2563EB';
      default:
        return '#374151';
    }
  };

  const renderContact = ({ item }: { item: Contact }) => {
    const statusColors = getStatusColor(item.status);
    const typeColors = getTypeColor(item.type);

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(ModuleKeys.contactDetals as never, { contact: item } as never);
        }}
        style={styles.contactCard}>
        <View style={styles.contactRow}>
          <View style={styles.avatarContainer}>
            <Icons.User size={24} color="#6B7280" />
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactHeader}>
              <View style={styles.contactNameSection}>
                <Text style={styles.contactName}>{item.name}</Text>
                <View style={styles.badgeContainer}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: statusColors.bg,
                        borderColor: statusColors.border,
                      },
                    ]}>
                    <Text style={[styles.badgeText, { color: statusColors.text }]}>
                      {item.status}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.typeBadge,
                      {
                        backgroundColor: typeColors.bg,
                        borderColor: typeColors.border,
                      },
                    ]}>
                    <Text style={[styles.badgeText, { color: typeColors.text }]}>{item.type}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icons.Phone size={16} color="#2563EB" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icons.Mail size={16} color="#2563EB" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.contactDetails}>
              <View style={styles.detailRow}>
                <Icons.Mail size={12} color="#6B7280" />
                <Text style={styles.detailText}>{item.email}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icons.Phone size={12} color="#6B7280" />
                <Text style={styles.detailText}>{item.phone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icons.MapPin size={12} color="#6B7280" />
                <Text style={styles.detailText}>{item.location}</Text>
              </View>
            </View>

            <Text style={styles.contactNotes}>{item.notes}</Text>
            <Text style={styles.lastContact}>Last contact: {item.lastContact}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const [modalVisible, setModalVisible] = useState(false);

  const disposeModalHandler = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Row */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => {
            const IconComponent = (Icons as any)[stat.icon] || Icons.Users;
            return (
              <Card key={index} style={[styles.statCard, { backgroundColor: stat.bgColor }]}>
                <View style={styles.statContent}>
                  <View style={styles.statInfo}>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                  <IconComponent size={32} color={stat.color} />
                </View>
              </Card>
            );
          })}
        </View>

        {/* Search */}
        <Card style={styles.searchCard}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Icons.Search size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search contacts..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {/*    <TouchableOpacity style={styles.filterButton}>
              <Icons.Filter size={16} color="#6B7280" />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity> */}
          </View>
        </Card>

        {/* Main Content Grid */}
        <View style={styles.mainGrid}>
          {/* Contacts List */}
          <View style={styles.contactsSection}>
            <Card style={styles.contactsCard}>
              <Text style={styles.sectionTitle}>Recent Contacts</Text>
              <FlatList
                data={filteredContacts}
                renderItem={renderContact}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            </Card>
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Recent Activity */}
            <Card style={styles.activityCard}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityList}>
                {activity.map((item) => {
                  const IconComponent = getActivityIcon(item.type);
                  const colors = getActivityColor(item.type);

                  return (
                    <View key={item.id} style={styles.activityItem}>
                      <View style={[styles.activityIcon, { backgroundColor: colors.bg }]}>
                        <IconComponent size={16} color={colors.icon} />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityContact}>{item.contact}</Text>
                        <Text style={styles.activityDescription}>{item.description}</Text>
                        <Text style={styles.activityTime}>{item.time}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </Card>

            {/* Follow-ups */}
            <Card style={styles.followUpCard}>
              <Text style={styles.sectionTitle}>Pending Follow-ups</Text>
              <View style={styles.followUpList}>
                {followUps.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.followUpItem,
                      { backgroundColor: getPriorityColor(item.priority) },
                    ]}>
                    <View style={styles.followUpContent}>
                      <Text style={styles.followUpContact}>{item.contact}</Text>
                      <Text style={styles.followUpTask}>{item.task}</Text>
                    </View>
                    <Text
                      style={[styles.followUpDate, { color: getPriorityTextColor(item.priority) }]}>
                      {item.dueDate}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
      <FloatingMenu
        title="Add Contact"
        icon="Plus"
        onPress={() => {
          setModalVisible(true);
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={disposeModalHandler}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <ContactForm disposeModalHandler={disposeModalHandler} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    marginTop: 16,
    marginHorizontal: -8,
  },
  statCard: {
    width: (screenWidth - 48) / 2,
    marginHorizontal: 8,
    marginBottom: 16,
    borderWidth: 0,
    borderRadius: 16,
    elevation: 0,
    shadowOpacity: 0,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  searchCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  mainGrid: {
    gap: 24,
    paddingBottom: 80,
  },
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
  contactCard: {
    marginBottom: 14,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contactNameSection: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactDetails: {
    marginBottom: 12,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  contactNotes: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  lastContact: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
  rightColumn: {
    flex: 1,
    gap: 24,
  },
  activityCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityContact: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  followUpCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  followUpList: {
    gap: 12,
  },
  followUpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  followUpContent: {
    flex: 1,
  },
  followUpContact: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  followUpTask: {
    fontSize: 12,
    color: '#6B7280',
  },
  followUpDate: {
    fontSize: 12,
    fontWeight: '600',
  },
});
