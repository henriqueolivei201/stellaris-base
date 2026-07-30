import { createFileRoute } from "@tanstack/react-router";
import { Activity, CheckCircle2, Flame, Sparkles } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { MetricCard } from "@/components/cards/metric-card";
import { ContentCard } from "@/components/cards/content-card";
import { ResponsiveGrid } from "@/components/common/responsive-grid";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { StatusBadge } from "@/components/common/status-badge";
import { PriorityBadge } from "@/components/common/priority-badge";
import { ActionButton } from "@/components/common/action-button";
import { useTasks } from "@/hooks/use-tasks";
import { useScore } from "@/hooks/use-score";
import { useTaskLogs } from "@/hooks/use-task-logs";
import { calculateDailyEfficiency } from "@/lib/calendar-logic";
import { useMemo, useEffect } from "react";
import { CreateTaskForm } from "@/components/forms/create-task-form";
import { useUpdateTask } from "@/hooks/use-update-task";


export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const tasks = useTasks();
const score = useScore();
const logs = useTaskLogs(today.getMonth() + 1, today.getFullYear());
const taskActions = useUpdateTask(() => void tasks.refetch());

const todayLogs = useMemo(
  () => (logs.data ?? []).filter((l) => l.date === todayStr),
  [logs.data, todayStr],
);

const todayEfficiency = useMemo(
  () => calculateDailyEfficiency(todayLogs, tasks.data ?? [], todayStr),
  [todayLogs, tasks.data, todayStr],
);

const activeTasks = useMemo(
  () => (tasks.data ?? []).filter(
    (t) => t.status === "pending" || t.status === "in_progress"
  ).length,
  [tasks.data],
);

useEffect(() => {
  const handleFocus = () => {
    void tasks.refetch();
    void logs.refetch();
    void score.refetch();
  };
  window.addEventListener("focus", handleFocus);
  return () => window.removeEventListener("focus", handleFocus);
}, []);

 

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Overview"
          title="Dashboard"
          description="A snapshot of your day — focus, momentum and next actions."
          
        />

        <div className="flex flex-col gap-8">
          <ResponsiveGrid base={1} sm={2} lg={4}>
            <MetricCard
              label="Score"
              value={score.data?.total.toLocaleString() ?? "—"}
              delta={4}
              hint={`Level ${score.data?.level ?? "—"}`}
              icon={<Sparkles className="size-4" />}
            />
            <MetricCard
              label="Completion"
             value={todayEfficiency.efficiency !== null ? `${todayEfficiency.efficiency}%` : "—"}
              delta={2}
              icon={<CheckCircle2 className="size-4" />}
            />
            <MetricCard
              label="Active tasks"
              value={activeTasks}
              delta={-1}
              icon={<Activity className="size-4" />}
            />
            <MetricCard
              label="Streak"
              value={`${score.data?.streakDays ?? 0}d`}
              delta={0}
              icon={<Flame className="size-4" />}
            />
          </ResponsiveGrid>

          <Section
            title="Today's queue"
            description="Your prioritised list — plan, then execute."
          >
            <ContentCard>
              <CreateTaskForm onSuccess={() => void tasks.refetch()} />
              {tasks.isLoading ? (
                <LoadingState rows={4} />
              ) : tasks.isError ? (
                <ErrorState
                  description={tasks.error?.message}
                  onRetry={() => void tasks.refetch()}
                />
              ) : !tasks.data || tasks.data.length === 0 ? (
                <EmptyState
                  title="Nothing on the queue"
                  description="Register your first task to see it here."
                />
              ) : (
                <ul className="divide-y divide-border">
                  {tasks.data.map((task) => (

                    <li
                      key={task.id}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {task.title}
                        </p>
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
                          className="text-xs text-green-500 hover:underline disabled:opacity-50"
                          disabled={task.status === 'completed' || taskActions.isLoading}
                          onClick={() => void taskActions.updateStatus(task.id, 'completed')}
                        >
                          ✓
                        </button>
                        <button
                          className="text-xs text-yellow-500 hover:underline disabled:opacity-50"
                          disabled={task.status === 'pending' || taskActions.isLoading}
                          onClick={() => void taskActions.updateStatus(task.id, 'pending')}
                        >
                          ↩
                        </button>
                        <button
                          className="text-xs text-red-500 hover:underline disabled:opacity-50"
                          disabled={taskActions.isLoading}
                          onClick={() => void taskActions.deleteTask(task.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ContentCard>
          </Section>
        </div>
      </PageContainer>
    </AppShell>
  );
}
