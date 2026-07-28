import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { ContentCard } from "@/components/cards/content-card";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { useTasks } from "@/hooks/use-tasks";
import { useTaskLogs } from "@/hooks/use-task-logs";
import { DayModal } from "@/components/calendar/day-modal";
import { calculateDailyEfficiency, efficiencyToColor } from "@/lib/calendar-logic";
import type { TaskLog } from "@/types";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Atlas" },
      { name: "description", content: "Your timeline of tasks and events." },
    ],
  }),
  component: CalendarPage,
});

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function toDateOnly(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function CalendarPage() {
  const today = new Date();
  const todayStr = toDateOnly(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-12
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const tasksResource = useTasks();
  const logsResource = useTaskLogs(month, year);

  const goPrevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };

  const goNextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const monthLabel = useMemo(() => {
    return new Date(year, month - 1, 1).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  }, [year, month]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstWeekday = new Date(year, month - 1, 1).getDay(); // 0 = domingo

  const isLoading = tasksResource.isLoading || logsResource.isLoading;
  const isError = tasksResource.isError || logsResource.isError;

  const logsByDate = useMemo(() => {
    const map = new Map<string, typeof logsResource.data>();
    (logsResource.data ?? []).forEach((log) => {
      const arr = map.get(log.date) ?? [];
      arr.push(log);
      map.set(log.date, arr as typeof logsResource.data);
    });
    return map;
  }, [logsResource.data]);

  const cells = useMemo(() => {
    const arr: Array<{ day: number; date: string } | null> = [];
    for (let i = 0; i < firstWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push({ day: d, date: toDateOnly(year, month, d) });
    }
    return arr;
  }, [year, month, daysInMonth, firstWeekday]);

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Timeline"
          title="Calendar"
          description="A monthly view of your commitments — click a day to log your tasks."
        />

        <ContentCard>
          {isLoading ? (
            <LoadingState rows={6} />
          ) : isError ? (
            <ErrorState
              description={tasksResource.error?.message ?? logsResource.error?.message}
              onRetry={() => {
                void tasksResource.refetch();
                void logsResource.refetch();
              }}
            />
          ) : (
            <div className="flex flex-col gap-4 p-4">
              {/* Header de navegação */}
              <div className="flex items-center justify-between">
                <button
                  onClick={goPrevMonth}
                  className="rounded-md p-2 text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <p className="text-sm font-medium capitalize">{monthLabel}</p>
                <button
                  onClick={goNextMonth}
                  className="rounded-md p-2 text-muted-foreground hover:text-foreground"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Dias da semana */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                {WEEKDAY_LABELS.map((label) => (
                  <div key={label}>{label}</div>
                ))}
              </div>

              {/* Grade de dias */}
              <div className="grid grid-cols-7 gap-1">
                {cells.map((cell, idx) => {
                  if (!cell) return <div key={`empty-${idx}`} />;

                  const dayLogs = logsByDate.get(cell.date) ?? [];
                  const efficiency = calculateDailyEfficiency(
                    dayLogs as TaskLog[],
                    tasksResource.data ?? [],
                    cell.date,
                  );
                  const bgColor =
                    efficiency.efficiency !== null
                      ? efficiencyToColor(efficiency.efficiency)
                      : undefined;

                  return (
                    <button
                      key={cell.date}
                      onClick={() => cell.date <= todayStr ? setSelectedDate(cell.date) : undefined}
                      disabled={cell.date > todayStr}
                      className="aspect-square rounded-md border border-border flex items-center justify-center text-sm transition disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80"
                      style={{
                        backgroundColor: bgColor ?? undefined,
                        opacity: cell.date > todayStr ? 0.3 : bgColor ? 0.85 : undefined,
                      }}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </ContentCard>

        {selectedDate && (
          <DayModal
            date={selectedDate}
            tasks={tasksResource.data ?? []}
            logs={logsResource.data ?? []}
            onClose={() => setSelectedDate(null)}
            onChanged={() => void logsResource.refetch()}
          />
        )}
      </PageContainer>
    </AppShell>
  );
}