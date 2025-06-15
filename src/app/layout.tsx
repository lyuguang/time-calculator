import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Advanced Time Calculator',
  description: 'Calculate time forwards or backwards with precision',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}