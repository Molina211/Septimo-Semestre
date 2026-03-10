'use client';

import type {
  Waypoint,
  SalesFilter,
  ProductSale,
  SalesEntry,
  SalesIntensitySettings,
} from '../models/waypoint.model';
import { getIntensityColor, getIntensityFromSales, INTENSITY_ORDER } from '../models/waypoint.model';
import type { CatalogProductApi } from '../models/catalog-product.model';
import { toBogotaOffsetDateTime } from '@/lib/utils/time-utils';
import { apiFetch } from './api.client';

const WAYPOINTS_ENDPOINT = '/api/waypoints';
const GROUPS_ENDPOINT = '/api/catalog/groups';

interface BackendSalesGroupProduct {
  quantity: number;
  unitPrice: number | null;
  product: CatalogProductApi | null;
  active: boolean;
}

interface BackendSalesGroup {
  id: number;
  saleDateTime: string;
  createdAt: string;
  updatedAt: string;
  products: BackendSalesGroupProduct[];
}

interface BackendWaypoint {
  id: number;
  name: string;
  label: string;
  lng: number;
  lat: number;
  visitDateTime: string;
  salesGroups: BackendSalesGroup[];
  createdAt: string;
  updatedAt: string;
}

interface SalesGroupProductPayload {
  product: { id: number };
  quantity: number;
  unitPrice: number;
}

interface SalesGroupPayload {
  saleDateTime: string;
  products: SalesGroupProductPayload[];
  waypoint?: { id: number };
}
function toOffsetDateTime(value: string): string {
  return toBogotaOffsetDateTime(value);
}

function mapSalesGroupProductToSale(
  group: BackendSalesGroup,
  entry: BackendSalesGroupProduct
): ProductSale | null {
  const catalogProduct = entry.product;
  if (!catalogProduct) {
    return null;
  }
  const basePrice = catalogProduct.basePrice ?? 0;
  const unitPrice = Number(entry.unitPrice ?? basePrice);
  const resolvedUnitPrice = Number.isFinite(unitPrice) ? unitPrice : basePrice;
  const priceSource: 'base' | 'custom' =
    basePrice > 0 && resolvedUnitPrice === basePrice ? 'base' : 'custom';
  return {
    id: `${group.id}-${catalogProduct.id}`,
    productId: catalogProduct.id,
    product: catalogProduct,
    productName: catalogProduct.name ?? 'Producto sin nombre',
    quantity: entry.quantity,
    unitPrice: resolvedUnitPrice,
    priceSource,
  };
}

function mapSalesGroupToEntry(group: BackendSalesGroup): SalesEntry {
  const validProducts = (group.products ?? [])
    .filter((entry) => entry.active)
    .map((entry) => mapSalesGroupProductToSale(group, entry))
    .filter((product): product is ProductSale => Boolean(product));
  const totalSales = validProducts.reduce(
    (sum, product) => sum + product.quantity * product.unitPrice,
    0
  );
  return {
    id: group.id.toString(),
    date: group.saleDateTime,
    products: validProducts,
    totalSales,
    salesGroup: {
      id: group.id.toString(),
      quantity: validProducts.reduce((sum, product) => sum + product.quantity, 0),
      saleDateTime: group.saleDateTime,
      product: validProducts[0]?.product ?? null,
    },
  };
}

function mapWaypoint(backend: BackendWaypoint, settings?: SalesIntensitySettings): Waypoint {
  const sortedGroups = [...(backend.salesGroups ?? [])].sort((a, b) =>
    a.saleDateTime.localeCompare(b.saleDateTime)
  );
  const entries = sortedGroups.map(mapSalesGroupToEntry);
  const totalSales = entries.reduce((sum, entry) => sum + entry.totalSales, 0);
  const latestEntry = entries[entries.length - 1];
  const intensity = getIntensityFromSales(totalSales, settings);
  const productCount = entries.reduce((count, entry) => count + entry.products.length, 0);
  return {
    id: backend.id.toString(),
    name: backend.name,
    label: backend.label,
    lng: backend.lng,
    lat: backend.lat,
    totalSales,
    date: latestEntry?.date ?? backend.visitDateTime,
    visitDateTime: backend.visitDateTime,
    products: latestEntry?.products ?? [],
    productCount,
    intensity,
    color: getIntensityColor(intensity),
    createdAt: backend.createdAt,
    salesHistory: entries,
    salesGroup: latestEntry?.salesGroup,
  };
}

function buildProductReference(product?: ProductSale) {
  const rawId = product?.product?.id ?? product?.productId;
  if (rawId === null || rawId === undefined) {
    return null;
  }
  return { id: Number(rawId) };
}

function buildGroupPayload(products: ProductSale[], saleDateTime: string): SalesGroupPayload | null {
  const items = products
    .map((product) => {
      const productRef = buildProductReference(product);
      if (!productRef) return null;
      return {
        product: productRef,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
      };
    })
    .filter((payload): payload is SalesGroupProductPayload => Boolean(payload));
  if (items.length === 0) {
    return null;
  }
  return {
    saleDateTime: toOffsetDateTime(saleDateTime),
    products: items,
  };
}

async function requestSalesGroup(
  payload: SalesGroupPayload,
  method: 'POST' | 'PUT',
  groupId?: string
) {
  const endpoint = method === 'POST' ? GROUPS_ENDPOINT : `${GROUPS_ENDPOINT}/${groupId}`;
  await apiFetch<void>(endpoint, {
    method,
    body: payload,
  });
}

export async function getWaypoints(settings?: SalesIntensitySettings): Promise<Waypoint[]> {
  const data = await apiFetch<BackendWaypoint[]>(WAYPOINTS_ENDPOINT);
  return data.map((item) => mapWaypoint(item, settings));
}

export async function addWaypoint(payload: {
  name: string;
  label: string;
  lng: number;
  lat: number;
  totalSales: number;
  date: string;
  products: ProductSale[];
}): Promise<Waypoint> {
  const groupPayload = buildGroupPayload(payload.products, payload.date);
  const waypoint = await apiFetch<BackendWaypoint>(WAYPOINTS_ENDPOINT, {
    method: 'POST',
    body: {
      name: payload.name.trim(),
      label: payload.label.trim(),
      lng: payload.lng,
      lat: payload.lat,
      visitDateTime: toOffsetDateTime(payload.date),
      ...(groupPayload ? { salesGroups: [groupPayload] } : {}),
    },
  });
  return mapWaypoint(waypoint);
}

export async function deleteWaypoint(id: number | string): Promise<void> {
  try {
    const targetId = String(id);
    await apiFetch<void>(`${WAYPOINTS_ENDPOINT}/${targetId}`, { method: 'DELETE' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return;
    }
    throw error;
  }
}

export async function appendWaypointSales(id: number | string, payload: {
  date: string;
  products: ProductSale[];
}): Promise<void> {
  const groupPayload = buildGroupPayload(payload.products, payload.date);
  if (!groupPayload) return;
  await requestSalesGroup(
    {
      ...groupPayload,
      waypoint: { id: Number(id) },
    },
    'POST'
  );
  if (payload.name || payload.label || payload.lng !== undefined || payload.lat !== undefined) {
    await updateWaypoint(id, {
      name: payload.name ?? '',
      label: payload.label ?? '',
      lng: payload.lng ?? 0,
      lat: payload.lat ?? 0,
      visitDateTime: toOffsetDateTime(payload.date),
    });
  }
}

export async function updateWaypointEntry(id: number | string, entryId: string, payload: {
  date: string;
  products: ProductSale[];
}): Promise<void> {
  const groupPayload = buildGroupPayload(payload.products, payload.date);
  if (!groupPayload) return;
  await requestSalesGroup(groupPayload, 'PUT', entryId);
  if (payload.name || payload.label || payload.lng !== undefined || payload.lat !== undefined) {
    await updateWaypoint(id, {
      name: payload.name ?? '',
      label: payload.label ?? '',
      lng: payload.lng ?? 0,
      lat: payload.lat ?? 0,
      visitDateTime: toOffsetDateTime(payload.date),
    });
  }
}

export async function updateWaypoint(id: number | string, payload: {
  name: string;
  label: string;
  lng: number;
  lat: number;
  visitDateTime: string;
}): Promise<void> {
  await apiFetch<void>(`${WAYPOINTS_ENDPOINT}/${id}`, {
    method: 'PUT',
    body: {
      name: payload.name.trim(),
      label: payload.label.trim(),
      lng: payload.lng,
      lat: payload.lat,
      visitDateTime: toOffsetDateTime(payload.visitDateTime),
    },
  });
}

export async function deleteWaypointEntry(entryId: string): Promise<void> {
  try {
    await apiFetch<void>(`${GROUPS_ENDPOINT}/${entryId}`, { method: 'DELETE' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return;
    }
    throw error;
  }
}

export interface Statistics {
  totalSalesSum: number;
  avgSales: number;
  totalLocations: number;
  salesByLocation: Array<{ name: string; label: string; sales: number; color: string }>;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  intensityDistribution: Record<IntensityLevel, number>;
  dailySales: Array<{ date: string; total: number }>;
}

export function getStatistics(filteredWaypoints: Waypoint[]): Statistics {
  const totalSalesSum = filteredWaypoints.reduce((sum, w) => sum + w.totalSales, 0);
  const avgSales = filteredWaypoints.length > 0 ? totalSalesSum / filteredWaypoints.length : 0;

  const salesByLocation = filteredWaypoints
    .map((w) => ({
      name: w.name,
      label: w.label,
      sales: w.totalSales,
      color: w.color,
    }))
    .sort((a, b) => b.sales - a.sales);

  const productTotals: Record<string, { quantity: number; revenue: number }> = {};
  filteredWaypoints.forEach((w) => {
    w.salesHistory.forEach((entry) => {
      entry.products.forEach((p) => {
        if (!productTotals[p.productName]) {
          productTotals[p.productName] = { quantity: 0, revenue: 0 };
        }
        productTotals[p.productName].quantity += p.quantity;
        productTotals[p.productName].revenue += p.quantity * p.unitPrice;
      });
    });
  });

  const topProducts = Object.entries(productTotals)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue);

  const intensityDistribution: Record<IntensityLevel, number> = {
    'very-low': filteredWaypoints.filter((w) => w.intensity === 'very-low').length,
    low: filteredWaypoints.filter((w) => w.intensity === 'low').length,
    medium: filteredWaypoints.filter((w) => w.intensity === 'medium').length,
    high: filteredWaypoints.filter((w) => w.intensity === 'high').length,
    'very-high': filteredWaypoints.filter((w) => w.intensity === 'very-high').length,
  };

  const salesByDate: Record<string, number> = {};
  filteredWaypoints.forEach((w) => {
    w.salesHistory.forEach((entry) => {
      if (!salesByDate[entry.date]) salesByDate[entry.date] = 0;
      salesByDate[entry.date] += entry.totalSales;
    });
  });

  const dailySales = Object.entries(salesByDate)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalSalesSum,
    avgSales,
    totalLocations: filteredWaypoints.length,
    salesByLocation,
    topProducts,
    intensityDistribution,
    dailySales,
  };
}

export function filterWaypoints(waypoints: Waypoint[], filter: SalesFilter): Waypoint[] {
  const filtered = waypoints.filter((w) => {
    if (filter.dateFrom || filter.dateTo) {
      const hasEntryInRange = w.salesHistory.some((entry) => {
        if (filter.dateFrom && entry.date < filter.dateFrom) return false;
        if (filter.dateTo && entry.date > filter.dateTo) return false;
        return true;
      });
      if (!hasEntryInRange) return false;
    }
    if (filter.minSales > 0 && w.totalSales < filter.minSales) return false;
    if (filter.maxSales > 0 && w.totalSales > filter.maxSales) return false;
    if (filter.intensities.length > 0 && !filter.intensities.includes(w.intensity)) return false;
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      return (
        w.name.toLowerCase().includes(term) ||
        w.label.toLowerCase().includes(term) ||
        w.salesHistory.some((entry) =>
          entry.products.some((p) => p.productName.toLowerCase().includes(term))
        )
      );
    }
    return true;
  });

  if (filter.intensitySort) {
    const direction = filter.intensitySort === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      const orderA = INTENSITY_ORDER[a.intensity];
      const orderB = INTENSITY_ORDER[b.intensity];
      return (orderA - orderB) * direction;
    });
  }

  return filtered;
}
