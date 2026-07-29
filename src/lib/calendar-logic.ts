import type { Task, TaskLog, DailyEfficiency} from "@/types";

// ─── Helpers de data ──────────────────────────────────────────────────────────

function toDateOnly(date: Date): string {
  return date.toISOString().split("T")[0];
}

function daysBetween(startDate: string, targetDate: string): number {
  const start = new Date(startDate + "T00:00:00");
  const target = new Date(targetDate + "T00:00:00");
  const diffMs = target.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function getDayOfWeek(date: string): number {
  return new Date(date + "T00:00:00").getDay(); // 0 = domingo ... 6 = sábado
}

// ─── Tarefa aparece no dia? ───────────────────────────────────────────────────

export function taskAppearsOnDate(task: Task, date: string): boolean {
  if (task.status === "completed" || task.status === "archived") return false;
  if (task.frequency === "weekly") {
    return getDayOfWeek(date) === task.targetDayOfWeek;
  }
  return true;
}

// ─── É dia de prazo (só nesse dia pode negativar) ────────────────────────────

export function isDeadlineDate(task: Task, date: string): boolean {
  const diff = daysBetween(task.startDate, date);
  if (diff < 0) return false;

  switch (task.frequency) {
    case "once":
      return diff === 0;

    case "daily":
      // Todo dia é prazo (não marcar = null, marcar ✕ = negativa)
      return true;

    case "weekly":
      return getDayOfWeek(date) === task.targetDayOfWeek;

    case "monthly":
      return diff > 0 && diff % 30 === 0;

    case "yearly":
      return diff > 0 && diff % 365 === 0;

    default:
      return false;
  }
}

// ─── Filtra tarefas que aparecem numa data específica ────────────────────────

export function getTasksForDate(tasks: Task[], date: string, logs?: TaskLog[]): Task[] {
  const normalTasks = tasks.filter((task) => taskAppearsOnDate(task, date));
  const onceDone = (logs ?? [])
    .filter((log) => log.date === date && log.result !== null)
    .map((log) => tasks.find((t) => t.id === log.taskId))
    .filter((task): task is Task => 
      task !== undefined && 
      task.frequency === "once" && 
      (task.status === "completed" || task.status === "archived")
    )
    .filter((task) => !normalTasks.some((t) => t.id === task.id)); // evita duplicatas

  return [...normalTasks, ...onceDone];
}
// ─── Calcula eficiência diária a partir dos logs de um dia ───────────────────

export function calculateDailyEfficiency(
  logs: TaskLog[],
  tasks: Task[],
  date: string,
): DailyEfficiency {
  const relevant = logs.filter((log) => {
    if (log.result === null) return false;
    const task = tasks.find((t) => t.id === log.taskId);
    if (task && (task.frequency === "monthly" || task.frequency === "yearly")) {
      return isDeadlineDate(task, date);
    }
    return true;
  });

  const completed = relevant.filter((log) => log.result === "completed").length;
  const failed = relevant.filter((log) => log.result === "failed").length;
  const total = relevant.length;

  const efficiency = total === 0 ? null : Math.round((completed / total) * 100);

  return {
    date,
    efficiency,
    completed,
    failed,
    total,
  };
}

// ─── Cor linear vermelho → amarelo → verde baseada na eficiência ─────────────

export function efficiencyToColor(efficiency: number | null): string {
  if (efficiency === null) return "transparent";

  // 0% = vermelho (239, 68, 68) | 50% = amarelo (234, 179, 8) | 100% = verde (34, 197, 94)
  const red = { r: 239, g: 68, b: 68 };
  const yellow = { r: 234, g: 179, b: 8 };
  const green = { r: 34, g: 197, b: 94 };

  let start, end, t: number;

  if (efficiency <= 50) {
    start = red;
    end = yellow;
    t = efficiency / 50;
  } else {
    start = yellow;
    end = green;
    t = (efficiency - 50) / 50;
  }

  const r = Math.round(start.r + (end.r - start.r) * t);
  const g = Math.round(start.g + (end.g - start.g) * t);
  const b = Math.round(start.b + (end.b - start.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

// ─── Calcula pontos ganhos/perdidos ao marcar uma tarefa ─────────────────────

export function calculateLogPoints(
  task: Task,
  result: "completed" | "failed" | null,
  date: string,
): number {
  if (result === null) return 0;
  if (result === "completed") return task.points;

  // Failed: só negativa se for dia de prazo
  const isDeadline = isDeadlineDate(task, date);
  return isDeadline ? -task.points : 0;
}