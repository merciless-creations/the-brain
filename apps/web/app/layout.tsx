import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MSWProvider } from '@/components/MSWProvider'
import { Toaster } from '@/components/ui'
import Script from 'next/script'

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              const theme = localStorage.getItem('theme');
              if (theme === 'light') {
                document.documentElement.classList.add('light');
                document.documentElement.classList.remove('dark');
              } else {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
                if (!theme) localStorage.setItem('theme', 'dark');
              }
            } catch (e) {}
          `}
        </Script>
      </head>
      <body className={`${inter.variable} antialiased bg-bg-app text-text-primary`}>
        <MSWProvider>{children}</MSWProvider>
        <Toaster />
      </body>
    </html>
  )
}
