"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, CheckCircle2, Mail, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

const TOTAL_SECONDS = 60
const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function CircularTimer({ seconds }: { seconds: number }) {
  const progress = seconds / TOTAL_SECONDS
  const dashOffset = CIRCUMFERENCE * (1 - progress)
  const size = 56

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          className="text-white/10"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          className="text-primary transition-all duration-1000 ease-linear"
        />
      </svg>
      <span className="absolute text-xs font-bold text-primary tabular-nums">
        {seconds}s
      </span>
    </div>
  )
}

export default function VerifyCodePage() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [resendSuccess, setResendSuccess] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newCode = [...code]
    pastedData.split("").forEach((char, i) => { newCode[i] = char })
    setCode(newCode)
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.some((digit) => !digit)) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const handleResend = async () => {
    setIsResending(true)
    setResendSuccess(false)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsResending(false)
    setResendSuccess(true)
    setResendTimer(TOTAL_SECONDS)
    setCode(Array(6).fill(""))
    inputRefs.current[0]?.focus()
    setTimeout(() => setResendSuccess(false), 3000)
  }

  const isComplete = code.every((digit) => digit !== "")

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/10 to-accent/20 rounded-3xl blur-xl" />

        <div className="relative bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
          {/* Back link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
              <div className="relative bg-gradient-to-br from-primary/20 to-primary/10 p-4 rounded-2xl border border-primary/20">
                <Mail className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
              Verifica tu correo
            </h1>
            <p className="text-muted-foreground text-sm">
              Ingresa el código de 6 dígitos que enviamos a tu correo electrónico
            </p>
          </div>

          {/* Success toast */}
          {resendSuccess && (
            <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Código reenviado exitosamente
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code inputs */}
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-xl font-bold bg-input/50 border border-white/10 rounded-xl text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              ))}
            </div>

            {/* Submit */}
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

          {/* Resend section */}
          <div className="mt-6">
            <div className="h-px bg-white/5 mb-6" />
            <p className="text-sm text-muted-foreground text-center mb-4">
              ¿No recibiste el código?
            </p>

            {resendTimer > 0 ? (
              /* Timer state */
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/60 border border-white/5">
                <div className="flex items-center gap-3">
                  <CircularTimer seconds={resendTimer} />
                  <div>
                    <p className="text-sm font-medium text-foreground">Espera para reenviar</p>
                    <p className="text-xs text-muted-foreground">Revisa también tu carpeta de spam</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Resend button */
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="group relative w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 text-primary font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando código...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform duration-300" />
                    Reenviar código
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
