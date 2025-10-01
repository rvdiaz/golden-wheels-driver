import moment from 'moment';
import { ITask, TaskPriority, TaskSource } from '../interfaces';
import { ITaskSchemaItem } from '~/store/interface';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const TASK_PRIORITY_OPTIONS = Object.values(TaskPriority).map((value) => ({
  label: capitalize(value),
  value,
}));

export const getTaskColorByType = (type: string) => {
  switch (type) {
    case 'inProgress':
      return '#F59E0B ';
    case 'inComplete':
      return '#DC2626';
    case 'complete':
      return '#22C55E';
    default:
      return '#E2E8F0';
  }
};

export const getTaskColorByPriority = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.high:
      return '#F59E0B ';
    case TaskPriority.medium:
      return '#DC2626';
    case TaskPriority.low:
      return '#22C55E';
    default:
      return '#E2E8F0';
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
    const startA = moment(`${a.date} ${a.startTime}`, 'YYYY-MM-DD HH:mm');
    const startB = moment(`${b.date} ${b.startTime}`, 'YYYY-MM-DD HH:mm');

    if (!startA.isSame(startB)) {
      return startA.valueOf() - startB.valueOf(); // sort by start time
    }

    const endA = moment(`${a.date} ${a.endTime}`, 'YYYY-MM-DD HH:mm');
    const endB = moment(`${b.date} ${b.endTime}`, 'YYYY-MM-DD HH:mm');

    return endA.valueOf() - endB.valueOf(); // sort by end time if start times are equal
  });
};

export const getCustomTasks = (tasks: ITask[]): ITask[] => {
  const filteredTab = tasks.filter((tas) => tas.source === TaskSource.user);

  return sortTasks(filteredTab);
};

export const getActiveTasks = (allTasks: ITask[]) => {
  const now = moment();
  const activeTasks = sortTasks(
    allTasks.filter((task) => {
      if (!task.endTime || !task.date) return true; // keep if missing data

      const taskEnd = moment(`${task.date} ${task.endTime}`, 'YYYY-MM-DD HH:mm');

      return taskEnd.isAfter(now);
    })
  );
  return activeTasks;
};

export const isActiveTask = (task: ITask, gracePeriodMinutes: number = 15) => {
  const now = moment();
  if (!task.endTime || !task.date) return true; // keep if missing data

  const taskEnd = moment(`${task.date} ${task.endTime}`, 'YYYY-MM-DD HH:mm');
  const taskEndWithGrace = taskEnd.clone().add(gracePeriodMinutes, 'minutes');

  return taskEndWithGrace.isAfter(now);
};

export const getTaskConfigByKey = (task: ITask, taskConfigSchema: ITaskSchemaItem[]) => {
  const taskConfig = taskConfigSchema.find((cat) => cat.key === task.category);
  return taskConfig;
};

export const getTaskCategoriesOptions = (taskConfigSchema: ITaskSchemaItem[]) => {
  // Use a Map to avoid duplicate categoryKeys
  const map = new Map<string, string>();

  taskConfigSchema.forEach((task) => {
    if (!map.has(task.key)) {
      map.set(task.key, task.label);
    }
  });

  // Convert Map to array of { label, value }
  const res = Array.from(map.entries()).map(([value, label]) => ({
    label,
    value,
  }));

  return res;
};

export const getDurationInMinutes = (startTime: string, endTime: string): number => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;

  return endTotal - startTotal;
};

export const getTaskStatus = (task: ITask): string => {
  const now = new Date();
  const taskEndTime = new Date(task.endTime);
  const taskStartTime = new Date(task.startTime);
  const isActive = isActiveTask(task);

  // If task is completed
  if (task.isCompleted) {
    return 'complete';
  }

  // If task is incomplete and end time has passed
  if (!task.isCompleted && !isActive) {
    return 'inComplete';
  }

  // If task is currently in progress (between start and end time)
  if (taskStartTime <= now && taskEndTime >= now && !task.isCompleted) {
    return 'inProgress';
  }

  // For future tasks or based on source
  return task.source; // Returns 'user' or 'admin'
};
