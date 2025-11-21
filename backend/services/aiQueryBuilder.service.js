/**
 * AI Query Builder Service
 * Uses AI (Gemini) to generate SQL SELECT queries based on payload and response template
 * 
 * IMPORTANT: This service does NOT make assumptions about payload/response structure.
 * It extracts meaning from the ACTUAL runtime request.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not found. AI query generation will fail.');
}

// Database schema information for AI context
const DB_SCHEMA_CONTEXT = `
Course Builder Database Schema (PostgreSQL):

Tables:
- courses: id, title, course_name, description, level, rating, status, course_type, created_by_user_id, metadata, created_at, updated_at
- topics: id, course_id, title, order_index
- modules: id, course_id, topic_id, title, order_index
- lessons: id, course_id, module_id, title, content, order_index, status
- feedback: id, learner_id, course_id, rating, comment, submitted_at
- enrollments: learner_id, course_id, enrolled_at, progress, status

Relationships:
- topics.course_id -> courses.id
- modules.course_id -> courses.id, modules.topic_id -> topics.id
- lessons.course_id -> courses.id, lessons.module_id -> modules.id
- feedback.course_id -> courses.id, feedback.learner_id -> learners.id
- enrollments.course_id -> courses.id, enrollments.learner_id -> learners.id

Common aggregations:
- COUNT(lessons.id) for total lessons
- AVG(feedback.rating) for average rating
- COUNT(enrollments.learner_id) for total enrollments
- SUM(CASE WHEN lessons.status = 'completed' THEN 1 ELSE 0 END) for completed lessons
`;

/**
 * Generate SQL query using AI based on payload and response template
 * @param {Object} payloadObject - Parsed payload from request
 * @param {Object} responseTemplate - Parsed response template showing what fields need to be filled
 * @returns {Promise<string>} - Generated SQL SELECT query
 */
export async function generateSQLQuery(payloadObject, responseTemplate) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured. Cannot generate SQL queries.');
  }

    try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build the prompt
    const prompt = buildQueryGenerationPrompt(payloadObject, responseTemplate);

    // Generate SQL query
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract SQL from response (may contain markdown code fences)
    const sqlQuery = extractSQLFromResponse(text);

    // Validate the query is SELECT only
    validateQueryIsSelectOnly(sqlQuery);

    return sqlQuery.trim();
  } catch (error) {
    console.error('[AI Query Builder] Error generating SQL query:', error);
    throw new Error(`Failed to generate SQL query: ${error.message}`);
  }
}

/**
 * Build prompt for AI to generate SQL query
 */
function buildQueryGenerationPrompt(payloadObject, responseTemplate) {
  const payloadStr = JSON.stringify(payloadObject, null, 2);
  const templateStr = JSON.stringify(responseTemplate, null, 2);

  return `You are the Course Builder SQL Generator.

Your ONLY job is to generate a SQL SELECT statement that retrieves all values needed to fill the response template.

CRITICAL RULES:
1. Output ONLY a SQL SELECT query - nothing else
2. Use ONLY Course Builder's database schema (provided below)
3. NEVER assume example data or hard-coded values
4. NEVER guess fields not present in the payload or template
5. Use parameter placeholders ($1, $2, etc.) for dynamic values from payload
6. The query must return exactly the fields needed to fill the response template

Database Schema:
${DB_SCHEMA_CONTEXT}

Payload (request parameters):
${payloadStr}

Response Template (fields that need to be filled):
${templateStr}

Generate a SQL SELECT query that:
- Uses fields from the payload to filter/join data (use parameter placeholders $1, $2, etc.)
- Returns columns that match the field names in the response template
- Use column aliases (AS) to match template field names if needed
- Only uses SELECT statements (no INSERT, UPDATE, DELETE)
- Uses PostgreSQL syntax
- Returns a single row with the exact fields needed
- Parameter placeholders should correspond to payload values in order:
  * $1 = first payload value needed (e.g., course_id)
  * $2 = second payload value needed (e.g., learner_id)
  * etc.

IMPORTANT: Use parameter placeholders ($1, $2, etc.) for any values that come from the payload.
Do NOT hard-code values - always use placeholders.

SQL Query:`;
}

/**
 * Extract SQL query from AI response (removes markdown code fences if present)
 */
function extractSQLFromResponse(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('AI response is empty or invalid');
  }

  // Remove markdown code fences
  let cleaned = text
    .replace(/^```sql\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  // Find the SQL query (between first SELECT and last semicolon or end of string)
  const selectIndex = cleaned.toUpperCase().indexOf('SELECT');
  if (selectIndex === -1) {
    throw new Error('No SELECT statement found in AI response');
  }

  // Extract from SELECT to the end
  let sql = cleaned.substring(selectIndex);

  // Remove trailing semicolon if present
  sql = sql.replace(/;?\s*$/, '').trim();

  return sql;
}

/**
 * Validate that the query is SELECT only (security check)
 */
function validateQueryIsSelectOnly(sqlQuery) {
  if (!sqlQuery || typeof sqlQuery !== 'string') {
    throw new Error('Invalid SQL query: query is empty');
  }

  const upperQuery = sqlQuery.toUpperCase().trim();

  // Check for dangerous keywords
  const dangerousKeywords = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'TRUNCATE', 'EXEC', 'EXECUTE'];
  
  for (const keyword of dangerousKeywords) {
    if (upperQuery.includes(keyword)) {
      throw new Error(`Security violation: Query contains forbidden keyword: ${keyword}`);
    }
  }

  // Must start with SELECT
  if (!upperQuery.startsWith('SELECT')) {
    throw new Error('Security violation: Query must be a SELECT statement');
  }

  // Check for semicolons that might allow multiple statements
  const semicolonCount = (sqlQuery.match(/;/g) || []).length;
  if (semicolonCount > 1) {
    throw new Error('Security violation: Query appears to contain multiple statements');
  }
}

export default {
  generateSQLQuery
};
