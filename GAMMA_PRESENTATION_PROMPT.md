# Gamma Presentation Prompt: Course Builder Project Overview

Use this prompt in Gamma to create a professional 7-slide presentation:

**IMPORTANT: Keep slides minimal with words. Use visual diagrams, icons, and charts instead of lengthy text. Each slide should have maximum 3-4 bullet points or short phrases.**

---

## Presentation Title: "Course Builder Microservice"

Create a modern, professional presentation with the following 7 slides:

### Slide 1: Title & Overview
**Title:** Course Builder - AI-Powered Learning Management Microservice
**Subtitle:** Transforming Learning Paths into Structured, Personalized Courses
**Key Points (3-4 max):**
- AI-driven automatic course creation
- Structured learning paths (Topics → Modules → Lessons)
- Internal marketplace publishing
- Personalized learning experiences

### Slide 2: Problem & Vision
**Title:** The Challenge & Our Solution
**Content (Use visual split):**
**Problem (2-3 points max):**
- Manual course creation is time-consuming
- Lack of intelligent content enrichment
- Fragmented learning experience

**Vision (2-3 points max):**
- Automated course structure generation
- AI-powered content enrichment
- Seamless microservice integration

### Slide 3: Architecture Overview
**Title:** System Architecture
**Content (Use visual diagram):**
- **Backend:** Node.js + Express (Railway)
- **Frontend:** React 19 + Vite (Vercel)
- **Database:** PostgreSQL (Supabase)
- **AI:** Google Gemini AI
- **Integrations:** 8+ microservices

### Slide 4: AI-Powered Features
**Title:** Intelligent Automation
**Content (3 features max):**
- **AI Query Builder:** Dynamic SQL generation with Gemini AI
- **Smart Routing:** AI-powered request routing to handlers
- **Content Enrichment:** Automatic metadata and resource linking

### Slide 5: Core Workflows
**Title:** Key User Flows
**Content (Use flow diagrams):**
**1. Personalized Course Flow:**
- Learning path → Structure generation → AI enrichment → Marketplace → Enrollment → Completion

**2. Trainer-Driven Flow:**
- Trainer content → Validation → Enrichment → Publishing → Marketplace

**3. Learning Journey:**
- Discovery → Registration → Progress → Assessment → Feedback

### Slide 6: Database Schema & Data Model
**Title:** Data Architecture
**Content (Use schema diagram):**
**Core Tables (4-5 max):**
- `courses` - Course metadata
- `topics` → `modules` → `lessons` - Hierarchical structure
- `registrations` - Learner progress
- `feedback` - Ratings and comments
- `assessments` - Grades and results

### Slide 7: Integration Ecosystem
**Title:** Microservice Integrations
**Content (Use visual network diagram):**
**Connected Services (8 total):**
- Learner AI, Content Studio, Assessment
- Directory, Learning Analytics, HR
- DevLab, Skills

**Protocols:**
- REST + gRPC
- OAuth2 authentication

---

## Design Guidelines for Gamma:
- **Minimal text:** Maximum 3-4 bullet points per slide. Use visuals instead of words
- **Visual-first:** Diagrams, flowcharts, icons, and charts should be the primary content
- **Color scheme:** Modern, professional (emerald green accents matching the brand)
- **Diagrams:** Architecture diagrams, workflow charts, schema diagrams, network diagrams
- **Icons:** Use icons for microservices, tech stack, and features
- **Typography:** Consistent, clean, readable fonts with good spacing
- **Avoid:** Long paragraphs, excessive bullet points, code snippets
- **Audience:** Suitable for both technical and non-technical audiences

---

## Additional Notes:
- Focus on the most impressive features: AI-powered automation, microservice integration, and intelligent routing
- Emphasize the production-ready deployment on Railway and Vercel
- Highlight the comprehensive testing approach
- Show the end-to-end learning journey clearly
- Make it clear this is a working, deployed system, not just a concept

