import type { Frequency } from "@/types";

const FREQUENCY_CONFIG: Record<Frequency, { label: string; color: string }> = {
  once: { label: "Once", color: "#6b7280" },       // cinza
  daily: { label: "Daily", color: "#3b82f6" },      // azul
  weekly: { label: "Weekly", color: "#8b5cf6" },    // roxo
  monthly: { label: "Monthly", color: "#f97316" },  // laranja
  yearly: { label: "Yearly", color: "#eab308" },    // dourado
};

type Props = {
  frequency: Frequency;
};

export function FrequencyBadge({ frequency }: Props) {
  const config = FREQUENCY_CONFIG[frequency];

  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `${config.color}22`,
        color: config.color,
        border: `1px solid ${config.color}44`,
      }}
    >
      {config.label}
    </span>
  );
}