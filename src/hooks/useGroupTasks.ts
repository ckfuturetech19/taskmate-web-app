import { useState, useEffect, useCallback } from 'react';
import api from '@/services/apiService';
import { Task, Group } from '@/types/task';
import { socketService } from '@/services/socketService';

export const useGroupTasks = (userId: string | null, groups: Group[]) => {
  const [groupTasks, setGroupTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllGroupTasks = useCallback(async () => {
    if (!userId || groups.length === 0) {
      setGroupTasks([]);
      setIsLoading(false);
      return;
    }

    try {
      const allTasks: Task[] = [];
      await Promise.all(
        groups.map(async (group) => {
          try {
            const response = await api.get(`/groups/${group.id}/tasks`);
            if (Array.isArray(response.data)) {
              allTasks.push(...response.data);
            } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.tasks)) {
              allTasks.push(...response.data.tasks);
            } else {
              console.error(`API /groups/${group.id}/tasks did not return an array:`, response.data);
            }
          } catch (err) {
            console.error(`Error fetching tasks for group ${group.id}:`, err);
          }
        })
      );
      setGroupTasks(allTasks);
      setError(null);
    } catch (err) {
      console.error('Error fetching group tasks:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, groups]);

  useEffect(() => {
    fetchAllGroupTasks();

    if (userId && groups.length > 0) {
      // 1. Join each group's Socket.io room
      groups.forEach(group => {
        socketService.joinGroupRoom(group.id);
      });

      const handleGroupUpdate = (data: any) => {
        console.log('📡 Socket.io: Group update received:', data);
        fetchAllGroupTasks();
      };

      // 2. Listen for task events (these come via the group room)
      socketService.on('task-added', handleGroupUpdate);
      socketService.on('task-updated', handleGroupUpdate);
      socketService.on('task-deleted', handleGroupUpdate);

      // 3. Also join personal room for updates that might affect groups
      socketService.joinUserRoom(userId);

      return () => {
        socketService.off('task-added', handleGroupUpdate);
        socketService.off('task-updated', handleGroupUpdate);
        socketService.off('task-deleted', handleGroupUpdate);
      };
    }
  }, [userId, groups, fetchAllGroupTasks]);

  return { groupTasks, isLoading, error, refresh: fetchAllGroupTasks };
};

