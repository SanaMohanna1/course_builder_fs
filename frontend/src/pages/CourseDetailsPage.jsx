import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourseById, registerLearner } from '../services/apiService.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import CourseOverview from '../components/course/CourseOverview.jsx'
import EnrollModal from '../components/course/EnrollModal.jsx'
import { useApp } from '../context/AppContext'

export default function CourseDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast, userRole } = useApp()
  const learnerId = userRole === 'learner' ? 'a1b2c3d4-e5f6-7890-1234-567890abcdef' : null
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)
  const [learnerProgress, setLearnerProgress] = useState(null)

  const loadCourse = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = learnerId ? { learner_id: learnerId } : undefined
      const data = await getCourseById(id, params)
      setCourse(data)
      setLearnerProgress(data.learner_progress || null)
    } catch (err) {
      const message = err.message || 'Failed to load course'
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
    if (!loading && learnerProgress?.is_enrolled && userRole === 'learner') {
      navigate(`/course/${id}/structure`, { replace: true })
    }
  }, [id, learnerProgress, loading, navigate, userRole])

  const isEnrolled = learnerProgress?.is_enrolled

  const handleEnrollment = async () => {
    if (isEnrolled) {
      navigate(`/course/${id}/structure`)
      return
    }

    setSubmitting(true)
    try {
      const response = await registerLearner(id, {
        learner_id: learnerId
      })
      setLearnerProgress({
        is_enrolled: true,
        registration_id: response.registration_id,
        progress: response.progress ?? 0,
        status: 'in_progress',
        completed_lessons: []
      })
      showToast('Enrollment confirmed! You can now explore the full course structure.', 'success')
      setModalOpen(false)
      navigate(`/course/${id}/structure`)
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setSubmitting(false)
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
        <button type="button" className="btn btn-primary" onClick={() => navigate('/learner/marketplace')}>
          Browse courses
        </button>
      </section>
    )
  }

  const learnerName = userRole === 'learner' ? 'Learner' : null

  return (
    <>
      <CourseOverview
        course={course}
        isEnrolled={isEnrolled}
        onEnrollClick={() => setModalOpen(true)}
        onContinue={() => navigate(`/course/${id}/structure`)}
        showStructureCta={userRole === 'learner'}
      />

      <EnrollModal
        isOpen={isModalOpen}
        learnerName={learnerName}
        onConfirm={handleEnrollment}
        onClose={() => setModalOpen(false)}
        isSubmitting={isSubmitting}
      />
    </>
  )
}

