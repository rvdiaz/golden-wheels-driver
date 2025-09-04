import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ListRenderItem } from 'react-native';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { IContact, IFollowUp, IFollowUpResponse, IsDoneValues } from '../../interfaces';
import { getUserFollowUpsQuery } from '../../graphql/queries';
import { FollowUpCard } from './followUpCard';
import { AddFollowUpModal } from './followUpForm';
import { theme } from '~/theme/theme';
import { markDoneUserFollowUpMutation } from '../../graphql/mutations';
import moment from 'moment';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

interface FollowUpListProps {
  contacts?: IContact[];
  showHeader?: boolean;
  emptyStateText?: string;
}

const today = moment().format('YYYY-MM-DD');

export const FollowUpList: React.FC<FollowUpListProps> = ({
  contacts = [],
  emptyStateText = 'No follow-ups yet',
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
          userId: user?.id,
          dateFrom: today,
        },
      },
    }
  );

  const [markCompleteFn] = useMutation<{ markDoneUserFollowUp: IFollowUp }>(
    markDoneUserFollowUpMutation,
    {
      update: (cache, { data: mutationData }) => {
        if (!mutationData?.markDoneUserFollowUp) return;

        const updatedFollowUp = mutationData.markDoneUserFollowUp;

        cache.modify({
          fields: {
            getUserFollowUps(existingFollowUpRefs, { readField }) {
              const currentFollowUps = existingFollowUpRefs.followUps;
              return {
                ...existingFollowUpRefs,
                followUps: currentFollowUps.map((followUpRef: any) => {
                  const id = readField('followUpId', followUpRef);
                  if (id === updatedFollowUp.followUpId) {
                    return { ...followUpRef, ...updatedFollowUp };
                  }
                  return followUpRef;
                }),
              };
            },
          },
        });
      },
    }
  );

  const handleComplete = async (followUp: IFollowUp) => {
    try {
      await markCompleteFn({
        variables: {
          tenant: { tenantId },
          userId: user?.id,
          followUpId: followUp.followUpId,
          date: followUp.date, // YYYY-MM-DD or Date string
        },
        optimisticResponse: {
          markDoneUserFollowUp: {
            ...followUp,
            isDone: IsDoneValues.done,
          },
        },
      });
    } catch (error) {
      console.log('::error');
    }
  };

  const handleCall = (phone: string) => {
    console.log('Calling:', phone);
  };

  const handleAddFollowUp = (newFollowUp: Partial<IFollowUp>) => {
    refetch();
  };

  const handleCardPress = (followUp: IFollowUp) => {};

  if (loading && !data) {
    return <PageLoading />;
  }

  const followUps = data?.getUserFollowUps?.followUps ?? [];

  const renderFollowUpItem: ListRenderItem<IFollowUp> = ({ item }) => (
    <FollowUpCard
      key={item.followUpId}
      followUp={item}
      onPress={handleCardPress}
      onComplete={handleComplete}
      onCall={handleCall}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{emptyStateText}</Text>
    </View>
  );

  const keyExtractor = (item: IFollowUp) => item.followUpId.toString();

  return (
    <View style={styles.container}>
      {/* FlatList with RefreshControl */}
      <FlatList
        data={followUps}
        renderItem={renderFollowUpItem}
        keyExtractor={keyExtractor}
        style={styles.listContainer}
        contentContainerStyle={
          followUps.length === 0 ? styles.emptyListContent : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        ListEmptyComponent={renderEmptyComponent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        // Add some bottom padding for better UX
        contentInsetAdjustmentBehavior="automatic"
      />

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
    padding: 16,
    marginHorizontal: 16,
    borderRadius: theme.borderRadius.lg,
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
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
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
  separator: {
    height: 8,
  },
});
