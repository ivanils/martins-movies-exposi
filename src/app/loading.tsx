import SkeletonCard from '@/components/SkeletonCard/SkeletonCard'
import styles from './loading.module.scss'

export default function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
