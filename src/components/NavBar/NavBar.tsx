'use client'

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

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/martins-movies-logo.png"
            alt="Martin's Movies"
            className={styles.logoImg}
          />
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

        <button className={styles.loginBtn} aria-label="Login">
          Login
        </button>
      </div>
    </nav>
  )
}
