import React, { ReactNode, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import { useQuery, useReactiveVar } from '@apollo/client';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { Header } from '~/codidge_components/UI/header';
import { useNavigation } from '@react-navigation/native';
import IncomeForm from './widgets/incomeForm';
import { TabHeader } from '~/codidge_components/UI/tabs';
import { getUserIncomes } from './graphql/queries';
import { IIncome, IncomeStatus } from './interfaces';
import { IncomeCard } from './widgets/incomeCard';
import Text from '~/codidge_components/UI/text';
import { LoadingSpinner } from '~/codidge_components/UI/loading/loadingSpinner';
import { ProfileScreensWrapper } from '~/core_modules/profile_setup/widgets/wrapper';
import { theme } from '~/theme/theme';
import * as Icons from 'lucide-react-native';
import { formatCurrency } from '~/custom_modules/tools/sections/mortgage_calculator/helpers';
import { FloatingMenu } from '~/codidge_components/UI/button/FloatingMenu';

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

  const header = (
    <Header
      title={'Income'}
      showBack={true}
      contentContainerStyle={{
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
      }}
      titleStyles={{ color: '#fff' }}
      onBack={() => navigation.goBack()}
      leftWidget={
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icons.ChevronLeftIcon color="#FFF" />
        </TouchableOpacity>
      }
    />
  );

  if (loading && !refreshing) {
    return (
      <ProfileScreensWrapper header={header}>
        <View style={styles.centerContent}>
          <LoadingSpinner color="gray" />
        </View>
      </ProfileScreensWrapper>
    );
  }

  if (error) {
    return (
      <ProfileScreensWrapper header={header}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Error loading incomes</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ProfileScreensWrapper>
    );
  }

  const incomesCompleted = useMemo(
    () => incomes.filter((income) => income.status === IncomeStatus.completed),
    [incomes]
  );

  const incomesPending = useMemo(
    () => incomes.filter((income) => income.status === IncomeStatus.pending),
    [incomes]
  );

  // Totals
  const totalCompleted = useMemo(
    () => incomesCompleted.reduce((sum, inc) => sum + inc.amount, 0),
    [incomesCompleted]
  );

  const totalPending = useMemo(
    () => incomesPending.reduce((sum, inc) => sum + inc.amount, 0),
    [incomesPending]
  );

  const total = totalCompleted + totalPending;
  const formatted = formatCurrency(total);

  let incomeWidgets: ReactNode[] = [];

  if (activeStatus === IncomeStatus.completed) {
    incomeWidgets = incomesCompleted.map((it) => {
      return <IncomeCard key={it.id} income={it} />;
    });
  } else if (activeStatus === IncomeStatus.pending) {
    incomeWidgets = incomesPending.map((it) => {
      return <IncomeCard key={it.id} income={it} />;
    });
  } else {
    incomeWidgets = incomes.map((it) => {
      return <IncomeCard key={it.id} income={it} />;
    });
  }

  return (
    <ProfileScreensWrapper
      parentFormContainer={{
        backgroundColor: '#FFF',
      }}
      header={header}>
      <View style={styles.summaryCard}>
        <View style={styles.cardInfoWrapper}>
          <View
            style={{
              gap: 12,
            }}>
            <Text style={styles.textLabelSummary}>Total Income</Text>
            <Text style={[styles.textLabelSummary, styles.textPriceSummary]}>{formatted}</Text>
          </View>
          <View style={styles.iconWrapper}>
            <Icons.Target size={20} color={theme.colors.menuItemActive} />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
          }}>
          <Text style={styles.textLabelSummary}>Received: {formatCurrency(totalCompleted)}</Text>
          <Text style={styles.textLabelSummary}>Pending: {formatCurrency(totalPending)}</Text>
        </View>
      </View>
      <TabHeader
        tabs={[
          {
            key: 'all',
            label: 'All',
          },
          {
            key: IncomeStatus.pending,
            label: 'Pending',
          },
          {
            key: IncomeStatus.completed,
            label: 'Completed',
          },
        ]}
        onTabChange={(key) => {
          setactiveStatus(key as IncomeStatus);
        }}
        containerStyle={{
          paddingTop: 0,
        }}
      />

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {incomeWidgets.length === 0 ? (
          <View style={styles.emptyState}>
            <Icons.DollarSign size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No incomes yet</Text>
            <Text style={styles.emptySubtitle}>Start by adding your first income</Text>
          </View>
        ) : (
          <View style={styles.incomesList}>{incomeWidgets}</View>
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
      <FloatingMenu
        title="Add Income"
        onPress={() => {
          setmodal(true);
        }}
        style={{
          marginBottom: 10,
          marginRight: 10,
        }}
      />
    </ProfileScreensWrapper>
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 16,
  },
  cardInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    backgroundColor: theme.colors.primaryBodyBackground,
    gap: 12,
  },
  textLabelSummary: {
    fontSize: 14,
    color: theme.colors.menuItemActive,
  },
  textPriceSummary: {
    fontSize: 24,
  },
  iconWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#A5B4FC',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
