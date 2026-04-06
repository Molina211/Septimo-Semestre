'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SalesEntry, SalesIntensitySettings, Waypoint, IntensityLevel } from '@/lib/models/waypoint.model';
import {
  getIntensityFromSales,
  getIntensityColor,
  getIntensityLabel,
} from '@/lib/models/waypoint.model';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  Check,
  Download,
  Filter,
  Grid3X3,
  List,
  ListChecks,
  Pencil,
  Plus,
  Search,
  Trash2,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Package,
  TrendingUp,
  DollarSign,
  X,
} from 'lucide-react';

type ViewMode = 'list' | 'grid' | 'compact';
type SortBy = 'date' | 'total' | 'products';
type SortOrder = 'asc' | 'desc';
type SortValue = `${SortBy}-${SortOrder}`;

export interface SalesGroupsModalProps {
  waypoint: Waypoint | null;
  isOpen: boolean;
  openMode?: 'fresh' | 'resume';
  readOnly?: boolean;
  intensitySettings: SalesIntensitySettings;
  onClose: () => void;
  onOpenGroupDetail: (waypoint: Waypoint, entry: SalesEntry) => void;
  onRequestBulkDelete: (waypoint: Waypoint, entryIds: string[]) => void;
  onCreateGroup: (waypoint: Waypoint) => void;
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
    return d.toLocaleString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch {
    return value;
  }
}

function formatDateTimeCompact(value: string) {
  try {
    const d = new Date(value);
    const date = d.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const time = d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${date} ${time}`;
  } catch {
    return value;
  }
}

function entryProductCount(entry: SalesEntry) {
  return entry.products.reduce((acc, p) => acc + (p.quantity || 0), 0);
}

function withinDateRange(entry: SalesEntry, fromIso?: string, toIso?: string) {
  const t = new Date(entry.date).getTime();
  if (Number.isNaN(t)) return false;
  if (fromIso) {
    const f = new Date(fromIso).getTime();
    if (!Number.isNaN(f) && t < f) return false;
  }
  if (toIso) {
    const to = new Date(toIso).getTime();
    if (!Number.isNaN(to) && t > to) return false;
  }
  return true;
}

export default function SalesGroupsModal({
  waypoint,
  isOpen,
  openMode = 'fresh',
  readOnly = false,
  intensitySettings,
  onClose,
  onOpenGroupDetail,
  onRequestBulkDelete,
  onCreateGroup,
  onEditGroup,
  onDeleteGroup,
}: SalesGroupsModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [intensities, setIntensities] = useState<IntensityLevel[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [datePreset, setDatePreset] = useState<'1D' | '5D' | '1M' | '6M' | '1A' | '5A' | 'MAX'>('MAX');

  const listTopRef = useRef<HTMLDivElement | null>(null);
  const sortValue = useMemo<SortValue>(() => `${sortBy}-${sortOrder}`, [sortBy, sortOrder]);

  useEffect(() => {
    if (!isOpen) return;
    // When returning from the detail modal, preserve filters and ordering.
    if (openMode === 'fresh') {
      setShowFilters(false);
      setViewMode('list');
      setSearch('');
      setIntensities([]);
      setSortBy('date');
      setSortOrder('desc');
      setDatePreset('MAX');
    } else {
      setShowFilters(false);
      setSelectionMode(false);
      setSelectedIds(new Set());
      setExpanded(new Set());
    }
    // Scroll to top.
    setTimeout(() => listTopRef.current?.scrollIntoView({ block: 'start' }), 0);
  }, [isOpen, openMode]);

  const handleOpenGroupDetail = useCallback(
    (entry: SalesEntry) => {
      if (!waypoint) return;
      onOpenGroupDetail(waypoint, entry);
      onClose();
    },
    [onClose, onOpenGroupDetail, waypoint]
  );

  const toggleSelectionMode = useCallback(() => {
    setSelectionMode((prev) => {
      const next = !prev;
      if (next) {
        setShowFilters(false);
        setExpanded(new Set());
      } else {
        setSelectedIds(new Set());
      }
      return next;
    });
  }, []);

  const toggleSelected = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const computed = useMemo(() => {
    if (!waypoint) {
      return {
        groups: [] as SalesEntry[],
        total: 0,
        avg: 0,
        topProduct: null as { name: string; quantity: number; revenue: number } | null,
        groupCount: 0,
        productCount: 0,
      };
    }
    const groups = waypoint.salesHistory ?? [];
    const total = groups.reduce((acc, g) => acc + (g.totalSales || 0), 0);
    const avg = groups.length ? total / groups.length : 0;
    const productTotals: Record<string, { quantity: number; revenue: number }> = {};
    groups.forEach((group) => {
      group.products.forEach((product) => {
        if (!productTotals[product.productName]) {
          productTotals[product.productName] = { quantity: 0, revenue: 0 };
        }
        productTotals[product.productName].quantity += product.quantity;
        productTotals[product.productName].revenue += product.quantity * product.unitPrice;
      });
    });
    const aggregatedProducts = Object.entries(productTotals).map(([name, data]) => ({
      name,
      ...data,
    }));
    const maxRevenue = Math.max(1, ...aggregatedProducts.map((p) => p.revenue));
    const maxQuantity = Math.max(1, ...aggregatedProducts.map((p) => p.quantity));
    const topProduct =
      aggregatedProducts
        .map((product) => {
          const revenueScore = product.revenue / maxRevenue;
          const quantityScore = product.quantity / maxQuantity;
          const score = revenueScore * 0.6 + quantityScore * 0.4;
          return { ...product, score };
        })
        .sort((a, b) => b.score - a.score)[0] ?? null;
    const productCount = groups.reduce((acc, g) => acc + entryProductCount(g), 0);
    return {
      groups,
      total,
      avg,
      topProduct,
      groupCount: groups.length,
      productCount,
    };
  }, [waypoint]);

  const dateRange = useMemo(() => {
    if (datePreset === 'MAX') return { from: undefined as string | undefined, to: undefined as string | undefined };
    const now = Date.now();
    const ms = {
      '1D': 24 * 60 * 60 * 1000,
      '5D': 5 * 24 * 60 * 60 * 1000,
      '1M': 30 * 24 * 60 * 60 * 1000,
      '6M': 180 * 24 * 60 * 60 * 1000,
      '1A': 365 * 24 * 60 * 60 * 1000,
      '5A': 5 * 365 * 24 * 60 * 60 * 1000,
      MAX: 0,
    }[datePreset];
    const from = new Date(now - ms).toISOString();
    return { from, to: new Date(now).toISOString() };
  }, [datePreset]);

  const filteredGroups = useMemo(() => {
    if (!waypoint) return [];
    const query = search.trim().toLowerCase();
    let groups = [...computed.groups];

    groups = groups.filter((g) => withinDateRange(g, dateRange.from, dateRange.to));

    if (intensities.length) {
      groups = groups.filter((g) => intensities.includes(getIntensityFromSales(g.totalSales, intensitySettings)));
    }

    if (query) {
      groups = groups.filter((g) => {
        const intensityLabel = getIntensityLabel(getIntensityFromSales(g.totalSales, intensitySettings)).toLowerCase();
        const dateLabel = formatDateTimeShort(g.date).toLowerCase();
        const subtotalLabel = String(g.totalSales ?? '').toLowerCase();
        return (
          intensityLabel.includes(query) ||
          dateLabel.includes(query) ||
          subtotalLabel.includes(query) ||
          g.products.some((p) => p.productName.toLowerCase().includes(query))
        );
      });
    }

    groups.sort((a, b) => {
      const dir = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'total') return dir * ((a.totalSales ?? 0) - (b.totalSales ?? 0));
      if (sortBy === 'products') return dir * (entryProductCount(a) - entryProductCount(b));
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dir * ((Number.isNaN(dateA) ? 0 : dateA) - (Number.isNaN(dateB) ? 0 : dateB));
    });

    return groups;
  }, [
    waypoint,
    computed.groups,
    dateRange.from,
    dateRange.to,
    intensities,
    intensitySettings,
    search,
    sortBy,
    sortOrder,
  ]);

  const allFilteredSelected = useMemo(() => {
    if (!selectionMode || filteredGroups.length === 0) return false;
    return filteredGroups.every((g) => selectedIds.has(g.id));
  }, [filteredGroups, selectedIds, selectionMode]);

  const selectedCount = selectedIds.size;

  const toggleIntensity = (level: IntensityLevel) => {
    setIntensities((prev) => {
      if (prev.includes(level)) return prev.filter((x) => x !== level);
      return [...prev, level];
    });
  };

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreate = () => {
    if (!waypoint) return;
    onClose();
    onCreateGroup(waypoint);
  };

  const handleEdit = (entry: SalesEntry) => {
    if (!waypoint) return;
    onClose();
    onEditGroup(waypoint, entry);
  };

  const handleDelete = (entry: SalesEntry) => {
    if (!waypoint) return;
    onClose();
    onDeleteGroup(waypoint, entry);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] w-fit min-w-[min(90vw,38rem)] sm:min-w-[min(84vw,50rem)] lg:min-w-[min(55vw,56rem)] h-[calc(100vh-2rem)] p-0 overflow-hidden bg-card/95 border border-white/10 flex flex-col">
        <div ref={listTopRef} />
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-white/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
            <div className="min-w-0 md:flex-1">
              <DialogTitle className="text-[18px] font-bold text-foreground leading-tight whitespace-normal break-words">
                {waypoint?.name ?? 'Punto de venta'}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Detalle completo de grupos de venta con filtros, b&uacute;squeda y opciones de gesti&oacute;n.
              </DialogDescription>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <strong className="text-foreground">{computed.groupCount}</strong> grupos
                </span>
                <span className="inline-flex items-center gap-1">
                  <Package className="h-3.5 w-3.5" />
                  <strong className="text-foreground">{computed.productCount}</strong> productos
                </span>
                {waypoint && (
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: getIntensityColor(waypoint.intensity) }}
                    />
                    <strong className="text-foreground">
                      {getIntensityLabel(waypoint.intensity)}
                    </strong>
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-nowrap items-center gap-2 md:justify-end">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'border-white/15 bg-transparent text-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-0 h-8 w-10 p-0',
                  selectionMode && 'border-primary/40 bg-primary/10 text-primary'
                )}
                onClick={toggleSelectionMode}
                aria-label={selectionMode ? 'Cancelar selección' : 'Activar modo selección'}
                title={selectionMode ? 'Cancelar selección' : 'Activar modo selección'}
              >
                {selectionMode ? <X className="h-4 w-4" /> : <ListChecks className="h-4 w-4" />}
              </Button>
              {!selectionMode && (
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/15 bg-transparent text-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-0 h-8 px-3 text-sm"
                  onClick={() => setShowFilters((v) => !v)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                className="border-white/15 bg-transparent text-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-0 h-8 px-3 text-sm"
                onClick={() => {
                  // Placeholder: export behavior will be added later.
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              {!readOnly && !selectionMode && (
                <Button
                  type="button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-4 text-sm"
                  onClick={handleCreate}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear grupo
                </Button>
              )}
              {selectionMode && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={!waypoint || selectedCount === 0}
                  className="border-white/15 bg-transparent text-destructive hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-0 h-8 px-3 text-sm disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => {
                    if (!waypoint) return;
                    onRequestBulkDelete(waypoint, Array.from(selectedIds));
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar ({selectedCount})
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-background/40 p-3">
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Total ventas
                </span>
                <span className="text-foreground font-semibold">{formatCOP(computed.total)}</span>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-background/40 p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Promedio
                </span>
                <span className="text-foreground font-semibold">{formatCOP(computed.avg)}</span>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-background/40 p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <ShoppingBag className="h-4 w-4" />
                  Top producto
                </span>
                <span className="text-foreground font-semibold truncate max-w-[55%] pl-2">
                  {computed.topProduct ? computed.topProduct.name : <>&mdash;</>}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por producto, intensidad, fecha, total..."
                className="pl-10 bg-input/50 border-white/10"
              />
            </div>

            {selectionMode && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-3 py-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  onClick={() => {
                    if (filteredGroups.length === 0) return;
                    setSelectedIds((prev) => {
                      if (filteredGroups.every((g) => prev.has(g.id))) return new Set();
                      return new Set(filteredGroups.map((g) => g.id));
                    });
                  }}
                >
                  <span
                    className={cn(
                      'inline-flex h-4 w-4 items-center justify-center rounded border',
                      allFilteredSelected ? 'border-primary/50 bg-primary/20 text-primary' : 'border-white/15'
                    )}
                    aria-hidden="true"
                  >
                    {allFilteredSelected ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  Seleccionar todo
                </button>
                <span className="text-muted-foreground">
                  Seleccionados: <strong className="text-foreground">{selectedCount}</strong>
                </span>
              </div>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground">Tiempo:</span>
                  <div className="flex flex-wrap justify-start gap-2">
                    {(['1D', '5D', '1M', '6M', '1A', '5A', 'MAX'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setDatePreset(p)}
                        className={cn(
                          'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                          datePreset === p
                            ? 'border-primary bg-primary/15 text-primary'
                            : 'border-white/10 bg-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground'
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground">Intensidad:</span>
                  <div className="flex flex-wrap justify-start gap-2">
                    {(['very-low', 'low', 'medium', 'high', 'very-high'] as IntensityLevel[]).map((lvl) => {
                      const color = getIntensityColor(lvl);
                      const active = intensities.includes(lvl);
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => toggleIntensity(lvl)}
                          className={cn(
                            'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                            active ? 'bg-white/5 text-foreground' : 'text-muted-foreground hover:text-foreground'
                          )}
                          style={active ? { borderColor: `${color}66` } : { borderColor: 'rgba(255,255,255,0.1)' }}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                            {getIntensityLabel(lvl)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground">Vista:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={cn(
                        'rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5',
                        viewMode === 'list' && 'text-primary border-primary/40 bg-primary/10'
                      )}
                      aria-label="Vista lista"
                    >
                      <span className="inline-flex items-center gap-2">
                        <List className="h-3.5 w-3.5" />
                        Lista
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        'rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5',
                        viewMode === 'grid' && 'text-primary border-primary/40 bg-primary/10'
                      )}
                      aria-label="Vista cuadricula"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Grid3X3 className="h-3.5 w-3.5" />
                        Cuadricula
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('compact')}
                      className={cn(
                        'rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5',
                        viewMode === 'compact' && 'text-primary border-primary/40 bg-primary/10'
                      )}
                      aria-label="Vista compacta"
                    >
                      <span className="inline-flex items-center gap-2">
                        <List className="h-3.5 w-3.5" />
                        Compacta
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground">Orden:</span>
                  <div className="w-full max-w-[18rem]">
                    <Select
                      value={sortValue}
                      onValueChange={(value) => {
                        const [nextBy, nextOrder] = value.split('-') as [SortBy, SortOrder];
                        setSortBy(nextBy);
                        setSortOrder(nextOrder);
                      }}
                    >
                      <SelectTrigger className="border-white/10 bg-transparent text-foreground hover:bg-white/5 focus-visible:ring-0">
                        <SelectValue
                          placeholder="Selecciona un orden"
                          aria-label="Seleccionar criterio de orden"
                        />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-card/95 backdrop-blur">
                        <SelectItem value="date-desc" className="focus:bg-primary/15 focus:text-foreground">
                          Fecha (reciente)
                        </SelectItem>
                        <SelectItem value="date-asc" className="focus:bg-primary/15 focus:text-foreground">
                          Fecha (antiguo)
                        </SelectItem>
                        <SelectItem value="total-desc" className="focus:bg-primary/15 focus:text-foreground">
                          Total (mayor)
                        </SelectItem>
                        <SelectItem value="total-asc" className="focus:bg-primary/15 focus:text-foreground">
                          Total (menor)
                        </SelectItem>
                        <SelectItem value="products-desc" className="focus:bg-primary/15 focus:text-foreground">
                          Productos (más)
                        </SelectItem>
                        <SelectItem value="products-asc" className="focus:bg-primary/15 focus:text-foreground">
                          Productos (menos)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-3 self-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/15 bg-transparent text-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-0"
                    onClick={() => {
                      setSearch('');
                    setDatePreset('MAX');
                    setIntensities([]);
                    setSortBy('date');
                    setSortOrder('desc');
                  }}
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogHeader>


        <div className="flex-1 min-h-0 overflow-auto px-6 pb-6 pt-4">
          <p className="mb-3 text-xs text-muted-foreground">
            Mostrando {filteredGroups.length} de {computed.groupCount} grupos de venta
          </p>

          <div
            className={cn(
              'grid gap-3',
              viewMode === 'grid'
                ? 'md:grid-cols-2'
                : viewMode === 'compact'
                  ? 'sm:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
            )}
          >
                {filteredGroups.map((entry) => {
                  const intensity = getIntensityFromSales(entry.totalSales, intensitySettings);
                  const intensityColor = getIntensityColor(intensity);
                  const isExpanded = expanded.has(entry.id);
                  const isSelected = selectedIds.has(entry.id);
                  return (
                    <div
                      key={entry.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => (selectionMode ? toggleSelected(entry.id) : handleOpenGroupDetail(entry))}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          if (selectionMode) toggleSelected(entry.id);
                          else handleOpenGroupDetail(entry);
                        }
                      }}
                      className={cn(
                        'rounded-2xl border border-white/10 bg-background/40 transition-all cursor-pointer',
                        selectionMode
                          ? isSelected
                            ? 'border-primary/50 bg-primary/10'
                            : 'hover:border-primary/30 hover:bg-white/5'
                          : 'hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/5 hover:shadow-lg hover:shadow-primary/10',
                        viewMode === 'compact' ? 'p-3' : 'p-4'
                      )}
                    >
                      <div
                        className={cn(
                          'flex gap-3',
                          viewMode === 'compact' ? 'flex-col' : 'items-start justify-between'
                        )}
                      >
                        <div className="min-w-0">
                          <div
                            className={cn(
                              'flex items-center gap-2 text-xs text-muted-foreground min-w-0',
                              viewMode === 'compact' && 'flex-wrap',
                              viewMode === 'compact' && 'text-[11px]'
                            )}
                          >
                            <button
                              type="button"
                              disabled={!selectionMode}
                              onClick={(event) => {
                                event.stopPropagation();
                                if (!selectionMode) return;
                                toggleSelected(entry.id);
                              }}
                              className={cn(
                                'inline-flex h-5 w-5 items-center justify-center rounded-sm border transition-colors',
                                selectionMode
                                  ? isSelected
                                    ? 'border-primary/50 bg-primary/20 text-primary'
                                    : 'border-white/20 bg-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground'
                                  : 'border-white/10 bg-transparent text-muted-foreground opacity-30 cursor-not-allowed pointer-events-none'
                              )}
                              aria-label={isSelected ? 'Quitar selección' : 'Seleccionar'}
                            >
                              {isSelected ? <Check className="h-3.5 w-3.5" /> : null}
                            </button>
                            <span className="inline-flex items-center gap-2 shrink-0 whitespace-nowrap">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: intensityColor }} />
                              {getIntensityLabel(intensity)}
                            </span>
                            {viewMode === 'compact' ? null : <span aria-hidden="true">&bull;</span>}
                            <span className={cn('min-w-0 truncate', viewMode === 'compact' && 'w-full')}>
                              {viewMode === 'grid' || viewMode === 'compact'
                                ? formatDateTimeCompact(entry.date)
                                : formatDateTimeShort(entry.date)}
                            </span>
                          </div>
                          <div
                            className={cn(
                              'mt-2 flex flex-wrap items-center gap-3 text-sm',
                              viewMode === 'compact' && 'text-[13px]'
                            )}
                          >
                            <span className="font-semibold text-foreground">{formatCOP(entry.totalSales)}</span>
                            <span className="text-muted-foreground inline-flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              {entryProductCount(entry)} productos
                            </span>
                          </div>
                        </div>
                        <div className={cn('flex items-center gap-1', viewMode === 'compact' && 'justify-end')}>
                          {!selectionMode && !readOnly && (
                            <>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleEdit(entry);
                                }}
                                className={cn(
                                  'rounded-lg border border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground',
                                  viewMode === 'compact' ? 'p-1.5' : 'p-2'
                                )}
                                aria-label="Editar grupo"
                              >
                                <Pencil className={cn(viewMode === 'compact' ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleDelete(entry);
                                }}
                                className={cn(
                                  'rounded-lg border border-white/10 text-destructive hover:bg-destructive/10',
                                  viewMode === 'compact' ? 'p-1.5' : 'p-2'
                                )}
                                aria-label="Eliminar grupo"
                              >
                                <Trash2 className={cn(viewMode === 'compact' ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
                              </button>
                            </>
                          )}
                          {!selectionMode && (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleExpanded(entry.id);
                              }}
                              className={cn(
                                'rounded-lg border border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground',
                                viewMode === 'compact' ? 'p-1.5' : 'p-2'
                              )}
                              aria-label={isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                            >
                              {isExpanded ? (
                                <ChevronUp className={cn(viewMode === 'compact' ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
                              ) : (
                                <ChevronDown className={cn(viewMode === 'compact' ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                  {isExpanded && !selectionMode && (
                    <div className="mt-4 rounded-xl border border-white/10 bg-black/10 p-3">
                      {entry.products.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Sin productos registrados</p>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                              <th className="pb-2 text-left font-semibold">Producto</th>
                              <th className="pb-2 text-right font-semibold">Cant.</th>
                              <th className="pb-2 text-right font-semibold">Precio</th>
                              <th className="pb-2 text-right font-semibold">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entry.products.map((product) => (
                              <tr key={product.id} className="border-t border-white/5">
                                <td className="py-2 text-foreground">{product.productName}</td>
                                <td className="py-2 text-right text-muted-foreground">{product.quantity}</td>
                                <td className="py-2 text-right text-muted-foreground">{formatCOP(product.unitPrice)}</td>
                                <td className="py-2 text-right font-semibold text-foreground">
                                  {formatCOP(product.quantity * product.unitPrice)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredGroups.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-background/40 p-10 text-center">
              <p className="text-lg font-semibold text-foreground">No hay grupos de venta</p>
              <p className="mt-2 text-sm text-muted-foreground">Ajusta tus filtros o crea un nuevo grupo.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}



