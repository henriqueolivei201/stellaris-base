export type ID = string;
export type ISODateString = string;

export type Theme = "light" | "dark" | "system";
export type Priority = "low" | "medium" | "high" | "urgent";
export type Frequency = "once" | "daily" | "weekly" | "monthly" | "yearly";
export type TaskStatus = "pending" | "in_progress" | "completed" | "archived";
export type TaskLogResult = "completed" | "failed";

export interface Task {
  id: ID;
  title: string;
  description?: string;
  priority: Priority;
  frequency: Frequency;
  status: TaskStatus;
  startDate: ISODateString;
  targetDayOfWeek?: number; // 0 = domingo, 6 = sábado (só pra weekly)
  dueDate?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  points: number;
  tags: string[];
}

export interface TaskLog {
  id: ID;
  taskId: ID;
  date: string; // YYYY-MM-DD
  result: TaskLogResult | null;
  pointsEarned: number | null;
  lastDeadlineCheck: string | null; // YYYY-MM-DD
  createdAt: ISODateString;
  updatedAt: ISODateString;
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
  totals: { tasks: number; completed: number; active: number; overdue: number };
  completionRate: number;
  weeklyTrend: Array<{ label: string; value: number }>;
  byPriority: Record<Priority, number>;
}

export interface AsyncResource<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface DailyEfficiency {
  date: string; // YYYY-MM-DD
  efficiency: number | null; // 0-100, null se não tiver nenhum registro
  completed: number;
  failed: number;
  total: number;
}

export type ScoreCategory = "Iniciante" | "Aprendiz" | "Dedicado" | "Experiente" | "Mestre" | "Lendário";

export interface Score {
  userId: ID;
  total: number;
  level: number;
  category: ScoreCategory;
  weekly: number;
  monthly: number;
  streakDays: number;
  nextLevelAt: number;
}