'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { usePagination } from '@/hooks/usePagination'
import styles from './Pagination.module.scss'

interface Props {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentPage: page, totalPages: total, pages } = usePagination(currentPage, totalPages)

  if (total <= 1) return null

  const navigate = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    router.push(`?${params.toString()}`)
  }

  return (
    <nav className={styles.nav} aria-label="Pagination">
      <button
        className={`${styles.arrow}${page === 1 ? ` ${styles.disabled}` : ''}`}
        onClick={() => navigate(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      <ul className={styles.pages}>
        {pages.map((p, i) =>
          p === '...' ? (
            <li key={`ellipsis-${i}`} className={styles.ellipsis} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                className={`${styles.pageBtn}${p === page ? ` ${styles.active}` : ''}`}
                onClick={() => p !== page && navigate(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            </li>
          )
        )}
      </ul>

      <button
        className={`${styles.arrow}${page === total ? ` ${styles.disabled}` : ''}`}
        onClick={() => navigate(page + 1)}
        disabled={page === total}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  )
}
