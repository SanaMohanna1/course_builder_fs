import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../services/apiService.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useCourseProgress } from '../hooks/useCourseProgress.js'
import Container from '../components/Container.jsx'

const defaultCourseState = {
  completedStages: [],
  completedLessons: 0
}

const stageMeta = {
  lessons: {
    label: 'Take lesson',
    description: 'Complete guided lessons tailored for you',
    icon: 'fa-solid fa-play',
    accent: 'rgba(15,118,110,0.12)',
    accentBorder: 'rgba(15,118,110,0.45)'
  },
  exercises: {
    label: 'Do exercise',
    description: 'Practice skills with adaptive assessments',
    icon: 'fa-solid fa-dumbbell',
    accent: 'rgba(79,70,229,0.12)',
    accentBorder: 'rgba(79,70,229,0.4)'
  },
  exam: {
    label: 'Exam',
    description: 'Unlock after finishing lessons and exercises',
    icon: 'fa-solid fa-clipboard-check',
    accent: 'rgba(14,165,233,0.12)',
    accentBorder: 'rgba(14,165,233,0.4)'
  },
  feedback: {
    label: 'Feedback',
    description: 'Share reflections to improve future recommendations',
    icon: 'fa-solid fa-comments',
    accent: 'rgba(236,72,153,0.12)',
    accentBorder: 'rgba(236,72,153,0.4)'
  }
}

function PersonalizedCourseCard({ course, state, onCompleteStage, notify }) {
  const courseId = course.id || course.course_id
  const modules = course.modules || []
  const totalLessons = modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 6

  const { canAccessStage, isStageComplete, isLastLessonCompleted } = useCourseProgress({
    courseType: 'personalized',
    completedStages: state.completedStages,
    totalLessons,
    completedLessons: state.completedLessons
  })

  const handleStageComplete = (stage) => () => {
    onCompleteStage(courseId, stage, totalLessons)
    notify(`Marked ${stage} as complete.`, 'success')
  }

  const stages = ['lessons', 'exercises', 'exam', 'feedback']

  return (
    <article className="course-card space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <span className="tag-chip w-max bg-[rgba(99,102,241,0.12)] text-[#4338ca]">
            <i className="fa-solid fa-sparkles" aria-hidden="true" /> Personalized
          </span>
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">
            {course.title || course.course_name}
          </h3>
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            {course.description || course.course_description || 'AI-generated pathway based on your goals.'}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <span className="status-chip bg-[rgba(16,185,129,0.12)] text-[#047857]">
            <i className="fa-solid fa-layer-group" aria-hidden="true" />
            {modules.length || 3} modules
          </span>
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            <i className="fa-solid fa-book" aria-hidden="true" />
            {totalLessons} lessons
          </span>
        </div>
      </header>

      <div className="stage-grid">
        {stages.map((stageKey) => {
          const metadata = stageMeta[stageKey]
          const complete = isStageComplete(stageKey)
          const accessible =
            stageKey === 'exam'
              ? canAccessStage(stageKey) && isLastLessonCompleted
              : canAccessStage(stageKey)
          const disabled = !accessible || complete
          const statusLabel = complete ? 'Completed' : accessible ? 'Ready' : 'Locked'

          return (
            <button
              key={stageKey}
              type="button"
              onClick={handleStageComplete(stageKey)}
              disabled={disabled}
              className={`stage-card ${complete ? 'stage-card--complete' : ''} ${
                accessible && !complete ? 'stage-card--active' : ''
              }`}
              style={{
                '--stage-accent': metadata.accent,
                '--stage-border': metadata.accentBorder
              }}
            >
              <div className="stage-card__icon">
                <i className={metadata.icon} aria-hidden="true" />
              </div>
              <div className="stage-card__body">
                <span className="stage-card__title">{metadata.label}</span>
                <p>{metadata.description}</p>
              </div>
              <span className="stage-card__status">{statusLabel}</span>
              {complete && (
                <span className="stage-card__badge">
                  <i className="fa-solid fa-circle-check" aria-hidden="true" /> Done
                </span>
              )}
            </button>
          )
        })}
      </div>

      <footer className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[var(--text-muted)]">
        <span className="status-chip bg-[rgba(16,185,129,0.12)] text-[#047857]">
          <i className="fa-solid fa-seedling" aria-hidden="true" /> Adaptive difficulty enabled
        </span>
        <span className="status-chip bg-[rgba(14,165,233,0.12)] text-[#0f766e]">
          <i className="fa-solid fa-robot" aria-hidden="true" /> AI trainer synced
        </span>
      </footer>
    </article>
  )
}

export default function LearnerForYou() {
  const { showToast } = useApp()
  const [courses, setCourses] = useState([])
  const [courseState, setCourseState] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setLoading(true)
    try {
      const data = await getCourses({ limit: 24 })
      const personalised = (data.courses || []).filter((_, idx) => idx % 2 === 0)
      setCourses(personalised)
    } catch (err) {
      showToast('Failed to load personalized recommendations', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getCourseState = (courseId) => courseState[courseId] || defaultCourseState

  const updateCourseState = (courseId, updater) => {
    setCourseState((prev) => {
      const current = prev[courseId] || defaultCourseState
      const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater }
      return {
        ...prev,
        [courseId]: next
      }
    })
  }

  const handleStageCompletion = (courseId, stage, totalLessons) => {
    updateCourseState(courseId, (current) => {
      const completedStages = new Set(current.completedStages)
      completedStages.add(stage)
      return {
        ...current,
        completedStages: Array.from(completedStages),
        completedLessons: stage === 'lessons' ? totalLessons : current.completedLessons
      }
    })
  }

  if (loading) {
    return (
      <div className="page-surface">
        <Container>
          <div className="surface-card soft flex min-h-[60vh] items-center justify-center">
            <LoadingSpinner message="Loading AI recommendations..." />
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="page-surface">
      <Container>
        <div className="stack-lg">
          <section className="surface-card space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary-cyan)]">
                Personalised journey
              </p>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">Courses curated just for you</h1>
              <p className="max-w-3xl text-base leading-7 text-[var(--text-secondary)]">
                These learning paths adapt to your progress. Complete lessons, unlock exercises, then take the exam
                before sharing feedback for deeper insights.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/learner/enrolled" className="btn btn-primary">
                View my library
              </Link>
              <Link to="/learner/marketplace" className="btn btn-secondary">
                Add more interests
              </Link>
            </div>
          </section>

          {courses.length === 0 ? (
            <section className="surface-card soft text-center">
              <i className="fa-solid fa-sparkles text-3xl text-[var(--primary-cyan)]" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">
                No personalised courses yet
              </h2>
              <p className="mt-2 text-[var(--text-secondary)]">
                Interact with marketplace courses and complete feedback to unlock tailored recommendations.
              </p>
            </section>
          ) : (
            <div className="stack-lg">
              {courses.map((course) => (
                <PersonalizedCourseCard
                  key={course.id || course.course_id}
                  course={course}
                  state={getCourseState(course.id || course.course_id)}
                  onCompleteStage={handleStageCompletion}
                  notify={showToast}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

