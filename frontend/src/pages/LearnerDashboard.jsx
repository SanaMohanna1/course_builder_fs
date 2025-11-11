import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, Zap, Award, Sparkles, ShoppingBag, Play } from 'lucide-react'
import { getCourses } from '../services/apiService.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import Container from '../components/Container.jsx'
import { useApp } from '../context/AppContext'

export default function LearnerDashboard() {
  const { showToast, userProfile } = useApp()
  const [recommended, setRecommended] = useState([])
  const [continueLearning, setContinueLearning] = useState([])
  const [trendingTopics, setTrendingTopics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async (filters = {}) => {
    setLoading(true)
    try {
      const data = await getCourses({ limit: 24, ...filters })
      const courses = data.courses || []

      setRecommended(courses.slice(0, 6))
      setContinueLearning(
        courses.slice(6, 12).map((course, idx) => ({
          ...course,
          progress: 20 + ((idx * 17) % 60),
          lastTouched: `${2 + idx} days ago`
        }))
      )
      setTrendingTopics(
        courses.slice(12, 18).map((course, idx) => ({
          topic: course.category || `Topic ${idx + 1}`,
          learners: 320 + idx * 57,
          momentum: idx % 2 === 0 ? 'up' : 'steady'
        }))
      )
    } catch (err) {
      showToast('Failed to load your learner dashboard', 'error')
    } finally {
      setLoading(false)
    }
  }

  const emptyState = useMemo(
    () => recommended.length === 0 && continueLearning.length === 0,
    [recommended, continueLearning]
  )

  const enrolledCount = continueLearning.length
  const completedCount = continueLearning.filter((course) => course.progress >= 90).length

  if (loading) {
    return (
      <div className="dashboard-panel" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Loading your learning hub..." />
      </div>
    )
  }

  return (
    <div className="dashboard-surface">
      <div style={{ background: 'var(--bg-card)' }}>
        <Container className="py-16 text-center">
          <h1 style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)' }}>
            Welcome back, {userProfile?.name || 'Learner'}!
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto' }}>
            Continue your learning journey and discover new skills curated just for you.
          </p>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="dashboard-card">
            <div className="dashboard-icon">
              <BookOpen size={24} />
            </div>
            <h3>Enrolled Courses</h3>
            <p>{enrolledCount}</p>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-icon" style={{ background: 'var(--gradient-secondary)' }}>
              <CheckCircle size={24} />
            </div>
            <h3>Completed</h3>
            <p>{completedCount}</p>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-icon" style={{ background: 'var(--gradient-accent)' }}>
              <Zap size={24} />
            </div>
            <h3>Learning Streak</h3>
            <p>7 days</p>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-icon" style={{ background: 'var(--gradient-primary)' }}>
              <Award size={24} />
            </div>
            <h3>Achievements</h3>
            <p>12</p>
          </div>
        </div>
      </Container>

      {emptyState ? (
        <Container className="py-8">
          <div className="microservice-card text-center">
            <Sparkles size={32} />
            <h2 style={{ marginTop: 'var(--spacing-md)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Ready to start exploring?
            </h2>
            <p style={{ marginTop: 'var(--spacing-sm)', color: 'var(--text-muted)' }}>
              Build your learner profile by visiting the marketplace and saving courses to your library.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/learner/marketplace" className="btn btn-primary">
                Browse Marketplace
              </Link>
              <Link to="/learner/personalized" className="btn btn-secondary">
                Get Recommendations
              </Link>
            </div>
          </div>
        </Container>
      ) : (
        <Container className="py-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="microservice-card">
              <div className="flex items-center mb-6">
                <div className="service-icon" style={{ background: 'var(--gradient-secondary)' }}>
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2 className="card-title">Personalized learning</h2>
                  <p className="progress-text">AI-powered recommendations tailored to your goals</p>
                </div>
              </div>

              <div className="space-y-4">
                {recommended.slice(0, 3).map((course) => (
                  <div key={course.id || course.course_id} className="floating-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="card-title mb-1">{course.title || course.course_name}</h3>
                        <p className="progress-text">
                          {course.description || course.course_description || 'Build practical skills with guided lessons and projects.'}
                        </p>
                      </div>
                      <span className="badge badge-purple">Personalized</span>
                    </div>
                    <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span>{course.duration ? `${course.duration} mins` : 'Approx. 45 mins'}</span>
                      <Link to={`/courses/${course.id || course.course_id}`} className="btn btn-primary text-sm flex items-center gap-2">
                        <Play size={16} />
                        Start learning
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="microservice-card">
              <div className="flex items-center mb-6">
                <div className="service-icon" style={{ background: 'var(--gradient-primary)' }}>
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h2 className="card-title">Marketplace</h2>
                  <p className="progress-text">Discover courses from expert instructors</p>
                </div>
              </div>

              <div className="space-y-4">
                {recommended.slice(3, 6).map((course) => (
                  <div key={`market-${course.id || course.course_id}`} className="floating-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="card-title mb-1">{course.title || course.course_name}</h3>
                        <p className="progress-text">
                          {course.description || course.course_description || 'Learn from specialists with real-world experience.'}
                        </p>
                      </div>
                      <span className="badge badge-blue">Marketplace</span>
                    </div>
                    <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span>{(course.rating || course.average_rating || 4.6).toFixed(1)} rating</span>
                      <Link to={`/courses/${course.id || course.course_id}`} className="btn btn-secondary text-sm">
                        View details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-8">
            <section className="dashboard-panel">
              <div className="section-heading">
                <div>
                  <h2>Continue learning</h2>
                  <p>Pick up where you left off last session.</p>
                </div>
                <Link to="/learner/enrolled" className="action-link">
                  View all <i className="fa-solid fa-arrow-right" />
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {continueLearning.slice(0, 4).map((course) => (
                  <div key={course.id || course.course_id} className="course-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-sm)' }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{course.title || course.course_name}</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Last opened {course.lastTouched}
                        </p>
                      </div>
                      <Link to={`/courses/${course.id || course.course_id}`} className="btn btn-primary" style={{ padding: '8px 16px' }}>
                        Resume
                      </Link>
                    </div>
                    <div className="progress-track" style={{ marginTop: 'var(--spacing-md)' }}>
                      <span className="progress-fill" style={{ width: `${course.progress}%` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--spacing-sm)' }}>
                      <span>{course.progress}% completed</span>
                      <span>{course.modules?.[0]?.lessons?.length || 8} lessons</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside className="dashboard-panel">
              <div className="section-heading">
                <div>
                  <h2>Trending topics</h2>
                  <p>Communities growing in the last 7 days.</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {trendingTopics.map((topic) => (
                  <div key={topic.topic} className="course-card" style={{ padding: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: 600 }}>{topic.topic}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {topic.learners.toLocaleString()} learners this week
                        </p>
                      </div>
                      <span
                        className="status-chip"
                        style={{
                          background: topic.momentum === 'up' ? 'rgba(34,197,94,0.12)' : 'rgba(14,165,233,0.12)',
                          color: topic.momentum === 'up' ? '#047857' : '#0f766e'
                        }}
                      >
                        <i className={`fa-solid ${topic.momentum === 'up' ? 'fa-arrow-trend-up' : 'fa-arrow-right'}`} />
                        {topic.momentum === 'up' ? 'Growing' : 'Steady'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="microservice-card" style={{ background: 'var(--gradient-primary)' }}>
            <div className="text-center">
              <h2 className="card-title mb-4" style={{ color: 'white' }}>
                Ready to start learning?
              </h2>
              <p className="progress-text mb-6" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Choose your learning path and begin your journey to mastery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/learner/marketplace" className="btn btn-secondary" style={{ background: 'white', color: 'var(--primary-blue)', border: 'none' }}>
                  Browse Marketplace
                </Link>
                <Link to="/learner/personalized" className="btn btn-secondary" style={{ background: 'var(--accent-gold)', color: 'white', border: 'none' }}>
                  Get Personalized
                </Link>
              </div>
            </div>
          </div>
        </Container>
      )}
    </div>
  )
}

