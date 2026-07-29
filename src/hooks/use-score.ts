import { useAsyncResource } from "@/hooks/use-async-resource";
import { supabase } from "@/lib/supabase";
import type { AsyncResource, Score } from "@/types";

// ─── Tabela de níveis ────────────────────────────────────────────────────────

type Category = "Iniciante" | "Aprendiz" | "Dedicado" | "Experiente" | "Mestre" | "Lendário";

interface LevelInfo {
  level: number;
  category: Category;
  nextLevelAt: number;
}

const LEVEL_THRESHOLDS: { minPts: number; maxPts: number; minLevel: number; maxLevel: number; category: Category }[] = [
  { minPts: 0,    maxPts: 49,    minLevel: 1,  maxLevel: 5,   category: "Iniciante"   },
  { minPts: 50,   maxPts: 199,   minLevel: 6,  maxLevel: 15,  category: "Aprendiz"    },
  { minPts: 200,  maxPts: 499,   minLevel: 16, maxLevel: 30,  category: "Dedicado"    },
  { minPts: 500,  maxPts: 999,   minLevel: 31, maxLevel: 50,  category: "Experiente"  },
  { minPts: 1000, maxPts: 1999,  minLevel: 51, maxLevel: 75,  category: "Mestre"      },
  { minPts: 2000, maxPts: 99999, minLevel: 76, maxLevel: 100, category: "Lendário"    },
];

function getLevelInfo(total: number): LevelInfo {
  const band = LEVEL_THRESHOLDS.filter((b) => total >= b.minPts).at(-1) ?? LEVEL_THRESHOLDS[0];
  const progress = (total - band.minPts) / (band.maxPts - band.minPts);
  const levelsInBand = band.maxLevel - band.minLevel;
  const level = Math.min(band.minLevel + Math.floor(progress * levelsInBand), band.maxLevel);

  // Pontos necessários para o próximo nível dentro da banda
  const ptsPerLevel = (band.maxPts - band.minPts) / levelsInBand;
  const levelIndex = level - band.minLevel;
  const nextLevelAt = band.minPts + Math.ceil((levelIndex + 1) * ptsPerLevel);

  return { level, category: band.category, nextLevelAt };
}

// ─── Streak ──────────────────────────────────────────────────────────────────

function calculateStreak(logDates: string[]): number {
  if (logDates.length === 0) return 0;

  const uniqueDates = [...new Set(logDates)].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);

  let streak = 0;
  let cursor = today;

  for (const date of uniqueDates) {
    if (date === cursor) {
      streak++;
      const d = new Date(cursor);
      d.setDate(d.getDate() - 1);
      cursor = d.toISOString().slice(0, 10);
    } else if (date < cursor) {
      break;
    }
  }

  return streak;
}

// ─── Fetch ───────────────────────────────────────────────────────────────────

async function fetchScore(): Promise<Score> {
  const { data, error } = await supabase
    .from("task_logs")
    .select("points_earned, date, result")
    .not("result", "is", null);

  if (error) throw new Error(error.message);

  const logs = data ?? [];

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  // Início da semana (segunda-feira)
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weekStartStr = weekStart.toISOString().slice(0, 10);

  // Início do mês
  const monthStartStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  let total = 0;
  let weekly = 0;
  let monthly = 0;
  const streakDates: string[] = [];

  for (const log of logs) {
    const pts = log.points_earned ?? 0;
    total += pts;
    if (log.date >= weekStartStr && log.date <= todayStr) weekly += pts;
    if (log.date >= monthStartStr && log.date <= todayStr) monthly += pts;
    if (pts !== 0) streakDates.push(log.date);
  }

  const { level, category, nextLevelAt } = getLevelInfo(total);
  const streakDays = calculateStreak(streakDates);

  return {
    userId: "local",
    total,
    level,
    category,
    weekly,
    monthly,
    streakDays,
    nextLevelAt,
  };
}

export function useScore(): AsyncResource<Score> {
  return useAsyncResource<Score>(fetchScore, []);
}