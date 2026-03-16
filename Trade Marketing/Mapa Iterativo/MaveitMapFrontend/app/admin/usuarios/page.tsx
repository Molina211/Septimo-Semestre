"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Filter,
  Mail,
  Pencil,
  Plus,
  Search,
  Shield,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react"
import { extractApiMessage } from "@/lib/utils/api-errors"
import type { UserAccountResponse, UserRoleType } from "@/lib/models/user-account.model"
import { createAdminUser, deleteUser, listAllUsers, updateUser, updateUserStatus } from "@/lib/services/admin.service"
import { getPasswordValidation } from "@/lib/utils/password-rules"
import { useAuthToken } from "@/lib/hooks/use-auth-token"
import { parseAuthToken } from "@/lib/utils/jwt.utils"

const roleColors: Record<UserRoleType, string> = {
  SUPER_ADMIN: "bg-primary/20 text-primary border-primary/30",
  ADMIN: "bg-green-500/20 text-green-400 border-green-500/30",
  VIEWER: "bg-accent/20 text-accent border-accent/30",
}

const roleLabels: Record<UserRoleType, string> = {
  SUPER_ADMIN: "SuperAdmin",
  ADMIN: "Administrador",
  VIEWER: "Viewer",
}

function formatDate(value: string) {
  try {
    const date = new Date(value)
    return date.toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "2-digit" })
  } catch {
    return value
  }
}

export default function UsersPage() {
  const token = useAuthToken()
  const authPayload = useMemo(() => parseAuthToken(token), [token])
  const [users, setUsers] = useState<UserAccountResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<UserRoleType | "all">("all")
  const [accountStatusFilter, setAccountStatusFilter] = useState<"all" | "enabled" | "disabled">("all")
  const [sessionStatusFilter, setSessionStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [showFilters, setShowFilters] = useState(false)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserAccountResponse | null>(null)

  const [createForm, setCreateForm] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
    role: "ADMIN" as const,
  })
  const [editForm, setEditForm] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
    role: "ADMIN" as UserRoleType,
  })

  const passwordValidation = useMemo(() => getPasswordValidation(createForm.password), [createForm.password])
  const editPasswordValidation = useMemo(() => getPasswordValidation(editForm.password), [editForm.password])

  const reload = async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await listAllUsers()
      setUsers(list)
    } catch (e) {
      setError(extractApiMessage(e, "No se pudieron cargar los usuarios"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (authPayload?.userId && u.id === authPayload.userId) {
        return false
      }
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.companyName.toLowerCase().includes(q)
      const matchesRole = roleFilter === "all" || u.role === roleFilter
      const matchesAccountStatus =
        accountStatusFilter === "all" ||
        (accountStatusFilter === "enabled" ? u.enabled : !u.enabled)
      const matchesSessionStatus =
        sessionStatusFilter === "all" ||
        (sessionStatusFilter === "active" ? u.sessionActive : !u.sessionActive)
      return matchesSearch && matchesRole && matchesAccountStatus && matchesSessionStatus
    })
  }, [users, searchQuery, roleFilter, accountStatusFilter, sessionStatusFilter, authPayload?.userId])

  const toggleUser = async (u: UserAccountResponse) => {
    try {
      const updated = await updateUserStatus(u.id, !u.enabled)
      setUsers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
    } catch (e) {
      setError(extractApiMessage(e, "No se pudo actualizar el estado"))
    }
  }

  const openEdit = (u: UserAccountResponse) => {
    setSelectedUser(u)
    setEditForm({
      name: u.name,
      companyName: u.companyName,
      email: u.email,
      password: "",
      role: u.role,
    })
    setShowEditModal(true)
  }

  const submitEdit = async () => {
    if (!selectedUser) return
    if (editForm.password && !editPasswordValidation.isValid) return
    try {
      const updated = await updateUser(selectedUser.id, {
        name: editForm.name.trim(),
        companyName: editForm.companyName.trim(),
        email: editForm.email.trim(),
        password: editForm.password ? editForm.password : undefined,
        role: editForm.role,
      })
      setUsers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
      setShowEditModal(false)
      setSelectedUser(null)
    } catch (e) {
      setError(extractApiMessage(e, "No se pudo editar el usuario"))
    }
  }

  const submitCreate = async () => {
    if (!passwordValidation.isValid) return
    try {
      const created = await createAdminUser({
        name: createForm.name.trim(),
        companyName: createForm.companyName.trim(),
        email: createForm.email.trim(),
        password: createForm.password,
        role: createForm.role,
      })
      setUsers((prev) => [created, ...prev])
      setShowCreateModal(false)
      setCreateForm({ name: "", companyName: "", email: "", password: "", role: "ADMIN" })
    } catch (e) {
      setError(extractApiMessage(e, "No se pudo crear el usuario"))
    }
  }

  const confirmDelete = async () => {
    if (!selectedUser) return
    try {
      await deleteUser(selectedUser.id)
      setUsers((prev) => prev.filter((x) => x.id !== selectedUser.id))
      setShowDeleteModal(false)
      setSelectedUser(null)
    } catch (e) {
      setError(extractApiMessage(e, "No se pudo eliminar el usuario"))
    }
  }

  return (
    <div className="p-8">
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

      {error && (
        <div className="mb-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
          {error}
        </div>
      )}

      <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
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

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Rol</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="all">Todos los roles</option>
                <option value="SUPER_ADMIN">SuperAdmin</option>
                <option value="ADMIN">Administrador</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Estado de cuenta</label>
              <select
                value={accountStatusFilter}
                onChange={(e) => setAccountStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="all">Todos</option>
                <option value="enabled">Habilitada</option>
                <option value="disabled">Deshabilitada</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Estado de sesión</label>
              <select
                value={sessionStatusFilter}
                onChange={(e) => setSessionStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="all">Todas</option>
                <option value="active">Activa</option>
                <option value="inactive">Inactiva</option>
              </select>
            </div>

            <div className="hidden lg:block" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Total:</span>
          <span className="font-semibold text-foreground">{filteredUsers.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-muted-foreground">Sesión activa:</span>
          <span className="font-semibold text-green-400">{filteredUsers.filter((u) => u.sessionActive).length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-muted-foreground">Sesión inactiva:</span>
          <span className="font-semibold text-orange-400">{filteredUsers.filter((u) => !u.sessionActive).length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">Cuenta habilitada:</span>
          <span className="font-semibold text-blue-400">{filteredUsers.filter((u) => u.enabled).length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive" />
          <span className="text-muted-foreground">Cuenta deshabilitada:</span>
          <span className="font-semibold text-destructive">{filteredUsers.filter((u) => !u.enabled).length}</span>
        </div>
        <button
          onClick={reload}
          className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-input/50 border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-all"
        >
          <Check className="w-4 h-4" />
          Refrescar
        </button>
      </div>

      <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full min-w-[980px]">
            <thead className="bg-muted/30 border-b border-white/10">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Sesión</th>
                <th className="px-6 py-4">Cuenta</th>
                <th className="px-6 py-4">Creación</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-white/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium">{u.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-foreground flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      {u.companyName}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${roleColors[u.role]}`}>
                      <Shield className="w-3.5 h-3.5" />
                      {roleLabels[u.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${
                      u.sessionActive
                        ? "bg-green-500/15 text-green-400 border-green-500/25"
                        : "bg-orange-500/15 text-orange-400 border-orange-500/25"
                    }`}>
                      {u.sessionActive ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${
                      u.enabled
                        ? "bg-blue-500/15 text-blue-400 border-blue-500/25"
                        : "bg-destructive/15 text-destructive border-destructive/25"
                    }`}>
                      {u.enabled ? "Habilitada" : "Deshabilitada"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {formatDate(u.createdAt)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleUser(u)}
                        className={`p-2.5 rounded-xl border transition-all duration-200 ${
                          u.enabled
                            ? "bg-input/50 border-white/10 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10"
                            : "bg-input/50 border-white/10 text-muted-foreground hover:text-green-400 hover:border-green-500/30 hover:bg-green-500/10"
                        }`}
                        title={u.enabled ? "Deshabilitar" : "Habilitar"}
                      >
                        {u.enabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEdit(u)}
                        className="p-2.5 rounded-xl bg-input/50 border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all duration-200"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(u)
                          setShowDeleteModal(true)
                        }}
                        className="p-2.5 rounded-xl bg-input/50 border border-white/10 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-all duration-200"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    {loading ? "Cargando..." : "No hay usuarios para mostrar."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-card/95 p-6 shadow-2xl backdrop-blur-lg border border-white/10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-foreground">Crear Usuario</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <input
                className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Nombre completo"
                value={createForm.name}
                onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
              />
              <input
                className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Empresa"
                value={createForm.companyName}
                onChange={(e) => setCreateForm((p) => ({ ...p, companyName: e.target.value }))}
              />
              <input
                className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Correo"
                value={createForm.email}
                onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
              />
              <div>
                <input
                  type="password"
                  className={`w-full px-4 py-3 bg-input/50 border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all ${
                    createForm.password.length > 0 && !passwordValidation.isValid
                      ? "border-destructive/50 focus:ring-destructive/20"
                      : "border-white/10 focus:border-primary/50 focus:ring-primary/20"
                  }`}
                  placeholder="Contraseña"
                  value={createForm.password}
                  onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))}
                />
                {createForm.password.length > 0 && !passwordValidation.isValid && (
                  <p className="mt-2 text-xs text-destructive">
                    Debe incluir mayúscula, minúscula, número, carácter especial y mínimo 8 caracteres.
                  </p>
                )}
              </div>
              <select
                value={createForm.role}
                onChange={(e) => setCreateForm((p) => ({ ...p, role: e.target.value as any }))}
                className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="ADMIN">Administrador</option>
                <option value="SUPER_ADMIN">SuperAdmin</option>
              </select>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-input/50 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={submitCreate}
                disabled={!passwordValidation.isValid || !createForm.email || !createForm.name || !createForm.companyName}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-card/95 p-6 shadow-2xl backdrop-blur-lg border border-white/10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-foreground">Editar Usuario</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <input
                className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Nombre completo"
                value={editForm.name}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
              />
              <input
                className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Empresa"
                value={editForm.companyName}
                onChange={(e) => setEditForm((p) => ({ ...p, companyName: e.target.value }))}
              />
              <input
                className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Correo"
                value={editForm.email}
                onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
              />
              <div>
                <input
                  type="password"
                  className={`w-full px-4 py-3 bg-input/50 border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all ${
                    editForm.password.length > 0 && !editPasswordValidation.isValid
                      ? "border-destructive/50 focus:ring-destructive/20"
                      : "border-white/10 focus:border-primary/50 focus:ring-primary/20"
                  }`}
                  placeholder="Nueva contraseña (opcional)"
                  value={editForm.password}
                  onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))}
                />
                {editForm.password.length > 0 && !editPasswordValidation.isValid && (
                  <p className="mt-2 text-xs text-destructive">
                    Debe incluir mayúscula, minúscula, número, carácter especial y mínimo 8 caracteres.
                  </p>
                )}
              </div>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value as any }))}
                className="w-full px-4 py-3 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="ADMIN">Administrador</option>
                <option value="SUPER_ADMIN">SuperAdmin</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-input/50 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={submitEdit}
                disabled={
                  !editForm.email ||
                  !editForm.name ||
                  !editForm.companyName ||
                  (editForm.password.length > 0 && !editPasswordValidation.isValid)
                }
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-card/95 p-6 shadow-2xl backdrop-blur-lg border border-white/10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-foreground">Eliminar Usuario</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              ¿Seguro que deseas eliminar a <span className="font-semibold text-foreground">{selectedUser.email}</span>?
              Esta acción es irreversible.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-input/50 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground font-semibold hover:from-destructive/90 hover:to-destructive/70 hover:shadow-lg hover:shadow-destructive/25 transition-all"
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
