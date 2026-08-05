import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { ContentCard } from "@/components/cards/content-card";
import { ActionButton } from "@/components/common/action-button";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { PriorityBadge } from "@/components/common/priority-badge";
import { useTasks } from "@/hooks/use-tasks";
import { useCreateTask } from "@/hooks/use-create-task";
import type { Frequency, Priority, Task } from "@/types";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — Atlas" },
      { name: "description", content: "Todas as suas tarefas." },
    ],
  }),
  component: TasksPage,
});

const FREQUENCY_ORDER: Frequency[] = ["once", "daily", "weekly", "monthly", "yearly"];

const FREQUENCY_CONFIG: Record<Frequency, { label: string; color: string; description: string }> = {
  once:    { label: "Once",    color: "#6b7280", description: "Tarefas únicas" },
  daily:   { label: "Daily",   color: "#3b82f6", description: "Repetição diária" },
  weekly:  { label: "Weekly",  color: "#8b5cf6", description: "Repetição semanal" },
  monthly: { label: "Monthly", color: "#f97316", description: "Repetição mensal" },
  yearly:  { label: "Yearly",  color: "#eab308", description: "Grandes metas anuais" },
};

const PRIORITY_BORDER: Record<Priority, string> = {
  low:    "#6b7280",
  medium: "#3b82f6",
  high:   "#f97316",
  urgent: "#ef4444",
};

const WEEKDAY_OPTIONS = [
  { label: "Domingo", value: 0 },
  { label: "Segunda", value: 1 },
  { label: "Terça",   value: 2 },
  { label: "Quarta",  value: 3 },
  { label: "Quinta",  value: 4 },
  { label: "Sexta",   value: 5 },
  { label: "Sábado",  value: 6 },
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

function TaskCard({ task }: { task: Task }) {
  const borderColor = PRIORITY_BORDER[task.priority];

  return (
    <div
      className="flex items-center justify-between gap-4 rounded-lg bg-card px-4 py-3 transition hover:brightness-110"
      style={{
        borderLeft: `3px solid ${borderColor}`,
        boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${borderColor} 15%, transparent)`,
      }}
    >
      <div className="min-w-0 flex flex-col gap-0.5">
        <p className="truncate text-sm font-medium">{task.title}</p>
        {task.description && (
          <p className="truncate text-xs text-muted-foreground">{task.description}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className="text-xs font-medium tabular-nums"
          style={{ color: borderColor }}
        >
          +{task.points}pts
        </span>
        <PriorityBadge priority={task.priority} />
      </div>
    </div>
  );
}

function FrequencyGroup({ frequency, tasks }: { frequency: Frequency; tasks: Task[] }) {
  const config = FREQUENCY_CONFIG[frequency];

  return (
    <div className="flex flex-col gap-3">
      {/* Header do grupo */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1"
          style={{
            backgroundColor: `${config.color}18`,
            border: `1px solid ${config.color}33`,
          }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <span className="text-xs font-semibold" style={{ color: config.color }}>
            {config.label}
          </span>
          <span className="text-xs" style={{ color: `${config.color}99` }}>
            {tasks.length}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{config.description}</p>
        <div className="flex-1 h-px" style={{ backgroundColor: `${config.color}22` }} />
      </div>

      {/* Tarefas */}
      <div className="flex flex-col gap-2 pl-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

function TasksPage() {
  const { data, isLoading, isError, error, refetch } = useTasks();
  const { createTask, isLoading: isCreating } = useCreateTask(() => void refetch());

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const groupedTasks = useMemo(() => {
    return FREQUENCY_ORDER.map((freq) => ({
      frequency: freq,
      tasks: (data ?? []).filter(
        (t) => t.frequency === freq && t.status !== "archived"
      ),
    })).filter((g) => g.tasks.length > 0);
  }, [data]);

  const totalTasks = (data ?? []).filter((t) => t.status !== "archived").length;

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    await createTask({
      ...form,
      targetDayOfWeek: form.frequency === "weekly" ? form.targetDayOfWeek : undefined,
    });
    setShowForm(false);
    setForm(emptyForm);
  };

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Catálogo"
          title="Tasks"
          description="Todas as suas tarefas organizadas por frequência."
          actions={
            <ActionButton
              leadingIcon={<Plus className="size-4" />}
              onClick={() => setShowForm((v) => !v)}
            >
              Nova tarefa
            </ActionButton>
          }
        />

        {/* Formulário de criação */}
        {showForm && (
          <ContentCard>
            <div className="flex flex-col gap-4 p-4">
              <p className="text-sm font-medium">Nova tarefa</p>
              <input
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Título"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
              <input
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Descrição (opcional)"
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
                    onChange={(e) => setForm((f) => ({ ...f, targetDayOfWeek: Number(e.target.value) }))}
                  >
                    {WEEKDAY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                  onClick={() => void handleSubmit()}
                  disabled={isCreating || !form.title.trim()}
                >
                  {isCreating ? "Salvando..." : "Criar"}
                </button>
                <button
                  className="rounded-md border border-border px-4 py-2 text-sm"
                  onClick={() => { setShowForm(false); setForm(emptyForm); }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </ContentCard>
        )}

        {/* Lista */}
        {isLoading ? (
          <LoadingState rows={6} />
        ) : isError ? (
          <ErrorState description={error?.message} onRetry={() => void refetch()} />
        ) : !data || totalTasks === 0 ? (
          <EmptyState
            title="Nenhuma tarefa ainda"
            description="Crie sua primeira tarefa para vê-la aqui."
            action={
              <ActionButton
                leadingIcon={<Plus className="size-4" />}
                onClick={() => setShowForm(true)}
              >
                Nova tarefa
              </ActionButton>
            }
          />
        ) : (
          <div className="flex flex-col gap-8">
            {groupedTasks.map((group) => (
              <FrequencyGroup
                key={group.frequency}
                frequency={group.frequency}
                tasks={group.tasks}
              />
            ))}
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}