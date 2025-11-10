# Customization Log

## 2025-11-10 – Enrollment UX + Header Polish
- Enabled backend fallback headers (`X-User-Role`, `X-User-Id`, `X-User-Name`) so enrollment and publishing work without JWT tokens during local/Supabase environments.
- Simplified the application header: larger emerald logo focus, removed persona name/avatars for a cleaner professional navigation.
- Added request interceptor in `frontend/src/services/apiService.js` to attach the active role profile to every API call, keeping role-based routes functional without exposing personal data in the UI.

## 2025-11-10 – Softer Layout Geometry
- Introduced shared radius tokens and diffused shadow presets in `frontend/src/styles/index.css` to keep shapes consistent while maintaining existing colors/typography.
- Rounded key surfaces (`section-panel`, `course-card`, `dashboard-card`, `stage-button`, buttons, modals) with the new radii and softened card hover states for a calmer visual rhythm.
- Updated role controls and gamification widgets to adopt the softer geometry so the entire learner/trainer experience feels easier on the eyes.

