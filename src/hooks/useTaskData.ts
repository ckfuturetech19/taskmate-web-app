import { useState, useEffect, useCallback } from 'react';
import api from '@/services/apiService';
import { socketService } from '@/services/socketService';
import { Task } from '@/types/task';

export const useTaskData = (userId: string | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    fetchTasks();

    // Setup Socket.io for real-time updates
    socketService.initialize();
    socketService.joinUserRoom(userId);
    
    const handleUpdate = (data: any) => {
      console.log('📡 Socket.io: Real-time task update received:', data);
      fetchTasks();
    };

    socketService.on('task-added', handleUpdate);
    socketService.on('task-updated', handleUpdate);
    socketService.on('task-deleted', handleUpdate);

    return () => {
      socketService.off('task-added', handleUpdate);
      socketService.off('task-updated', handleUpdate);
      socketService.off('task-deleted', handleUpdate);
    };
  }, [userId, fetchTasks]);

  return { tasks, isLoading, error, refresh: fetchTasks };
};
