import { Task, PriorityLevel, RecurrenceType } from '@/types/task';

// Re-export for convenience
export type { Task, PriorityLevel, RecurrenceType };

/**
 * Utility functions for task data parsing and filtering
 * Centralized logic for consistent task handling across the app
 */

/**
 * Parse boolean value from Firebase (handles number, boolean, string formats)
 */
export const parseBool = (value: any): boolean => {
  if (value == null) return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1; // Fixed: Only 1 is true, 0 is false
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === '1' || lower === 'yes';
  }
  return false;
};

/**
 * Parse date field from Firebase (handles Timestamp, string, number formats)
 */
export const parseDate = (field: any): string | undefined => {
  if (!field) return undefined;
  
  try {
    // Handle Firestore Timestamp
    if (field.toDate && typeof field.toDate === 'function') {
      return field.toDate().toISOString();
    }
    
    // Handle string dates
    if (typeof field === 'string') {
      const date = new Date(field);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
      return undefined;
    }
    
    // Handle number (timestamp in milliseconds)
    if (typeof field === 'number') {
      const date = new Date(field);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
      return undefined;
    }
    
    return undefined;
  } catch (error) {
    console.error('Error parsing date:', error, field);
    return undefined;
  }
};

/**
 * Convert priority level from Firebase format to PriorityLevel type
 */
export const parsePriorityLevel = (level: any): PriorityLevel => {
  if (level === 3 || level === 'high') return 'high';
  if (level === 2 || level === 'medium') return 'medium';
  if (level === 1 || level === 'low') return 'low';
  return 'none';
};

/**
 * Parse task from Firebase document data
 */
export const parseTaskFromFirebase = (
  docId: string,
  data: any,
  userId: string,
  isFromGroupCollection: boolean = false
): Task => {
  const isCompleted = parseBool(data.isCompleted) || parseBool(data.completed);
  const isDeleted = parseBool(data.isDeleted);
  
  // Check if groupId is valid (non-empty string, not "null" or "undefined")
  const hasValidGroupId = data.groupId && 
                          typeof data.groupId === 'string' && 
                          data.groupId.trim() !== '' &&
                          data.groupId !== 'null' &&
                          data.groupId !== 'undefined';
  
  // Determine if this is a group task:
  // - If from group collection, it's always a group task
  // - If from personal collection, only mark as group task if explicitly set AND has valid groupId
  // - This prevents personal tasks from being incorrectly marked as group tasks
  let isGroupTask = false;
  if (isFromGroupCollection) {
    // Tasks from groups collection are always group tasks
    isGroupTask = true;
  } else {
    // Tasks from personal collection: only if explicitly marked AND has valid groupId
    // This handles edge cases where personal tasks might have groupId set incorrectly
    const explicitIsGroupTask = parseBool(data.isGroupTask);
    isGroupTask = explicitIsGroupTask && hasValidGroupId;
    
    // Debug log if personal task has groupId but shouldn't be group task
    if (data.groupId && !isGroupTask) {
      console.log(`[TaskUtils] Personal task ${docId} has groupId (${data.groupId}) but isGroupTask=${explicitIsGroupTask}, marking as personal task`);
    }
  }

  return {
    id: docId,
    title: data.title || '',
    description: data.description || undefined,
    isCompleted: isCompleted,
    isCompletedToday: parseBool(data.isCompletedToday),
    userId: data.userId || userId,
    createdAt: parseDate(data.createdAt) || new Date().toISOString(),
    updatedAt: parseDate(data.updatedAt),
    dueDate: parseDate(data.dueDate),
    reminder: parseDate(data.reminder),
    reminderUtc: parseDate(data.reminderUtc),
    lastCompletedDate: parseDate(data.lastCompletedDate),
    priorityLevel: parsePriorityLevel(data.priorityLevel),
    groupId: hasValidGroupId ? data.groupId : undefined,
    recurrenceType: (data.recurrenceType || data.recurrence || 'none') as RecurrenceType,
    subtasks: data.subtasks || undefined,
    categoryId: data.categoryId || undefined,
    tags: data.tags || undefined,
    color: data.color || undefined,
    colorIndex: data.colorIndex || 0,
    recurrenceFrequency: data.recurrenceFrequency || undefined,
    recurrence: data.recurrence || undefined,
    isPaused: parseBool(data.isPaused),
    completedCount: data.completedCount || 0,
    isGroupTask: isGroupTask,
    groupMembers: data.groupMembers || undefined,
    groupOwnerId: data.groupOwnerId || undefined,
    isDeleted: isDeleted,
    // Focus timer fields
    focusTimerEnabled: parseBool(data.focusTimerEnabled),
    focusDurationMinutes: data.focusDurationMinutes ? parseInt(data.focusDurationMinutes, 10) : undefined,
    focusTimerStartTime: parseDate(data.focusTimerStartTime),
    focusTimerIsRunning: parseBool(data.focusTimerIsRunning),
    focusTimerRemainingSeconds: data.focusTimerRemainingSeconds ? parseInt(data.focusTimerRemainingSeconds, 10) : undefined,
  };
};

/**
 * Filter out deleted tasks and return only active tasks
 */
export const filterActiveTasks = (tasks: Task[]): Task[] => {
  if (!Array.isArray(tasks)) return [];
  return tasks.filter(task => task && !task.isDeleted);
};

/**
 * Deduplicate tasks by ID (keeps the most recent version)
 */
export const deduplicateTasks = (tasks: Task[]): Task[] => {
  if (!Array.isArray(tasks)) return [];
  const taskMap = new Map<string, Task>();
  
  tasks.forEach(task => {
    if (!task.id) return;
    
    const existing = taskMap.get(task.id);
    if (!existing) {
      taskMap.set(task.id, task);
    } else {
      // Keep the task with the most recent updatedAt
      const existingDate = existing.updatedAt ? new Date(existing.updatedAt) : new Date(0);
      const currentDate = task.updatedAt ? new Date(task.updatedAt) : new Date(0);
      
      if (currentDate > existingDate) {
        taskMap.set(task.id, task);
      }
    }
  });
  
  return Array.from(taskMap.values());
};

/**
 * Get active tasks (non-deleted) with deduplication
 */
export const getActiveTasks = (tasks: Task[]): Task[] => {
  const active = filterActiveTasks(tasks);
  return deduplicateTasks(active);
};

/**
 * Separate tasks into personal and group tasks
 */
export const separateTasksByType = (tasks: Task[]): {
  personalTasks: Task[];
  groupTasks: Task[];
} => {
  const activeTasks = getActiveTasks(tasks);
  
  return {
    personalTasks: activeTasks.filter(task => !task.groupId && !task.isGroupTask),
    groupTasks: activeTasks.filter(task => task.groupId || task.isGroupTask),
  };
};

