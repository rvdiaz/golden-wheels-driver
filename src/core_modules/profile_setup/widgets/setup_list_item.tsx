import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import * as Icons from 'lucide-react-native';
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { theme } from '~/theme/theme';
import { ProgressRing } from './ring_status_circle';
import { IProfileTask } from '~/system_setting/interfaces';

interface SetupItemProps {
  task: IProfileTask;
  onPress: () => void;
}

export const SetupItem = ({ task, onPress }: SetupItemProps) => {
  const user = useReactiveVar(userData);
  const userStepsCompleted = user?.profileSteps ?? [];

  const taskProgress = userStepsCompleted.find((it) => it.id === task.id);
  const completedSubSteps = taskProgress?.subSteps || [];

  // Check if all subitems are completed
  const allSubitemsCompleted =
    task.subitems.length > 0 &&
    task.subitems.every((subitem) => completedSubSteps.includes(subitem.id));

  const isCompleted = !!taskProgress && allSubitemsCompleted;

  return (
    <Card style={[styles.card, isCompleted && styles.cardCompleted]}>
      <TouchableOpacity style={styles.content} onPress={onPress}>
        {/* Circle with fraction format */}
        <ProgressRing
          completedSteps={completedSubSteps.length}
          totalSteps={task.subitems.length}
          size={45}
          strokeWidth={2}
          gradientColors={['#6366F1', theme.colors.primary]}
          backgroundColor="#C7D2FE"
          showStatusText={false}
          numberStyle={{
            fontSize: 15,
          }}
          numberCompleteStyle={{
            fontSize: 12,
          }}
        />

        <View style={styles.itemInfo}>
          {/* Title with dashed line on top if completed */}
          <Text style={[styles.title, isCompleted && styles.titleCompleted]}>{task.title}</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>

        {isCompleted ? (
          <View style={styles.completedCheck}>
            <Icons.Check size={16} color="#FFFFFF" />
          </View>
        ) : (
          <Icons.ChevronRight size={20} color={theme.colors.primary} />
        )}
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: 'transparent',
    elevation: 0,
  },
  cardCompleted: {
    borderColor: theme.colors.primary,
    backgroundColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    position: 'relative',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
  },
  completedCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
});
