import moment from 'moment';
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
