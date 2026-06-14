import Image from 'next/image'
import styles from './HeroBanner.module.scss'

interface Props {
  backdropPath: string | null
}

const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'

export default function HeroBanner({ backdropPath }: Props) {
  return (
    <section className={styles.banner}>
      {backdropPath && (
        <Image
          src={`${BACKDROP_BASE}${backdropPath}`}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      )}
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1 className={styles.title}>Martin&apos;s Movies</h1>
        <p className={styles.subtitle}>Discover your next favourite film</p>
      </div>
    </section>
  )
}
