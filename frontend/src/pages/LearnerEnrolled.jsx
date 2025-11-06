import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLearnerProgress } from '../services/apiService.js'
import CourseCard from '../components/CourseCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import Toast from '../components/Toast.jsx'
import { useApp } from '../context/AppContext'

export default function LearnerEnrolled() {
  const { showToast } = useApp()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'in_progress', 'completed'

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    setLoading(true)
    try {
      // Mock learner ID - in production, get from auth context
      const learnerId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      const progressData = await getLearnerProgress(learnerId)
      setCourses(progressData.map(course => ({
        id: course.course_id,
        title: course.title,
        level: course.level,
        rating: course.rating,
        progress: course.progress,
        status: course.status
      })))
    } catch (err) {
      showToast('Failed to load enrolled courses', 'error')
      // Fallback to empty array if no progress data
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true
    if (filter === 'completed') return course.status === 'completed' || course.progress === 100
    if (filter === 'in_progress') return course.status === 'in_progress' && course.progress < 100
    return true
  })

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <LoadingSpinner message="Loading your enrolled courses..." />
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
      <div className="microservices-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 'var(--spacing-md)' }}>
            <i className="fas fa-book-open mr-2" style={{ color: 'var(--primary-cyan)' }}></i>
            My Enrolled Courses
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Track your progress and continue learning
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-lg)',
          flexWrap: 'wrap'
        }}>
          {['all', 'in_progress', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: filter === f ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                color: filter === f ? 'white' : 'var(--text-primary)',
                border: `1px solid ${filter === f ? 'transparent' : 'var(--bg-tertiary)'}`,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: 500,
                textTransform: 'capitalize'
              }}
            >
              {f === 'all' ? 'All Courses' : f === 'in_progress' ? 'In Progress' : 'Completed'}
            </button>
          ))}
        </div>

        {filteredCourses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
            <i className="fas fa-book" style={{ fontSize: '4rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }}></i>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)' }}>
              No {filter !== 'all' ? filter.replace('_', ' ') : 'enrolled'} courses
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
              {filter === 'all' 
                ? "You haven't enrolled in any courses yet."
                : filter === 'completed'
                ? "You haven't completed any courses yet."
                : "You don't have any courses in progress."}
            </p>
            {filter === 'all' && (
              <Link to="/courses">
                <button className="btn btn-primary">
                  Browse Courses
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="microservices-grid">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id || course.course_id}
                course={course}
                showProgress={true}
                progress={course.progress}
              />
            ))}
          </div>
        )}
      </div>
      <Toast />
    </div>
  )
}

