import { useCallback } from 'react';
import { collection, addDoc, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task, PriorityLevel } from '@/types/task';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for task CRUD operations
 * Handles create, update, delete, and toggle operations
 */
export const useTaskOperations = () => {
  const { user } = useAuth();

  const getPriorityLevel = useCallback((priority: PriorityLevel): number => {
    if (priority === 'high') return 3;
    if (priority === 'medium') return 2;
    if (priority === 'low') return 1;
    return 0;
  }, []);

  const addTask = useCallback(async (
    taskData: Omit<Task, 'id' | 'createdAt' | 'userId' | 'completed'>
  ) => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    const isGroupTask = !!taskData.groupId;
    
    let taskRef;
    if (isGroupTask && taskData.groupId) {
      taskRef = collection(db, 'groups', taskData.groupId, 'tasks');
    } else {
      taskRef = collection(db, 'userSyncData', user.uid, 'tasks');
    }

    const taskToAdd: any = {
      title: taskData.title,
      description: taskData.description || '',
      userId: user.uid,
      isCompleted: 0,
      isCompletedToday: 0,
      isPriority: 0,
      isDeleted: 0,
      isGroupTask: isGroupTask ? 1 : 0,
      isPaused: 0,
      isRecurrenceOrigin: 1,
      focusTimerEnabled: (taskData.focusTimerEnabled === true) ? 1 : 0,
      focusTimerIsRunning: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: taskData.dueDate || null,
      reminder: taskData.reminder || null,
      reminderUtc: taskData.reminderUtc || null,
      priorityLevel: getPriorityLevel(taskData.priorityLevel || 'none'),
      groupId: taskData.groupId || null,
      recurrenceType: taskData.recurrenceType || 'none',
      subtasks: taskData.subtasks || null,
      categoryId: taskData.categoryId || null,
      tags: taskData.tags || null,
      color: taskData.color || null,
      colorIndex: taskData.colorIndex || 0,
      recurrenceFrequency: taskData.recurrenceFrequency || null,
      completedCount: 0,
      groupMembers: taskData.groupMembers || [],
      groupOwnerId: taskData.groupOwnerId || user.uid,
      position: 0,
      repeat: null,
      deletedAt: null,
      lastCompleted: null,
      lastCompletedDate: null,
      nextDueDate: null,
      timeWindowStart: taskData.timeWindowStart || null,
      timeWindowEnd: taskData.timeWindowEnd || null,
      focusDurationMinutes: (taskData.focusTimerEnabled === true && taskData.focusDurationMinutes) ? taskData.focusDurationMinutes : null,
      focusTimerStartTime: null,
      focusTimerRemainingSeconds: null,
    };

    console.log('Adding task with focus timer:', {
      focusTimerEnabled: taskToAdd.focusTimerEnabled,
      focusDurationMinutes: taskToAdd.focusDurationMinutes,
      fromTaskData: {
        focusTimerEnabled: taskData.focusTimerEnabled,
        focusDurationMinutes: taskData.focusDurationMinutes,
      }
    });
    
    const docRef = await addDoc(taskRef, taskToAdd);
    console.log(`Task added with ID: ${docRef.id} (group: ${isGroupTask})`);
    
    return docRef.id;
  }, [user, getPriorityLevel]);

  const updateTask = useCallback(async (
    id: string,
    updates: Partial<Task>,
    task: Task
  ) => {
    if (!user) return;

    // Determine which collection the task is in
    // Use isGroupTask if available, otherwise check groupId
    const isGroupTask = task.isGroupTask || (task.groupId && task.groupId.trim() !== '');
    
    let taskRef;
    if (isGroupTask && task.groupId) {
      taskRef = doc(db, 'groups', task.groupId, 'tasks', id);
    } else {
      taskRef = doc(db, 'userSyncData', user.uid, 'tasks', id);
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    // Always reset fcmNotificationSent to false when task is updated
    // This ensures notifications are sent again if reminder time changes
    updateData.fcmNotificationSent = false;
    updateData.fcmSentAt = null;

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description || '';
    if (updates.dueDate !== undefined) updateData.dueDate = updates.dueDate;
    if (updates.reminder !== undefined) updateData.reminder = updates.reminder;
    if (updates.reminderUtc !== undefined) updateData.reminderUtc = updates.reminderUtc;
    if (updates.isCompleted !== undefined) updateData.isCompleted = updates.isCompleted ? 1 : 0;
    if (updates.priorityLevel !== undefined) updateData.priorityLevel = getPriorityLevel(updates.priorityLevel);
    if (updates.recurrenceType !== undefined) updateData.recurrenceType = updates.recurrenceType;
    if (updates.subtasks !== undefined) updateData.subtasks = updates.subtasks;
    if (updates.categoryId !== undefined) updateData.categoryId = updates.categoryId;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.colorIndex !== undefined) updateData.colorIndex = updates.colorIndex;
    if (updates.groupId !== undefined) updateData.groupId = updates.groupId;
    if (updates.groupMembers !== undefined) updateData.groupMembers = updates.groupMembers;
    if (updates.groupOwnerId !== undefined) updateData.groupOwnerId = updates.groupOwnerId;
    if (updates.isGroupTask !== undefined) updateData.isGroupTask = updates.isGroupTask ? 1 : 0;
    if (updates.isPaused !== undefined) updateData.isPaused = updates.isPaused ? 1 : 0;
    if (updates.isCompletedToday !== undefined) updateData.isCompletedToday = updates.isCompletedToday ? 1 : 0;
    if (updates.recurrenceFrequency !== undefined) updateData.recurrenceFrequency = updates.recurrenceFrequency;
    if (updates.completedCount !== undefined) updateData.completedCount = updates.completedCount;
    if (updates.lastCompletedDate !== undefined) updateData.lastCompletedDate = updates.lastCompletedDate;
    if (updates.timeWindowStart !== undefined) updateData.timeWindowStart = updates.timeWindowStart || null;
    if (updates.timeWindowEnd !== undefined) updateData.timeWindowEnd = updates.timeWindowEnd || null;
    
    // Focus timer fields - matching Flutter's toMap() format (0/1 for booleans)
    if (updates.focusTimerEnabled !== undefined) {
      updateData.focusTimerEnabled = (updates.focusTimerEnabled === true) ? 1 : 0;
    }
    if (updates.focusDurationMinutes !== undefined) {
      // Set to null if focusTimerEnabled is false, otherwise use the provided value
      const shouldEnable = updates.focusTimerEnabled !== undefined 
        ? updates.focusTimerEnabled 
        : task.focusTimerEnabled;
      updateData.focusDurationMinutes = shouldEnable ? (updates.focusDurationMinutes || null) : null;
    }
    if (updates.focusTimerStartTime !== undefined) {
      updateData.focusTimerStartTime = updates.focusTimerStartTime || null;
    }
    if (updates.focusTimerIsRunning !== undefined) {
      updateData.focusTimerIsRunning = (updates.focusTimerIsRunning === true) ? 1 : 0;
    }
    if (updates.focusTimerRemainingSeconds !== undefined) {
      updateData.focusTimerRemainingSeconds = updates.focusTimerRemainingSeconds || null;
    }

    console.log('Updating task with focus timer:', {
      taskId: id,
      isGroupTask: isGroupTask,
      groupId: task.groupId,
      focusTimerEnabled: updateData.focusTimerEnabled,
      focusDurationMinutes: updateData.focusDurationMinutes,
      fromUpdates: {
        focusTimerEnabled: updates.focusTimerEnabled,
        focusDurationMinutes: updates.focusDurationMinutes,
      }
    });

    try {
      await updateDoc(taskRef, updateData);
      console.log('Task updated successfully');
    } catch (error: any) {
      // If update fails and it's a group task, try personal collection as fallback
      if (isGroupTask && task.groupId && error?.code === 'not-found') {
        console.warn(`Task not found in group collection, trying personal collection: ${id}`);
        const personalTaskRef = doc(db, 'userSyncData', user.uid, 'tasks', id);
        try {
          await updateDoc(personalTaskRef, updateData);
          console.log('Task updated successfully in personal collection');
        } catch (fallbackError) {
          console.error('Error updating task in personal collection:', fallbackError);
          throw fallbackError;
        }
      } else {
        console.error('Error updating task:', error);
        throw error;
      }
    }
  }, [user, getPriorityLevel]);

  const deleteTask = useCallback(async (task: Task) => {
    if (!user) return;

    let taskRef;
    if (task.groupId) {
      // For group tasks: Hard delete (matching Flutter's deleteGroupTask behavior)
      taskRef = doc(db, 'groups', task.groupId, 'tasks', task.id!);
      await deleteDoc(taskRef);
      console.log(`Group task ${task.id} permanently deleted from group ${task.groupId}`);
    } else {
      // For personal tasks: Soft delete (mark as deleted for sync purposes)
      taskRef = doc(db, 'userSyncData', user.uid, 'tasks', task.id!);
      await updateDoc(taskRef, {
        isDeleted: 1,
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`Personal task ${task.id} marked as deleted`);
    }
  }, [user]);

  return {
    addTask,
    updateTask,
    deleteTask,
  };
};

