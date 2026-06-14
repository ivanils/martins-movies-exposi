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
- **Sort options** — popularity, rating, newest, oldest via TMDB discover params
- **Grid/List view toggle** — users can switch between poster grid and list layout
- **Recently Watched strip** — appears above the grid when at least one movie is marked watched; uses data already in Zustand, zero extra API calls
- **Trailer modal** — play button on each card fetches and plays the movie trailer via YouTube embed
- **Skeleton loaders** — replaces the default loading state with a shimmer grid that matches the card layout, preventing layout shift
- **Error boundary** — `error.tsx` catches API failures and shows a retry button rather than a broken page
- **Image fallback** — handles null poster paths from TMDB gracefully so the grid never breaks
- **SplashScreen** — branded overlay on hard page load with fade-out transition
- **ScrollToTop** — fixed button appears after 400px scroll

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
Search query, genre filter, sort order, and current page are all stored in URL `searchParams` rather than React state. This means the back button works correctly, results are shareable via URL, and the page can be deep-linked. It also means no state is lost on a hard refresh.

### Typed API Client in `lib/tmdb.ts`
All TMDB interaction goes through a single typed client rather than scattered `fetch` calls across components. This makes it easy to swap the underlying API, add request logging, or change caching behaviour in one place. TypeScript interfaces in `src/types/tmdb.ts` enforce the contract between the API layer and the UI.

### Environment Validation at Startup
`src/lib/env.ts` validates that `TMDB_API_KEY` exists and throws a descriptive error immediately if it doesn't. This fails fast at startup rather than silently returning `undefined` and causing a confusing runtime error deep in a fetch call.

### Component Structure
Each component lives in its own folder with a co-located SCSS Module. This mirrors the structure used in professional Next.js projects and makes it straightforward to add tests, stories, or sub-components alongside the main file.

### CI/CD with GitHub Actions
A GitHub Actions workflow runs on every push to `develop` and `main` and on every pull request. It runs ESLint, TypeScript type checking via `tsc --noEmit`, and a full production build in sequence. This means broken code, type errors, or lint violations are caught before they reach the main branches. The TMDB API key is stored as a GitHub Actions secret and injected only during the build step.

---

## c. AI Tool Usage

I used **Claude Code** (Anthropic's CLI coding assistant) throughout the build. The brief encourages AI tools, and Claude Code is my preferred tool as it integrates directly into the terminal workflow alongside git and the dev server. I maintained a running log of prompts and corrections as I worked, and consolidated the most representative examples below. Throughout the build I treated Claude Code as a fast first-draft generator, not a decision-maker — every file it produced was reviewed before committing, and all architectural decisions were made before prompting, not delegated to the tool.

### Phase 1 — Scaffold & Folder Structure

My initial prompt was: *"Run create-next-app with TypeScript, App Router, ESLint, src directory, and no Tailwind. Then create the following folder structure with empty shell files..."* followed by the full component and hook list.

Claude Code produced the `src/app/` structure and the `types/` folder correctly, but missed the entire `src/components/`, `src/hooks/`, `src/lib/`, and `src/store/` directories — roughly half the planned architecture. I identified the gaps and followed up with: *"You missed the following directories. Create empty shell files for each..."* listing them explicitly. It also generated an unsolicited `ARCHITECTURE.md` file — I instructed it to delete this before committing as it wasn't part of the plan.

### Phase 2 — API Layer

I prompted: *"Implement src/types/tmdb.ts with the following interfaces exactly as specified..."* and *"Create a typed TMDB API client in src/lib/tmdb.ts. All fetches must be server-side only using Next.js fetch with revalidate: 3600. The API key must never be used in any client-side context."*

The output was largely correct but I caught that `getGenres` was returning the raw `{ genres: Genre[] }` object from TMDB rather than unwrapping it to `Genre[]` as the rest of the app expected. I instructed: *"Fix getGenres — change the return type to Promise<Genre[]> and unwrap the response with .then(data => data.genres)."* I also corrected the page parameter parsing in the movies Route Handler, which had used `parseInt` without a fallback that would have passed `NaN` to the API if the param was missing.

### Phase 3 — Movie Grid & Cards

I prompted: *"Implement MovieCard with a poster using Next.js Image with fill and sizes props, aspect-ratio: 2/3 on the poster container, and a DETAILS button with a ::before sweep animation using scaleX and transform-origin: left. All colours must use CSS variables — no hardcoded hex values anywhere in the SCSS."*

The `globals.scss` and component files were produced correctly. I caught that `MovieCard.tsx` had duplicated the `TMDB_IMAGE_BASE` constant locally rather than importing `IMAGE_BASE_URL` from `@/lib/tmdb` where it was already exported. I instructed Claude Code to remove the local constant and use the shared import instead — a small but important consistency fix.

### Phase 4 — Search & Filters

I prompted: *"Create a SearchBar client component that reads initial state from searchParams so the search persists on refresh, debounces input by 300ms, and syncs query, genre, and page to the URL. Page must reset to 1 whenever query or genre changes. Do not use any React state for the search value beyond what's needed for the controlled input."*

The `SearchBar` output was strong — the `isFirstRender` ref guard to prevent overwriting URL params on initial mount was an unprompted addition I kept. After testing in the browser I found the default 500ms debounce felt sluggish and reduced it to 300ms. I also considered adding an explicit submit button but decided against it — the debounce-on-type pattern is more natural for a browsing interface.

### Phase 5 — Watched State

I prompted: *"Create a Zustand store with persist middleware for watched movies. The store must hold both watchedIds as number[] and watchedMovies as WatchedMovie[] so the Recently Watched strip can render without extra API calls. toggleWatched should add to the front of both arrays so newest appears first."*

The store was implemented correctly. The most significant issue was a UX bug I caught during browser testing — clicking the watched toggle didn't update the badge or button state visually until a page refresh. I diagnosed two root causes. First, the component-level mount guards were preventing Zustand from triggering re-renders correctly. I directed the fix: *"Move the hydration guard into the store itself using onRehydrateStorage to set a _hasHydrated flag, then replace all component-level mount guards with a subscription to that flag."* Second, `MovieCard` was subscribing to `isWatched` as a function selector rather than directly to `watchedIds`, so Zustand had nothing to diff and never triggered a re-render. I corrected this to subscribe directly to the array and call `.includes(movie.id)` inline.

I also identified that importing `IMAGE_BASE_URL` from `@/lib/tmdb` in client components caused a runtime error — `tmdb.ts` chains through `env.ts` which throws in the browser. I directed Claude Code to extract `IMAGE_BASE_URL` into a standalone `src/lib/constants.ts` file with no server-only dependencies.

Additional UI changes were made manually — replacing the checkmark toggle icon with an eye icon, which is more intuitive for a "mark as seen" interaction on a movie app.

### Phase 6 — Pagination

I defined the requirements myself before writing any prompts — specifically that all navigation must preserve existing `query` and `genre` searchParams rather than just setting the page param in isolation, which is a common mistake that would have broken the search and filter state on every page change. I also decided upfront to use the HTML `disabled` attribute on the arrow buttons rather than just styling them as disabled, ensuring keyboard and screen reader users can't activate them at boundaries.

I prompted Claude Code: *"Implement a Pagination component using the usePagination hook. Active page is a filled purple circle. Navigation must preserve existing query and genre searchParams and only change page. Include aria-current on the active page and aria-label on all controls."*

The output was clean on the first attempt. The `Math.min(data.total_pages, 500)` cap was my own addition in `page.tsx` — I knew from reading the TMDB documentation that requesting beyond page 500 returns an error, so I enforced this ceiling at the data layer rather than leaving it to the pagination component to handle.

### Phase 7 — Animations & Polish

Phase 7 covered several independent surface areas so I worked in rounds rather than a single prompt.

**NavBar:** I prompted: *"Create a sticky NavBar client component with the company logo on the left, navigation links absolutely centred, and a login button on the right. The links should set URL sort params so they are functional, not decorative. Wrap it in Suspense in layout.tsx because it uses useSearchParams."*

Two issues required correction. First, the logo was invisible — Claude Code had wrapped the `<img>` in a container with `background: var(--color-bg-card)`, which in the light theme is `#ffffff`, making a white PNG logo indistinguishable from the background. I removed the wrapper background entirely. Second, the nav links were not visually centred — they sat left-aligned because the logo was pushing them right. I fixed this by applying `position: absolute; left: 50%; transform: translateX(-50%)` to the links container, decoupling the centring from the logo width entirely. I also replaced `next/image` with a plain `<img>` tag for the logo — `next/image` with `style={{ width: 'auto' }}` caused the image to collapse to zero width in practice, and `next/image` adds no meaningful benefit for a small static locally-hosted logo that doesn't need responsive resizing.

**HeroBanner:** I prompted: *"Upgrade the HeroBanner to cycle through an array of backdrop paths passed as props. Add a Ken Burns zoom-and-pan CSS animation and use a slideKey counter as the React key on the animated element so the animation restarts on every slide change even when the same backdrop appears twice."* The output was correct. After reviewing in the browser I adjusted `.featuredTitle` to `font-size: 1.5rem; font-weight: 100` for a lighter, more cinematic feel, removed an unnecessary paragraph Claude Code had added below the title, increased the `.logoBg` backdrop blur to `12px`, and darkened its tint to `rgba(8, 4, 18, 0.62)` so the logo card reads clearly against bright backdrops.

**FilterBar and Sort:** I prompted: *"Merge SearchBar and Toolbar into a single FilterBar component with the view toggle, search input, genre select, and sort select all in one row. Sort must be validated against an allowlist in page.tsx and disabled in the UI when a keyword search is active — TMDB's /search/movie does not support sort_by."* The sort implementation required one correction in `lib/tmdb.ts`: when `sort_by=vote_average.desc` is active, TMDB's discover endpoint surfaces obscure films with a single 10/10 vote. I added a `vote_count.gte=200` guard specifically for that sort value, applied conditionally in `getPopularMovies` and `getMoviesByGenre`. I also added two extra breakpoints in `FilterBar.module.scss` — `justify-content: space-between` at 500px and `justify-content: start` at 400px — to correct alignment issues on very small screens the generated styles didn't handle.

**Trailer feature:** I prompted: *"Add a play button to each MovieCard that fetches /api/movie/{id}/videos on click and caches the trailerKey in local component state to avoid re-fetching. Open a TrailerModal with a YouTube iframe on autoplay. If no trailer exists the button is a silent no-op. The modal must use createPortal to document.body."* Claude Code implemented the Route Handler, play button, and TrailerModal correctly on the first pass. I verified that `position: fixed` on the modal worked correctly — the card's hover animation uses `transform: translateY(-4px)` which creates a new CSS stacking context and would prevent any descendant's `position: fixed` from being relative to the viewport. Using `createPortal` to `document.body` bypasses this entirely.

**Mobile drawer:** I prompted: *"Add a hamburger button that appears on mobile and opens a slide-in drawer from the right via createPortal. The drawer needs an overlay, Escape key handling, and a body scroll lock while open."* The output was correct without corrections. I increased the `.playBtn` size to `55×55px` and added a `drop-shadow` filter in the brand purple, and widened the list-view poster to `140px` after reviewing proportions at that breakpoint.

**SplashScreen:** I prompted: *"Create a SplashScreen client component that shows on every hard page load for around 1.75 seconds and then fades out with a CSS transition before unmounting."* The first draft had a timing bug — the `doneTimer` that unmounts the component was firing at 2500ms while `fadeTimer` that triggers the opacity transition was set at 3500ms, meaning the component was removed from the DOM before the transition could start. I corrected the logic so `fadeTimer` fires first and `doneTimer` fires only after the CSS transition has had time to complete. I tuned the final values to `fadeTimer` at 1750ms and `doneTimer` at 2500ms.

**ScrollToTop:** I prompted: *"Add a ScrollToTop button fixed at bottom-right that appears after 400px of scroll and scrolls the window to the top smoothly on click."* The output was correct and required no changes.

**loading.tsx** was reworked to match the SplashScreen aesthetic — replacing the plain skeleton grid with an animated logo splash with spring entrance, delayed tagline fade-up, and an indeterminate progress bar. I adjusted the `slide` keyframe values on the progress bar to `translateX(-240%)` → `translateX(600%)` to get the travel distance right visually.

**CI lint errors:** Fixed the React warning by changing `setMounted(true)` inside `useEffect` to run inside `requestAnimationFrame()` in both `NavBar.tsx` and `TrailerModal.tsx`. This keeps the client hydration guard while avoiding the synchronous state update warning.

---

## d. What I Would Do Differently or Add Given More Time

### Testing
The most significant omission given the time constraint is automated testing. I would add:
- Unit tests for `usePagination` and `useDebounce` hooks with Jest
- Unit tests for the `watchedStore` Zustand store
- Component tests for `MovieCard`, `SearchBar`, and `Pagination` with React Testing Library
- Integration tests for the Route Handlers

### Movie Detail Page
The brief is scoped to the listing page, but a natural next step would be a dedicated movie detail page (`/movie/[id]`) showing full cast, runtime, and reviews alongside the trailer and IMDB link more prominently. The `getMovieDetail` function in `lib/tmdb.ts` is already in place for this.

### Cross-Device Watched Sync
Currently watched state is browser-local. With a backend (even a lightweight one like Supabase or PlanetScale), watched state could sync across devices for logged-in users. The Zustand store is already structured in a way that would make this a clean migration — swap the `persist` localStorage middleware for an API-backed store without touching the UI components.

### Performance: Image Optimisation
The current setup uses TMDB's `w500` image size for all contexts. With more time I would implement responsive image sizing using Next.js `<Image>` `sizes` prop — serving smaller images on mobile and larger on desktop — reducing bandwidth on low-end devices.

### Accessibility Audit
While I included basic accessible markup (`aria-label`, `aria-current`, `role="status"`), a full accessibility audit with a screen reader and axe-core would surface issues in the card hover interactions and keyboard navigation that aren't immediately obvious in visual testing.

### User Authentication
The NavBar includes a login button as a UI placeholder. With more time I would implement authentication via NextAuth.js, enabling personalised watchlists, cross-device sync, and user-specific recommendations based on watched history.
