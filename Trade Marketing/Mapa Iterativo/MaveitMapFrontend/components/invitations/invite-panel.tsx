"use client"

import { useCallback, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserAccountResponse } from "@/lib/models/user-account.model"
import { inviteUser } from "@/lib/services/invitation.service"
import { releaseUsers } from "@/lib/services/user.service"
import { extractApiMessage } from "@/lib/utils/api-errors"
import { Loader2, UserPlus } from "lucide-react"

interface InvitePanelProps {
  userProfile: UserAccountResponse | null
  onClose: () => void
  onRefresh: () => Promise<void>
}

export default function InvitePanel({ userProfile, onClose, onRefresh }: InvitePanelProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<number | null>(null)

  const viewers = useMemo(() => userProfile?.viewers ?? [], [userProfile])

  const handleInvite = useCallback(async () => {
    if (!email.trim()) {
      setMessage("Ingresa un correo válido")
      return
    }
    setStatus("loading")
    setMessage(null)
    try {
      await inviteUser(email)
      setStatus("success")
      setMessage("Invitación enviada correctamente")
      setEmail("")
      await onRefresh()
    } catch (error) {
      setStatus("error")
      setMessage(extractApiMessage(error, "No se pudo enviar la invitación"))
    }
  }, [email, onRefresh])

  const handleRemove = useCallback(
    async (viewerId: number) => {
      setRemovingId(viewerId)
      setStatus("loading")
      setMessage(null)
      try {
        await releaseUsers([viewerId])
        setStatus("success")
        setMessage("Viewer desvinculado y ahora puede recuperar su cuenta")
        await onRefresh()
      } catch (error) {
        setStatus("error")
        setMessage(extractApiMessage(error, "No fue posible eliminar al viewer"))
      } finally {
        setRemovingId(null)
      }
    },
    [onRefresh]
  )

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 px-4 py-10">
      <div className="w-full max-w-3xl space-y-6 rounded-3xl border border-border bg-card p-8 shadow-2xl shadow-black/50">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Invitar Viewer</p>
            <h2 className="text-2xl font-bold text-foreground">Vincula a otro administrador a tu mapa</h2>
            <p className="text-sm text-muted-foreground">
              Envía una invitación por correo electrónico. Si se acepta, ese admin verá solo tu información y su cuenta
              se convierte en viewer.
            </p>
          </div>
        </div>

        <div className="grid items-end gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Correo electrónico</Label>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="correo@ejemplo.com"
              className="mt-1 bg-input/70 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button
            onClick={handleInvite}
            disabled={status === "loading"}
            className="h-12 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold uppercase tracking-wide text-sm"
          >
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar Invitación"}
          </Button>
        </div>

        {message && (
          <p
            className={`rounded-xl border px-4 py-3 text-sm ${
              status === "error"
                ? "border-destructive/70 bg-destructive/10 text-destructive-foreground"
                : "border-emerald-500/70 bg-emerald-500/10 text-emerald-100"
            }`}
          >
            {message}
          </p>
        )}

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Usuarios vinculados</p>
          <div className="mt-3 space-y-3">
            {viewers.length === 0 && (
              <p className="text-sm text-muted-foreground">No tienes viewers asociados actualmente.</p>
            )}
            {viewers.map((viewer) => (
              <div
                key={viewer.id}
                className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{viewer.name}</p>
                  <p className="text-xs text-muted-foreground">{viewer.email}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleRemove(viewer.id)}
                  disabled={removingId === viewer.id}
                  className="h-10 text-destructive border-destructive/50"
                >
                  {removingId === viewer.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Eliminar Viewer"
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
