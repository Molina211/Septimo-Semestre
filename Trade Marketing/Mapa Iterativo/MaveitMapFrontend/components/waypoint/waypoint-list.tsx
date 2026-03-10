'use client';

import type { SalesEntry, Waypoint } from '@/lib/models/waypoint.model';
import { getIntensityLabel } from '@/lib/models/waypoint.model';
import { MapPin, Trash2, ChevronDown, ChevronUp, Package, RefreshCw, Edit3, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { formatBogotaDateTime } from '@/lib/utils/time-utils';

interface WaypointListProps {
  waypoints: Waypoint[];
  selectedWaypointId: number | null;
  onSelect: (id: number) => void;
  onDelete: (waypoint: Waypoint) => void;
  onUpdateRequest: (waypoint: Waypoint) => void;
  onEditEntry: (waypoint: Waypoint, entry: SalesEntry) => void;
  onEditPoint: (waypoint: Waypoint) => void;
  onDeleteGroup: (waypoint: Waypoint, entry: SalesEntry) => void;
  readOnly?: boolean;
}

const formatEntryDate = (value: string) => formatBogotaDateTime(value);

export default function WaypointList({
  waypoints,
  selectedWaypointId,
  onSelect,
  onDelete,
  onUpdateRequest,
  onEditEntry,
  onEditPoint,
  onDeleteGroup,
  readOnly = false,
}: WaypointListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {waypoints.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Sin puntos de venta</p>
          <p className="text-xs text-muted-foreground/70">
            {readOnly
              ? 'Solo lectura: no puedes crear puntos nuevos'
              : 'Cambia al modo \"Agregar Punto\" y haz clic en el mapa'}
          </p>
        </div>
      )}

      {waypoints.map((wp) => {
        const isSelected = wp.id === selectedWaypointId;
        const isExpanded = wp.id === expandedId;

        return (
          <div
            key={wp.id}
            className={`rounded-lg border transition-all ${
              isSelected
                ? 'border-primary/50 bg-primary/5'
                : 'border-border bg-secondary/20 hover:border-border/80'
            }`}
          >
            {/* Main row */}
            <button
              onClick={() => onSelect(wp.id)}
              className="flex w-full items-center gap-3 px-3 py-3 text-left"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `${wp.color}22`,
                  border: `2px solid ${wp.color}`,
                }}
              >
                <MapPin className="h-3.5 w-3.5" style={{ color: wp.color }} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {wp.name}
                  </span>
                  <span
                    className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium"
                    style={{ background: `${wp.color}22`, color: wp.color }}
                  >
                    {wp.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-medium" style={{ color: wp.color }}>
                    ${wp.totalSales.toLocaleString()}
                  </span>
                  <span>{getIntensityLabel(wp.intensity)}</span>
                  <span>{formatEntryDate(wp.visitDateTime)}</span>
                </div>
              </div>
            </button>

            {/* Expand/collapse actions */}
            <div className="flex items-center border-t border-border/50 px-3 py-1.5">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : wp.id)}
                  className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Package className="h-3 w-3" />
                  <span>{wp.productCount} productos</span>
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
              {!readOnly && (
                <div className="ml-auto flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPoint(wp);
                    }}
                    className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label={`Editar ${wp.name}`}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateRequest(wp);
                    }}
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Actualizar venta
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(wp);
                    }}
                    className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Eliminar ${wp.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Expanded product details */}
            {isExpanded && (
              <div className="border-t border-border/50 px-3 py-2 space-y-3">
                {wp.salesHistory.map((entry) => (
                  <div key={entry.id} className="space-y-2 rounded-lg border border-border p-2">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
                    <span>{formatEntryDate(entry.date)}</span>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          ${entry.totalSales.toLocaleString()}
                        </span>
                        {!readOnly && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditEntry(wp, entry);
                              }}
                              className="rounded-full p-1.5 text-primary transition-colors hover:bg-secondary"
                              aria-label="Editar grupo"
                            >
                              <Edit3 className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteGroup(wp, entry);
                              }}
                              className="rounded-full p-1.5 text-destructive transition-colors hover:bg-destructive/10"
                              aria-label="Eliminar grupo"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {entry.products.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground">Sin productos registrados</p>
                    ) : (
                      <table className="w-full text-[11px]">
                        <thead>
                          <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            <th className="pb-1 text-left font-medium">Producto</th>
                            <th className="pb-1 text-right font-medium">Cant.</th>
                            <th className="pb-1 text-right font-medium">Precio</th>
                            <th className="pb-1 text-right font-medium">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entry.products.map((p) => (
                            <tr key={p.id} className="text-xs">
                              <td className="py-0.5 text-foreground">{p.productName}</td>
                              <td className="py-0.5 text-right text-muted-foreground">{p.quantity}</td>
                              <td className="py-0.5 text-right text-muted-foreground">${p.unitPrice}</td>
                              <td className="py-0.5 text-right font-medium text-foreground">
                                ${(p.quantity * p.unitPrice).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
