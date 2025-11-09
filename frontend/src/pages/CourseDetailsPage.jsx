import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourseById, registerLearner } from '../services/apiService.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import CourseTreeView from '../components/CourseTreeView.jsx'
import { useApp } from '../context/AppContext'

export default function CourseDetailsPage() {
  const { id } = useParams()
  const { showToast, userRole } = useApp()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolled, setEnrolled] = useState(false)
  const [error, setError] = useState(null)
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    loadCourse()
  }, [id])

  const loadCourse = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCourseById(id)
      setCourse(data)
    } catch (err) {
      const message = err.message || 'Failed to load course'
      setError(message)
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (enrolled) {
      showToast('You are already enrolled in this course', 'info')
      return
    }

    setRegistering(true)
    try {
      await registerLearner(id, {
        learner_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      })
      setEnrolled(true)
      showToast('Successfully enrolled in course!', 'success')
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="section-panel" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </div>
    )
  }

  if (!course || error) {
    return (
      <section className="section-panel" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 'var(--spacing-md)' }}>
        <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '2.5rem', color: '#f97316' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 600 }}>{error || 'Course not found'}</h2>
        <Link to="/learner/marketplace" className="btn btn-primary">
          Browse courses
        </Link>
      </section>
    )
  }

  const courseTitle = course.title || course.course_name
  const courseDescription = course.description || course.course_description
  const topics = Array.isArray(course.topics) ? course.topics : []
  const modules = topics.length > 0
    ? topics.flatMap(topic => (topic.modules || []).map(module => ({ ...module, topic_title: topic.title || topic.topic_title })))
    : course.modules || []

  return (
    <div className="personalized-dashboard">
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <p className="subtitle">Course overview</p>
            <h1>{courseTitle}</h1>
            <p className="subtitle">{courseDescription}</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{course.total_enrollments || 0}</span>
                <span className="stat-label">Enrollments</span>
              </div>
              <div className="stat">
                <span className="stat-number">{(course.rating || course.average_rating || 4.6).toFixed(1)}</span>
                <span className="stat-label">Average rating</span>
              </div>
              <div className="stat">
                <span className="stat-number">{course.completion_rate || 0}%</span>
                <span className="stat-label">Completion</span>
              </div>
            </div>
            {userRole === 'learner' && (
              <div className="hero-actions">
                {!enrolled ? (
                  <button type="button" onClick={handleRegister} disabled={registering} className="btn btn-primary">
                    {registering ? <><i className="fa-solid fa-spinner fa-spin" /> Registering…</> : <><i className="fa-solid fa-user-plus" /> Enrol now</>}
                  </button>
                ) : (
                  <span className="status-chip" style={{ background: 'rgba(16,185,129,0.12)', color: '#047857' }}>
                    <i className="fa-solid fa-circle-check" /> Enrolled
                  </span>
                )}
                <Link to={`/course/${id}/feedback`} className="btn btn-secondary">
                  <i className="fa-solid fa-comment" /> Leave feedback
                </Link>
                {enrolled && (
                  <Link to={`/course/${id}/assessment`} className="btn btn-secondary">
                    <i className="fa-solid fa-clipboard-check" /> Assessment
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="hero-visual">
            <div className="floating-card" style={{ minWidth: '280px' }}>
              <div className="card-header">
                <div className="card-icon">
                  <i className="fa-solid fa-layer-group" />
                </div>
                <span className="card-title">Course summary</span>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li><strong>{topics.length || modules.length}</strong> topics covered</li>
                <li><strong>{modules.length}</strong> modules available</li>
                <li><strong>{course.duration || '45'} min</strong> average session length</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-panel" style={{ marginTop: 'var(--spacing-xl)' }}>
        <header className="section-heading">
          <div>
            <h2>Topic → Modules → Lessons</h2>
            <p>Navigate from high-level themes down to specific lessons.</p>
          </div>
        </header>

        {topics.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {topics.map((topic, idx) => (
              <div key={topic.id || `topic-${idx}`} className="course-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                  <div>
                    <span className="status-chip" style={{ background: 'rgba(14,165,233,0.12)', color: '#0f766e' }}>
                      Topic {idx + 1}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: 'var(--spacing-sm)' }}>
                      {topic.title || topic.topic_title || `Topic ${idx + 1}`}
                    </h3>
                    {topic.summary && (
                      <p style={{ marginTop: 'var(--spacing-xs)', color: 'var(--text-muted)' }}>{topic.summary}</p>
                    )}
                  </div>
                  <span className="status-chip" style={{ background: 'rgba(148,163,184,0.15)', color: 'var(--text-muted)' }}>
                    {(topic.modules || []).length} modules
                  </span>
                </div>
                <CourseTreeView modules={topic.modules || []} courseId={id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="course-card">
            <CourseTreeView modules={modules} courseId={id} />
          </div>
        )}
      </section>
    </div>
  )
}

