"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface HoursChartProps {
  data: { label: string; horas: number }[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/80 bg-white/95 px-4 py-3 shadow-[var(--shadow-elevated)] backdrop-blur-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-primary">{payload[0].value}h</p>
    </div>
  );
}

export function HoursChart({ data }: HoursChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/30">
        <p className="text-sm font-medium text-muted-foreground">
          Sem dados no período selecionado
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Ajuste o filtro de datas para visualizar o gráfico
        </p>
      </div>
    );
  }

  const maxHoras = Math.max(...data.map((d) => d.horas));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7744" />
              <stop offset="100%" stopColor="#ff5500" />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="rgba(15,23,42,0.06)"
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--ftime-muted)" }}
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--ftime-muted)" }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,85,0,0.06)" }} />
          <Bar dataKey="horas" radius={[8, 8, 4, 4]} maxBarSize={48}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.horas === maxHoras ? "url(#barGradient)" : "rgba(255,85,0,0.35)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
