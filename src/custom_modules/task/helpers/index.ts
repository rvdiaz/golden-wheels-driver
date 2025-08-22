import { TaskCategory, TaskPriority } from '../interfaces';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const TASK_CATEGORY_OPTIONS = Object.values(TaskCategory).map((value) => ({
  label: capitalize(value),
  value,
}));

export const TASK_PRIORITY_OPTIONS = Object.values(TaskPriority).map((value) => ({
  label: capitalize(value),
  value,
}));

export const getPriorityColor = (selectedPriority: string) => {
  switch (selectedPriority) {
    case 'high':
      return '#EF4444';
    case 'medium':
      return '#F59E0B';
    case 'low':
      return '#10B981';
    default:
      return '#6B7280';
  }
};
