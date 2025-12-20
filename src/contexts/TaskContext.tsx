import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot,
  query,
  where,
  Timestamp,
  getDocs,
  updateDoc,
  doc,
  deleteField,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task, Group, PriorityLevel } from '@/types/task';
import { useAuth } from './AuthContext';
import { useTaskData } from '@/hooks/useTaskData';
import { useGroupTasks } from '@/hooks/useGroupTasks';
import { useTaskOperations } from '@/hooks/useTaskOperations';
import { useRecurrence } from '@/hooks/useRecurrence';
import { deduplicateTasks, getActiveTasks } from '@/lib/taskUtils';
import { oneSignalService } from '@/services/oneSignalService';

interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  createdAt: string;
}

interface TaskContextType {
  tasks: Task[];
  groups: Group[];
  categories: Category[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId' | 'completed'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  createGroup: (name: string) => Promise<Group>;
  joinGroup: (inviteCode: string) => Promise<boolean>;
  leaveGroup: (groupId: string) => Promise<void>;
  getGroupTasks: (groupId: string) => Task[];
  getPersonalTasks: () => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

const generateInviteCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Use custom hooks for task data management
  const { tasks: personalTasks } = useTaskData(user?.uid || null);
  const { groupTasks } = useGroupTasks(user?.uid || null, groups);
  const { addTask: addTaskOperation, updateTask: updateTaskOperation, deleteTask: deleteTaskOperation } = useTaskOperations();
  const { createNextRecurrence } = useRecurrence(addTaskOperation);
  
  // Merge and deduplicate all tasks - ensure only active (non-deleted) tasks are shown
  const tasks = useMemo(() => {
    const allTasks = [...personalTasks, ...groupTasks];
    
    // First filter out deleted tasks explicitly
    const active = allTasks.filter(task => {
      const isDeleted = task.isDeleted === true;
      if (isDeleted) {
        console.log(`Filtering out deleted task: ${task.id} - ${task.title}`);
      }
      return !isDeleted;
    });
    
    // Then deduplicate by ID (keep most recent version)
    const deduplicated = deduplicateTasks(active);
    
    // Final safety check - filter deleted again (in case deduplication kept a deleted one)
    const finalTasks = deduplicated.filter(task => !task.isDeleted);
    
    console.log('=== Combined Tasks (Web) ===');
    console.log('Personal tasks (raw):', personalTasks.length);
    console.log('Group tasks (raw):', groupTasks.length);
    console.log('Total after merge:', allTasks.length);
    console.log('Active (non-deleted):', active.length);
    console.log('After deduplication:', deduplicated.length);
    console.log('Final active tasks:', finalTasks.length);
    if (finalTasks.length > 0) {
      console.log('Active task IDs:', finalTasks.map(t => `${t.id}: ${t.title}`).slice(0, 10));
    }
    
    return finalTasks;
  }, [personalTasks, groupTasks]);


  // Real-time sync for categories (global read-only)
  useEffect(() => {
    console.log('Setting up categories listener');
    const categoriesRef = collection(db, 'categories');
    
    const unsubscribe = onSnapshot(
      categoriesRef,
      (snapshot) => {
        try {
          const fetchedCategories: Category[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || '',
              color: data.color || undefined,
              icon: data.icon || undefined,
              createdAt: data.createdAt || new Date().toISOString(),
            };
          });
          console.log('Categories loaded:', fetchedCategories.length);
          setCategories(fetchedCategories);
        } catch (error) {
          console.error('Error processing categories:', error);
          setCategories([]);
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time sync for groups
  useEffect(() => {
    if (!user) {
      setGroups([]);
      return;
    }

    try {
      const groupsRef = collection(db, 'groups');
      // Query all groups and filter client-side since members is stored as object
      const unsubscribe = onSnapshot(
        groupsRef, 
        (snapshot) => {
          try {
            const fetchedGroups: Group[] = snapshot.docs
              .filter(doc => {
                const data = doc.data();
                // Check if user is in members object or is owner
                return (data.members && data.members[user.uid] === true) || data.ownerId === user.uid;
              })
              .map(doc => {
              const data = doc.data();
              let createdAt = new Date().toISOString();
              
              try {
                if (data.createdAt?.toDate) {
                  createdAt = data.createdAt.toDate().toISOString();
                } else if (data.createdAt) {
                  const date = new Date(data.createdAt);
                  if (!isNaN(date.getTime())) {
                    createdAt = date.toISOString();
                  }
                }
              } catch (error) {
                console.error('Error parsing group createdAt:', error);
              }
              
              return {
                id: doc.id,
                name: data.name || '',
                description: data.description || undefined,
                inviteCode: data.inviteCode || data.code || '',
                code: data.code || data.inviteCode || '',
                createdBy: data.createdBy || data.ownerId || '',
                ownerId: data.ownerId || data.createdBy || '',
                members: data.members || {},
                createdAt,
              } as Group;
            });
            setGroups(fetchedGroups);
          } catch (error) {
            console.error('Error processing groups snapshot:', error);
            setGroups([]);
          }
        },
        (error) => {
          console.error('Error fetching groups:', error);
          setGroups([]);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up groups listener:', error);
    }
  }, [user]);


  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'userId' | 'completed'>) => {
    if (!user) {
      throw new Error('User must be logged in');
    }
    
    try {
      const taskId = await addTaskOperation(taskData);
      
      // If it's a group task, notify all group members (including creator for consistency)
      if (taskData.groupId) {
        const group = groups.find(g => g.id === taskData.groupId);
        if (group) {
          // Notify ALL group members (matching Flutter app behavior)
          const allMembers = Object.keys(group.members || {});
          const actorName = user.displayName || user.email || 'Unknown User';
          
          // Save notifications to Firestore
          await Promise.all(
            allMembers.map(async (memberId) => {
              const notificationRef = collection(db, 'users', memberId, 'notifications');
              await addDoc(notificationRef, {
                type: 'task_created',
                title: 'New Task Created',
                message: `${actorName} created "${taskData.title}" in ${group.name}`,
                groupId: taskData.groupId,
                groupName: group.name,
                taskId: taskId,
                taskTitle: taskData.title,
                actorUserId: user.uid,
                actorName: actorName,
                read: false, // Match Flutter app format
                createdAt: Timestamp.now(),
                timestamp: Timestamp.now(),
              });
            })
          );

          // Send OneSignal push notifications
          await oneSignalService.sendNotificationToGroup({
            groupId: taskData.groupId,
            title: 'New Task Created',
            message: `${actorName} created "${taskData.title}" in ${group.name}`,
            type: 'task_created',
            taskId: taskId,
            targetMemberIds: allMembers,
          });
        }
      }
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;
    
    const task = tasks.find(t => t.id === id);
    if (!task) {
      console.error('Task not found:', id);
      return;
    }
    
    try {
      await updateTaskOperation(id, updates, task);
      
      // If it's a group task, notify all group members about updates
      if (task.groupId) {
        const group = groups.find(g => g.id === task.groupId);
        if (group) {
          // Notify ALL group members (matching Flutter app behavior)
          const allMembers = Object.keys(group.members || {});
          const actorName = user.displayName || user.email || 'Unknown User';
          
          // Determine notification type and message
          let notificationType = 'task_updated';
          let notificationTitle = 'Task Updated';
          let notificationMessage = `${actorName} updated "${task.title}" in ${group.name}`;
          
          if (updates.isCompleted !== undefined) {
            notificationType = updates.isCompleted ? 'task_completed' : 'task_updated';
            notificationTitle = updates.isCompleted ? 'Task Completed' : 'Task Updated';
            notificationMessage = updates.isCompleted
              ? `${actorName} completed "${task.title}" in ${group.name}`
              : `${actorName} updated "${task.title}" in ${group.name}`;
          }
          
          // Save notifications to Firestore
          await Promise.all(
            allMembers.map(async (memberId) => {
              const notificationRef = collection(db, 'users', memberId, 'notifications');
              await addDoc(notificationRef, {
                type: notificationType,
                title: notificationTitle,
                message: notificationMessage,
                groupId: task.groupId,
                groupName: group.name,
                taskId: id,
                taskTitle: task.title,
                actorUserId: user.uid,
                actorName: actorName,
                read: false, // Match Flutter app format
                createdAt: Timestamp.now(),
                timestamp: Timestamp.now(),
              });
            })
          );

          // Send OneSignal push notifications
          await oneSignalService.sendNotificationToGroup({
            groupId: task.groupId,
            title: notificationTitle,
            message: notificationMessage,
            type: notificationType,
            taskId: id,
            targetMemberIds: allMembers,
          });
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    
    const task = tasks.find(t => t.id === id);
    if (!task) {
      console.error('Task not found:', id);
      return;
    }
    
    // If it's a group task, notify all group members before deleting
    if (task.groupId) {
      const group = groups.find(g => g.id === task.groupId);
      if (group) {
        const allMembers = Object.keys(group.members || {});
        const actorName = user.displayName || user.email || 'Unknown User';
        
        // Save notifications to Firestore
        await Promise.all(
          allMembers.map(async (memberId) => {
            const notificationRef = collection(db, 'users', memberId, 'notifications');
            await addDoc(notificationRef, {
              type: 'task_deleted',
              title: 'Task Deleted',
              message: `${actorName} deleted "${task.title}" from ${group.name}`,
              groupId: task.groupId,
              groupName: group.name,
              taskId: id,
              taskTitle: task.title,
              actorUserId: user.uid,
              actorName: actorName,
              read: false, // Match Flutter app format
              createdAt: Timestamp.now(),
              timestamp: Timestamp.now(),
            });
          })
        );

        // Send OneSignal push notifications
        await oneSignalService.sendNotificationToGroup({
          groupId: task.groupId,
          title: 'Task Deleted',
          message: `${actorName} deleted "${task.title}" from ${group.name}`,
          type: 'task_deleted',
          taskId: id,
          targetMemberIds: allMembers,
        });
      }
    }
    
    await deleteTaskOperation(task);
  };

  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !user) return;
    
    const updates: Partial<Task> = { 
      isCompleted: !task.isCompleted,
    };
    
    // Set lastCompletedDate when marking as complete
    if (!task.isCompleted) {
      updates.lastCompletedDate = new Date().toISOString();
      
      // Handle recurrence task completion
      if (task.recurrenceType && task.recurrenceType !== 'none') {
        await createNextRecurrence(task, tasks);
      }
    }
    
    await updateTask(id, updates);
  };

  const createGroup = async (name: string): Promise<Group> => {
    if (!user) throw new Error('User must be logged in');
    
    const inviteCode = generateInviteCode();
    const groupsRef = collection(db, 'groups');
    const newGroup = {
      name,
      description: '', // Matching Flutter's Group model
      inviteCode,
      code: inviteCode, // Flutter uses 'code' field
      createdBy: user.uid,
      ownerId: user.uid,
      members: { [user.uid]: true },
      createdAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(groupsRef, newGroup);
    
    return {
      id: docRef.id,
      name,
      description: '',
      inviteCode,
      code: inviteCode,
      createdBy: user.uid,
      ownerId: user.uid,
      members: { [user.uid]: true },
      createdAt: new Date().toISOString(),
    };
  };

  const joinGroup = async (inviteCode: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Query Firebase for the group with this invite code (check both 'code' and 'inviteCode' fields)
      const groupsRef = collection(db, 'groups');
      const upperCode = inviteCode.toUpperCase();
      
      // Try inviteCode first (web format)
      let q = query(groupsRef, where('inviteCode', '==', upperCode));
      let querySnapshot = await getDocs(q);
      
      // If not found, try 'code' field (Flutter format)
      if (querySnapshot.empty) {
        q = query(groupsRef, where('code', '==', upperCode));
        querySnapshot = await getDocs(q);
      }
      
      if (querySnapshot.empty) {
        console.error('No group found with invite code:', inviteCode);
        return false;
      }
      
      const groupDoc = querySnapshot.docs[0];
      const groupData = groupDoc.data();
      
      // Check if user is already a member
      if (groupData.members && groupData.members[user.uid] === true) {
        console.log('User already a member of this group');
        return true;
      }
      
      // Add user to group members
      const groupRef = doc(db, 'groups', groupDoc.id);
      await updateDoc(groupRef, {
        [`members.${user.uid}`]: true
      });
      
      // Notify all group members about new member joining
      const allMembers = Object.keys(groupData.members || {});
      const actorName = user.displayName || user.email || 'Unknown User';
      
      // Save notifications to Firestore
      await Promise.all(
        allMembers.map(async (memberId) => {
          const notificationRef = collection(db, 'users', memberId, 'notifications');
          await addDoc(notificationRef, {
            type: 'member_joined',
            title: 'New Member Joined',
            message: `${actorName} joined ${groupData.name}`,
            groupId: groupDoc.id,
            groupName: groupData.name,
            actorUserId: user.uid,
            actorName: actorName,
            read: false, // Match Flutter app format
            createdAt: Timestamp.now(),
            timestamp: Timestamp.now(),
          });
        })
      );

      // Send OneSignal push notifications
      await oneSignalService.sendNotificationToGroup({
        groupId: groupDoc.id,
        title: 'New Member Joined',
        message: `${actorName} joined ${groupData.name}`,
        type: 'member_joined',
        targetMemberIds: allMembers,
      });
      
      console.log('Successfully joined group:', groupDoc.id);
      return true;
    } catch (error) {
      console.error('Error joining group:', error);
      return false;
    }
  };

  const getGroupTasks = (groupId: string): Task[] => {
    return tasks.filter(task => task.groupId === groupId);
  };

  const getPersonalTasks = (): Task[] => {
    if (!user) return [];
    // Personal tasks are those without a groupId OR where userId matches and no groupId
    return tasks.filter(task => !task.groupId);
  };

  const leaveGroup = async (groupId: string): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    try {
      const groupRef = doc(db, 'groups', groupId);
      
      // Remove user from group members (matching Flutter's FieldValue.delete())
      await updateDoc(groupRef, {
        [`members.${user.uid}`]: deleteField()
      });

      console.log(`User ${user.uid} left group ${groupId}`);
      
      // Optionally: Send notification to group members (similar to Flutter)
      // This would require a notification service similar to Flutter's GroupNotificationService
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      groups,
      categories,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      createGroup,
      joinGroup,
      leaveGroup,
      getGroupTasks,
      getPersonalTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
};
