import type { RankingEntry, Score, Statistics, Task, User } from "@/types";

export const mockUser: User = {
  id: "usr_01",
  name: "Alex Rivera",
  handle: "alex",
  email: "alex@atlas.app",
  avatarUrl: undefined,
  timezone: "Europe/Lisbon",
  joinedAt: "2025-02-14T09:30:00.000Z",
};

const now = new Date().toISOString();

export const mockTasks: Task[] = [
  {
    id: "tsk_01",
    title: "Review weekly OKRs",
    description: "Score outcomes and set next week's focus.",
    priority: "high",
    frequency: "weekly",
    status: "in_progress",
    dueDate: now,
    createdAt: now,
    updatedAt: now,
    points: 40,
    tags: ["planning", "focus"],
  },
  {
    id: "tsk_02",
    title: "Deep work — architecture spike",
    priority: "urgent",
    frequency: "once",
    status: "pending",
    createdAt: now,
    updatedAt: now,
    points: 80,
    tags: ["engineering"],
  },
  {
    id: "tsk_03",
    title: "Morning run",
    priority: "medium",
    frequency: "daily",
    status: "completed",
    createdAt: now,
    updatedAt: now,
    points: 10,
    tags: ["health"],
  },
  {
    id: "tsk_04",
    title: "Read 30 pages",
    priority: "low",
    frequency: "daily",
    status: "pending",
    createdAt: now,
    updatedAt: now,
    points: 5,
    tags: ["reading"],
  },
];

export const mockScore: Score = {
  userId: mockUser.id,
  total: 4820,
  level: 12,
  weekly: 320,
  monthly: 1180,
  streakDays: 27,
  nextLevelAt: 5000,
};

export const mockStatistics: Statistics = {
  totals: { tasks: 42, completed: 28, active: 12, overdue: 2 },
  completionRate: 0.67,
  weeklyTrend: [
    { label: "Mon", value: 4 },
    { label: "Tue", value: 6 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 8 },
    { label: "Fri", value: 5 },
    { label: "Sat", value: 2 },
    { label: "Sun", value: 0 },
  ],
  byPriority: { low: 6, medium: 14, high: 15, urgent: 7 },
};

export const mockRanking: RankingEntry[] = [
  { rank: 1, user: { id: "u_a", name: "Nadia Khan", handle: "nadia" }, score: 8420, delta: 2 },
  { rank: 2, user: { id: "u_b", name: "Kenji Watanabe", handle: "kenji" }, score: 7910, delta: -1 },
  { rank: 3, user: { id: "u_c", name: "Luna Costa", handle: "luna" }, score: 7205, delta: 1 },
  { rank: 4, user: { id: mockUser.id, name: mockUser.name, handle: mockUser.handle }, score: mockScore.total, delta: 3 },
  { rank: 5, user: { id: "u_e", name: "Iris Bergström", handle: "iris" }, score: 4610, delta: 0 },
];