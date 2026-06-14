# Martin's Movies

A movie listing web app built as a technical assessment for GCG Health Safety & Hygiene. Powered by [The Movie Database (TMDB) API](https://www.themoviedb.org/).
Built as a technical assessment for GCG/Exposi. The brief asked for a paginated movie listing with search, watched state persistence, and a design matching the Movify template. See NOTES.md for the full decision log.

🔗 **Live URL:** https://martins-movies-exposi.vercel.app

---

## Features

- **Paginated movie listing** — browse popular movies pulled from TMDB
- **Search & filter** — search by keyword, filter by genre, sort by popularity, rating, newest or oldest
- **Grid / List view toggle** — switch between poster grid and list layout
- **Watched state** — mark movies as watched; persists in the same browser via localStorage
- **Recently Watched strip** — appears above the grid when at least one movie is marked watched
- **IMDB links** — Details button opens the IMDB page if an `imdb_id` is available, falls back to TMDB
- **Trailer modal** — play button fetches and plays the movie trailer via YouTube embed
- **Hero banner** — cycles through TMDB backdrop images with Ken Burns animation
- **Responsive design** — works on desktop, tablet, and mobile
- **Skeleton loaders** — shimmer placeholders during loading, no layout shift
- **Error boundary** — friendly retry screen if the API fails
- **CI/CD** — GitHub Actions runs lint, type check, and build on every PR

---

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript (strict)
- **Styling:** SCSS Modules with CSS custom properties
- **State:** Zustand with persist middleware
- **API:** TMDB REST API (server-side only — key never exposed to client)
- **Deployment:** Vercel

---

## Architecture

The app uses Next.js App Router with a clear separation between 
server and client responsibilities.

**Data flow:**
Browser → Next.js Route Handler → TMDB API (server-side only)

- Initial page load: Server Component fetches popular movies and 
  genres in parallel via Promise.all, renders HTML with no client JS
- Search/filter/sort: Client components call internal Route Handlers 
  at /api/movies and /api/search which proxy to TMDB server-side
- The TMDB_API_KEY never reaches the browser under any path
- All search, genre, sort, and page state lives in URL searchParams —
  results are bookmarkable and the back button works correctly
- Watched state is managed by Zustand with persist middleware writing
  to localStorage — SSR-safe, no hydration mismatches

---

## Getting Started

### Prerequisites

- Node.js 20+
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### Installation

```bash
git clone https://github.com/ivanils/martins-movies-exposi.git
cd martins-movies-exposi
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
TMDB_API_KEY=your_tmdb_api_key_here
```

See `.env.example` for reference.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
  app/                  # Next.js App Router pages and layouts
    api/                # Route Handlers — proxy TMDB calls server-side
  components/           # UI components, each with co-located SCSS Module
  hooks/                # useDebounce, usePagination
  lib/                  # TMDB API client, env validation, constants
  store/                # Zustand watched store
  types/                # TypeScript interfaces for TMDB responses
```

---

## Assessment Notes

See [NOTES.md](./NOTES.md) for full documentation of:
- Brief interpretation and assumptions
- Architecture decisions and rationale
- AI tool usage log with specific prompts and corrections
- What would be added given more time
