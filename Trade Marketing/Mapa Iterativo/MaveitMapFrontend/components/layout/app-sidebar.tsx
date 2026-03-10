'use client';

import React, { useState, useCallback, useMemo } from 'react';
import type { Waypoint, SalesFilter, SalesEntry } from '@/lib/models/waypoint.model';
import WaypointList from '@/components/waypoint/waypoint-list';
import SalesFilterPanel from '@/components/sales/sales-filter';
import StatisticsDashboard from '@/components/statistics/statistics-dashboard';
import { MapPin, Filter, BarChart3, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import Link from 'next/link';

type TabType = 'waypoints' | 'filters' | 'statistics';

interface AppSidebarProps {
  waypoints: Waypoint[];
  filteredWaypoints: Waypoint[];
  selectedWaypointId: number | null;
  filter: SalesFilter;
  onFilterChange: (filter: SalesFilter) => void;
  onWaypointSelect: (id: number) => void;
  onWaypointDelete: (waypoint: Waypoint) => void;
  onWaypointUpdateRequest: (waypoint: Waypoint) => void;
  onWaypointEditEntry: (waypoint: Waypoint, entry: SalesEntry) => void;
  onWaypointEditPoint: (waypoint: Waypoint) => void;
  onWaypointDeleteGroup: (waypoint: Waypoint, entry: SalesEntry) => void;
  onCatalogOpen: () => void;
  readOnly?: boolean;
}

const TABS: { id: TabType; label: string; icon: typeof MapPin }[] = [
  { id: 'waypoints', label: 'Puntos', icon: MapPin },
  { id: 'filters', label: 'Filtros', icon: Filter },
  { id: 'statistics', label: 'Stats', icon: BarChart3 },
];

export default function AppSidebar({
  waypoints,
  filteredWaypoints,
  selectedWaypointId,
  filter,
  onFilterChange,
  onWaypointSelect,
  onWaypointDelete,
  onWaypointUpdateRequest,
  onWaypointEditEntry,
  onWaypointEditPoint,
  onWaypointDeleteGroup,
  onCatalogOpen,
  readOnly = false,
}: AppSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('waypoints');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filter.searchTerm) count++;
    if (filter.dateFrom || filter.dateTo) count++;
    if (filter.minSales > 0 || filter.maxSales > 0) count++;
    if (filter.intensities.length > 0) count++;
    return count;
  }, [filter]);

  const toggleCollapse = useCallback(() => setIsCollapsed((v) => !v), []);

  return (
    <div
      className={`relative flex h-full flex-col border-r border-border bg-card transition-all duration-300 ${
        isCollapsed ? 'w-14' : 'w-96'
      }`}
    >
      {/* Collapse toggle */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition-colors hover:text-foreground"
        aria-label={isCollapsed ? 'Expandir panel' : 'Colapsar panel'}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Header */}
      <div className="shrink-0 border-b border-border px-4 py-3">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="flex items-center gap-2.5 transition-colors hover:text-primary"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground tracking-tight">
                  MapWebBusiness
                </h1>
                <p className="text-[10px] text-muted-foreground">
                  Panel de Control de Ventas
                </p>
              </div>
            </Link>
            <button
              onClick={onCatalogOpen}
              className="ml-15 flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-semibold text-primary transition-colors hover:border-primary hover:text-primary-foreground"
            >
              <Package className="h-3 w-3" />
              Catálogo
            </button>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="shrink-0 border-b border-border">
        <div className={`flex ${isCollapsed ? 'flex-col' : ''}`}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (isCollapsed) setIsCollapsed(false);
                }}
                className={`relative flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                } ${isCollapsed ? 'px-0 py-3' : 'px-3'}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {!isCollapsed && <span>{tab.label}</span>}
                {tab.id === 'filters' && activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
                {isActive && !isCollapsed && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'waypoints' && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {filteredWaypoints.length} de {waypoints.length} puntos
                </span>
              </div>
              <WaypointList
                waypoints={filteredWaypoints}
                selectedWaypointId={selectedWaypointId}
                onSelect={onWaypointSelect}
                onDelete={onWaypointDelete}
                onUpdateRequest={onWaypointUpdateRequest}
                onEditEntry={onWaypointEditEntry}
                onEditPoint={onWaypointEditPoint}
                onDeleteGroup={onWaypointDeleteGroup}
                readOnly={readOnly}
              />
            </>
          )}

          {activeTab === 'filters' && (
            <SalesFilterPanel filter={filter} onFilterChange={onFilterChange} />
          )}

          {activeTab === 'statistics' && (
            <StatisticsDashboard waypoints={filteredWaypoints} />
          )}
        </div>
      )}
    </div>
  );
}
