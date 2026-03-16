"use client"

import { useEffect, useMemo, useState } from "react"
import { Activity, Link2, TrendingUp, UserCheck, Users, UserX } from "lucide-react"
import { getAdminLogs, getAdminStats } from "@/lib/services/admin.service"
import type { AdminLogResponse, AdminStatsResponse } from "@/lib/models/admin.model"
import { extractApiMessage } from "@/lib/utils/api-errors"

function formatRelative(ts: string): string {
  const date = new Date(ts)
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Hace un momento"
  if (mins < 60) return `Hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Hace ${hrs} h`
  const days = Math.floor(hrs / 24)
  return `Hace ${days} d`
}

function actionLabel(action: string): { label: string; type: string } {
  const a = (action ?? "").toUpperCase()
  if (a === "USER_CREATE") return { label: "Usuario creado", type: "create" }
  if (a === "USER_DELETE") return { label: "Usuario eliminado", type: "delete" }
  if (a === "USER_ENABLE") return { label: "Usuario habilitado", type: "enable" }
  if (a === "USER_DISABLE") return { label: "Usuario deshabilitado", type: "disable" }
  if (a === "USER_UPDATE") return { label: "Usuario editado", type: "edit" }
  if (a === "INVITATION_DELETE") return { label: "Invitación eliminada", type: "invitation" }
  if (a === "INVITATION_PURGE_EXPIRED") return { label: "Invitaciones expiradas eliminadas", type: "invitation" }
  if (a === "LOGOUT") return { label: "Sesión cerrada", type: "logout" }
  if (a === "LOGIN") return { label: "Inicio de sesión", type: "login" }
  if (a === "TOKEN_REFRESH") return { label: "Renovación de sesión", type: "refresh" }
  if (a === "CONFIG_UPDATE") return { label: "Configuración actualizada", type: "config" }
  return { label: action, type: "other" }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null)
  const [logs, setLogs] = useState<AdminLogResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    Promise.all([getAdminStats(), getAdminLogs({ limit: 6 })])
      .then(([s, l]) => {
        if (!active) return
        setStats(s)
        setLogs(l)
      })
      .catch((e) => {
        if (!active) return
        setError(extractApiMessage(e, "No se pudo cargar el dashboard"))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const cards = useMemo(() => {
    const s = stats
    return [
      {
        label: "Total Usuarios",
        value: s ? String(s.totalUsers) : "-",
        icon: Users,
        color: "primary",
        change: "",
      },
      {
        label: "Sesiones Activas",
        value: s ? String(s.sessionActiveUsers) : "-",
        icon: UserCheck,
        color: "green",
        change: "",
      },
      {
        label: "Sesiones Inactivas",
        value: s ? String(s.sessionInactiveUsers) : "-",
        icon: UserX,
        color: "destructive",
        change: "",
      },
      {
        label: "Asociaciones",
        value: s ? String(s.associations) : "-",
        icon: Link2,
        color: "accent",
        change: "",
      },
    ]
  }, [stats])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Bienvenido al panel de administración</p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((stat) => (
          <div
            key={stat.label}
            className="relative group bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${
                stat.color === "primary"
                  ? "from-primary/10"
                  : stat.color === "green"
                    ? "from-green-500/10"
                    : stat.color === "destructive"
                      ? "from-destructive/10"
                      : "from-accent/10"
              } to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`}
            />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {loading ? "Cargando..." : "Actual"}
                  </span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === "primary"
                    ? "bg-primary/20 text-primary"
                    : stat.color === "green"
                      ? "bg-green-500/20 text-green-500"
                      : stat.color === "destructive"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-accent/20 text-accent"
                }`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Actividad Reciente</h2>
            <p className="text-sm text-muted-foreground">Últimas acciones en el sistema</p>
          </div>
        </div>
        <div className="space-y-4">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">{loading ? "Cargando..." : "Sin actividad registrada."}</p>
          ) : (
            logs.map((entry) => {
              const { label, type } = actionLabel(entry.action)
              const who = entry.targetEmail ?? entry.actorEmail ?? "—"
              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        type === "create"
                          ? "bg-green-500"
                          : type === "logout"
                            ? "bg-blue-500"
                            : type === "disable" || type === "delete"
                              ? "bg-destructive"
                              : type === "invitation"
                                ? "bg-orange-500"
                                : "bg-primary"
                      }`}
                    />
                    <div>
                      <p className="text-foreground font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground">{who}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{formatRelative(entry.createdAt)}</span>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
