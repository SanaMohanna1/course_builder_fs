import { useMemo, useState } from 'react'

const normalizeHierarchy = (course) => {
  if (!course) return []

  const topics = Array.isArray(course.topics) ? course.topics : []

  if (topics.length > 0) {
    return topics.map((topic, index) => ({
      id: String(topic.id || topic.topic_id || `topic-${index}`),
      title: topic.title || topic.topic_title || `Topic ${index + 1}`,
      summary: topic.summary || topic.topic_description,
      modules: (topic.modules || []).map((module, moduleIndex) => ({
        id: String(module.id || module.module_id || `module-${moduleIndex}`),
        title: module.title || module.module_name || module.name || `Module ${moduleIndex + 1}`,
        lessons: (module.lessons || []).map((lesson, lessonIndex) => ({
          id: String(lesson.id || lesson.lesson_id || `lesson-${lessonIndex}`),
          title: lesson.title || lesson.lesson_name || `Lesson ${lessonIndex + 1}`,
          duration: lesson.duration || lesson.estimated_duration || 12,
          status: lesson.status || 'locked',
          icon: lesson.icon || 'fa-lightbulb'
        }))
      }))
    }))
  }

  const modules = Array.isArray(course.modules) ? course.modules : []
  return [
    {
      id: 'default-topic',
      title: 'Course modules',
      summary: course.description,
      modules: modules.map((module, moduleIndex) => ({
        id: String(module.id || module.module_id || `module-${moduleIndex}`),
        title: module.title || module.module_name || module.name || `Module ${moduleIndex + 1}`,
        lessons: (module.lessons || []).map((lesson, lessonIndex) => ({
          id: String(lesson.id || lesson.lesson_id || `lesson-${lessonIndex}`),
          title: lesson.title || lesson.lesson_name || `Lesson ${lessonIndex + 1}`,
          duration: lesson.duration || lesson.estimated_duration || 12,
          status: lesson.status || 'locked',
          icon: lesson.icon || 'fa-lightbulb'
        }))
      }))
    }
  ]
}

export default function CourseStructure({
  course,
  onSelectLesson,
  completedLessonIds = [],
  unlocked = false
}) {
  const hierarchy = useMemo(() => normalizeHierarchy(course), [course])
  const [expandedTopics, setExpandedTopics] = useState(() => new Set(hierarchy.map((topic) => topic.id)))
  const [expandedModules, setExpandedModules] = useState(() => new Set())

  const toggleTopic = (topicId) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev)
      if (next.has(topicId)) {
        next.delete(topicId)
      } else {
        next.add(topicId)
      }
      return next
    })
  }

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  const renderLessonStatus = (lessonId, status) => {
    if (completedLessonIds.includes(lessonId)) {
      return (
        <span className="status-chip bg-[rgba(16,185,129,0.18)] text-[#047857]">
          <i className="fa-solid fa-circle-check" aria-hidden="true" />
          Completed
        </span>
      )
    }

    if (unlocked || status === 'unlocked') {
      return (
        <span className="status-chip bg-[rgba(59,130,246,0.15)] text-[#1d4ed8]">
          <i className="fa-solid fa-unlock" aria-hidden="true" />
          Available
        </span>
      )
    }

    return (
      <span className="status-chip bg-[rgba(148,163,184,0.2)] text-[#475569]">
        <i className="fa-solid fa-lock" aria-hidden="true" />
        Locked
      </span>
    )
  }

  if (hierarchy.length === 0) {
    return (
      <div className="course-card text-center text-[var(--text-secondary)]">
        <i className="fa-solid fa-cubes mb-4 text-3xl" aria-hidden="true" />
        <p>No modules have been published for this course yet.</p>
      </div>
    )
  }

  return (
    <div className="stack-lg">
      {hierarchy.map((topic) => (
        <article key={topic.id} className="course-card space-y-5">
          <header
            onClick={() => toggleTopic(topic.id)}
            className="flex flex-col gap-4 cursor-pointer md:flex-row md:items-center md:justify-between"
          >
            <div className="flex flex-col gap-2">
              <span className="tag-chip w-max">
                <i className="fa-solid fa-layer-group" aria-hidden="true" />
                Topic
              </span>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">{topic.title}</h3>
              {topic.summary && (
                <p className="max-w-2xl text-sm text-[var(--text-secondary)]">{topic.summary}</p>
              )}
            </div>
            <button type="button" className="btn btn-secondary w-full md:w-auto">
              <i
                className={`fa-solid ${
                  expandedTopics.has(topic.id) ? 'fa-chevron-up' : 'fa-chevron-down'
                }`}
                aria-hidden="true"
              />
              {expandedTopics.has(topic.id) ? 'Collapse' : 'Expand'}
            </button>
          </header>

          {expandedTopics.has(topic.id) && (
            <div className="stack-md">
              {topic.modules.map((module) => (
                <section key={module.id} className="surface-card soft space-y-4">
                  <header
                    onClick={() => toggleModule(module.id)}
                    className="flex cursor-pointer items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <span className="card-icon h-12 w-12">
                        <i className="fa-solid fa-puzzle-piece" aria-hidden="true" />
                      </span>
                      <div>
                        <h4 className="text-lg font-semibold text-[var(--text-primary)]">
                          {module.title}
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {(module.lessons?.length || 0)} lesson
                          {module.lessons?.length === 1 ? '' : 's'}
                        </p>
                      </div>
                    </div>
                    <i
                      className={`fa-solid ${
                        expandedModules.has(module.id) ? 'fa-minus' : 'fa-plus'
                      } text-[var(--text-secondary)]`}
                      aria-hidden="true"
                    />
                  </header>

                  {expandedModules.has(module.id) && (
                    <ul className="flex flex-col gap-3">
                      {(module.lessons || []).map((lesson) => {
                        const isCompleted = completedLessonIds.includes(lesson.id)
                        const isAccessible = unlocked || lesson.status === 'unlocked' || isCompleted
                        const isLocked = !isAccessible && lesson.status === 'locked'
                        const label = isCompleted
                          ? 'Review'
                          : completedLessonIds.length > 0
                            ? 'Resume'
                            : 'Start'

                        return (
                          <li
                            key={lesson.id}
                            className="flex flex-col gap-4 rounded-2xl border border-[rgba(15,118,110,0.12)] bg-[var(--bg-secondary)] p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                          >
                            <div className="flex items-start gap-4">
                              <span className="card-icon h-10 w-10">
                                <i className={`fa-solid ${lesson.icon}`} aria-hidden="true" />
                              </span>
                              <div>
                                <h5 className="text-base font-semibold text-[var(--text-primary)]">
                                  {lesson.title}
                                </h5>
                                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                                  <i className="fa-solid fa-clock mr-2" aria-hidden="true" />
                                  {lesson.duration} mins · Lesson #{lesson.id.toString().slice(-2)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {renderLessonStatus(lesson.id, lesson.status)}
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => onSelectLesson?.(lesson.id)}
                                disabled={isLocked}
                              >
                                <i className="fa-solid fa-play" aria-hidden="true" />
                                {label}
                              </button>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          )}
        </article>
      ))}

      <footer className="flex flex-col gap-3 border-t border-[rgba(148,163,184,0.18)] pt-6 text-sm text-[var(--text-secondary)] md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="tag-chip bg-[rgba(16,185,129,0.12)] text-[#047857]">
            <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" />
            Adaptive difficulty enabled
          </span>
          <span className="tag-chip bg-[rgba(59,130,246,0.12)] text-[#1d4ed8]">
            <i className="fa-solid fa-robot" aria-hidden="true" />
            AI enrichment active
          </span>
        </div>
        <p>Lessons update dynamically as you progress.</p>
      </footer>
    </div>
  )
}

