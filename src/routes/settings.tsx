import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { ContentCard } from "@/components/cards/content-card";
import { EmptyState } from "@/components/common/empty-state";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Atlas" },
      { name: "description", content: "Manage your account and preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Account"
          title="Settings"
          description="Preferences and profile — wired to the mock user hook."
        />
        <ContentCard>
          <EmptyState
            title="Settings surface ready"
            description="Preferences, security and integrations forms land here."
          />
        </ContentCard>
      </PageContainer>
    </AppShell>
  );
}