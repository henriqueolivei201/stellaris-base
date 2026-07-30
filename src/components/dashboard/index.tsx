import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Star, CheckCircle, ListTodo, Flame } from "lucide-react";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { MetricCard } from "@/components/cards/metric-card";
import { ResponsiveGrid } from "@/components/common/responsive-grid";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { useTasks } from "@/hooks/use-tasks";
import { useTaskLogs } from "@/hooks/use-task-logs";
import { useScore } from "@/hooks/use-score";
import { calculateDailyEfficiency } from "@/lib/calendar-logic";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
            { title: "Dashboard — Atlas" },
            { name: "description", content: "A snapshot of your day." },
        ],
    }),
    component: DashboardPage,
});

function DashboardPage() {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const tasksResource = useTasks();
    const logsResource = useTaskLogs(today.getMonth() + 1, today.getFullYear());
    const scoreResource = useScore();
    
    useEffect(() => {
        const handleFocus = () => {
            void tasksResource.refetch();
            void logsResource.refetch();
            void scoreResource.refetch();
        };
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    const isLoading = tasksResource.isLoading || logsResource.isLoading || scoreResource.isLoading;
    const isError = tasksResource.isError || logsResource.isError || scoreResource.isError;

    const todayLogs = useMemo(
        () => (logsResource.data ?? []).filter((l) => l.date === todayStr),
        [logsResource.data, todayStr],
    );

    const todayEfficiency = useMemo(
        () => calculateDailyEfficiency(todayLogs, tasksResource.data ?? [], todayStr),
        [todayLogs, tasksResource.data, todayStr],
    );

    const activeTasks = useMemo(
        () => (tasksResource.data ?? []).filter(
            (t) => t.status === "pending" || t.status === "in_progress"
        ).length,
        [tasksResource.data],
    );
    

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    eyebrow="Overview"
                    title="Dashboard"
                    description="A snapshot of your day — focus, momentum and next actions."
                />

                {isLoading ? (
                    <LoadingState rows={3} />
                ) : isError ? (
                    <ErrorState
                        description={tasksResource.error?.message ?? logsResource.error?.message ?? scoreResource.error?.message}
                        onRetry={() => {
                            void tasksResource.refetch();
                            void logsResource.refetch();
                            void scoreResource.refetch();
                        }}
                    />
                ) : (
                    <ResponsiveGrid base={1} sm={2} lg={4}>
                        <MetricCard
                            label="Score"
                            value={scoreResource.data?.total.toLocaleString() ?? "0"}
                            hint={`Level ${scoreResource.data?.level} — ${scoreResource.data?.category}`}
                            icon={<Star className="size-4" />}
                        />
                        <MetricCard
                            label="Completion"
                            value={todayEfficiency.efficiency !== null ? `${todayEfficiency.efficiency}%` : "—"}
                            hint="Eficiência de hoje"
                            icon={<CheckCircle className="size-4" />}
                        />
                        <MetricCard
                            label="Active Tasks"
                            value={activeTasks}
                            hint="Tarefas pendentes ou em progresso"
                            icon={<ListTodo className="size-4" />}
                        />
                        <MetricCard
                            label="Streak"
                            value={`${scoreResource.data?.streakDays ?? 0}d`}
                            hint="Dias consecutivos com registros"
                            icon={<Flame className="size-4" />}
                        />
                    </ResponsiveGrid>
                )}
            </PageContainer>
        </AppShell>
    );
}