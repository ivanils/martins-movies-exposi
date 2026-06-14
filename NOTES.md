# NOTES.md — Martin's Movies

## a. Brief Interpretation & Assumptions

### Listing Page
The brief asks for a "paginated listing page to pull all data from their new database." I interpreted this as a default view of popular movies using TMDB's `/discover/movie?sort_by=popularity.desc` endpoint rather than `/movie/popular`, as `discover` is the more flexible and scalable endpoint — it supports filtering by genre, year, rating, and other attributes without switching endpoints. This makes the architecture cleaner as the app grows.

I capped pagination at 500 pages, which is TMDB's documented hard limit. Attempting to fetch beyond this returns an error, so the pagination component enforces this ceiling.

### Search by "Different Movie Attributes"
The brief mentions "keyword" explicitly and "different movie attributes" as an open-ended hint. I interpreted this as an invitation to implement at minimum one additional filter beyond keyword search. I chose genre filtering via TMDB's `/genre/movie/list` endpoint, as genre is the most natural and useful secondary filter for a movie browsing experience.

When a keyword is present, the app switches to TMDB's `/search/movie` endpoint. When only a genre is selected, it uses `/discover/movie?with_genres=`. Both can be combined. Page resets to 1 whenever the query or genre changes, which is the expected UX behaviour.

Search state, genre filter, and current page all live in the URL as `searchParams` (`?query=batman&genre=28&page=2`). This makes results bookmarkable and shareable — a deliberate product decision that reflects how real users share links.

### "Watched" Persistence
The brief says "when they open the listing page again in the same browser it will still be marked as watched." This is an unambiguous description of `localStorage` — not cookies (which are for server-side needs) and not a database (which would require auth). I implemented this via Zustand's `persist` middleware writing to `localStorage` under the key `martins-movies-watched`.

The store holds both the watched IDs and minimal movie objects `{ id, title, poster_path }` so the Recently Watched strip can render without additional API calls.

### IMDB "Read More" Link
The brief states "link the Read More button for each movie off to the IMDB page if the imdb_id is set." The list endpoints (`/discover/movie`, `/search/movie`) do not return `imdb_id` — only the detail endpoint `/movie/{id}` does. I fetch the detail on demand when the user clicks "Read More" and redirect to `https://www.imdb.com/title/{imdb_id}` if the ID is present. If no `imdb_id` exists, the button falls back to the TMDB movie page.

I considered pre-fetching all `imdb_id`s on page load but rejected this as it would require 20 parallel requests per page (one per movie), creating an N+1 problem that would slow down the initial load significantly with no user-visible benefit until the button is clicked.

### Design Reference
The brief references the Movify template at gnodesign.com as a design Martin "liked." I interpreted this as inspiration to follow faithfully — the brief says "match a theme he liked, but include a central search input," meaning the only explicitly requested design change is the search bar placement. I extracted the colour palette and layout directly from the reference: light grey page background (`#f0f4f8`), white cards, purple accent (`#7b2ff7`), purple-to-pink gradient header, and dark navy footer. The central search input was added above the grid as instructed, styled to match the existing design language.

While staying true to the Movify palette and layout, I made several targeted improvements to enhance UX and visual polish without altering the design identity:

- **CSS custom properties:** The entire colour palette and transition values are defined as CSS variables in `globals.scss`, making the design system consistent and maintainable across all components rather than having hardcoded values scattered through SCSS files.
- **Aspect ratio lock on posters:** All movie poster containers use `aspect-ratio: 2/3`, ensuring a perfectly uniform grid regardless of what TMDB returns. The original template has inconsistent card heights when image dimensions vary.
- **Button micro-interaction:** The Details button uses a `::before` pseudo-element sweep on hover — a left-to-right fill animation that stays within the purple brand colour but feels considerably more polished than a plain colour change.
- **Staggered card entrance:** Cards animate in with a staggered fade-up on grid load using pure CSS `@keyframes`. The template has no animation; this addition makes the page feel intentional and alive without changing the visual design.
- **Refined type scale:** Consistent `font-weight`, `line-height`, and `letter-spacing` applied across titles, metadata, and button labels gives the existing design better visual hierarchy.
- **Page fade transition:** Grid content fades between pages instead of snapping, improving perceived performance without any visual identity change.
- **Responsive search:** On mobile, the search input and genre filter stack vertically and expand to full width — the template has no mobile search handling at all.

### Beyond the Brief — Additions Made
- **Genre filter dropdown** — natural extension of "search by different attributes"
- **Recently Watched strip** — appears above the grid when at least one movie is marked watched; uses data already in Zustand, zero extra API calls
- **Skeleton loaders** — replaces the default loading state with a shimmer grid that matches the card layout, preventing layout shift
- **Error boundary** — `error.tsx` catches API failures and shows a retry button rather than a broken page
- **Image fallback** — handles null poster paths from TMDB gracefully so the grid never breaks

---

## b. Architecture Decisions

### Next.js App Router
I used the App Router (introduced in Next.js 13, stable in 14) rather than the Pages Router. The App Router enables React Server Components by default, which means the initial movie listing is fetched server-side with no client JavaScript involved — faster first load, better SEO, and the API key never touches the browser.

### API Key Security via Route Handlers
All direct calls to the TMDB API happen server-side. The client never calls TMDB directly. For the initial page load, `getPopularMovies()` runs in a Server Component. For subsequent client-side interactions (search, filtering), the frontend calls internal Next.js Route Handlers at `/api/movies` and `/api/search`, which proxy the request to TMDB server-side. This means the `TMDB_API_KEY` environment variable is never included in the client bundle.

### Server-Side Caching with `revalidate`
All server-side TMDB fetches use `{ next: { revalidate: 3600 } }`, which tells Next.js to cache the response for one hour using its built-in data cache. Popular movies don't change minute-to-minute, so this significantly reduces API calls and speeds up repeat visits without sacrificing freshness.

### Zustand over React Context for Watched State
I chose Zustand with the `persist` middleware over a custom `useWatched` hook with raw `localStorage` access for two reasons. First, Zustand's `persist` middleware handles localStorage serialisation, deserialisation, and SSR hydration safely out of the box — raw `localStorage` in Next.js App Router components causes hydration mismatches because the server renders without it. Second, Zustand avoids the prop-drilling and re-render issues that come with Context when the state is consumed by many components across the tree (every MovieCard needs to know if it's watched).

A client-side mount guard (`useEffect` + `useState`) is used in components that read from the store to ensure the watched UI only renders after hydration is complete.

### SCSS Modules over Tailwind
SCSS Modules keep styles strictly scoped to their component — no class name collisions, no global leakage, and no dependency on a utility class compiler. This reflects how styling works in larger team codebases where multiple developers work on components in parallel. It also allows more expressive animation and pseudo-selector logic that utility classes don't handle as cleanly.

### CSS Custom Properties as a Design System
Rather than hardcoding colour values in individual SCSS modules, all design tokens (colours, shadows, transitions) are defined as CSS custom properties in `globals.scss`. This means any component references `var(--color-accent)` rather than `#7b2ff7` — a single source of truth that makes global changes trivial and signals experience with scalable frontend architecture.

### URL-Synced State for Search and Pagination
Search query, genre filter, and current page are all stored in URL `searchParams` rather than React state. This means the back button works correctly, results are shareable via URL, and the page can be deep-linked. It also means no state is lost on a hard refresh.

### Typed API Client in `lib/tmdb.ts`
All TMDB interaction goes through a single typed client rather than scattered `fetch` calls across components. This makes it easy to swap the underlying API, add request logging, or change caching behaviour in one place. TypeScript interfaces in `src/types/tmdb.ts` enforce the contract between the API layer and the UI.

### Environment Validation at Startup
`src/lib/env.ts` validates that `TMDB_API_KEY` exists and throws a descriptive error immediately if it doesn't. This fails fast at startup rather than silently returning `undefined` and causing a confusing runtime error deep in a fetch call.

### Component Structure
Each component lives in its own folder with a co-located SCSS Module. This mirrors the structure used in professional Next.js projects and makes it straightforward to add tests, stories, or sub-components alongside the main file.

---

## c. AI Tool Usage

I used **Claude Code** (Anthropic's CLI coding assistant) throughout the build. The brief encourages AI tools, and Claude Code is my preferred tool as it integrates directly into the terminal workflow alongside git and the dev server. Throughout the build I treated it as a fast first-draft generator, not a decision-maker — every file it produced was reviewed before committing, and architectural decisions were made before prompting, not delegated to the tool.

### Phase 1 — Scaffold & Folder Structure

I prompted Claude Code to run `create-next-app` with the correct flags (TypeScript, App Router, no Tailwind) and then create all component shells and folder structure from a detailed specification I provided. It produced the `src/app/` structure and the `types/` folder correctly, but missed the entire `src/components/`, `src/hooks/`, `src/lib/`, and `src/store/` directories — roughly half the planned architecture. I identified the gaps, listed the missing files explicitly, and instructed it to create them. It also generated an unsolicited `ARCHITECTURE.md` file that wasn't part of the plan — I instructed it to delete it before committing.

### Phase 2 — API Layer

I provided the exact interface shapes and asked Claude Code to implement `src/types/tmdb.ts`. The output was correct overall, but I caught that `getGenres` in the API client was returning the raw `{ genres: Genre[] }` object from TMDB rather than unwrapping it to `Genre[]` as the rest of the app expected. This would have caused a type error the moment any component tried to map over the result. I instructed Claude Code to fix the return type to `Promise<Genre[]>` and chain `.then(data => data.genres)` on the fetch call.

For the TMDB API client, Claude Code generated the `fetchTMDB` generic utility and all five API functions correctly. I verified the `revalidate: 3600` cache option was applied at the fetch level rather than the route level — the correct placement in the App Router. I also reviewed the Route Handlers and corrected the page parameter parsing in the movies handler, which had used `parseInt` without a fallback and would have passed `NaN` to the API if the param was missing. I changed it to `Number(searchParams.get('page') ?? '1')` to ensure a safe default. The search handler included an unprompted guard for empty query strings returning a safe empty response — a good defensive pattern I kept as-is.

### Phase 3 — Movie Grid & Cards
_To be completed._

### Phase 4 — Search & Filters
_To be completed._

### Phase 5 — Watched State
_To be completed._

### Phase 6 — Pagination
_To be completed._

### Phase 7 — Animations & Polish
_To be completed._

---

## d. What I Would Do Differently or Add Given More Time

### Testing
The most significant omission given the time constraint is automated testing. I would add:
- Unit tests for `usePagination` and `useDebounce` hooks with Jest
- Unit tests for the `watchedStore` Zustand store
- Component tests for `MovieCard`, `SearchBar`, and `Pagination` with React Testing Library
- Integration tests for the Route Handlers

### Movie Detail Page
The brief is scoped to the listing page, but a natural next step would be a dedicated movie detail page (`/movie/[id]`) showing full cast, trailer, runtime, and the IMDB link more prominently. The `getMovieDetail` function in `lib/tmdb.ts` is already in place for this.

### Advanced Filtering
The genre filter could be extended with year range sliders, minimum rating threshold, and sort options (by release date, by rating, by title). TMDB's `/discover/movie` endpoint supports all of these parameters without any additional API complexity.

### Cross-Device Watched Sync
Currently watched state is browser-local. With a backend (even a lightweight one like Supabase or PlanetScale), watched state could sync across devices for logged-in users. The Zustand store is already structured in a way that would make this a clean migration — swap the `persist` localStorage middleware for an API-backed store without touching the UI components.

### CI/CD with GitHub Actions
I would add a GitHub Actions workflow to run linting (`eslint`) and type checking (`tsc --noEmit`) on every pull request, preventing broken code from reaching `develop` or `main`. Vercel's preview deployments already handle visual checking, but automated type and lint checks would complete the pipeline.

### Performance: Image Optimisation
The current setup uses TMDB's `w500` image size for all contexts. With more time I would implement responsive image sizing using Next.js `<Image>` `sizes` prop — serving smaller images on mobile and larger on desktop — reducing bandwidth on low-end devices.

### Accessibility Audit
While I included basic accessible markup (`aria-label`, `aria-current`, `role="status"`), a full accessibility audit with a screen reader and axe-core would surface issues in the card hover interactions and keyboard navigation that aren't immediately obvious in visual testing.
