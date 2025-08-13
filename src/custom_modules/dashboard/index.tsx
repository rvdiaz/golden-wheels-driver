import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card } from '../../components/Card';
import * as Icons from 'lucide-react-native';
import Svg, { Circle, Defs } from 'react-native-svg';
import { TaskList } from '../task/widgets/taskList';
import { ITask } from '../task/interfaces';
import { FloatingMenu } from '~/components/FloatingMenu';

const screenWidth = Dimensions.get('window').width;

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([
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
  ]);

  const weeklyActivityData = [
    {
      name: 'Calls Made',
      value: 35,
      color: '#FF718B',
      total: 147,
    },
    {
      name: 'Tasks Completed',
      value: 28,
      color: '#FCB5C3',
      total: 85,
    },
    {
      name: 'Meetings',
      value: 20,
      color: '#FFEB3A',
      total: 12,
    },
    {
      name: 'Follow-ups',
      value: 17,
      color: '#7FE47E',
      total: 23,
    },
  ];

  const totalActivityScore = weeklyActivityData.reduce((sum, item) => sum + item.value, 0);
  const completedTasks = tasks.filter((task) => task.completed).length;

  const toggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const WeeklyActivityChart = () => {
    const radius = 80;
    const strokeWidth = 12;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    return (
      <View style={styles.chartContainer}>
        <Svg height="180" width="180" style={styles.chartSvg}>
          <Defs>
            {/* Background circle */}
            <Circle
              stroke="#F3F4F6"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={90}
              cy={90}
            />

            {/* Activity arcs */}
            {weeklyActivityData.map((item, index) => {
              const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`;
              const strokeDashoffset = circumference - (index * circumference) / 4;

              return (
                <Circle
                  key={index}
                  stroke={item.color}
                  fill="transparent"
                  strokeWidth={strokeWidth - 2}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  r={normalizedRadius - index * 3}
                  cx={90}
                  cy={90}
                  transform={`rotate(-90 90 90)`}
                />
              );
            })}
          </Defs>
        </Svg>

        {/* Center content */}
        <View style={styles.chartCenter}>
          <Text style={styles.chartScore}>{totalActivityScore}</Text>
          <Text style={styles.chartLabel}>This week's activity</Text>
          <Text style={styles.chartDate}>Aug 1-7, 2024</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Banner */}
        <Card style={styles.bannerCard}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>My potential is limitless.</Text>
              <Text style={styles.bannerSubtitle}>Daily Affirmation • August 7, 2024</Text>
            </View>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>New Quote</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Metrics Cards */}
        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <View style={styles.metricContent}>
              <View style={styles.metricInfo}>
                <Text style={styles.metricLabel}>Q1 Progress</Text>
                <Text style={styles.metricValue}>0%</Text>
                <Text style={styles.metricSubtext}>→ On track to goals</Text>
              </View>
              <View style={[styles.metricIcon, { backgroundColor: '#ECFDF5' }]}>
                <Icons.Target size={24} color="#059669" />
              </View>
            </View>
          </Card>

          <Card style={styles.metricCard}>
            <View style={styles.metricContent}>
              <View style={styles.metricInfo}>
                <Text style={styles.metricLabel}>Today's Tasks</Text>
                <Text style={styles.metricValue}>{completedTasks}/5</Text>
                <Text style={[styles.metricSubtext, { color: '#2563EB' }]}>
                  {5 - completedTasks} remaining
                </Text>
              </View>
              <View style={[styles.metricIcon, { backgroundColor: '#EEF2FF' }]}>
                <Icons.CheckCircle size={24} color="#2563EB" />
              </View>
            </View>
          </Card>

          <Card style={styles.metricCard}>
            <View style={styles.metricContent}>
              <View style={styles.metricInfo}>
                <Text style={styles.metricLabel}>CRM Contacts</Text>
                <Text style={styles.metricValue}>24</Text>
                <Text style={[styles.metricSubtext, { color: '#EA580C' }]}>→ +3 today</Text>
              </View>
              <View style={[styles.metricIcon, { backgroundColor: '#FFF7ED' }]}>
                <Icons.Users size={24} color="#EA580C" />
              </View>
            </View>
          </Card>

          <Card style={styles.metricCard}>
            <View style={styles.metricContent}>
              <View style={styles.metricInfo}>
                <Text style={styles.metricLabel}>This Quarter</Text>
                <Text style={styles.metricValue}>$8,500</Text>
                <Text style={[styles.metricSubtext, { color: '#059669' }]}>Goal: $31,250</Text>
              </View>
              <View style={[styles.metricIcon, { backgroundColor: '#ECFDF5' }]}>
                <Icons.DollarSign size={24} color="#059669" />
              </View>
            </View>
          </Card>
        </View>

        {/* Main Content Grid */}
        <View style={styles.mainGrid}>
          {/* Tasks Today */}
          <TaskList tasks={tasks} onToggle={toggleTask} />

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Weekly Activity */}
            <Card style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View style={styles.activityIconContainer}>
                  <Icons.TrendingUp size={20} color="#2563EB" />
                </View>
                <Text style={styles.activityTitle}>Weekly Activity</Text>
              </View>

              <WeeklyActivityChart />

              <View style={styles.activityLegend}>
                {weeklyActivityData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={styles.legendItemLeft}>
                      <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                      <Text style={styles.legendName}>{item.name}</Text>
                    </View>
                    <View style={styles.legendItemRight}>
                      <Text style={styles.legendTotal}>{item.total}</Text>
                      <Text style={styles.legendPercentage}>({item.value}%)</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card>

            {/* Q1 Income Goal */}
            <Card style={styles.goalCard}>
              <Text style={styles.goalTitle}>Q1 Income Goal</Text>
              <View style={styles.goalContent}>
                <View style={styles.goalProgress}>
                  <View style={styles.goalProgressHeader}>
                    <Text style={styles.goalProgressLabel}>Progress</Text>
                    <Text style={styles.goalProgressValue}>27%</Text>
                  </View>
                  <View style={styles.goalProgressBar}>
                    <View style={[styles.goalProgressFill, { width: '27%' }]} />
                  </View>
                </View>
                <View style={styles.goalStats}>
                  <View style={styles.goalStat}>
                    <Text style={styles.goalStatLabel}>Current:</Text>
                    <Text style={styles.goalStatValue}>$8,500.00</Text>
                  </View>
                  <View style={styles.goalStat}>
                    <Text style={styles.goalStatLabel}>Goal:</Text>
                    <Text style={styles.goalStatValue}>$31,250.00</Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
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
    padding: 16,
  },
  bannerCard: {
    marginBottom: 24,
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#2563EB',
    /* backgroundImage: 'linear-gradient(135deg, #2563EB 0%, #059669 100%)', */
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bannerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bannerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    marginHorizontal: -8,
  },
  metricCard: {
    width: (screenWidth - 48) / 2,
    marginHorizontal: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  metricContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  metricSubtext: {
    fontSize: 10,
    color: '#059669',
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainGrid: {
    gap: 24,
  },
  rightColumn: {
    flex: 1,
    gap: 24,
  },
  activityCard: {
    borderWidth: 2,
    borderColor: '#F3F4F6',
    padding: 24,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  chartSvg: {
    transform: [{ rotate: '-90deg' }],
  },
  chartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 4,
  },
  chartDate: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  activityLegend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  legendItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendName: {
    fontSize: 12,
    color: '#374151',
  },
  legendItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendTotal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  legendPercentage: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  goalCard: {
    borderWidth: 2,
    borderColor: '#F3F4F6',
    padding: 24,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  goalContent: {
    gap: 16,
  },
  goalProgress: {
    gap: 8,
  },
  goalProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalProgressLabel: {
    fontSize: 14,
    color: '#374151',
  },
  goalProgressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalStat: {
    alignItems: 'flex-start',
  },
  goalStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  goalStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});
