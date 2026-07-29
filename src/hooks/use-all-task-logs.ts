import { useAsyncResource } from "@/hooks/use-async-resource";
import { supabase } from "@/lib/supabase";
import type { AsyncResource, TaskLog } from "@/types";

async function fetchAllTaskLogs(): Promise<TaskLog[]> {
  const { data, error } = await supabase
    .from("task_logs")
    .select("*")
    .order("date", { ascending: true });

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

export function useAllTaskLogs(): AsyncResource<TaskLog[]> {
  return useAsyncResource<TaskLog[]>(fetchAllTaskLogs, []);
}