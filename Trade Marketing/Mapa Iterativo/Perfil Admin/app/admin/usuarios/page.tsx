"use client"

import { useState } from "react"
import { 
  Search, 
  Plus, 
  Eye, 
  EyeOff, 
  Pencil, 
  Trash2, 
  Filter,
  ChevronDown,
  X,
  Check,
  Building2,
  Mail,
  Calendar,
  Shield,
  Users
} from "lucide-react"

type User = {
  id: string
  name: string
  email: string
  company: string
  role: "admin" | "user" | "moderator"
  status: "active" | "inactive"
  createdAt: string
  lastLogin: string
}

const mockUsers: User[] = [
  { id: "1", name: "Carlos Mendez", email: "carlos@empresa.com", company: "Tech Solutions", role: "admin", status: "active", createdAt: "2024-01-15", lastLogin: "2024-03-10" },
  { id: "2", name: "Maria Garcia", email: "maria@startup.io", company: "Startup Inc", role: "user", status: "active", createdAt: "2024-02-20", lastLogin: "2024-03-09" },
  { id: "3", name: "Juan Lopez", email: "juan@corp.com", company: "Corp Global", role: "moderator", status: "inactive", createdAt: "2024-01-05", lastLogin: "2024-02-15" },
  { id: "4", name: "Ana Torres", email: "ana@digital.com", company: "Digital Agency", role: "user", status: "active", createdAt: "2024-03-01", lastLogin: "2024-03-10" },
  { id: "5", name: "Pedro Ruiz", email: "pedro@services.com", company: "Services Co", role: "user", status: "active", createdAt: "2024-02-10", lastLogin: "2024-03-08" },
  { id: "6", name: "Laura Martinez", email: "laura@web.com", company: "Web Masters", role: "admin", status: "inactive", createdAt: "2023-12-20", lastLogin: "2024-01-30" },
]

const roleColors = {
  admin: "bg-primary/20 text-primary border-primary/30",
  user: "bg-green-500/20 text-green-400 border-green-500/30",
  moderator: "bg-accent/20 text-accent border-accent/30",
}

const roleLabels = {
  admin: "Administrador",
  user: "Usuario",
  moderator: "Moderador",
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ))
  }

  const deleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId))
    setShowDeleteModal(false)
    setSelectedUser(null)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-muted-foreground mt-1">Administra todos los usuarios del sistema</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold rounded-xl hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Crear Usuario
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o empresa..."
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
            {/* Role Filter */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Rol</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="all">Todos los roles</option>
                <option value="admin">Administrador</option>
                <option value="moderator">Moderador</option>
                <option value="user">Usuario</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>

            {/* Date Range - From */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Desde</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Date Range - To */}
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

      {/* Stats Bar */}
      <div className="flex items-center gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Total:</span>
          <span className="font-semibold text-foreground">{filteredUsers.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-muted-foreground">Activos:</span>
          <span className="font-semibold text-green-400">{filteredUsers.filter(u => u.status === "active").length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive" />
          <span className="text-muted-foreground">Inactivos:</span>
          <span className="font-semibold text-destructive">{filteredUsers.filter(u => u.status === "inactive").length}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Usuario</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Empresa</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Rol</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Estado</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Creado</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        user.status === "active" 
                          ? "bg-gradient-to-br from-primary to-accent text-white" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-foreground">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      {user.company}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${roleColors[user.role]}`}>
                      <Shield className="w-3 h-3" />
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-destructive/20 text-destructive"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        user.status === "active" ? "bg-green-400" : "bg-destructive"
                      }`} />
                      {user.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(user.createdAt).toLocaleDateString("es-ES")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Toggle Status */}
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 rounded-lg transition-all duration-200 group ${
                          user.status === "active"
                            ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                        title={user.status === "active" ? "Deshabilitar" : "Habilitar"}
                      >
                        {user.status === "active" ? (
                          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        ) : (
                          <EyeOff className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        )}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowEditModal(true)
                        }}
                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 group"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowDeleteModal(true)
                        }}
                        className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all duration-200 group"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">No se encontraron usuarios</p>
            <p className="text-muted-foreground mt-1">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
            setShowCreateModal(false)
            setShowEditModal(false)
            setSelectedUser(null)
          }} />
          <div className="relative w-full max-w-lg bg-card border border-white/10 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => {
                setShowCreateModal(false)
                setShowEditModal(false)
                setSelectedUser(null)
              }}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-foreground mb-6">
              {showEditModal ? "Editar Usuario" : "Crear Usuario"}
            </h2>

            <form className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Nombre completo</label>
                <input
                  type="text"
                  defaultValue={selectedUser?.name || ""}
                  placeholder="Nombre del usuario"
                  className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Email</label>
                <input
                  type="email"
                  defaultValue={selectedUser?.email || ""}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Empresa</label>
                <input
                  type="text"
                  defaultValue={selectedUser?.company || ""}
                  placeholder="Nombre de la empresa"
                  className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Rol</label>
                <select
                  defaultValue={selectedUser?.role || "user"}
                  className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="user">Usuario</option>
                  <option value="moderator">Moderador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {!showEditModal && (
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Contraseña</label>
                  <input
                    type="password"
                    placeholder="Contraseña temporal"
                    className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                    setSelectedUser(null)
                  }}
                  className="flex-1 px-4 py-3 bg-muted/50 border border-white/10 rounded-xl text-foreground font-medium hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold rounded-xl hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  {showEditModal ? "Guardar Cambios" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
            setShowDeleteModal(false)
            setSelectedUser(null)
          }} />
          <div className="relative w-full max-w-md bg-card border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground text-center mb-2">Eliminar Usuario</h2>
            <p className="text-muted-foreground text-center mb-6">
              ¿Estás seguro de que deseas eliminar a <span className="font-semibold text-foreground">{selectedUser.name}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedUser(null)
                }}
                className="flex-1 px-4 py-3 bg-muted/50 border border-white/10 rounded-xl text-foreground font-medium hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteUser(selectedUser.id)}
                className="flex-1 px-4 py-3 bg-destructive text-destructive-foreground font-semibold rounded-xl hover:bg-destructive/90 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
