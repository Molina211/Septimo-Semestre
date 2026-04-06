'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import type { Waypoint, MapMode, IntensityLegendItem } from '@/lib/models/waypoint.model';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface InteractiveMapProps {
  waypoints: Waypoint[];
  mode: MapMode;
  selectedWaypointId: number | null;
  onMapClick: (lng: number, lat: number) => void;
  onWaypointSelect: (id: number) => void;
  intensityLegend?: IntensityLegendItem[];
  onEditIntensity?: () => void;
  showEditIntensity?: boolean;
}

export default function InteractiveMap({
  waypoints,
  mode,
  selectedWaypointId,
  onMapClick,
  onWaypointSelect,
  intensityLegend = [],
  onEditIntensity,
  showEditIntensity = false,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [hoveredWaypoint, setHoveredWaypoint] = useState<{
    waypoint: Waypoint;
    position: { x: number; y: number };
  } | null>(null);

  const initMap = useCallback(async () => {
    const mapboxgl = (await import('mapbox-gl')).default;

    if (!mapContainerRef.current || mapRef.current) return;

    if (!MAPBOX_TOKEN) {
      console.error('[InteractiveMap] No se proporcionó NEXT_PUBLIC_MAPBOX_TOKEN');
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-75.307, 2.934],
      zoom: 11,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      'bottom-left'
    );

    mapRef.current = map;

    return map;
  }, []);

  useEffect(() => {
    let isMounted = true;
    initMap().then((map) => {
      if (!isMounted || !map) return;
    });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initMap]);

  // Handle map click for adding waypoints
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      if (mode === 'add-waypoint') {
        onMapClick(e.lngLat.lng, e.lngLat.lat);
      }
    };

    map.on('click', handleClick);

    if (mode === 'add-waypoint') {
      map.getCanvas().style.cursor = 'crosshair';
    } else {
      map.getCanvas().style.cursor = '';
    }

    return () => {
      map.off('click', handleClick);
    };
  }, [mode, onMapClick]);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      mapRef.current?.resize();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setHoveredWaypoint(null);
  }, [waypoints]);

  // Render markers
  useEffect(() => {
    const renderMarkers = async () => {
      const mapboxgl = (await import('mapbox-gl')).default;
      const map = mapRef.current;
      if (!map) return;

      // Remove existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }

      waypoints.forEach((wp) => {
        const isSelected = wp.id === selectedWaypointId;

        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'waypoint-marker';
        const size = isSelected ? '28px' : '20px';
        el.style.cssText = `
          width: ${size};
          height: ${size};
          background: ${wp.color};
          border: 3px solid ${isSelected ? '#ffffff' : 'rgba(255,255,255,0.5)'};
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 ${isSelected ? '16px' : '10px'} ${wp.color}88,
                      0 2px 8px rgba(0,0,0,0.4);
        `;

        const popup = new mapboxgl.Popup({
          offset: 20,
          closeButton: false,
          closeOnClick: false,
          className: 'waypoint-popup',
        }).setHTML(`
          <div style="
            background: rgba(23, 25, 35, 0.95);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 10px 14px;
            color: #e2e8f0;
            font-family: system-ui, -apple-system, sans-serif;
            min-width: 160px;
          ">
            <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">${wp.name}</div>
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: ${wp.color};
              "></span>
              <span style="font-size: 11px; color: #94a3b8;">${wp.label}</span>
            </div>
            <div style="font-size: 14px; font-weight: 700; color: ${wp.color};">
              $${wp.totalSales.toLocaleString()}
            </div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">${wp.productCount} productos</div>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([wp.lng, wp.lat])
          .addTo(map);

        const updateHoverPosition = (event: MouseEvent) => {
          const container = mapContainerRef.current;
          if (!container) return;
          const rect = container.getBoundingClientRect();
          setHoveredWaypoint({
            waypoint: wp,
            position: {
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
            },
          });
        };

        el.addEventListener('mouseenter', updateHoverPosition);
        el.addEventListener('mousemove', updateHoverPosition);
        el.addEventListener('mouseleave', () => {
          setHoveredWaypoint((prev) => (prev?.waypoint.id === wp.id ? null : prev));
        });
        el.addEventListener('dblclick', (event) => {
          event.preventDefault();
          event.stopPropagation();
          onWaypointSelect(wp.id);
        });

        if (isSelected) {
          popupRef.current = popup;
          popup.addTo(map);
        }

        markersRef.current.push(marker);
      });
    };

    // Small delay to ensure map is loaded
    const timer = setTimeout(renderMarkers, 300);
    return () => clearTimeout(timer);
  }, [waypoints, selectedWaypointId, onWaypointSelect]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />

      {hoveredWaypoint && (
        <div
          className="pointer-events-none absolute z-20"
          style={{
            left: hoveredWaypoint.position.x,
            top: hoveredWaypoint.position.y,
          }}
        >
          <div className="relative -translate-x-1/2 -translate-y-full rounded-2xl border border-border bg-card/90 px-3 py-2 text-xs font-medium text-foreground shadow-2xl backdrop-blur-md">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {hoveredWaypoint.waypoint.label}
            </div>
            <div className="mt-0.5 text-sm font-bold">{hoveredWaypoint.waypoint.name}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              ${hoveredWaypoint.waypoint.totalSales.toLocaleString()} · {hoveredWaypoint.waypoint.productCount} productos
            </div>
            <span
              className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-card/90 shadow-2xl"
              style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
        </div>
      )}

      {/* Mode indicator overlay */}
      {mode === 'add-waypoint' && (
        <div className="pointer-events-none absolute top-4 left-1/2 z-10 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-card/90 px-4 py-2 shadow-lg backdrop-blur-sm">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
            </span>
            <span className="text-sm font-medium text-foreground">
              Haz clic en el mapa para agregar un punto de venta
            </span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-8 left-4 z-10">
        <div className="rounded-lg border border-border bg-card/90 p-3 shadow-lg backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Ganancias en venta
            </p>
            {showEditIntensity && onEditIntensity && (
              <button
                type="button"
                onClick={onEditIntensity}
                className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Editar
              </button>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            {intensityLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: item.color, boxShadow: `0 0 6px ${item.color}66` }}
                />
                <span className="text-xs text-foreground">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }
        .mapboxgl-popup-tip {
          display: none !important;
        }
        .mapboxgl-ctrl-group {
          background: rgba(23, 25, 35, 0.9) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 8px !important;
          backdrop-filter: blur(12px) !important;
        }
        .mapboxgl-ctrl-group button {
          border-color: rgba(255,255,255,0.1) !important;
        }
        .mapboxgl-ctrl-group button + button {
          border-top-color: rgba(255,255,255,0.1) !important;
        }
        .mapboxgl-ctrl-group button span {
          filter: invert(1) !important;
        }
        .mapboxgl-ctrl-attrib {
          background: rgba(23, 25, 35, 0.7) !important;
          color: rgba(255,255,255,0.4) !important;
          font-size: 10px !important;
          border-radius: 4px !important;
        }
        .mapboxgl-ctrl-attrib a {
          color: rgba(255,255,255,0.5) !important;
        }
      `}</style>
    </div>
  );
}
