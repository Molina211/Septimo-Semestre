import { apiFetch } from "./api.client"

export type PasswordResetSession = {
  email: string
  expiresAt: string
  attemptsLeft: number
}

export async function requestPasswordReset(email: string): Promise<PasswordResetSession> {
  return apiFetch<PasswordResetSession>("/api/auth/password/forgot", {
    method: "POST",
    body: { email: email.trim() },
    requireAuth: false,
  })
}

export async function verifyPasswordReset(payload: {
  email: string
  code: string
}): Promise<PasswordResetSession> {
  return apiFetch<PasswordResetSession>("/api/auth/password/verify", {
    method: "POST",
    body: payload,
    requireAuth: false,
  })
}

export async function resetPassword(payload: {
  email: string
  code: string
  password: string
}): Promise<void> {
  await apiFetch<void>("/api/auth/password/reset", {
    method: "PUT",
    body: payload,
    requireAuth: false,
  })
}

