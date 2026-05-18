// Priority levels matching Flutter model
export type PriorityLevel = 'none' | 'low' | 'medium' | 'high';
// Recurrence types matching Flutter model
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

// Recurrence model (simplified for now)
export interface Recurrence {
  type: RecurrenceType;
  interval?: number; // How often the recurrence repeats (e.g., every 2 weeks)
  daysOfWeek?: number[]; // For weekly recurrences, which days (0=Sun, 6=Sat)
  repeatCount?: number; // How many times to repeat
  skipDays?: number[]; // Days to skip
  startDate?: string; // ISO string
  endDate?: string; // ISO string
  isPaused?: boolean;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id?: string;
  userId?: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string
  reminder?: string; // ISO string
  reminderUtc?: string; // ISO string
  isCompleted?: boolean;
  isCompletedToday?: boolean;
  lastCompletedDate?: string;
  isPriority?: boolean;
  priorityLevel?: PriorityLevel;
  categoryId?: string;
  recurrenceFrequency?: number;
  recurrenceType?: RecurrenceType;
  recurrence?: Recurrence;
  lastCompleted?: string;
  nextDueDate?: string;
  completedCount?: number;
  isPaused?: boolean;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  isRecurrenceOrigin?: boolean;
  position?: number;
  createdAt: string;
  updatedAt?: string;
  subtasks?: SubTask[];
  color?: string;
  colorIndex?: number;
  repeat?: string;
  tags?: string[];
  isDeleted?: boolean;
  deletedAt?: string;
  // Focus timer fields
  focusTimerEnabled?: boolean;
  focusDurationMinutes?: number;
  focusTimerStartTime?: string;
  focusTimerIsRunning?: boolean;
  focusTimerRemainingSeconds?: number;
  // Group task fields
  isGroupTask?: boolean;
  groupId?: string;
  groupMembers?: string[];
  groupOwnerId?: string;
  // Calendar integration fields
  isFromSystemCalendar?: boolean;
  systemCalendarId?: string;
  systemEventId?: string;
}

export interface GroupMemberProfile {
  id: string;
  name?: string;
  email?: string;
  photoURL?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  code?: string; // Alias for inviteCode (matching Flutter)
  createdBy?: string;
  ownerId: string;
  members: GroupMemberProfile[];
  createdAt: string;
}

export type NotificationType = 'task_assigned' | 'task_completed' | 'task_updated' | 'group_joined' | 'group_task_added' | 'member_left' | 'group_task_updated' | 'group_task_deleted';

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
