import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useReactiveVar } from '@apollo/client';
import { getUserIncomes } from '../graphql/queries';
import * as Icons from 'lucide-react-native';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { IIncome } from '../interfaces';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import AddIncomeScreen from './addIncome';
import { Header } from '~/codidge_components/UI/header';
import { useNavigation } from '@react-navigation/native';
import ContactForm from '~/custom_modules/crm/sections/addContact';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const UserIncomes = () => {
  const [modal, setmodal] = useState(false);
  const navigation = useNavigation();

  const customer = useReactiveVar(userData);

  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, error, refetch } = useQuery(getUserIncomes, {
    variables: {
      tenant: {
        tenantId,
      },
      userId: customer?.id,
    },
  });

  const handleDelete = (incomeId: string) => {
    Alert.alert('Delete Income', 'Are you sure you want to delete this income?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            /* await deleteIncome({
              variables: {
                tenant: MOCK_TENANT,
                incomeId,
              },
            }); */
          } catch (err) {
            Alert.alert('Error', 'Failed to delete income');
          }
        },
      },
    ]);
  };

  const handleMarkCompleted = async (incomeId: string) => {
    try {
      /*  await markCompleted({
        variables: {
          tenant: MOCK_TENANT,
          incomeId,
        },
      }); */
    } catch (err) {
      Alert.alert('Error', 'Failed to mark income as completed');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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

  const incomes: IIncome[] = data?.getUserIncomes || [];

  if (loading && !refreshing) {
    return <PageLoading />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Error loading incomes</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        showBack={true}
        title="Incomes"
        onBack={() => navigation.goBack()}
        rightText="Add Income"
        rightAction={() => {
          setmodal(true);
        }}
      />

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {incomes.length === 0 ? (
          <View style={styles.emptyState}>
            <Icons.DollarSign size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No incomes yet</Text>
            <Text style={styles.emptySubtitle}>Start by adding your first income</Text>
          </View>
        ) : (
          <View style={styles.incomesList}>
            {incomes.map((income) => (
              <View key={income.id} style={styles.incomeCard}>
                <View style={styles.incomeHeader}>
                  <View style={styles.incomeInfo}>
                    <Text style={styles.incomeSource}>{income.source}</Text>
                    <Text style={styles.incomeAmount}>{formatCurrency(income.amount)}</Text>
                  </View>
                  <View style={styles.incomeActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
                      <Icons.Edit size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDelete(income.id)}>
                      <Icons.Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {income.description && (
                  <Text style={styles.incomeDescription}>{income.description}</Text>
                )}

                {income.propertyAddress && (
                  <View style={styles.propertyRow}>
                    <Icons.Home size={14} color="#6B7280" />
                    <Text style={styles.propertyAddress}>{income.propertyAddress}</Text>
                  </View>
                )}

                <View style={styles.incomeFooter}>
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(income.status) },
                      ]}>
                      <Text style={styles.statusText}>{income.status}</Text>
                    </View>
                  </View>

                  <View style={styles.dateContainer}>
                    {income.status === 'pending' && (
                      <>
                        <Icons.Calendar size={14} color="#6B7280" />
                        <Text style={styles.dateText}>
                          Expected: {formatDate(income.expectedDate)}
                        </Text>
                      </>
                    )}
                    {income.status === 'completed' && (
                      <>
                        <Icons.Check size={14} color="#10B981" />
                        <Text style={styles.dateText}>
                          Received: {formatDate(income.createdAt)}
                        </Text>
                      </>
                    )}
                  </View>
                </View>

                {income.status === 'pending' && (
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => handleMarkCompleted(income.id)}>
                    <Icons.Check size={16} color="#FFFFFF" />
                    <Text style={styles.completeButtonText}>Mark as Received</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setmodal(false);
        }}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <AddIncomeScreen
            dispose={() => {
              setmodal(false);
            }}
          />
          {/*      <ContactForm
            disposeModalHandler={() => {
              setmodal(false);
            }}
          /> */}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  incomesList: {
    padding: 20,
    gap: 16,
  },
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
