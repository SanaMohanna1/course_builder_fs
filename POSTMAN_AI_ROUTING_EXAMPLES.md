# Postman Examples - AI Routing Logic

## Overview

This guide provides Postman examples for testing the new AI routing logic for `/api/fill-content-metrics` endpoint.

**Base URL**: `https://your-railway-url.railway.app/api/fill-content-metrics`

---

## Key Concepts

### When AI is Used ✅
- **Response template has fields to fill**
- Example: `"response": { "course_name": "", "total_lessons": 0 }`
- Routes to: **Course Builder Handler (AI)**

### When AI is NOT Used ❌
- **Response template is empty** `{}`
- Routes to: **Specialized Handler** (ContentStudio, Assessment, etc.)

---

## Example 1: AI is Used (Course Builder Handler)

### Request

**Method**: `POST`  
**URL**: `https://your-railway-url.railway.app/api/fill-content-metrics`

**Headers**:
```
Content-Type: application/json
```

**Body (raw JSON)**:
```json
{
  "requester_service": "content_studio",
  "payload": {
    "course_id": "d0e1f2a3-b4c5-6789-ef01-890123456789"
  },
  "response": {
    "course_name": "",
    "total_lessons": 0,
    "average_rating": 0
  }
}
```

### Expected Response (200 OK)

```json
{
  "requester_service": "content_studio",
  "payload": {
    "course_id": "d0e1f2a3-b4c5-6789-ef01-890123456789"
  },
  "response": {
    "course_name": "Advanced React Development",
    "total_lessons": 5,
    "average_rating": 4.5
  }
}
```

**What Happens**:
1. ✅ Controller sees response template has fields (`course_name`, `total_lessons`, `average_rating`)
2. ✅ Routes to **Course Builder Handler (AI)**
3. ✅ AI generates SQL query to fetch course data
4. ✅ Executes SQL and fills template
5. ✅ Returns filled response

---

## Example 2: AI is NOT Used (Content Studio Handler)

### Request

**Method**: `POST`  
**URL**: `https://your-railway-url.railway.app/api/fill-content-metrics`

**Headers**:
```
Content-Type: application/json
```

**Body (raw JSON)**:
```json
{
  "requester_service": "content_studio",
  "payload": {
    "course_id": "d0e1f2a3-b4c5-6789-ef01-890123456789",
    "course_name": "Advanced React Development",
    "course_description": "Master advanced React concepts...",
    "trainer_id": "20000000-0000-0000-0000-000000000001",
    "trainer_name": "John Trainer",
    "topics": [
      {
        "topic_name": "React Hooks",
        "topic_description": "Learn React Hooks",
        "skills": ["react", "hooks"],
        "contents": [
          {
            "lesson_name": "useState Hook",
            "lesson_description": "Learn useState",
            "content_type": "text",
            "content_data": {
              "text": "useState is a React hook..."
            },
            "skills": ["react", "hooks"]
          }
        ]
      }
    ]
  },
  "response": {}
}
```

### Expected Response (200 OK)

```json
{
  "requester_service": "content_studio",
  "payload": {
    "course_id": "d0e1f2a3-b4c5-6789-ef01-890123456789",
    "course_name": "Advanced React Development",
    ...
  },
  "response": {
    "course": [
      {
        "course_id": "d0e1f2a3-b4c5-6789-ef01-890123456789",
        "course_name": "Advanced React Development",
        "lessons": [...]
      }
    ]
  }
}
```

**What Happens**:
1. ✅ Controller sees response template is empty `{}`
2. ✅ Checks payload structure - finds `topics` field
3. ✅ Routes to **Content Studio Handler** (specialized handler)
4. ✅ Stores data in database
5. ✅ Returns stored course data (NOT AI-generated)

---

## Example 3: AI is Used (Get Course Statistics)

### Request

**Method**: `POST`  
**URL**: `https://your-railway-url.railway.app/api/fill-content-metrics`

**Headers**:
```
Content-Type: application/json
```

**Body (raw JSON)**:
```json
{
  "requester_service": "learning_analytics",
  "payload": {
    "course_id": "d0e1f2a3-b4c5-6789-ef01-890123456789"
  },
  "response": {
    "total_enrollments": 0,
    "active_enrollments": 0,
    "completion_rate": 0,
    "average_rating": 0
  }
}
```

### Expected Response (200 OK)

```json
{
  "requester_service": "learning_analytics",
  "payload": {
    "course_id": "d0e1f2a3-b4c5-6789-ef01-890123456789"
  },
  "response": {
    "total_enrollments": 25,
    "active_enrollments": 10,
    "completion_rate": 60.0,
    "average_rating": 4.2
  }
}
```

**What Happens**:
1. ✅ Controller sees response template has fields
2. ✅ Routes to **Course Builder Handler (AI)**
3. ✅ AI generates SQL query to aggregate enrollment/feedback data
4. ✅ Executes SQL and fills template
5. ✅ Returns filled response

---

## Example 4: AI is NOT Used (Learner AI - One-Way)

### Request

**Method**: `POST`  
**URL**: `https://your-railway-url.railway.app/api/fill-content-metrics`

**Headers**:
```
Content-Type: application/json
```

**Body (raw JSON)**:
```json
{
  "requester_service": "learner_ai",
  "payload": {
    "user_id": "10000000-0000-0000-0000-000000000001",
    "user_name": "Sarah Learner",
    "company_id": "comp_123",
    "skills": ["react", "hooks", "typescript"],
    "competency_name": "Frontend Development"
  }
}
```

### Expected Response (200 OK)

```json
{
  "requester_service": "learner_ai",
  "payload": {
    "user_id": "10000000-0000-0000-0000-000000000001",
    ...
  },
  "response": {}
}
```

**What Happens**:
1. ✅ Controller sees no response field (defaults to `{}`)
2. ✅ Checks payload structure - finds `user_id` or `competency_name`
3. ✅ Routes to **Learner AI Handler** (specialized handler)
4. ✅ Processes request, creates personalized course
5. ✅ Returns empty response `{}` (one-way communication)

---

## Example 5: AI is NOT Used (Directory - One-Way)

### Request

**Method**: `POST`  
**URL**: `https://your-railway-url.railway.app/api/fill-content-metrics`

**Headers**:
```
Content-Type: application/json
```

**Body (raw JSON)**:
```json
{
  "requester_service": "directory",
  "payload": {
    "feedback": {
      "rating": 5,
      "comment": "Great course!",
      "submitted_at": "2025-01-15T10:30:00Z"
    },
    "course_id": "d0e1f2a3-b4c5-6789-ef01-890123456789",
    "course_name": "Advanced React Development",
    "employee_id": "10000000-0000-0000-0000-000000000001"
  },
  "response": {}
}
```

### Expected Response (200 OK)

```json
{
  "requester_service": "directory",
  "payload": {
    "feedback": {...},
    ...
  },
  "response": {}
}
```

**What Happens**:
1. ✅ Controller sees response template is empty `{}`
2. ✅ Checks payload structure - finds `feedback` object
3. ✅ Routes to **Directory Handler** (specialized handler)
4. ✅ Processes feedback data
5. ✅ Returns empty response `{}` (one-way communication)

---

## Example 6: AI is Used (Custom Metrics)

### Request

**Method**: `POST`  
**URL**: `https://your-railway-url.railway.app/api/fill-content-metrics`

**Headers**:
```
Content-Type: application/json
```

**Body (raw JSON)**:
```json
{
  "requester_service": "custom_service",
  "payload": {
    "course_id": "d0e1f2a3-b4c5-6789-ef01-890123456789",
    "learner_id": "10000000-0000-0000-0000-000000000001"
  },
  "response": {
    "course_name": "",
    "learner_progress": 0,
    "completed_lessons": 0,
    "total_lessons": 0
  }
}
```

### Expected Response (200 OK)

```json
{
  "requester_service": "custom_service",
  "payload": {
    "course_id": "d0e1f2a3-b4c5-6789-ef01-890123456789",
    "learner_id": "10000000-0000-0000-0000-000000000001"
  },
  "response": {
    "course_name": "Advanced React Development",
    "learner_progress": 45,
    "completed_lessons": 3,
    "total_lessons": 7
  }
}
```

**What Happens**:
1. ✅ Controller sees response template has fields
2. ✅ Routes to **Course Builder Handler (AI)** (even though requester_service is "custom_service")
3. ✅ AI generates SQL query to join courses + enrollments + lessons
4. ✅ Executes SQL and fills template
5. ✅ Returns filled response

---

## Example 7: Error - Empty Response + Unknown Payload

### Request

**Method**: `POST`  
**URL**: `https://your-railway-url.railway.app/api/fill-content-metrics`

**Headers**:
```
Content-Type: application/json
```

**Body (raw JSON)**:
```json
{
  "requester_service": "unknown_service",
  "payload": {
    "unknown_field": "value"
  },
  "response": {}
}
```

### Expected Response (400 Bad Request)

```json
{
  "error": "Bad Request",
  "message": "Could not determine target service. Please ensure payload matches a known service pattern, or provide a response template with fields to fill."
}
```

**What Happens**:
1. ✅ Controller sees response template is empty `{}`
2. ✅ Checks payload structure - doesn't match any known pattern
3. ✅ Cannot determine target service
4. ✅ Returns 400 error

---

## Example 8: Error - Missing Required Fields

### Request

**Method**: `POST`  
**URL**: `https://your-railway-url.railway.app/api/fill-content-metrics`

**Headers**:
```
Content-Type: application/json
```

**Body (raw JSON)**:
```json
{
  "requester_service": "content_studio"
}
```

### Expected Response (400 Bad Request)

```json
{
  "error": "Bad Request",
  "message": "Envelope must include \"requester_service\" (string, lowercase with underscores) and \"payload\" (JSON object). \"response\" is optional (can be {} or omitted for one-way communications)."
}
```

**What Happens**:
1. ❌ Missing required `payload` field
2. ✅ Returns 400 error

---

## Quick Reference

### AI is Used When:
- ✅ Response template has at least one field to fill
- Example: `"response": { "course_name": "", "total_lessons": 0 }`

### AI is NOT Used When:
- ❌ Response template is empty `{}`
- ❌ Response field is missing (defaults to `{}`)
- Routes to specialized handler based on payload structure

### Routing Logic:
1. **Check response template**: Has fields? → **Course Builder Handler (AI)**
2. **Check response template**: Empty? → **Check payload structure** → Route to specialized handler

---

## Tips for Testing

1. **Test AI Feature**: Use a response template with fields to fill
2. **Test Specialized Handlers**: Use empty response `{}` and known payload patterns
3. **Check Server Logs**: Look for "AI-powered query generation" messages to confirm AI usage
4. **Test Error Cases**: Try unknown payloads, missing fields, etc.

---

## Environment Variables Needed

For AI to work, ensure `GEMINI_API_KEY` is set in your backend environment:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

Without this key, AI requests will return 500 errors (AI unavailable).

