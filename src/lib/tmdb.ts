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

export const getPopularMovies = (page: number): Promise<TMDBPaginatedResponse<Movie>> =>
  fetchTMDB(`/discover/movie?sort_by=popularity.desc&page=${page}`)

export const searchMovies = (query: string, page: number): Promise<TMDBPaginatedResponse<Movie>> =>
  fetchTMDB(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`)

export const getMoviesByGenre = (genreId: string, page: number): Promise<TMDBPaginatedResponse<Movie>> =>
  fetchTMDB(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`)

export const getGenres = (): Promise<{ genres: Genre[] }> =>
  fetchTMDB('/genre/movie/list')

export const getMovieDetail = (id: number): Promise<Movie> =>
  fetchTMDB(`/movie/${id}`)
