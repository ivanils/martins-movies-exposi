'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import styles from './NavBar.module.scss'

const NAV_LINKS = [
  { label: 'Popular',      sort: 'popularity.desc' },
  { label: 'Top Rated',    sort: 'vote_average.desc' },
  { label: 'New Releases', sort: 'primary_release_date.desc' },
]

export default function NavBar() {
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') ?? 'popularity.desc'
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/martins-movies-logo.png" alt="Martin's Movies" className={styles.logoImg} />
        </Link>

        <ul className={styles.links}>
          {NAV_LINKS.map(link => (
            <li key={link.sort}>
              <Link
                href={`/?sort=${link.sort}`}
                className={`${styles.link}${currentSort === link.sort ? ` ${styles.linkActive}` : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <button className={styles.loginBtn} aria-label="Login">Login</button>

          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {mounted && createPortal(
        <div
          className={`${styles.overlay}${menuOpen ? ` ${styles.overlayOpen}` : ''}`}
          onClick={close}
          aria-hidden={!menuOpen}
        >
          <div
            className={`${styles.drawer}${menuOpen ? ` ${styles.drawerOpen}` : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/martins-movies-logo.png" alt="Martin's Movies" className={styles.drawerLogo} />
              <button className={styles.drawerClose} onClick={close} aria-label="Close menu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav>
              <ul className={styles.drawerLinks}>
                {NAV_LINKS.map(link => (
                  <li key={link.sort}>
                    <Link
                      href={`/?sort=${link.sort}`}
                      className={`${styles.drawerLink}${currentSort === link.sort ? ` ${styles.drawerLinkActive}` : ''}`}
                      onClick={close}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.drawerFooter}>
              <button className={styles.drawerLoginBtn} onClick={close}>Login</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </nav>
  )
}
