import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import * as Icons from 'lucide-react-native';
import { Card } from '~/codidge_components/UI/card';
import { Header } from '~/codidge_components/UI/header';
import { VideoPlayerScreen } from './VideoPlayerScreen';

interface Video {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Introduction to Real Estate',
    duration: '15:30',
    completed: true,
  },
  {
    id: '2',
    title: 'Understanding Market Trends',
    duration: '22:15',
    completed: true,
  },
  {
    id: '3',
    title: 'Building Client Relationships',
    duration: '18:45',
    completed: false,
  },
  {
    id: '4',
    title: 'Closing Techniques',
    duration: '25:20',
    completed: false,
  },
];

export const CourseDetailsScreen: React.FC = () => {
  const route = useRoute();
  const params = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const course = {
    id: '1',
    title: 'Real Estate Fundamentals',
    description: 'Learn the basics of real estate sales and marketing',
    duration: '2h 30m',
    progress: 75,
    category: 'Basics',
    difficulty: 'Beginner',
  };

  const completedVideos = mockVideos.filter((video) => video.completed).length;
  const totalVideos = mockVideos.length;
  const progress = (completedVideos / totalVideos) * 100;

  const renderVideo = (video: Video) => (
    <Card key={video.id} style={styles.videoCard}>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={styles.videoContent}>
        <View style={styles.videoIcon}>
          {video.completed ? (
            <Icons.CheckCircle2 size={24} color="#10B981" />
          ) : (
            <Icons.Play size={24} color="#2563EB" />
          )}
        </View>

        <View style={styles.videoInfo}>
          <Text style={[styles.videoTitle, video.completed && styles.completedText]}>
            {video.title}
          </Text>
          <Text style={styles.videoDuration}>{video.duration}</Text>
        </View>

        <Icons.ChevronRight size={20} color="#9CA3AF" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <VideoPlayerScreen
          onDispose={() => {
            setModalVisible(false);
          }}
        />
      </Modal>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Course Details" showBack onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDescription}>{course.description}</Text>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {completedVideos} of {totalVideos} videos completed
            </Text>
          </View>

          <View style={styles.courseStats}>
            <View style={styles.statItem}>
              <Icons.Clock size={16} color="#6B7280" />
              <Text style={styles.statText}>{course.duration}</Text>
            </View>
            <View style={styles.statItem}>
              <Icons.Users size={16} color="#6B7280" />
              <Text style={styles.statText}>{course.difficulty}</Text>
            </View>
            <View style={styles.statItem}>
              <Icons.BookOpen size={16} color="#6B7280" />
              <Text style={styles.statText}>{totalVideos} Videos</Text>
            </View>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Course Content</Text>
        </View>

        {mockVideos.map(renderVideo)}

        <Card style={styles.actionCard}>
          <TouchableOpacity style={styles.continueButton}>
            <Icons.Play size={20} color="white" />
            <Text style={styles.continueButtonText}>
              {progress > 0 ? 'Continue Learning' : 'Start Course'}
            </Text>
          </TouchableOpacity>
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
  courseHeader: {
    padding: 20,
    marginBottom: 24,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  videoCard: {
    marginBottom: 8,
  },
  videoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  videoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  completedText: {
    color: '#6B7280',
  },
  videoDuration: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionCard: {
    marginTop: 16,
    marginBottom: 16,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    margin: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
