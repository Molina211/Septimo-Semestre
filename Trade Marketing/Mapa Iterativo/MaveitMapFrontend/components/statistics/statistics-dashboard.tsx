'use client';

import { useMemo } from 'react';
import type { Waypoint, IntensityLevel } from '@/lib/models/waypoint.model';
import { getIntensityLabel } from '@/lib/models/waypoint.model';
import { getStatistics } from '@/lib/services/waypoint.service';
import { formatBogotaDateTime } from '@/lib/utils/time-utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { TrendingUp, MapPin, DollarSign, Package } from 'lucide-react';

interface StatisticsDashboardProps {
  waypoints: Waypoint[];
}

const INTENSITY_COLORS: Record<IntensityLevel, string> = {
  'very-low': '#22c55e',
  'low': '#84cc16',
  'medium': '#eab308',
  'high': '#f97316',
  'very-high': '#ef4444',
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; payload?: { color?: string } }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const formattedLabel = label ? formatBogotaDateTime(label) : '';
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs font-medium text-foreground">{formattedLabel}</p>
      {payload.map((entry, i) => {
        const color = entry.payload?.color ?? 'inherit';
        return (
          <p key={i} className="text-xs" style={{ color }}>
            {entry.name}: ${entry.value?.toLocaleString()}
          </p>
        );
      })}
    </div>
  );
}

export default function StatisticsDashboard({ waypoints }: StatisticsDashboardProps) {
  const stats = useMemo(() => getStatistics(waypoints), [waypoints]);
  const coloredSalesByLocation = useMemo(
    () => stats.salesByLocation,
    [stats.salesByLocation]
  );

  const pieData = useMemo(() => {
    const intensityEntries = Object.entries(stats.intensityDistribution) as [IntensityLevel, number][];
    return intensityEntries
      .filter(([, count]) => count > 0)
      .map(([key, count]) => ({
        name: getIntensityLabel(key),
        value: count,
        color: INTENSITY_COLORS[key],
      }));
  }, [stats.intensityDistribution]);

  if (waypoints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Sin datos para mostrar</p>
        <p className="text-xs text-muted-foreground/70">Agrega puntos de venta para ver estadisticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: 'Ventas Totales',
            value: `$${stats.totalSalesSum.toLocaleString()}`,
            icon: <DollarSign className="h-4 w-4 text-primary" />,
          },
          {
            label: 'Ubicaciones',
            value: `${stats.totalLocations}`,
            icon: <MapPin className="h-4 w-4 text-accent" />,
          },
          {
            label: 'Promedio',
            value: `$${Math.round(stats.avgSales).toLocaleString()}`,
            icon: <TrendingUp className="h-4 w-4 text-chart-3" />,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="flex flex-col items-center justify-center gap-1 rounded-lg border border-border bg-secondary/30 px-4 py-3 text-center"
          >
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {card.icon}
              <span>{card.label}</span>
            </div>
            <p className="text-[16px] font-bold text-foreground leading-tight">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Sales by Location - Bar Chart */}
      <div className="rounded-lg border border-border bg-secondary/20 p-4">
        <h4 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Ventas por Ubicacion
        </h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={coloredSalesByLocation} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="label"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" name="Ventas" radius={[4, 4, 0, 0]}>
                {coloredSalesByLocation.map((entry) => (
                  <Cell key={`${entry.label}-${entry.sales}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Intensity Distribution - Pie Chart */}
      <div className="rounded-lg border border-border bg-secondary/20 p-4">
        <h4 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Distribucion por Intensidad
        </h4>
        <div className="flex items-center gap-4">
          <div className="h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-1.5">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: entry.color }}
                />
                <span className="text-xs text-foreground">{entry.name}</span>
                <span className="text-xs font-semibold text-muted-foreground">
                  ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Sales - Line Chart */}
      {stats.dailySales.length > 1 && (
        <div className="rounded-lg border border-border bg-secondary/20 p-4">
          <h4 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Ventas por Dia
          </h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.dailySales} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                  tickFormatter={(value) => formatBogotaDateTime(value)}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total Ventas"
                  stroke="oklch(0.72 0.19 55)"
                  strokeWidth={2}
                  dot={{ fill: 'oklch(0.72 0.19 55)', strokeWidth: 0, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Products */}
      <div className="rounded-lg border border-border bg-secondary/20 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Package className="h-3.5 w-3.5 text-primary" />
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Top Productos
          </h4>
        </div>
        <div className="space-y-2">
          {stats.topProducts.slice(0, 8).map((product, idx) => {
            const maxRevenue = stats.topProducts[0]?.revenue || 1;
            const widthPercent = (product.revenue / maxRevenue) * 100;
            return (
              <div key={product.name}>
                <div className="mb-0.5 flex items-center justify-between">
                  <span className="text-xs text-foreground">
                    <span className="mr-1.5 text-muted-foreground">{idx + 1}.</span>
                    {product.name}
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    ${product.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${widthPercent}%`,
                      background: `linear-gradient(90deg, oklch(0.65 0.2 250), oklch(0.72 0.19 55))`,
                    }}
                  />
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {product.quantity} unidades vendidas
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
