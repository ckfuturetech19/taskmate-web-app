import { useCallback } from 'react';
import { Task } from '@/types/task';

/**
 * Hook for handling recurrence task logic
 * Prevents creating duplicate recurrence instances
 */
export const useRecurrence = (addTaskFn: (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => Promise<string | void>) => {

  const calculateNextDueDate = useCallback((task: Task): Date | null => {
    if (!task.dueDate || !task.recurrenceType || task.recurrenceType === 'none') {
      return null;
    }

    const currentDueDate = new Date(task.dueDate);

    switch (task.recurrenceType) {
      case 'daily':
        return new Date(currentDueDate.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(currentDueDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        const nextMonth = new Date(currentDueDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
      default:
        return null;
    }
  }, []);

  const calculateNextReminder = useCallback((
    task: Task,
    nextDueDate: Date,
    isUtc: boolean = false
  ): string | undefined => {
    if (!task.reminder || !task.dueDate) return undefined;

    const originalReminder = new Date(task.reminder);
    const originalDueDate = new Date(task.dueDate);
    const timeDiff = originalDueDate.getTime() - originalReminder.getTime();
    const nextReminder = new Date(nextDueDate.getTime() - timeDiff);

    if (nextReminder < new Date()) {
      nextReminder.setTime(nextDueDate.getTime() - 60 * 60 * 1000);
    }

    return nextReminder.toISOString();
  }, []);

  const createNextRecurrence = useCallback(async (
    completedTask: Task,
    allTasks: Task[]
  ): Promise<boolean> => {
    if (!completedTask.recurrenceType || completedTask.recurrenceType === 'none') {
      return false;
    }

    const nextDueDate = calculateNextDueDate(completedTask);
    if (!nextDueDate) {
      console.log('No next due date found for task:', completedTask.title);
      return false;
    }

    const nextDueDateStr = nextDueDate.toISOString().split('T')[0];

    // Check if next instance already exists
    const existingNextTask = allTasks.find(t =>
      t.id !== completedTask.id &&
      t.title === completedTask.title &&
      t.recurrenceType === completedTask.recurrenceType &&
      t.dueDate &&
      t.dueDate.split('T')[0] === nextDueDateStr &&
      !t.isCompleted &&
      !t.isDeleted
    );

    if (existingNextTask) {
      console.log('Next recurrence already exists for task:', completedTask.title, 'on', nextDueDateStr);
      return false;
    }

    // Create next recurrence instance
    const nextTask: Omit<Task, 'id' | 'createdAt' | 'userId'> = {
      title: completedTask.title,
      description: completedTask.description,
      dueDate: nextDueDate.toISOString(),
      reminder: completedTask.reminder ? calculateNextReminder(completedTask, nextDueDate) : undefined,
      reminderUtc: completedTask.reminderUtc ? calculateNextReminder(completedTask, nextDueDate, true) : undefined,
      priorityLevel: completedTask.priorityLevel || 'none',
      recurrenceType: completedTask.recurrenceType,
      recurrenceFrequency: completedTask.recurrenceFrequency,
      recurrence: completedTask.recurrence,
      categoryId: completedTask.categoryId,
      color: completedTask.color,
      colorIndex: completedTask.colorIndex || 0,
      tags: completedTask.tags,
      subtasks: completedTask.subtasks?.map(st => ({ ...st, completed: false })),
      groupId: completedTask.groupId,
      groupMembers: completedTask.groupMembers,
      groupOwnerId: completedTask.groupOwnerId,
      isGroupTask: completedTask.isGroupTask,
      isRecurrenceOrigin: true,
    };

    const result = await addTaskFn(nextTask);
    console.log('Created next recurrence for task:', completedTask.title, 'due on', nextDueDateStr, 'ID:', result);
    return true;
  }, [addTaskFn, calculateNextDueDate, calculateNextReminder]);

  return {
    calculateNextDueDate,
    calculateNextReminder,
    createNextRecurrence,
  };
};

