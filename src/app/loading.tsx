import styles from './loading.module.scss'

export default function Loading() {
  return (
    <div className={styles.screen}>
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
