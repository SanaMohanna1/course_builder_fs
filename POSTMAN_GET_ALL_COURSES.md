# Postman Guide: Get All Courses

This guide shows you how to get all courses using Postman with the `GET /api/v1/courses` endpoint.

## 🚀 Quick Start

**Railway URL Format:**
```
GET https://YOUR_RAILWAY_URL/api/v1/courses
```

**Replace `YOUR_RAILWAY_URL` with your actual Railway deployment URL:**
- Example: `https://course-builder-production.railway.app`
- Example: `https://your-app-name.up.railway.app`

**Full Example:**
```
GET https://course-builder-production.railway.app/api/v1/courses
```

## 📋 Prerequisites

1. **Postman installed** (download from https://www.postman.com/downloads/)
2. **Backend deployed on Railway**: Your backend should be deployed and accessible via Railway URL
3. **Database seeded**: Make sure you have courses in your database

**Note**: Replace `YOUR_RAILWAY_URL` in the examples below with your actual Railway deployment URL (e.g., `https://course-builder-production.railway.app` or `https://your-app-name.up.railway.app`)

## 🚀 Quick Setup (Step-by-Step)

### Step 1: Create a New GET Request

1. Open Postman
2. Click **"New"** button (top left) or click **"+"** tab
3. Select **"HTTP Request"**

### Step 2: Set Request Method and URL

1. **Method**: Select `GET` from the dropdown (left of URL bar)
2. **URL**: Enter `https://YOUR_RAILWAY_URL/api/v1/courses`

**Full URL (Replace YOUR_RAILWAY_URL with your actual Railway URL):**
```
GET https://YOUR_RAILWAY_URL/api/v1/courses
```

**Example Railway URLs:**
- `https://course-builder-production.railway.app/api/v1/courses`
- `https://your-app-name.up.railway.app/api/v1/courses`
- `https://course-builder-backend.railway.app/api/v1/courses`

**For Local Development:**
If you want to test locally, use: `http://localhost:3000/api/v1/courses`

### Step 3: Add Headers (Optional)

Click on the **"Headers"** tab and add these headers if needed:

| Key | Value | Required | Description |
|-----|-------|----------|-------------|
| `Content-Type` | `application/json` | No | Content type |
| `x-user-role` | `learner` or `trainer` or `admin` | No | User role (affects which courses are visible) |
| `x-user-id` | `your-user-id` | No | User ID for filtering |

**Note**: Headers are optional. The endpoint works without them, but some features (like role-based filtering) require them.

### Step 4: Add Query Parameters (Optional)

Click on the **"Params"** tab to add query parameters for filtering:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search in course name/description | `javascript` |
| `category` | string | Filter by category | `programming` |
| `level` | string | Filter by level: `beginner`, `intermediate`, `advanced` | `beginner` |
| `sort` | string | Sort order: `newest`, `oldest`, `name` | `newest` |
| `page` | number | Page number (default: 1) | `1` |
| `limit` | number | Items per page (default: 10) | `10` |

**Example URL with parameters:**
```
GET https://YOUR_RAILWAY_URL/api/v1/courses?search=javascript&level=beginner&page=1&limit=10
```

**Local Development:**
```
GET http://localhost:3000/api/v1/courses?search=javascript&level=beginner&page=1&limit=10
```

### Step 5: Send Request

1. Click the blue **"Send"** button (top right)
2. Wait for the response

## 📝 Example Requests

### Example 1: Get All Courses (Basic)

**Request (Railway):**
```
GET https://YOUR_RAILWAY_URL/api/v1/courses
```

**Request (Local):**
```
GET http://localhost:3000/api/v1/courses
```

**Headers:** None required

**Response (200 OK):**
```json
{
  "courses": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "course_name": "Introduction to JavaScript",
      "course_description": "Learn the fundamentals of JavaScript",
      "course_type": "trainer",
      "status": "active",
      "level": "beginner",
      "duration_hours": 20,
      "created_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": "22222222-2222-2222-2222-222222222222",
      "course_name": "Advanced React",
      "course_description": "Master React hooks and advanced patterns",
      "course_type": "trainer",
      "status": "active",
      "level": "advanced",
      "duration_hours": 30,
      "created_at": "2024-01-20T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

### Example 2: Search Courses

**Request (Railway):**
```
GET https://YOUR_RAILWAY_URL/api/v1/courses?search=javascript
```

**Request (Local):**
```
GET http://localhost:3000/api/v1/courses?search=javascript
```

**Query Params:**
- `search`: `javascript`

**Response (200 OK):**
```json
{
  "courses": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "course_name": "Introduction to JavaScript",
      "course_description": "Learn the fundamentals of JavaScript",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Example 3: Filter by Level

**Request (Railway):**
```
GET https://YOUR_RAILWAY_URL/api/v1/courses?level=beginner
```

**Request (Local):**
```
GET http://localhost:3000/api/v1/courses?level=beginner
```

**Query Params:**
- `level`: `beginner`

### Example 4: Pagination

**Request (Railway):**
```
GET https://YOUR_RAILWAY_URL/api/v1/courses?page=2&limit=5
```

**Request (Local):**
```
GET http://localhost:3000/api/v1/courses?page=2&limit=5
```

**Query Params:**
- `page`: `2`
- `limit`: `5`

### Example 5: With Role Header (Filtered by Role)

**Request (Railway):**
```
GET https://YOUR_RAILWAY_URL/api/v1/courses
```

**Request (Local):**
```
GET http://localhost:3000/api/v1/courses
```

**Headers:**
- `x-user-role`: `learner`

**Response:** Courses filtered based on learner's role (e.g., only published courses visible to learners)

## 🎯 Common Query Parameter Combinations

### Get beginner courses sorted by newest (Railway):
```
GET https://YOUR_RAILWAY_URL/api/v1/courses?level=beginner&sort=newest
```

### Search and filter (Railway):
```
GET https://YOUR_RAILWAY_URL/api/v1/courses?search=react&level=intermediate
```

### Paginated results (Railway):
```
GET https://YOUR_RAILWAY_URL/api/v1/courses?page=1&limit=20&sort=newest
```

**For Local Development**, replace `https://YOUR_RAILWAY_URL` with `http://localhost:3000`

## 🔍 Response Structure

The response always includes:

```json
{
  "courses": [...],  // Array of course objects
  "pagination": {
    "page": 1,        // Current page number
    "limit": 10,      // Items per page
    "total": 50,      // Total number of courses
    "totalPages": 5   // Total number of pages
  }
}
```

## 🚨 Error Responses

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Route GET /api/v1/courses/undefined not found"
}
```
**Cause:** Invalid endpoint URL

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Database connection error"
}
```
**Cause:** Database connection issue

## 💡 Tips

1. **No Authentication Required**: This endpoint doesn't require authentication, but role-based filtering works with headers.

2. **Default Values**: 
   - `sort`: `newest` (default)
   - `page`: `1` (default)
   - `limit`: `10` (default)

3. **Empty Results**: If no courses match your filters, you'll get an empty array:
   ```json
   {
     "courses": [],
     "pagination": {
       "page": 1,
       "limit": 10,
       "total": 0,
       "totalPages": 0
     }
   }
   ```

4. **Railway URL**: 
   - Find your Railway URL in your Railway project dashboard
   - It should look like: `https://your-app-name.railway.app` or `https://your-app-name.up.railway.app`
   - Railway provides HTTPS by default, so always use `https://` (not `http://`)
   - Example: `https://course-builder-production.railway.app/api/v1/courses`
   
5. **Finding Your Railway URL**:
   - Go to your Railway project dashboard
   - Click on your service/deployment
   - Look for the "Settings" tab → "Networking" section
   - Your public URL will be displayed there

## 📚 Related Endpoints

- **Get Single Course**: `GET /api/v1/courses/:id`
- **Get Course Filters**: `GET /api/v1/courses/filters`
- **Get Learner Progress**: `GET /api/v1/courses/learners/:learnerId/progress`

## 🧪 Testing Checklist

- [ ] Request returns 200 OK
- [ ] Response includes `courses` array
- [ ] Response includes `pagination` object
- [ ] Search parameter filters courses correctly
- [ ] Level filter works correctly
- [ ] Pagination works correctly
- [ ] Sort parameter changes order

---

**Need Help?** Check the backend logs for error messages or review the `courses.controller.js` file for implementation details.

