import type { Task, TaskLog } from "@/types";
import { calculateDailyEfficiency } from "@/lib/calendar-logic";

export type PeriodOption = "7d" | "30d" | "3m" | "1y" | "all";

export type SeriesPoint = { date: string; value: number };

const PERIOD_DAYS: Record<Exclude<PeriodOption, "all">, number> = {
  "7d": 7,
  "30d": 30,
  "3m": 90,
  "1y": 365,
};

export function filterPointsByPeriod(
  points: SeriesPoint[],
  period: PeriodOption,
): SeriesPoint[] {
  if (period === "all") return points;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - PERIOD_DAYS[period]);
  const cutoffStr = cutoff.toISOString().split("T")[0];

  return points.filter((p) => p.date >= cutoffStr);
}

// Eficiência geral: um ponto por dia que teve pelo menos um registro válido
export function buildOverallEfficiencySeries(
  logs: TaskLog[],
  tasks: Task[],
): SeriesPoint[] {
  const dates = Array.from(new Set(logs.map((l) => l.date))).sort();

  const points: SeriesPoint[] = [];
  for (const date of dates) {
    const dayLogs = logs.filter((l) => l.date === date);
    const eff = calculateDailyEfficiency(dayLogs, tasks, date);
    if (eff.efficiency !== null) {
      points.push({ date, value: eff.efficiency });
    }
  }
  return points;
}

// Série de uma tarefa específica: 1 = completed, 0 = failed, null é omitido
export function buildTaskSeries(logs: TaskLog[], taskId: string): SeriesPoint[] {
  return logs
    .filter((l) => l.taskId === taskId && l.result !== null)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((l) => ({ date: l.date, value: l.result === "completed" ? 1 : 0 }));
}