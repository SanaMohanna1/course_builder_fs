import { useMemo, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Container from '../components/Container.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import {
  submitFeedback,
  getCourseById,
  getFeedback,
  getMyFeedback,
  updateFeedback,
  deleteFeedback
} from '../services/apiService.js'
import { useApp } from '../context/AppContext'

export default function FeedbackPage() {
  const { courseId, id } = useParams()
  const actualCourseId = courseId || id
  const navigate = useNavigate()
  const { showToast, userProfile, userRole } = useApp()

  const [course, setCourse] = useState(null)
  const [communityStats, setCommunityStats] = useState(null)
  const [existingFeedback, setExistingFeedback] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [tags, setTags] = useState([])

  const [pageLoading, setPageLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)

  const tagOptions = useMemo(() => ['Clarity', 'Usefulness', 'Difficulty', 'Engagement', 'Pacing'], [])

  useEffect(() => {
    let isMounted = true

    const bootstrap = async () => {
      setPageLoading(true)
      try {
        const [courseData, learnerFeedback, aggregated] = await Promise.all([
          getCourseById(actualCourseId).catch(() => null),
          getMyFeedback(actualCourseId).catch(() => null),
          getFeedback(actualCourseId).catch(() => null)
        ])

        if (!isMounted) return

        if (courseData) {
          setCourse(courseData)
        }

        if (aggregated && aggregated.average_rating) {
          setCommunityStats(aggregated)
        } else {
          setCommunityStats(null)
        }

        if (learnerFeedback) {
          setExistingFeedback(learnerFeedback)
          setRating(Number(learnerFeedback.rating) || 5)
          setComment(learnerFeedback.comment || '')
          setTags(Array.isArray(learnerFeedback.tags) ? learnerFeedback.tags : [])
          setIsEditing(false)
        } else {
          setExistingFeedback(null)
          setRating(5)
          setComment('')
          setTags([])
          setIsEditing(true)
        }
      } catch (error) {
        if (isMounted) {
          showToast('Unable to load feedback details. Please try again later.', 'error')
        }
      } finally {
        if (isMounted) {
          setPageLoading(false)
        }
      }
    }

    bootstrap()

    return () => {
      isMounted = false
    }
  }, [actualCourseId, showToast, tagOptions])

  const toggleTag = (tag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const startEdit = () => {
    if (existingFeedback) {
      setRating(Number(existingFeedback.rating) || 5)
      setComment(existingFeedback.comment || '')
      setTags(Array.isArray(existingFeedback.tags) ? existingFeedback.tags : [])
    }
    setIsEditing(true)
  }

  const cancelEdit = () => {
    if (existingFeedback) {
      setRating(Number(existingFeedback.rating) || 5)
      setComment(existingFeedback.comment || '')
      setTags(Array.isArray(existingFeedback.tags) ? existingFeedback.tags : [])
      setIsEditing(false)
    } else {
      navigate(`/course/${actualCourseId}/overview`)
    }
  }

  const handleDelete = async () => {
    setFormLoading(true)
    try {
      await deleteFeedback(actualCourseId)
      showToast('Feedback removed. You can submit a new response anytime.', 'success')
      setExistingFeedback(null)
      setRating(5)
      setComment('')
      setTags([])
      setIsEditing(true)
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to delete feedback'
      showToast(message, 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const numericRating = Number(rating)
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      showToast('Rating must be between 1 and 5.', 'error')
      return
    }

    const learnerId = userRole === 'learner' ? userProfile?.id : null
    if (!learnerId) {
      showToast('Switch to the learner workspace to share feedback.', 'info')
      return
    }

    setFormLoading(true)

    try {
      if (existingFeedback) {
        if (!isEditing) {
          showToast('Feedback already submitted. Edit or delete it to make changes.', 'info')
          return
        }

        await updateFeedback(actualCourseId, {
          rating: numericRating,
          tags: tags.length > 0 ? tags : ['General'],
          comment: comment.trim()
        })
        showToast('Feedback updated successfully!', 'success')
      } else {
        await submitFeedback(actualCourseId, {
          learner_id: learnerId,
          learner_name: userProfile?.name,
          rating: numericRating,
          tags: tags.length > 0 ? tags : ['General'],
          comment: comment.trim()
        })
        showToast('Feedback submitted successfully! Thank you!', 'success')
      }

      navigate(`/course/${actualCourseId}/overview`, { replace: true })
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to submit feedback'
      showToast(message, 'error')
    } finally {
      setFormLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="page-surface">
        <Container>
          <div className="surface-card soft flex min-h-[60vh] items-center justify-center">
            <LoadingSpinner message="Preparing feedback workspace..." />
          </div>
        </Container>
      </div>
    )
  }

  const hasExistingFeedback = Boolean(existingFeedback)
  const readonlyView = hasExistingFeedback && !isEditing

  return (
    <div className="page-surface">
      <Container>
        <div className="stack-lg">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary-cyan)]">
            <Link to={`/course/${actualCourseId}/overview`} className="inline-flex items-center gap-2 hover:underline">
              <i className="fas fa-arrow-left" aria-hidden="true" />
              Back to course
            </Link>
          </div>

          {course && (
            <header className="space-y-2">
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">Course feedback</h1>
              <p className="text-sm font-medium uppercase tracking-[0.4em] text-[var(--primary-cyan)]">Share your experience</p>
              <p className="text-base text-[var(--text-secondary)]">{course.title || course.course_name}</p>
            </header>
          )}

          {communityStats && (
            <section className="surface-card soft space-y-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Community insights</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white/90 p-4 text-center shadow-sm backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Average rating</p>
                  <p className="mt-2 text-3xl font-bold text-[var(--primary-cyan)]">
                    {communityStats.average_rating?.toFixed(1) ?? '—'}
                  </p>
                  <p className="text-sm text-[#FACC15]">{'★'.repeat(Math.round(communityStats.average_rating || 0))}</p>
                </div>
                <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white/90 p-4 text-center shadow-sm backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Responses</p>
                  <p className="mt-2 text-3xl font-bold text-[var(--primary-cyan)]">
                    {communityStats.total_ratings?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">Learners contributing feedback</p>
                </div>
                <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white/90 p-4 text-center shadow-sm backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Top theme</p>
                  <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
                    {communityStats.top_tag || 'Personalised learning'}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">Most cited by your peers</p>
                </div>
              </div>
            </section>
          )}

          {readonlyView ? (
            <section className="surface-card soft space-y-5">
              <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">You already shared feedback</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Update or remove your response below.</p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
                  <span className="text-lg font-bold text-[var(--primary-cyan)]">{Number(existingFeedback.rating).toFixed(1)}</span>
                  <span className="text-sm text-[#FACC15]">{'★'.repeat(Math.round(existingFeedback.rating))}</span>
                </div>
              </header>

              {existingFeedback.comment && (
                <p className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white/80 p-4 text-sm text-[var(--text-secondary)] shadow-sm backdrop-blur">
                  {existingFeedback.comment}
                </p>
              )}

              {existingFeedback.tags && existingFeedback.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {existingFeedback.tags.map((tag) => (
                    <span key={tag} className="status-chip bg-[rgba(16,185,129,0.12)] text-[#047857]">
                      <i className="fa-solid fa-tag" aria-hidden="true" /> {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="primary" onClick={startEdit}>
                  <i className="fa-solid fa-pen-to-square" aria-hidden="true" /> Edit feedback
                </Button>
                <Button type="button" variant="secondary" onClick={handleDelete} disabled={formLoading}>
                  <i className="fa-solid fa-trash" aria-hidden="true" /> Delete feedback
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate(`/course/${actualCourseId}/overview`)}>
                  Back to course
                </Button>
              </div>
            </section>
          ) : (
            <form onSubmit={handleSubmit} className="surface-card space-y-8">
              <div className="space-y-3">
                <label className="block text-sm font-semibold uppercase tracking-[0.4em] text-[var(--primary-cyan)]">
                  Rating <span className="text-xs font-normal text-[var(--text-muted)]">(1-5)</span>
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="flex-1 min-w-[200px]"
                  />
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[var(--primary-cyan)]">{rating}</span>
                    <span className="text-xl text-[#FACC15]">{'★'.repeat(Number(rating))}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-[0.4em] text-[var(--text-muted)]">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold uppercase tracking-[0.25em] text-[var(--text-primary)]">
                  What stood out? <span className="text-xs font-normal text-[var(--text-muted)]">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => {
                    const active = tags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                          active
                            ? 'bg-[var(--primary-cyan)] text-white shadow-sm'
                            : 'border border-[rgba(148,163,184,0.35)] bg-white/90 text-[var(--text-primary)] hover:border-[var(--primary-cyan)]'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold uppercase tracking-[0.25em] text-[var(--text-primary)]">
                  Additional comments <span className="text-xs font-normal text-[var(--text-muted)]">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="6"
                  placeholder="Share your thoughts about this course..."
                  className="w-full rounded-2xl border border-[rgba(148,163,184,0.35)] bg-white/90 p-4 text-sm text-[var(--text-primary)] shadow-sm backdrop-blur focus:border-[var(--primary-cyan)] focus:outline-none focus:ring-2 focus:ring-[rgba(14,165,233,0.25)]"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="primary" disabled={formLoading} style={{ minWidth: '160px' }}>
                  {formLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin" aria-hidden="true" /> Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane" aria-hidden="true" /> {hasExistingFeedback ? 'Update feedback' : 'Submit feedback'}
                    </>
                  )}
                </Button>
                {hasExistingFeedback && (
                  <Button type="button" variant="secondary" onClick={cancelEdit} disabled={formLoading}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </Container>
    </div>
  )
}