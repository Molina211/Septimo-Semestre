"use client"

import { useState } from "react"
import { 
  Settings, 
  Bell, 
  Shield, 
  Mail, 
  Clock,
  Save,
  RotateCcw
} from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    invitationExpiry: "7",
    emailNotifications: true,
    loginAlerts: true,
    activityReports: false,
  })

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-1">Ajustes generales del sistema</p>
      </div>

      <div className="space-y-6">
        {/* Security Settings */}
        <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Seguridad</h2>
              <p className="text-sm text-muted-foreground">Configuraciones de seguridad del sistema</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="font-medium text-foreground">Tiempo de sesión (minutos)</label>
                <p className="text-sm text-muted-foreground">Tiempo antes de cerrar sesión por inactividad</p>
              </div>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                className="w-full sm:w-32 px-4 py-2.5 bg-input/50 border border-white/10 rounded-xl text-foreground text-center focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="border-t border-white/5" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="font-medium text-foreground">Intentos máximos de login</label>
                <p className="text-sm text-muted-foreground">Antes de bloquear la cuenta temporalmente</p>
              </div>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({ ...settings, maxLoginAttempts: e.target.value })}
                className="w-full sm:w-32 px-4 py-2.5 bg-input/50 border border-white/10 rounded-xl text-foreground text-center focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Invitations Settings */}
        <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Invitaciones</h2>
              <p className="text-sm text-muted-foreground">Configuración de invitaciones de asociación</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="font-medium text-foreground">Expiración de invitaciones (días)</label>
              <p className="text-sm text-muted-foreground">Tiempo antes de que expire una invitación</p>
            </div>
            <input
              type="number"
              value={settings.invitationExpiry}
              onChange={(e) => setSettings({ ...settings, invitationExpiry: e.target.value })}
              className="w-full sm:w-32 px-4 py-2.5 bg-input/50 border border-white/10 rounded-xl text-foreground text-center focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Notificaciones</h2>
              <p className="text-sm text-muted-foreground">Preferencias de notificaciones por email</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <label className="font-medium text-foreground">Notificaciones por email</label>
                <p className="text-sm text-muted-foreground">Recibir notificaciones generales</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                  settings.emailNotifications ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  settings.emailNotifications ? "left-6" : "left-1"
                }`} />
              </button>
            </div>

            <div className="border-t border-white/5" />

            <div className="flex items-center justify-between gap-4">
              <div>
                <label className="font-medium text-foreground">Alertas de inicio de sesión</label>
                <p className="text-sm text-muted-foreground">Notificar nuevos inicios de sesión</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, loginAlerts: !settings.loginAlerts })}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                  settings.loginAlerts ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  settings.loginAlerts ? "left-6" : "left-1"
                }`} />
              </button>
            </div>

            <div className="border-t border-white/5" />

            <div className="flex items-center justify-between gap-4">
              <div>
                <label className="font-medium text-foreground">Reportes de actividad</label>
                <p className="text-sm text-muted-foreground">Recibir reportes semanales de actividad</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, activityReports: !settings.activityReports })}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                  settings.activityReports ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  settings.activityReports ? "left-6" : "left-1"
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-muted/50 border border-white/10 rounded-xl text-foreground font-medium hover:bg-muted transition-colors">
            <RotateCcw className="w-5 h-5" />
            Restablecer
          </button>
          <button className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold rounded-xl hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transition-all duration-200">
            <Save className="w-5 h-5" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  )
}
