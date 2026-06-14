import type { Movie } from '@/types/tmdb'
import MovieCard from '@/components/MovieCard/MovieCard'
import styles from './MovieGrid.module.scss'

interface Props {
  movies: Movie[]
}

export default function MovieGrid({ movies }: Props) {
  if (movies.length === 0) {
    return (
      <section className={styles.wrapper}>
        <p className={styles.empty}>No movies found. Try a different search.</p>
      </section>
    )
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} index={index} />
        ))}
      </div>
    </section>
  )
}
