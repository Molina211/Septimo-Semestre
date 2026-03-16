"use client"

import { useState } from "react"
import { 
  Search, 
  Plus, 
  Link2, 
  Link2Off, 
  Trash2, 
  Filter,
  ChevronDown,
  X,
  Mail,
  Clock,
  User,
  Building2,
  Check,
  AlertCircle
} from "lucide-react"

type Association = {
  id: string
  user1: { name: string; email: string; company: string }
  user2: { name: string; email: string; company: string }
  status: "active" | "pending"
  createdAt: string
}

type Invitation = {
  id: string
  from: { name: string; email: string }
  to: { name: string; email: string }
  status: "pending" | "expired"
  sentAt: string
  expiresAt: string
}

const mockAssociations: Association[] = [
  { 
    id: "1", 
    user1: { name: "Carlos Mendez", email: "carlos@empresa.com", company: "Tech Solutions" },
    user2: { name: "Maria Garcia", email: "maria@startup.io", company: "Startup Inc" },
    status: "active",
    createdAt: "2024-02-15"
  },
  { 
    id: "2", 
    user1: { name: "Ana Torres", email: "ana@digital.com", company: "Digital Agency" },
    user2: { name: "Pedro Ruiz", email: "pedro@services.com", company: "Services Co" },
    status: "active",
    createdAt: "2024-03-01"
  },
  { 
    id: "3", 
    user1: { name: "Laura Martinez", email: "laura@web.com", company: "Web Masters" },
    user2: { name: "Juan Lopez", email: "juan@corp.com", company: "Corp Global" },
    status: "pending",
    createdAt: "2024-03-08"
  },
]

const mockInvitations: Invitation[] = [
  { 
    id: "1", 
    from: { name: "Carlos Mendez", email: "carlos@empresa.com" },
    to: { name: "nuevo@usuario.com", email: "nuevo@usuario.com" },
    status: "pending",
    sentAt: "2024-03-09",
    expiresAt: "2024-03-16"
  },
  { 
    id: "2", 
    from: { name: "Ana Torres", email: "ana@digital.com" },
    to: { name: "invitado@test.com", email: "invitado@test.com" },
    status: "expired",
    sentAt: "2024-02-20",
    expiresAt: "2024-02-27"
  },
]

export default function AssociationsPage() {
  const [associations, setAssociations] = useState(mockAssociations)
  const [invitations, setInvitations] = useState(mockInvitations)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"associations" | "invitations">("associations")
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{ type: "association" | "invitation"; id: string } | null>(null)

  const filteredAssociations = associations.filter(assoc => {
    const matchesSearch = 
      assoc.user1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assoc.user2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assoc.user1.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assoc.user2.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || assoc.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredInvitations = invitations.filter(inv => {
    const matchesSearch = 
      inv.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.to.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const deleteItem = () => {
    if (!selectedItem) return
    
    if (selectedItem.type === "association") {
      setAssociations(associations.filter(a => a.id !== selectedItem.id))
    } else {
      setInvitations(invitations.filter(i => i.id !== selectedItem.id))
    }
    
    setShowDeleteModal(false)
    setSelectedItem(null)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Asociaciones</h1>
          <p className="text-muted-foreground mt-1">Gestiona las asociaciones entre usuarios</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold rounded-xl hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Nueva Asociación
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("associations")}
          className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            activeTab === "associations"
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card border border-white/10"
          }`}
        >
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Asociaciones ({associations.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab("invitations")}
          className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            activeTab === "invitations"
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card border border-white/10"
          }`}
        >
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Invitaciones ({invitations.length})
          </div>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-input/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activas</option>
                <option value="pending">Pendientes</option>
                {activeTab === "invitations" && <option value="expired">Expiradas</option>}
              </select>
            </div>

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

      {/* Content */}
      {activeTab === "associations" ? (
        <div className="space-y-4">
          {filteredAssociations.map((assoc) => (
            <div
              key={assoc.id}
              className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-primary/20 transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* User 1 */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                    {assoc.user1.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{assoc.user1.name}</p>
                    <p className="text-sm text-muted-foreground">{assoc.user1.email}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Building2 className="w-3 h-3" />
                      {assoc.user1.company}
                    </div>
                  </div>
                </div>

                {/* Link Icon */}
                <div className="flex items-center justify-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    assoc.status === "active" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-accent/20 text-accent"
                  }`}>
                    <Link2 className="w-5 h-5" />
                  </div>
                </div>

                {/* User 2 */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold">
                    {assoc.user2.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{assoc.user2.name}</p>
                    <p className="text-sm text-muted-foreground">{assoc.user2.email}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Building2 className="w-3 h-3" />
                      {assoc.user2.company}
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    assoc.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-accent/20 text-accent"
                  }`}>
                    {assoc.status === "active" ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {assoc.status === "active" ? "Activa" : "Pendiente"}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedItem({ type: "association", id: assoc.id })
                      setShowDeleteModal(true)
                    }}
                    className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all duration-200 group"
                    title="Desasociar"
                  >
                    <Link2Off className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Creada el {new Date(assoc.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}
              </div>
            </div>
          ))}

          {filteredAssociations.length === 0 && (
            <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-12 text-center">
              <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">No se encontraron asociaciones</p>
              <p className="text-muted-foreground mt-1">Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvitations.map((inv) => (
            <div
              key={inv.id}
              className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-primary/20 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* From */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <User className="w-3 h-3" />
                    Enviado por
                  </div>
                  <p className="font-medium text-foreground">{inv.from.name}</p>
                  <p className="text-sm text-muted-foreground">{inv.from.email}</p>
                </div>

                {/* Arrow */}
                <div className="hidden sm:flex items-center">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent" />
                  <Mail className="w-5 h-5 text-primary mx-2" />
                  <div className="w-8 h-0.5 bg-gradient-to-r from-accent to-primary" />
                </div>

                {/* To */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Mail className="w-3 h-3" />
                    Enviado a
                  </div>
                  <p className="font-medium text-foreground">{inv.to.email}</p>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    inv.status === "pending"
                      ? "bg-accent/20 text-accent"
                      : "bg-destructive/20 text-destructive"
                  }`}>
                    {inv.status === "pending" ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {inv.status === "pending" ? "Pendiente" : "Expirada"}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedItem({ type: "invitation", id: inv.id })
                      setShowDeleteModal(true)
                    }}
                    className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all duration-200 group"
                    title="Eliminar invitación"
                  >
                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Enviada: {new Date(inv.sentAt).toLocaleDateString("es-ES")}
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Expira: {new Date(inv.expiresAt).toLocaleDateString("es-ES")}
                </div>
              </div>
            </div>
          ))}

          {filteredInvitations.length === 0 && (
            <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-12 text-center">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">No se encontraron invitaciones</p>
              <p className="text-muted-foreground mt-1">Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
            setShowDeleteModal(false)
            setSelectedItem(null)
          }} />
          <div className="relative w-full max-w-md bg-card border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
              {selectedItem.type === "association" ? (
                <Link2Off className="w-8 h-8 text-destructive" />
              ) : (
                <Trash2 className="w-8 h-8 text-destructive" />
              )}
            </div>
            <h2 className="text-xl font-bold text-foreground text-center mb-2">
              {selectedItem.type === "association" ? "Eliminar Asociación" : "Eliminar Invitación"}
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              {selectedItem.type === "association" 
                ? "¿Estás seguro de que deseas eliminar esta asociación? Los usuarios ya no estarán vinculados."
                : "¿Estás seguro de que deseas eliminar esta invitación? Esta acción no se puede deshacer."
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedItem(null)
                }}
                className="flex-1 px-4 py-3 bg-muted/50 border border-white/10 rounded-xl text-foreground font-medium hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={deleteItem}
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
