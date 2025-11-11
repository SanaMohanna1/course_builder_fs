import { Link } from 'react-router-dom'
import Container from '../Container.jsx'

const getMetadataItems = (course) => {
  const topics = Array.isArray(course?.topics) ? course.topics : []
  const modules =
    topics.length > 0
      ? topics.flatMap((topic) => topic.modules || [])
      : Array.isArray(course?.modules)
        ? course.modules
        : []

  return [
    {
      icon: 'fa-layer-group',
      label: 'Modules',
      value: modules.length > 0 ? `${modules.length}` : 'N/A'
    },
    {
      icon: 'fa-file-lines',
      label: 'Lessons',
      value:
        modules.length > 0
          ? modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)
          : Array.isArray(course?.lessons)
            ? course.lessons.length
            : 'N/A'
    },
    {
      icon: 'fa-clock',
      label: 'Duration',
      value: course?.duration ? `${course.duration} mins` : 'Approx. 45 mins'
    },
    {
      icon: 'fa-signal',
      label: 'Difficulty',
      value: (course?.difficulty || course?.level || 'Mixed').toString()
    }
  ]
}

export default function CourseOverview({
  course,
  isEnrolled,
  onEnrollClick,
  onContinue,
  showStructureCta = true,
  learnerProfile,
  progressSummary
}) {
  if (!course) {
    return null
  }

  const metadata = getMetadataItems(course)
  const metadataTags = course?.metadata?.tags || course?.metadata?.skills || []
  const tags = course?.tags || course?.skills || metadataTags
  const summary = course?.summary || course?.description || course?.course_description
  const rating = Number(course?.rating || course?.average_rating || 4.7).toFixed(1)
  const totalLearners = course?.total_enrollments
    ? `${course.total_enrollments.toLocaleString()}+`
    : 'Growing'

  const breadcrumbSegments = ['Overview']
  if (isEnrolled) {
    breadcrumbSegments.push('Structure', 'Lesson')
  }

  const insightCards = [
    {
      icon: 'fa-solid fa-users',
      title: 'Learners enrolled',
      description: `${totalLearners} active learners`
    },
    {
      icon: 'fa-solid fa-face-smile',
      title: 'Satisfaction',
      description: `Average rating ${rating}/5`
    },
    {
      icon: 'fa-solid fa-robot',
      title: 'Adaptive journey',
      description: 'Recommendations that adapt to your goals'
    }
  ]

  return (
    <div className="page-surface">
      <Container>
        <div className="stack-lg">
          <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)]" aria-label="Course breadcrumb">
            {breadcrumbSegments.map((segment, index) => (
              <span key={segment} className="relative pr-4 font-medium">
                {segment}
                {index < breadcrumbSegments.length - 1 && (
                  <span className="absolute right-1 text-[var(--text-secondary)]">›</span>
                )}
              </span>
            ))}
          </nav>

          <section
            className="surface-card space-y-8"
            style={{
              background:
                'linear-gradient(135deg, rgba(6, 95, 70, 0.1) 0%, rgba(15, 118, 110, 0.08) 40%, rgba(255, 255, 255, 0.96) 100%)'
            }}
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary-cyan)]">
                  Course overview
                </p>
                <h1 className="text-4xl font-bold leading-tight text-[var(--text-primary)]">
                  {course.title || course.course_name}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--text-secondary)]">{summary}</p>
              </div>

              <div className="grid gap-3 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white/80 p-4 text-sm shadow-sm backdrop-blur">
                {metadata.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-6">
                    <span className="flex items-center gap-2 font-medium text-[var(--text-secondary)]">
                      <i className={item.icon} aria-hidden="true" />
                      {item.label}
                    </span>
                    <span className="font-semibold text-[var(--text-primary)]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {showStructureCta && (
              <div className="flex flex-wrap gap-4">
                {!isEnrolled ? (
                  <button type="button" className="btn btn-primary" onClick={onEnrollClick}>
                    <i className="fa-solid fa-user-plus" aria-hidden="true" />
                    Enroll now
                  </button>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={onContinue}>
                    <i className="fa-solid fa-diagram-project" aria-hidden="true" />
                    Continue learning
                  </button>
                )}

                <Link to="/learner/enrolled" className="btn btn-secondary">
                  <i className="fa-solid fa-bookmark" aria-hidden="true" />
                  My courses
                </Link>
              </div>
            )}
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="surface-card soft space-y-5">
              <header className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(15,118,110,0.12)] text-[var(--primary-cyan)]">
                  <i className="fa-solid fa-graduation-cap" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">What you&apos;ll experience</h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Designed for practical mastery with guided projects and checkpoints.
                  </p>
                </div>
              </header>

              <div className="grid gap-4 sm:grid-cols-3">
                {insightCards.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white/90 p-4 text-sm shadow-sm backdrop-blur"
                  >
                    <div className="flex items-center gap-2 text-[var(--primary-cyan)]">
                      <i className={item.icon} aria-hidden="true" />
                      <span className="font-semibold text-[var(--text-primary)]">{item.title}</span>
                    </div>
                    <p className="mt-2 text-[var(--text-secondary)]">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {isEnrolled && progressSummary ? (
              <section className="surface-card soft space-y-4">
                <header className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(14,165,233,0.12)] text-[#0f766e]">
                    <i className="fa-solid fa-circle-check" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">You&apos;re enrolled</h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Track progress and pick up where you left off.
                    </p>
                  </div>
                </header>

                <div className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
                  <div>
                    <span className="font-semibold text-[var(--text-primary)]">Learner:</span>{' '}
                    {learnerProfile?.name || 'You'}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="status-chip">
                      <i className="fa-solid fa-chart-line" aria-hidden="true" />{' '}
                      {Math.round(progressSummary.progress ?? 0)}%
                    </span>
                    <span className="font-medium text-[var(--text-secondary)]">
                      {progressSummary.status?.replace('_', ' ') || 'In progress'}
                    </span>
                  </div>
                  <p>
                    {progressSummary.completed_lessons?.length || 0} lesson
                    {progressSummary.completed_lessons?.length === 1 ? '' : 's'} completed so far.
                  </p>
                </div>
              </section>
            ) : (
              <section className="surface-card soft space-y-4">
                <header className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(249,115,22,0.12)] text-[#f97316]">
                    <i className="fa-solid fa-bolt" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">Ready to dive in?</h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Enrol to unlock the full structure and adaptive learning tools.
                    </p>
                  </div>
                </header>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-[var(--primary-cyan)]" aria-hidden="true" />
                    Guided modules with interactive checkpoints.
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-[var(--primary-cyan)]" aria-hidden="true" />
                    Personalised lesson recommendations as you progress.
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-[var(--primary-cyan)]" aria-hidden="true" />
                    Community-powered insights and feedback loops.
                  </li>
                </ul>
              </section>
            )}
          </div>

          {tags.length > 0 && (
            <section className="surface-card soft space-y-4">
              <header className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(59,130,246,0.12)] text-[#2563eb]">
                  <i className="fa-solid fa-hashtag" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">Key focus areas</h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Curated skill domains and competencies addressed in this course.
                  </p>
                </div>
              </header>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className="rounded-full bg-[rgba(15,118,110,0.12)] px-3 py-1 text-sm font-medium text-[var(--primary-cyan)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </Container>
    </div>
  )
}

