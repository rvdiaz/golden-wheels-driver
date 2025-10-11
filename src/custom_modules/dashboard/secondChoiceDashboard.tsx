import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Card } from '../../codidge_components/UI/card';
import * as Icons from 'lucide-react-native';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';

const screenWidth = Dimensions.get('window').width;

export const DashboardV2Screen: React.FC = () => {
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 3,
      },
    ],
  };

  const pieChartData = [
    {
      name: 'Active Leads',
      population: 35,
      color: '#2563EB',
      legendFontColor: '#374151',
      legendFontSize: 14,
    },
    {
      name: 'Follow-ups',
      population: 25,
      color: '#10B981',
      legendFontColor: '#374151',
      legendFontSize: 14,
    },
    {
      name: 'Closed Deals',
      population: 15,
      color: '#F59E0B',
      legendFontColor: '#374151',
      legendFontSize: 14,
    },
    {
      name: 'Cold Leads',
      population: 25,
      color: '#EF4444',
      legendFontColor: '#374151',
      legendFontSize: 14,
    },
  ];

  const chartConfig = {
    backgroundColor: 'white',
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#2563EB',
    },
  };

  return (
    <PageSafeContainer style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={[styles.statCard, { backgroundColor: '#EEF2FF' }]}>
            <View style={styles.statHeader}>
              <Icons.TrendingUp size={24} color="#2563EB" />
              <Text style={styles.statValue}>24</Text>
            </View>
            <Text style={styles.statLabel}>Active Leads</Text>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#ECFDF5' }]}>
            <View style={styles.statHeader}>
              <Icons.CheckCircle size={24} color="#10B981" />
              <Text style={styles.statValue}>8</Text>
            </View>
            <Text style={styles.statLabel}>Deals Closed</Text>
          </Card>
        </View>

        <View style={styles.statsContainer}>
          <Card style={[styles.statCard, { backgroundColor: '#FFFBEB' }]}>
            <View style={styles.statHeader}>
              <Icons.Clock size={24} color="#F59E0B" />
              <Text style={styles.statValue}>12</Text>
            </View>
            <Text style={styles.statLabel}>Tasks Today</Text>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#FEF2F2' }]}>
            <View style={styles.statHeader}>
              <Icons.Calendar size={24} color="#EF4444" />
              <Text style={styles.statValue}>5</Text>
            </View>
            <Text style={styles.statLabel}>Appointments</Text>
          </Card>
        </View>

        {/* Charts */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Monthly Performance</Text>
          <LineChart
            data={lineChartData}
            width={screenWidth - 60}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Lead Distribution</Text>
          <PieChart
            data={pieChartData}
            width={screenWidth - 60}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />
        </Card>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Text style={styles.chartTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <Icons.Phone size={20} color="#2563EB" />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Called John Smith</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <Icons.Mail size={20} color="#10B981" />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Sent follow-up email to Sarah Johnson</Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <Icons.Home size={20} color="#F59E0B" />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Scheduled property viewing</Text>
              <Text style={styles.activityTime}>6 hours ago</Text>
            </View>
          </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  chartCard: {
    marginBottom: 16,
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
  },
  activityCard: {
    marginBottom: 16,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityText: {
    fontSize: 16,
    color: '#1F2937',
  },
  activityTime: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});
