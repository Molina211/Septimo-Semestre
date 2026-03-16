"use client"

import { useState } from "react"
import { 
  Search, 
  Filter, 
  ChevronDown, 
  LogOut, 
  LogIn, 
  UserPlus, 
  UserMinus, 
  Pencil, 
  Link2, 
  Trash2,
  Calendar,
  Clock,
  User
} from "lucide-react"

type LogEntry = {
  id: string
  action: "login" | "logout" | "create" | "delete" | "edit" | "disable" | "enable" | "link" | "unlink"
  description: string
  user: string
  target?: string
  ip: string
  timestamp: string
}

const mockLogs: LogEntry[] = [
  { id: "1", action: "logout", description: "Cerró sesión", user: "Maria Garcia", ip: "192.168.1.45", timestamp: "2024-03-10T14:32:00" },
  { id: "2", action: "login", description: "Inició sesión", user: "Carlos Mendez", ip: "192.168.1.23", timestamp: "2024-03-10T14:28:00" },
  { id: "3", action: "disable", description: "Deshabilitó usuario", user: "Admin", target: "Juan Lopez", ip: "192.168.1.1", timestamp: "2024-03-10T13:45:00" },
  { id: "4", action: "unlink", description: "Eliminó asociación", user: "Admin", target: "Ana Torres - Pedro Ruiz", ip: "192.168.1.1", timestamp: "2024-03-10T12:30:00" },
  { id: "5", action: "create", description: "Creó usuario", user: "Admin", target: "Laura Martinez", ip: "192.168.1.1", timestamp: "2024-03-10T11:15:00" },
  { id: "6", action: "edit", description: "Editó usuario", user: "Admin", target: "Pedro Ruiz", ip: "192.168.1.1", timestamp: "2024-03-10T10:00:00" },
  { id: "7", action: "logout", description: "Cerró sesión", user: "Juan Lopez", ip: "192.168.1.67", timestamp: "2024-03-09T18:45:00" },
  { id: "8", action: "link", description: "Creó asociación", user: "Admin", target: "Carlos Mendez - Maria Garcia", ip: "192.168.1.1", timestamp: "2024-03-09T16:20:00" },
  { id: "9", action: "delete", description: "Eliminó usuario", user: "Admin", target: "Usuario eliminado", ip: "192.168.1.1", timestamp: "2024-03-09T15:00:00" },
  { id: "10", action: "enable", description: "Habilitó usuario", user: "Admin", target: "Ana Torres", ip: "192.168.1.1", timestamp: "2024-03-09T14:30:00" },
]

const actionConfig = {
  login: { icon: LogIn, color: "text-green-400", bg: "bg-green-500/20", label: "Inicio sesión" },
  logout: { icon: LogOut, color: "text-blue-400", bg: "bg-blue-500/20", label: "Cierre sesión" },
  create: { icon: UserPlus, color: "text-primary", bg: "bg-primary/20", label: "Creación" },
  delete: { icon: Trash2, color: "text-destructive", bg: "bg-destructive/20", label: "Eliminación" },
  edit: { icon: Pencil, color: "text-accent", bg: "bg-accent/20", label: "Edición" },
  disable: { icon: UserMinus, color: "text-orange-400", bg: "bg-orange-500/20", label: "Deshabilitación" },
  enable: { icon: UserPlus, color: "text-green-400", bg: "bg-green-500/20", label: "Habilitación" },
  link: { icon: Link2, color: "text-purple-400", bg: "bg-purple-500/20", label: "Asociación" },
  unlink: { icon: Link2, color: "text-orange-400", bg: "bg-orange-500/20", label: "Desasociación" },
}

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.target?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    return matchesSearch && matchesAction
  })

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Registro de Actividad</h1>
        <p className="text-muted-foreground mt-1">Historial de todas las acciones del sistema</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por usuario o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
              showFilters 
                ? "bg-primary/20 border-primary/30 text-primary" 
                : "bg-input/50 border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20"
            }`}
          >
            <Filter className="w-5 h-5" />
            Filtros
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
            {/* Action Filter */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Tipo de acción</label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="all">Todas las acciones</option>
                <option value="login">Inicios de sesión</option>
                <option value="logout">Cierres de sesión</option>
                <option value="create">Creaciones</option>
                <option value="edit">Ediciones</option>
                <option value="delete">Eliminaciones</option>
                <option value="enable">Habilitaciones</option>
                <option value="disable">Deshabilitaciones</option>
                <option value="link">Asociaciones</option>
                <option value="unlink">Desasociaciones</option>
              </select>
            </div>

            {/* User Filter */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Usuario</label>
              <select
                className="w-full px-4 py-2.5 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="all">Todos los usuarios</option>
                <option value="admin">Admin</option>
                <option value="carlos">Carlos Mendez</option>
                <option value="maria">Maria Garcia</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Desde</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Hasta</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Logs List */}
      <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="divide-y divide-white/5">
          {filteredLogs.map((log) => {
            const config = actionConfig[log.action]
            const Icon = config.icon
            
            return (
              <div key={log.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-foreground font-medium">{log.description}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{log.user}</span>
                      </div>
                      {log.target && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-white/30">-</span>
                          <span className="text-foreground/70">{log.target}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-sm text-foreground">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      {formatDate(log.timestamp)}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(log.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredLogs.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">No se encontraron registros</p>
            <p className="text-muted-foreground mt-1">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}
