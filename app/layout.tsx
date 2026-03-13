import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { MusicPlayer } from '@/components/portfolio/music-player'
import { ContentProvider } from '@/components/portfolio/content-context'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tanvi Sirsat | Writer & Essayist',
  description: 'Award-winning writer exploring the intersections of memory, identity, and the human condition through essays, fiction, and literary journalism.',
  generator: 'v0.app',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ContentProvider>
            {children}
            <MusicPlayer />
          </ContentProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
