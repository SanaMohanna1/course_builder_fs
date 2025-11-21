# Postman Example: Other Microservice Making Request to Course Builder

## Overview

**Yes, other microservices CAN make requests with their own `requester_service` value!**

The Course Builder endpoint accepts requests from any microservice. The `requester_service` field identifies **who is making the request**, not which service to route to.

**Important:**
- `requester_service`: Identifies **who is making the request** (e.g., `"content_studio"`, `"learner_ai"`)
- **Routing**: Determined by **payload structure** (internal logic)
- **Response**: Returns the same `requester_service` value you sent

---

## Example 1: Content Studio → Course Builder

### Scenario
Content Studio wants to send trainer course data to Course Builder.

### Request from Content Studio

**Method**: `POST`  
**URL**: `https://coursebuilderfs-production.up.railway.app/api/fill-content-metrics`  
**Headers**: `Content-Type: application/json`

**Body**:
```json
{
  "requester_service": "content_studio",  // ✅ Content Studio identifies itself
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
        "contents": [...]
      }
    ]
  },
  "response": {
    "course": []
  }
}
```

### Expected Response

```json
{
  "requester_service": "content_studio",  // ✅ Same as request
  "payload": {
    // ... same as request
  },
  "response": {
    "course": [
      {
        "course_id": "...",
        "course_name": "...",
        // ... filled course data
      }
    ]
  }
}
```

---

## Example 2: Learner AI → Course Builder

### Scenario
Learner AI wants to trigger course creation in Course Builder.

### Request from Learner AI

**Body**:
```json
{
  "requester_service": "learner_ai",  // ✅ Learner AI identifies itself
  "payload": {
    "user_id": "10000000-0000-0000-0000-000000000001",
    "user_name": "Sarah Levy",
    "company_id": "22222222-2222-2222-2222-222222222222",
    "company_name": "TechLabs",
    "skills": ["react", "hooks", "typescript"],
    "competency_name": "Full-Stack JavaScript Developer"
  },
  "response": {}
}
```

### Expected Response

```json
{
  "requester_service": "learner_ai",  // ✅ Same as request
  "payload": {
    // ... same as request
  },
  "response": {}
}
```

---

## How Routing Works

### Internal Routing Logic

The Course Builder determines which handler to use based on **payload structure**, NOT the `requester_service` field:

| Payload Contains | Routes To |
|------------------|-----------|
| `topics` or `learner_id + skills` | Content Studio Handler |
| `user_id` or `competency_name` | Learner AI Handler |
| `coverage_map` | Assessment Handler |
| `feedback` object | Directory Handler |
| `topic` (string) | Skills Engine Handler |
| `course_type`, `enrollment` | Learning Analytics Handler |
| `totalEnrollments`, `completionRate` | Management Reporting Handler |
| `course_id + learner_id + course_name` | DevLab Handler |
| Has `response` template with fields | Course Builder Handler (AI query) |

**The `requester_service` field is just for identification/tracking purposes!**

---

## Testing in Postman

### Step-by-Step

1. **Open Postman**
2. **Create new request**: POST
3. **Set URL**: `https://coursebuilderfs-production.up.railway.app/api/fill-content-metrics`
4. **Add Headers**: 
   - Key: `Content-Type`
   - Value: `application/json`
5. **Go to Body tab** → Select **raw** → Select **JSON**
6. **Paste request body** with `requester_service` set to any microservice name:
   - `"content_studio"`
   - `"learner_ai"`
   - `"assessment"`
   - `"directory"`
   - etc.
7. **Click Send**

---

## Important Notes

### ✅ What's Allowed:

- **Any microservice name** in `requester_service` field
- The same `requester_service` value is returned in the response
- Routing is automatic based on payload structure

### ❌ What's NOT Allowed:

- Empty `requester_service` (must be a non-empty string)
- Missing `payload` or `response` fields

---

## Real-World Use Cases

### 1. Content Studio → Course Builder
Content Studio sends trainer-created courses to Course Builder for validation and enrichment.

### 2. Learner AI → Course Builder
Learner AI triggers personalized course creation based on learning paths.

### 3. Assessment → Course Builder
Assessment microservice sends assessment results back to Course Builder.

### 4. Directory → Course Builder
Directory microservice sends employee data updates to Course Builder.

---

## Summary

**Question**: Can other microservices use their own `requester_service`?

**Answer**: **YES!** ✅

- Any microservice can set `requester_service` to their own name
- Course Builder accepts any `requester_service` value (non-empty string)
- Routing is determined by payload structure, not `requester_service`
- The same `requester_service` value is returned in the response

