import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Task, Priority, Frequency } from "@/types";
import { calculatePoints } from "@/lib/points";

type CreateTaskInput = {
  title: string;
  description?: string;
  priority: Priority;
  frequency: Frequency;
  points?: number;
  tags?: string[];
  targetDayOfWeek?: number; 
};

type UseCreateTask = {
  createTask: (input: CreateTaskInput) => Promise<Task>;
  isLoading: boolean;
  error: Error | null;
};

export function useCreateTask(onSuccess?: () => void): UseCreateTask {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTask = async (input: CreateTaskInput): Promise<Task> => {
    setIsLoading(true);
    setError(null);

   const { data, error } = await supabase
  .from("tasks")
  .insert({
    title: input.title,
    description: input.description,
    priority: input.priority,
    frequency: input.frequency,
    points: calculatePoints(input.frequency, input.priority),
    tags: input.tags ?? [],
    status: "pending",
    target_day_of_week: input.targetDayOfWeek ?? null, 
  })
      .select()
      .single();

    setIsLoading(false);

    if (error) {
      const err = new Error(error.message);
      setError(err);
      throw err;
    }

    onSuccess?.();
    return data as Task;
  };

  return { createTask, isLoading, error };
}