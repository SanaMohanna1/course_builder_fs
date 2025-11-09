import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCourses, publishCourse } from '../services/apiService.js'
import Toast from '../components/Toast.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { useApp } from '../context/AppContext'

export default function TrainerDashboard() {
  const { showToast } = useApp()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setLoading(true)
    try {
      const data = await getCourses({ limit: 50 })
      setCourses(data.courses || [])
    } catch (err) {
      showToast('Failed to load courses', 'error')
    } finally {
      setLoading(false)
    }
  }

  const onPublish = async (courseId) => {
    if (!window.confirm('Publish this course to the marketplace?')) return
    setPublishing(true)
    try {
      await publishCourse(courseId)
      showToast('Course published successfully!', 'success')
      loadCourses()
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to publish course'
      showToast(errorMsg, 'error')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <header className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-200">Trainer Mode</p>
            <h1 className="text-3xl font-bold md:text-4xl">Validate and manage your course portfolio</h1>
            <p className="text-sm text-slate-200 md:text-base">
              Review drafts, publish updates, and monitor learner engagement from this workspace.
            </p>
          </div>
        </div>
      </header>

      <section className="rounded-3xl bg-white/90 p-8 shadow-lg ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-slate-800">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              Active Courses
            </p>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              My course portfolio ({courses.length})
            </h2>
          </div>
          <Link
            to="/trainer/courses"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            View lifecycle workspace <i className="fa-solid fa-arrow-right text-xs" />
          </Link>
        </header>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <LoadingSpinner message="Syncing courses..." />
          </div>
        ) : courses.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <i className="fa-solid fa-layer-group text-4xl text-emerald-500" />
            <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100">
              No assigned courses yet
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              Your course workspace will appear here once content is provisioned for you.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {courses.map(course => (
              <div
                key={course.id || course.course_id}
                className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-800/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900/60 dark:text-slate-300">
                      {course.level || 'beginner'}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-slate-800 dark:text-slate-100">
                      {course.title || course.course_name}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-slate-500 dark:text-slate-300">
                      {course.description || course.course_description || 'No description yet.'}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    (course.status || 'draft') === 'live'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                      : (course.status || 'draft') === 'archived'
                        ? 'bg-slate-400/10 text-slate-500'
                        : 'bg-amber-400/10 text-amber-600'
                  }`}>
                    <i className="fa-solid fa-circle text-[8px]" />
                    {course.status || 'draft'}
                  </span>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {course.status !== 'live' && (
                    <button
                      type="button"
                      onClick={() => onPublish(course.id || course.course_id)}
                      disabled={publishing}
                      className="group inline-flex items-center justify-between rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-600 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-300"
                    >
                      Publish <i className="fa-solid fa-paper-plane text-slate-400 group-hover:translate-x-1" />
                    </button>
                  )}
                  <Link
                    to={`/trainer/course/${course.id || course.course_id}`}
                    className="group inline-flex items-center justify-between rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-300"
                  >
                    Review & validate <i className="fa-solid fa-pen-to-square text-slate-400 group-hover:translate-x-1" />
                  </Link>
                  {course.status === 'live' && (
                    <Link
                      to={`/trainer/feedback/${course.id || course.course_id}`}
                      className="group inline-flex items-center justify-between rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 dark:border-slate-700 dark:bg-slate-800 dark:text-rose-300"
                    >
                      Analytics <i className="fa-solid fa-chart-line text-slate-400 group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Toast />
    </div>
  )
}
