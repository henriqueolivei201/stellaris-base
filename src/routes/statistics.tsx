import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { MetricCard } from "@/components/cards/metric-card";
import { ContentCard } from "@/components/cards/content-card";
import { ResponsiveGrid } from "@/components/common/responsive-grid";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { useStatistics } from "@/hooks/use-statistics";

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
  const { data, isLoading, isError, error, refetch } = useStatistics();

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Insights"
          title="Statistics"
          description="Aggregated performance — charts are intentionally deferred."
        />

        {isLoading ? (
          <LoadingState rows={4} />
        ) : isError ? (
          <ErrorState description={error?.message} onRetry={() => void refetch()} />
        ) : !data ? (
          <EmptyState title="No data" />
        ) : (
          <div className="flex flex-col gap-8">
            <ResponsiveGrid base={2} sm={2} lg={4}>
              <MetricCard label="Total" value={data.totals.tasks} />
              <MetricCard label="Completed" value={data.totals.completed} delta={5} />
              <MetricCard label="Active" value={data.totals.active} />
              <MetricCard label="Overdue" value={data.totals.overdue} delta={-2} />
            </ResponsiveGrid>

            <Section title="Weekly trend" description="Completed tasks per day">
              <ContentCard>
                <ul className="grid grid-cols-7 gap-2">
                  {data.weeklyTrend.map((d) => (
                    <li key={d.label} className="flex flex-col items-center gap-2">
                      <div className="flex h-24 w-full items-end rounded-md bg-muted/60 p-1">
                        <div
                          className="w-full rounded-sm bg-primary/80 transition-all duration-300 ease-in-out"
                          style={{ height: `${(d.value / 8) * 100}%` }}
                          aria-label={`${d.label}: ${d.value}`}
                        />
                      </div>
                      <span className="text-[11px] text-muted-foreground">{d.label}</span>
                    </li>
                  ))}
                </ul>
              </ContentCard>
            </Section>
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}