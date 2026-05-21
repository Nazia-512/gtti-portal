import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GTTI Smart Portal | Government Technical Training Institute D.G. Khan',
  description: 'AI-powered student portal for GTTI D.G. Khan — CV Builder, Career Tools, Shining Stars, and more.',
  keywords: 'GTTI, DG Khan, Technical Institute, Student Portal, AI, CV Builder',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
