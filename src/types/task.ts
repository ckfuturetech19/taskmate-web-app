export type Priority = 'low' | 'medium' | 'high';
export type RecurringType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  reminder?: string;
  recurring: RecurringType;
  priority: Priority;
  completed: boolean;
  isCompletedToday?: boolean;
  lastCompletedDate?: string;
  createdAt: string;
  updatedAt?: string;
  userId: string;
  groupId?: string;
  subtasks?: SubTask[];
  categoryId?: string;
  tags?: string[];
  color?: string;
  colorIndex?: number;
  // Recurrence fields
  recurrenceFrequency?: number;
  recurrenceType?: string;
  isPaused?: boolean;
  completedCount?: number;
  // Group task fields
  isGroupTask?: boolean;
  groupMembers?: string[];
  groupOwnerId?: string;
  // Deletion tracking
  isDeleted?: boolean;
}

export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  ownerId: string;
  members: Record<string, boolean>;
  createdAt: string;
}

export type NotificationType = 'task_assigned' | 'task_completed' | 'task_updated' | 'group_joined' | 'group_task_added';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  groupId?: string;
  groupName?: string;
  taskId?: string;
  taskTitle?: string;
  fromUserId?: string;
  fromUserName?: string;
  isRead: boolean;
  createdAt: string;
}
