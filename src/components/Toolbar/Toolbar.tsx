'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import styles from './Toolbar.module.scss'

const SORT_OPTIONS = [
  { label: 'Popular',    value: 'popularity.desc' },
  { label: 'Top Rated', value: 'vote_average.desc' },
  { label: 'Newest',    value: 'primary_release_date.desc' },
  { label: 'Oldest',    value: 'primary_release_date.asc' },
]

export default function Toolbar() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentView = searchParams.get('view') ?? 'grid'
  const currentSort = searchParams.get('sort') ?? 'popularity.desc'
  const hasQuery = searchParams.has('query')

  const navigate = (updates: Record<string, string | null>, resetPage = false) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key)
      else params.set(key, value)
    })
    if (resetPage) params.delete('page')
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.viewToggle}>
        <button
          className={`${styles.toggleBtn}${currentView === 'grid' ? ` ${styles.toggleActive}` : ''}`}
          onClick={() => navigate({ view: 'grid' })}
          aria-label="Grid view"
          aria-pressed={currentView === 'grid'}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="3" y="3" width="8" height="8" rx="1" />
            <rect x="13" y="3" width="8" height="8" rx="1" />
            <rect x="3" y="13" width="8" height="8" rx="1" />
            <rect x="13" y="13" width="8" height="8" rx="1" />
          </svg>
        </button>

        <button
          className={`${styles.toggleBtn}${currentView === 'list' ? ` ${styles.toggleActive}` : ''}`}
          onClick={() => navigate({ view: 'list' })}
          aria-label="List view"
          aria-pressed={currentView === 'list'}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="3" y="4" width="18" height="3" rx="1" />
            <rect x="3" y="10.5" width="18" height="3" rx="1" />
            <rect x="3" y="17" width="18" height="3" rx="1" />
          </svg>
        </button>
      </div>

      <div className={`${styles.sortWrapper}${hasQuery ? ` ${styles.sortDisabled}` : ''}`}>
        <select
          className={styles.sortSelect}
          value={currentSort}
          onChange={e => navigate({ sort: e.target.value }, true)}
          disabled={hasQuery}
          aria-label="Sort movies"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
