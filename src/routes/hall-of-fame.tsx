import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { supabase } from "@/lib/supabase";
import type { Task, TaskLog } from "@/types";

export const Route = createFileRoute("/hall-of-fame")({
  head: () => ({
    meta: [
      { title: "Hall of Fame — Atlas" },
      { name: "description", content: "Suas grandes conquistas." },
    ],
  }),
  component: HallOfFamePage,
});

type Achievement = {
  task: Task;
  log: TaskLog;
};

function AchievementCard({ achievement, onDelete, onRename }: {
  achievement: Achievement;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(achievement.task.title);
  const [draft, setDraft] = useState(title);

  const handleSave = () => {
    if (draft.trim() && draft !== title) {
      setTitle(draft.trim());
      onRename(draft.trim());
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(title);
    setEditing(false);
  };

  const formattedDate = new Date(achievement.log.date + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="group relative h-48 cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => !editing && setFlipped((f) => !f)}
    >
      <div
        className="relative h-full w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Frente */}
        <div
          className="absolute inset-0 rounded-2xl border-2 p-5 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            borderColor: "#f59e0b",
            background: "linear-gradient(135deg, color-mix(in oklab, #f59e0b 8%, var(--card)), var(--card))",
            boxShadow: "0 0 24px color-mix(in oklab, #f59e0b 20%, transparent)",
          }}
        >
          {/* Ações */}
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs text-amber-500/80 font-medium tracking-wide uppercase">
              Conquista
            </span>
            <div
              className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                onClick={() => { setEditing(true); setDraft(title); }}
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                className="rounded-md p-1 text-muted-foreground hover:text-red-500"
                onClick={onDelete}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Título */}
          <div onClick={(e) => e.stopPropagation()}>
            {editing ? (
              <div className="flex flex-col gap-2">
                <input
                  autoFocus
                  className="rounded-md border border-border bg-background px-2 py-1 text-sm font-semibold w-full"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") handleCancel();
                  }}
                />
                <div className="flex gap-1">
                  <button
                    className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground"
                    onClick={handleSave}
                  >
                    <Check className="size-3" /> Salvar
                  </button>
                  <button
                    className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs"
                    onClick={handleCancel}
                  >
                    <X className="size-3" /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-lg font-bold leading-snug">{title}</p>
            )}
          </div>

          {/* Hint de flip */}
          {!editing && (
            <p className="text-xs text-muted-foreground">Clique para ver a data</p>
          )}
        </div>

        {/* Verso */}
        <div
          className="absolute inset-0 rounded-2xl border-2 p-5 flex flex-col items-center justify-center gap-2"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderColor: "#f59e0b",
            background: "linear-gradient(135deg, color-mix(in oklab, #f59e0b 8%, var(--card)), var(--card))",
            boxShadow: "0 0 24px color-mix(in oklab, #f59e0b 20%, transparent)",
          }}
        >
          <p className="text-xs text-amber-500/80 font-medium tracking-wide uppercase">
            Conquistado em
          </p>
          <p className="text-xl font-bold text-center">{formattedDate}</p>
          <p className="text-xs text-muted-foreground mt-2">Clique para voltar</p>
        </div>
      </div>
    </div>
  );
}

function HallOfFamePage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchAchievements = async () => {
    setIsLoading(true);
    setIsError(false);

    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .eq("frequency", "yearly")
      .eq("status", "completed");

    if (tasksError) { setIsError(true); setIsLoading(false); return; }

    if (!tasks || tasks.length === 0) {
      setAchievements([]);
      setIsLoading(false);
      return;
    }

    const taskIds = tasks.map((t) => t.id);

    const { data: logs, error: logsError } = await supabase
      .from("task_logs")
      .select("*")
      .in("task_id", taskIds)
      .eq("result", "completed");

    if (logsError) { setIsError(true); setIsLoading(false); return; }

    const result: Achievement[] = tasks
  .map((task) => {
    const log = (logs ?? []).find((l) => l.task_id === task.id);
    if (!log) return null;
    return {
      task: task as unknown as Task,
      log: {
        id: log.id,
        taskId: log.task_id,
        date: log.date,
        result: log.result,
        pointsEarned: log.points_earned ?? null,
        lastDeadlineCheck: log.last_deadline_check ?? null,
        createdAt: log.created_at,
        updatedAt: log.updated_at,
      } as TaskLog,
    };
  })
  .filter((a): a is Achievement => a !== null);

    setAchievements(result);
    setIsLoading(false);
  };

  useEffect(() => { void fetchAchievements(); }, []);

  const handleDelete = async (achievement: Achievement) => {
    if (!confirm(`Remover "${achievement.task.title}" do Hall of Fame?`)) return;

    // Deleta o log
    await supabase.from("task_logs").delete().eq("id", achievement.log.id);

    // Volta status da task para pending
    await supabase
      .from("tasks")
      .update({ status: "pending", updated_at: new Date().toISOString() })
      .eq("id", achievement.task.id);

    void fetchAchievements();
  };

  const handleRename = async (achievement: Achievement, newTitle: string) => {
    await supabase
      .from("tasks")
      .update({ title: newTitle, updated_at: new Date().toISOString() })
      .eq("id", achievement.task.id);

    void fetchAchievements();
  };

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Recognition"
          title="Hall of Fame"
          description="Suas grandes conquistas — metas anuais que você eternizou."
        />

        {isLoading ? (
          <LoadingState rows={3} />
        ) : isError ? (
          <ErrorState onRetry={() => void fetchAchievements()} />
        ) : achievements.length === 0 ? (
          <EmptyState
            title="Nenhuma conquista ainda"
            description="Conclua uma meta anual no calendário para eternizá-la aqui."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.log.id}
                achievement={achievement}
                onDelete={() => void handleDelete(achievement)}
                onRename={(newTitle) => void handleRename(achievement, newTitle)}
              />
            ))}
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}