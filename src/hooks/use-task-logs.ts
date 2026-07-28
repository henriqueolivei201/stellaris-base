import { useAsyncResource } from "@/hooks/use-async-resource";
import { supabase } from "@/lib/supabase";
import type { AsyncResource, TaskLog } from "@/types";

async function fetchTaskLogs(month: number, year: number): Promise<TaskLog[]> {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("task_logs")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    taskId: row.task_id,
    date: row.date,
    result: row.result ?? null,
    pointsEarned: row.points_earned ?? null,
    lastDeadlineCheck: row.last_deadline_check ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export function useTaskLogs(month: number, year: number): AsyncResource<TaskLog[]> {
  return useAsyncResource<TaskLog[]>(
    () => fetchTaskLogs(month, year),
    [month, year],
  );
}