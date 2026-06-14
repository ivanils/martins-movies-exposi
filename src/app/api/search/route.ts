import { type NextRequest } from 'next/server'
import { searchMovies } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const query = searchParams.get('query') ?? ''
  const page = Number(searchParams.get('page') ?? '1')

  if (!query.trim()) {
    return Response.json({ page: 1, results: [], total_pages: 0, total_results: 0 })
  }

  const data = await searchMovies(query, page)
  return Response.json(data)
}
