"use client"

import { Users, UserCheck, UserX, Link2, TrendingUp, Activity } from "lucide-react"

const stats = [
  { label: "Total Usuarios", value: "1,234", icon: Users, color: "primary", change: "+12%" },
  { label: "Usuarios Activos", value: "1,180", icon: UserCheck, color: "green", change: "+8%" },
  { label: "Usuarios Inactivos", value: "54", icon: UserX, color: "destructive", change: "-3%" },
  { label: "Asociaciones", value: "89", icon: Link2, color: "accent", change: "+5%" },
]

const recentActivity = [
  { action: "Usuario creado", user: "Carlos Mendez", time: "Hace 5 min", type: "create" },
  { action: "Sesión cerrada", user: "Maria Garcia", time: "Hace 12 min", type: "logout" },
  { action: "Usuario deshabilitado", user: "Juan Lopez", time: "Hace 1 hora", type: "disable" },
  { action: "Asociación eliminada", user: "Ana Torres", time: "Hace 2 horas", type: "unlink" },
  { action: "Usuario editado", user: "Pedro Ruiz", time: "Hace 3 horas", type: "edit" },
]

export default function AdminDashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Bienvenido al panel de administración</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative group bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${
              stat.color === "primary" ? "from-primary/10" :
              stat.color === "green" ? "from-green-500/10" :
              stat.color === "destructive" ? "from-destructive/10" :
              "from-accent/10"
            } to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className={`w-4 h-4 ${
                    stat.change.startsWith("+") ? "text-green-500" : "text-destructive"
                  }`} />
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith("+") ? "text-green-500" : "text-destructive"
                  }`}>{stat.change}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === "primary" ? "bg-primary/20 text-primary" :
                stat.color === "green" ? "bg-green-500/20 text-green-500" :
                stat.color === "destructive" ? "bg-destructive/20 text-destructive" :
                "bg-accent/20 text-accent"
              }`}>
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
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === "create" ? "bg-green-500" :
                  activity.type === "logout" ? "bg-blue-500" :
                  activity.type === "disable" ? "bg-destructive" :
                  activity.type === "unlink" ? "bg-orange-500" :
                  "bg-primary"
                }`} />
                <div>
                  <p className="text-foreground font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.user}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
