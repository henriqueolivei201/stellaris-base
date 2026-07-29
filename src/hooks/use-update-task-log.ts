import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Task, TaskLog, TaskLogResult } from "@/types";
import { calculateLogPoints } from "@/lib/calendar-logic";

type PendingResult = {
  task: Task;
  result: TaskLogResult | null;
  existingLog?: TaskLog;
};

type UseUpdateTaskLog = {
  commitDay: (date: string, pending: PendingResult[]) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
};

export function useUpdateTaskLog(onSuccess?: () => void): UseUpdateTaskLog {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const commitDay = async (date: string, pending: PendingResult[]) => {
    setIsLoading(true);
    setError(null);

    for (const { task, result, existingLog } of pending) {
      if (existingLog) {
        if (result === null) {
          const { error } = await supabase
            .from("task_logs").delete().eq("id", existingLog.id);
          if (error) { setError(new Error(error.message)); setIsLoading(false); return; }
        } else {
          const { error } = await supabase
            .from("task_logs")
            .update({
              result,
              points_earned: calculateLogPoints(task, result, date),
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingLog.id);
          if (error) { setError(new Error(error.message)); setIsLoading(false); return; }
        }
      } else if (result !== null) {
        const { error } = await supabase
          .from("task_logs")
          .insert({
            task_id: task.id,
            date,
            result,
            points_earned: calculateLogPoints(task, result, date),
          });
        if (error) { setError(new Error(error.message)); setIsLoading(false); return; }
      }


      if (task.frequency === "once" && result !== null) {
        const newStatus = result === "completed" ? "completed" : "archived";
        const { error } = await supabase
          .from("tasks")
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq("id", task.id);
        if (error) { setError(new Error(error.message)); setIsLoading(false); return; }
      }
    }

    setIsLoading(false);
    onSuccess?.();
  };

  return { commitDay, isLoading, error };
}