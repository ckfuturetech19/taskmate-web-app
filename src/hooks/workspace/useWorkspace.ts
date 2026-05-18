import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/apiService';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { toast } from 'sonner';

export const useWorkspaceActions = () => {
  const queryClient = useQueryClient();

  const createWorkspace = useMutation({
    mutationFn: async (data: { name: string; workspaceType: string; description?: string }) => {
      const response = await api.post('/workspaces', data);
      return response.data.success ? response.data.data : response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create workspace');
    },
  });

  const inviteMember = useMutation({
    mutationFn: async ({ workspaceId, email }: { workspaceId: string; email: string }) => {
      const response = await api.post(`/workspaces/${workspaceId}/invite`, { email });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Invitation sent successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send invitation');
    },
  });

  return { createWorkspace, inviteMember };
};

export const useWorkspaceInvitations = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['workspace-invitations'],
    queryFn: async () => {
      const response = await api.get('/workspaces/invitations/me');
      if (response.data.success) {
        return response.data.data || [];
      }
      throw new Error(response.data.message || 'Failed to fetch invitations');
    },
  });

  const acceptInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await api.post(`/workspaces/invitations/${invitationId}/accept`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Invitation accepted!');
      queryClient.invalidateQueries({ queryKey: ['workspace-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });

  const declineInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await api.post(`/workspaces/invitations/${invitationId}/decline`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Invitation declined');
      queryClient.invalidateQueries({ queryKey: ['workspace-invitations'] });
    },
  });

  return { 
    invitations: query.data || [], 
    count: (query.data as any[])?.length || 0,
    isLoading: query.isLoading,
    acceptInvitation,
    declineInvitation
  };
};

export const useWorkspaceInvitesSent = (workspaceId: string) => {
  return useQuery({
    queryKey: ['workspace-invites-sent', workspaceId],
    queryFn: async () => {
      const response = await api.get(`/workspaces/${workspaceId}/invitations`);
      if (response.data.success) {
        return response.data.data || [];
      }
      throw new Error(response.data.message || 'Failed to fetch sent invites');
    },
    enabled: !!workspaceId,
  });
};

export const useWorkspaceMembers = () => {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: ['workspace-members', currentWorkspace?.id],
    queryFn: async () => {
      const response = await api.get(`/workspaces/${currentWorkspace?.id}/members`);
      if (response.data.success) {
        return response.data.data || [];
      }
      throw new Error(response.data.message || 'Failed to fetch members');
    },
    enabled: !!currentWorkspace,
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await api.patch(`/workspaces/${currentWorkspace?.id}/members/${userId}/role`, { role });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Member role updated');
      queryClient.invalidateQueries({ queryKey: ['workspace-members', currentWorkspace?.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  });

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.delete(`/workspaces/${currentWorkspace?.id}/members/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Member removed');
      queryClient.invalidateQueries({ queryKey: ['workspace-members', currentWorkspace?.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  });

  return {
    members: membersQuery.data || [],
    isLoading: membersQuery.isLoading,
    updateRole,
    removeMember
  };
};

export const useWorkspaceStats = () => {
  const { currentWorkspace } = useWorkspace();

  return useQuery({
    queryKey: ['workspace-stats', currentWorkspace?.id],
    queryFn: async () => {
      const response = await api.get(`/dashboard/workspaces/${currentWorkspace?.id}/stats`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch stats');
    },
    enabled: !!currentWorkspace,
  });
};
