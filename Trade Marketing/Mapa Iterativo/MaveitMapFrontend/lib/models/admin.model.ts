export interface AdminStatsResponse {
  totalUsers: number
  sessionActiveUsers: number
  sessionInactiveUsers: number
  enabledUsers: number
  disabledUsers: number
  associations: number
  activeInvitations: number
}

export interface AdminLogResponse {
  id: number
  createdAt: string
  action: string
  actorUserId: number | null
  actorEmail: string | null
  targetUserId: number | null
  targetEmail: string | null
  metadata: string | null
}

export interface AdminConfigResponse {
  accessTokenExpirationMillis: number
  refreshTokenExpirationMillis: number
  defaultInvitationExpiryMinutes: number
  verificationExpiryMinutes: number
  maxVerificationAttempts: number
  updatedAt: string
}

export interface AdminConfigUpdateRequest {
  accessTokenExpirationMillis?: number
  refreshTokenExpirationMillis?: number
  defaultInvitationExpiryMinutes?: number
  verificationExpiryMinutes?: number
  maxVerificationAttempts?: number
}

export interface AdminInvitationResponse {
  token: string
  inviterEmail: string | null
  inviteeEmail: string
  expiresAt: string
  revoked: boolean
}

export interface AdminUserCreateRequest {
  name: string
  companyName: string
  email: string
  password: string
  role: "ADMIN" | "SUPER_ADMIN"
}
