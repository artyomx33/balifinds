import type { Metadata, Viewport } from 'next'
import { playfair, dmSans } from '@/styles/fonts'
import { QueryProvider } from '@/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'BaliFinds - Discover Hidden Treasures',
  description: 'Discover hidden artisan treasures in Bali - wood carvings, ceramics, and stone sculptures',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BaliFinds',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'BaliFinds - Discover Hidden Treasures',
    description: 'Discover hidden artisan treasures in Bali',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#C9A227',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-body bg-black text-cream min-h-screen antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
