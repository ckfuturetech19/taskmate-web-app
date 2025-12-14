import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  where,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task, Group, Priority, RecurringType } from '@/types/task';
import { useAuth } from './AuthContext';

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Real-time sync for tasks using userSyncData collection
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    try {
      console.log('Setting up task listener for user:', user.uid);
      const tasksRef = collection(db, 'userSyncData', user.uid, 'tasks');
      
      const unsubscribe = onSnapshot(
        tasksRef, 
        (snapshot) => {
          try {
            console.log('=== Tasks snapshot received ===');
            console.log('Total tasks:', snapshot.docs.length);
            console.log('Changes:', snapshot.docChanges().map(c => `${c.type}: ${c.doc.id}`));
            
            const fetchedTasks: Task[] = snapshot.docs.map(doc => {
              const data = doc.data();
              console.log('Processing task:', doc.id, 'groupId:', data.groupId);
            
            // Convert priorityLevel number to priority string
            const getPriority = (level: any): Priority => {
              if (level === 3 || level === 'high') return 'high';
              if (level === 2 || level === 'medium') return 'medium';
              if (level === 1 || level === 'low') return 'low';
              return 'medium';
            };
            
            // Parse date fields - handle both Timestamp and string formats
            const parseDate = (field: any): string | undefined => {
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
            
            // Parse completed status - handle both boolean and number formats
            const isCompleted = data.isCompleted === 1 || 
                              data.isCompleted === true || 
                              data.completed === 1 || 
                              data.completed === true;
            
            // Check if task is deleted
            const isDeleted = data.isDeleted === 1 || 
                            data.isDeleted === true;
            
            return {
              id: doc.id,
              title: data.title || '',
              description: data.description || undefined,
              completed: isCompleted,
              isCompletedToday: data.isCompletedToday === 1 || data.isCompletedToday === true,
              userId: data.userId || user.uid,
              createdAt: parseDate(data.createdAt) || new Date().toISOString(),
              updatedAt: parseDate(data.updatedAt),
              dueDate: parseDate(data.dueDate),
              reminder: parseDate(data.reminder),
              lastCompletedDate: parseDate(data.lastCompletedDate),
              priority: getPriority(data.priorityLevel),
              groupId: data.groupId || undefined,
              recurring: (data.recurrenceType || data.recurring || 'none') as RecurringType,
              subtasks: data.subtasks || undefined,
              categoryId: data.categoryId || undefined,
              tags: data.tags || undefined,
              color: data.color || undefined,
              colorIndex: data.colorIndex || 0,
              recurrenceFrequency: data.recurrenceFrequency || undefined,
              recurrenceType: data.recurrenceType || undefined,
              isPaused: data.isPaused === 1 || data.isPaused === true,
              completedCount: data.completedCount || 0,
              isGroupTask: data.isGroupTask === 1 || data.isGroupTask === true,
              groupMembers: data.groupMembers || undefined,
              groupOwnerId: data.groupOwnerId || undefined,
              isDeleted: isDeleted,
            };
          })
          // Filter out deleted tasks
          .filter(task => !task.isDeleted);
          
          console.log('Processed tasks:', fetchedTasks.length);
          console.log('Completed tasks:', fetchedTasks.filter(t => t.completed).length);
          console.log('Pending tasks:', fetchedTasks.filter(t => !t.completed).length);
          console.log('Group tasks:', fetchedTasks.filter(t => t.groupId).length);
          console.log('Personal tasks:', fetchedTasks.filter(t => !t.groupId).length);
          
          // Additional validation logging
          const completedTasks = fetchedTasks.filter(t => t.completed);
          if (completedTasks.length > 0) {
            console.log('Completed task IDs:', completedTasks.map(t => `${t.id}: ${t.title}`).slice(0, 5));
          }
          
          setTasks(fetchedTasks);
          } catch (error) {
            console.error('Error processing tasks snapshot:', error);
            setTasks([]);
          }
        },
        (error) => {
          console.error('Error fetching tasks:', error);
          setTasks([]);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up task listener:', error);
    }
  }, [user]);

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
                ...data,
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

  // Real-time sync for group tasks from groups collection
  useEffect(() => {
    if (!user || groups.length === 0) {
      return;
    }

    console.log('Setting up group task listeners for', groups.length, 'groups');
    const unsubscribes: (() => void)[] = [];

    groups.forEach(group => {
      // Listen to tasks in groups/{groupId}/tasks
      const groupTasksRef = collection(db, 'groups', group.id, 'tasks');

      const unsubGroupTasks = onSnapshot(
        groupTasksRef,
        (tasksSnapshot) => {
          try {
            console.log(`Group ${group.id} tasks snapshot:`, tasksSnapshot.docs.length, 'tasks');
            const groupTasksList: Task[] = tasksSnapshot.docs.map(doc => {
              const data = doc.data();

              const getPriority = (level: any): Priority => {
                if (level === 3 || level === 'high') return 'high';
                if (level === 2 || level === 'medium') return 'medium';
                if (level === 1 || level === 'low') return 'low';
                return 'medium';
              };

              const parseDate = (field: any): string | undefined => {
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

              return {
                id: doc.id,
                title: data.title || '',
                description: data.description || undefined,
                completed: data.isCompleted === 1 || data.completed === true,
                isCompletedToday: data.isCompletedToday === 1 || data.isCompletedToday === true,
                userId: data.userId || user.uid,
                createdAt: parseDate(data.createdAt) || new Date().toISOString(),
                updatedAt: parseDate(data.updatedAt),
                dueDate: parseDate(data.dueDate),
                reminder: parseDate(data.reminder),
                lastCompletedDate: parseDate(data.lastCompletedDate),
                priority: getPriority(data.priorityLevel),
                groupId: data.groupId || undefined,
                recurring: (data.recurrenceType || data.recurring || 'none') as RecurringType,
                subtasks: data.subtasks || undefined,
                categoryId: data.categoryId || undefined,
                tags: data.tags || undefined,
                color: data.color || undefined,
                colorIndex: data.colorIndex || 0,
                recurrenceFrequency: data.recurrenceFrequency || undefined,
                recurrenceType: data.recurrenceType || undefined,
                isPaused: data.isPaused === 1 || data.isPaused === true,
                completedCount: data.completedCount || 0,
                isGroupTask: data.isGroupTask === 1 || data.isGroupTask === true,
                groupMembers: data.groupMembers || undefined,
                groupOwnerId: data.groupOwnerId || undefined,
              };
            });

            setTasks(prevTasks => {
              // Remove old tasks for this group
              const filtered = prevTasks.filter(t => t.groupId !== group.id);
              // Add new group tasks
              const updated = [...filtered, ...groupTasksList];
              console.log(`Updated group ${group.id} tasks:`, groupTasksList.length, 'tasks');
              return updated;
            });
          } catch (error) {
            console.error('Error processing group tasks snapshot:', error);
          }
        },
        (error) => {
          console.error('Error fetching group tasks:', error);
        }
      );

      unsubscribes.push(unsubGroupTasks);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [user, groups]);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'userId' | 'completed'>) => {
    if (!user) {
      console.error('Cannot add task: user not logged in');
      return;
    }
    
    try {
      console.log('Adding task:', taskData);
      
      // For group tasks, create in groups/{groupId}/tasks
      // For personal tasks, create in userSyncData/{userId}/tasks
      const isGroupTask = !!taskData.groupId;
      
      // Convert priority string to number (0=none, 1=low, 2=medium, 3=high)
      const getPriorityLevel = (priority: Priority): number => {
        if (priority === 'high') return 3;
        if (priority === 'medium') return 2;
        if (priority === 'low') return 1;
        return 0;
      };
      
      let taskRef;
      if (isGroupTask && taskData.groupId) {
        // Create group task in groups/{groupId}/tasks
        taskRef = collection(db, 'groups', taskData.groupId, 'tasks');
          
      } else {
        // Create personal task in userSyncData/{userId}/tasks
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
        focusTimerEnabled: 0,
        focusTimerIsRunning: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: taskData.dueDate || null,
        reminder: taskData.reminder || null,
        priorityLevel: getPriorityLevel(taskData.priority || 'medium'),
        groupId: taskData.groupId || null,
        recurrenceType: taskData.recurring || 'none',
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
        timeWindowStart: null,
        timeWindowEnd: null,
        focusDurationMinutes: null,
        focusTimerStartTime: null,
        focusTimerRemainingSeconds: null,
      };
      
      const docRef = await addDoc(taskRef, taskToAdd);
      console.log(`Task added with ID: ${docRef.id} (group: ${isGroupTask})`);
      
      // If it's a group task, notify all group members (except creator)
      if (isGroupTask && taskData.groupId) {
        const group = groups.find(g => g.id === taskData.groupId);
        if (group) {
          // Notify all group members except the creator
          const membersToNotify = Object.keys(group.members || {}).filter(id => id !== user.uid);
          
          await Promise.all(
            membersToNotify.map(async (memberId) => {
              const notificationRef = collection(db, 'users', memberId, 'notifications');
              await addDoc(notificationRef, {
                type: 'task_assigned',
                title: 'Task Assigned',
                message: `${user.displayName || 'Someone'} assigned you a task: "${taskData.title}"`,
                groupId: taskData.groupId,
                groupName: group.name,
                taskId: docRef.id,
                taskTitle: taskData.title,
                fromUserId: user.uid,
                fromUserName: user.displayName || 'Unknown User',
                isRead: false,
                createdAt: Timestamp.now(),
              });
            })
          );
        }
      }
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;
    
    try {
      console.log('Updating task:', id, updates);
      
      // Find the task to determine if it's a group task
      const task = tasks.find(t => t.id === id);
      if (!task) {
        console.error('Task not found:', id);
        return;
      }
      
      // Determine the correct path based on whether it's a group task
      let taskRef;
      if (task.groupId) {
        taskRef = doc(db, 'groups', task.groupId, 'tasks', id);
      } else {
        taskRef = doc(db, 'userSyncData', user.uid, 'tasks', id);
      }
      
      // Convert priority string to number if needed
      const getPriorityLevel = (priority: Priority): number => {
        if (priority === 'high') return 3;
        if (priority === 'medium') return 2;
        if (priority === 'low') return 1;
        return 0;
      };
      
      const updateData: any = { 
        updatedAt: new Date().toISOString(),
      };
      
      // Handle each field with proper conversion
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description || '';
      if (updates.dueDate !== undefined) updateData.dueDate = updates.dueDate;
      if (updates.reminder !== undefined) updateData.reminder = updates.reminder;
      if (updates.completed !== undefined) updateData.isCompleted = updates.completed ? 1 : 0;
      if (updates.priority !== undefined) updateData.priorityLevel = getPriorityLevel(updates.priority);
      if (updates.recurring !== undefined) updateData.recurrenceType = updates.recurring;
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
      
      await updateDoc(taskRef, updateData);
      console.log('Task updated successfully');
      
      // If it's a group task and it was completed, notify group members
      if (task.groupId && updates.completed !== undefined) {
        const group = groups.find(g => g.id === task.groupId);
        if (group) {
          const memberIds = Object.keys(group.members || {}).filter(memberId => memberId !== user.uid);
          
          // Create notifications for all group members
          await Promise.all(
            memberIds.map(async (memberId) => {
              const notificationRef = collection(db, 'users', memberId, 'notifications');
              await addDoc(notificationRef, {
                type: updates.completed ? 'task_completed' : 'task_updated',
                title: updates.completed ? 'Task Completed' : 'Task Updated',
                message: updates.completed 
                  ? `${user.displayName || 'Someone'} completed task: "${task.title}"`
                  : `${user.displayName || 'Someone'} updated task: "${task.title}"`,
                groupId: task.groupId,
                groupName: group.name,
                taskId: id,
                taskTitle: task.title,
                fromUserId: user.uid,
                fromUserName: user.displayName || 'Unknown User',
                isRead: false,
                createdAt: Timestamp.now(),
              });
            })
          );
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    
    // Find the task to determine if it's a group task
    const task = tasks.find(t => t.id === id);
    if (!task) {
      console.error('Task not found:', id);
      return;
    }
    
    // Determine the correct path based on whether it's a group task
    let taskRef;
    if (task.groupId) {
      taskRef = doc(db, 'groups', task.groupId, 'tasks', id);
    } else {
      taskRef = doc(db, 'userSyncData', user.uid, 'tasks', id);
    }
    
    // Mark task as deleted instead of removing it (for sync purposes)
    await updateDoc(taskRef, {
      isDeleted: 1,
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !user) return;
    
    const updates: Partial<Task> = { 
      completed: !task.completed,
    };
    
    // Set lastCompletedDate when marking as complete
    if (!task.completed) {
      updates.lastCompletedDate = new Date().toISOString();
    }
    
    await updateTask(id, updates);
  };

  const createGroup = async (name: string): Promise<Group> => {
    if (!user) throw new Error('User must be logged in');
    
    const groupsRef = collection(db, 'groups');
    const newGroup = {
      name,
      inviteCode: generateInviteCode(),
      createdBy: user.uid,
      ownerId: user.uid,
      members: { [user.uid]: true },
      createdAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(groupsRef, newGroup);
    
    return {
      id: docRef.id,
      ...newGroup,
      createdAt: new Date().toISOString(),
    };
  };

  const joinGroup = async (inviteCode: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Query Firebase for the group with this invite code
      const groupsRef = collection(db, 'groups');
      const q = query(groupsRef, where('inviteCode', '==', inviteCode.toUpperCase()));
      const querySnapshot = await getDocs(q);
      
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
      
      // Create notification for group owner
      const notificationRef = collection(db, 'users', groupData.ownerId || groupData.createdBy, 'notifications');
      await addDoc(notificationRef, {
        type: 'group_joined',
        title: 'New Group Member',
        message: `${user.displayName || 'Someone'} joined your group "${groupData.name}"`,
        groupId: groupDoc.id,
        groupName: groupData.name,
        fromUserId: user.uid,
        fromUserName: user.displayName || 'Unknown User',
        isRead: false,
        createdAt: Timestamp.now(),
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
      getGroupTasks,
      getPersonalTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
};
