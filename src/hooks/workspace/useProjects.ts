import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/apiService';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { toast } from 'sonner';

export const useProjects = () => {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['projects', currentWorkspace?.id],
    queryFn: async () => {
      const response = await api.get('/team-tasks/projects');
      if (response.data.success) {
        return response.data.data || [];
      }
      throw new Error(response.data.message || 'Failed to fetch projects');
    },
    enabled: !!currentWorkspace,
  });

  const createProject = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/team-tasks/projects', data);
      return response.data.success ? response.data.data : response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', currentWorkspace?.id] });
      toast.success('Project created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    },
  });

  return { ...query, createProject };
};

export const useProject = (id: string) => {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await api.get(`/team-tasks/projects/${id}`);
      return response.data.success ? response.data.data : response.data;
    },
    enabled: !!id && !!currentWorkspace,
  });

  const updateProject = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/team-tasks/projects/${id}`, data);
      return response.data.success ? response.data.data : response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects', currentWorkspace?.id] });
      toast.success('Project updated successfully');
    },
  });

  const deleteProject = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/team-tasks/projects/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', currentWorkspace?.id] });
      toast.success('Project deleted');
    },
  });

  return { ...query, updateProject, deleteProject };
};

export const useProjectMembers = (projectId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['project-members', projectId],
    queryFn: async () => {
      const response = await api.get(`/team-tasks/projects/${projectId}/members`);
      return response.data.success ? response.data.data : response.data;
    },
    enabled: !!projectId,
  });

  const addMember = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.post(`/team-tasks/projects/${projectId}/members`, { userId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
      toast.success('Member added to project');
    },
  });

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.delete(`/team-tasks/projects/${projectId}/members/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
      toast.success('Member removed from project');
    },
  });

  return { ...query, addMember, removeMember };
};
