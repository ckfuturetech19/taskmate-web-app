import api from './apiService';

export interface NoteMember {
  id: string;
  userId: string;
  user: {
    displayName: string;
    avatar?: string;
  };
}

export interface Note {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  isGroup: boolean;
  inviteCode: string | null;
  reminder: string | null;
  reminderUtc: string | null;
  createdAt: string;
  updatedAt: string;
  members?: NoteMember[];
  _count?: {
    members: number;
  };
}

export const NoteService = {
  getNotes: async () => {
    const res = await api.get<Note[]>('/notes');
    const rawData = res.data as any;
    if (rawData && typeof rawData === 'object' && 'notes' in rawData) {
      res.data = rawData.notes;
    }
    return res;
  },
  createNote: async (data: { title: string; isGroup?: boolean; reminder?: string; reminderUtc?: string }) => {
    const res = await api.post<Note>('/notes', data);
    const rawData = res.data as any;
    if (rawData && typeof rawData === 'object' && 'note' in rawData) {
      res.data = rawData.note;
    }
    return res;
  },
  updateNote: async (id: string, data: { title?: string; content?: string; reminder?: string | null; reminderUtc?: string | null }) => {
    const res = await api.put<Note>(`/notes/${id}`, data);
    const rawData = res.data as any;
    if (rawData && typeof rawData === 'object' && 'note' in rawData) {
      res.data = rawData.note;
    }
    return res;
  },
  joinNote: async (inviteCode: string) => {
    const res = await api.post<Note>('/notes/join', { inviteCode });
    const rawData = res.data as any;
    if (rawData && typeof rawData === 'object' && 'note' in rawData) {
      res.data = rawData.note;
    }
    return res;
  },
  deleteNote: (id: string) => api.delete(`/notes/${id}`),
};
