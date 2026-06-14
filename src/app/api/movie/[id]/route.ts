import { NextRequest, NextResponse } from 'next/server'
import { getMovieDetail } from '@/lib/tmdb'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const movie = await getMovieDetail(Number(id))
  return NextResponse.json({ imdb_id: movie.imdb_id ?? null })
}
