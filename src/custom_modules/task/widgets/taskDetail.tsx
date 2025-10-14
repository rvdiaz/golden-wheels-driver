import React, { useState } from 'react';
import { ITask, TaskSource } from '../interfaces';
import { Modal, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { AddTaskScreen } from './addTask';
import { formatTaskTime } from '../helpers';
import { theme } from '~/theme/theme';

export const TaskDetail = ({
  task,
  detailDescription,
  disposeModalHandler,
  value,
}: {
  disposeModalHandler: () => void;
  detailDescription?: string;
  task: ITask;
  value: boolean;
}) => {
  const [editTask, seteditTask] = useState(false);

  return (
    <View style={styles.container}>
      {/* Drag indicator */}
      <View style={styles.dragIndicator} />

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
        {task.category && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Category</Text>
            <Text style={styles.sectionValue}>{task.category}</Text>
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
          <Text style={styles.sectionValue}>{task.isCompleted ? 'Completed' : 'Pending'}</Text>
        </View>

        {/* Date Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Date</Text>
          <Text style={styles.sectionValue}>{new Date(task.date).toLocaleDateString()}</Text>
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
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
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
