import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getLessonById } from '../services/apiService.js'
import Button from '../components/Button.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import LessonViewer from '../components/LessonViewer.jsx'
import Toast from '../components/Toast.jsx'
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
      console.error('Error loading lesson:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <LoadingSpinner message="Loading lesson..." />
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
      <div className="microservices-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Back Button */}
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          style={{ marginBottom: 'var(--spacing-lg)' }}
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back
        </Button>

        {/* Lesson Content */}
        <LessonViewer
          lesson={lesson}
          onPrevious={() => navigate(-1)}
          onNext={() => navigate(-1)}
          onComplete={(lesson) => {
            showToast('Lesson completed!', 'success')
          }}
        />

      </div>
      <Toast />
    </div>
  )
}
