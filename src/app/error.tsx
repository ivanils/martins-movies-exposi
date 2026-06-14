'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Something went wrong!</h2>
      <p>{error?.message || 'An unexpected error occurred'}</p>
      <button
        onClick={() => reset()}
        style={{
          padding: '0.5rem 1rem',
          marginTop: '1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  )
}
