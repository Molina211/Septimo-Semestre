"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuthToken } from "@/lib/hooks/use-auth-token"
import { parseAuthToken } from "@/lib/utils/jwt.utils"

export default function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const token = useAuthToken()
  const [isReady, setIsReady] = useState(false)

  const parsed = useMemo(() => parseAuthToken(token), [token])

  useEffect(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) return
    if (!token) {
      router.replace("/login")
      return
    }
    if (!parsed || parsed.role !== "SUPER_ADMIN") {
      router.replace("/mapa")
    }
  }, [isReady, token, parsed, router])

  if (!isReady || !token || !parsed || parsed.role !== "SUPER_ADMIN") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
