/**
 * Domain types.
 *
 * These types are the single source of truth for shape across the app.
 * They intentionally live outside of any framework or storage concern
 * so they can be reused when the mock hooks are swapped for Supabase.
 */

export type ID = string;
export type ISODateString = string;

export type Theme = "light" | "dark" | "system";

export type Priority = "low" | "medium" | "high" | "urgent";

export type Frequency = "once" | "daily" | "weekly" | "monthly" | "yearly";

export type TaskStatus = "pending" | "in_progress" | "completed" | "archived";

export interface Task {
  id: ID;
  title: string;
  description?: string;
  priority: Priority;
  frequency: Frequency;
  status: TaskStatus;
  dueDate?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  points: number;
  tags: string[];
}

export interface User {
  id: ID;
  name: string;
  email: string;
  avatarUrl?: string;
  handle: string;
  timezone: string;
  joinedAt: ISODateString;
}

export interface Score {
  userId: ID;
  total: number;
  level: number;
  weekly: number;
  monthly: number;
  streakDays: number;
  nextLevelAt: number;
}

export interface RankingEntry {
  rank: number;
  user: Pick<User, "id" | "name" | "handle" | "avatarUrl">;
  score: number;
  delta: number;
}

export interface Statistics {
  totals: {
    tasks: number;
    completed: number;
    active: number;
    overdue: number;
  };
  completionRate: number; // 0..1
  weeklyTrend: Array<{ label: string; value: number }>;
  byPriority: Record<Priority, number>;
}

/** Async data envelope used by every data hook. */
export interface AsyncResource<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}