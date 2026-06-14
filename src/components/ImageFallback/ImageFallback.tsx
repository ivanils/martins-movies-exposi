import styles from './ImageFallback.module.scss'

interface Props {
  title: string
}

export default function ImageFallback({ title }: Props) {
  return (
    <div className={styles.fallback} aria-label={title}>
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M8 4v16M16 4v16M2 8h4M2 12h4M2 16h4M18 8h4M18 12h4M18 16h4" />
      </svg>
      <span className={styles.title}>{title}</span>
    </div>
  )
}
