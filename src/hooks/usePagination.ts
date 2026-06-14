export interface PaginationResult {
  currentPage: number
  totalPages: number
  pages: (number | '...')[]
}

export function usePagination(currentPage: number, totalPages: number): PaginationResult {
  const capped = Math.min(totalPages, 500)
  const page = Math.max(1, Math.min(currentPage, capped))

  if (capped <= 1) {
    return { currentPage: page, totalPages: capped, pages: capped === 1 ? [1] : [] }
  }

  const pages: (number | '...')[] = []
  const delta = 2
  const rangeStart = Math.max(2, page - delta)
  const rangeEnd = Math.min(capped - 1, page + delta)

  pages.push(1)
  if (rangeStart > 2) pages.push('...')
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i)
  if (rangeEnd < capped - 1) pages.push('...')
  pages.push(capped)

  return { currentPage: page, totalPages: capped, pages }
}
