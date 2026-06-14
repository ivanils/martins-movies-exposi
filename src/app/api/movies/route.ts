import { type NextRequest } from 'next/server'
import { getMoviesByGenre, getPopularMovies } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get('page') ?? '1')
  const genre = searchParams.get('genre')

  const data = genre
    ? await getMoviesByGenre(genre, page)
    : await getPopularMovies(page)

  return Response.json(data)
}
