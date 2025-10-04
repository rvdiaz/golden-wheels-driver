import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../codidge_components/UI/header';
import { Card } from '../../codidge_components/UI/card';
import * as Icons from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { ModuleKeys } from '~/store/interface';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { useQuery } from '@apollo/client';
import { useActiveUserGoals } from './goals/hooks/useActiveUserGoals';
import { getUserIncomes } from './income/graphql/queries';
import Constants from 'expo-constants';
import { IncomeStatus } from './income/interfaces';
import { LogoutButton } from '~/codidge_components/auth/widgets/logoutButton';
import { LoadingSpinner } from '~/codidge_components/UI/loading/loadingSpinner';
import Text from '~/codidge_components/UI/text';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const user = useReactiveVar(userData);
  const { goals, isLoading: goalsLoading } = useActiveUserGoals();

  const { data: incomeData, loading: incomeLoading } = useQuery(getUserIncomes, {
    variables: {
      tenant: {
        tenantId,
      },
      userId: user?.id,
    },
  });

  // Calculate income stats
  const incomeStats = useMemo(() => {
    if (!incomeData?.getUserIncomes) return { total: 0, pending: 0, completed: 0, thisMonth: 0 };

    const incomes = incomeData.getUserIncomes;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return {
      total: incomes.reduce((sum: number, income: any) => sum + income.amount, 0),
      pending: incomes.filter((i: any) => i.status === IncomeStatus.pending).length,
      completed: incomes.filter((i: any) => i.status === IncomeStatus.completed).length,
      thisMonth: incomes
        .filter((i: any) => {
          const date = new Date(i.expectedDate);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum: number, income: any) => sum + income.amount, 0),
    };
  }, [incomeData]);

  // Calculate goals stats
  const goalsStats = useMemo(() => {
    if (!goals) return { total: 0, active: 0, completed: 0, avgProgress: 0 };

    const activeGoals = goals.filter((g: any) => g.active);
    const completedGoals = goals.filter((g: any) => g.completed);
    const totalProgress = activeGoals.reduce((sum: number, goal: any) => {
      const progress = (goal.value / goal.targetValue) * 100;
      return sum + Math.min(progress, 100);
    }, 0);

    return {
      total: goals.length,
      active: activeGoals.length,
      completed: completedGoals.length,
      avgProgress: activeGoals.length > 0 ? Math.round(totalProgress / activeGoals.length) : 0,
    };
  }, [goals]);

  return (
    <PageSafeContainer style={styles.container}>
      <Header title="Profile" showBack onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Icons.User size={50} color="#6B7280" />
          </View>
          <Text style={styles.profileName}>
            {user?.firstName} {user?.lastName}
          </Text>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Icons.Mail size={16} color="#6B7280" />
              <Text style={styles.infoText}>{user?.email}</Text>
            </View>
            {user?.phone && (
              <View style={styles.infoRow}>
                <Icons.Phone size={16} color="#6B7280" />
                <Text style={styles.infoText}>{user.phone}</Text>
              </View>
            )}
            {user?.address && (
              <View style={styles.infoRow}>
                <Icons.MapPin size={16} color="#6B7280" />
                <Text style={styles.infoText}>
                  {[
                    user.address.addressLine1,
                    user.address.locality,
                    user.address.region,
                    user.address.postalCode,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Income Overview */}
        <Card style={styles.statsCard}>
          <View style={styles.sectionHeader}>
            <Icons.DollarSign size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Income Overview</Text>
          </View>

          {incomeLoading ? (
            <View
              style={{
                height: 100,
                flex: 1,
                justifyContent: 'center',
              }}>
              <LoadingSpinner color="gray" />
            </View>
          ) : (
            <>
              <View style={styles.mainStat}>
                <Text style={styles.mainStatLabel}>Total Income</Text>
                <Text style={styles.mainStatValue}>
                  ${incomeStats.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
              </View>

              <View style={styles.miniStatsRow}>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatNumber}>
                    ${incomeStats.thisMonth.toLocaleString()}
                  </Text>
                  <Text style={styles.miniStatLabel}>This Month</Text>
                </View>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatNumber}>{incomeStats.pending}</Text>
                  <Text style={styles.miniStatLabel}>Pending</Text>
                </View>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatNumber}>{incomeStats.completed}</Text>
                  <Text style={styles.miniStatLabel}>Completed</Text>
                </View>
              </View>
            </>
          )}
        </Card>

        {/* Goals Overview */}
        <Card style={styles.statsCard}>
          <View style={styles.sectionHeader}>
            <Icons.Target size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Goals Progress</Text>
          </View>

          {goalsLoading ? (
            <View
              style={{
                height: 100,
                flex: 1,
                justifyContent: 'center',
              }}>
              <LoadingSpinner color="gray" />
            </View>
          ) : (
            <>
              <View style={styles.progressCircleContainer}>
                <View style={styles.progressCircle}>
                  <Text style={styles.progressPercentage}>{goalsStats.avgProgress}%</Text>
                  <Text style={styles.progressLabel}>Avg Progress</Text>
                </View>
              </View>

              <View style={styles.miniStatsRow}>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatNumber}>{goalsStats.active}</Text>
                  <Text style={styles.miniStatLabel}>Active Goals</Text>
                </View>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatNumber}>{goalsStats.completed}</Text>
                  <Text style={styles.miniStatLabel}>Completed</Text>
                </View>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatNumber}>{goalsStats.total}</Text>
                  <Text style={styles.miniStatLabel}>Total Goals</Text>
                </View>
              </View>
            </>
          )}
        </Card>

        {/* Quick Actions */}
        <Card style={styles.menuCard}>
          <TouchableOpacity
            onPress={() => navigation.navigate(ModuleKeys.income as never)}
            style={styles.menuItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
              <Icons.DollarSign size={20} color="#2563EB" />
            </View>
            <Text style={styles.menuText}>Manage Incomes</Text>
            <Icons.ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate(ModuleKeys.goals as never)}
            style={styles.menuItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
              <Icons.Target size={20} color="#10B981" />
            </View>
            <Text style={styles.menuText}>Manage Goals</Text>
            <Icons.ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <LogoutButton />
        </Card>
      </ScrollView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoSection: {
    width: '100%',
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  statsCard: {
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  mainStat: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 16,
  },
  mainStatLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  mainStatValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  miniStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  miniStat: {
    alignItems: 'center',
  },
  miniStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  miniStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressCircleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  menuCard: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500',
  },
});
