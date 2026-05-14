"use client"

import { useEffect, useMemo, useState } from "react"
import { Calendar, Filter, History, Search } from "lucide-react"
import { getAdminLogs } from "@/lib/services/admin.service"
import type { AdminLogResponse } from "@/lib/models/admin.model"
import { extractApiMessage } from "@/lib/utils/api-errors"

function formatDateTime(value: string) {
  try {
    const d = new Date(value)
    return d.toLocaleString("es-CO")
  } catch {
    return value
  }
}

function formatIdValue(id: number | null | undefined) {
  if (id == null) return "—"
  return String(id)
}

export default function LogsPage() {
  const [logs, setLogs] = useState<AdminLogResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [action, setAction] = useState("")
  const [userId, setUserId] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const reload = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminLogs({
        action: action || undefined,
        userId: userId ? Number(userId) : undefined,
        from: from ? new Date(from).toISOString() : undefined,
        to: to ? new Date(to).toISOString() : undefined,
        limit: 250,
      })
      setLogs(data)
    } catch (e) {
      setError(extractApiMessage(e, "No se pudieron cargar los logs"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return logs
    return logs.filter((l) => {
      return (
        l.action.toLowerCase().includes(q) ||
        (l.actorEmail ?? "").toLowerCase().includes(q) ||
        (l.targetEmail ?? "").toLowerCase().includes(q) ||
        String(l.actorUserId ?? "").includes(q) ||
        String(l.targetUserId ?? "").includes(q) ||
        (l.metadata ?? "").toLowerCase().includes(q)
      )
    })
  }, [logs, search])

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Registro de Actividad</h1>
            <p className="text-muted-foreground mt-1">Historial de acciones del sistema</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
          {error}
        </div>
      )}

      <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            {/* Spacer label so this input aligns vertically with the other filter inputs */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 opacity-0 select-none">
              <Filter className="w-4 h-4" />
              Filtros
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar (acción, correo, metadata...)"
              className="w-full pl-12 pr-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Filter className="w-4 h-4" />
              Acción
            </div>
            <input
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="USER_DISABLE"
              className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Filter className="w-4 h-4" />
              User ID (actor u objetivo)
            </div>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="123"
              className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={reload}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <Calendar className="w-5 h-5" />
              Aplicar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Calendar className="w-4 h-4" />
              Desde
            </div>
            <input
              type="datetime-local"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Calendar className="w-4 h-4" />
              Hasta
            </div>
            <input
              type="datetime-local"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full min-w-[980px]">
            <thead className="bg-muted/30 border-b border-white/10">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Acción</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Actor ID</th>
                <th className="px-6 py-4">Metadata</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-white/5 hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground">{formatDateTime(l.createdAt)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{l.action}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {l.actorEmail ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{formatIdValue(l.actorUserId)}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{l.metadata ?? "—"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    {loading ? "Cargando..." : "Sin registros."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
