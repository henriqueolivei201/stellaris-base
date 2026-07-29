import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { calculatePoints } from "@/lib/points";
import type { Task, TaskStatus, Priority, Frequency } from "@/types";

type UpdateTaskInput = {
  title: string;
  description?: string;
  priority: Priority;
  frequency: Frequency;
  targetDayOfWeek?: number;
};

type UseUpdateTask = {
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  updateStatus: (id: string, status: TaskStatus, frequency?: Frequency) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
};

export function useUpdateTask(onSuccess?: () => void): UseUpdateTask {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateTask = async (id: string, input: UpdateTaskInput) => {
    setIsLoading(true);
    const { error } = await supabase
      .from("tasks")
      .update({
        title: input.title,
        description: input.description,
        priority: input.priority,
        frequency: input.frequency,
        points: calculatePoints(input.frequency, input.priority),
        target_day_of_week: input.targetDayOfWeek ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    setIsLoading(false);
    if (error) { setError(new Error(error.message)); return; }
    onSuccess?.();
  };

  const updateStatus = async (id: string, status: TaskStatus, frequency?: Frequency) => {
    setIsLoading(true);
    if (status === "completed" && frequency === "once") {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      setIsLoading(false);
      if (error) { setError(new Error(error.message)); return; }
      onSuccess?.();
      return;
    }
    const { error } = await supabase
      .from("tasks")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    setIsLoading(false);
    if (error) { setError(new Error(error.message)); return; }
    onSuccess?.();
  };

  const deleteTask = async (id: string) => {
    setIsLoading(true);
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    setIsLoading(false);
    if (error) { setError(new Error(error.message)); return; }
    onSuccess?.();
  };

  return { updateTask, updateStatus, deleteTask, isLoading, error };
}