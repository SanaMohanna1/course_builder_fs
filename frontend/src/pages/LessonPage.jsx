import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getLessonById } from '../services/apiService.js'
import Button from '../components/Button.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import LessonViewer from '../components/LessonViewer.jsx'
import { useApp } from '../context/AppContext'

export default function LessonPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [loading, setLoading] = useState(true)
  const [lesson, setLesson] = useState(null)

  useEffect(() => {
    loadLesson()
  }, [id])

  const loadLesson = async () => {
    setLoading(true)
    try {
      const data = await getLessonById(id)
      setLesson(data)
    } catch (err) {
      showToast('Failed to load lesson', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="section-panel" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Loading lesson..." />
      </div>
    )
  }

  return (
    <div className="personalized-dashboard">
      <section className="section-panel" style={{ maxWidth: '960px', margin: '0 auto', padding: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left" style={{ marginRight: '8px' }} /> Back to previous
          </Button>
          {lesson?.module?.name && (
            <span className="status-chip" style={{ background: 'rgba(14,165,233,0.12)', color: '#0f766e' }}>
              Module: {lesson.module.name}
            </span>
          )}
        </div>
        <LessonViewer
          lesson={lesson}
          onPrevious={() => navigate(-1)}
          onNext={() => navigate(-1)}
          onComplete={() => showToast('Lesson completed!', 'success')}
        />
      </section>
    </div>
  )
}
