import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Task, TaskLog, TaskLogResult } from "@/types";
import { calculateLogPoints } from "@/lib/calendar-logic";

type UseUpdateTaskLog = {
  setResult: (
    task: Task,
    date: string,
    result: TaskLogResult | null,
    existingLog?: TaskLog,
  ) => Promise<void>;
  clearDay: (date: string, logs: TaskLog[]) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
};

export function useUpdateTaskLog(onSuccess?: () => void): UseUpdateTaskLog {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const setResult = async (
    task: Task,
    date: string,
    result: TaskLogResult | null,
    existingLog?: TaskLog,
  ) => {
    setIsLoading(true);
    setError(null);

    if (existingLog) {
      if (result === null) {
        // Volta pra null = deleta o registro
        const { error } = await supabase
          .from("task_logs")
          .delete()
          .eq("id", existingLog.id);
        if (error) { setError(new Error(error.message)); setIsLoading(false); return; }
      } else {
        // Atualiza resultado existente
        const pointsEarned = calculateLogPoints(task, result, date);
        const { error } = await supabase
          .from("task_logs")
          .update({
            result,
            points_earned: pointsEarned,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingLog.id);
        if (error) { setError(new Error(error.message)); setIsLoading(false); return; }
      }
    } else if (result !== null) {
      // Cria novo log só se tiver resultado
      const pointsEarned = calculateLogPoints(task, result, date);
      const { error } = await supabase
        .from("task_logs")
        .insert({
          task_id: task.id,
          date,
          result,
          points_earned: pointsEarned,
        });
      if (error) { setError(new Error(error.message)); setIsLoading(false); return; }
    }

    setIsLoading(false);
    onSuccess?.();
  };

  const clearDay = async (date: string, logs: TaskLog[]) => {
  setIsLoading(true);
  setError(null);

  const ids = logs.filter((l) => l.date === date).map((l) => l.id);
  
  if (ids.length > 0) {
    const { error } = await supabase
      .from("task_logs")
      .delete()
      .in("id", ids);
    if (error) { setError(new Error(error.message)); setIsLoading(false); return; }
  }

  setIsLoading(false);
  onSuccess?.();
};

  return { setResult, clearDay, isLoading, error };
}