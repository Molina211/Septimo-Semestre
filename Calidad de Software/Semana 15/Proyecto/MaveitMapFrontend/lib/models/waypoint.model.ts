import type { CatalogProductApi } from './catalog-product.model';

export interface ProductSale {
  id: string;
  productId?: number;
  product?: CatalogProductApi | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  priceSource: 'base' | 'custom';
  active?: boolean;
}

export interface SalesGroupReference {
  id: string;
  quantity: number;
  saleDateTime: string;
  product?: CatalogProductApi | null;
}

export interface SalesEntry {
  id: string;
  date: string;
  products: ProductSale[];
  totalSales: number;
  salesGroup?: SalesGroupReference;
}
export type IntensityLevel = 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
export type IntensitySortDirection = 'asc' | 'desc';

export interface SalesIntensitySettings {
  veryLowMax: number;
  lowMax: number;
  mediumMax: number;
  highMax: number;
}

export interface IntensityLegendItem {
  level: IntensityLevel;
  label: string;
  range: string;
  color: string;
}

export const DEFAULT_INTENSITY_SETTINGS: SalesIntensitySettings = {
  veryLowMax: 1000,
  lowMax: 5000,
  mediumMax: 15000,
  highMax: 30000,
};

export const INTENSITY_ORDER: Record<IntensityLevel, number> = {
  'very-low': 1,
  'low': 2,
  'medium': 3,
  'high': 4,
  'very-high': 5,
};

export interface Waypoint {
  id: number;
  name: string;
  label: string;
  lng: number;
  lat: number;
  totalSales: number;
  date: string; // ISO date string
  visitDateTime: string;
  products: ProductSale[];
  productCount: number;
  intensity: IntensityLevel;
  color: string;
  createdAt: string;
  salesGroup?: SalesGroupReference;
  salesHistory: SalesEntry[];
}

export type MapMode = 'navigate' | 'add-waypoint';

export interface MapState {
  mode: MapMode;
  center: [number, number];
  zoom: number;
  selectedWaypointId: string | null;
}

export interface SalesFilter {
  dateFrom: string;
  dateTo: string;
  minSales: number;
  maxSales: number;
  intensities: IntensityLevel[];
  searchTerm: string;
  intensitySort?: IntensitySortDirection | null;
}

export function getIntensityColor(intensity: IntensityLevel): string {
  const colors: Record<IntensityLevel, string> = {
    'very-low': '#22c55e',
    'low': '#84cc16',
    'medium': '#eab308',
    'high': '#f97316',
    'very-high': '#ef4444',
  };
  return colors[intensity];
}

export function getIntensityFromSales(
  totalSales: number,
  settings: SalesIntensitySettings = DEFAULT_INTENSITY_SETTINGS
): IntensityLevel {
  if (totalSales < settings.veryLowMax) return 'very-low';
  if (totalSales < settings.lowMax) return 'low';
  if (totalSales < settings.mediumMax) return 'medium';
  if (totalSales < settings.highMax) return 'high';
  return 'very-high';
}

export function getIntensityLabel(intensity: IntensityLevel): string {
  const labels: Record<IntensityLevel, string> = {
    'very-low': 'Muy Baja',
    'low': 'Baja',
    'medium': 'Media',
    'high': 'Alta',
    'very-high': 'Muy Alta',
  };
  return labels[intensity];
}

function formatCompactCurrency(value: number): string {
  const absolute = Math.max(0, value);
  if (absolute < 1000) {
    return `COP ${Math.floor(absolute).toLocaleString('es-CO')}`;
  }
  const formatWithSuffix = (divisor: number, suffix: string) => {
    const raw = absolute / divisor;
    const fixed = raw.toFixed(2);
    const trimmed = fixed.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
    return `COP ${trimmed}${suffix}`;
  };
  if (absolute < 1_000_000) {
    return formatWithSuffix(1_000, 'K');
  }
  if (absolute < 1_000_000_000) {
    return formatWithSuffix(1_000_000, 'M');
  }
  if (absolute < 1_000_000_000_000) {
    return formatWithSuffix(1_000_000_000, 'B');
  }
  return formatWithSuffix(1_000_000_000_000, 'T');
}

export function buildIntensityLegend(
  settings: SalesIntensitySettings = DEFAULT_INTENSITY_SETTINGS
): IntensityLegendItem[] {
  return [
    {
      level: 'very-low',
      label: getIntensityLabel('very-low'),
      range: `< ${formatCompactCurrency(settings.veryLowMax)}`,
      color: getIntensityColor('very-low'),
    },
    {
      level: 'low',
      label: getIntensityLabel('low'),
      range: `${formatCompactCurrency(settings.veryLowMax)} - ${formatCompactCurrency(settings.lowMax)}`,
      color: getIntensityColor('low'),
    },
    {
      level: 'medium',
      label: getIntensityLabel('medium'),
      range: `${formatCompactCurrency(settings.lowMax)} - ${formatCompactCurrency(settings.mediumMax)}`,
      color: getIntensityColor('medium'),
    },
    {
      level: 'high',
      label: getIntensityLabel('high'),
      range: `${formatCompactCurrency(settings.mediumMax)} - ${formatCompactCurrency(settings.highMax)}`,
      color: getIntensityColor('high'),
    },
    {
      level: 'very-high',
      label: getIntensityLabel('very-high'),
      range: `> ${formatCompactCurrency(settings.highMax)}`,
      color: getIntensityColor('very-high'),
    },
  ];
}
