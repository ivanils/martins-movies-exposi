'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './HeroBanner.module.scss'

interface BannerMovie {
  backdropPath: string
  title: string
}

interface Props {
  movies: BannerMovie[]
}

const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'
const SLIDE_DURATION = 6000

export default function HeroBanner({ movies }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slideKey, setSlideKey] = useState(0)

  useEffect(() => {
    if (movies.length <= 1) return
    const id = setInterval(() => {
      setCurrentIndex(i => (i + 1) % movies.length)
      setSlideKey(k => k + 1)
    }, SLIDE_DURATION)
    return () => clearInterval(id)
  }, [movies.length])

  const currentTitle = movies[currentIndex]?.title ?? ''

  return (
    <section className={styles.banner}>
      {movies.map((m, i) => {
        const isActive = i === currentIndex
        return (
          <div
            key={m.backdropPath}
            className={`${styles.slide}${isActive ? ` ${styles.slideActive}` : ''}`}
          >
            <div className={styles.slideInner} key={isActive ? slideKey : i}>
              <Image
                src={`${BACKDROP_BASE}${m.backdropPath}`}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
          </div>
        )
      })}

      <div className={styles.overlay} aria-hidden="true" />

      {/* Current movie title — top left */}
      {currentTitle && (
        <div className={styles.movieLabel}>
          <h2 className={styles.featuredTitle}>{currentTitle}</h2>
        </div>
      )}

      {/* Centred logo card */}
      <div className={styles.content}>
        <div className={styles.logoBg}>
          <Image
            src="/martins-movies-logo.png"
            alt="Martin's Movies"
            width={280}
            height={86}
            style={{ height: '72px', width: 'auto' }}
            priority
          />
          <p className={styles.tagline}>Discover your next favourite film</p>
        </div>
      </div>
    </section>
  )
}
