import type { Priority, Frequency } from "@/types";

const pointsByFrequency: Record<Frequency, number> = {
  once: 1,
  daily: 1,
  weekly: 7,
  monthly: 30,
  yearly: 365,
};

const multiplierByPriority: Record<Priority, number> = {
  low: 1,
  medium: 1,
  high: 2,
  urgent: 2,
};

export function calculatePoints(frequency: Frequency, priority: Priority): number {
  return pointsByFrequency[frequency] * multiplierByPriority[priority];
}