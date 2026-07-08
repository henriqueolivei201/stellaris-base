import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

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
import { useTasks } from "@/hooks/use-tasks";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — Atlas" },
      { name: "description", content: "Register and manage your tasks." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const { data, isLoading, isError, error, refetch } = useTasks();

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Workspace"
          title="Task registration"
          description="Capture, prioritise and track everything in one focused surface."
          actions={<ActionButton leadingIcon={<Plus className="size-4" />}>New task</ActionButton>}
        />

        <Section
          title="All tasks"
          description="Business logic (create, update, filter) is intentionally left for the next iteration."
        >
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
                  <ActionButton leadingIcon={<Plus className="size-4" />}>
                    New task
                  </ActionButton>
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {data.map((task) => (
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
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ContentCard>
        </Section>
      </PageContainer>
    </AppShell>
  );
}