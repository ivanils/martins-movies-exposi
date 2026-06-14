'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useWatchedStore } from '@/store/watchedStore'
import { IMAGE_BASE_URL } from '@/lib/tmdb'
import styles from './RecentlyWatched.module.scss'

export default function RecentlyWatched() {
  const [mounted, setMounted] = useState(false)
  const watchedMovies = useWatchedStore(state => state.watchedMovies)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || watchedMovies.length === 0) return null

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
