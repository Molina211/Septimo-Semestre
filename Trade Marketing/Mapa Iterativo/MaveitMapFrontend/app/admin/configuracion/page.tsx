"use client"

import { useEffect, useMemo, useState } from "react"
import { Clock, Save, Settings } from "lucide-react"
import { extractApiMessage } from "@/lib/utils/api-errors"
import type { AdminConfigResponse } from "@/lib/models/admin.model"
import { getAdminConfig, updateAdminConfig } from "@/lib/services/admin.service"

function msToMinutes(ms: number) {
  return Math.round(ms / 60000)
}

function minutesToMs(min: number) {
  return min * 60000
}

export default function ConfigPage() {
  const [config, setConfig] = useState<AdminConfigResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  const [form, setForm] = useState({
    accessTokenMinutes: 1440,
    refreshTokenMinutes: 43200,
    invitationExpiryMinutes: 10,
    verificationExpiryMinutes: 10,
    maxVerificationAttempts: 5,
  })

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    getAdminConfig()
      .then((c) => {
        if (!active) return
        setConfig(c)
        setForm({
          accessTokenMinutes: msToMinutes(c.accessTokenExpirationMillis),
          refreshTokenMinutes: msToMinutes(c.refreshTokenExpirationMillis),
          invitationExpiryMinutes: c.defaultInvitationExpiryMinutes,
          verificationExpiryMinutes: c.verificationExpiryMinutes,
          maxVerificationAttempts: c.maxVerificationAttempts,
        })
      })
      .catch((e) => {
        if (!active) return
        setError(extractApiMessage(e, "No se pudo cargar configuración"))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const hasChanges = useMemo(() => {
    if (!config) return false
    return (
      minutesToMs(form.accessTokenMinutes) !== config.accessTokenExpirationMillis ||
      minutesToMs(form.refreshTokenMinutes) !== config.refreshTokenExpirationMillis ||
      form.invitationExpiryMinutes !== config.defaultInvitationExpiryMinutes ||
      form.verificationExpiryMinutes !== config.verificationExpiryMinutes ||
      form.maxVerificationAttempts !== config.maxVerificationAttempts
    )
  }, [config, form])

  const save = async () => {
    setSaving(true)
    setError(null)
    setOk(null)
    try {
      const updated = await updateAdminConfig({
        accessTokenExpirationMillis: minutesToMs(form.accessTokenMinutes),
        refreshTokenExpirationMillis: minutesToMs(form.refreshTokenMinutes),
        defaultInvitationExpiryMinutes: form.invitationExpiryMinutes,
        verificationExpiryMinutes: form.verificationExpiryMinutes,
        maxVerificationAttempts: form.maxVerificationAttempts,
      })
      setConfig(updated)
      setOk("Guardado")
    } catch (e) {
      setError(extractApiMessage(e, "No se pudo guardar configuración"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
            <p className="text-muted-foreground mt-1">Ajustes de seguridad y expiraciones</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
          {error}
        </div>
      )}
      {ok && (
        <div className="mb-6 rounded-2xl border border-green-500/40 bg-green-500/10 p-4 text-sm font-semibold text-green-400">
          {ok}
        </div>
      )}

      <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Tiempos</h2>
            <p className="text-sm text-muted-foreground">Estos cambios afectan nuevas sesiones/invitaciones</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Duración Access Token (min)</label>
            <input
              type="number"
              min={1}
              value={form.accessTokenMinutes}
              onChange={(e) => setForm((p) => ({ ...p, accessTokenMinutes: Number(e.target.value) }))}
              className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Duración Refresh Token (min)</label>
            <input
              type="number"
              min={1}
              value={form.refreshTokenMinutes}
              onChange={(e) => setForm((p) => ({ ...p, refreshTokenMinutes: Number(e.target.value) }))}
              className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Expiración Invitación (min)</label>
            <input
              type="number"
              min={1}
              value={form.invitationExpiryMinutes}
              onChange={(e) => setForm((p) => ({ ...p, invitationExpiryMinutes: Number(e.target.value) }))}
              className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Expiración Verificación (min)</label>
            <input
              type="number"
              min={1}
              value={form.verificationExpiryMinutes}
              onChange={(e) => setForm((p) => ({ ...p, verificationExpiryMinutes: Number(e.target.value) }))}
              className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Máx intentos verificación</label>
            <input
              type="number"
              min={1}
              max={20}
              value={form.maxVerificationAttempts}
              onChange={(e) => setForm((p) => ({ ...p, maxVerificationAttempts: Number(e.target.value) }))}
              className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={save}
            disabled={loading || saving || !hasChanges}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold rounded-xl hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  )
}

