import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../services/apiService.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { useApp } from '../context/AppContext'
import { getContextualErrorMessage } from '../utils/errorHandler.js'
import Container from '../components/Container.jsx'
import CourseCard from '../components/CourseCard.jsx'
import { filterMarketplaceCourses } from '../utils/courseTypeUtils.js'

export default function CoursesPage() {
  const { showToast } = useApp()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    level: '',
    sort: 'rating',
    page: 1,
    limit: 12
  })
  const [total, setTotal] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCourses()
  }, [filters])

  const loadCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCourses(filters)
      const allCourses = data.courses || []
      
      // Filter: Only show marketplace courses
      // Excludes ALL personalized courses (they never appear in general course listing)
      const marketplaceCourses = filterMarketplaceCourses(allCourses)
      
      setCourses(marketplaceCourses)
      setTotal(marketplaceCourses.length)
    } catch (err) {
      const errorMsg = getContextualErrorMessage(err, {
        network: 'Unable to connect. Please check your internet connection.',
        default: 'Failed to load courses'
      })
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const paginationTotal = Math.ceil(total / filters.limit)

  if (loading && courses.length === 0) {
    return (
      <div className="page-surface">
        <Container>
          <div className="surface-card soft flex min-h-[320px] items-center justify-center">
            <LoadingSpinner message="Loading catalogue..." />
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="page-surface">
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <p className="subtitle">Course catalogue</p>
            <h1>Browse curated learning experiences</h1>
            <p className="subtitle">
              Filter by level, sort by popularity, and explore expert-designed programmes across the
              emerald learning ecosystem.
            </p>
            <div className="hero-actions">
              <Link to="/learner/personalized" className="btn btn-primary">
                See personalised picks
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Container>
        <div className="stack-lg">
          <section className="surface-card soft space-y-6">
            <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="relative">
                <i
                  className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(event) => handleFilterChange('search', event.target.value)}
                  placeholder="Search courses..."
                  className="w-full rounded-[var(--radius-lg)] border border-[rgba(148,163,184,0.35)] bg-transparent py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] shadow-sm focus:border-[var(--primary-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-cyan)]/20"
                />
              </div>
              <select
                value={filters.level}
                onChange={(event) => handleFilterChange('level', event.target.value)}
                className="w-full rounded-[var(--radius-lg)] border border-[rgba(148,163,184,0.35)] bg-transparent px-4 py-3 text-sm text-[var(--text-primary)] shadow-sm focus:border-[var(--primary-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-cyan)]/20"
              >
                <option value="">All levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select
                value={filters.sort}
                onChange={(event) => handleFilterChange('sort', event.target.value)}
                className="w-full rounded-[var(--radius-lg)] border border-[rgba(148,163,184,0.35)] bg-transparent px-4 py-3 text-sm text-[var(--text-primary)] shadow-sm focus:border-[var(--primary-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-cyan)]/20"
              >
                <option value="rating">Highest rated</option>
                <option value="newest">Newest first</option>
                <option value="popular">Most popular</option>
              </select>
            </form>
            <p className="text-sm text-[var(--text-muted)]">
              {error ? error : `Found ${total} course${total === 1 ? '' : 's'}`}
            </p>
          </section>

          {courses.length === 0 && !loading ? (
            <section className="surface-card soft text-center">
              <i className="fas fa-book-open text-3xl text-[var(--primary-cyan)]" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">
                No courses match your filters
              </h2>
              <p className="mt-2 text-[var(--text-muted)]">
                Try adjusting the level or keyword search to explore more options.
              </p>
            </section>
          ) : (
            <section className="surface-card space-y-6">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard key={course.id || course.course_id} course={course} />
                ))}
              </div>
            </section>
          )}

          {paginationTotal > 1 && (
            <section className="surface-card soft flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-[var(--text-primary)]">
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={filters.page === 1}
                className="btn btn-secondary"
              >
                <i className="fas fa-chevron-left" aria-hidden="true" /> Previous
              </button>
              <span>
                Page {filters.page} of {paginationTotal}
              </span>
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={filters.page >= paginationTotal}
                className="btn btn-secondary"
              >
                Next <i className="fas fa-chevron-right" aria-hidden="true" />
              </button>
            </section>
          )}
        </div>
      </Container>
    </div>
  )
}
