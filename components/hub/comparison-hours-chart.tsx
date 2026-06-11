"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

export interface ComparisonChartItem {
  analista: string;
  tangerino: number;
  orange: number;
}

interface ComparisonHoursChartProps {
  data: ComparisonChartItem[];
  tangerinoLabel?: string;
  orangeLabel?: string;
  height?: number;
}

function shortName(nome: string) {
  const parts = nome.trim().split(/\s+/);
  if (parts.length <= 2) return nome;
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/80 bg-white/95 px-3 py-2 shadow-[var(--shadow-elevated)] backdrop-blur-sm">
      <p className="mb-1 text-xs font-semibold text-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs text-muted-foreground">
          <span className="font-bold" style={{ color: p.color }}>
            {p.name}:
          </span>{" "}
          {p.value.toLocaleString("pt-BR")}h
        </p>
      ))}
    </div>
  );
}

export function ComparisonHoursChart({
  data,
  tangerinoLabel = "Tangerino",
  orangeLabel = "Orange",
  height,
}: ComparisonHoursChartProps) {
  const isCompact = useMediaQuery("(max-width: 639px)");
  const chartHeight = height ?? (isCompact ? 260 : 320);

  const chartData = data
    .filter((d) => d.tangerino > 0 || d.orange > 0)
    .map((d) => ({
      ...d,
      label: isCompact ? shortName(d.analista) : d.analista,
    }));

  const scrollWidth = Math.max(chartData.length * 52, 320);

  if (chartData.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 text-sm text-muted-foreground"
        style={{ height: chartHeight }}
      >
        Sem dados para comparar
      </div>
    );
  }

  const margin = {
    top: 8,
    right: isCompact ? 8 : 12,
    left: isCompact ? -12 : -8,
    bottom: isCompact ? 52 : 24,
  };

  const bars = (
    <>
      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(15,23,42,0.06)" />
      <XAxis
        dataKey="label"
        tick={{ fontSize: isCompact ? 9 : 10, fill: "var(--ftime-muted)" }}
        tickLine={false}
        axisLine={false}
        interval={0}
        angle={isCompact ? -35 : -20}
        textAnchor="end"
        height={isCompact ? 56 : 40}
      />
      <YAxis
        tick={{ fontSize: 10, fill: "var(--ftime-muted)" }}
        tickLine={false}
        axisLine={false}
        width={32}
      />
      <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,85,0,0.04)" }} />
      <Legend
        wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
        formatter={(value) => <span className="text-muted-foreground">{value}</span>}
      />
      <Bar
        dataKey="tangerino"
        name={tangerinoLabel}
        fill="#f59e0b"
        radius={[4, 4, 0, 0]}
        maxBarSize={isCompact ? 22 : 36}
      />
      <Bar
        dataKey="orange"
        name={orangeLabel}
        fill="#ff5500"
        radius={[4, 4, 0, 0]}
        maxBarSize={isCompact ? 22 : 36}
      />
    </>
  );

  if (isCompact) {
    return (
      <div className="chart-scroll">
        <BarChart
          data={chartData}
          width={scrollWidth}
          height={chartHeight}
          margin={margin}
          barGap={2}
          barCategoryGap="18%"
        >
          {bars}
        </BarChart>
      </div>
    );
  }

  return (
    <div style={{ height: chartHeight }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={margin} barGap={2} barCategoryGap="18%">
          {bars}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
