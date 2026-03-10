"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuthToken } from "@/lib/hooks/use-auth-token"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const token = useAuthToken()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) {
      return
    }
    if (!token) {
      router.replace("/login")
    }
  }, [isReady, token, router])

  if (!isReady || !token) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
