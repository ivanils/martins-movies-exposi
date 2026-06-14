import type { Movie } from '@/types/tmdb'
import MovieCard from '@/components/MovieCard/MovieCard'
import styles from './MovieGrid.module.scss'

interface Props {
  movies: Movie[]
}

export default function MovieGrid({ movies }: Props) {
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
