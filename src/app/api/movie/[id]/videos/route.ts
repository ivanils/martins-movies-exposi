import { NextRequest, NextResponse } from 'next/server'
import { getMovieVideos } from '@/lib/tmdb'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const data = await getMovieVideos(Number(id))
  const trailer =
    data.results.find(v => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ??
    data.results.find(v => v.site === 'YouTube' && v.type === 'Trailer') ??
    data.results.find(v => v.site === 'YouTube')
  return NextResponse.json({ trailerKey: trailer?.key ?? null })
}
