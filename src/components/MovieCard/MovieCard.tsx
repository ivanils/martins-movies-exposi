'use client'

import Image from 'next/image'
import type { Movie } from '@/types/tmdb'
import { useWatchedStore } from '@/store/watchedStore'
import ImageFallback from '@/components/ImageFallback/ImageFallback'
import WatchedBadge from '@/components/WatchedBadge/WatchedBadge'
import styles from './MovieCard.module.scss'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

interface Props {
  movie: Movie
  index: number
}

export default function MovieCard({ movie, index }: Props) {
  const hasHydrated = useWatchedStore(state => state._hasHydrated)
  const watchedIds = useWatchedStore(state => state.watchedIds)
  const toggleWatched = useWatchedStore(state => state.toggleWatched)

  const watched = hasHydrated && watchedIds.includes(movie.id)

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

        {watched && <WatchedBadge />}

        <button
          className={`${styles.watchToggle}${watched ? ` ${styles.watchToggleWatched}` : ''}`}
          onClick={() => toggleWatched({ id: movie.id, title: movie.title, poster_path: movie.poster_path })}
          aria-label={watched ? 'Mark as unwatched' : 'Mark as watched'}
        >
          <svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth={2}
  strokeLinecap="round"
  strokeLinejoin="round"
  aria-hidden="true"
>
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
  <circle cx="12" cy="12" r="3" />
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
