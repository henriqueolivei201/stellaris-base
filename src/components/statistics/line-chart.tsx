import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { PeriodOption, SeriesPoint } from "@/lib/statistics-logic";
import { filterPointsByPeriod } from "@/lib/statistics-logic";

type Props = {
  title: string;
  series: SeriesPoint[];
  valueType: "efficiency" | "binary";
};

const PERIODS: { label: string; value: PeriodOption }[] = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "3M", value: "3m" },
  { label: "1A", value: "1y" },
  { label: "Tudo", value: "all" },
];

export function TaskLineChart({ title, series, valueType }: Props) {
  const [period, setPeriod] = useState<PeriodOption>("30d");

  const filtered = useMemo(
    () => filterPointsByPeriod(series, period),
    [series, period],
  );

  const isEmpty = filtered.length === 0;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium truncate">{title}</p>
        <div className="flex shrink-0 gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className="rounded-md px-2 py-0.5 text-xs transition"
              style={
                period === p.value
                  ? { backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }
                  : { color: "var(--muted-foreground)" }
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico */}
      {isEmpty ? (
        <div className="flex h-32 items-center justify-center">
          <p className="text-xs text-muted-foreground">
            Nenhum registro neste período.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={filtered} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              hide
              tick={false}
            />
            <YAxis
              domain={valueType === "binary" ? [0, 1] : [0, 100]}
              ticks={valueType === "binary" ? [0, 1] : [0, 25, 50, 75, 100]}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0].payload as SeriesPoint;
                const val = valueType === "binary"
                  ? point.value === 1 ? "Feito ✓" : "Não feito ✕"
                  : `${point.value}%`;
                return (
                  <div className="rounded-md border border-border bg-background px-2 py-1 text-xs">
                    <p className="text-muted-foreground">{point.date}</p>
                    <p className="font-medium">{val}</p>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--primary)" }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Contagem */}
      {!isEmpty && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} registro{filtered.length !== 1 ? "s" : ""} neste período
        </p>
      )}
    </div>
  );
}