const apiKey = process.env.TMDB_API_KEY

if (!apiKey) {
  throw new Error('Missing required environment variable: TMDB_API_KEY')
}

export const env = {
  TMDB_API_KEY: apiKey,
}
