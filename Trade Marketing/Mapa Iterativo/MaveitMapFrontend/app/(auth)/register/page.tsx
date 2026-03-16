"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from "@/lib/services/auth.service"
import { ApiError } from "@/lib/services/api.client"
import { setRegistrationSession } from "@/lib/services/registration.store"
import { getPasswordValidation } from "@/lib/utils/password-rules"

const extractApiMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) {
    return error.message || fallback
  }
  if (error instanceof Error) {
    return error.message
  }
  return fallback
}

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [formError, setFormError] = useState<string | null>(null)

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0
  const passwordValidation = getPasswordValidation(formData.password)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!passwordsMatch || !passwordValidation.isValid) return
    setFormError(null)
    setIsLoading(true)
    try {
      const response = await register({
        name: formData.fullName.trim(),
        companyName: formData.companyName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      })
      setRegistrationSession(response)
      router.replace("/verificar")
    } catch (error) {
      setFormError(extractApiMessage(error, "No se pudo crear la cuenta"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/10 to-accent/20 rounded-3xl blur-xl" />
        <div className="relative bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">Crea tu cuenta</h1>
            <p className="text-muted-foreground text-sm">Comienza a gestionar tu negocio en el mapa</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-foreground/80">
                Nombre completo
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.fullName}
                  onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
                  className="pl-12 h-12 bg-input/50 border-white/10 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium text-foreground/80">
                Nombre de empresa
              </Label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Mi Empresa S.A."
                  value={formData.companyName}
                  onChange={(event) => setFormData({ ...formData, companyName: event.target.value })}
                  className="pl-12 h-12 bg-input/50 border-white/10 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  className="pl-12 h-12 bg-input/50 border-white/10 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  className="pl-12 pr-12 h-12 bg-input/50 border-white/10 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password.length > 0 && (
                <div
                  className={`flex items-center gap-2 text-xs ${
                    passwordValidation.length ? "text-green-400" : "text-muted-foreground"
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      passwordValidation.length ? "text-green-400" : "text-muted-foreground/50"
                    }`}
                  />
                  Mínimo 8 caracteres
                </div>
              )}
              {formData.password.length > 0 && !passwordValidation.isValid && (
                <p className="text-xs text-destructive">
                  Debe incluir mayúscula, minúscula, número, carácter especial y mínimo 8 caracteres.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground/80">
                Confirmar contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={(event) =>
                    setFormData({ ...formData, confirmPassword: event.target.value })
                  }
                  className={`pl-12 pr-12 h-12 bg-input/50 border-white/10 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50 ${
                    formData.confirmPassword.length > 0 && !passwordsMatch
                      ? "border-destructive/50"
                      : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword.length > 0 && (
                <div className={`flex items-center gap-2 text-xs ${passwordsMatch ? "text-green-400" : "text-destructive"}`}>
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${passwordsMatch ? "text-green-400" : "text-destructive/50"}`}
                  />
                  {passwordsMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                </div>
              )}
            </div>

            {formError && <p className="text-xs text-destructive font-medium">{formError}</p>}

            <Button
              type="submit"
              disabled={isLoading || !passwordsMatch || !passwordValidation.isValid}
              className="w-full h-12 mt-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            Al crear una cuenta, aceptas nuestros{" "}
            <Link href="#" className="text-primary hover:underline">
              Términos de servicio
            </Link>{" "}
            y{" "}
            <Link href="#" className="text-primary hover:underline">
              Política de privacidad
            </Link>
          </p>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-card text-muted-foreground">¿Ya tienes una cuenta?</span>
            </div>
          </div>

          <Link href="/login">
            <Button
              variant="outline"
              className="w-full h-12 bg-transparent border-white/10 hover:bg-white/5 hover:border-primary/50 text-foreground font-medium rounded-xl transition-all duration-300"
            >
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

