"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { cn } from "@/lib/utils";

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
  emptyMessage?: string;
}

const TANGERINO_COLOR = "#f59e0b";
const ORANGE_COLOR = "#ff5500";

function shortName(nome: string) {
  const parts = nome.trim().split(/\s+/);
  if (parts.length <= 2) return nome;
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

function ChartLegend({
  tangerinoLabel,
  orangeLabel,
  className,
}: {
  tangerinoLabel: string;
  orangeLabel: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-end gap-4", className)}>
      <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span
          className="h-2.5 w-2.5 rounded-sm"
          style={{ backgroundColor: TANGERINO_COLOR }}
          aria-hidden
        />
        {tangerinoLabel}
      </span>
      <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span
          className="h-2.5 w-2.5 rounded-sm"
          style={{ backgroundColor: ORANGE_COLOR }}
          aria-hidden
        />
        {orangeLabel}
      </span>
    </div>
  );
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
    <div className="chart-tooltip px-3 py-2 backdrop-blur-sm">
      <p className="mb-1.5 text-xs font-semibold text-foreground">{label}</p>
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
  emptyMessage = "Sem dados para comparar",
}: ComparisonHoursChartProps) {
  const isCompact = useMediaQuery("(max-width: 639px)");
  const chartHeight = height ?? (isCompact ? 280 : 340);

  const chartData = data
    .filter((d) => d.tangerino > 0 || d.orange > 0)
    .map((d) => ({
      ...d,
      label: shortName(d.analista),
      fullName: d.analista,
    }));

  const scrollWidth = Math.max(chartData.length * 56, 360);

  if (chartData.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 text-sm text-muted-foreground"
        style={{ height: chartHeight }}
      >
        {emptyMessage}
      </div>
    );
  }

  const margin = {
    top: 12,
    right: isCompact ? 8 : 16,
    left: isCompact ? -8 : -4,
    bottom: isCompact ? 64 : 72,
  };

  if (isCompact) {
    return (
      <div className="space-y-2">
        <ChartLegend tangerinoLabel={tangerinoLabel} orangeLabel={orangeLabel} />
        <div className="chart-scroll min-h-[280px]">
          <BarChart
            data={chartData}
            width={scrollWidth}
            height={chartHeight}
            margin={margin}
            barGap={3}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(15,23,42,0.06)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: "var(--ftime-muted)" }}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-40}
              textAnchor="end"
              height={72}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--ftime-muted)" }}
              tickLine={false}
              axisLine={false}
              width={36}
              tickFormatter={(v) => `${v}h`}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "rgba(255,85,0,0.04)" }}
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload as { fullName?: string; label?: string } | undefined;
                return item?.fullName ?? item?.label ?? "";
              }}
            />
            <Bar
              dataKey="tangerino"
              name={tangerinoLabel}
              fill={TANGERINO_COLOR}
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />
            <Bar
              dataKey="orange"
              name={orangeLabel}
              fill={ORANGE_COLOR}
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />
          </BarChart>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ChartLegend tangerinoLabel={tangerinoLabel} orangeLabel={orangeLabel} />
      <div className="h-[340px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={margin} barGap={3} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(15,23,42,0.06)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "var(--ftime-muted)" }}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-32}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--ftime-muted)" }}
              tickLine={false}
              axisLine={false}
              width={36}
              tickFormatter={(v) => `${v}h`}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "rgba(255,85,0,0.04)" }}
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload as { fullName?: string; label?: string } | undefined;
                return item?.fullName ?? item?.label ?? "";
              }}
            />
            <Bar
              dataKey="tangerino"
              name={tangerinoLabel}
              fill={TANGERINO_COLOR}
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="orange"
              name={orangeLabel}
              fill={ORANGE_COLOR}
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
