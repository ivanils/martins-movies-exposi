'use client'

import styles from './error.module.scss'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.message}>We couldn&apos;t load the movies. Please try again.</p>
      <button className={styles.button} onClick={reset}>
        <span>Try Again</span>
      </button>
    </div>
  )
}
