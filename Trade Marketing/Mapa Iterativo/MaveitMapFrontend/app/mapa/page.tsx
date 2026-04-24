'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import type {
  Waypoint,
  MapMode,
  SalesFilter,
  ProductSale,
  SalesEntry,
  SalesIntensitySettings,
  IntensityLevel,
} from '@/lib/models/waypoint.model';
import {
  DEFAULT_INTENSITY_SETTINGS,
  buildIntensityLegend,
  getIntensityColor,
} from '@/lib/models/waypoint.model';
import {
  getWaypoints,
  addWaypoint,
  deleteWaypoint,
  filterWaypoints,
  appendWaypointSales,
  updateWaypointEntry,
  updateWaypoint,
  deleteWaypointEntry,
} from '@/lib/services/waypoint.service';
import MapModeToggle from '@/components/map/map-mode-toggle';
import WaypointForm from '@/components/waypoint/waypoint-form';
import AppSidebar from '@/components/layout/app-sidebar';
import SalesGroupsModal from '@/components/sales/sales-groups-modal';
import SalesGroupDetailModal from '@/components/sales/sales-group-detail-modal';
import type { CatalogProductApi } from '@/lib/models/catalog-product.model';
import {
  listCatalogProducts,
  createCatalogProduct,
  updateCatalogProduct,
  deleteCatalogProduct,
} from '@/lib/services/catalog.service';
import { formatBogotaDateTime, toBogotaLocalInputValue } from '@/lib/utils/time-utils';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import InvitePanel from '@/components/invitations/invite-panel';
import { Button } from '@/components/ui/button';
import { useAuthToken } from '@/lib/hooks/use-auth-token';
import { parseAuthToken } from '@/lib/utils/jwt.utils';
import { getUserProfile } from '@/lib/services/user.service';
import { fetchInvitationPreview, acceptInvitation } from '@/lib/services/invitation.service';
import type { InvitationPreview } from '@/lib/models/invitation-preview.model';
import type { UserAccountResponse } from '@/lib/models/user-account.model';
import { extractApiMessage } from '@/lib/utils/api-errors';
import { Loader2 } from 'lucide-react';
import {
  getSalesIntensitySettings,
  updateSalesIntensitySettings,
} from '@/lib/services/sales-intensity.service';

const InteractiveMap = dynamic(() => import('@/components/map/interactive-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Cargando mapa...</span>
      </div>
    </div>
  ),
});

const DEFAULT_FILTER: SalesFilter = {
  dateFrom: '',
  dateTo: '',
  minSales: 0,
  maxSales: 0,
  intensities: [],
  searchTerm: '',
  intensitySort: null,
};

type ProductDefinition = CatalogProductApi;

const formatEntryDate = (value: string) => formatBogotaDateTime(value);

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const TREND_WINDOW_DAYS = 30;

function normalize(values: number[]): number[] {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const denom = max - min;
  if (!Number.isFinite(denom) || denom <= 0) return values.map(() => 0);
  return values.map((v) => (v - min) / denom);
}

function intensityFromPercentile(percentile: number): IntensityLevel {
  if (percentile < 0.2) return 'very-low';
  if (percentile < 0.4) return 'low';
  if (percentile < 0.6) return 'medium';
  if (percentile < 0.8) return 'high';
  return 'very-high';
}

function applyWaypointIntensityHeuristic(waypoints: Waypoint[]): Waypoint[] {
  const now = Date.now();
  const monetary = waypoints.map((wp) => Math.log1p(Math.max(0, wp.totalSales ?? 0)));
  const frequency = waypoints.map((wp) => (wp.salesHistory ?? []).length);
  const recency = waypoints.map((wp) => {
    const entries = wp.salesHistory ?? [];
    if (entries.length === 0) return 0;
    const times = entries
      .map((e) => new Date(e.date).getTime())
      .filter((t) => Number.isFinite(t));
    if (times.length === 0) return 0;
    const last = Math.max(...times);
    const days = Math.max(0, Math.floor((now - last) / MS_PER_DAY));
    return 1 / (days + 1);
  });

  const monetaryN = normalize(monetary);
  const frequencyN = normalize(frequency);
  const recencyN = normalize(recency);

  const scoreRFM = waypoints.map((_, idx) => {
    return recencyN[idx] * 0.4 + frequencyN[idx] * 0.3 + monetaryN[idx] * 0.3;
  });

  const trendRaw = waypoints.map((wp) => {
    const entries = wp.salesHistory ?? [];
    if (entries.length === 0) return 0;
    const currentFrom = now - TREND_WINDOW_DAYS * MS_PER_DAY;
    const previousFrom = now - TREND_WINDOW_DAYS * 2 * MS_PER_DAY;
    const current = entries.reduce((sum, entry) => {
      const t = new Date(entry.date).getTime();
      if (!Number.isFinite(t)) return sum;
      return t >= currentFrom ? sum + (entry.totalSales || 0) : sum;
    }, 0);
    const previous = entries.reduce((sum, entry) => {
      const t = new Date(entry.date).getTime();
      if (!Number.isFinite(t)) return sum;
      return t >= previousFrom && t < currentFrom ? sum + (entry.totalSales || 0) : sum;
    }, 0);
    return (current - previous) / (previous + 1);
  });
  const trendN = normalize(trendRaw);

  const scoredRFM = scoreRFM.map((score, idx) => ({ score, idx }));
  scoredRFM.sort((a, b) => a.score - b.score);
  const percentilesRFM = new Array(waypoints.length).fill(0);
  scoredRFM.forEach((item, rank) => {
    const denom = scoredRFM.length > 1 ? scoredRFM.length - 1 : 1;
    percentilesRFM[item.idx] = rank / denom;
  });

  const scoreFinal = scoreRFM.map((score, idx) => {
    return score * 0.5 + trendN[idx] * 0.3 + percentilesRFM[idx] * 0.2;
  });

  const scoredFinal = scoreFinal.map((score, idx) => ({ score, idx }));
  scoredFinal.sort((a, b) => a.score - b.score);
  const percentilesFinal = new Array(waypoints.length).fill(0);
  scoredFinal.forEach((item, rank) => {
    const denom = scoredFinal.length > 1 ? scoredFinal.length - 1 : 1;
    percentilesFinal[item.idx] = rank / denom;
  });

  return waypoints.map((wp, idx) => {
    const intensity = intensityFromPercentile(percentilesFinal[idx]);
    const color = getIntensityColor(intensity);
    if (wp.intensity === intensity && wp.color === color) return wp;
    return { ...wp, intensity, color };
  });
}

export default function SalesMapApp() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [mode, setMode] = useState<MapMode>('navigate');
  const [selectedWaypointId, setSelectedWaypointId] = useState<number | null>(null);
  const [filter, setFilter] = useState<SalesFilter>(DEFAULT_FILTER);
  const [pendingPoint, setPendingPoint] = useState<{ lng: number; lat: number } | null>(null);
  const [editingWaypoint, setEditingWaypoint] = useState<Waypoint | null>(null);
  const [editingEntry, setEditingEntry] = useState<SalesEntry | null>(null);
  const [formMode, setFormMode] = useState<'new' | 'group' | 'point'>('new');
  const [newEntryDateTime, setNewEntryDateTime] = useState<string | null>(null);
  const [salesGroupsWaypointId, setSalesGroupsWaypointId] = useState<number | null>(null);
  const [salesGroupsOpen, setSalesGroupsOpen] = useState(false);
  const [salesGroupsOpenMode, setSalesGroupsOpenMode] = useState<'fresh' | 'resume'>('fresh');
  const [salesGroupDetailOpen, setSalesGroupDetailOpen] = useState(false);
  const [salesGroupDetailEntryId, setSalesGroupDetailEntryId] = useState<string | null>(null);
  const [salesGroupDetailSource, setSalesGroupDetailSource] = useState<'quick' | 'groups-list'>('groups-list');
  const [resumeSalesGroups, setResumeSalesGroups] = useState(false);
  const [resumeGroupDetailEntryId, setResumeGroupDetailEntryId] = useState<string | null>(null);
  const [formContextKey, setFormContextKey] = useState(0);
  const [pendingDelete, setPendingDelete] = useState<{
    type: 'waypoint' | 'group' | 'bulk-groups';
    waypoint: Waypoint;
    entry?: SalesEntry;
    entryIds?: string[];
    fallbackToWaypoint?: boolean;
  } | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [productCatalog, setProductCatalog] = useState<ProductDefinition[]>([]);
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [newCatalogProduct, setNewCatalogProduct] = useState({ name: '', basePrice: '' });
  const [editingCatalogId, setEditingCatalogId] = useState<number | null>(null);
  const [pendingCatalogDelete, setPendingCatalogDelete] = useState<ProductDefinition | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [intensitySettings, setIntensitySettings] = useState<SalesIntensitySettings>(
    DEFAULT_INTENSITY_SETTINGS
  );
  const [intensityEditorOpen, setIntensityEditorOpen] = useState(false);
  const [intensityDraft, setIntensityDraft] = useState<SalesIntensitySettings>(
    DEFAULT_INTENSITY_SETTINGS
  );
  const [intensitySaving, setIntensitySaving] = useState(false);
  const [intensityError, setIntensityError] = useState<string | null>(null);
  const [intensityFieldErrors, setIntensityFieldErrors] = useState<
    Partial<Record<keyof SalesIntensitySettings, string>>
  >({});
  const hasIntensityErrors = useMemo(
    () => Boolean(intensityError) || Object.values(intensityFieldErrors).some(Boolean),
    [intensityError, intensityFieldErrors]
  );
  const [isInvitePanelOpen, setIsInvitePanelOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserAccountResponse | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const token = useAuthToken();
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationQueryToken = searchParams.get('invitation');
  const invitationStorageKey = 'mwb_pending_invitation';
  const [currentInvitationToken, setCurrentInvitationToken] = useState<string | null>(null);
  const [invitationPreview, setInvitationPreview] = useState<InvitationPreview | null>(null);
  const [invitationLoading, setInvitationLoading] = useState(false);
  const [invitationError, setInvitationError] = useState<string | null>(null);
  const [invitationAccepting, setInvitationAccepting] = useState(false);
  const [invitationAcceptError, setInvitationAcceptError] = useState<string | null>(null);
  const [showViewerNotice, setShowViewerNotice] = useState(false);
  const authPayload = useMemo(() => parseAuthToken(token), [token]);
  const isViewer = userProfile?.role === 'VIEWER';
  // La leyenda usa rangos fijos en COP (configurados por usuario) para grupos de venta; los puntos usan RFM+Tendencia+Percentil.
  const intensityLegend = useMemo(
    () => buildIntensityLegend(intensitySettings),
    [intensitySettings]
  );
  const canShowInvitation = useMemo(() => {
    if (!currentInvitationToken || !invitationPreview) return false;
    if (!authPayload?.email || !invitationPreview.inviteeEmail) return false;
    return invitationPreview.inviteeEmail.toLowerCase() === authPayload.email.toLowerCase();
  }, [authPayload?.email, currentInvitationToken, invitationPreview]);

  useEffect(() => {
    if (authPayload?.role === 'SUPER_ADMIN') {
      router.replace('/admin');
    }
  }, [authPayload?.role, router]);

  const reloadWaypoints = useCallback(async () => {
    if (!token) {
      return;
    }
    try {
      const items = await getWaypoints(intensitySettings);
      setWaypoints(applyWaypointIntensityHeuristic(items));
    } catch (error) {
      if (extractApiMessage(error, 'Token requerido').toLowerCase().includes('token')) {
        router.replace('/login');
        return;
      }
      console.error(error);
    }
  }, [intensitySettings, router, token]);

  useEffect(() => {
    if (!token) {
      return undefined;
    }
    let active = true;
    (async () => {
      try {
        let resolvedSettings = DEFAULT_INTENSITY_SETTINGS;
        try {
          const settings = await getSalesIntensitySettings();
          if (!active) return;
          resolvedSettings = settings;
          setIntensitySettings(settings);
        } catch (settingsError) {
          if (!active) return;
          setIntensitySettings(DEFAULT_INTENSITY_SETTINGS);
        }
        const items = await getWaypoints(resolvedSettings);
        if (!active) return;
        setWaypoints(applyWaypointIntensityHeuristic(items));
      } catch (error) {
        if (extractApiMessage(error, 'Token requerido').toLowerCase().includes('token')) {
          router.replace('/login');
          return;
        }
        console.error(error);
      }
    })();
    return () => {
      active = false;
    };
  }, [router, token]);

  const openInvitePanel = useCallback(() => {
    setIsInvitePanelOpen(true);
  }, []);

  const closeInvitePanel = useCallback(() => {
    setIsInvitePanelOpen(false);
  }, []);

  const openIntensityEditor = useCallback(() => {
    setIntensityDraft(intensitySettings);
    setIntensityError(null);
    setIntensityFieldErrors({});
    setIntensityEditorOpen(true);
  }, [intensitySettings]);

  const closeIntensityEditor = useCallback(() => {
    setIntensityEditorOpen(false);
    setIntensityError(null);
    setIntensityFieldErrors({});
  }, []);

  const handleIntensityDraftChange = useCallback(
    (field: keyof SalesIntensitySettings, value: string) => {
      const parsed = Number(value);
      setIntensityDraft((prev) => ({
        ...prev,
        [field]: Number.isFinite(parsed) ? parsed : 0,
      }));
    },
    []
  );

  useEffect(() => {
    const { veryLowMax, lowMax, mediumMax, highMax } = intensityDraft;
    const fieldErrors: Partial<Record<keyof SalesIntensitySettings, string>> = {};
    if (!veryLowMax || veryLowMax <= 0) fieldErrors.veryLowMax = 'Debe ser mayor que cero';
    if (!lowMax || lowMax <= 0) fieldErrors.lowMax = 'Debe ser mayor que cero';
    if (!mediumMax || mediumMax <= 0) fieldErrors.mediumMax = 'Debe ser mayor que cero';
    if (!highMax || highMax <= 0) fieldErrors.highMax = 'Debe ser mayor que cero';
    if (Object.keys(fieldErrors).length === 0) {
      if (!(veryLowMax < lowMax)) {
        fieldErrors.lowMax = 'El mínimo no puede ser mayor al máximo';
      }
      if (!(lowMax < mediumMax)) {
        fieldErrors.mediumMax = 'El mínimo no puede ser mayor al máximo';
      }
      if (!(mediumMax < highMax)) {
        fieldErrors.highMax = 'El mínimo no puede ser mayor al máximo';
      }
    }
    setIntensityFieldErrors(fieldErrors);
    setIntensityError(
      Object.keys(fieldErrors).length > 0 ? 'Corrige los rangos antes de guardar.' : null
    );
  }, [intensityDraft]);

  const handleSaveIntensitySettings = useCallback(async () => {
    const { veryLowMax, lowMax, mediumMax, highMax } = intensityDraft;
    const fieldErrors: Partial<Record<keyof SalesIntensitySettings, string>> = {};
    if (!veryLowMax || veryLowMax <= 0) fieldErrors.veryLowMax = 'Debe ser mayor que cero';
    if (!lowMax || lowMax <= 0) fieldErrors.lowMax = 'Debe ser mayor que cero';
    if (!mediumMax || mediumMax <= 0) fieldErrors.mediumMax = 'Debe ser mayor que cero';
    if (!highMax || highMax <= 0) fieldErrors.highMax = 'Debe ser mayor que cero';
    if (Object.keys(fieldErrors).length > 0) {
      setIntensityFieldErrors(fieldErrors);
      setIntensityError('Corrige los campos marcados.');
      return;
    }
    if (!(veryLowMax < lowMax)) {
      fieldErrors.lowMax = 'Debe ser mayor que Muy baja';
    }
    if (!(lowMax < mediumMax)) {
      fieldErrors.mediumMax = 'Debe ser mayor que Baja';
    }
    if (!(mediumMax < highMax)) {
      fieldErrors.highMax = 'Debe ser mayor que Media';
    }
    if (Object.keys(fieldErrors).length > 0) {
      setIntensityFieldErrors(fieldErrors);
      setIntensityError('Los rangos deben estar en orden ascendente.');
      return;
    }
    setIntensitySaving(true);
    try {
      const saved = await updateSalesIntensitySettings(intensityDraft);
      setIntensitySettings(saved);
      setIntensityDraft(saved);
      setIntensityFieldErrors({});
      setIntensityEditorOpen(false);
      setIntensityError(null);
    } catch (error) {
      setIntensityError(extractApiMessage(error, 'No se pudo guardar el rango de ventas'));
    } finally {
      setIntensitySaving(false);
    }
  }, [intensityDraft]);

  const fetchUserProfile = useCallback(async (): Promise<void> => {
    if (!authPayload?.userId) {
      setUserProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    try {
      const profile = await getUserProfile(authPayload.userId);
      setUserProfile(profile);
      setProfileError(null);
    } catch (error) {
    setProfileError(extractApiMessage(error, 'No se pudo cargar el perfil'));
    } finally {
      setProfileLoading(false);
    }
  }, [authPayload?.userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (!isViewer || !userProfile?.id) {
      setShowViewerNotice(false);
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }
    const key = `mwb_viewer_notice_dismissed_${userProfile.id}`;
    const dismissed = window.sessionStorage.getItem(key) === '1';
    setShowViewerNotice(!dismissed);
  }, [isViewer, userProfile?.id]);

  useEffect(() => {
    if (isViewer && mode !== 'navigate') {
      setMode('navigate');
    }
  }, [isViewer, mode]);

  useEffect(() => {
    if (invitationQueryToken) {
      setCurrentInvitationToken(invitationQueryToken);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(invitationStorageKey, invitationQueryToken);
      }
      return;
    }
    if (typeof window !== 'undefined') {
      const storedToken = window.localStorage.getItem(invitationStorageKey);
      if (storedToken) {
        setCurrentInvitationToken(storedToken);
        return;
      }
    }
    setCurrentInvitationToken(null);
  }, [invitationQueryToken]);

  const clearInvitationQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('invitation');
    const nextPath = params.toString() ? `/?${params.toString()}` : '/';
    router.replace(nextPath, { scroll: false });
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(invitationStorageKey);
    }
    setCurrentInvitationToken(null);
    setInvitationPreview(null);
    setInvitationAcceptError(null);
  }, [router, searchParams]);

  useEffect(() => {
    if (currentInvitationToken) {
      setInvitationLoading(true);
      setInvitationError(null);
      fetchInvitationPreview(currentInvitationToken)
        .then((preview) => {
          const inviteeEmail = preview.inviteeEmail?.toLowerCase();
          const viewerEmail = authPayload?.email?.toLowerCase();
          if (inviteeEmail && viewerEmail && inviteeEmail !== viewerEmail) {
            setInvitationPreview(null);
            setInvitationError(null);
            setInvitationLoading(false);
            return;
          }
          setInvitationPreview(preview);
          setInvitationLoading(false);
        })
        .catch((error) => {
          setInvitationError(extractApiMessage(error, 'No se pudo cargar la invitación'));
          setInvitationLoading(false);
        });
    } else {
      setInvitationPreview(null);
      setInvitationError(null);
      setInvitationLoading(false);
    }
  }, [authPayload?.email, clearInvitationQuery, currentInvitationToken]);

  useEffect(() => {
    if (!currentInvitationToken) return;
    if (typeof window === 'undefined') return;
    const storedToken = window.localStorage.getItem('maveit_map_token');
    if (token || storedToken) return;
    const target = `/?invitation=${encodeURIComponent(currentInvitationToken)}`;
    router.replace(`/login?redirect=${encodeURIComponent(target)}`);
  }, [currentInvitationToken, router, token]);

  const handleAcceptInvitation = useCallback(async () => {
    if (!currentInvitationToken) return;
    setInvitationAccepting(true);
    setInvitationAcceptError(null);
    try {
      await acceptInvitation(currentInvitationToken);
      await fetchUserProfile();
      try {
        const settings = await getSalesIntensitySettings();
        setIntensitySettings(settings);
        setIntensityDraft(settings);
        setWaypoints((prev) => applyWaypointIntensityHeuristic(prev));
      } catch (settingsError) {
        setIntensitySettings(DEFAULT_INTENSITY_SETTINGS);
        setIntensityDraft(DEFAULT_INTENSITY_SETTINGS);
      }
      if (typeof window !== 'undefined' && authPayload?.userId) {
        const key = `mwb_viewer_notice_dismissed_${authPayload.userId}`;
        window.sessionStorage.removeItem(key);
      }
      setShowViewerNotice(true);
      clearInvitationQuery();
    } catch (error) {
      setInvitationAcceptError(extractApiMessage(error, 'No se pudo aceptar la invitación'));
    } finally {
      setInvitationAccepting(false);
    }
  }, [clearInvitationQuery, currentInvitationToken, fetchUserProfile]);

  const handleCancelInvitation = useCallback(() => {
    clearInvitationQuery();
  }, [clearInvitationQuery]);

  const handleDismissViewerNotice = useCallback(() => {
    if (typeof window !== 'undefined' && userProfile?.id) {
      const key = `mwb_viewer_notice_dismissed_${userProfile.id}`;
      window.sessionStorage.setItem(key, '1');
    }
    setShowViewerNotice(false);
  }, [userProfile?.id]);

  useEffect(() => {
    if (!token) {
      setProductCatalog([]);
      setCatalogError(null);
      setCatalogLoading(false);
      return undefined;
    }
    let active = true;
    setCatalogLoading(true);
    listCatalogProducts()
      .then((items) => {
        if (!active) return;
        setProductCatalog(items);
        setCatalogError(null);
      })
      .catch((error) => {
        if (extractApiMessage(error, 'Token requerido').toLowerCase().includes('token')) {
          router.replace('/login');
          return;
        }
        console.error(error);
        if (active) {
          setCatalogError('No se pudo cargar el catálogo');
        }
      })
      .finally(() => {
        if (active) {
          setCatalogLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [router, token]);

  const productPricePresets = useMemo(() => {
    return productCatalog.reduce<Record<string, number[]>>((acc, product) => {
      if (!product.name.trim()) return acc;
      acc[product.name] = [product.basePrice];
      return acc;
    }, {});
  }, [productCatalog]);

  const salesGroupsWaypoint = useMemo(() => {
    if (salesGroupsWaypointId == null) return null;
    return waypoints.find((w) => w.id === salesGroupsWaypointId) ?? null;
  }, [salesGroupsWaypointId, waypoints]);

  const salesGroupIndex = useMemo(() => {
    const flat = waypoints.flatMap((waypoint) =>
      (waypoint.salesHistory ?? []).map((entry) => ({
        waypointId: waypoint.id,
        entryId: entry.id,
        salesGroupId: entry.salesGroup?.id ?? null,
        sortDate: entry.salesGroup?.saleDateTime ?? entry.date,
      }))
    );

    flat.sort((a, b) => {
      const aNum = a.salesGroupId != null ? Number(a.salesGroupId) : Number.NaN;
      const bNum = b.salesGroupId != null ? Number(b.salesGroupId) : Number.NaN;
      const aHasNum = Number.isFinite(aNum);
      const bHasNum = Number.isFinite(bNum);
      if (aHasNum && bHasNum && aNum !== bNum) return aNum - bNum;
      if (aHasNum !== bHasNum) return aHasNum ? -1 : 1;

      const aTime = Date.parse(a.sortDate);
      const bTime = Date.parse(b.sortDate);
      const aHasTime = Number.isFinite(aTime);
      const bHasTime = Number.isFinite(bTime);
      if (aHasTime && bHasTime && aTime !== bTime) return aTime - bTime;
      if (aHasTime !== bHasTime) return aHasTime ? -1 : 1;

      return a.entryId.localeCompare(b.entryId);
    });

    const numberByEntryId = new Map<string, number>();
    const waypointIdsByNumber = new Map<number, Set<number>>();
    flat.forEach((item, index) => {
      const groupNumber = index + 1;
      numberByEntryId.set(item.entryId, groupNumber);
      const existing = waypointIdsByNumber.get(groupNumber);
      if (existing) {
        existing.add(item.waypointId);
      } else {
        waypointIdsByNumber.set(groupNumber, new Set([item.waypointId]));
      }
    });
    return { numberByEntryId, waypointIdsByNumber };
  }, [waypoints]);

  const groupSearchNumber = useMemo(() => {
    const raw = filter.searchTerm.trim();
    const match = raw.match(/^#\s*(\d+)$/);
    if (!match) return null;
    const parsed = Number(match[1]);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [filter.searchTerm]);

  const filteredWaypoints = useMemo(() => {
    if (groupSearchNumber == null) return filterWaypoints(waypoints, filter);
    const allowedIds = salesGroupIndex.waypointIdsByNumber.get(groupSearchNumber);
    if (!allowedIds || allowedIds.size === 0) return [];
    const subset = waypoints.filter((waypoint) => allowedIds.has(waypoint.id));
    return filterWaypoints(subset, { ...filter, searchTerm: '' });
  }, [filter, groupSearchNumber, salesGroupIndex.waypointIdsByNumber, waypoints]);

  const openSalesGroups = useCallback((waypoint: Waypoint) => {
    setSelectedWaypointId(waypoint.id);
    setSalesGroupsWaypointId(waypoint.id);
    setSalesGroupsOpen(true);
    setSalesGroupsOpenMode('fresh');
    setSalesGroupDetailOpen(false);
    setSalesGroupDetailEntryId(null);
  }, []);

  const openSalesGroupDetail = useCallback(
    (waypoint: Waypoint, entry: SalesEntry, source: 'quick' | 'groups-list' = 'quick') => {
    setSelectedWaypointId(waypoint.id);
    setSalesGroupsWaypointId(waypoint.id);
    setSalesGroupsOpen(false);
    setSalesGroupsOpenMode('resume');
    setSalesGroupDetailEntryId(entry.id);
    setSalesGroupDetailSource(source);
    setSalesGroupDetailOpen(true);
    },
    []
  );

  const closeSalesGroups = useCallback(() => {
    setSalesGroupsOpen(false);
    setSalesGroupsOpenMode('fresh');
  }, []);

  const returnToSalesGroups = useCallback(() => {
    setSalesGroupDetailOpen(false);
    setSalesGroupDetailEntryId(null);
    if (salesGroupDetailSource === 'groups-list' && salesGroupsWaypointId != null) {
      setSalesGroupsOpenMode('resume');
      setSalesGroupsOpen(true);
    }
  }, [salesGroupDetailSource, salesGroupsWaypointId]);

  const handleMapClick = useCallback(
    (lng: number, lat: number) => {
      if (mode === 'add-waypoint') {
        setPendingPoint({ lng, lat });
        setEditingWaypoint(null);
        setEditingEntry(null);
        setNewEntryDateTime(null);
        setFormMode('new');
      }
    },
    [mode]
  );

  const handleWaypointSelect = useCallback((id: number) => {
    setSelectedWaypointId((prev) => (prev === id ? null : id));
  }, []);

  const handleWaypointOpenFromMap = useCallback(
    (id: number) => {
      const waypoint = waypoints.find((w) => w.id === id);
      if (!waypoint) {
        setSelectedWaypointId(id);
        return;
      }
      openSalesGroups(waypoint);
    },
    [openSalesGroups, waypoints]
  );

  const handleSaveWaypoint = useCallback(
    async (data: {
      id?: string;
      name: string;
      label: string;
      lng: number;
      lat: number;
      totalSales: number;
      dateTime: string;
      products: ProductSale[];
      entryId?: string;
    }) => {
      try {
        if (data.id) {
        if (formMode === 'point') {
          await updateWaypoint(data.id, {
            name: data.name,
            label: data.label,
            lng: data.lng,
            lat: data.lat,
            visitDateTime: data.dateTime,
          });
        } else if (data.entryId) {
          await updateWaypointEntry(data.id, data.entryId, {
            date: data.dateTime,
            products: data.products,
          });
        } else {
          await appendWaypointSales(data.id, {
            date: data.dateTime,
            products: data.products,
          });
        }
          setEditingWaypoint(null);
          setEditingEntry(null);
          setNewEntryDateTime(null);
        } else {
          await addWaypoint({
            name: data.name,
            label: data.label,
            lng: data.lng,
            lat: data.lat,
            totalSales: data.totalSales,
            date: data.dateTime,
            products: data.products,
          });
          setPendingPoint(null);
          setNewEntryDateTime(null);
        }
        await reloadWaypoints();
        setFormMode('new');
        setMode('navigate');
        if (resumeGroupDetailEntryId && salesGroupsWaypointId != null) {
          setSalesGroupDetailEntryId(resumeGroupDetailEntryId);
          setSalesGroupDetailOpen(true);
          setResumeGroupDetailEntryId(null);
        } else if (resumeSalesGroups && salesGroupsWaypointId != null) {
          setSalesGroupsOpenMode('resume');
          setSalesGroupsOpen(true);
          setResumeSalesGroups(false);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [formMode, reloadWaypoints, resumeGroupDetailEntryId, resumeSalesGroups, salesGroupsWaypointId]
  );

  const performDeleteWaypoint = useCallback(
    async (id: number) => {
      try {
        await deleteWaypoint(id);
        await reloadWaypoints();
        setSelectedWaypointId((prev) => (prev === id ? null : prev));
      } catch (error) {
        console.error(error);
      }
    },
    [reloadWaypoints]
  );

  const handleRequestEditEntry = useCallback((waypoint: Waypoint, entry: SalesEntry) => {
    setEditingWaypoint(waypoint);
    setEditingEntry(entry);
    setPendingPoint(null);
    setNewEntryDateTime(null);
    setFormMode('group');
  }, []);

  const handleEditGroupFromDetail = useCallback(
    (waypoint: Waypoint, entry: SalesEntry) => {
      // We entered the form from the single-group detail view; return to that same group after save/cancel.
      setResumeGroupDetailEntryId(entry.id);
      setResumeSalesGroups(false);
      setSalesGroupDetailOpen(false);
      setSalesGroupDetailEntryId(null);
      setSalesGroupsOpen(false);
      setSalesGroupsOpenMode('resume');
      handleRequestEditEntry(waypoint, entry);
    },
    [handleRequestEditEntry]
  );

  const requestDeleteGroup = useCallback((waypoint: Waypoint, entry: SalesEntry) => {
    const fallbackToWaypoint = waypoint.salesHistory.length <= 1;
    setPendingDelete({ type: 'group', waypoint, entry, fallbackToWaypoint });
  }, []);

  const requestBulkDeleteGroups = useCallback((waypoint: Waypoint, entryIds: string[]) => {
    setPendingDelete({ type: 'bulk-groups', waypoint, entryIds });
  }, []);

  const requestDeleteWaypoint = useCallback((waypoint: Waypoint) => {
    setPendingDelete({ type: 'waypoint', waypoint });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDelete || deleteSubmitting) return;
    setDeleteSubmitting(true);
    const deleteContext = pendingDelete;
    try {
      if (deleteContext.type === 'waypoint') {
        await performDeleteWaypoint(deleteContext.waypoint.id);
      } else if (deleteContext.type === 'bulk-groups') {
        const ids = deleteContext.entryIds ?? [];
        const allGroupsSelected = ids.length >= deleteContext.waypoint.salesHistory.length;
        if (allGroupsSelected) {
          await performDeleteWaypoint(deleteContext.waypoint.id);
        } else {
          await Promise.all(ids.map((id) => deleteWaypointEntry(id)));
          await reloadWaypoints();
          setEditingWaypoint(null);
          setEditingEntry(null);
          setFormMode('new');
        }
      } else if (deleteContext.entry) {
        if (deleteContext.fallbackToWaypoint) {
          await performDeleteWaypoint(deleteContext.waypoint.id);
        } else {
          await deleteWaypointEntry(deleteContext.entry.id);
          await reloadWaypoints();
          setEditingWaypoint(null);
          setEditingEntry(null);
          setFormMode('new');
        }
      }

      // Close the confirmation first, then switch views (so the user never sees the list while the delete is still processing).
      setPendingDelete(null);
      setDeleteSubmitting(false);

      setTimeout(() => {
        if (deleteContext.type === 'group' || deleteContext.type === 'bulk-groups') {
          const removingWholeWaypoint =
            deleteContext.type === 'group'
              ? !!deleteContext.fallbackToWaypoint
              : (deleteContext.entryIds?.length ?? 0) >= deleteContext.waypoint.salesHistory.length;

          setSalesGroupDetailOpen(false);
          setSalesGroupDetailEntryId(null);

          if (removingWholeWaypoint) {
            setSalesGroupsOpen(false);
            setSalesGroupsOpenMode('fresh');
            setSalesGroupsWaypointId(null);
          } else {
            setSalesGroupsWaypointId(deleteContext.waypoint.id);
            setSalesGroupsOpenMode('resume');
            setSalesGroupsOpen(true);
          }
        } else if (deleteContext.type === 'waypoint') {
          setSalesGroupDetailOpen(false);
          setSalesGroupDetailEntryId(null);
          setSalesGroupsOpen(false);
          setSalesGroupsOpenMode('fresh');
          setSalesGroupsWaypointId(null);
        }
      }, 0);
    } catch (error) {
      console.error(error);
      setDeleteSubmitting(false);
    }
  }, [deleteSubmitting, pendingDelete, performDeleteWaypoint, reloadWaypoints]);

  const handleCancelDelete = useCallback(() => {
    if (deleteSubmitting) return;
    setPendingDelete(null);
  }, [deleteSubmitting]);

  const handleSaveCatalogProduct = useCallback(async (product: ProductDefinition) => {
    try {
      const updated = await updateCatalogProduct(product.id, {
        name: product.name.trim(),
        basePrice: product.basePrice,
      });
      setProductCatalog((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setCatalogError(null);
    } catch (error) {
      console.error(error);
      setCatalogError((error as Error).message || 'No se pudo actualizar el producto');
    } finally {
      setEditingCatalogId(null);
    }
  }, []);

  const handleCatalogNameChange = useCallback((id: number, name: string) => {
    setProductCatalog((prev) =>
      prev.map((product) => (product.id === id ? { ...product, name } : product))
    );
  }, []);

  const handleCatalogBasePriceChange = useCallback((id: number, value: string) => {
    const parsed = parseFloat(value);
    setProductCatalog((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, basePrice: Number.isNaN(parsed) ? 0 : parsed } : product
      )
    );
  }, []);

  const handleNewCatalogChange = useCallback(
    (field: 'name' | 'basePrice', value: string) => {
      setNewCatalogProduct((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCreateCatalogProduct = useCallback(async () => {
    if (!newCatalogProduct.name.trim()) return;
    const parsed = parseFloat(newCatalogProduct.basePrice);
    if (Number.isNaN(parsed) || parsed <= 0) return;
    try {
      const created = await createCatalogProduct({
        name: newCatalogProduct.name.trim(),
        basePrice: parsed,
      });
      setProductCatalog((prev) => [...prev, created]);
      setNewCatalogProduct({ name: '', basePrice: '' });
      setCatalogError(null);
    } catch (error) {
      console.error(error);
      setCatalogError((error as Error).message || 'No se pudo crear el producto');
    }
  }, [newCatalogProduct]);

  const handleRequestCatalogDelete = useCallback((product: ProductDefinition) => {
    setPendingCatalogDelete(product);
  }, []);

  const handleConfirmCatalogDelete = useCallback(async () => {
    if (!pendingCatalogDelete) return;
    try {
      await deleteCatalogProduct(pendingCatalogDelete.id);
      setProductCatalog((prev) => prev.filter((product) => product.id !== pendingCatalogDelete.id));
      setCatalogError(null);
    } catch (error) {
      console.error(error);
      setCatalogError((error as Error).message || 'No se pudo eliminar el producto');
    } finally {
      setPendingCatalogDelete(null);
    }
  }, [pendingCatalogDelete]);

  const handleCancelCatalogDelete = useCallback(() => {
    setPendingCatalogDelete(null);
  }, []);

  const handleWaypointCreateGroup = useCallback((waypoint: Waypoint) => {
    setNewEntryDateTime(toBogotaLocalInputValue());
    setEditingWaypoint(waypoint);
    setEditingEntry(null);
    setPendingPoint(null);
    setFormMode('group');
  }, []);

  const handleCreateGroupFromSalesGroups = useCallback(
    (waypoint: Waypoint) => {
      setSalesGroupsOpenMode('resume');
      setResumeSalesGroups(true);
      handleWaypointCreateGroup(waypoint);
    },
    [handleWaypointCreateGroup]
  );

  const handleRequestEditPointDetails = useCallback((waypoint: Waypoint) => {
    setFormMode('point');
    setEditingWaypoint(waypoint);
    setEditingEntry(null);
    setPendingPoint(null);
    setNewEntryDateTime(null);
  }, []);

  const handleEditGroupFromSalesGroups = useCallback(
    (waypoint: Waypoint, entry: SalesEntry) => {
      setSalesGroupsOpenMode('resume');
      setResumeSalesGroups(true);
      handleRequestEditEntry(waypoint, entry);
    },
    [handleRequestEditEntry]
  );

  const handleCancelForm = useCallback(() => {
    setPendingPoint(null);
    setEditingWaypoint(null);
    setEditingEntry(null);
    setNewEntryDateTime(null);
    setFormMode('new');
    if (resumeGroupDetailEntryId && salesGroupsWaypointId != null) {
      setSalesGroupDetailEntryId(resumeGroupDetailEntryId);
      setSalesGroupDetailOpen(true);
      setResumeGroupDetailEntryId(null);
    } else if (resumeSalesGroups && salesGroupsWaypointId != null) {
      setSalesGroupsOpenMode('resume');
      setSalesGroupsOpen(true);
      setResumeSalesGroups(false);
    }
  }, [resumeGroupDetailEntryId, resumeSalesGroups, salesGroupsWaypointId]);

  const formCoordinates = editingWaypoint
    ? { lng: editingWaypoint.lng, lat: editingWaypoint.lat }
    : pendingPoint;
  useEffect(() => {
    setFormContextKey((prev) => prev + 1);
  }, [
    formMode,
    pendingPoint?.lat,
    pendingPoint?.lng,
    editingWaypoint?.id,
    editingEntry?.id,
  ]);
  const formContextSignature = useMemo(() => {
    if (editingEntry && editingWaypoint) {
      return `entry-${editingWaypoint.id}-${editingEntry.id}-${formContextKey}`;
    }
    if (formMode === 'group' && editingWaypoint) {
      return `group-${editingWaypoint.id}-${newEntryDateTime ?? ''}-${formContextKey}`;
    }
    if (formMode === 'point' && editingWaypoint) {
      return `point-${editingWaypoint.id}-${formMode}-${formContextKey}`;
    }
    if (pendingPoint) {
      return `new-${pendingPoint.lat.toFixed(4)}-${pendingPoint.lng.toFixed(4)}-${formMode}-${formContextKey}`;
    }
    return `idle-${formMode}-${editingWaypoint?.id ?? 'none'}-${formContextKey}`;
  }, [editingEntry, editingWaypoint, formMode, newEntryDateTime, pendingPoint, formContextKey]);

  if (authPayload?.role === 'SUPER_ADMIN') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
        <AppSidebar
          waypoints={waypoints}
          filteredWaypoints={filteredWaypoints}
          selectedWaypointId={selectedWaypointId}
          filter={filter}
          onFilterChange={setFilter}
          onWaypointSelect={handleWaypointSelect}
          onWaypointDelete={requestDeleteWaypoint}
          onWaypointEditPoint={handleRequestEditPointDetails}
          onWaypointOpenGroups={openSalesGroups}
          onWaypointOpenGroup={openSalesGroupDetail}
          onCatalogOpen={() => setCatalogModalOpen(true)}
          readOnly={isViewer}
        />

      {/* Map area */}
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0">
          <InteractiveMap
            waypoints={filteredWaypoints}
            mode={mode}
            selectedWaypointId={selectedWaypointId}
            onMapClick={handleMapClick}
            onWaypointSelect={handleWaypointOpenFromMap}
            intensityLegend={intensityLegend}
            onEditIntensity={openIntensityEditor}
            showEditIntensity={!isViewer}
          />
        </div>

        {profileError && (
          <div className="absolute top-16 left-1/2 z-30 w-[min(520px,90vw)] -translate-x-1/2 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive shadow-lg shadow-black/30 backdrop-blur-lg">
            {profileError}
          </div>
        )}

        {isViewer && userProfile?.owner && showViewerNotice && (
          <div className="absolute left-1/2 top-24 z-30 w-[min(560px,92vw)] -translate-x-1/2 rounded-3xl border border-border/70 bg-card/95 p-6 text-sm text-foreground shadow-2xl shadow-black/40 backdrop-blur-3xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">Modo Viewer</p>
                <p className="text-xl font-semibold text-foreground">
                  Estás viendo la cuenta de {userProfile.owner.name}
                </p>
              </div>
              <button
                type="button"
                onClick={handleDismissViewerNotice}
                className="rounded-full border border-border/60 px-3 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                Cerrar
              </button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Tus datos propios se reemplazaron por los del administrador asociado. Solo puedes ver su información.
              Si deseas recuperar tu cuenta, desasóciate desde el perfil.
            </p>
            <div className="mt-4 rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Administrador vinculado</p>
              <p className="text-base font-semibold text-foreground">{userProfile.owner.name}</p>
              <p className="text-xs text-muted-foreground">{userProfile.owner.email}</p>
              <p className="text-xs text-muted-foreground">{userProfile.owner.companyName}</p>
            </div>
          </div>
        )}

        {currentInvitationToken && canShowInvitation && (
          <div className="relative z-40">
            {(invitationLoading || invitationPreview || invitationError) && (
              <div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-3xl space-y-5 rounded-3xl border border-border bg-card/95 p-8 shadow-2xl shadow-black/60 backdrop-blur-3xl">
                  <div className="space-y-2 text-center">
                    <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">
                      Invitación pendiente
                    </p>
                    <h2 className="text-3xl font-bold text-foreground">¿Deseas aceptar la invitación?</h2>
                    <p className="text-sm text-muted-foreground">
                      Se eliminará toda tu información (catálogos, puntos de venta y grupos) para ver exclusivamente
                      el mapa del administrador invitante.
                    </p>
                  </div>

                  {invitationPreview && (
                    <div className="rounded-2xl border border-border bg-background/60 p-6 text-left shadow-inner shadow-black/30">
                      <p className="text-sm font-semibold text-foreground">Detalle de la invitación</p>
                      <dl className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <div>
                          <dt className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Administrador</dt>
                          <dd>{invitationPreview.inviterName}</dd>
                                              </div>
                        <div>
                          <dt className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Empresa</dt>
                          <dd>{invitationPreview.inviterCompany}</dd>
                                              </div>
                        <div>
                          <dt className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Expira</dt>
                          <dd>{new Date(invitationPreview.expiresAt).toLocaleString('es-CO', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}</dd>
                                              </div>
                      </dl>
                    </div>
                  )}

                  {invitationError && (
                    <p className="rounded-xl border border-destructive/70 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {invitationError}
                    </p>
                  )}

                  {invitationAcceptError && (
                    <p className="rounded-xl border border-destructive/70 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {invitationAcceptError}
                    </p>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      onClick={handleAcceptInvitation}
                      disabled={invitationLoading || invitationAccepting}
                      className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
                    >
                      {invitationLoading || invitationAccepting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Aceptar invitación'
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleCancelInvitation} className="flex-1 text-muted-foreground">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode toggle */}
        <MapModeToggle
          mode={mode}
          onModeChange={setMode}
          onInviteClick={openInvitePanel}
          showAddPoint={!isViewer}
          showInvite={!isViewer}
          showProfile
        />

        {/* Waypoint creation form */}
          {formCoordinates && (
            <WaypointForm
              lng={formCoordinates.lng}
              lat={formCoordinates.lat}
              waypointId={editingWaypoint?.id}
                entryId={editingEntry?.id}
            initialData={
              editingWaypoint
                ? (() => {
                    const hasEntryContext = !!editingEntry;
                    const activeEntry =
                      editingEntry ??
                      editingWaypoint.salesHistory[editingWaypoint.salesHistory.length - 1];
                    const defaultDateTime =
                      formMode === 'point'
                        ? toBogotaLocalInputValue(editingWaypoint.visitDateTime)
                        : hasEntryContext
                          ? activeEntry?.date
                          : newEntryDateTime ?? activeEntry?.date ?? toBogotaLocalInputValue();
                    const defaultProducts =
                      editingEntry?.products ??
                      (formMode === 'group' && !editingEntry ? [] : activeEntry?.products ?? []);
                    return {
                      name: editingWaypoint.name,
                      label: editingWaypoint.label,
                      dateTime: defaultDateTime,
                      products: defaultProducts,
                    };
                  })()
                : undefined
            }
            title={
              formMode === 'point'
                ? 'Editar punto de venta'
                : editingWaypoint
                  ? 'Actualizar punto de venta'
                  : undefined
            }
            mode={formMode}
            pricePresets={productPricePresets}
            catalogProducts={productCatalog}
            contextSignature={formContextSignature}
            onSave={handleSaveWaypoint}
            onCancel={handleCancelForm}
          />
        )}
      </div>

      <SalesGroupsModal
        waypoint={salesGroupsWaypoint}
        isOpen={salesGroupsOpen}
        openMode={salesGroupsOpenMode}
        intensitySettings={intensitySettings}
        readOnly={isViewer}
        onClose={closeSalesGroups}
        onOpenGroupDetail={openSalesGroupDetail}
        onRequestBulkDelete={requestBulkDeleteGroups}
        onCreateGroup={handleCreateGroupFromSalesGroups}
        onEditGroup={handleEditGroupFromSalesGroups}
        onDeleteGroup={requestDeleteGroup}
      />

      <SalesGroupDetailModal
        waypoint={salesGroupsWaypoint}
        entryId={salesGroupDetailEntryId}
        groupNumber={
          salesGroupDetailEntryId
            ? (salesGroupIndex.numberByEntryId.get(salesGroupDetailEntryId) ?? null)
            : null
        }
        isOpen={salesGroupDetailOpen}
        intensitySettings={intensitySettings}
        readOnly={isViewer}
        onBack={returnToSalesGroups}
        onEditGroup={handleEditGroupFromDetail}
        onDeleteGroup={requestDeleteGroup}
      />

      {pendingDelete && typeof window !== 'undefined'
        ? createPortal(
            <div
              className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 px-4 pointer-events-auto"
              onClick={handleCancelDelete}
            >
              <div
                className="w-full max-w-md rounded-2xl bg-card/95 p-6 shadow-2xl backdrop-blur-lg pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Confirmación</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">
                  {pendingDelete.type === 'bulk-groups'
                    ? 'Eliminar grupos seleccionados'
                    : pendingDelete.type === 'group' && pendingDelete.fallbackToWaypoint
                      ? 'Eliminar punto de venta'
                      : pendingDelete.type === 'group'
                        ? 'Eliminar grupo de ventas'
                        : 'Eliminar punto de venta'}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {pendingDelete.type === 'bulk-groups'
                    ? (() => {
                        const ids = pendingDelete.entryIds ?? [];
                        const allGroupsSelected = ids.length >= pendingDelete.waypoint.salesHistory.length;
                        return allGroupsSelected
                          ? `¿Eliminar ${ids.length} grupos seleccionados? Como son todos los grupos, se eliminará también el punto de venta y su historial.`
                          : `¿Eliminar ${ids.length} grupos seleccionados sin afectar el resto del punto?`;
                      })()
                    : pendingDelete.type === 'group'
                      ? pendingDelete.fallbackToWaypoint
                        ? '¿Eliminar este grupo de ventas sin afectar el resto del punto? Como este es el único grupo, se eliminará también el punto de venta y su historial.'
                        : '¿Eliminar este grupo de ventas sin afectar el resto del punto?'
                      : 'Se eliminará todo el punto de venta, sus productos y su historial.'}
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelDelete}
                    disabled={deleteSubmitting}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={deleteSubmitting}
                    className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/80 disabled:opacity-70"
                  >
                    {deleteSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Eliminando...
                      </span>
                    ) : pendingDelete.type === 'bulk-groups' ? (
                      'Eliminar seleccionados'
                    ) : pendingDelete.type === 'group' && pendingDelete.fallbackToWaypoint ? (
                      'Eliminar punto'
                    ) : (
                      'Eliminar'
                    )}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {intensityEditorOpen && (
        <div
          className="fixed inset-0 z-65 flex items-center justify-center bg-black/70 px-4"
          onClick={closeIntensityEditor}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-card/95 p-6 shadow-2xl backdrop-blur-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Editar rango</p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Ganancias en venta</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Ajusta los límites máximos para cada nivel. Los valores deben estar en orden ascendente.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Esta configuración colorea las ventas (grupos) dentro de los puntos del mapa. Editarla no cambia el
              color de los puntos; ese se asigna automáticamente.
            </p>
            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Muy baja (máximo)</label>
                <input
                  type="number"
                  min={1}
                  value={intensityDraft.veryLowMax}
                  onChange={(e) => handleIntensityDraftChange('veryLowMax', e.target.value)}
                  className={`w-full rounded-md border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 ${
                    intensityFieldErrors.veryLowMax
                      ? 'border-destructive focus:border-destructive focus:ring-destructive/40'
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                />
                {intensityFieldErrors.veryLowMax && (
                  <p className="text-[11px] text-destructive">{intensityFieldErrors.veryLowMax}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Baja (máximo)</label>
                <input
                  type="number"
                  min={1}
                  value={intensityDraft.lowMax}
                  onChange={(e) => handleIntensityDraftChange('lowMax', e.target.value)}
                  className={`w-full rounded-md border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 ${
                    intensityFieldErrors.lowMax
                      ? 'border-destructive focus:border-destructive focus:ring-destructive/40'
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                />
                {intensityFieldErrors.lowMax && (
                  <p className="text-[11px] text-destructive">{intensityFieldErrors.lowMax}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Media (máximo)</label>
                <input
                  type="number"
                  min={1}
                  value={intensityDraft.mediumMax}
                  onChange={(e) => handleIntensityDraftChange('mediumMax', e.target.value)}
                  className={`w-full rounded-md border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 ${
                    intensityFieldErrors.mediumMax
                      ? 'border-destructive focus:border-destructive focus:ring-destructive/40'
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                />
                {intensityFieldErrors.mediumMax && (
                  <p className="text-[11px] text-destructive">{intensityFieldErrors.mediumMax}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Alta (máximo)</label>
                <input
                  type="number"
                  min={1}
                  value={intensityDraft.highMax}
                  onChange={(e) => handleIntensityDraftChange('highMax', e.target.value)}
                  className={`w-full rounded-md border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 ${
                    intensityFieldErrors.highMax
                      ? 'border-destructive focus:border-destructive focus:ring-destructive/40'
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                />
                {intensityFieldErrors.highMax && (
                  <p className="text-[11px] text-destructive">{intensityFieldErrors.highMax}</p>
                )}
              </div>
              {intensityError && (
                <p className="rounded-lg border border-destructive/60 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {intensityError}
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeIntensityEditor}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveIntensitySettings}
                disabled={intensitySaving || hasIntensityErrors}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {intensitySaving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isInvitePanelOpen && (
        <InvitePanel userProfile={userProfile} onClose={closeInvitePanel} onRefresh={fetchUserProfile} />
      )}

      {catalogModalOpen && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setCatalogModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-card/95 p-6 shadow-2xl backdrop-blur-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Catálogo de productos</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {isViewer
                ? 'Vista de solo lectura del catálogo.'
                : 'Cada producto maneja un precio base que se aplica por defecto cuando se selecciona. Puedes editar o eliminar un producto desde aquí.'}
            </p>
            {catalogLoading && (
              <p className="mt-1 text-xs text-muted-foreground">Sincronizando con el servidor...</p>
            )}
            {catalogError && (
              <p className="mt-1 text-xs text-destructive">{catalogError}</p>
            )}
            <div className="mt-4 space-y-4">
              {!isViewer && (
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Crear producto</p>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      value={newCatalogProduct.name}
                      onChange={(e) => handleNewCatalogChange('name', e.target.value)}
                      placeholder="Nombre"
                      className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={newCatalogProduct.basePrice}
                      onChange={(e) => handleNewCatalogChange('basePrice', e.target.value)}
                      placeholder="Precio base"
                      className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={handleCreateCatalogProduct}
                      className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Crear producto
                    </button>
                    <button
                      type="button"
                      onClick={() => setCatalogModalOpen(false)}
                      className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
              <div className="max-h-[50vh] space-y-3 overflow-auto">
                {productCatalog.map((product) => (
                  <div key={product.id} className="rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                          {product.name || 'Producto sin nombre'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Precio base ${product.basePrice.toLocaleString()}
                        </p>
                                            </div>
                      {!isViewer && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingCatalogId((prev) => (prev === product.id ? null : product.id))
                            }
                            className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-primary transition-colors hover:border-primary"
                          >
                            {editingCatalogId === product.id ? 'Ocultar' : 'Editar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRequestCatalogDelete(product)}
                            className="rounded-full border border-destructive px-3 py-1 text-xs font-semibold text-destructive transition-colors hover:border-destructive hover:text-destructive-foreground"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                    {!isViewer && editingCatalogId === product.id && (
                      <div className="mt-4 space-y-3 border-t border-border/60 pt-3">
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => handleCatalogNameChange(product.id, e.target.value)}
                          placeholder="Nombre"
                          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={product.basePrice}
                          onChange={(e) => handleCatalogBasePriceChange(product.id, e.target.value)}
                          placeholder="Precio base"
                          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveCatalogProduct(product)}
                          className="mt-1 rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                        >
                          Guardar cambios
                        </button>
                                            </div>
                    )}
                  </div>
                ))}
                {!productCatalog.length && !catalogLoading && (
                  <p className="text-xs text-muted-foreground">No hay productos en el catálogo.</p>
                )}
              </div>
              {isViewer && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCatalogModalOpen(false)}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {!isViewer && pendingCatalogDelete && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center bg-black/70 px-4"
          onClick={handleCancelCatalogDelete}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card/95 p-5 shadow-2xl backdrop-blur-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Confirmación</p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              Eliminar producto
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              ¿Estás seguro de eliminar "{pendingCatalogDelete.name}"? Esta acción borrará su precio base.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelCatalogDelete}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmCatalogDelete}
                className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/80"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AuthGuard>
  );
}



