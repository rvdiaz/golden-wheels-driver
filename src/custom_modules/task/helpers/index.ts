import { ITask, TaskCategory, TaskPriority, TaskSource } from '../interfaces';

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

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Marketing':
      return '#2563EB';
    case 'Lead Generation':
      return '#DC2626';
    case 'Relationship Building':
      return '#059669';
    default:
      return '#6B7280';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return { backgroundColor: '#FEE2E2', color: '#991B1B', borderColor: '#FECACA' };
    case 'medium':
      return { backgroundColor: '#FEF3C7', color: '#92400E', borderColor: '#FDE68A' };
    case 'low':
      return { backgroundColor: '#D1FAE5', color: '#065F46', borderColor: '#A7F3D0' };
    default:
      return { backgroundColor: '#F3F4F6', color: '#374151', borderColor: '#E5E7EB' };
  }
};

export const formatTaskDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const formatTaskTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const sortTasks = (tasks: ITask[]) => {
  return tasks.slice().sort((a, b) => {
    const startA = new Date(a.startTime).getTime();
    const startB = new Date(b.startTime).getTime();

    if (startA !== startB) {
      return startA - startB; // sort by start time
    }

    const endA = new Date(a.endTime).getTime();
    const endB = new Date(b.endTime).getTime();

    return endA - endB; // sort by end time if start times are equal
  });
};

export const getCustomTasks = (tasks: ITask[]): ITask[] => {
  const filteredTab = tasks.filter((tas) => tas.source === TaskSource.user);

  return sortTasks(filteredTab);
};
