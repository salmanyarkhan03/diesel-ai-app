import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import { LocationProvider } from '@/lib/location-context'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-barlow',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['900'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Diesel AI — Fuel Intelligence Platform',
  description: 'AI-powered insights for fuel station operators',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><rect x=%224%22 y=%224%22 width=%2214%22 height=%2220%22 rx=%223.5%22 fill=%22none%22 stroke=%22%2322c55e%22 stroke-width=%221.5%22/><path d=%22M18 10 Q24 10 24 16 L24 26%22 stroke=%22%2322c55e%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 fill=%22none%22/><rect x=%2220%22 y=%2224%22 width=%226%22 height=%224%22 rx=%222%22 fill=%22%2322c55e%22/></svg>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body style={{ backgroundColor: '#080910' }}>
        <LocationProvider>{children}</LocationProvider>
      </body>
    </html>
  )
}
