import moment from 'moment';
import { ITask, TaskPriority, TaskSource } from '../interfaces';
import { ITaskSchemaItem } from '~/system_setting/interfaces';
import { CalendarIcon, CheckIcon, ClockIcon, Hourglass, TriangleAlert } from 'lucide-react-native';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const TASK_PRIORITY_OPTIONS = Object.values(TaskPriority).map((value) => ({
  label: capitalize(value),
  value,
}));

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

export const getTaskStatus = (task: ITask): { key: string; label: string } => {
  const now = moment();
  const taskDate = task.date;
  const taskStartTime = moment(`${taskDate} ${task.startTime}`, 'YYYY-MM-DD HH:mm');
  const taskEndTime = moment(`${taskDate} ${task.endTime}`, 'YYYY-MM-DD HH:mm');

  if (task.isCompleted) {
    return { key: 'complete', label: 'Completed' };
  }

  if (taskEndTime.isBefore(now)) {
    return { key: 'expired', label: 'Expired' };
  }

  if (taskStartTime.isSameOrBefore(now) && taskEndTime.isSameOrAfter(now)) {
    return { key: 'inProgress', label: 'In Progress' };
  }

  if (taskStartTime.isAfter(now)) {
    if (taskStartTime.isSame(now, 'day')) {
      return { key: 'pending', label: 'Pending' };
    } else {
      return { key: 'schedule', label: 'Scheduled' };
    }
  }

  return { key: 'unknown', label: 'Unknown' };
};

export const getTaskColorByType = (status: string) => {
  switch (status) {
    case 'inProgress':
      return '#F59E0B'; // amber
    case 'expired':
      return '#DC2626'; // red
    case 'complete':
      return '#22C55E'; // green
    case 'schedule':
      return '#06B6D4'; // cyan
    case 'pending':
      return '#3B82F6'; // blue
    default:
      return '#E2E8F0'; // gray
  }
};

// Make sure to import the correct icons from your icon library
export const getTaskIconByType = (status: string) => {
  switch (status) {
    case 'inProgress':
      return <Hourglass color="#FFF" size={14} />;
    case 'expired':
      return <TriangleAlert color="#FFF" size={14} />;
    case 'complete':
      return <CheckIcon color="#FFF" size={14} />;
    case 'schedule':
      return <ClockIcon color="#FFF" size={14} />;
    case 'pending':
      return <CalendarIcon color="#FFF" size={14} />;
    default:
      return null;
  }
};

export const convertTimeStringToDate = (timeString: string, dateString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date(dateString);
  date.setHours(hours, minutes, 0, 0);
  return date;
};
