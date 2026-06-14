'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './HeroBanner.module.scss'

interface Props {
  backdropPaths: string[]
}

const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'
const SLIDE_DURATION = 6000

export default function HeroBanner({ backdropPaths }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slideKey, setSlideKey] = useState(0)

  useEffect(() => {
    if (backdropPaths.length <= 1) return
    const id = setInterval(() => {
      setCurrentIndex(i => (i + 1) % backdropPaths.length)
      setSlideKey(k => k + 1)
    }, SLIDE_DURATION)
    return () => clearInterval(id)
  }, [backdropPaths.length])

  return (
    <section className={styles.banner}>
      {backdropPaths.map((path, i) => {
        const isActive = i === currentIndex
        return (
          <div
            key={path}
            className={`${styles.slide}${isActive ? ` ${styles.slideActive}` : ''}`}
          >
            <div
              className={styles.slideInner}
              key={isActive ? slideKey : i}
            >
              <Image
                src={`${BACKDROP_BASE}${path}`}
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
