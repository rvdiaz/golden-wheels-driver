import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import { useQuery, useReactiveVar } from '@apollo/client';
import * as Icons from 'lucide-react-native';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import { Header } from '~/codidge_components/UI/header';
import { useNavigation } from '@react-navigation/native';
import IncomeForm from './widgets/incomeForm';
import { TabHeader } from '~/codidge_components/UI/tabs';
import { getUserIncomes } from './graphql/queries';
import { IIncome, IncomeStatus } from './interfaces';
import { IncomeCard } from './widgets/incomeCard';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const UserIncomes = () => {
  const navigation = useNavigation();
  const customer = useReactiveVar(userData);
  const [modal, setmodal] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);

  const [activeStatus, setactiveStatus] = useState<IncomeStatus>(IncomeStatus.pending);

  const { data, loading, error, refetch } = useQuery(getUserIncomes, {
    variables: {
      tenant: {
        tenantId,
      },
      userId: customer?.id,
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const incomes: IIncome[] = data?.getUserIncomes || [];

  if (loading && !refreshing) {
    return <PageLoading headerTitle="Income" />;
  }

  if (error) {
    return (
      <PageSafeContainer style={styles.container}>
        <Header showBack={true} title="Incomes" onBack={() => navigation.goBack()} />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Error loading incomes</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </PageSafeContainer>
    );
  }

  const incomesCompleted = incomes.filter((income) => income.status === IncomeStatus.completed);

  return (
    <PageSafeContainer style={styles.container}>
      <Header
        showBack={true}
        title=""
        onBack={() => navigation.goBack()}
        leftText="Incomes"
        rightText="Add Income"
        rightAction={() => {
          setmodal(true);
        }}
      />

      <TabHeader
        tabs={[
          {
            key: IncomeStatus.pending,
            label: 'Pending',
            Icon: Icons.Hourglass,
            indexNumber: incomes.length - incomesCompleted.length,
          },
          {
            key: IncomeStatus.completed,
            label: 'Completed',
            Icon: Icons.CheckCircle,
            indexNumber: incomesCompleted.length,
          },
        ]}
        onTabChange={(key) => {
          setactiveStatus(key as IncomeStatus);
        }}
        containerStyle={{
          marginTop: 10,
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
            {incomes
              .filter((income) => income.status === activeStatus)
              .map((income) => (
                <IncomeCard key={income.id} income={income} />
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
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <IncomeForm
            dispose={() => {
              setmodal(false);
            }}
          />
        </View>
      </Modal>
    </PageSafeContainer>
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
});
