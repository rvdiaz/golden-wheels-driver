import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { Card } from '~/codidge_components/UI/card';
import { TenantData, TrainingCourse } from '../../interfaces';
import { VideoContentItem } from './videoContent';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';
import HtmlViewer from '~/codidge_components/UI/htmlViewer';

export const TrainingCourseDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { course } = route.params as {
    course: TrainingCourse;
    module: any;
    program: any;
    tenant: TenantData;
  };

  const videoContent = course.contentItems.find((con) => con.type === 'VIDEO');

  return (
    <PageSafeContainer>
      <Header
        title=""
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
        leftText="Back"
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Course Header Card */}
        <Card style={styles.headerCard}>
          <View style={styles.courseHeader}>
            <Text style={styles.courseTitle}>{course.title}</Text>

            {/* Short Description */}
            {course.description ? (
              <Text style={styles.courseDescription}>{course.description}</Text>
            ) : (
              <View></View>
            )}

            {/* Content Items */}
            {videoContent && videoContent.url ? (
              <View>
                <VideoContentItem item={videoContent} />
              </View>
            ) : (
              <View></View>
            )}

            {/* HTML Description */}
            {course.htmlDescription ? (
              <View style={styles.htmlDescriptionContainer}>
                <HtmlViewer htmlDescription={course.htmlDescription} />
              </View>
            ) : (
              <View></View>
            )}

            {/* Tags */}
            {course.tags && course.tags.length > 0 ? (
              <View style={styles.tagsContainer}>
                {course.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View></View>
            )}
          </View>
        </Card>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
  },
  courseHeader: {
    padding: 20,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  courseDescription: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginVertical: 8,
  },
  htmlDescriptionContainer: {
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
  },

  activeContentContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  bottomPadding: {
    height: 32,
  },
});
