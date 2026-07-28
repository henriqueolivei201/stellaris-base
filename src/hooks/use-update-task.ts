import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { TaskStatus, Frequency } from "@/types";
type UseUpdateTask = {
  updateStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
};

export function useUpdateTask(onSuccess?: () => void): UseUpdateTask {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);
    setIsLoading(false);
    if (error) { setError(new Error(error.message)); return; }
    onSuccess?.();
  };

  return { updateStatus, deleteTask, isLoading, error };
}