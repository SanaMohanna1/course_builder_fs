import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import Header from './components/Header.jsx'
import AccessibilityControls from './components/AccessibilityControls.jsx'
import ChatbotWidget from './components/ChatbotWidget.jsx'
import Toast from './components/Toast.jsx'
import CoursesPage from './pages/CoursesPage.jsx'
import CourseDetailsPage from './pages/CourseDetailsPage.jsx'
import CourseStructurePage from './pages/CourseStructurePage.jsx'
import LessonPage from './pages/LessonPage.jsx'
import TrainerDashboard from './pages/TrainerDashboard.jsx'
import FeedbackPage from './pages/FeedbackPage.jsx'
import LearnerDashboard from './pages/LearnerDashboard.jsx'
import LearnerForYou from './pages/LearnerForYou.jsx'
import LearnerLibrary from './pages/LearnerLibrary.jsx'
import LearnerMarketplace from './pages/LearnerMarketplace.jsx'
import AssessmentPage from './pages/AssessmentPage.jsx'
import TrainerCourseValidation from './pages/TrainerCourseValidation.jsx'
import TrainerPublish from './pages/TrainerPublish.jsx'
import TrainerFeedbackAnalytics from './pages/TrainerFeedbackAnalytics.jsx'
import TrainerCourses from './pages/TrainerCourses.jsx'
import { useRole } from './hooks/useRole.js'

const PARTICLE_CONFIG = Array.from({ length: 24 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  animationDelay: `${index * 0.65}s`,
  animationDuration: `${18 + (index % 12)}s`
}))

function LegacyCourseRedirect() {
  const { id } = useParams()
  return <Navigate to={`/course/${id}/overview`} replace />
}

function LegacyLessonRedirect() {
  return <Navigate to="/courses" replace />
}

function AppShell() {
  const { userRole } = useRole()
  const isLearner = userRole === 'learner'

  return (
    <div className="app-surface" data-testid="app-root">
      <div className="bg-animation" />
      <div className="particles">
        {PARTICLE_CONFIG.map((particle, idx) => (
          <span
            key={idx}
            className="particle"
            style={{
              left: particle.left,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration
            }}
          />
        ))}
      </div>

      <a href="#main" className="skip-link">Skip to main content</a>
      <Header />

      <main id="main" className="app-main">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isLearner ? '/learner/dashboard' : '/trainer/dashboard'} replace />}
          />

          {/* Shared */}
          <Route path="/course/:id/overview" element={<CourseDetailsPage />} />
          <Route path="/course/:id/structure" element={<CourseStructurePage />} />
          <Route path="/course/:id/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/courses/:id" element={<LegacyCourseRedirect />} />
          <Route path="/lessons/:id" element={<LegacyLessonRedirect />} />
          <Route path="/course/:id/assessment" element={<AssessmentPage />} />
          <Route path="/feedback/:courseId" element={<FeedbackPage />} />
          <Route path="/course/:id/feedback" element={<FeedbackPage />} />

          {/* Learner Routes */}
          {isLearner && (
            <>
              <Route path="/learner/dashboard" element={<LearnerDashboard />} />
              <Route path="/learner/marketplace" element={<LearnerMarketplace />} />
              <Route path="/learner/personalized" element={<LearnerForYou />} />
              <Route path="/learner/enrolled" element={<LearnerLibrary />} />
              <Route path="/learner/for-you" element={<Navigate to="/learner/personalized" replace />} />
              <Route path="/learner/library" element={<Navigate to="/learner/enrolled" replace />} />
              <Route path="/courses" element={<CoursesPage />} />
            </>
          )}

          {/* Trainer Routes */}
          {!isLearner && (
            <>
              <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
              <Route path="/trainer/courses" element={<TrainerCourses />} />
              <Route path="/trainer/course/:id" element={<TrainerCourseValidation />} />
              <Route path="/trainer/publish/:id" element={<TrainerPublish />} />
              <Route path="/trainer/feedback/:id" element={<TrainerFeedbackAnalytics />} />
            </>
          )}

          <Route
            path="*"
            element={<Navigate to={isLearner ? '/learner/dashboard' : '/trainer/dashboard'} replace />}
          />
        </Routes>
      </main>

      <AccessibilityControls />
      <ChatbotWidget />
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
