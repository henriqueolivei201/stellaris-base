import { useMemo, useState } from "react";
import type { Frequency, Task, TaskLog, TaskLogResult } from "@/types";
import { getTasksForDate, calculateDailyEfficiency, efficiencyToColor } from "@/lib/calendar-logic";
import { useUpdateTaskLog } from "@/hooks/use-update-task-log";
import { FrequencyBadge } from "@/components/common/frequency-badge";

type Props = {
  date: string;
  tasks: Task[];
  logs: TaskLog[];
  onClose: () => void;
  onChanged: () => void;
};

type LocalResult = TaskLogResult | null;

const FREQUENCY_ORDER: Frequency[] = ["once", "daily", "weekly", "monthly", "yearly"];

export function DayModal({ date, tasks, logs, onClose, onChanged }: Props) {
  const { commitDay, isLoading } = useUpdateTaskLog(() => {
    onChanged();
    onClose();
  });
  const logsForDay = useMemo(() => logs.filter((l) => l.date === date), [logs, date]);
  const tasksForDay = useMemo(
    () => getTasksForDate(tasks, date, logsForDay),
    [tasks, date, logsForDay]
  );
  

  // Estado local — espelho dos logs existentes, editável sem chamar Supabase
  const [localResults, setLocalResults] = useState<Record<string, LocalResult>>(() => {
    const map: Record<string, LocalResult> = {};
    logsForDay.forEach((l) => { map[l.taskId] = l.result; });
    return map;
  });

  const getLocalResult = (taskId: string): LocalResult =>
    taskId in localResults ? localResults[taskId] : null;

  const handleToggle = (task: Task, result: TaskLogResult) => {
    setLocalResults((prev) => ({
      ...prev,
      [task.id]: prev[task.id] === result ? null : result,
    }));
  };

  const handleClear = () => {
    setLocalResults({});
  };

  const handleCommit = async () => {
    // Monta lista de tudo que mudou ou tem resultado
    const allTaskIds = new Set([
      ...tasksForDay.map((t) => t.id),
      ...logsForDay.map((l) => l.taskId),
    ]);

    const pending = Array.from(allTaskIds).map((taskId) => {
      const task = tasks.find((t) => t.id === taskId)!;
      const result = getLocalResult(taskId);
      const existingLog = logsForDay.find((l) => l.taskId === taskId);
      return { task, result, existingLog };
    });

    await commitDay(date, pending);
  };

  // Eficiência calculada com base no estado local
  const localLogs: TaskLog[] = tasksForDay.map((task) => ({
    id: "",
    taskId: task.id,
    date,
    result: getLocalResult(task.id),
    pointsEarned: 0,
    lastDeadlineCheck: null,
    createdAt: "",
    updatedAt: "",
  }));

  const efficiency = useMemo(
    () => calculateDailyEfficiency(localLogs, tasks, date),
    [localResults, tasks, date],
  );

  const efficiencyColor = efficiencyToColor(efficiency.efficiency);

  const groupedTasks = useMemo(() => {
    return FREQUENCY_ORDER.map((freq) => ({
      frequency: freq,
      tasks: tasksForDay.filter((t) => t.frequency === freq),
    })).filter((g) => g.tasks.length > 0);
  }, [tasksForDay]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-background border border-border p-4 flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {new Date(date + "T00:00:00").toLocaleDateString("pt-BR", {
              weekday: "long", day: "2-digit", month: "long",
            })}
          </p>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>

        {/* Barra de eficiência */}
        {efficiency.efficiency !== null ? (
          <div className="flex flex-col gap-1">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${efficiency.efficiency}%`, backgroundColor: efficiencyColor }}
              />
            </div>
            <p className="text-xs font-medium transition-colors duration-300" style={{ color: efficiencyColor }}>
              Eficiência: {efficiency.efficiency}%
            </p>
          </div>
        ) : (
          <div className="h-2 w-full rounded-full bg-muted" />
        )}

        {/* Lista agrupada */}
        {tasksForDay.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma tarefa cadastrada. Cadastre novas tarefas para vê-las aqui.
            </p>
          </div>
        ) : (
          <div
            className="flex flex-col gap-4 max-h-96 overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {groupedTasks.map((group) => (
              <div key={group.frequency} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FrequencyBadge frequency={group.frequency} />
                  <div className="flex-1 h-px bg-border" />
                </div>
                <ul className="flex flex-col gap-2">
                  {group.tasks.map((task) => {
                    const result = getLocalResult(task.id);
                    const isCompleted = result === "completed";
                    const isFailed = result === "failed";

                    return (
                      <li
                        key={task.id}
                        className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2"
                      >
                        <span className="truncate text-sm">{task.title}</span>
                        <div className="flex shrink-0 gap-2">
                          <button
                            disabled={isLoading}
                            onClick={() => handleToggle(task, "completed")}
                            className="rounded-md px-2 py-1 text-xs font-medium border transition-colors duration-150"
                            style={
                              isCompleted
                                ? { backgroundColor: "#22c55e", borderColor: "#22c55e", color: "#fff" }
                                : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
                            }
                          >✓</button>
                          <button
                            disabled={isLoading}
                            onClick={() => handleToggle(task, "failed")}
                            className="rounded-md px-2 py-1 text-xs font-medium border transition-colors duration-150"
                            style={
                              isFailed
                                ? { backgroundColor: "#ef4444", borderColor: "#ef4444", color: "#fff" }
                                : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
                            }
                          >✕</button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => void handleCommit()}
            disabled={isLoading}
            className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {isLoading ? "Salvando..." : "Concluir"}
          </button>
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="flex-1 rounded-md border border-border px-4 py-2 text-sm disabled:opacity-50"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}