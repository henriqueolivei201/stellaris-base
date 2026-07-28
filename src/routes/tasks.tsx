import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ContentCard } from "@/components/cards/content-card";
import { ActionButton } from "@/components/common/action-button";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { PriorityBadge } from "@/components/common/priority-badge";
import { StatusBadge } from "@/components/common/status-badge";
import { FrequencyBadge } from "@/components/common/frequency-badge";
import { useTasks } from "@/hooks/use-tasks";
import { useCreateTask } from "@/hooks/use-create-task";
import { useUpdateTask } from "@/hooks/use-update-task";
import type { Task, Priority, Frequency } from "@/types";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — Atlas" },
      { name: "description", content: "Register and manage your tasks." },
    ],
  }),
  component: TasksPage,
});

const FREQUENCY_ORDER: Frequency[] = ["once", "daily", "weekly", "monthly", "yearly"];

const WEEKDAY_OPTIONS = [
  { label: "Domingo", value: 0 },
  { label: "Segunda", value: 1 },
  { label: "Terça", value: 2 },
  { label: "Quarta", value: 3 },
  { label: "Quinta", value: 4 },
  { label: "Sexta", value: 5 },
  { label: "Sábado", value: 6 },
];

type FormState = {
  title: string;
  description: string;
  priority: Priority;
  frequency: Frequency;
  targetDayOfWeek: number;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  priority: "medium",
  frequency: "once",
  targetDayOfWeek: new Date().getDay(),
};

function TasksPage() {
  const { data, isLoading, isError, error, refetch } = useTasks();
  const { createTask, isLoading: isCreating } = useCreateTask(() => void refetch());
  const { deleteTask, isLoading: isDeleting } = useUpdateTask(() => void refetch());

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const groupedTasks = useMemo(() => {
    return FREQUENCY_ORDER.map((freq) => ({
      frequency: freq,
      tasks: (data ?? []).filter((t) => t.frequency === freq),
    })).filter((g) => g.tasks.length > 0);
  }, [data]);

  const openCreate = () => {
    setEditingTask(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      frequency: task.frequency,
      targetDayOfWeek: task.targetDayOfWeek ?? new Date().getDay(),
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    await createTask({
      ...form,
      targetDayOfWeek: form.frequency === "weekly" ? form.targetDayOfWeek : undefined,
    });
    setShowForm(false);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    await deleteTask(id);
  };

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Workspace"
          title="Task registration"
          description="Capture, prioritise and track everything in one focused surface."
          actions={
            <ActionButton
              leadingIcon={<Plus className="size-4" />}
              onClick={openCreate}
            >
              New task
            </ActionButton>
          }
        />

        {showForm && (
          <ContentCard>
            <div className="flex flex-col gap-4 p-4">
              <p className="text-sm font-medium">
                {editingTask ? "Edit task" : "New task"}
              </p>
              <input
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
              <input
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
              <select
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Priority }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <select
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={form.frequency}
                onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value as Frequency }))}
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>

              {form.frequency === "weekly" && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">
                    Qual dia da semana essa tarefa deve contar?
                  </p>
                  <select
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={form.targetDayOfWeek}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, targetDayOfWeek: Number(e.target.value) }))
                    }
                  >
                    {WEEKDAY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                  onClick={handleSubmit}
                  disabled={isCreating || !form.title.trim()}
                >
                  {isCreating ? "Saving..." : "Save"}
                </button>
                <button
                  className="rounded-md border border-border px-4 py-2 text-sm"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </ContentCard>
        )}

        <Section title="All tasks" description="Your registered tasks.">
          <ContentCard>
            {isLoading ? (
              <LoadingState rows={6} />
            ) : isError ? (
              <ErrorState description={error?.message} onRetry={() => void refetch()} />
            ) : !data || data.length === 0 ? (
              <EmptyState
                title="No tasks yet"
                description="Register a task to see it appear here."
                action={
                  <ActionButton
                    leadingIcon={<Plus className="size-4" />}
                    onClick={openCreate}
                  >
                    New task
                  </ActionButton>
                }
              />
            ) : (
              <div className="flex flex-col gap-6 p-2">
                {groupedTasks.map((group) => (
                  <div key={group.frequency} className="flex flex-col gap-2">
                    {/* Header do grupo */}
                    <div className="flex items-center gap-2">
                      <FrequencyBadge frequency={group.frequency} />
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* Tarefas do grupo */}
                    <ul className="divide-y divide-border">
                      {group.tasks.map((task) => (
                        <li
                          key={task.id}
                          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{task.title}</p>
                            {task.description ? (
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                {task.description}
                              </p>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <PriorityBadge priority={task.priority} />
                            <StatusBadge status={task.status} />
                            <button
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => openEdit(task)}
                            >
                              <Pencil className="size-4" />
                            </button>
                            <button
                              className="text-muted-foreground hover:text-red-500 disabled:opacity-50"
                              onClick={() => void handleDelete(task.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </ContentCard>
        </Section>
      </PageContainer>
    </AppShell>
  );
}