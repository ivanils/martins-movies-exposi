import { Suspense } from 'react'
import { getGenres, getMoviesByGenre, getPopularMovies, searchMovies } from '@/lib/tmdb'
import MovieGrid from '@/components/MovieGrid/MovieGrid'
import SearchBar from '@/components/SearchBar/SearchBar'
import RecentlyWatched from '@/components/RecentlyWatched/RecentlyWatched'
import Pagination from '@/components/Pagination/Pagination'

interface Props {
  searchParams: Promise<{ page?: string; query?: string; genre?: string }>
}

export default async function Home({ searchParams }: Props) {
  const { page: pageParam, query, genre } = await searchParams
  const page = pageParam ? Number(pageParam) : 1

  const [data, genres] = await Promise.all([
    genre
      ? getMoviesByGenre(genre, page)
      : query
        ? searchMovies(query, page)
        : getPopularMovies(page),
    getGenres(),
  ])

  return (
    <>
      <Suspense>
        <SearchBar genres={genres} />
      </Suspense>
      <RecentlyWatched />
      <MovieGrid movies={data.results} />
      <Suspense>
        <Pagination currentPage={page} totalPages={Math.min(data.total_pages, 500)} />
      </Suspense>
    </>
  )
}
