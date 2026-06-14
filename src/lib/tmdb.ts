import { env } from './env'
import type { Genre, Movie, TMDBPaginatedResponse } from '@/types/tmdb'

const BASE_URL = 'https://api.themoviedb.org/3'
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

const fetchTMDB = async <T>(path: string): Promise<T> => {
  const url = `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}api_key=${env.TMDB_API_KEY}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`TMDB fetch failed: ${res.status} ${path}`)
  return res.json() as Promise<T>
}

export const getPopularMovies = (page: number, sort = 'popularity.desc'): Promise<TMDBPaginatedResponse<Movie>> => {
  const extra = sort === 'vote_average.desc' ? '&vote_count.gte=200' : ''
  return fetchTMDB(`/discover/movie?sort_by=${sort}${extra}&page=${page}`)
}

export const searchMovies = (query: string, page: number): Promise<TMDBPaginatedResponse<Movie>> =>
  fetchTMDB(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`)

export const getMoviesByGenre = (genreId: string, page: number, sort = 'popularity.desc'): Promise<TMDBPaginatedResponse<Movie>> => {
  const extra = sort === 'vote_average.desc' ? '&vote_count.gte=200' : ''
  return fetchTMDB(`/discover/movie?with_genres=${genreId}&sort_by=${sort}${extra}&page=${page}`)
}

export const getGenres = (): Promise<Genre[]> =>
  fetchTMDB<{ genres: Genre[] }>('/genre/movie/list').then(data => data.genres)

export const getMovieDetail = (id: number): Promise<Movie> =>
  fetchTMDB(`/movie/${id}`)

interface MovieVideo {
  key: string
  site: string
  type: string
  official: boolean
}

export const getMovieVideos = (id: number): Promise<{ results: MovieVideo[] }> =>
  fetchTMDB(`/movie/${id}/videos`)
