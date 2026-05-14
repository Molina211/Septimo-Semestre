"use client"

export type PasswordResetSession = {
  email: string
  expiresAt: string
  attemptsLeft: number
  code?: string
}

const STORAGE_KEY = "mwb_password_reset"

const readStorage = (): PasswordResetSession | null => {
  if (typeof window === "undefined") {
    return null
  }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PasswordResetSession
  } catch {
    return null
  }
}

const writeStorage = (session: PasswordResetSession | null) => {
  if (typeof window === "undefined") return
  if (!session) {
    window.sessionStorage.removeItem(STORAGE_KEY)
    return
  }
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export const getPasswordResetSession = (): PasswordResetSession | null => readStorage()

export const savePasswordResetSession = (session: PasswordResetSession) => {
  writeStorage(session)
}

export const updatePasswordResetAttempts = (attemptsLeft: number): PasswordResetSession | null => {
  const session = readStorage()
  if (!session) return null
  const next = { ...session, attemptsLeft }
  writeStorage(next)
  return next
}

export const updatePasswordResetExpiration = (expiresAt: string): PasswordResetSession | null => {
  const session = readStorage()
  if (!session) return null
  const next = { ...session, expiresAt }
  writeStorage(next)
  return next
}

export const setPasswordResetCode = (code: string): PasswordResetSession | null => {
  const session = readStorage()
  if (!session) return null
  const next = { ...session, code }
  writeStorage(next)
  return next
}

export const clearPasswordResetSession = () => writeStorage(null)

