import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import api from '@/services/apiService';
import { socketService } from '@/services/socketService';
import { Task, Group } from '@/types/task';
import { useAuth } from './AuthContext';
import { useTaskData } from '@/hooks/useTaskData';
import { useGroupTasks } from '@/hooks/useGroupTasks';
import { useTaskOperations } from '@/hooks/useTaskOperations';
import { useRecurrence } from '@/hooks/useRecurrence';
import { deduplicateTasks } from '@/lib/taskUtils';

interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
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
  refreshData: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const { tasks: personalTasks, refresh: refreshPersonal } = useTaskData(user?.id || null);
  const { groupTasks } = useGroupTasks(user?.id || null, groups);
  const { addTask: addTaskOp, updateTask: updateTaskOp, deleteTask: deleteTaskOp } = useTaskOperations();
  const { createNextRecurrence } = useRecurrence(addTaskOp);
  
  const tasks = useMemo(() => {
    const personal = Array.isArray(personalTasks) ? personalTasks : [];
    const groups = Array.isArray(groupTasks) ? groupTasks : [];
    const all = [...personal, ...groups];
    return deduplicateTasks(all.filter(t => t && !t.isDeleted));
  }, [personalTasks, groupTasks]);

  const fetchGroups = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  }, [user]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/categories');
      const data = response.data;
      
      // Handle both raw array responses and wrapped objects
      const categoriesList = Array.isArray(data)
        ? data
        : (data && typeof data === 'object' && 'categories' in data && Array.isArray((data as any).categories))
          ? (data as any).categories
          : [];

      // Predefined icons map matching Flutter CategoryIcons
      const emojiMap: Record<string, string> = {
        work: '💼',
        personal: '👤',
        shopping: '🛒',
        health: '❤️',
        education: '🎓',
        study: '📚',
        travel: '✈️',
        home: '🏠',
        finance: '💰',
        sports: '⚽',
        entertainment: '🎬',
        default: '📁',
      };

      const mapped = categoriesList.map((c: any) => ({
        id: c.id,
        name: c.name,
        color: typeof c.color === 'bigint' ? c.color.toString() : c.color,
        iconName: c.iconName,
        icon: emojiMap[c.iconName?.toLowerCase()] || emojiMap.default,
      }));

      console.log('[TaskContext] Loaded Categories:', mapped);
      setCategories(mapped);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchGroups(), fetchCategories(), refreshPersonal()]);
  }, [fetchGroups, fetchCategories, refreshPersonal]);

  useEffect(() => {
    if (user) {
      refreshData();
      
      socketService.joinUserRoom(user.id);
      socketService.on('group-updated', fetchGroups);
      socketService.on('categories-updated', fetchCategories);

      return () => {
        socketService.off('group-updated', fetchGroups);
        socketService.off('categories-updated', fetchCategories);
      };
    }
  }, [user, refreshData, fetchGroups, fetchCategories]);

  const addTask = async (taskData: any) => {
    await addTaskOp(taskData);
    await refreshPersonal();
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateTaskOp(id, updates, task);
      await refreshPersonal();
    }
  };

  const deleteTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await deleteTaskOp(task);
      await refreshPersonal();
    }
  };

  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const updates: Partial<Task> = { isCompleted: !task.isCompleted };
    if (!task.isCompleted) {
      updates.lastCompletedDate = new Date().toISOString();
    }
    await updateTask(id, updates);
  };

  const createGroup = async (name: string): Promise<Group> => {
    const response = await api.post('/groups', { name });
    await fetchGroups();
    return response.data;
  };

  const joinGroup = async (inviteCode: string): Promise<boolean> => {
    try {
      await api.post('/groups/join', { inviteCode });
      await fetchGroups();
      return true;
    } catch (error) {
      console.error('Error joining group:', error);
      return false;
    }
  };

  const leaveGroup = async (groupId: string): Promise<void> => {
    await api.post(`/groups/${groupId}/leave`);
    await fetchGroups();
  };

  const getGroupTasks = (groupId: string) => tasks.filter(t => t.groupId === groupId);
  const getPersonalTasks = () => tasks.filter(t => !t.groupId);

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
      refreshData,
    }}>
      {children}
    </TaskContext.Provider>
  );
};
