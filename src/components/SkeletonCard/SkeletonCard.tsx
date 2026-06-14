import styles from './SkeletonCard.module.scss'

export default function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.poster} />
      <div className={styles.body}>
        <div className={styles.titleBar} />
        <div className={styles.titleBarShort} />
        <div className={styles.metaBar} />
        <div className={styles.overviewBar} />
        <div className={styles.overviewBarShort} />
        <div className={styles.buttonBar} />
      </div>
    </div>
  )
}
