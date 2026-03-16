import { apiFetch } from "./api.client"
import type {
  AdminConfigResponse,
  AdminConfigUpdateRequest,
  AdminInvitationResponse,
  AdminLogResponse,
  AdminStatsResponse,
  AdminUserCreateRequest,
} from "@/lib/models/admin.model"
import type { UserAccountResponse as BackendUserAccountResponse } from "@/lib/models/user-account.model"

export async function listAllUsers(): Promise<BackendUserAccountResponse[]> {
  return apiFetch<BackendUserAccountResponse[]>("/api/auth/users")
}

export async function updateUserStatus(userId: number, enabled: boolean): Promise<BackendUserAccountResponse> {
  return apiFetch<BackendUserAccountResponse>(`/api/auth/users/${userId}/status`, {
    method: "PUT",
    body: { enabled },
  })
}

export async function updateUser(
  userId: number,
  payload: { name: string; companyName: string; email: string; password?: string; role?: "ADMIN" | "SUPER_ADMIN" | "VIEWER" }
): Promise<BackendUserAccountResponse> {
  return apiFetch<BackendUserAccountResponse>(`/api/auth/users/${userId}`, {
    method: "PUT",
    body: payload,
  })
}

export async function deleteUser(userId: number): Promise<void> {
  await apiFetch<void>(`/api/auth/users/${userId}`, { method: "DELETE" })
}

export async function getAdminStats(): Promise<AdminStatsResponse> {
  return apiFetch<AdminStatsResponse>("/api/admin/stats")
}

export async function getAdminLogs(params?: {
  action?: string
  userId?: number
  from?: string
  to?: string
  limit?: number
}): Promise<AdminLogResponse[]> {
  const qs = new URLSearchParams()
  if (params?.action) qs.set("action", params.action)
  if (params?.userId != null) qs.set("userId", String(params.userId))
  if (params?.from) qs.set("from", params.from)
  if (params?.to) qs.set("to", params.to)
  if (params?.limit != null) qs.set("limit", String(params.limit))
  const suffix = qs.toString() ? `?${qs}` : ""
  return apiFetch<AdminLogResponse[]>(`/api/admin/logs${suffix}`)
}

export async function getAdminConfig(): Promise<AdminConfigResponse> {
  return apiFetch<AdminConfigResponse>("/api/admin/config")
}

export async function updateAdminConfig(payload: AdminConfigUpdateRequest): Promise<AdminConfigResponse> {
  return apiFetch<AdminConfigResponse>("/api/admin/config", {
    method: "PUT",
    body: payload,
  })
}

export async function listAllInvitations(): Promise<AdminInvitationResponse[]> {
  return apiFetch<AdminInvitationResponse[]>("/api/admin/invitations")
}

export async function deleteInvitation(token: string): Promise<void> {
  await apiFetch<void>(`/api/admin/invitations/${encodeURIComponent(token)}`, { method: "DELETE" })
}

export async function purgeExpiredInvitations(): Promise<void> {
  await apiFetch<void>("/api/admin/invitations/expired", { method: "DELETE" })
}

export async function createAdminUser(payload: AdminUserCreateRequest): Promise<BackendUserAccountResponse> {
  return apiFetch<BackendUserAccountResponse>("/api/admin/users", {
    method: "POST",
    body: payload,
  })
}
