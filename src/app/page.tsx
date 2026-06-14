import { Suspense } from 'react'
import { getGenres, getMoviesByGenre, getPopularMovies, searchMovies } from '@/lib/tmdb'
import MovieGrid from '@/components/MovieGrid/MovieGrid'
import RecentlyWatched from '@/components/RecentlyWatched/RecentlyWatched'
import Pagination from '@/components/Pagination/Pagination'
import HeroBanner from '@/components/HeroBanner/HeroBanner'
import FilterBar from '@/components/FilterBar/FilterBar'

const SORT_ALLOWLIST = [
  'popularity.desc',
  'vote_average.desc',
  'primary_release_date.desc',
  'primary_release_date.asc',
] as const
type SortOption = typeof SORT_ALLOWLIST[number]

function validateSort(raw: string | undefined): SortOption {
  return (SORT_ALLOWLIST as readonly string[]).includes(raw ?? '')
    ? (raw as SortOption)
    : 'popularity.desc'
}

interface Props {
  searchParams: Promise<{ page?: string; query?: string; genre?: string; sort?: string; view?: string }>
}

export default async function Home({ searchParams }: Props) {
  const { page: pageParam, query, genre, sort: sortParam, view: viewParam } = await searchParams
  const page = pageParam ? Number(pageParam) : 1
  const sort = validateSort(sortParam)
  const view = viewParam === 'list' ? 'list' : 'grid'

  const [data, genres] = await Promise.all([
    genre
      ? getMoviesByGenre(genre, page, sort)
      : query
        ? searchMovies(query, page)
        : getPopularMovies(page, sort),
    getGenres(),
  ])

  const bannerMovies = data.results
    .filter(m => m.backdrop_path !== null)
    .slice(0, 5)
    .map(m => ({ backdropPath: m.backdrop_path as string, title: m.title }))

  return (
    <>
      <HeroBanner movies={bannerMovies} />
      <Suspense>
        <FilterBar genres={genres} />
      </Suspense>
      <RecentlyWatched />
      <MovieGrid movies={data.results} view={view} />
      <Suspense>
        <Pagination currentPage={page} totalPages={Math.min(data.total_pages, 500)} />
      </Suspense>
    </>
  )
}
