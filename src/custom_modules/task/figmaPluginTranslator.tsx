import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Badge } from '~/components/Badge';
import { TaskList } from './widgets/taskList';
import { ITask } from './interfaces';

const { width } = Dimensions.get('window');

export function TasksV2Screen() {
  const [activeFilter, setActiveFilter] = useState('priority');
  const [filterLabel, setFilterLabel] = useState('Priority');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const allTasks: ITask[] = [
    {
      id: '1',
      title: 'Morning Social Media Posts',
      description: 'Post 1-2 engaging real estate content pieces',
      dateTime: '8:30 AM',
      category: 'Marketing',
      completed: false,
      color: '#2563EB',
      priority: 'High',
    },
    {
      id: '2',
      title: '50 FSBO Cold Calls',
      description: 'Call 50 For Sale By Owner listings to generate leads',
      dateTime: '9:00 AM',
      category: 'Lead Generation',
      completed: false,
      color: '#DC2626',
      priority: 'Low',
    },
    {
      id: '3',
      title: '50 Expired Listing Calls',
      description: 'Contact expired listings to offer listing services',
      dateTime: '11:00 AM',
      category: 'Lead Generation',
      completed: false,
      color: '#DC2626',
      priority: 'Medium',
    },
    {
      id: '4',
      title: 'Client Follow-up Calls',
      description: 'Follow up with recent clients for referrals',
      dateTime: '2:00 PM',
      category: 'Relationship Building',
      completed: false,
      color: '#059669',
      priority: 'Low',
    },
    {
      id: '5',
      title: 'Social Media Engagement',
      description: 'Like and comment on 25 posts to build relationships',
      dateTime: '3:00 PM',
      category: 'Marketing',
      completed: false,
      color: '#2563EB',
      priority: 'High',
    },
  ];

  const filterTasks = (filterType: string) => {
    switch (filterType) {
      /*   case 'priority':
        return allTasks.sort((a, b) => {
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
      case 'date':
        return allTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'status':
        return allTasks.sort((a, b) => {
          const statusOrder = { Pending: 3, 'In Progress': 2, Completed: 1 };
          return statusOrder[b.status] - statusOrder[a.status];
        }); */
      default:
        return allTasks;
    }
  };

  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowFilterModal(false)}>
      <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowFilterModal(false)}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={[styles.modalItem, activeFilter === 'priority' && styles.activeModalItem]}
            onPress={() => {
              setActiveFilter('priority');
              setFilterLabel('Priority');
              setShowFilterModal(false);
            }}>
            <Text
              style={[
                styles.modalItemText,
                activeFilter === 'priority' && styles.activeModalItemText,
              ]}>
              Sort by Priority
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalItem, activeFilter === 'date' && styles.activeModalItem]}
            onPress={() => {
              setActiveFilter('date');
              setFilterLabel('Date');
              setShowFilterModal(false);
            }}>
            <Text
              style={[styles.modalItemText, activeFilter === 'date' && styles.activeModalItemText]}>
              Sort by Date
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalItem, activeFilter === 'status' && styles.activeModalItem]}
            onPress={() => {
              setActiveFilter('status');
              setFilterLabel('Status');
              setShowFilterModal(false);
            }}>
            <Text
              style={[
                styles.modalItemText,
                activeFilter === 'status' && styles.activeModalItemText,
              ]}>
              Sort by Status
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const ScheduleModal = () => (
    <Modal
      visible={showScheduleModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowScheduleModal(false)}>
      <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowScheduleModal(false)}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.scheduleModalItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
              <Feather name="user" size={16} color="#2563EB" />
            </View>
            <View style={styles.scheduleTextContainer}>
              <Text style={styles.scheduleTitle}>Create Schedule Myself</Text>
              <Text style={styles.scheduleSubtitle}>Build a custom schedule</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scheduleModalItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#F3E8FF' }]}>
              <Feather name="file-text" size={16} color="#7C3AED" />
            </View>
            <View style={styles.scheduleTextContainer}>
              <Text style={styles.scheduleTitle}>Use Template</Text>
              <Text style={styles.scheduleSubtitle}>Start from a template</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <View style={styles.headerButtons}>
          {/* Filter Button */}
          <TouchableOpacity style={styles.outlineButton} onPress={() => setShowFilterModal(true)}>
            <Feather name="filter" size={16} color="#374151" />
            <Text style={styles.outlineButtonText}>{filterLabel}</Text>
            <Feather name="chevron-down" size={16} color="#374151" />
          </TouchableOpacity>

          {/* Schedule Button */}
          <TouchableOpacity style={styles.outlineButton} onPress={() => setShowScheduleModal(true)}>
            <Feather name="menu" size={16} color="#374151" />
            <Text style={styles.outlineButtonText}>Schedule</Text>
            <Feather name="chevron-down" size={16} color="#374151" />
          </TouchableOpacity>

          {/* New Task Button */}
          <TouchableOpacity style={styles.primaryButton}>
            <Feather name="plus" size={16} color="white" />
            <Text style={styles.primaryButtonText}>New Task</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tasks Section */}
      <View style={styles.tasksSection}>
        <View style={styles.tasksSectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeFilter === 'priority'
              ? 'Tasks by Priority'
              : activeFilter === 'date'
                ? 'Tasks by Date'
                : 'Tasks by Status'}
          </Text>
          <View style={styles.dateContainer}>
            <Feather name="calendar" size={16} color="#6B7280" />
            <Text style={styles.dateText}>Wednesday, August 7</Text>
          </View>
        </View>

        {/* Tasks List */}
        <TaskList tasks={allTasks} onToggle={() => {}} />
      </View>

      <FilterModal />
      <ScheduleModal />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    gap: 4,
  },
  outlineButtonText: {
    fontSize: 14,
    color: '#374151',
    marginHorizontal: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    gap: 4,
  },
  primaryButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  tasksSection: {
    flex: 1,
  },
  tasksSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  tasksList: {
    gap: 16,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    marginTop: 4,
  },
  taskDetails: {
    flex: 1,
    gap: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  taskMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attachmentText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryBadge: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  priorityBadge: {
    // Dynamic styles applied inline
  },
  statusBadge: {
    // Dynamic styles applied inline
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 32,
    minWidth: width * 0.6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeModalItem: {
    backgroundColor: '#EFF6FF',
  },
  modalItemText: {
    fontSize: 14,
    color: '#374151',
  },
  activeModalItemText: {
    color: '#1D4ED8',
    fontWeight: '500',
  },
  scheduleModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleTextContainer: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  scheduleSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
});
