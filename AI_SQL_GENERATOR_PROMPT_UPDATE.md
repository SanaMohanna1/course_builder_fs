# AI SQL Generator Prompt Update - Field Name Normalization

## Overview

Updated the AI SQL Generator prompt to interpret and normalize requester field names to the actual Course Builder database schema, rather than using requester field names literally.

---

## Key Changes

### 1. Enhanced Schema Context

**Added comprehensive schema information:**
- ✅ Real table names with actual column types
- ✅ Real relationships between tables
- ✅ Field name normalization rules
- ✅ Common mapping examples

### 2. Field Name Normalization Rules

**The AI now maps requester fields to real Course Builder schema:**

#### Learner Identifiers
- `user_id`, `student_id`, `employee_id`, `user_uuid` → `learner_id` (in feedback/registrations/assessments tables)

#### Enrollment/Registration
- `enrolled`, `enrollment_count`, `total_enrollments` → `COUNT(registrations.learner_id)` WHERE course_id = $1
- `active_enrollments` → `COUNT(registrations.learner_id)` WHERE course_id = $1 AND status = 'in_progress'
- `completed_enrollments` → `COUNT(registrations.learner_id)` WHERE course_id = $1 AND status = 'completed'

#### Instructor/Trainer
- `instructor`, `teacher`, `instructor_id`, `trainer_uuid` → `created_by_user_id` (in courses table) OR `trainer_ids` (in lessons table - array)

#### Ratings/Scores
- `rating`, `score`, `average_rating` → `AVG(feedback.rating)` WHERE course_id = $1
- `rating_value` → `feedback.rating`

#### Lesson Counts
- `lessons_count`, `total_lessons`, `lesson_total` → `COUNT(lessons.id)` WHERE course_id = $1 (join through topics/modules)
- `completed_lessons` → Use registrations table or lesson_completion_dictionary in courses table

#### Course Information
- `course_title`, `title` → `course_name` (in courses table)
- `course_desc`, `description` → `course_description` (in courses table)

---

## Rules Implemented

### ✅ Rule 1: Use ONLY Real Course Builder Tables
- ✅ Never invent table names
- ✅ Never use unknown table names in SQL
- ✅ If uncertain, default to most logical Course Builder table

### ✅ Rule 2: Normalize Field Names
- ✅ DO NOT use requester field names literally
- ✅ INTERPRET requester fields and map to real schema
- ✅ Always map to actual Course Builder columns

### ✅ Rule 3: Handle Unknown Fields
- ✅ If requester asks for something not matching real tables → Infer closest valid field
- ✅ Never create invalid SQL
- ✅ Never guess nonexistent tables

### ✅ Rule 4: Always Generate Valid SQL
- ✅ AI must produce correct SQL for actual schema
- ✅ If table/field doesn't exist → Choose nearest correct match
- ✅ Use proper JOINs through foreign keys

---

## Examples

### Example 1: Normalizing Learner ID

**Requester Payload:**
```json
{
  "user_id": "10000000-0000-0000-0000-000000000001"
}
```

**AI Generates:**
```sql
SELECT ...
FROM courses
JOIN registrations ON registrations.course_id = courses.id
WHERE registrations.learner_id = $1  -- ✅ Normalized: user_id → learner_id
```

**NOT:**
```sql
WHERE user_id = $1  -- ❌ WRONG - user_id doesn't exist
```

---

### Example 2: Normalizing Enrollment Count

**Requester Response Template:**
```json
{
  "enrolled": 0
}
```

**AI Generates:**
```sql
SELECT 
  courses.id,
  courses.course_name,
  COUNT(registrations.learner_id) AS enrolled  -- ✅ Normalized: enrolled → COUNT(registrations.learner_id)
FROM courses
LEFT JOIN registrations ON registrations.course_id = courses.id
WHERE courses.id = $1
GROUP BY courses.id, courses.course_name
```

**NOT:**
```sql
SELECT enrolled FROM enrollments  -- ❌ WRONG - enrollments table doesn't exist
```

---

### Example 3: Normalizing Instructor/Trainer

**Requester Response Template:**
```json
{
  "instructor": ""
}
```

**AI Generates:**
```sql
SELECT 
  courses.id,
  courses.course_name,
  courses.created_by_user_id AS instructor  -- ✅ Normalized: instructor → created_by_user_id
FROM courses
WHERE courses.id = $1
```

**NOT:**
```sql
SELECT instructor FROM instructors  -- ❌ WRONG - instructors table doesn't exist
```

---

### Example 4: Normalizing Lesson Count

**Requester Response Template:**
```json
{
  "lessons_count": 0
}
```

**AI Generates:**
```sql
SELECT 
  courses.id,
  courses.course_name,
  COUNT(lessons.id) AS lessons_count  -- ✅ Normalized: lessons_count → COUNT(lessons.id)
FROM courses
JOIN topics ON topics.course_id = courses.id
JOIN modules ON modules.topic_id = topics.id
JOIN lessons ON lessons.module_id = modules.id
WHERE courses.id = $1
GROUP BY courses.id, courses.course_name
```

**NOT:**
```sql
SELECT lessons_count FROM course_stats  -- ❌ WRONG - course_stats table doesn't exist
```

---

## Updated Prompt Structure

### Before (Old Prompt)
```
- Use only the fields provided in the payload + the Course Builder DB schema
- Do not invent fields or tables
```

### After (New Prompt)
```
CRITICAL RULES:
1. USE ONLY REAL COURSE BUILDER TABLES AND COLUMNS
2. FIELD NAME NORMALIZATION (MANDATORY)
   - DO NOT use requester field names literally
   - INTERPRET requester fields and map them to real Course Builder schema
3. IF REQUESTER USES DIFFERENT FIELD NAMES:
   - Normalize them using the mapping rules
   - NEVER create invalid SQL with unknown tables/columns
4. ALWAYS GENERATE VALID SQL
   - Use ONLY tables that exist in the schema
   - Use ONLY columns that exist in those tables
```

---

## Benefits

1. ✅ **Intelligent Field Mapping**: AI understands different field name conventions
2. ✅ **Valid SQL Generation**: Never creates SQL with non-existent tables/columns
3. ✅ **Flexibility**: Accepts various field names from different microservices
4. ✅ **Accuracy**: Always generates SQL that works with actual Course Builder schema
5. ✅ **Safety**: Prevents SQL errors from invalid table/column names

---

## Testing

### Test 1: Normalize user_id to learner_id

**Request:**
```json
{
  "requester_service": "custom_service",
  "payload": {
    "course_id": "abc123",
    "user_id": "user123"  -- Different field name
  },
  "response": {
    "course_name": "",
    "learner_progress": 0
  }
}
```

**Expected SQL:**
```sql
SELECT 
  courses.course_name,
  registrations.status AS learner_progress
FROM courses
JOIN registrations ON registrations.course_id = courses.id
WHERE courses.id = $1 AND registrations.learner_id = $2  -- ✅ Normalized user_id → learner_id
```

---

### Test 2: Normalize enrolled to COUNT(registrations)

**Request:**
```json
{
  "payload": {
    "course_id": "abc123"
  },
  "response": {
    "enrolled": 0  -- Different field name
  }
}
```

**Expected SQL:**
```sql
SELECT 
  COUNT(registrations.learner_id) AS enrolled  -- ✅ Normalized enrolled → COUNT(registrations.learner_id)
FROM courses
LEFT JOIN registrations ON registrations.course_id = courses.id
WHERE courses.id = $1
GROUP BY courses.id
```

---

## Summary

✅ **AI now interprets requester fields** instead of using them literally  
✅ **Field name normalization** maps common variations to real schema  
✅ **Always generates valid SQL** using only real tables and columns  
✅ **Never invents tables** or uses unknown column names  
✅ **Smart mapping** chooses closest valid field when uncertain

The AI SQL Generator is now more intelligent and flexible while maintaining strict adherence to the actual Course Builder database schema.

