import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MSWProvider } from '@/components/MSWProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'The Brain - Non-Fiction AI Authoring Platform',
  description: 'Write better non-fiction with AI assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <MSWProvider>{children}</MSWProvider>
      </body>
    </html>
  )
}
