import { createFileRoute } from "@tanstack/react-router";
import { Crown, Medal, Trophy } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { GlassCard } from "@/components/cards/glass-card";
import { ContentCard } from "@/components/cards/content-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { Caption, Numeric } from "@/components/common/typography";
import { useRanking } from "@/hooks/use-score";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hall-of-fame")({
  head: () => ({
    meta: [
      { title: "Hall of Fame — Atlas" },
      { name: "description", content: "The top performers this season." },
    ],
  }),
  component: HallOfFamePage,
});

const PODIUM_ICON = [Crown, Trophy, Medal];

function HallOfFamePage() {
  const { data, isLoading, isError, error, refetch } = useRanking();

  if (isLoading) {
    return (
      <AppShell>
        <PageContainer>
          <LoadingState rows={4} />
        </PageContainer>
      </AppShell>
    );
  }

  if (isError || !data) {
    return (
      <AppShell>
        <PageContainer>
          <ErrorState description={error?.message} onRetry={() => void refetch()} />
        </PageContainer>
      </AppShell>
    );
  }

  const podium = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Recognition"
          title="Hall of Fame"
          description="The top performers this season — refined glass surfaces for a premium finish."
        />

        <Section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {podium.map((entry, i) => {
              const Icon = PODIUM_ICON[i];
              return (
                <GlassCard
                  key={entry.user.id}
                  className={cn(i === 0 && "sm:scale-[1.02]")}
                >
                  <div className="flex items-center justify-between">
                    <Caption>#{entry.rank}</Caption>
                    {Icon ? <Icon className="size-4 text-primary" /> : null}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <Avatar className="size-10 ring-1 ring-white/20">
                      <AvatarFallback className="bg-primary/20 text-sm font-semibold text-primary">
                        {entry.user.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{entry.user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        @{entry.user.handle}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-end justify-between">
                    <Numeric>{entry.score.toLocaleString()}</Numeric>
                    <span className="text-xs text-muted-foreground">points</span>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </Section>

        <Section title="Full leaderboard" className="mt-8">
          <ContentCard>
            <ul className="divide-y divide-border">
              {rest.map((entry) => (
                <li
                  key={entry.user.id}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-3"
                >
                  <span className="w-6 text-right font-mono text-xs text-muted-foreground">
                    {entry.rank}
                  </span>
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-muted text-[11px] font-medium">
                        {entry.user.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{entry.user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        @{entry.user.handle}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-sm tabular-nums">
                    {entry.score.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </ContentCard>
        </Section>
      </PageContainer>
    </AppShell>
  );
}