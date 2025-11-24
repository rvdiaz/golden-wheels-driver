import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { Card } from '~/codidge_components/UI/card';
import * as Icons from 'lucide-react-native';
import { ContentItem, ContentType, TenantData, TrainingCourse } from '../../interfaces';
import { VideoContentItem } from './videoContent';
import { DocumentContentItem } from './documentContent';
import { QuizContentItem } from './quizContent';
import { AudioContentItem } from './audioContent';
import { InteractiveContentItem } from './interactiveContent';
import { TextContentItem } from './textContent';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';
import { theme } from '~/theme/theme';
import HtmlViewer from '~/codidge_components/UI/htmlViewer';

interface ContentItemProps {
  item: any;
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
}

export const TrainingCourseDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeContentIndex, setActiveContentIndex] = useState<number>(0);

  const { course, module, program, tenant } = route.params as {
    course: TrainingCourse;
    module: any;
    program: any;
    tenant: TenantData;
  };

  const renderContentDetails = (courseContentItem: ContentItem, index: number) => {
    const isActive = activeContentIndex === index;

    return (
      <View key={courseContentItem.order || index} style={styles.contentItemWrapper}>
        {/* Content Item Header/Tab */}
        <TouchableOpacity
          style={[styles.contentTab, isActive && styles.contentTabActive]}
          onPress={() => setActiveContentIndex(index)}
          activeOpacity={0.7}>
          <View style={styles.tabLeft}>
            <View style={[styles.tabIcon, isActive && styles.tabIconActive]}>
              {getContentIcon(courseContentItem.type, isActive)}
            </View>
            <View style={styles.tabInfo}>
              <Text style={[styles.tabTitle, isActive && styles.tabTitleActive]}>
                {courseContentItem.title || `Content ${index + 1}`}
              </Text>
              {courseContentItem.estimatedDuration && (
                <Text style={styles.tabDuration}>{courseContentItem.estimatedDuration}</Text>
              )}
            </View>
          </View>
          <View style={styles.tabNumber}>
            <Text style={[styles.tabNumberText, isActive && styles.tabNumberTextActive]}>
              {index + 1}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Active Content Display */}
        {isActive && (
          <View style={styles.activeContentContainer}>
            {renderContentComponent(courseContentItem)}
          </View>
        )}
      </View>
    );
  };

  const renderContentComponent = (courseContentItem: ContentItem) => {
    switch (courseContentItem.type) {
      case 'VIDEO':
        return <VideoContentItem item={courseContentItem} />;
      case 'DOCUMENT':
        return <DocumentContentItem item={courseContentItem} />;
      case 'QUIZ':
        return <QuizContentItem item={courseContentItem} />;
      case 'AUDIO':
        return <AudioContentItem item={courseContentItem} />;
      case 'INTERACTIVE':
        return <InteractiveContentItem item={courseContentItem} />;
      case 'TEXT':
        return <TextContentItem item={courseContentItem} />;
      default:
        return <Text>Content type not supported</Text>;
    }
  };

  const getContentIcon = (type: string, isActive: boolean) => {
    const color = isActive ? theme.colors.primary : '#6B7280';
    const size = 20;

    switch (type) {
      case 'VIDEO':
        return <Icons.Video size={size} color={color} />;
      case 'DOCUMENT':
        return <Icons.FileText size={size} color={color} />;
      case 'QUIZ':
        return <Icons.ClipboardCheck size={size} color={color} />;
      case 'AUDIO':
        return <Icons.Headphones size={size} color={color} />;
      case 'INTERACTIVE':
        return <Icons.MousePointerClick size={size} color={color} />;
      case 'TEXT':
        return <Icons.FileType size={size} color={color} />;
      default:
        return <Icons.File size={size} color={color} />;
    }
  };

  return (
    <PageSafeContainer>
      <Header
        title={course.title}
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Course Header Card */}
        <Card style={styles.headerCard}>
          <View style={styles.courseHeader}>
            <Text style={styles.courseTitle}>{course.title}</Text>

            {/* Course Meta Information */}
            <View style={styles.courseMeta}>
              {course.contentItems && course.contentItems.length > 0 && (
                <View style={styles.metaItem}>
                  <Icons.Layers size={16} color="#6B7280" />
                  <Text style={styles.metaText}>
                    {course.contentItems.length}{' '}
                    {course.contentItems.length === 1 ? 'item' : 'items'}
                  </Text>
                </View>
              )}
            </View>

            {/* Short Description */}
            {course.description && (
              <Text style={styles.courseDescription}>{course.description}</Text>
            )}

            {/* HTML Description */}
            {course.htmlDescription && (
              <View style={styles.htmlDescriptionContainer}>
                <HtmlViewer htmlDescription={course.htmlDescription} />
              </View>
            )}

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {course.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Card>

        {/* Content Items */}
        {course.contentItems && course.contentItems.length > 0 ? (
          <Card style={styles.contentCard}>
            <View style={styles.contentHeader}>
              <Text style={styles.contentHeaderTitle}>Course Content</Text>
              <Text style={styles.contentHeaderSubtitle}>
                {activeContentIndex + 1} of {course.contentItems.length}
              </Text>
            </View>
            <View style={styles.contentList}>
              {course.contentItems.map((contentItem, index) =>
                renderContentDetails(contentItem, index)
              )}
            </View>
          </Card>
        ) : (
          <View></View>
        )}

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
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  courseDescription: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
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
  contentCard: {
    margin: 16,
  },
  contentHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  contentHeaderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  contentList: {
    padding: 16,
  },
  contentItemWrapper: {
    marginBottom: 8,
  },
  contentTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  contentTabActive: {
    backgroundColor: '#EEF2FF',
    borderColor: theme.colors.primary,
  },
  tabLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tabIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tabIconActive: {
    backgroundColor: '#DBEAFE',
  },
  tabInfo: {
    flex: 1,
  },
  tabTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  tabTitleActive: {
    color: theme.colors.primary,
  },
  tabDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  tabNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabNumberText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabNumberTextActive: {
    color: theme.colors.primary,
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
