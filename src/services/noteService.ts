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
  getNotes: () => api.get<Note[]>('/notes'),
  createNote: (data: { title: string; isGroup?: boolean; reminder?: string; reminderUtc?: string }) => api.post<Note>('/notes', data),
  updateNote: (id: string, data: { title?: string; content?: string; reminder?: string | null; reminderUtc?: string | null }) => api.put<Note>(`/notes/${id}`, data),
  joinNote: (inviteCode: string) => api.post<Note>('/notes/join', { inviteCode }),
  deleteNote: (id: string) => api.delete(`/notes/${id}`),
};
