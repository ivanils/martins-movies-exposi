import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WatchedMovie {
  id: number
  title: string
  poster_path: string | null
}

interface WatchedStore {
  watchedIds: number[]
  watchedMovies: WatchedMovie[]
  _hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  toggleWatched: (movie: WatchedMovie) => void
  isWatched: (id: number) => boolean
}

export const useWatchedStore = create<WatchedStore>()(
  persist(
    (set, get) => ({
      watchedIds: [],
      watchedMovies: [],
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),

      toggleWatched: (movie) => {
        const { watchedIds, watchedMovies } = get()
        if (watchedIds.includes(movie.id)) {
          set({
            watchedIds: watchedIds.filter(id => id !== movie.id),
            watchedMovies: watchedMovies.filter(m => m.id !== movie.id),
          })
        } else {
          set({
            watchedIds: [movie.id, ...watchedIds],
            watchedMovies: [movie, ...watchedMovies],
          })
        }
      },

      isWatched: (id) => get().watchedIds.includes(id),
    }),
    {
      name: 'martins-movies-watched',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
