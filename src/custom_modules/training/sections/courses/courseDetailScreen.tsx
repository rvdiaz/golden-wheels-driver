import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card } from '~/codidge_components/UI/card';
import * as Icons from 'lucide-react-native';
import { theme } from '~/theme/theme';
import { ContentType, TrainingCourse } from '../../interfaces';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';
import HtmlViewer from '~/codidge_components/UI/htmlViewer';

export const TrainingCourseDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { course } = route.params as { course: TrainingCourse; module: any };

  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'VIDEO':
        return { icon: Icons.Video, color: '#EF4444', label: 'Video' };
      case 'DOCUMENT':
        return { icon: Icons.FileText, color: '#3B82F6', label: 'Document' };
      case 'QUIZ':
        return { icon: Icons.CheckCircle, color: '#10B981', label: 'Quiz' };
      case 'AUDIO':
        return { icon: Icons.Music, color: '#8B5CF6', label: 'Audio' };
      case 'INTERACTIVE':
        return { icon: Icons.Gamepad2, color: '#F59E0B', label: 'Interactive' };
      case 'TEXT':
        return { icon: Icons.AlignLeft, color: '#6B7280', label: 'Text' };
      default:
        return { icon: Icons.File, color: '#6B7280', label: 'File' };
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null;
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      const kb = bytes / 1024;
      return `${kb.toFixed(1)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const sortedContentItems = [...course.contentItems].sort((a, b) => a.order - b.order);

  return (
    <PageSafeContainer style={styles.container}>
      <Header
        title={course.title}
        onBack={() => {
          navigation.goBack();
        }}
        showBack={true}
      />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Course Header */}
        <Card style={styles.headerCard}>
          <View style={styles.headerContent}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <HtmlViewer htmlDescription={course.htmlDescription} />
            <View style={styles.statsRow}>
              {/*  <View style={styles.statChip}>
                <Icons.Clock size={16} color={theme.colors.primary} />
                  <Text style={styles.statText}>{formatDuration(course.estimatedDuration)}</Text>
              </View> */}
              <View style={styles.statChip}>
                <Icons.Layers size={16} color={theme.colors.primary} />
                <Text style={styles.statText}>{course.contentItems.length} items</Text>
              </View>
            </View>

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {course.tags.map((tag, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Card>

        {/* Content Items */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Course Content</Text>
          <Text style={styles.sectionSubtitle}>{sortedContentItems.length} learning items</Text>
        </View>

        {sortedContentItems.map((item, index) => {
          const { icon: IconComponent, color, label } = getContentTypeIcon(item.type);
          const isExpanded = expandedItems.has(index);

          return (
            <Card key={index} style={styles.contentCard}>
              <TouchableOpacity
                onPress={() => toggleItem(index)}
                style={styles.contentHeader}
                activeOpacity={0.7}>
                <View style={styles.contentLeft}>
                  <View style={[styles.contentIcon, { backgroundColor: color + '20' }]}>
                    <IconComponent size={20} color={color} />
                  </View>

                  <View style={styles.contentInfo}>
                    <Text style={styles.contentTitle}>{item.title}</Text>
                    <View style={styles.contentMeta}>
                      <Text style={styles.contentType}>{label}</Text>
                      {item.estimatedDuration && (
                        <>
                          <Text style={styles.metaSeparator}>•</Text>
                          {/* <Text style={styles.contentDuration}>
                            {formatDuration(item.estimatedDuration)}
                          </Text> */}
                        </>
                      )}
                    </View>
                  </View>
                </View>

                <Icons.ChevronDown
                  size={20}
                  color="#9CA3AF"
                  style={[styles.expandIcon, isExpanded && styles.expandIconRotated]}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.contentDetails}>
                  <Text style={styles.contentDescription}>{item.description}</Text>

                  {(item.url || item.fileSize || item.mimeType) && (
                    <View style={styles.detailsContainer}>
                      {item.url && (
                        <View style={styles.detailRow}>
                          <Icons.Link size={14} color="#6B7280" />
                          <Text style={styles.detailText} numberOfLines={1}>
                            {item.url}
                          </Text>
                        </View>
                      )}
                      {item.fileSize && (
                        <View style={styles.detailRow}>
                          <Icons.HardDrive size={14} color="#6B7280" />
                          <Text style={styles.detailText}>{formatFileSize(item.fileSize)}</Text>
                        </View>
                      )}
                      {item.mimeType && (
                        <View style={styles.detailRow}>
                          <Icons.FileType size={14} color="#6B7280" />
                          <Text style={styles.detailText}>{item.mimeType}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {item.type === 'QUIZ' && item.quizData && (
                    <View style={styles.quizInfo}>
                      <View style={styles.quizHeader}>
                        <Icons.HelpCircle size={16} color="#10B981" />
                        <Text style={styles.quizTitle}>Quiz Information</Text>
                      </View>
                      <Text style={styles.quizDetail}>
                        Questions: {item.quizData.questions?.length || 0}
                      </Text>
                      <Text style={styles.quizDetail}>
                        Passing Score: {item.quizData.passingScore}%
                      </Text>
                      {item.quizData.timeLimit && (
                        <Text style={styles.quizDetail}>
                          Time Limit: {item.quizData.timeLimit} minutes
                        </Text>
                      )}
                    </View>
                  )}

                  <TouchableOpacity style={styles.startButton}>
                    <Text style={styles.startButtonText}>Start Learning</Text>
                    <Icons.Play size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}
            </Card>
          );
        })}

        {/* Action Card */}
        {/*   <Card style={styles.actionCard}>
          <View style={styles.actionContent}>
            <Icons.Bookmark size={24} color={theme.colors.primary} />
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Save Your Progress</Text>
              <Text style={styles.actionDescription}>
                Your learning progress will be tracked automatically
              </Text>
            </View>
          </View>
        </Card> */}
      </ScrollView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bodyBackground,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerCard: {
    marginBottom: 24,
  },
  headerContent: {
    padding: 20,
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '500',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  contentCard: {
    marginBottom: 12,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  contentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentType: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  metaSeparator: {
    fontSize: 12,
    color: '#D1D5DB',
    marginHorizontal: 6,
  },
  contentDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  expandIcon: {
    marginLeft: 8,
  },
  expandIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  contentDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  contentDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginTop: 12,
    marginBottom: 12,
  },
  detailsContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  quizInfo: {
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  quizTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
  },
  quizDetail: {
    fontSize: 12,
    color: '#047857',
    marginBottom: 4,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionCard: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginTop: 8,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  actionText: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: '#3B82F6',
    lineHeight: 18,
  },
});
