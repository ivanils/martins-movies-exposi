'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { Genre } from '@/types/tmdb'
import { useDebounce } from '@/hooks/useDebounce'
import styles from './SearchBar.module.scss'

interface Props {
  genres: Genre[]
}

export default function SearchBar({ genres }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isFirstRender = useRef(true)

  const [query, setQuery] = useState(searchParams.get('query') ?? '')
  const debouncedQuery = useDebounce(query)

  // Push debounced query to URL, skip on first render to avoid overwriting initial params
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
    router.push(`?${params.toString()}`)
  }, [debouncedQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value) {
      params.set('genre', e.target.value)
    } else {
      params.delete('genre')
    }
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <svg
          className={styles.searchIcon}
          xmlns="http://www.w3.org/2000/svg"
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
      <select
        value={searchParams.get('genre') ?? ''}
        onChange={handleGenreChange}
        className={styles.select}
        aria-label="Filter by genre"
      >
        <option value="">All Genres</option>
        {genres.map(genre => (
          <option key={genre.id} value={String(genre.id)}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  )
}
