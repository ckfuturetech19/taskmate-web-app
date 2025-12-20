import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task } from '@/types/task';
import { parseTaskFromFirebase, getActiveTasks, deduplicateTasks } from '@/lib/taskUtils';

/**
 * Hook for managing personal task data
 * Handles real-time sync from userSyncData collection
 */
export const useTaskData = (userId: string | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Setting up personal task listener for user:', userId);
      const tasksRef = collection(db, 'userSyncData', userId, 'tasks');
      
      const unsubscribe = onSnapshot(
        tasksRef,
        (snapshot) => {
          try {
            console.log('=== Personal tasks snapshot received ===');
            console.log('Total documents:', snapshot.docs.length);
            
            const fetchedTasks: Task[] = snapshot.docs.map(doc => {
              const data = doc.data();
              // Personal tasks - explicitly mark as NOT from group collection
              return parseTaskFromFirebase(doc.id, data, userId, false);
            });

            // Filter out deleted tasks and deduplicate
            const activeTasks = getActiveTasks(fetchedTasks);
            
            console.log('Active personal tasks:', activeTasks.length);
            console.log('Completed:', activeTasks.filter(t => t.isCompleted).length);
            console.log('Pending:', activeTasks.filter(t => !t.isCompleted).length);
            
            setTasks(activeTasks);
            setError(null);
            setIsLoading(false);
          } catch (err) {
            console.error('Error processing personal tasks snapshot:', err);
            setError(err as Error);
            setTasks([]);
            setIsLoading(false);
          }
        },
        (err) => {
          console.error('Error fetching personal tasks:', err);
          setError(err as Error);
          setTasks([]);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up personal task listener:', err);
      setError(err as Error);
      setIsLoading(false);
    }
  }, [userId]);

  return { tasks, isLoading, error };
};

