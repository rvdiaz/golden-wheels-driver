import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { Card } from '../../codidge_components/UI/card';
import * as Icons from 'lucide-react-native';
import { FloatingMenu } from '~/codidge_components/UI/button/FloatingMenu';
import ContactForm from './sections/addContact';
import { ContactList } from './sections/contactList';
import { IActivity, IContact, IFollowUp } from './interfaces';

const mockActivity: IActivity[] = [
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

const mockFollowUps: IFollowUp[] = [
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
  const [searchTerm, setSearchTerm] = useState('');
  const [activity] = useState<IActivity[]>(mockActivity);
  const [followUps] = useState<IFollowUp[]>(mockFollowUps);

  const stats = [
    { label: 'Total Contacts', value: '147', icon: 'Users', color: '#2563EB', bgColor: '#EEF2FF' },
    { label: 'Hot Leads', value: '23', icon: 'TrendingUp', color: '#EF4444', bgColor: '#FEF2F2' },
    { label: 'Follow-ups', value: '12', icon: 'Calendar', color: '#10B981', bgColor: '#ECFDF5' },
    { label: 'Closed', value: '3', icon: 'Building', color: '#7C3AED', bgColor: '#F3E8FF' },
  ];

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
          <ContactList />

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
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
