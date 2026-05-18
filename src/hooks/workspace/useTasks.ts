import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/apiService';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { toast } from 'sonner';

export const useTasks = (projectId?: string) => {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['team-tasks', currentWorkspace?.id, projectId],
    queryFn: async () => {
      const url = projectId ? `/team-tasks/tasks?projectId=${projectId}` : '/team-tasks/tasks';
      const response = await api.get(url);
      if (response.data.success) {
        return response.data.data || [];
      }
      throw new Error(response.data.message || 'Failed to fetch tasks');
    },
    enabled: !!currentWorkspace,
  });

  const createTask = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/team-tasks/tasks', data);
      return response.data.success ? response.data.data : response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-tasks', currentWorkspace?.id] });
      toast.success('Task created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create task');
    },
  });

  return { ...query, createTask };
};

export const useTask = (id: string) => {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['team-task', id],
    queryFn: async () => {
      const response = await api.get(`/team-tasks/tasks/${id}/`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch task');
    },
    enabled: !!id && !!currentWorkspace,
  });

  const updateTask = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.patch(`/team-tasks/tasks/${id}`, data);
      return response.data.success ? response.data.data : response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-task', id] });
      queryClient.invalidateQueries({ queryKey: ['team-tasks', currentWorkspace?.id] });
      toast.success('Task updated');
    },
  });

  const deleteTask = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/team-tasks/tasks/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-tasks', currentWorkspace?.id] });
      toast.success('Task deleted');
    },
  });

  return { ...query, updateTask, deleteTask };
};

export const useTaskComments = (taskId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['task-comments', taskId],
    queryFn: async () => {
      const response = await api.get(`/team-tasks/tasks/${taskId}/comments/`);
      if (response.data.success) {
        return response.data.data || [];
      }
      throw new Error(response.data.message || 'Failed to fetch comments');
    },
    enabled: !!taskId,
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      const response = await api.post(`/team-tasks/tasks/${taskId}/comments/`, { content });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] });
      toast.success('Comment added');
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await api.delete(`/team-tasks/tasks/comments/${commentId}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] });
      toast.success('Comment deleted');
    },
  });

  return { ...query, addComment, deleteComment };
};

export const useTaskActivities = (taskId: string) => {
  return useQuery({
    queryKey: ['task-activities', taskId],
    queryFn: async () => {
      const response = await api.get(`/team-tasks/tasks/${taskId}/activities/`);
      if (response.data.success) {
        return response.data.data || [];
      }
      throw new Error(response.data.message || 'Failed to fetch activities');
    },
    enabled: !!taskId,
  });
};
