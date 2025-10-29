import React, { useState } from 'react';
import { ITask, TaskSource } from '../interfaces';
import { Modal, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { AddTaskScreen } from './addTask';
import {
  formatDate,
  formatTaskTime,
  getTaskColorByType,
  getTaskIconByType,
  getTaskStatus,
} from '../helpers';
import { theme } from '~/theme/theme';
import { DragPopupIndicator } from '~/codidge_components/UI/dragIndicator';
import { PriorityBadge } from './priorityBadge';
import { Badge } from '~/codidge_components/UI/badge';

export const TaskDetail = ({
  task,
  detailDescription,
  categoryLabel,
  disposeModalHandler,
  value,
}: {
  disposeModalHandler: () => void;
  detailDescription?: string;
  categoryLabel: string;
  task: ITask;
  value: boolean;
}) => {
  const [editTask, seteditTask] = useState(false);

  const taskStatus = getTaskStatus(task);
  const taskItemColor = getTaskColorByType(taskStatus.key);
  const taskIcon = getTaskIconByType(taskStatus.key);

  return (
    <View style={styles.container}>
      <DragPopupIndicator />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={disposeModalHandler} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{task.title}</Text>
        {!value && task.source !== TaskSource.admin && (
          <TouchableOpacity onPress={() => seteditTask(true)}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Time</Text>
          <Text style={styles.sectionValue}>
            {formatTaskTime(task.startTime.toString())} - {formatTaskTime(task.endTime.toString())}
          </Text>
        </View>

        {/* Category Section */}
        {categoryLabel && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Category</Text>
            <Text style={styles.sectionValue}>{categoryLabel}</Text>
          </View>
        )}

        {/* Category Section */}
        {task.category && (
          <View style={[styles.section]}>
            <Text style={styles.sectionLabel}>Priority</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}>
              <PriorityBadge priority={task.priority} />
            </View>
          </View>
        )}

        {/* Description Section */}
        {task.description && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.sectionValue}>{task.description}</Text>
          </View>
        )}

        {/* Detail Description Section */}
        {detailDescription && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Details</Text>
            <Text style={styles.sectionValue}>{detailDescription}</Text>
          </View>
        )}

        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Status</Text>
          <Badge
            displayIcon={false}
            type="normal"
            style={{
              backgroundColor: taskItemColor,
              borderColor: taskItemColor,
              minWidth: 90,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}>
              {taskIcon}
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#FFF',
                }}>
                {taskStatus.label}
              </Text>
            </View>
          </Badge>
        </View>

        {/* Date Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Date</Text>
          <Text style={styles.sectionValue}>
            {formatDate(task.date, false)} {/* true = include time */}
          </Text>
        </View>
      </ScrollView>

      {/* Edit Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editTask}
        onRequestClose={() => {
          seteditTask(false);
        }}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <AddTaskScreen
            defaultDate={String(task.date)}
            task={task}
            disposeModalHandler={() => {
              seteditTask(false);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 20,
    color: '#6B7280',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  editButton: {
    fontSize: 16,
    color: theme.colors.primary || '#3B82F6',
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    maxHeight: 500, // Limit height for scrolling
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  sectionValue: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 22,
  },
});
