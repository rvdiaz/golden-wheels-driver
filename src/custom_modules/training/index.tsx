import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import * as Icons from 'lucide-react-native';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Real Estate Fundamentals',
    description: 'Learn the basics of real estate sales and marketing',
    duration: '2h 30m',
    progress: 75,
    category: 'Basics',
    difficulty: 'Beginner',
  },
  {
    id: '2',
    title: 'Advanced Negotiation Tactics',
    description: 'Master the art of negotiation in real estate deals',
    duration: '1h 45m',
    progress: 30,
    category: 'Sales',
    difficulty: 'Advanced',
  },
  {
    id: '3',
    title: 'Digital Marketing for Agents',
    description: 'Leverage social media and digital tools for lead generation',
    duration: '3h 15m',
    progress: 0,
    category: 'Marketing',
    difficulty: 'Intermediate',
  },
];

export const TrainingScreen: React.FC = () => {
  const navigation = useNavigation();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#10B981';
      case 'Intermediate':
        return '#F59E0B';
      case 'Advanced':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const renderCourse = (course: Course) => (
    <Card key={course.id} style={styles.courseCard}>
      <TouchableOpacity onPress={() => {}} style={styles.courseContent}>
        <View style={styles.courseHeader}>
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseDescription}>{course.description}</Text>
          </View>
          <View style={styles.courseMeta}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(course.difficulty) + '20' },
              ]}>
              <Text
                style={[styles.difficultyText, { color: getDifficultyColor(course.difficulty) }]}>
                {course.difficulty}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.courseFooter}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{course.progress}% Complete</Text>
          </View>

          <View style={styles.courseDuration}>
            <Icons.Clock size={16} color="#6B7280" />
            <Text style={styles.durationText}>{course.duration}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Training" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Progress</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Courses Enrolled</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>35%</Text>
              <Text style={styles.statLabel}>Overall Progress</Text>
            </View>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Courses</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {mockCourses.map(renderCourse)}

        <Card style={styles.featuredCard}>
          <View style={styles.featuredContent}>
            <Icons.Award size={32} color="#F59E0B" />
            <View style={styles.featuredText}>
              <Text style={styles.featuredTitle}>Complete Your First Course!</Text>
              <Text style={styles.featuredDescription}>
                Earn your first certificate and unlock advanced training
              </Text>
            </View>
          </View>
        </Card>
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
  statsCard: {
    padding: 20,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  courseCard: {
    marginBottom: 16,
  },
  courseContent: {
    padding: 20,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  courseInfo: {
    flex: 1,
    marginRight: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  courseMeta: {
    alignItems: 'flex-end',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginRight: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  courseDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  featuredCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FED7AA',
    marginTop: 8,
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  featuredText: {
    flex: 1,
    marginLeft: 16,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#A16207',
  },
});
