'use client'

import { useEffect, useState } from 'react'
import styles from './WatchedBadge.module.scss'

export default function WatchedBadge() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <span className={styles.badge}>Watched</span>
}
