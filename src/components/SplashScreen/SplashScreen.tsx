'use client'

import { useState, useEffect } from 'react'
import styles from './SplashScreen.module.scss'

export default function SplashScreen() {
  const [phase, setPhase] = useState<'in' | 'out' | 'done'>('in')

  useEffect(() => {
    // Begin fade-out at 1 000 ms, unmount at 1 500 ms → total visible ≈ 1.5 s
    const fadeTimer = setTimeout(() => setPhase('out'), 3500)
    const doneTimer = setTimeout(() => setPhase('done'), 2500)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div className={`${styles.screen}${phase === 'out' ? ` ${styles.fading}` : ''}`}>
      <div className={styles.wrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/martins-movies-logo.png"
          alt="Martin's Movies"
          className={styles.logo}
        />
        <p className={styles.tagline}>Discover your next favourite film</p>
        <div className={styles.track}>
          <div className={styles.bar} />
        </div>
      </div>
    </div>
  )
}
