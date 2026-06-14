import type { Movie } from '@/types/tmdb'
import MovieCard from '@/components/MovieCard/MovieCard'
import styles from './MovieGrid.module.scss'

interface Props {
  movies: Movie[]
  view?: 'grid' | 'list'
}

export default function MovieGrid({ movies, view = 'grid' }: Props) {
  if (movies.length === 0) {
    return (
      <section className={styles.wrapper}>
        <p className={styles.empty}>No movies found. Try a different search.</p>
      </section>
    )
  }

  return (
    <section className={styles.wrapper}>
      <div className={`${styles.grid}${view === 'list' ? ` ${styles.list}` : ''}`}>
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} index={index} view={view} />
        ))}
      </div>
    </section>
  )
}
