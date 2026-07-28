import { useAsyncResource } from "@/hooks/use-async-resource";
import { supabase } from "@/lib/supabase";
import type { AsyncResource, Task } from "@/types";

async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    priority: row.priority,
    frequency: row.frequency,
    status: row.status,
    startDate: row.start_date,                   
    targetDayOfWeek: row.target_day_of_week ?? undefined, 
    dueDate: row.due_date ?? undefined,
    points: row.points,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export function useTasks(): AsyncResource<Task[]> {
  return useAsyncResource<Task[]>(fetchTasks, []);
}