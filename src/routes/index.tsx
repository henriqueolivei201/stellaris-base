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
import { useStatistics } from "@/hooks/use-statistics";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  const tasks = useTasks();
  const score = useScore();
  const stats = useStatistics();

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Overview"
          title="Dashboard"
          description="A snapshot of your day — focus, momentum and next actions."
          actions={<ActionButton leadingIcon={<Sparkles className="size-4" />}>New task</ActionButton>}
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
              value={
                stats.data
                  ? `${Math.round(stats.data.completionRate * 100)}%`
                  : "—"
              }
              delta={2}
              icon={<CheckCircle2 className="size-4" />}
            />
            <MetricCard
              label="Active tasks"
              value={stats.data?.totals.active ?? "—"}
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
