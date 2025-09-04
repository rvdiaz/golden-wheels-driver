import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useQuery, useReactiveVar } from '@apollo/client';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { IContact, IFollowUp, IFollowUpResponse } from '../../interfaces';
import { getUserFollowUpsQuery } from '../../graphql/queries';
import { FollowUpCard } from './followUpCard';
import { AddFollowUpModal } from './followUpForm';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

interface FollowUpListProps {
  onCardPress?: (followUp: IFollowUp) => void;
  onComplete?: (followUpId: string) => void;
  onCall?: (phone: string) => void;
  contacts?: IContact[];
  showAddButton?: boolean;
  showHeader?: boolean;
  emptyStateText?: string;
  filterCompleted?: boolean;
}

export const FollowUpList: React.FC<FollowUpListProps> = ({
  onCardPress,
  onComplete,
  onCall,
  contacts = [],
  showAddButton = true,
  showHeader = true,
  emptyStateText = 'No follow-ups yet',
  filterCompleted = true,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const user = useReactiveVar(userData);

  const { data, loading, refetch } = useQuery<{ getUserFollowUps: IFollowUpResponse }>(
    getUserFollowUpsQuery,
    {
      variables: {
        tenant: {
          tenantId,
        },
        input: {
          isDone: filterCompleted ? 0 : undefined, // Only show undone if filtering
          userId: user?.id,
        },
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  const handleComplete = (followUpId: string) => {
    // Handle completion logic here
    if (onComplete) {
      onComplete(followUpId);
    }
    // Optionally refetch the data
    refetch();
  };

  const handleCall = (phone: string) => {
    console.log('Calling:', phone);
    if (onCall) {
      onCall(phone);
    }
    // Implement call functionality
  };

  const handleAddFollowUp = (newFollowUp: Partial<IFollowUp>) => {
    // Handle adding follow-up logic here
    console.log('Adding follow-up:', newFollowUp);
    // After adding, refetch the data
    refetch();
  };

  const handleCardPress = (followUp: IFollowUp) => {
    if (onCardPress) {
      onCardPress(followUp);
    }
  };

  if (loading && !data) {
    return <PageLoading />;
  }

  const followUps = data?.getUserFollowUps?.followUps ?? [];

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{emptyStateText}</Text>
      {showAddButton && (
        <TouchableOpacity style={styles.addButtonEmpty} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButtonEmptyText}>Add your first follow-up</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFollowUpList = () => (
    <ScrollView
      style={styles.listContainer}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      showsVerticalScrollIndicator={false}>
      {followUps.map((followUp) => (
        <FollowUpCard
          key={followUp.followUpId}
          followUp={followUp}
          onPress={handleCardPress}
          onComplete={handleComplete}
          onCall={handleCall}
        />
      ))}
      {/* Add some bottom padding for better UX */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Content */}
      {followUps.length === 0 ? renderEmptyState() : renderFollowUpList()}

      {/* Add Follow-up Modal */}
      <AddFollowUpModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddFollowUp}
        contacts={contacts}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButtonEmpty: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonEmptyText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
