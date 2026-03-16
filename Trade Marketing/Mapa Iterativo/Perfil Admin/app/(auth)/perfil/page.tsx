"use client"

import { useState } from "react"
import Link from "next/link"
import {
  MapPin,
  User,
  Mail,
  Building2,
  LogOut,
  ChevronLeft,
  Shield,
  Calendar,
  Edit3,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const user = {
  fullName: "Carlos Mendoza",
  email: "carlos.mendoza@empresa.com",
  company: "Distribuidora Andina S.A.",
  role: "Administrador",
  memberSince: "Enero 2024",
  avatar: "CM",
}

export default function PerfilPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsLoggingOut(false)
  }

  return (
    <div className="w-full max-w-md">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver al inicio
      </Link>

      {/* Card wrapper with glow */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/10 to-accent/20 rounded-3xl blur-xl" />

        <div className="relative bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">

          {/* Top banner */}
          <div className="h-24 bg-gradient-to-r from-primary/40 via-primary/20 to-accent/20 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
          </div>

          {/* Avatar + edit */}
          <div className="px-8 pb-0">
            <div className="flex items-end justify-between -mt-12 mb-5">
              {/* Avatar */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-primary to-accent/60 rounded-full blur-md opacity-70" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center border-4 border-card text-primary-foreground font-bold text-2xl tracking-wide">
                  {user.avatar}
                </div>
              </div>

              {/* Edit button */}
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-muted-foreground hover:text-foreground hover:bg-white/10 hover:border-primary/40 transition-all duration-200">
                <Edit3 className="w-4 h-4" />
                Editar
              </button>
            </div>

            {/* Name & role */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-foreground">{user.fullName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-primary font-medium">{user.role}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/8 mb-6" />

            {/* Info fields */}
            <div className="space-y-4 mb-6">
              {/* Full name */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/4 border border-white/8 group hover:border-primary/30 hover:bg-white/6 transition-all duration-200">
                <div className="mt-0.5 p-2 rounded-lg bg-primary/15">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Nombre completo</p>
                  <p className="text-sm font-medium text-foreground truncate">{user.fullName}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/4 border border-white/8 group hover:border-primary/30 hover:bg-white/6 transition-all duration-200">
                <div className="mt-0.5 p-2 rounded-lg bg-primary/15">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Correo electrónico</p>
                  <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                </div>
              </div>

              {/* Company */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/4 border border-white/8 group hover:border-primary/30 hover:bg-white/6 transition-all duration-200">
                <div className="mt-0.5 p-2 rounded-lg bg-accent/15">
                  <Building2 className="w-4 h-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Empresa</p>
                  <p className="text-sm font-medium text-foreground truncate">{user.company}</p>
                </div>
              </div>

              {/* Member since */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/4 border border-white/8 group hover:border-primary/30 hover:bg-white/6 transition-all duration-200">
                <div className="mt-0.5 p-2 rounded-lg bg-primary/15">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Miembro desde</p>
                  <p className="text-sm font-medium text-foreground">{user.memberSince}</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/8 mb-6" />

            {/* Logout button */}
            <div className="pb-8">
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full h-12 relative overflow-hidden group bg-transparent border border-destructive/40 hover:border-destructive text-destructive hover:text-destructive-foreground rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-destructive/20 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {/* Hover fill effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-destructive/80 to-destructive opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                <span className="relative flex items-center justify-center gap-2">
                  {isLoggingOut ? (
                    <>
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Cerrando sesión...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                      Cerrar sesión
                    </>
                  )}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
