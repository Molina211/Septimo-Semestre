import { MapPin } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-background to-slate-950/90" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="w-full py-6 px-8">
        <Link href="/" className="flex items-center gap-3 w-fit group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full group-hover:bg-primary/50 transition-all" />
            <div className="relative bg-gradient-to-br from-primary to-primary/70 p-2.5 rounded-xl">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Map<span className="text-primary">Web</span>Business
          </span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MapWebBusiness. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
