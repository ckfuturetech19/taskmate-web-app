import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task, Group } from '@/types/task';
import { parseTaskFromFirebase, getActiveTasks } from '@/lib/taskUtils';

/**
 * Hook for managing group task data
 * Handles real-time sync from groups collection
 */
export const useGroupTasks = (userId: string | null, groups: Group[]) => {
  const [groupTasks, setGroupTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId || groups.length === 0) {
      setGroupTasks([]);
      setIsLoading(false);
      return;
    }

    console.log('Setting up group task listeners for', groups.length, 'groups');
    const unsubscribes: (() => void)[] = [];

    groups.forEach(group => {
      const groupTasksRef = collection(db, 'groups', group.id, 'tasks');

      const unsubGroupTasks = onSnapshot(
        groupTasksRef,
        (tasksSnapshot) => {
          try {
            console.log(`Group ${group.id} tasks snapshot:`, tasksSnapshot.docs.length, 'tasks');
            
            const fetchedGroupTasks: Task[] = tasksSnapshot.docs.map(doc => {
              const data = doc.data();
              // Group tasks - explicitly mark as from group collection
              return parseTaskFromFirebase(doc.id, data, userId, true);
            });

            // Filter out deleted tasks
            const activeGroupTasks = getActiveTasks(fetchedGroupTasks);

            setGroupTasks(prevTasks => {
              // Remove old tasks for this group
              const filtered = prevTasks.filter(t => t.groupId !== group.id);
              // Add new active group tasks (already filtered for deleted)
              const updated = [...filtered, ...activeGroupTasks];
              
              // Final deduplication and filter deleted tasks across all groups
              const uniqueTasks = updated
                .filter((task, index, self) =>
                  index === self.findIndex(t => t.id === task.id)
                )
                .filter(task => !task.isDeleted); // Extra safety check
              
              console.log(`Updated group ${group.id} tasks:`, activeGroupTasks.length, 'active tasks');
              console.log(`Total unique group tasks after deduplication:`, uniqueTasks.length);
              return uniqueTasks;
            });
            
            setError(null);
            setIsLoading(false);
          } catch (err) {
            console.error('Error processing group tasks snapshot:', err);
            setError(err as Error);
          }
        },
        (err) => {
          console.error('Error fetching group tasks:', err);
          setError(err as Error);
        }
      );

      unsubscribes.push(unsubGroupTasks);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [userId, groups]);

  return { groupTasks, isLoading, error };
};

