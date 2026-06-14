import Image from 'next/image'
import type { Movie } from '@/types/tmdb'
import { IMAGE_BASE_URL } from '@/lib/tmdb'
import ImageFallback from '@/components/ImageFallback/ImageFallback'
import styles from './MovieCard.module.scss'

interface Props {
  movie: Movie
  index: number
}

export default function MovieCard({ movie, index }: Props) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—'
  const rating = movie.vote_average.toFixed(1)

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className={styles.poster}>
        {movie.poster_path ? (
          <Image
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <ImageFallback title={movie.title} />
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{movie.title}</h3>
        <div className={styles.meta}>
          <span className={styles.rating}>★ {rating}</span>
          <span className={styles.year}>{year}</span>
        </div>
        <p className={styles.overview}>{movie.overview}</p>
        <button className={styles.button}>
          <span>Details</span>
        </button>
      </div>
    </article>
  )
}
