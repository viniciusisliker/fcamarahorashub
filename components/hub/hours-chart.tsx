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
import { useMediaQuery } from "@/lib/hooks/use-media-query";

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
    <div className="chart-tooltip px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-3">
      <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">{label}</p>
      <p className="mt-0.5 text-base font-bold text-primary sm:text-lg">{payload[0].value}h</p>
    </div>
  );
}

export function HoursChart({ data }: HoursChartProps) {
  const isCompact = useMediaQuery("(max-width: 639px)");

  if (data.length === 0) {
    return (
      <div className="flex h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/30 sm:h-[260px] lg:h-[300px]">
        <p className="text-sm font-medium text-muted-foreground">
          Sem dados no período selecionado
        </p>
        <p className="mt-1 px-4 text-center text-xs text-muted-foreground/70">
          Ajuste o filtro de datas para visualizar o gráfico
        </p>
      </div>
    );
  }

  const maxHoras = Math.max(...data.map((d) => d.horas));
  const tickInterval = isCompact
    ? Math.max(0, Math.ceil(data.length / 5) - 1)
    : 0;

  return (
    <div className="h-[220px] w-full sm:h-[260px] lg:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: isCompact ? 8 : 12,
            right: isCompact ? 0 : 4,
            left: isCompact ? -22 : -16,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7744" />
              <stop offset="100%" stopColor="#ff5500" />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="var(--ftime-border)"
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: isCompact ? 9 : 11, fill: "var(--ftime-muted)" }}
            tickLine={false}
            axisLine={false}
            dy={8}
            interval={tickInterval}
          />
          <YAxis
            tick={{ fontSize: isCompact ? 9 : 11, fill: "var(--ftime-muted)" }}
            tickLine={false}
            axisLine={false}
            width={isCompact ? 28 : 36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,85,0,0.06)" }} />
          <Bar
            dataKey="horas"
            radius={[6, 6, 3, 3]}
            maxBarSize={isCompact ? 28 : 48}
          >
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
