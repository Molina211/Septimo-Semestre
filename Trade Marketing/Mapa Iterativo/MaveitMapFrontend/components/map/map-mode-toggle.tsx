'use client';

import { useCallback } from 'react';
import type { MapMode } from '@/lib/models/waypoint.model';
import { useRouter } from 'next/navigation';
import { Navigation, MapPin, User, UserPlus } from 'lucide-react';
import { useAuthToken } from '@/lib/hooks/use-auth-token';

interface MapModeToggleProps {
  mode: MapMode;
  onModeChange: (mode: MapMode) => void;
  onInviteClick: () => void;
  showAddPoint?: boolean;
  showInvite?: boolean;
  showProfile?: boolean;
}

export default function MapModeToggle({
  mode,
  onModeChange,
  onInviteClick,
  showAddPoint = true,
  showInvite = true,
  showProfile = true,
}: MapModeToggleProps) {
  const router = useRouter();
  const token = useAuthToken();
  const openProfile = useCallback(() => {
    router.push('/perfil');
  }, [router]);

  const buttonBase =
    'flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card/90';

  if (!token) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="flex overflow-hidden rounded-lg border border-border bg-card/90 shadow-lg backdrop-blur-sm">
        <button
          onClick={() => onModeChange('navigate')}
          className={`${buttonBase} font-medium ${
            mode === 'navigate'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
          aria-label="Modo navegacion"
        >
          <Navigation className="h-4 w-4" />
          <span>Navegar</span>
        </button>
        {showAddPoint && (
          <button
            onClick={() => onModeChange('add-waypoint')}
            className={`${buttonBase} font-medium ${
              mode === 'add-waypoint'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
            aria-label="Modo agregar punto"
          >
            <MapPin className="h-4 w-4" />
            <span>Agregar Punto</span>
          </button>
        )}
        {showInvite && (
          <button
            type="button"
            onClick={onInviteClick}
            onMouseDown={(event) => event.currentTarget.blur()}
            className={`${buttonBase} bg-card text-muted-foreground transition hover:bg-primary/10 hover:text-primary-foreground`}
            aria-label="Abrir panel de invitaciones"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invitar</span>
          </button>
        )}
        {showProfile && (
          <button
            type="button"
            onClick={openProfile}
            onMouseDown={(event) => event.currentTarget.blur()}
            className={`${buttonBase} cursor-pointer bg-card text-muted-foreground transition hover:bg-primary hover:text-primary-foreground`}
            aria-label="Abrir perfil"
          >
            <User className="h-4 w-4" />
            <span>Perfil</span>
          </button>
        )}
      </div>
    </div>
  );
}
