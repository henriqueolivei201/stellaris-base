import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { ContentCard } from "@/components/cards/content-card";
import { EmptyState } from "@/components/common/empty-state";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Atlas" },
      { name: "description", content: "Your timeline of tasks and events." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Timeline"
          title="Calendar"
          description="A monthly view of your commitments — logic wires up in the next iteration."
        />
        <ContentCard>
          <EmptyState
            icon={CalendarDays}
            title="Calendar surface ready"
            description="Scheduling, drag-and-drop and recurrence rules will land here."
          />
        </ContentCard>
      </PageContainer>
    </AppShell>
  );
}