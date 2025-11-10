import { useEffect, useState } from 'react'

export default function EnrollModal({
  isOpen,
  learnerName,
  onConfirm,
  onClose,
  isSubmitting = false
}) {
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setConsentGiven(false)
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="enroll-modal-title">
      <div className="modal-card">
        <header className="modal-header">
          <div className="card-icon">
            <i className="fa-solid fa-user-check" />
          </div>
          <div>
            <h2 id="enroll-modal-title">Confirm enrollment</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Secure your spot in this cohort and unlock the full learning journey.
            </p>
          </div>
        </header>

        <div className="modal-body">
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
              Learner details
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {learnerName ? (
                <>
                  You are enrolling as <strong>{learnerName}</strong>.
                </>
              ) : (
                'Enrollment will be linked to your learner profile.'
              )}
            </p>
          </div>
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--spacing-sm)',
              fontSize: '0.95rem',
              color: 'var(--text-secondary)'
            }}
          >
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(event) => setConsentGiven(event.target.checked)}
              style={{ marginTop: '4px' }}
            />
            <span>
              I consent to receiving learning recommendations, adaptive coaching prompts, and course completion reminders
              related to this programme.
            </span>
          </label>
        </div>

        <footer className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onConfirm?.()}
            disabled={!consentGiven || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" />
                Enrolling…
              </>
            ) : (
              <>
                <i className="fa-solid fa-circle-check" />
                Enroll now
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  )
}

