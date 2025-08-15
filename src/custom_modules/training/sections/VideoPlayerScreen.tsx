import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Icons from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { Card } from '~/codidge_components/UI/card';

export const VideoPlayerScreen = ({ onDispose }: { onDispose: () => void }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { video, course } = {
    course: {
      id: '1',
      title: 'Real Estate Fundamentals',
      description: 'Learn the basics of real estate sales and marketing',
      duration: '2h 30m',
      progress: 75,
      category: 'Basics',
      difficulty: 'Beginner',
    },
    video: {
      id: '2',
      title: 'Understanding Market Trends',
      duration: '22:15',
      completed: true,
    },
  };
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMarkComplete = () => {
    Alert.alert('Mark as Complete', 'Have you finished watching this video?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete',
        onPress: () => {
          Alert.alert('Success', 'Video marked as complete!');
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={video.title}
        rightText="Close"
        rightAction={() => {
          onDispose();
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video Player Placeholder */}
        <Card style={styles.videoContainer}>
          <View style={styles.videoPlayer}>
            <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
              {isPlaying ? (
                <Icons.Pause size={40} color="white" />
              ) : (
                <Icons.Play size={40} color="white" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.videoControls}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '30%' }]} />
            </View>
            <View style={styles.timeControls}>
              <Text style={styles.timeText}>4:32</Text>
              <Text style={styles.timeText}>{video.duration}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <Text style={styles.courseTitle}>From: {course.title}</Text>

          <View style={styles.videoMeta}>
            <View style={styles.metaItem}>
              <Icons.Clock size={16} color="#6B7280" />
              <Text style={styles.metaText}>{video.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icons.BookOpen size={16} color="#6B7280" />
              <Text style={styles.metaText}>{course.difficulty}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>About this video</Text>
          <Text style={styles.description}>
            In this video, you'll learn the fundamental concepts of real estate sales and how to
            apply them in your daily practice. We'll cover key strategies for building relationships
            with clients and understanding their needs.
          </Text>

          <View style={styles.keyPoints}>
            <Text style={styles.keyPointsTitle}>Key Points Covered:</Text>
            <View style={styles.pointItem}>
              <Icons.Check size={16} color="#10B981" />
              <Text style={styles.pointText}>Building trust with clients</Text>
            </View>
            <View style={styles.pointItem}>
              <Icons.Check size={16} color="#10B981" />
              <Text style={styles.pointText}>Understanding market dynamics</Text>
            </View>
            <View style={styles.pointItem}>
              <Icons.Check size={16} color="#10B981" />
              <Text style={styles.pointText}>Effective communication techniques</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.actionCard}>
          <TouchableOpacity style={styles.completeButton} onPress={handleMarkComplete}>
            <Icons.CheckCircle2 size={20} color="white" />
            <Text style={styles.completeButtonText}>Mark as Complete</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next Video</Text>
            <Icons.ArrowRight size={20} color="#2563EB" />
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
  videoContainer: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  videoPlayer: {
    height: 200,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoControls: {
    padding: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  timeControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  videoInfo: {
    padding: 20,
    marginBottom: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 14,
    color: '#2563EB',
    marginBottom: 16,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  descriptionCard: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  keyPoints: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  keyPointsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  actionCard: {
    padding: 20,
    marginBottom: 16,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#10B981',
    borderRadius: 8,
    marginBottom: 12,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  nextButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
