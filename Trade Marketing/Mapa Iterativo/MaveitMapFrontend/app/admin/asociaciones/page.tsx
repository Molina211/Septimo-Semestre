"use client"

import { useEffect, useMemo, useState } from "react"
import { Link2, RefreshCw, Trash2, Unlink } from "lucide-react"
import { extractApiMessage } from "@/lib/utils/api-errors"
import type { AdminInvitationResponse } from "@/lib/models/admin.model"
import type { UserAccountResponse } from "@/lib/models/user-account.model"
import { deleteInvitation, listAllInvitations, listAllUsers, purgeExpiredInvitations } from "@/lib/services/admin.service"
import { releaseUsers } from "@/lib/services/user.service"

function formatDateTime(value: string) {
  try {
    return new Date(value).toLocaleString("es-CO")
  } catch {
    return value
  }
}

export default function AsociacionesPage() {
  const [users, setUsers] = useState<UserAccountResponse[]>([])
  const [invitations, setInvitations] = useState<AdminInvitationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = async () => {
    setLoading(true)
    setError(null)
    try {
      const [u, inv] = await Promise.all([listAllUsers(), listAllInvitations()])
      setUsers(u)
      setInvitations(inv)
    } catch (e) {
      setError(extractApiMessage(e, "No se pudo cargar asociaciones"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  const associations = useMemo(() => {
    return users
      .filter((u) => u.owner && u.role === "VIEWER")
      .map((viewer) => ({
        viewer,
        owner: viewer.owner!,
      }))
  }, [users])

  const handleRelease = async (viewerId: number) => {
    try {
      await releaseUsers([viewerId])
      await reload()
    } catch (e) {
      setError(extractApiMessage(e, "No se pudo desasociar"))
    }
  }

  const handleDeleteInvitation = async (token: string) => {
    try {
      await deleteInvitation(token)
      setInvitations((prev) => prev.filter((x) => x.token !== token))
    } catch (e) {
      setError(extractApiMessage(e, "No se pudo eliminar la invitación"))
    }
  }

  const handlePurgeExpired = async () => {
    try {
      await purgeExpiredInvitations()
      await reload()
    } catch (e) {
      setError(extractApiMessage(e, "No se pudo eliminar invitaciones expiradas"))
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Asociaciones</h1>
            <p className="text-muted-foreground mt-1">Gestión de viewers e invitaciones pendientes</p>
          </div>
        </div>
        <button
          onClick={reload}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-input/50 border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refrescar
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground">Viewers Asociados</h2>
          <p className="text-sm text-muted-foreground mt-1">Usuarios en rol Viewer con un administrador vinculado</p>
          <div className="mt-5 space-y-3">
            {associations.length === 0 ? (
              <p className="text-sm text-muted-foreground">{loading ? "Cargando..." : "No hay asociaciones."}</p>
            ) : (
              associations.map(({ viewer, owner }) => (
                <div
                  key={viewer.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 px-4 py-4 shadow-inner shadow-black/20"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{viewer.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{viewer.email}</p>
                    <p className="mt-2 text-xs text-muted-foreground truncate">
                      Vinculado a: <span className="text-foreground font-semibold">{owner.email}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleRelease(viewer.id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/15 transition-all"
                  >
                    <Unlink className="w-4 h-4" />
                    Desasociar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Invitaciones</h2>
              <p className="text-sm text-muted-foreground mt-1">Todas las invitaciones pendientes del sistema</p>
            </div>
            <button
              onClick={handlePurgeExpired}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-input/50 border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Purga expiradas
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {invitations.length === 0 ? (
              <p className="text-sm text-muted-foreground">{loading ? "Cargando..." : "No hay invitaciones."}</p>
            ) : (
              invitations.map((inv) => (
                <div
                  key={inv.token}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 px-4 py-4 shadow-inner shadow-black/20"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{inv.inviteeEmail}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      Invitador: {inv.inviterEmail ?? "—"}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground truncate">
                      Expira: <span className="text-foreground">{formatDateTime(inv.expiresAt)}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteInvitation(inv.token)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/15 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

