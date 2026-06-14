import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from '@/components/NavBar/NavBar'
import './globals.scss'
import styles from './layout.module.scss'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Martin's Movies",
  description: 'Discover and track movies powered by TMDB',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Suspense>
          <NavBar />
        </Suspense>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} Martin&apos;s Movies · Powered by TMDB
          </p>
        </footer>
      </body>
    </html>
  )
}
