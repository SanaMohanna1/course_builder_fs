import { GoogleGenerativeAI } from '@google/generative-ai';

let cachedClient = null;

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }



  if (!cachedClient) {
    cachedClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  return cachedClient;
};

const buildPrompt = ({ topicName, lessonName, description, skills }) => `
You are an expert course designer.
Given the following lesson information:
- Topic: ${topicName || 'N/A'}
- Lesson: ${lessonName || 'N/A'}
- Description: ${description || 'No description'}
- Skills: ${(skills && skills.length > 0 ? skills.join(', ') : 'None provided')}

Generate a structured JSON with:
{
  "summary": "A short 2–3 sentence overview of the lesson",
  "learning_objectives": ["...", "...", "..."],
  "examples": ["Example 1", "Example 2"],
  "difficulty": "Beginner | Intermediate | Advanced",
  "estimated_duration_minutes": number,
  "tags": ["optional tags"],
  "recommendations": ["optional follow-up recommendations"]
}
Make sure your response is valid JSON only. No extra text.
`;

const defaultEnrichment = {
  summary: 'Enrichment unavailable',
  learning_objectives: [],
  examples: [],
  difficulty: 'unknown',
  estimated_duration_minutes: null,
  tags: [],
  recommendations: []
};

const extractJsonPayload = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return null;
  }

  let cleaned = rawText.trim();

  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
  }

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    return null;
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
};

export async function enrichLesson({
  topicName,
  lessonName,
  description,
  skills = []
}) {
  const client = getGeminiClient();

  if (!client) {
    console.warn('AI enrichment skipped: GEMINI_API_KEY is not set.');
    return { ...defaultEnrichment };
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const prompt = buildPrompt({ topicName, lessonName, description, skills });
  console.log('Using Gemini model:', modelName);
  console.log('Client version:', GoogleGenerativeAI?.version || 'unknown');

  try {
    const model = client.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.();

    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const jsonPayload = extractJsonPayload(text);

    if (!jsonPayload) {
      throw new Error('Unable to locate JSON object in Gemini response');
    }

    const parsed = JSON.parse(jsonPayload);
    return {
      ...defaultEnrichment,
      ...parsed
    };
  } catch (error) {
    console.error(
      `Gemini enrichment failed using model "${modelName}":`,
      error
    );
    return { ...defaultEnrichment };
  }
}

export default {
  enrichLesson
};
