import { useState } from "react";
import { useCreateTask } from "@/hooks/use-create-task";
import type { Priority, Frequency } from "@/types";

type Props = {
  onSuccess?: () => void;
};

export function CreateTaskForm({ onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [frequency, setFrequency] = useState<Frequency>("once");

  const { createTask, isLoading, error } = useCreateTask(onSuccess);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await createTask({ title, description, priority, frequency });
    setTitle("");
    setDescription("");
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <input
        className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>
      <select
        className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value as Frequency)}
      >
        <option value="once">Once</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

      {error && (
        <p className="text-xs text-red-500">{error.message}</p>
      )}

      <button
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        onClick={handleSubmit}
        disabled={isLoading || !title.trim()}
      >
        {isLoading ? "Creating..." : "Create task"}
      </button>
    </div>
  );
}