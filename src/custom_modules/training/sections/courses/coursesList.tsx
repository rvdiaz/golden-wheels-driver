import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Text from '~/codidge_components/UI/text';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card } from '~/codidge_components/UI/card';
import * as Icons from 'lucide-react-native';
import { theme } from '~/theme/theme';
import { useQuery } from '@apollo/client';
import { ModuleKeys } from '~/store/interface';
import { TenantData, TrainingCourse } from '../../interfaces';
import { GET_ALL_TRAINING_COURSES } from '../../graphql/queries';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';

export const TrainingCoursesScreen: React.FC = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const { module, program, tenant } = route.params as {
    module: any;
    program: any;
    tenant: TenantData;
  };

  const { data, loading, error, refetch } = useQuery(GET_ALL_TRAINING_COURSES, {
    variables: {
      tenant,
      trainingProgramId: program.trainingId,
      moduleId: module.moduleId,
    },
  });

  const courses: TrainingCourse[] = data?.getAllTrainingCourses || [];
  const sortedCourses = [...courses].sort((a, b) => a.order - b.order);

  const getPrimaryCourseType = (course: TrainingCourse) => {
    // Check if course has video content
    const hasVideo = course.contentItems.some((item) => item.type === 'VIDEO');
    if (hasVideo) {
      return { icon: Icons.Video, color: theme.colors.success, label: 'Video' };
    }

    // Check for other content types in priority order
    const hasQuiz = course.contentItems.some((item) => item.type === 'QUIZ');
    if (hasQuiz) {
      return { icon: Icons.CheckCircle, color: '#10B981', label: 'Quiz' };
    }

    const hasDocument = course.contentItems.some((item) => item.type === 'DOCUMENT');
    if (hasDocument) {
      return { icon: Icons.FileText, color: '#3B82F6', label: 'Document' };
    }

    const hasAudio = course.contentItems.some((item) => item.type === 'AUDIO');
    if (hasAudio) {
      return { icon: Icons.Music, color: '#8B5CF6', label: 'Audio' };
    }

    const hasInteractive = course.contentItems.some((item) => item.type === 'INTERACTIVE');
    if (hasInteractive) {
      return { icon: Icons.Gamepad2, color: '#F59E0B', label: 'Interactive' };
    }

    // Default to info icon for text or other content
    return { icon: Icons.FileText, color: theme.colors.info, label: 'Info' };
  };

  const handleCoursePress = (course: TrainingCourse) => {
    navigation.navigate(ModuleKeys.trainingDetailCourses, {
      course,
      module,
      program,
      tenant,
    });
  };

  if (loading) {
    return (
      <PageSafeContainer style={styles.container}>
        <Header
          title={module.title}
          onBack={() => {
            navigation.goBack();
          }}
          showBack={true}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      </PageSafeContainer>
    );
  }

  if (error) {
    return (
      <PageSafeContainer style={styles.container}>
        <Header
          title={module.title}
          onBack={() => {
            navigation.goBack();
          }}
          showBack={true}
        />
        <View style={styles.centerContainer}>
          <Icons.AlertCircle size={48} color="#EF4444" />
          <Text style={styles.errorText}>Error loading courses</Text>
        </View>
      </PageSafeContainer>
    );
  }

  if (sortedCourses.length === 0) {
    return (
      <PageSafeContainer style={styles.container}>
        <Header
          title={module.title}
          onBack={() => {
            navigation.goBack();
          }}
          showBack={true}
        />
        <View style={styles.centerContainer}>
          <Icons.BookOpen size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No courses available</Text>
        </View>
      </PageSafeContainer>
    );
  }

  return (
    <PageSafeContainer style={styles.container}>
      <Header
        title={module.title}
        onBack={() => {
          navigation.goBack();
        }}
        showBack={true}
      />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={async () => {
              await refetch();
            }}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Module Info Header */}
        {(module.title || module.title) && (
          <Card style={styles.headerCard}>
            <View style={styles.headerContent}>
              {module.title && <Text style={styles.moduleTitle}>{module.title}</Text>}
              {module.description && (
                <Text style={styles.moduleDescription}>{module.description}</Text>
              )}
            </View>
          </Card>
        )}

        {/* Courses List */}
        <Text style={styles.sectionTitle}>Content</Text>

        {sortedCourses.map((course, index) => {
          const primaryType = getPrimaryCourseType(course);
          const IconComponent = primaryType.icon;

          return (
            <Card key={course.courseId} style={styles.courseCard}>
              <TouchableOpacity
                onPress={() => handleCoursePress(course)}
                style={styles.courseContent}
                activeOpacity={0.7}>
                <View style={styles.courseHeader}>
                  <View
                    style={[
                      styles.courseOrderBadge,
                      { backgroundColor: primaryType.color + '20' },
                    ]}>
                    <IconComponent size={20} color={primaryType.color} />
                  </View>

                  <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text style={styles.courseDescription} numberOfLines={2}>
                      {course.description}
                    </Text>

                    {/* Tags */}
                    {course.tags && course.tags.length > 0 && (
                      <View style={styles.tagsContainer}>
                        {course.tags.slice(0, 3).map((tag, idx) => (
                          <View key={idx} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                        {course.tags.length > 3 && (
                          <Text style={styles.moreTagsText}>+{course.tags.length - 3}</Text>
                        )}
                      </View>
                    )}
                  </View>

                  <Icons.ChevronRight size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            </Card>
          );
        })}
      </ScrollView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bodyBackground,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: theme.colors.bodyBackground,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  headerCard: {
    marginBottom: 24,
  },
  headerContent: {
    padding: 20,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  courseCard: {
    marginBottom: 12,
  },
  courseContent: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseOrderBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseOrderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  courseOrderTextSmall: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  courseInfo: {
    flex: 1,
    marginRight: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  contentTypesContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  contentTypeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
