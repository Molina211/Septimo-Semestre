import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'

const _geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const _geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'MapWebBusiness',
  description: 'Dashboard interactivo de ventas con mapa, waypoints, filtros y estadisticas comparativas',
  icons: {
    icon: [
      {
        url: '/maveit-favicon.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/maveit-favicon.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/maveit-favicon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1b2e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${_geist.variable} ${_geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableColorScheme={false}>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
