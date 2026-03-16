import Link from "next/link"
import { MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-background to-slate-950/90" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
              <div className="relative bg-gradient-to-br from-primary to-primary/70 p-5 rounded-2xl">
                <MapPin className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            Map<span className="text-primary">Web</span>Business
          </h1>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto text-balance">
            Gestiona tu negocio en el mapa. Visualiza, analiza y toma mejores decisiones.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                className="h-12 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:scale-[1.02]"
              >
                Iniciar sesión
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                className="h-12 px-8 bg-transparent border-white/10 hover:bg-white/5 hover:border-primary/50 text-foreground font-medium rounded-xl transition-all duration-300"
              >
                Crear cuenta
              </Button>
            </Link>
          </div>

          {/* Links to other pages */}
          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/verificar" className="hover:text-primary transition-colors">
              Verificar correo
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/recuperar-password" className="hover:text-primary transition-colors">
              Recuperar contraseña
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/nueva-password" className="hover:text-primary transition-colors">
              Nueva contraseña
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/perfil" className="hover:text-primary transition-colors">
              Perfil de usuario
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/admin" className="hover:text-primary transition-colors font-medium text-primary/80">
              Panel Admin
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MapWebBusiness. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
