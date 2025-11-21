# Location: Trainer Course One-Way Communication

## Current Behavior (WRONG)

When Content Studio sends a **trainer course**, the handler currently returns course data in the response.

## Required Behavior (CORRECT)

When Content Studio sends a **trainer course**, Course Builder should:
1. ✅ Process and store the course data
2. ✅ Return **empty response** `{}` (one-way communication)

When Content Studio sends a **learner course**, Course Builder should:
1. ✅ Process and store the course data
2. ✅ Return **course data** in response (two-way communication)

---

## File Location

**File**: `backend/integration/handlers/contentStudioHandler.js`

### Current Code (Lines 93-122)

```javascript
// Fill response template with course data only
// Response should only contain course array, not topics or learner fields
// Clean up response template to only include course field

// Build course object from created course and lessons
const courseData = {
  course_id: course.id,
  course_name: course.course_name,
  course_description: course.course_description,
  course_type: course.course_type,
  status: course.status,
  level: course.level,
  duration_hours: course.duration_hours,
  created_by_user_id: course.created_by_user_id,
  // Add lessons structure
  lessons: createdLessons.map(lesson => ({
    lesson_id: lesson.id,
    lesson_name: lesson.lesson_name,
    lesson_description: lesson.lesson_description,
    skills: lesson.skills,
    content_type: lesson.content_type,
    content_data: lesson.content_data,
    devlab_exercises: lesson.devlab_exercises
  }))
};

// Return only course field (remove any topics, learner_id, learner_name, learner_company if present)
return {
  course: [courseData]  // ❌ Currently returns course data for BOTH trainer and learner courses
};
```

### Where Trainer Course is Detected (Line 26)

```javascript
// Determine if trainer or learner course
const isTrainerCourse = !!normalized.trainer_id;  // ✅ This variable knows if it's a trainer course
```

---

## What Needs to Change

**Location**: `backend/integration/handlers/contentStudioHandler.js`

**Lines to modify**: **Lines 93-122**

**Change needed**:

```javascript
// After line 91 (after creating lessons), add this check:

// If trainer course: return empty response (one-way communication)
if (isTrainerCourse) {
  return {};  // ✅ Empty response for trainer courses
}

// If learner course: return course data (two-way communication)
// Build course object from created course and lessons
const courseData = {
  course_id: course.id,
  course_name: course.course_name,
  // ... rest of course data
};

return {
  course: [courseData]  // ✅ Return course data only for learner courses
};
```

---

## Summary

- **File**: `backend/integration/handlers/contentStudioHandler.js`
- **Line 26**: `isTrainerCourse` variable determines if it's a trainer course
- **Lines 93-122**: Currently returns course data for both trainer and learner courses
- **Fix needed**: Add check for `isTrainerCourse` and return `{}` for trainer courses, return course data only for learner courses

