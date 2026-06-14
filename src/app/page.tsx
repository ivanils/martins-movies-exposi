import { getPopularMovies } from '@/lib/tmdb'
import MovieGrid from '@/components/MovieGrid/MovieGrid'

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function Home({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = pageParam ? Number(pageParam) : 1
  const data = await getPopularMovies(page)

  return <MovieGrid movies={data.results} />
}
