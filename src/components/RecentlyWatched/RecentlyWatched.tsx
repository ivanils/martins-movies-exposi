'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useWatchedStore } from '@/store/watchedStore'
import styles from './RecentlyWatched.module.scss'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export default function RecentlyWatched() {
  const hasHydrated = useWatchedStore(state => state._hasHydrated)
  const watchedMovies = useWatchedStore(state => state.watchedMovies)

  const stripRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(true)

  const visible = hasHydrated && watchedMovies.length > 0

  const updateScrollState = () => {
    const el = stripRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 0)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
  }

  useEffect(() => {
    updateScrollState()
  }, [watchedMovies])

  const handleScrollLeft = () => stripRef.current?.scrollBy({ left: -240, behavior: 'smooth' })
  const handleScrollRight = () => stripRef.current?.scrollBy({ left: 240, behavior: 'smooth' })

  const showLeft = visible && !atStart
  const showRight = visible && !atEnd

  return (
    <section className={`${styles.section}${!visible ? ` ${styles.sectionHidden}` : ''}`}>
      <div className={styles.inner}>
        <h2 className={styles.label}>Recently Watched</h2>
        <div className={styles.stripWrapper}>
          <button
            className={`${styles.arrow} ${styles.arrowLeft}${showLeft ? ` ${styles.arrowVisible}` : ''}`}
            onClick={handleScrollLeft}
            aria-label="Scroll left"
            tabIndex={showLeft ? 0 : -1}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div ref={stripRef} className={styles.strip} onScroll={updateScrollState}>
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

          <button
            className={`${styles.arrow} ${styles.arrowRight}${showRight ? ` ${styles.arrowVisible}` : ''}`}
            onClick={handleScrollRight}
            aria-label="Scroll right"
            tabIndex={showRight ? 0 : -1}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
