'use client'

import Image from 'next/image'
import { useWatchedStore } from '@/store/watchedStore'
import styles from './RecentlyWatched.module.scss'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export default function RecentlyWatched() {
  const hasHydrated = useWatchedStore(state => state._hasHydrated)
  const watchedMovies = useWatchedStore(state => state.watchedMovies)

  if (!hasHydrated || watchedMovies.length === 0) return null

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.label}>Recently Watched</h2>
        <div className={styles.strip}>
          {watchedMovies.map(movie => (
            <div key={movie.id} className={styles.item}>
              <div className={styles.poster}>
                {movie.poster_path ? (
                  <Image
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    sizes="80px"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <span className={styles.fallback}>{movie.title.charAt(0)}</span>
                )}
              </div>
              <p className={styles.title}>{movie.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
