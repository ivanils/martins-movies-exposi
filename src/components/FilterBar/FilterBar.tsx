'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { Genre } from '@/types/tmdb'
import { useDebounce } from '@/hooks/useDebounce'
import styles from './FilterBar.module.scss'

interface Props {
  genres: Genre[]
}

const SORT_OPTIONS = [
  { label: 'Popular',    value: 'popularity.desc' },
  { label: 'Top Rated', value: 'vote_average.desc' },
  { label: 'Newest',    value: 'primary_release_date.desc' },
  { label: 'Oldest',    value: 'primary_release_date.asc' },
]

export default function FilterBar({ genres }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isFirstRender = useRef(true)

  const [query, setQuery] = useState(searchParams.get('query') ?? '')
  const debouncedQuery = useDebounce(query)

  const currentView = searchParams.get('view') ?? 'grid'
  const currentSort = searchParams.get('sort') ?? 'popularity.desc'
  const hasQuery = !!searchParams.get('query')

  // Push debounced search to URL
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedQuery.trim()) {
      params.set('query', debouncedQuery.trim())
    } else {
      params.delete('query')
    }
    params.set('page', '1')
    router.push(`/?${params.toString()}`)
  }, [debouncedQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  const navigate = (updates: Record<string, string | null>, resetPage = false) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key)
      else params.set(key, value)
    })
    if (resetPage) params.delete('page')
    router.push(`/?${params.toString()}`)
  }

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value) {
      params.set('genre', e.target.value)
    } else {
      params.delete('genre')
    }
    params.delete('page')
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className={styles.bar}>
      {/* View toggle */}
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

      {/* Search input */}
      <div className={styles.searchWrapper}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search movies..."
          className={styles.input}
          aria-label="Search movies"
        />
      </div>

      {/* Genre select */}
      <div className={styles.selectWrapper}>
        <select
          value={searchParams.get('genre') ?? ''}
          onChange={handleGenreChange}
          className={styles.select}
          aria-label="Filter by genre"
        >
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre.id} value={String(genre.id)}>{genre.name}</option>
          ))}
        </select>
      </div>

      {/* Sort select */}
      <div className={`${styles.selectWrapper}${hasQuery ? ` ${styles.sortDisabled}` : ''}`}>
        <select
          className={styles.select}
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
