import { useCallback } from 'react';
import api from '@/services/apiService';
import { Task, PriorityLevel } from '@/types/task';
import { useAuth } from '@/contexts/AuthContext';

export const useTaskOperations = () => {
  const { user } = useAuth();

  const getPriorityLevel = useCallback((priority: PriorityLevel): number => {
    if (priority === 'high') return 3;
    if (priority === 'medium') return 2;
    if (priority === 'low') return 1;
    return 0;
  }, []);

  const addTask = useCallback(async (
    taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>
  ) => {
    if (!user) throw new Error('User must be logged in');

    const payload = {
      ...taskData,
      isCompleted: taskData.isCompleted ? 1 : 0,
      isPriority: taskData.isPriority ? 1 : 0,
      isGroupTask: taskData.isGroupTask ? 1 : 0,
      focusTimerEnabled: taskData.focusTimerEnabled ? 1 : 0,
      priorityLevel: getPriorityLevel(taskData.priorityLevel || 'none'),
      reminderUtc: taskData.reminder ? new Date(taskData.reminder).toISOString() : undefined,
    };

    // Use group task endpoint if groupId is present
    const endpoint = taskData.groupId ? '/groups/tasks' : '/tasks';
    const response = await api.post(endpoint, payload);
    return response.data.id;
  }, [user, getPriorityLevel]);

  const updateTask = useCallback(async (
    id: string,
    updates: Partial<Task>,
    task: Task
  ) => {
    if (!user) return;

    const payload: any = { ...updates };
    
    // Map booleans to numbers for backend
    if (updates.isCompleted !== undefined) payload.isCompleted = updates.isCompleted ? 1 : 0;
    if (updates.isPriority !== undefined) payload.isPriority = updates.isPriority ? 1 : 0;
    if (updates.focusTimerEnabled !== undefined) payload.focusTimerEnabled = updates.focusTimerEnabled ? 1 : 0;
    if (updates.focusTimerIsRunning !== undefined) payload.focusTimerIsRunning = updates.focusTimerIsRunning ? 1 : 0;
    if (updates.priorityLevel !== undefined) payload.priorityLevel = getPriorityLevel(updates.priorityLevel);
    if (updates.reminder !== undefined) {
      payload.reminderUtc = updates.reminder ? new Date(updates.reminder).toISOString() : null;
    }

    // Use group task endpoint if it's a group task
    const endpoint = task.groupId ? `/groups/tasks/${id}` : `/tasks/${id}`;
    await api.put(endpoint, payload);
  }, [user, getPriorityLevel]);

  const deleteTask = useCallback(async (task: Task) => {
    if (!user || !task.id) return;
    
    // Use group task endpoint if it's a group task
    const endpoint = task.groupId ? `/groups/tasks/${task.id}` : `/tasks/${task.id}`;
    await api.delete(endpoint);
  }, [user]);

  return {
    addTask,
    updateTask,
    deleteTask,
  };
};

