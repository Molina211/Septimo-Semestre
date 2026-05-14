"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  MapPin,
  User,
  Mail,
  Building2,
  Shield,
  Calendar,
  LogOut,
  ChevronLeft,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthGuard from "@/components/auth/AuthGuard"
import { useAuthToken } from "@/lib/hooks/use-auth-token"
import { logout } from "@/lib/services/auth.service"
import { getUserProfile } from "@/lib/services/user.service"
import { parseAuthToken } from "@/lib/utils/jwt.utils"
import type { UserAccountResponse } from "@/lib/models/user-account.model"
import { ApiError } from "@/lib/services/api.client"

export default function ProfilePage() {
  const router = useRouter()
  const token = useAuthToken()
  const authPayload = useMemo(() => {
    if (!token) {
      return null
    }
    return parseAuthToken(token)
  }, [token])
  const [profile, setProfile] = useState<UserAccountResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (!authPayload) {
      return
    }
    let active = true
    setLoading(true)
    getUserProfile(authPayload.userId)
      .then((data) => {
        if (!active) return
        setProfile(data)
        setError(null)
      })
      .catch((reason) => {
        if (!active) return
        if (reason instanceof ApiError) {
          setError(reason.message)
        } else {
          setError("No se pudo cargar la información del perfil")
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [authPayload, router])

  const memberSince = useMemo(() => {
    if (!profile?.createdAt) {
      return ""
    }
    return new Date(profile.createdAt).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }, [profile])

  const roleLabel = useMemo(() => {
    if (!profile) {
      return ""
    }
    switch (profile.role) {
      case "SUPER_ADMIN":
        return "Superadministrador"
      default:
        return "Administrador"
    }
  }, [profile])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
      router.replace("/login")
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-background to-slate-950/90" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] bg-primary/5 rounded-full blur-[160px]" />
        </div>

        <main className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg space-y-6 text-foreground">
            <div>
              <Link
                href="/mapa"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Volver al mapa
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/80 shadow-2xl shadow-black/40">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/20 to-accent/20" />
              <div className="relative px-8 pb-8 pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm uppercase tracking-[0.5em] text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      Mi perfil
                    </div>
                    <p className="text-xs text-muted-foreground">Información personal y acceso</p>
                  </div>
                  {loading && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      Cargando…
                    </div>
                  )}
                </div>

                {error && (
                  <p className="mt-4 rounded-xl border border-destructive/70 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-4 shadow-inner shadow-black/20">
                    <div>
                      <p className="text-xs text-muted-foreground">Cuenta</p>
                      <p className="text-lg font-semibold text-foreground">{profile?.name ?? "Usuario"}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                        profile?.sessionActive
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {profile?.sessionActive ? "Sesión activa" : "Sesión inactiva"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <User className="w-5 h-5 text-primary" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Nombre completo</p>
                        <p className="text-sm font-medium text-foreground">{profile?.name ?? "—"}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Correo electrónico</p>
                        <p className="text-sm font-medium text-foreground">{profile?.email ?? "—"}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <Building2 className="w-5 h-5 text-accent" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Empresa</p>
                        <p className="text-sm font-medium text-foreground">{profile?.companyName ?? "—"}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Rol</p>
                        <p className="text-sm font-medium text-foreground">{roleLabel}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Miembro desde</p>
                        <p className="text-sm font-medium text-foreground">{memberSince || "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>



                <div className="mt-8">
                  <Button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="group relative w-full overflow-hidden rounded-xl border border-destructive/40 bg-transparent px-4 py-3 text-sm font-semibold text-destructive transition-all duration-300 hover:border-destructive/70 hover:text-destructive-foreground disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-destructive/80 to-destructive opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoggingOut ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Cerrando sesión…
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4" />
                          Cerrar sesión
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

