import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useMutation, useReactiveVar } from '@apollo/client';
import * as Icons from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { userData, updateUser } from '~/store/user';
import { theme } from '~/theme/theme';
import { IProfileTask } from '../interfaces';
import { Header } from '~/codidge_components/UI/header';
import { ProfileScreensWrapper } from './wrapper';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import { updateUserMutation } from '~/core_modules/auth/graphql/mutations';
import Constants from 'expo-constants';

interface TaskDetailScreenProps {
  task: IProfileTask;
  onBack: () => void;
}

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const TaskDetailScreen = ({ task, onBack }: TaskDetailScreenProps) => {
  const user = useReactiveVar(userData);

  const [updateUserFn, { loading: isUpdating }] = useMutation(updateUserMutation);

  // Get current progress for this task
  const taskProgress = user?.profileSteps?.find((step) => step.id === task.id);
  const completedSubSteps = taskProgress?.subSteps || [];

  // Check if all subitems are completed
  const allSubitemsCompleted =
    task.subitems.length > 0 &&
    task.subitems.every((subitem) => completedSubSteps.includes(subitem.id));

  const isTaskCompleted = !!taskProgress && allSubitemsCompleted;

  // Toggle individual subitem
  const toggleSubitem = async (subitemId: string) => {
    if (!user) return;

    try {
      const updatedProfileSteps = [...(user.profileSteps || [])];
      const taskIndex = updatedProfileSteps.findIndex((step) => step.id === task.id);

      if (taskIndex === -1) {
        // Task doesn't exist yet, create it
        updatedProfileSteps.push({
          id: task.id,
          title: task.title,
          subSteps: [subitemId],
        });
      } else {
        // Task exists, toggle the subitem
        const currentSubSteps = updatedProfileSteps[taskIndex].subSteps || [];
        if (currentSubSteps.includes(subitemId)) {
          // Remove subitem
          updatedProfileSteps[taskIndex].subSteps = currentSubSteps.filter(
            (id) => id !== subitemId
          );
        } else {
          // Add subitem
          updatedProfileSteps[taskIndex].subSteps = [...currentSubSteps, subitemId];
        }
      }

      await updateUserFn({
        variables: {
          tenant: {
            tenantId: tenantId,
          },
          updates: {
            profileSteps: updatedProfileSteps,
          },
          userId: user.id,
        },
      });

      updateUser({
        ...user,
        profileSteps: updatedProfileSteps,
      });
    } catch (error) {
      console.error('Error updating subitem:', error);
    }
  };

  // Complete all subitems at once
  const completeAllTask = async () => {
    if (!user) return;
    // setIsUpdating(true);

    try {
      const updatedProfileSteps = [...(user.profileSteps || [])];
      const taskIndex = updatedProfileSteps.findIndex((step) => step.id === task.id);

      const allSubitemIds = task.subitems.map((subitem) => subitem.id);

      if (taskIndex === -1) {
        // Task doesn't exist yet, create it with all subitems completed
        updatedProfileSteps.push({
          id: task.id,
          title: task.title,
          subSteps: allSubitemIds,
        });
      } else {
        // Task exists, mark all subitems as completed
        updatedProfileSteps[taskIndex].subSteps = allSubitemIds;
      }

      await updateUserFn({
        variables: {
          tenant: {
            tenantId: tenantId,
          },
          updates: {
            profileSteps: updatedProfileSteps,
          },
          userId: user.id,
        },
      });

      updateUser({
        ...user,
        profileSteps: updatedProfileSteps,
      });
    } catch (error) {
      console.error('Error completing all tasks:', error);
    }
  };

  // Calculate progress percentage
  const progressPercentage =
    task.subitems.length > 0
      ? Math.round((completedSubSteps.length / task.subitems.length) * 100)
      : 0;

  return (
    <ProfileScreensWrapper
      header={
        <View style={{ width: '100%' }}>
          <Header
            title={task.title}
            showBack={true}
            onBack={onBack}
            contentContainerStyle={{
              backgroundColor: 'transparent',
              borderBottomWidth: 0,
            }}
            contentStyle={{
              paddingVertical: 0,
            }}
            leftWidget={
              <TouchableOpacity onPress={onBack}>
                <Icons.ChevronLeftIcon color="#FFF" />
              </TouchableOpacity>
            }
            titleStyles={{ color: '#fff' }}
          />
        </View>
      }>
      {/* Completed Badge */}
      {isTaskCompleted && (
        <View style={styles.footer}>
          <View style={styles.completedBadge}>
            <Icons.Award size={20} color={theme.colors.primary} />
            <Text style={styles.completedBadgeText}>All Steps Completed!</Text>
          </View>
        </View>
      )}

      <ScrollView
        style={[
          styles.content,
          isTaskCompleted && {
            paddingTop: 10,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Task Title & Status */}
        <View style={styles.sectionCard}>
          <View style={styles.taskHeader}>
            <View style={styles.taskIconContainer}>
              <Icons.CheckCircle2 size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.taskTitleContainer}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDescription}>{task.description}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          {task.subitems.length > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {completedSubSteps.length} of {task.subitems.length} completed
              </Text>
            </View>
          )}
        </View>

        {/* Subitems Checklist */}
        {task.subitems.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Steps to Complete</Text>
            {task.subitems.map((subitem, index) => {
              const isCompleted = completedSubSteps.includes(subitem.id);

              return (
                <TouchableOpacity
                  key={subitem.id}
                  style={[styles.subitemContainer, isCompleted && styles.itemContainerSelected]}
                  onPress={() => toggleSubitem(subitem.id)}
                  activeOpacity={0.7}>
                  <View style={styles.rightSection}>
                    <View style={[styles.checkbox, isCompleted && styles.checkboxSelected]}>
                      {isCompleted && <Icons.Check size={16} color="#FFFFFF" />}
                    </View>
                  </View>
                  <View style={styles.middleSection}>
                    <Text style={[styles.itemLabel, isCompleted && styles.itemLabelSelected]}>
                      {subitem.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            {/* Complete All Button */}
            {!isTaskCompleted && task.subitems.length > 0 && (
              <View>
                <OutlineButton
                  loading={isUpdating}
                  title="Complete full task"
                  onPress={completeAllTask}
                />
              </View>
            )}
          </View>
        )}

        {/* Full Description */}
        {task.fullDescriptionHtml && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Description</Text>
            <WebView
              style={styles.webview}
              originWhitelist={['*']}
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                      <style>
                        body {
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                          font-size: 14px;
                          color: #4B5563;
                          line-height: 1.6;
                          margin: 0;
                          padding: 0;
                        }
                        p { margin: 8px 0; }
                        ul, ol { margin: 8px 0; padding-left: 20px; }
                        li { margin: 4px 0; }
                        h1, h2, h3, h4, h5, h6 { color: #1F2937; margin: 12px 0 8px 0; }
                        a { color: ${theme.colors.primary}; }
                      </style>
                    </head>
                    <body>
                      ${task.fullDescriptionHtml}
                    </body>
                  </html>
                `,
              }}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              androidLayerType="hardware"
              javaScriptEnabled={false}
            />
          </View>
        )}

        {/* Recommendations */}
        {task.recommendations && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <WebView
              style={styles.webview}
              originWhitelist={['*']}
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                      <style>
                        body {
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                          font-size: 14px;
                          color: #4B5563;
                          line-height: 1.6;
                          margin: 0;
                          padding: 0;
                        }
                        p { margin: 8px 0; }
                        ul, ol { margin: 8px 0; padding-left: 20px; }
                        li { margin: 4px 0; }
                        h1, h2, h3, h4, h5, h6 { color: #1F2937; margin: 12px 0 8px 0; }
                        a { color: ${theme.colors.primary}; }
                      </style>
                    </head>
                    <body>
                      ${task.recommendations}
                    </body>
                  </html>
                `,
              }}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              androidLayerType="hardware"
              javaScriptEnabled={false}
            />
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </ProfileScreensWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  taskCard: {
    padding: 20,
    marginBottom: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  taskIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskTitleContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  webview: {
    height: 200,
    backgroundColor: 'transparent',
  },
  subitemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: 5,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8,
  },
  itemContainerSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: theme.colors.primary,
    borderWidth: 2,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  middleSection: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  itemLabelSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  rightSection: {
    marginLeft: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  subitemDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  footer: {
    paddingTop: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  completedBadge: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  completedBadgeText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 20,
  },
});
