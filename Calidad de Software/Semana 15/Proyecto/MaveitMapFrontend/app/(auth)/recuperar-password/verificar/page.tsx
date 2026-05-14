"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, CheckCircle2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/services/api.client"
import {
  getPasswordResetSession,
  updatePasswordResetAttempts,
  updatePasswordResetExpiration,
  setPasswordResetCode,
  clearPasswordResetSession,
  PasswordResetSession,
} from "@/lib/services/password-reset.store"
import { requestPasswordReset, verifyPasswordReset } from "@/lib/services/password-reset.service"

const extractApiMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) {
    return error.message || fallback
  }
  if (error instanceof Error) {
    return error.message
  }
  return fallback
}

const parseAttempts = (message: string | null): number | null => {
  if (!message) return null
  const match = message.match(/Intentos restantes:\s*(\d+)/i)
  if (match) {
    return Number(match[1])
  }
  return null
}

const formatExpiry = (value: string | undefined) => {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
}

export default function RecoverVerifyPage() {
  const router = useRouter()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [code, setCode] = useState<string[]>(Array(8).fill(""))
  const [session, setSession] = useState<PasswordResetSession | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    setSession(getPasswordResetSession())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (!session) {
      router.replace("/recuperar-password")
    }
  }, [hydrated, router, session])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [resendTimer])

  const handleChange = (index: number, value: string) => {
    const sanitized = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
    const newCode = [...code]
    if (sanitized) {
      newCode[index] = sanitized.slice(-1)
      setCode(newCode)
      if (index < 7) {
        inputRefs.current[index + 1]?.focus()
      }
    } else {
      newCode[index] = ""
      setCode(newCode)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData("text").replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
    const newCode = [...code]
    pasted.split("").slice(0, 8).forEach((char, idx) => {
      newCode[idx] = char
    })
    setCode(newCode)
    const nextIndex = Math.min(pasted.length, 7)
    inputRefs.current[nextIndex]?.focus()
  }

  const isComplete = code.every((digit) => digit !== "")
  const combinedCode = code.join("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!isComplete || !session) return
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const updated = await verifyPasswordReset({ email: session.email, code: combinedCode })
      setSession(updated)
      setPasswordResetCode(combinedCode)
      router.replace("/nueva-password")
    } catch (error) {
      const message = extractApiMessage(error, "Código inválido")
      setErrorMessage(message)
      if (message.toLowerCase().includes("máximos")) {
        clearPasswordResetSession()
        setSession(null)
      } else {
        const attempts = parseAttempts(message)
        if (attempts !== null) {
          const updated = updatePasswordResetAttempts(attempts)
          setSession(updated)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!session || isResending) return
    setIsResending(true)
    setStatusMessage(null)
    setErrorMessage(null)
    try {
      const updated = await requestPasswordReset(session.email)
      updatePasswordResetExpiration(updated.expiresAt)
      setSession(updated)
      setStatusMessage("Código reenviado. Revisa tu correo.")
      setResendTimer(60)
      setCode(Array(8).fill(""))
      inputRefs.current[0]?.focus()
    } catch (error) {
      setErrorMessage(extractApiMessage(error, "No se pudo reenviar el código"))
    } finally {
      setIsResending(false)
    }
  }

  const expirationLabel = hydrated ? formatExpiry(session?.expiresAt) : null

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/10 to-accent/20 rounded-3xl blur-xl" />
        <div className="relative bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
          <Link
            href="/recuperar-password"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>

          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
              <div className="relative bg-gradient-to-br from-primary/20 to-primary/10 p-4 rounded-2xl border border-primary/20">
                <Mail className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">Verifica tu código</h1>
            <p className="text-muted-foreground text-sm">
              Ingresa el código de 8 caracteres enviado a{" "}
              <span>{session?.email ?? "tu correo"}</span>
            </p>
            {expirationLabel && (
              <p className="text-[11px] text-muted-foreground mt-1">
                Expira a las {expirationLabel}
              </p>
            )}
            {session?.attemptsLeft != null && (
              <p className="text-[11px] text-destructive mt-1">
                Intentos restantes: {session.attemptsLeft}
              </p>
            )}
          </div>

          {statusMessage && <p className="text-xs text-primary text-center mb-3">{statusMessage}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-wrap justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="text"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-xl font-bold bg-input/50 border border-white/10 rounded-xl text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              ))}
            </div>

            {errorMessage && <p className="text-xs text-destructive font-medium text-center">{errorMessage}</p>}

            <Button
              type="submit"
              disabled={isLoading || !isComplete}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Verificar código
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">¿No recibiste el código?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || resendTimer > 0}
              className="text-sm text-primary hover:text-primary/80 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isResending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Reenviando...
                </span>
              ) : resendTimer > 0 ? (
                `Reenviar en ${resendTimer}s`
              ) : (
                "Reenviar código"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

