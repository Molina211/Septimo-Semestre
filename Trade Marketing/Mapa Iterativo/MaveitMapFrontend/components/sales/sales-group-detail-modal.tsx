'use client';

import { useMemo } from 'react';
import type { SalesEntry, SalesIntensitySettings, Waypoint } from '@/lib/models/waypoint.model';
import { getIntensityFromSales, getIntensityColor, getIntensityLabel } from '@/lib/models/waypoint.model';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  DollarSign,
  MapPin,
  Package,
  Pencil,
  Percent,
  ShoppingBag,
  Tag,
  Trash2,
  TrendingUp,
} from 'lucide-react';

export interface SalesGroupDetailModalProps {
  waypoint: Waypoint | null;
  entryId: string | null;
  groupNumber?: number | null;
  isOpen: boolean;
  intensitySettings: SalesIntensitySettings;
  readOnly?: boolean;
  onBack: () => void;
  onEditGroup: (waypoint: Waypoint, entry: SalesEntry) => void;
  onDeleteGroup: (waypoint: Waypoint, entry: SalesEntry) => void;
}

function formatCOP(value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return `COP ${Math.round(safe).toLocaleString('es-CO')}`;
}

function formatDateTimeShort(value: string) {
  try {
    const d = new Date(value);
    return d.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

function formatDateOnly(value: string) {
  try {
    const d = new Date(value);
    return d.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch {
    return value;
  }
}

function formatTimeOnly(value: string) {
  try {
    const d = new Date(value);
    return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return value;
  }
}

function formatPercent(value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toLocaleString('es-CO', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function entryProductCount(entry: SalesEntry) {
  return entry.products.reduce((acc, p) => acc + (p.quantity || 0), 0);
}

export default function SalesGroupDetailModal({
  waypoint,
  entryId,
  groupNumber = null,
  isOpen,
  intensitySettings,
  readOnly = false,
  onBack,
  onEditGroup,
  onDeleteGroup,
}: SalesGroupDetailModalProps) {
  const entry = useMemo(() => {
    if (!waypoint || !entryId) return null;
    return (waypoint.salesHistory ?? []).find((e) => e.id === entryId) ?? null;
  }, [entryId, waypoint]);

  const computed = useMemo(() => {
    if (!entry) {
      return {
        intensity: null as ReturnType<typeof getIntensityFromSales> | null,
        unitsSold: 0,
        productTypes: 0,
        avgUnitPrice: 0,
        topProductId: null as string | null,
        waypointTotalSales: 0,
        shareOfWaypointSales: 0,
      };
    }
    const unitsSold = entryProductCount(entry);
    const productTypes = new Set(entry.products.map((p) => p.productId ?? p.productName)).size;
    const avgUnitPrice = unitsSold === 0 ? 0 : entry.totalSales / unitsSold;
    const productStats = entry.products.map((p) => ({
      id: p.id,
      quantity: p.quantity ?? 0,
      subtotal: (p.quantity ?? 0) * (p.unitPrice ?? 0),
    }));

    const maxSubtotal = productStats.reduce((acc, p) => Math.max(acc, p.subtotal), 0);
    const maxQuantity = productStats.reduce((acc, p) => Math.max(acc, p.quantity), 0);

    const topProduct =
      productStats
        .map((p) => {
          const subtotalScore = maxSubtotal > 0 ? p.subtotal / maxSubtotal : 0;
          const quantityScore = maxQuantity > 0 ? p.quantity / maxQuantity : 0;
          const score = 0.6 * subtotalScore + 0.4 * quantityScore;
          return { id: p.id, score };
        })
        .sort((a, b) => b.score - a.score)[0] ?? null;
    const waypointTotalSales = (waypoint?.salesHistory ?? []).reduce((acc, e) => acc + (e.totalSales || 0), 0);
    const shareOfWaypointSales = waypointTotalSales > 0 ? entry.totalSales / waypointTotalSales : 0;
    return {
      intensity: getIntensityFromSales(entry.totalSales, intensitySettings),
      unitsSold,
      productTypes,
      avgUnitPrice,
      topProductId: topProduct?.id ?? null,
      waypointTotalSales,
      shareOfWaypointSales,
    };
  }, [entry, intensitySettings, waypoint?.salesHistory]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onBack()}>
      <DialogContent className="max-w-none w-[min(46rem,92vw)] max-h-[calc(100vh-2.5rem)] p-0 overflow-hidden bg-card/95 border border-white/10 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="mt-0.5 rounded-full border border-white/10 p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  aria-label="Volver a grupos"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="min-w-0">
                  <DialogTitle className="text-[18px] font-bold text-foreground">
                    Detalle de Venta
                  </DialogTitle>
                  <DialogDescription className="sr-only">Vista única del grupo de venta seleccionado</DialogDescription>
                  {entry && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Grupo de venta{' '}
                      <span className="font-semibold text-foreground">
                        #
                        {groupNumber != null
                          ? groupNumber
                          : entry.salesGroup?.id
                            ? entry.salesGroup.id
                            : entry.id.slice(0, 6).toUpperCase()}
                      </span>
                      {computed.intensity ? (
                        <span className="ml-2 inline-flex items-center gap-2 text-muted-foreground">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: getIntensityColor(computed.intensity) }}
                          />
                          <span className="font-semibold text-foreground">{getIntensityLabel(computed.intensity)}</span>
                        </span>
                      ) : null}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {entry && waypoint && !readOnly && (
              <div className="flex items-center gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/15 bg-transparent text-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-0 h-8 px-3 text-sm"
                  onClick={() => onEditGroup(waypoint, entry)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/15 bg-transparent text-destructive hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-0 h-8 px-3 text-sm"
                  onClick={() => onDeleteGroup(waypoint, entry)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            )}
          </div>

        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-auto px-6 pb-6 pt-4">
          {!entry ? (
            <div className="rounded-2xl border border-white/10 bg-background/40 p-10 text-center">
              <p className="text-lg font-semibold text-foreground">No se encontró el grupo</p>
              <p className="mt-2 text-sm text-muted-foreground">Vuelve a la lista y selecciona otro grupo.</p>
              <div className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/15 bg-transparent text-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-0"
                  onClick={onBack}
                >
                  Volver
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="-mx-6 border-b border-white/10 bg-background/10">
                <div className="px-6 py-5">
                  <div className="grid gap-8 lg:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                        Información de la venta
                      </p>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-background/30 text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Fecha</p>
                            <p className="mt-1 text-sm font-semibold text-foreground">{formatDateOnly(entry.date)}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-background/30 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Hora</p>
                            <p className="mt-1 text-sm font-semibold text-foreground">{formatTimeOnly(entry.date)}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-background/30 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Total</p>
                            <p className="mt-1 text-[15px] font-bold text-primary">{formatCOP(entry.totalSales)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                        Punto de venta
                      </p>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-background/30 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Ubicación</p>
                            <p className="mt-1 text-sm font-semibold text-foreground break-words">{waypoint?.name}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-background/30 text-muted-foreground">
                            <Tag className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Etiqueta</p>
                            <p className="mt-1 text-sm font-semibold text-foreground">{waypoint?.label}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-background/30 text-muted-foreground">
                            <Percent className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">% del total</p>
                            <p className="mt-1 text-sm font-semibold text-foreground">
                              {formatPercent(computed.shareOfWaypointSales)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-background/30 text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Intensidad punto</p>
                            <div className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: getIntensityColor(waypoint!.intensity) }}
                              />
                              {getIntensityLabel(waypoint!.intensity)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: 'Unidades vendidas',
                    value: computed.unitsSold.toLocaleString('es-CO'),
                    icon: <Package className="h-4 w-4 text-primary" />,
                  },
                  {
                    label: 'Precio promedio',
                    value: formatCOP(computed.avgUnitPrice),
                    icon: <TrendingUp className="h-4 w-4 text-primary" />,
                  },
                  {
                    label: 'Tipos de producto',
                    value: computed.productTypes.toLocaleString('es-CO'),
                    icon: <ShoppingBag className="h-4 w-4 text-primary" />,
                  },
                ].map((card) => (
                  <div key={card.label} className="rounded-2xl border border-white/10 bg-background/15 p-4">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground inline-flex items-center gap-2">
                      {card.icon}
                      {card.label}
                    </p>
                    <p className="mt-2 text-base font-bold text-foreground">{card.value}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-background/20">
                <div className="flex items-center justify-between border-b border-white/10 bg-background/10 px-5 py-4">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Productos vendidos
                  </h4>
                  <span className={cn('text-xs text-muted-foreground', entry.products.length === 0 && 'opacity-70')}>
                    <span className="inline-flex items-center gap-1">
                      <ShoppingBag className="h-3.5 w-3.5" />
                      {entry.products.length} items
                    </span>
                  </span>
                </div>

                {entry.products.length === 0 ? (
                  <div className="px-5 py-6">
                    <p className="text-sm text-muted-foreground">Sin productos registrados</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full table-fixed text-[12px]">
                      <colgroup>
                        <col style={{ width: '30%' }} />
                        <col style={{ width: '13%' }} />
                        <col style={{ width: '19%' }} />
                        <col style={{ width: '19%' }} />
                      </colgroup>
                      <thead className="bg-background/10">
                        <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          <th className="px-5 py-1 text-left font-semibold">Producto</th>
                          <th className="px-5 py-1 text-right font-semibold">Cantidad</th>
                          <th className="px-5 py-1 text-right font-semibold">Precio unitario</th>
                          <th className="px-5 py-1 text-right font-semibold">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {[...entry.products]
                          .map((product) => {
                            const quantity = product.quantity ?? 0;
                            const unitPrice = product.unitPrice ?? 0;
                            return { product, quantity, unitPrice, subtotal: quantity * unitPrice };
                          })
                          .sort((a, b) => {
                            const aTop = a.product.id === computed.topProductId;
                            const bTop = b.product.id === computed.topProductId;
                            if (aTop !== bTop) return aTop ? -1 : 1;
                            return b.subtotal - a.subtotal;
                          })
                          .map(({ product, quantity, unitPrice, subtotal }) => {
                            const isTop = computed.topProductId === product.id;
                            return (
                              <tr key={product.id}>
                                <td className="px-5 py-4 text-foreground align-top">
                                  <div className="flex items-start gap-2 min-w-0">
                                    {isTop ? (
                                      <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-semibold text-muted-foreground shrink-0">
                                        Top
                                      </span>
                                    ) : null}
                                    <span className="font-medium break-words">{product.productName}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-4 text-right text-muted-foreground tabular-nums whitespace-nowrap">
                                  {quantity}
                                </td>
                                <td className="px-5 py-4 text-right text-muted-foreground tabular-nums whitespace-nowrap">
                                  {formatCOP(unitPrice)}
                                </td>
                                <td className="px-5 py-4 text-right font-semibold text-foreground tabular-nums whitespace-nowrap">
                                  {formatCOP(subtotal)}
                                </td>
                              </tr>
                            );
                          })}
                        <tr className="bg-background/5">
                          <td className="px-5 py-4 text-foreground font-semibold">Total</td>
                          <td className="px-5 py-4 text-right text-muted-foreground tabular-nums whitespace-nowrap">
                            {computed.unitsSold}
                          </td>
                          <td className="px-5 py-4 text-right text-muted-foreground">—</td>
                          <td className="px-5 py-4 text-right font-bold text-primary tabular-nums whitespace-nowrap">
                            {formatCOP(entry.totalSales)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
