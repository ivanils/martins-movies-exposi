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
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          <span>Martin&apos;s Movies</span>
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
      </div>
    </nav>
  )
}
