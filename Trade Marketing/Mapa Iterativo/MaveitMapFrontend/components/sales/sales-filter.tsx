'use client';

import type {
  SalesFilter,
  IntensityLevel,
  IntensitySortDirection,
} from '@/lib/models/waypoint.model';
import { getIntensityColor, getIntensityLabel } from '@/lib/models/waypoint.model';
import { Search, RotateCcw } from 'lucide-react';

interface SalesFilterProps {
  filter: SalesFilter;
  onFilterChange: (filter: SalesFilter) => void;
}

const INTENSITIES: IntensityLevel[] = [
  'very-low',
  'low',
  'medium',
  'high',
  'very-high',
];

const TIME_PRESETS = [
  { label: '1D', days: 1 },
  { label: '5D', days: 5 },
  { label: '1M', months: 1 },
  { label: '6M', months: 6 },
  { label: '1A', years: 1 },
  { label: '5A', years: 5 },
  { label: 'Máx.', max: true },
];

const toInputDate = (date: Date) => date.toISOString().split('T')[0];

const buildRange = (preset: typeof TIME_PRESETS[number]) => {
  if (preset.max) {
    return { dateFrom: '', dateTo: '' };
  }
  const now = new Date();
  const base = new Date(now);
  base.setHours(0, 0, 0, 0);
  if (preset.days) {
    base.setDate(base.getDate() - preset.days);
  }
  if (preset.months) {
    base.setMonth(base.getMonth() - preset.months);
  }
  if (preset.years) {
    base.setFullYear(base.getFullYear() - preset.years);
  }
  return {
    dateFrom: toInputDate(base),
    dateTo: toInputDate(now),
  };
};

const DEFAULT_FILTER: SalesFilter = {
  dateFrom: '',
  dateTo: '',
  minSales: 0,
  maxSales: 0,
  intensities: [],
  searchTerm: '',
  intensitySort: null,
};

export default function SalesFilterPanel({ filter, onFilterChange }: SalesFilterProps) {
  const sortOptions: Array<{ label: string; value: IntensitySortDirection }> = [
    { label: 'Muy baja → Muy alta', value: 'asc' },
    { label: 'Muy alta → Muy baja', value: 'desc' },
  ];

  const toggleIntensity = (intensity: IntensityLevel) => {
    const current = filter.intensities;
    const updated = current.includes(intensity)
      ? current.filter((i) => i !== intensity)
      : [...current, intensity];
    onFilterChange({ ...filter, intensities: updated });
  };

  const applyPreset = (preset: typeof TIME_PRESETS[number]) => {
    const range = buildRange(preset);
    onFilterChange({ ...filter, dateFrom: range.dateFrom, dateTo: range.dateTo });
  };

  const activePreset = TIME_PRESETS.find((preset) => {
    const range = buildRange(preset);
    if (preset.max) {
      return !filter.dateFrom && !filter.dateTo;
    }
    return filter.dateFrom === range.dateFrom && filter.dateTo === range.dateTo;
  });

  const resetFilters = () => onFilterChange(DEFAULT_FILTER);

  return (
      <div className="flex flex-col gap-6 px-1 pb-2">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={filter.searchTerm}
          onChange={(e) => onFilterChange({ ...filter, searchTerm: e.target.value })}
          placeholder="Buscar por nombre o producto..."
          className="w-full rounded-lg border border-border bg-input py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Date range */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Rango de fechas
        </label>
        <div className="mb-2 flex flex-wrap gap-2">
          {TIME_PRESETS.map((preset) => {
            const isActive = activePreset?.label === preset.label;
            return (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset)}
                className={`text-xs font-semibold uppercase tracking-wide rounded-full px-3 py-1 transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={filter.dateFrom}
            onChange={(e) => onFilterChange({ ...filter, dateFrom: e.target.value })}
            className="flex-1 max-w-[140px] rounded-lg border border-border bg-input px-2.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="date"
            value={filter.dateTo}
            onChange={(e) => onFilterChange({ ...filter, dateTo: e.target.value })}
            className="flex-1 max-w-[140px] rounded-lg border border-border bg-input px-2.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Sales range */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Rango de ventas ($)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            min={0}
            value={filter.minSales || ''}
            onChange={(e) =>
              onFilterChange({ ...filter, minSales: parseInt(e.target.value) || 0 })
            }
            placeholder="Min"
            className="flex-1 max-w-[140px] rounded-lg border border-border bg-input px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="number"
            min={0}
            value={filter.maxSales || ''}
            onChange={(e) =>
              onFilterChange({ ...filter, maxSales: parseInt(e.target.value) || 0 })
            }
            placeholder="Max"
            className="flex-1 max-w-[140px] rounded-lg border border-border bg-input px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Intensity filter */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Intensidad de ventas
        </label>
        <div className="flex flex-wrap justify-center gap-3">
          {INTENSITIES.map((intensity) => {
            const isActive = filter.intensities.includes(intensity);
            const color = getIntensityColor(intensity);
            return (
              <button
                key={intensity}
                onClick={() => toggleIntensity(intensity)}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'border border-transparent'
                    : 'border border-border text-muted-foreground hover:border-border/80'
                }`}
                style={
                  isActive
                    ? { background: `${color}22`, color, borderColor: `${color}44` }
                    : undefined
                }
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: color }}
                />
                {getIntensityLabel(intensity)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Intensity sort */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Ordenar intensidad
        </label>
        <div className="flex gap-2">
          {sortOptions.map((option) => {
            const isActive = filter.intensitySort === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  onFilterChange({
                    ...filter,
                    intensitySort: isActive ? null : option.value,
                  })
                }
                className={`flex-1 rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={resetFilters}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <RotateCcw className="h-3 w-3" />
        Limpiar filtros
      </button>
    </div>
  );
}
