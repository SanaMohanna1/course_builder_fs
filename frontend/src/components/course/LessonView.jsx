import LessonViewer from '../LessonViewer.jsx'

export default function LessonView({
  courseTitle,
  lesson,
  onPrevious,
  onNext,
  onComplete,
  isCompleted,
  completionSummary,
  onTakeTest,
  canTakeTest = false,
  isFinalLesson = false
}) {
  return (
    <div className="personalized-dashboard">
      <nav className="breadcrumb" aria-label="Lesson breadcrumb">
        <span>Overview</span>
        <span>Structure</span>
        <span>{lesson?.title || lesson?.lesson_name || 'Lesson'}</span>
      </nav>

      <section className="section-panel" style={{ maxWidth: '960px', margin: '0 auto', padding: 'var(--spacing-xl)' }}>
        <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xl)' }}>
          <span className="tag-chip" style={{ width: 'fit-content' }}>
            <i className="fa-solid fa-graduation-cap" />
            {courseTitle}
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>
            {lesson?.title || lesson?.lesson_name || 'Lesson'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {isFinalLesson
              ? 'You are at the final lesson. Wrap this up to unlock the course assessment and share your feedback.'
              : 'Progress through the curated content to unlock exercises and the final assessment.'}
          </p>
        </header>

        <LessonViewer
          lesson={lesson}
          onPrevious={onPrevious}
          onNext={isFinalLesson ? undefined : onNext}
          onComplete={() => onComplete?.(lesson)}
          isCompleted={isCompleted}
          onTakeTest={isFinalLesson ? onTakeTest : undefined}
          canTakeTest={canTakeTest}
        />

        <footer style={{ marginTop: 'var(--spacing-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}
          >
            <i
              className={`fa-solid ${isCompleted ? 'fa-circle-check' : 'fa-circle'} `}
              style={{ color: isCompleted ? '#047857' : 'var(--text-secondary)' }}
            />
            {isCompleted
              ? isFinalLesson
                ? 'Final lesson completed – assessment unlocked'
                : 'Marked as completed'
              : 'Complete the lesson to track progress'}
          </div>
          {completionSummary}
        </footer>
      </section>
    </div>
  )
}

