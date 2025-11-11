import LessonViewer from '../LessonViewer.jsx'
import Container from '../Container.jsx'

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
    <div className="page-surface">
      <Container>
        <div className="mx-auto max-w-4xl space-y-6">
          <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)]" aria-label="Lesson breadcrumb">
            <span className="relative pr-4 font-medium">
              Overview
              <span className="absolute right-1 text-[var(--text-secondary)]">›</span>
            </span>
            <span className="relative pr-4 font-medium">
              Structure
              <span className="absolute right-1 text-[var(--text-secondary)]">›</span>
            </span>
            <span className="font-medium text-[var(--text-primary)]">
              {lesson?.title || lesson?.lesson_name || 'Lesson'}
            </span>
          </nav>

          <section className="surface-card space-y-8">
            <header className="space-y-3">
              <span className="tag-chip w-max">
                <i className="fa-solid fa-graduation-cap" aria-hidden="true" />
                {courseTitle}
              </span>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                {lesson?.title || lesson?.lesson_name || 'Lesson'}
              </h1>
              <p className="text-[var(--text-secondary)]">
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

            <footer className="flex flex-col gap-3 border-t border-[rgba(148,163,184,0.18)] pt-6 text-sm text-[var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <i
                  className={`fa-solid ${isCompleted ? 'fa-circle-check text-[#047857]' : 'fa-circle text-[var(--text-secondary)]'}`}
                  aria-hidden="true"
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
      </Container>
    </div>
  )
}

