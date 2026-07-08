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
import { Progress } from "@/components/ui/progress";
import { useScore } from "@/hooks/use-score";

export const Route = createFileRoute("/score")({
  head: () => ({
    meta: [
      { title: "Score — Atlas" },
      { name: "description", content: "Your progress and momentum." },
    ],
  }),
  component: ScorePage,
});

function ScorePage() {
  const { data, isLoading, isError, error, refetch } = useScore();

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Progress"
          title="Score"
          description="How your effort compounds over time."
        />

        {isLoading ? (
          <LoadingState rows={3} />
        ) : isError ? (
          <ErrorState description={error?.message} onRetry={() => void refetch()} />
        ) : data ? (
          <div className="flex flex-col gap-8">
            <ResponsiveGrid base={1} sm={2} lg={4}>
              <MetricCard label="Total score" value={data.total.toLocaleString()} delta={4} />
              <MetricCard label="This week" value={data.weekly} delta={12} />
              <MetricCard label="This month" value={data.monthly.toLocaleString()} delta={8} />
              <MetricCard label="Streak" value={`${data.streakDays}d`} delta={0} />
            </ResponsiveGrid>

            <Section title={`Level ${data.level}`} description="Progress to next level">
              <ContentCard>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{data.total.toLocaleString()} pts</span>
                    <span>{data.nextLevelAt.toLocaleString()} pts</span>
                  </div>
                  <Progress
                    value={(data.total / data.nextLevelAt) * 100}
                    aria-label="Level progress"
                  />
                </div>
              </ContentCard>
            </Section>
          </div>
        ) : null}
      </PageContainer>
    </AppShell>
  );
}