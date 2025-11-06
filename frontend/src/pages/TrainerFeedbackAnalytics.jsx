import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCourseById, getFeedbackAnalytics } from '../services/apiService.js'
import Button from '../components/Button.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import Toast from '../components/Toast.jsx'
import { useApp } from '../context/AppContext'

export default function TrainerFeedbackAnalytics() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [course, setCourse] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      const [courseData, analyticsData] = await Promise.all([
        getCourseById(id),
        getFeedbackAnalytics(id).catch(() => null) // Analytics might not exist
      ])
      setCourse(courseData)
      setFeedback(analyticsData)
    } catch (err) {
      showToast('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <LoadingSpinner message="Loading feedback analytics..." />
      </div>
    )
  }

  // Use real analytics data or fallback to empty structure
  const analytics = feedback || {
    average_rating: 0,
    total_feedback: 0,
    rating_trend: [],
    tags_breakdown: {},
    versions: []
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
      <div className="microservices-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <Button
            variant="secondary"
            onClick={() => navigate('/trainer/dashboard')}
            style={{ marginBottom: 'var(--spacing-md)' }}
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Dashboard
          </Button>
          <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 'var(--spacing-md)' }}>
            Feedback Analytics
          </h1>
          {course && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              {course.title || course.course_name}
            </p>
          )}
        </div>

        {/* Overall Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 700,
              color: 'var(--primary-cyan)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {analytics.average_rating?.toFixed(1) || 'N/A'}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--spacing-sm)' }}>
              Average Rating
            </div>
            <div style={{ color: '#FACC15', fontSize: '1.5rem' }}>
              {'★'.repeat(Math.floor(analytics.average_rating || 0))}
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 700,
              color: 'var(--primary-cyan)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {analytics.total_feedback || 0}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Total Feedback
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 700,
              color: 'var(--primary-cyan)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {analytics.versions?.length || 0}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Versions
            </div>
          </div>
        </div>

        {/* Tags Breakdown */}
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--text-primary)'
          }}>
            Feedback by Category
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-md)'
          }}>
            {Object.entries(analytics.tags_breakdown || {}).map(([tag, rating]) => (
              <div
                key={tag}
                style={{
                  padding: 'var(--spacing-md)',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  {tag}
                </div>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: 'var(--primary-cyan)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  {rating.toFixed(1)}
                </div>
                <div style={{ color: '#FACC15' }}>
                  {'★'.repeat(Math.floor(rating))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Trend */}
        {analytics.rating_trend && analytics.rating_trend.length > 0 && (
          <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--text-primary)'
            }}>
              Rating Trend
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {analytics.rating_trend.map((trend, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--spacing-sm)',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {new Date(trend.date).toLocaleDateString()}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--primary-cyan)' }}>
                    {trend.avg_rating.toFixed(1)} ★
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Version Breakdown */}
        {analytics.versions && analytics.versions.length > 0 && (
          <div className="card">
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--text-primary)'
            }}>
              Ratings by Version
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-md)' }}>
              {analytics.versions.map((v, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                    Version {v.version_no}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-cyan)' }}>
                    {v.avg_rating.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Toast />
    </div>
  )
}

