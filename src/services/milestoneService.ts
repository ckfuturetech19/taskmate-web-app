import api from './apiService';

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  type: string;
  startDate: string;
  endDate?: string;
  timezone?: string;
  notificationEnabled: boolean;
  intervalType: string;
  customIntervals?: number[];
  
  // Computed fields
  daysCompleted?: number;
  weeksCompleted?: number;
  monthsCompleted?: number;
  yearsCompleted?: number;
  progressPercentage?: number | null;
  remainingDays?: number | null;
  nextMilestone?: number | null;
  lastMilestoneLabel?: string | null;
}

export interface MilestoneTimelineItem {
  id: string;
  milestoneId: string;
  intervalValue: number;
  triggeredAt: string;
}

export const MilestoneService = {
  getMilestones: () => api.get<Milestone[]>('/milestones'),
  getMilestone: (id: string) => api.get<Milestone>(`/milestones/${id}`),
  createMilestone: (data: Partial<Milestone>) => api.post<Milestone>('/milestones', data),
  updateMilestone: (id: string, data: Partial<Milestone>) => api.put<Milestone>(`/milestones/${id}`, data),
  deleteMilestone: (id: string) => api.delete(`/milestones/${id}`),
  toggleMilestone: (id: string) => api.patch<Milestone>(`/milestones/${id}/toggle`),
  getMilestoneTimeline: (id: string) => api.get<MilestoneTimelineItem[]>(`/milestones/${id}/timeline`),
  triggerMilestone: (id: string) => api.post(`/milestones/${id}/trigger`),
};
