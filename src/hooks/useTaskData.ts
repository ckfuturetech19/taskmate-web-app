import { useState, useEffect, useCallback } from 'react';
import api from '@/services/apiService';
import { pusherService } from '@/services/pusherService';
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

    // Setup Pusher for real-time updates
    const channel = pusherService.subscribeToUser(userId);
    
    const handleUpdate = () => {
      console.log('Real-time task update received via Pusher');
      fetchTasks();
    };

    channel.bind('task-added', handleUpdate);
    channel.bind('task-updated', handleUpdate);
    channel.bind('task-deleted', handleUpdate);

    return () => {
      channel.unbind_all();
      // We don't necessarily want to unsubscribe here if other hooks use the same channel
      // But Pusher manages multiple listeners on one channel internally
    };
  }, [userId, fetchTasks]);

  return { tasks, isLoading, error, refresh: fetchTasks };
};

