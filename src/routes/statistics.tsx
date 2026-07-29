import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { TaskLineChart } from "@/components/statistics/line-chart";
import { useTasks } from "@/hooks/use-tasks";
import { useAllTaskLogs } from "@/hooks/use-all-task-logs";
import {
  buildOverallEfficiencySeries,
  buildTaskSeries,
} from "@/lib/statistics-logic";

export const Route = createFileRoute("/statistics")({
  head: () => ({
    meta: [
      { title: "Statistics — Atlas" },
      { name: "description", content: "Insights into your progress." },
    ],
  }),
  component: StatisticsPage,
});

function StatisticsPage() {
  const tasksResource = useTasks();
  const logsResource = useAllTaskLogs();

  const isLoading = tasksResource.isLoading || logsResource.isLoading;
  const isError = tasksResource.isError || logsResource.isError;

  const overallSeries = useMemo(
    () => buildOverallEfficiencySeries(
      logsResource.data ?? [],
      tasksResource.data ?? [],
    ),
    [logsResource.data, tasksResource.data],
  );

  const taskSeries = useMemo(
    () => (tasksResource.data ?? []).map((task) => ({
      task,
      series: buildTaskSeries(logsResource.data ?? [], task.id),
    })).filter((t) => t.series.length > 0),
    [logsResource.data, tasksResource.data],
  );

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Insights"
          title="Statistics"
          description="Sua evolução ao longo do tempo."
        />

        {isLoading ? (
          <LoadingState rows={4} />
        ) : isError ? (
          <ErrorState
            description={tasksResource.error?.message ?? logsResource.error?.message}
            onRetry={() => {
              void tasksResource.refetch();
              void logsResource.refetch();
            }}
          />
        ) : overallSeries.length === 0 && taskSeries.length === 0 ? (
          <EmptyState
            title="Nenhum dado ainda"
            description="Registre tarefas no calendário para ver sua evolução aqui."
          />
        ) : (
          <div className="flex flex-col gap-6">
            {/* Gráfico geral */}
            {overallSeries.length > 0 && (
              <Section title="Eficiência Geral" description="Média diária de todas as tarefas registradas">
                <TaskLineChart
                  title="Eficiência geral"
                  series={overallSeries}
                  valueType="efficiency"
                />
              </Section>
            )}

            {/* Gráficos por tarefa */}
            {taskSeries.length > 0 && (
              <Section title="Por tarefa" description="Histórico individual de cada tarefa">
                <div className="flex flex-col gap-4">
                  {taskSeries.map(({ task, series }) => (
                    <TaskLineChart
                      key={task.id}
                      title={task.title}
                      series={series}
                      valueType="binary"
                    />
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}