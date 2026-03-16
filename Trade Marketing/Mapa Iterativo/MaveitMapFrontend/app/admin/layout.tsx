"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { History, LayoutDashboard, Link2, LogOut, Map, Settings, Users } from "lucide-react"
import SuperAdminGuard from "@/components/auth/SuperAdminGuard"
import { logout } from "@/lib/services/auth.service"
import { getUserProfile } from "@/lib/services/user.service"
import { useAuthToken } from "@/lib/hooks/use-auth-token"
import { parseAuthToken } from "@/lib/utils/jwt.utils"
import type { UserAccountResponse } from "@/lib/models/user.model"

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/logs", label: "Registro de Actividad", icon: History },
  { href: "/admin/asociaciones", label: "Asociaciones", icon: Link2 },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const token = useAuthToken()
  const parsed = useMemo(() => parseAuthToken(token), [token])
  const [me, setMe] = useState<UserAccountResponse | null>(null)

  useEffect(() => {
    const id = parsed?.userId
    if (!id) return
    let cancelled = false
    getUserProfile(id)
      .then((data) => {
        if (!cancelled) setMe(data)
      })
      .catch(() => {
        /* guard handles */
      })
    return () => {
      cancelled = true
    }
  }, [parsed?.userId])

  const initials =
    (me?.name ?? "SuperAdmin")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "SA"

  const handleLogout = async () => {
    await logout()
    router.replace("/login")
  }

  return (
    <SuperAdminGuard>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                  <Map className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-foreground">MapWebBusiness</h1>
                <p className="text-xs text-muted-foreground">Panel SuperAdmin</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive =
                pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <link.icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? "text-primary" : ""
                    }`}
                  />
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{me?.name ?? "SuperAdmin"}</p>
                <p className="text-xs text-muted-foreground truncate">{me?.email ?? parsed?.email ?? ""}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 group w-full"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Cerrar sesión</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SuperAdminGuard>
  )
}
