'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { Movie } from '@/types/tmdb'
import { IMAGE_BASE_URL } from '@/lib/tmdb'
import { useWatchedStore } from '@/store/watchedStore'
import ImageFallback from '@/components/ImageFallback/ImageFallback'
import WatchedBadge from '@/components/WatchedBadge/WatchedBadge'
import styles from './MovieCard.module.scss'

interface Props {
  movie: Movie
  index: number
}

export default function MovieCard({ movie, index }: Props) {
  const [mounted, setMounted] = useState(false)
  const toggleWatched = useWatchedStore(state => state.toggleWatched)
  const isWatched = useWatchedStore(state => state.isWatched)

  useEffect(() => {
    setMounted(true)
  }, [])

  const watched = mounted && isWatched(movie.id)

  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—'
  const rating = movie.vote_average.toFixed(1)

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className={styles.poster}>
        {movie.poster_path ? (
          <Image
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <ImageFallback title={movie.title} />
        )}

        {mounted && watched && <WatchedBadge />}

        <button
          className={`${styles.watchToggle}${watched ? ` ${styles.watchToggleWatched}` : ''}`}
          onClick={() => toggleWatched({ id: movie.id, title: movie.title, poster_path: movie.poster_path })}
          aria-label={watched ? 'Mark as unwatched' : 'Mark as watched'}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{movie.title}</h3>
        <div className={styles.meta}>
          <span className={styles.rating}>★ {rating}</span>
          <span className={styles.year}>{year}</span>
        </div>
        <p className={styles.overview}>{movie.overview}</p>
        <button className={styles.button}>
          <span>Details</span>
        </button>
      </div>
    </article>
  )
}
