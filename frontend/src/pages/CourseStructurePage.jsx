import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourseById } from '../services/apiService.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import CourseStructure from '../components/course/CourseStructure.jsx'
import { useApp } from '../context/AppContext'
import Container from '../components/Container.jsx'

export default function CourseStructurePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast, userRole, userProfile } = useApp()
  const learnerId = userRole === 'learner' ? userProfile?.id : null

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [completedLessons, setCompletedLessons] = useState([])
  const [learnerProgress, setLearnerProgress] = useState(null)

  const loadCourse = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = learnerId ? { learner_id: learnerId } : undefined
      const data = await getCourseById(id, params)
      setCourse(data)
      const progress = data.learner_progress || null
      setLearnerProgress(progress)
      if (progress?.completed_lessons) {
        setCompletedLessons(progress.completed_lessons.map(String))
      } else {
        setCompletedLessons([])
      }
    } catch (err) {
      const message = err.message || 'Failed to load course structure'
      setError(message)
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }, [id, learnerId, showToast])

  useEffect(() => {
    loadCourse()
  }, [id, loadCourse])

  useEffect(() => {
    if (!loading && learnerProgress && !learnerProgress.is_enrolled && userRole === 'learner') {
      navigate(`/course/${id}/overview`, { replace: true })
    }
  }, [id, learnerProgress, loading, navigate, userRole])

  if (userRole === 'learner' && !learnerProgress?.is_enrolled && !loading) {
    return (
      <div className="page-surface">
        <Container>
          <section className="surface-card soft flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
            <i className="fa-solid fa-circle-info text-4xl text-[var(--primary-cyan)]" aria-hidden="true" />
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                Enrol to view the structure
              </h2>
              <p className="mx-auto max-w-md text-[var(--text-secondary)]">
                Secure your spot in this course to unlock the module and lesson outline.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate(`/course/${id}/overview`)}
            >
              Back to overview
            </button>
          </section>
        </Container>
      </div>
    )
  }

  const handleSelectLesson = (lessonId) => {
    if (!lessonId) return
    navigate(`/course/${id}/lesson/${lessonId}`)
  }

  const totalLessons = course?.modules?.reduce((total, module) => {
    return total + (module.lessons?.length || 0)
  }, 0) || 0

  const progressPercent = Math.round(learnerProgress?.progress ?? ((completedLessons.length / (totalLessons || 1)) * 100))

  const completionBadge = (
    <div className="rounded-2xl border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.08)] px-4 py-3 text-sm font-semibold text-[#047857]">
      <div className="flex flex-wrap items-center gap-2">
        <i className="fa-solid fa-chart-simple" aria-hidden="true" />
        <span>
          Progress {progressPercent}% · {completedLessons.length}/{totalLessons} lessons complete
        </span>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="page-surface">
        <Container>
          <div className="surface-card soft flex min-h-[60vh] items-center justify-center">
            <LoadingSpinner message="Loading course structure..." />
          </div>
        </Container>
      </div>
    )
  }

  if (!course || error) {
    return (
      <div className="page-surface">
        <Container>
          <section className="surface-card soft flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
            <i className="fa-solid fa-triangle-exclamation text-4xl text-[#f97316]" aria-hidden="true" />
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              {error || 'Course not found'}
            </h2>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate(`/course/${id}/overview`)}
            >
              Back to overview
            </button>
          </section>
        </Container>
      </div>
    )
  }

  const breadcrumbSegments = ['Overview', 'Structure']

  return (
    <div className="page-surface">
      <Container>
        <div className="stack-lg">
          <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)]" aria-label="Structure breadcrumb">
            {breadcrumbSegments.map((segment, index) => (
              <span key={segment} className="relative pr-4 font-medium">
                {segment}
                {index < breadcrumbSegments.length - 1 && (
                  <span className="absolute right-1 text-[var(--text-secondary)]">›</span>
                )}
              </span>
            ))}
          </nav>

          <section className="surface-card space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary-cyan)]">
                Course structure
              </p>
              <h1 className="text-3xl font-bold leading-tight text-[var(--text-primary)]">
                {course.title || course.course_name}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[var(--text-secondary)]">
                Explore the adaptive journey, track your milestones, and jump into the next lesson when
                you&apos;re ready.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {completionBadge}
              {learnerProgress?.status && (
                <span className="text-sm font-semibold text-[var(--text-secondary)]">
                  Status:{' '}
                  <span className="text-[var(--text-primary)]">
                    {learnerProgress.status.replace('_', ' ')}
                  </span>
                </span>
              )}
            </div>
          </section>

          <section className="surface-card soft">
            <CourseStructure
              course={course}
              onSelectLesson={handleSelectLesson}
              completedLessonIds={completedLessons}
              unlocked
            />
          </section>
        </div>
      </Container>
    </div>
  )
}
