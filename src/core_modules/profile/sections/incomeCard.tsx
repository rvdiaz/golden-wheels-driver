import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import * as Icons from 'lucide-react-native';
import { formatCurrency } from '~/custom_modules/tools/sections/mortgage_calculator/helpers';
import { IIncome, IncomeStatus } from '../interfaces';
import { useMutation, useReactiveVar } from '@apollo/client';
import { deleteUserIncomeMutation, updateUserIncome } from '../graphql/mutations';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { getUserIncomes } from '../graphql/queries';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import IncomeForm from './incomeForm';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return '#10B981';
    case 'pending':
      return '#F59E0B';
    default:
      return '#6B7280';
  }
};

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const IncomeCard = ({ income }: { income: IIncome }) => {
  const customer = useReactiveVar(userData);
  const [modal, setmodal] = useState<boolean>(false);

  const [deleteIncomeFn] = useMutation<{ deleteUserIncome: string }>(deleteUserIncomeMutation, {
    update: (cache, { data: mutationData }) => {
      if (!mutationData?.deleteUserIncome) return;

      const deletedIncome: string = mutationData.deleteUserIncome;

      // Read existing cache
      const existingData: any = cache.readQuery({
        query: getUserIncomes,
        variables: {
          tenant: { tenantId },
          userId: customer?.id,
        },
      });

      if (existingData) {
        // Filter out the deleted one
        const updatedIncomes = existingData.getUserIncomes.filter(
          (income: IIncome) => income.id !== deletedIncome
        );

        // Write the updated list back
        cache.writeQuery({
          query: getUserIncomes,
          variables: {
            tenant: { tenantId },
            userId: customer?.id,
          },
          data: {
            getUserIncomes: updatedIncomes,
          },
        });
      }
    },
  });

  const [updateIncome, { loading: loadingUpdate }] = useMutation<{ updateUserIncome: IIncome }>(
    updateUserIncome,
    {
      update: (cache, { data: mutationData }) => {
        if (!mutationData?.updateUserIncome) return;

        const updatedIncome = mutationData.updateUserIncome;

        // Read existing cache
        const existingData: any = cache.readQuery({
          query: getUserIncomes,
          variables: {
            tenant: { tenantId },
            userId: customer?.id,
          },
        });

        if (existingData) {
          // Replace the old income with the updated one
          const updatedIncomes = existingData.getUserIncomes.map((income: IIncome) =>
            income.id === updatedIncome.id ? updatedIncome : income
          );

          // Write the updated list back to the cache
          cache.writeQuery({
            query: getUserIncomes,
            variables: {
              tenant: { tenantId },
              userId: customer?.id,
            },
            data: {
              getUserIncomes: updatedIncomes,
            },
          });
        }
      },
    }
  );

  const handleMarkCompleted = async () => {
    try {
      await updateIncome({
        variables: {
          tenant: {
            tenantId,
          },
          incomeId: income?.id,
          userId: customer?.id,
          incomeData: {
            status: IncomeStatus.completed,
          },
        },
      });
    } catch (err) {
      console.log(':::err', err);
      Alert.alert('Error', 'Failed to mark income as completed');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Income', 'Are you sure you want to delete this income?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteIncomeFn({
              variables: {
                tenant: {
                  tenantId,
                },
                userId: customer?.id,
                incomeId: income.id,
              },
            });
          } catch (err) {
            Alert.alert('Error', 'Failed to delete income');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.incomeCard}>
      <View style={styles.incomeHeader}>
        <View style={styles.incomeInfo}>
          <Text style={styles.incomeSource}>{income.source}</Text>
          <Text style={styles.incomeAmount}>{formatCurrency(income.amount)}</Text>
        </View>
        <View style={styles.incomeActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setmodal(true);
            }}>
            <Icons.Edit size={16} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Icons.Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {income.description && <Text style={styles.incomeDescription}>{income.description}</Text>}

      {income.propertyAddress && (
        <View style={styles.propertyRow}>
          <Icons.Home size={14} color="#6B7280" />
          <Text style={styles.propertyAddress}>{income.propertyAddress}</Text>
        </View>
      )}

      <View style={styles.incomeFooter}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(income.status) }]}>
            <Text style={styles.statusText}>{income.status}</Text>
          </View>
        </View>

        <View style={styles.dateContainer}>
          {income.status === IncomeStatus.pending && (
            <>
              <Icons.Calendar size={14} color="#6B7280" />
              <Text style={styles.dateText}>Expected: {formatDate(income.expectedDate)}</Text>
            </>
          )}
          {income.status === IncomeStatus.completed && (
            <>
              <Icons.Check size={14} color="#10B981" />
              <Text style={styles.dateText}>Received: {formatDate(income.createdAt)}</Text>
            </>
          )}
        </View>
      </View>

      {income.status === IncomeStatus.pending && (
        <PrimaryButton
          onPress={handleMarkCompleted}
          leftWidget={<Icons.Check size={16} color="#FFFFFF" />}
          loading={loadingUpdate}
          title="Mark as Received"
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setmodal(false);
        }}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <IncomeForm
            income={income}
            dispose={() => {
              setmodal(false);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  incomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  incomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  incomeInfo: {
    flex: 1,
  },
  incomeSource: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  incomeAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
  },
  incomeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  incomeDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  incomeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
