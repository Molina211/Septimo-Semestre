"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { acceptInvitation } from "@/lib/services/invitation.service"
import { useAuthToken } from "@/lib/hooks/use-auth-token"
import { extractApiMessage } from "@/lib/utils/api-errors"
import type { InvitationPreview } from "@/lib/models/invitation-preview.model"

interface InvitationPreviewPanelProps {
  token: string
  preview: InvitationPreview
  autoAccept?: boolean
}

export default function InvitationPreviewPanel({
  token,
  preview,
  autoAccept = false,
}: InvitationPreviewPanelProps) {
  const router = useRouter()
  const tokenState = useAuthToken()
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle")
  const [message, setMessage] = useState<string | null>(null)

  const formattedExpires = useMemo(() => {
    const date = new Date(preview.expiresAt)
    return date.toLocaleString("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }, [preview.expiresAt])

  const goHome = useCallback(() => {
    router.replace("/")
  }, [router])

  const runAccept = useCallback(async () => {
    setStatus("loading")
    setMessage(null)
    try {
      await acceptInvitation(token)
      setStatus("success")
      setMessage("Vinculación exitosa. Redirigiendo al mapa…")
      router.replace("/")
    } catch (error) {
      setStatus("error")
      setMessage(extractApiMessage(error, "No se pudo aceptar la invitación"))
    }
  }, [router, token])

  const handleAccept = () => {
    if (!tokenState) {
      const redirectTarget = `/invitations/${token}?autoAccept=1`
      router.push(`/login?redirect=${encodeURIComponent(redirectTarget)}`)
      return
    }
    runAccept()
  }

  useEffect(() => {
    if (autoAccept && tokenState && status === "idle") {
      runAccept()
    }
  }, [autoAccept, runAccept, status, tokenState])

  return (
    <main className="flex h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6 rounded-3xl border border-white/10 bg-card/90 p-10 shadow-2xl shadow-black/40 backdrop-blur-3xl">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">Invitación pendiente</p>
          <h1 className="text-3xl font-bold text-foreground">¿Deseas vincularte a este administrador?</h1>
          <p className="text-sm text-muted-foreground">
            {preview.inviterName} ({preview.inviterCompany}) te ha invitado a ver su mapa. Al aceptar, tu información actual
            (catálogos, puntos, grupos y ventas) se eliminará y solo podrás ver los datos del administrador.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background/70 p-6 text-left shadow-inner shadow-black/30">
          <p className="text-sm font-semibold text-foreground">Detalles de la invitación</p>
          <dl className="mt-3 space-y-2 text-sm text-muted-foreground">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Administrador</dt>
              <dd>{preview.inviterName}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Empresa</dt>
              <dd>{preview.inviterCompany}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Expira</dt>
              <dd>{formattedExpires}</dd>
            </div>
          </dl>
        </div>

        {message && (
          <p
            className={`rounded-xl border px-4 py-3 text-sm ${
              status === "error"
                ? "border-destructive/80 bg-destructive/10 text-destructive-foreground"
                : "border-emerald-500/70 bg-emerald-500/10 text-emerald-100"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            onClick={handleAccept}
            disabled={status === "loading" || status === "success"}
            className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
          >
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aceptar invitación"}
          </Button>
          <Button variant="outline" onClick={goHome} className="flex-1 text-muted-foreground">
            Cancelar
          </Button>
        </div>
      </div>
    </main>
  )
}
